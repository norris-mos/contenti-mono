import type {
  IEditorModel,
  IPlayerModel,
  IContentMetadata,
} from '@lumieducation/h5p-server';
import { json } from 'stream/consumers';

export interface IContentListEntry {
  contentId: string;
  mainLibrary: string;
  title: string;
  originalNewKey?: string;
}

interface IPromptResponses {
  p1: Promise<{ contentId: string; metadata: IContentMetadata }>;
  p2: Promise<{ contentId: string; metadata: IContentMetadata }>;
}

export interface IContentService {
  delete(contentId: string): Promise<void>;
  getEdit(contentId: string): Promise<IEditorModel>;
  getPlay(contentId: string): Promise<IPlayerModel>;
  list(): Promise<IContentListEntry[]>;
  save(
    contentId: string,
    requestBody: { library: string; params: any }
  ): Promise<{ contentId: string; metadata: IContentMetadata }>;
  prompt(prompt: string, contenttype: string): Promise<IPromptResponses>;
  generateDownloadLink(contentId: string): string;
}

export class ContentService implements IContentService {
  /**
   *
   */

  // THIS IS NORMALLU EMPTY
  constructor(protected baseUrl: string = 'http://server:8080/') {}

  private csrfToken: string | undefined = undefined;

  delete = async (contentId: string): Promise<void> => {
    console.log(`ContentService: deleting ${contentId}...`);
    const result = await fetch(`${this.baseUrl}/${contentId}`, {
      method: 'delete',
      headers: {
        'CSRF-Token': this.csrfToken ?? '',
      },
    });
    if (!result.ok) {
      throw new Error(
        `Error while deleting content: ${result.status} ${
          result.statusText
        } ${await result.text()}`
      );
    }
  };

  getEdit = async (contentId: string): Promise<IEditorModel> => {
    console.log('is this evening updating');
    console.log(`ContentService: Getting information to edit ${contentId}...`);

    console.log(`${this.baseUrl}/${contentId}/edit`);
    const res = await fetch(`${this.baseUrl}/${contentId}/edit`);

    if (!res || !res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log(res.json);
    return res.json();
  };

  getPlay = async (contentId: string): Promise<IPlayerModel> => {
    console.log(`ContentService: Getting information to play ${contentId}...`);
    console.log(`${this.baseUrl}/${contentId}/play`);
    const res = await fetch(`${this.baseUrl}/${contentId}/play`);
    if (!res || !res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };

  list = async (): Promise<IContentListEntry[]> => {
    console.log(`ContentService: Listing content objects`);
    const result = await fetch(this.baseUrl);
    if (result.ok) {
      return result.json();
    }
    throw new Error(
      `Request to REST endpoint returned ${result.status} ${
        result.statusText
      }: ${await result.text()}`
    );
  };

  // Just need to be careful about the base url not redirecting the /h5p/prompt

  prompt = async (
    promptText: string,
    contentType: string
  ): Promise<IPromptResponses> => {
    console.log('Generating content...');
    const content_type = 'H5P.DragText%201.10';
    console.log('ctpe is ', contentType);

    //const url = `http://localhost:8080/h5p/prompt/${content_type}`;
    const url = `http://localhost:8080/prompt/${content_type}`;

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promptText, content_type }),
    };

    try {
      console.log('this is were it breaks down: Requst opt', requestOptions);

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        console.log('fetch is not working');
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const responseJSON = await response.json();
      //console.log('here is the response body object');
      //console.log('content type', contentType);
      //console.log('response from langchain', responseJSON);
      //this.save(undefined);
      //console.log('here is the responseJSON', responseJSON.model);

      const promptSaveModel = responseJSON.model;
      const promptSaveModel2 = responseJSON.model1;
      console.log('response2', promptSaveModel2);

      // const promptSave: { contentId: string; metadata: IContentMetadata } = {
      //   contentId: promptSaveModel.contentId,
      //   metadata: promptSaveModel.metadata,
      // };

      // const promptSave2: { contentId: string; metadata: IContentMetadata } = {
      //   contentId: promptSaveModel2.contentId,
      //   metadata: promptSaveModel2.metadata,
      // };

      const saveMethod = await this.save('', promptSaveModel);

      const saveMethod2 = await this.save('', promptSaveModel2);
      console.log('constent id of 1', saveMethod2.contentId);
      console.log('content id of 2', saveMethod.contentId);
      // const saveMethod2 = await this.save(
      //   saveMethod.contentId + 'M2',
      //   promptSaveModel2
      // );
      console.log('save two doesnt');
      const responses: IPromptResponses = {
        p1: Promise.resolve(saveMethod),
        p2: Promise.resolve(saveMethod2),
      };
      //const promptEdit = this.getEdit(promptSave.contentId);

      return responses;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  save = async (
    contentId: string,
    requestBody: { library: string; params: any }
  ): Promise<{ contentId: string; metadata: IContentMetadata }> => {
    if (contentId) {
      console.log(`ContentService: Saving new content.`);
    } else {
      console.log(`the content id is ${contentId} i think`);
      console.log(`ContentService: Savin content ${contentId}`);
    }

    const body = JSON.stringify(requestBody);
    //console.log('this is the content id', contentId);
    const requestbod = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': this.csrfToken ?? '',
      },
      body: body,
    };
    //console.log(requestbod);

    const res = contentId
      ? await fetch(`${this.baseUrl}/${contentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': this.csrfToken ?? '',
          },
          body,
        })
      : await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': this.csrfToken ?? '',
          },
          //credentials: 'include',
          body,
        });

    if (!res || !res.ok) {
      throw new Error(`${res.status} ${res.statusText} - ${await res.text()}`);
    }

    // add db save here

    return res.json();
  };
  generateDownloadLink = (contentId: string): string =>
    `${this.baseUrl}/download/${contentId}`;

  setCsrfToken = (csrfToken: string | undefined): void => {
    this.csrfToken = csrfToken;
  };
  getCsrfToken = (): string | undefined => {
    return this.csrfToken;
  };
}
