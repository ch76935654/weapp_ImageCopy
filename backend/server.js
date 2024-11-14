import express from "express";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import {imageUnderstandByZhipuAI} from "./services/ZhipuAI.js";
const app = express();

// 配置 multer 保存上传的文件到磁盘
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 指定上传文件的保存路径
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 限制文件大小为 10MB
});

app.post('/upload', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    try {
        const file = req.file;
        const mode = req.body.mode; // 获取 mode 参数
        console.log("Selected Mode:", mode);

        // 读取文件并转换为 Base64
        const base64Image = fs.readFileSync(file.path, { encoding: 'base64' });
        console.log(base64Image.slice(0, 100));
        
        const reply = await imageUnderstandByZhipuAI(base64Image, mode); // 将 mode 传递给处理函数（如果需要）
        
        // 删除临时文件
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Failed to delete temporary file:', err);
            }
        });

        res.send({ base64Image: base64Image, reply: reply });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
