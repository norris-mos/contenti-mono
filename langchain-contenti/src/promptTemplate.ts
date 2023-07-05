import { LLMChain } from 'langchain';
import { PromptTemplate } from 'langchain/prompts';
import { buildModel } from './index';

const model = buildModel();

const template =
  'You are a {grade} grade teacher writing a {excercise} on {Topic}. Come up with some potential examples';

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ['grade', 'excercise', 'Topic'],
});

const chain = new LLMChain({ llm: model, prompt: prompt });

const res = await chain.call({
  grade: 'fourth',
  excercise: 'MCQ',
  Topic: 'berries',
});

console.log(res);
