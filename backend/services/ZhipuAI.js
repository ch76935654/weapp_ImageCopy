import dotenv from "dotenv";
import { ZhipuAI } from "zhipuai-sdk-nodejs-v4";

dotenv.config();

const myZhipu=new ZhipuAI({
    apiKey: process.env.API_KEY,
  });

async function createEmbeddingsByZhipuAI(question) {
  const result = await myZhipu.createEmbeddings({
    model: "embedding-2",
    input: question,
  });
  const embedding = result.data[0].embedding;
  console.log(embedding, "embedding");
  return embedding;
}

// 图像生成
async function createIamgeByZhipuAI(question) {
  const result = await myZhipu.createImages({
    model: "cogview-3",
    prompt: question,
  });
  console.log(result.data, "image url list");
}

//文本生成
async function createCompletionsByZhipuAI(text) {
  const data = await myZhipu.createCompletions({
    model: "glm-4",
    messages: [{ role: "user", content: text }],
    stream: false,
  });
  const result = data.choices[0].message.content;
  console.log(result, "message");
  return result;
}


async function imageUnderstandByZhipuAI(image64,mode) {
    let question="";
    switch (Number(mode)) {
        case 0:
            question="根据图中内容，为我写出一言金句";
            break;
        case 1:
            question="根据图中内容，为我写一份小红书文案";
            break;
        case 2:
            question="根据图中内容，为我写一份闲鱼发布文案";
            break;
        case 3:
            question="根据图中内容，为我写一份外卖好评文案";
            break;
        case 4:
            question="根据图中内容，为我写一份夸夸文案";
            break;
        default:
            question="根据图中内容，为我写出一言金句";
            break;
      }
  const data = await myZhipu.createCompletions({
    model: "glm-4v",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: question
        },
        {
          type: "image_url",
          image_url: {
            url: image64
          }
        }
      ]
    }],
    stream: false,
  });
  const result = data.choices[0].message.content;
  console.log(result, "message");
  return result;
}

export {
  createCompletionsByZhipuAI,
  createIamgeByZhipuAI,
  createEmbeddingsByZhipuAI,
  imageUnderstandByZhipuAI,
};