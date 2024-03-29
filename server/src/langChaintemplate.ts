const { OpenAI } = require('langchain/llms/openai');
import type {
  IEditorModel,
  IPlayerModel,
  IContentMetadata,
} from '@lumieducation/h5p-server';

import { StructuredOutputParser } from 'langchain/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

const OPENAI_API_KEY = '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';
const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });
const model1 = new OpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.9,
  modelName: 'gpt-3.5-turbo',
});

export async function H5PDragText(prompt: string) {
  // For chat models, we provide a `ChatPromptTemplate` class that can be used to format chat prompts.

  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    textField:
      'the drag and drop excercise, should be the sentence with the missing words between the asterisks',
    description: 'description of the drag and drop excercise',
  });

  const formatInstructions = parser.getFormatInstructions();

  const promptTwo = new PromptTemplate({
    template:
      "Embody an AI Teaching Assistant, responsible for crafting engaging educational resources. Your current task involves generating an interactive drag-and-drop exercise, where students fill in missing keywords denoted by asterisks. For instance, consider the example: 'Blueberries are *blue*. *Strawberries* are red. *Cloudberries* are orange.' Here, students are required to drag and drop the correct words where the asterisks are placed. Your task is to develop a similar exercise following the guidelines of a user-provided prompt, ensuring the missing words in your exercise are clearly marked with asterisks. \n{format_instructions}\n{user_prompt}",
    inputVariables: ['user_prompt'],
    partialVariables: { format_instructions: formatInstructions },
  });

  const input = await promptTwo.format({
    user_prompt: prompt,
  });

  // this is for model 1
  const modelResponse = await model.call(input);
  const startIndex = modelResponse.indexOf('{');
  const endIndex = modelResponse.lastIndexOf('}') + 1;
  const jsonObjectString = modelResponse.substring(startIndex, endIndex);
  const parsedOutput = JSON.parse(jsonObjectString);

  // this is for model 2
  const modelResponse1 = await model1.call(input);
  const startIndex1 = modelResponse1.indexOf('{');
  const endIndex1 = modelResponse1.lastIndexOf('}') + 1;
  const jsonObjectString1 = modelResponse1.substring(startIndex1, endIndex1);
  const parsedOutput1 = JSON.parse(jsonObjectString1);

  // const textField = parsedOutput.properties.textField;
  // const description = parsedOutput.properties.description;
  //console.log(modelResponse);
  //console.log(parsedOutput.textField);
  //console.log(textField);
  console.log(parsedOutput);

  const params = {
    taskDescription: `<p>${parsedOutput.description}</p>\n`,
    checkAnswer: 'Check',
    tryAgain: 'Retry',
    showSolution: 'Show Solution',
    behaviour: {
      enableRetry: true,
      enableSolutionsButton: true,
      instantFeedback: false,
      enableCheckButton: true,
    },
    textField: parsedOutput.textField,
    overallFeedback: [
      { from: 0, to: 100, feedback: 'Score: @score of @total.' },
    ],
    dropZoneIndex: 'Drop Zone @index.',
    empty: 'Drop Zone @index is empty.',
    contains: 'Drop Zone @index contains draggable @draggable.',
    tipLabel: 'Show tip',
    correctText: 'Correct!',
    incorrectText: 'Incorrect!',
    resetDropTitle: 'Reset drop',
    resetDropDescription: 'Are you sure you want to reset this drop zone?',
    grabbed: 'Draggable is grabbed.',
    cancelledDragging: 'Cancelled dragging.',
    correctAnswer: 'Correct answer:',
    feedbackHeader: 'Feedback',
    scoreBarLabel: 'You got :num out of :total points',
    media: { disableImageZooming: false },
    submitAnswer: 'Submit',
    ariaDraggableIndex: '@index of @count draggables.',
    a11yCheck:
      'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
    a11yShowSolution:
      'Show the solution. The task will be marked with its correct solution.',
    a11yRetry:
      'Retry the task. Reset all responses and start the task over again.',
  };
  const metadata = {
    embedTypes: ['iframe'],
    language: 'en',
    defaultLanguage: 'en-GB',
    license: 'U',
    extraTitle: prompt,
    title: prompt,
    mainLibrary: 'H5P.DragText',
    preloadedDependencies: [
      { machineName: 'FontAwesome', majorVersion: 4, minorVersion: 5 },
      { machineName: 'jQuery.ui', majorVersion: 1, minorVersion: 10 },
      { machineName: 'H5P.JoubelUI', majorVersion: 1, minorVersion: 3 },
      { machineName: 'H5P.Transition', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.FontIcons', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.Question', majorVersion: 1, minorVersion: 5 },
      { machineName: 'H5P.DragText', majorVersion: 1, minorVersion: 10 },
    ],
  };

  const params1 = {
    taskDescription: `<p>${parsedOutput1.description}</p>\n`,
    checkAnswer: 'Check',
    tryAgain: 'Retry',
    showSolution: 'Show Solution',
    behaviour: {
      enableRetry: true,
      enableSolutionsButton: true,
      instantFeedback: false,
      enableCheckButton: true,
    },
    textField: parsedOutput1.textField,
    overallFeedback: [
      { from: 0, to: 100, feedback: 'Score: @score of @total.' },
    ],
    dropZoneIndex: 'Drop Zone @index.',
    empty: 'Drop Zone @index is empty.',
    contains: 'Drop Zone @index contains draggable @draggable.',
    tipLabel: 'Show tip',
    correctText: 'Correct!',
    incorrectText: 'Incorrect!',
    resetDropTitle: 'Reset drop',
    resetDropDescription: 'Are you sure you want to reset this drop zone?',
    grabbed: 'Draggable is grabbed.',
    cancelledDragging: 'Cancelled dragging.',
    correctAnswer: 'Correct answer:',
    feedbackHeader: 'Feedback',
    scoreBarLabel: 'You got :num out of :total points',
    media: { disableImageZooming: false },
    submitAnswer: 'Submit',
    ariaDraggableIndex: '@index of @count draggables.',
    a11yCheck:
      'Check the answers. The responses will be marked as correct, incorrect, or unanswered.',
    a11yShowSolution:
      'Show the solution. The task will be marked with its correct solution.',
    a11yRetry:
      'Retry the task. Reset all responses and start the task over again.',
  };
  const metadata1 = {
    embedTypes: ['iframe'],
    language: 'en',
    defaultLanguage: 'en-GB',
    license: 'U',
    extraTitle: prompt,
    title: prompt,
    mainLibrary: 'H5P.DragText',
    preloadedDependencies: [
      { machineName: 'FontAwesome', majorVersion: 4, minorVersion: 5 },
      { machineName: 'jQuery.ui', majorVersion: 1, minorVersion: 10 },
      { machineName: 'H5P.JoubelUI', majorVersion: 1, minorVersion: 3 },
      { machineName: 'H5P.Transition', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.FontIcons', majorVersion: 1, minorVersion: 0 },
      { machineName: 'H5P.Question', majorVersion: 1, minorVersion: 5 },
      { machineName: 'H5P.DragText', majorVersion: 1, minorVersion: 10 },
    ],
  };

  const toSave = {
    model: {
      library: 'H5P.DragText 1.10',
      params: { params, metadata },
    },
    model1: {
      library: 'H5P.DragText 1.10',
      params: { params, metadata },
    },
  };
  //console.log(toSave.model);
  console.log(toSave.model1);
  return toSave;

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
