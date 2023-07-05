import * as dotenv from 'dotenv';
import { OpenAI } from 'langchain';

export function buildModel(): OpenAI {
  dotenv.config();

  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  return model;
}
