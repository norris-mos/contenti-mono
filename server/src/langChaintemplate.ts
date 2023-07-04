const { OpenAI } = require('langchain/llms/openai');
import { PromptTemplate } from 'langchain/prompts';

const OPENAI_API_KEY = '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';

const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });

const res = await model.call(
  'What would be a good company name a company that makes colorful socks?'
);
console.log(res);
