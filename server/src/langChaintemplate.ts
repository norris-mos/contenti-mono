const { OpenAI } = require('langchain/llms/openai');

import { StructuredOutputParser } from 'langchain/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

const OPENAI_API_KEY = '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';
const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });

export async function H5PDragText(prompt: string) {
  // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.
  console.log('this is the prompt', prompt);
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    textField:
      'the drag and drop excercise, should be the sentence with the missing words between the asterisks',
    description: 'description of the drag and drop excercise',
  });

  // const DandDTemplate = `{
  //   "taskDescription": "<p>{description}</p>\n",
  //   "checkAnswer": "Check",
  //   "tryAgain": "Retry",
  //   "showSolution": "Show Solution",
  //   "behaviour": {
  //     "enableRetry": true,
  //     "enableSolutionsButton": true,
  //     "instantFeedback": false,
  //     "enableCheckButton": true
  //   },
  //   "textField": "{textField}",
  //   "overallFeedback": [
  //     { "from": 0, "to": 100, "feedback": "Score: @score of @total." }
  //   ],
  //   "dropZoneIndex": "Drop Zone @index.",
  //   "empty": "Drop Zone @index is empty.",
  //   "contains": "Drop Zone @index contains draggable @draggable.",
  //   "tipLabel": "Show tip",
  //   "correctText": "Correct!",
  //   "incorrectText": "Incorrect!",
  //   "resetDropTitle": "Reset drop",
  //   "resetDropDescription": "Are you sure you want to reset this drop zone?",
  //   "grabbed": "Draggable is grabbed.",
  //   "cancelledDragging": "Cancelled dragging.",
  //   "correctAnswer": "Correct answer:",
  //   "feedbackHeader": "Feedback",
  //   "scoreBarLabel": "You got :num out of :total points",
  //   "media": { "disableImageZooming": false },
  //   "submitAnswer": "Submit",
  //   "ariaDraggableIndex": "@index of @count draggables.",
  //   "a11yCheck": "Check the answers. The responses will be marked as correct, incorrect, or unanswered.",
  //   "a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
  //   "a11yRetry": "Retry the task. Reset all responses and start the task over again."
  // }
  // `, inputVariables: [];

  const formatInstructions = parser.getFormatInstructions();

  const promptTwo = new PromptTemplate({
    template:
      "Embody an AI Teaching Assistant, responsible for crafting engaging educational resources. Your current task involves generating an interactive drag-and-drop exercise, where students fill in missing keywords denoted by asterisks. For instance, consider the example: 'Blueberries are blue. Strawberries are red. Cloudberries are orange.' Here, students are required to drag and drop the correct words where the asterisks are placed. Your task is to develop a similar exercise following the guidelines of a user-provided prompt, ensuring the missing words in your exercise are clearly marked with asterisks. \n{format_instructions}\n{user_prompt}",
    inputVariables: ['user_prompt'],
    partialVariables: { format_instructions: formatInstructions },
  });

  const input = await promptTwo.format({
    user_prompt: prompt,
  });

  const modelResponse = await model.call(input);
  const parsedOutput = JSON.parse(modelResponse);
  const textField = parsedOutput.properties.textField;
  const description = parsedOutput.properties.description;

  console.log(textField);
  console.log(description);

  // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(
  //     "Embody an AI Teaching Assistant, responsible for crafting engaging educational resources. Your current task involves generating an interactive drag-and-drop exercise, where students fill in missing keywords denoted by asterisks. For instance, consider the example: 'Blueberries are blue. Strawberries are red. Cloudberries are orange.' Here, students are required to drag and drop the correct words where the asterisks are placed. Your task is to develop a similar exercise following the guidelines of a user-provided prompt, ensuring the missing words in your exercise are clearly marked with asterisks."
  //   ),
  //   HumanMessagePromptTemplate.fromTemplate('{text}'),
  // ]);

  // // // The result can be formatted as a string using the `format` method.
  // const responseC = await chatPrompt.format({
  //   text: prompt,
  // });

  // const modelResponse = await model.call(responseC);

  //console.log({ responseC });

  //return modelResponse;
}

//   const primer = `You are a teaching assistant AI that helps teachers generate educational content.
// you need to help generate a drag and drop excercise description and task content. The description should be a text string
// explaining the task at hand. The task should have a structure similar to the strawberry example: Blueberries are *blue:Check the name of the berry!*.Strawberries are *red*.Cloudberries are *orange*. Where
// the asterisk word asterisk are the missing words.
// `;

// const template = `{
//   "taskDescription": "<p>{description}</p>\n",
//   "checkAnswer": "Check",
//   "tryAgain": "Retry",
//   "showSolution": "Show Solution",
//   "behaviour": {
//     "enableRetry": true,
//     "enableSolutionsButton": true,
//     "instantFeedback": false,
//     "enableCheckButton": true
//   },
//   "textField": "Blueberries are *blue:Check the name of the berry!*.\nStrawberries are *red*.\nCloudberries are *orange*.",
//   "overallFeedback": [
//     { "from": 0, "to": 100, "feedback": "Score: @score of @total." }
//   ],
//   "dropZoneIndex": "Drop Zone @index.",
//   "empty": "Drop Zone @index is empty.",
//   "contains": "Drop Zone @index contains draggable @draggable.",
//   "tipLabel": "Show tip",
//   "correctText": "Correct!",
//   "incorrectText": "Incorrect!",
//   "resetDropTitle": "Reset drop",
//   "resetDropDescription": "Are you sure you want to reset this drop zone?",
//   "grabbed": "Draggable is grabbed.",
//   "cancelledDragging": "Cancelled dragging.",
//   "correctAnswer": "Correct answer:",
//   "feedbackHeader": "Feedback",
//   "scoreBarLabel": "You got :num out of :total points",
//   "media": { "disableImageZooming": false },
//   "submitAnswer": "Submit",
//   "ariaDraggableIndex": "@index of @count draggables.",
//   "a11yCheck": "Check the answers. The responses will be marked as correct, incorrect, or unanswered.",
//   "a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
//   "a11yRetry": "Retry the task. Reset all responses and start the task over again."
// }
// `;
