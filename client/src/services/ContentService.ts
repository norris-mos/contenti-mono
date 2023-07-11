import type {
  IEditorModel,
  IPlayerModel,
  IContentMetadata,
} from '@lumieducation/h5p-server';

export interface IContentListEntry {
  contentId: string;
  mainLibrary: string;
  title: string;
  originalNewKey?: string;
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
  prompt(
    prompt: string,
    contenttype: string
  ): Promise<{ contentId: string; metadata: IContentMetadata }>;
  generateDownloadLink(contentId: string): string;
}

export class ContentService implements IContentService {
  /**
   *
   */

  // THIS IS NORMALLU EMPTY
  constructor(protected baseUrl: string = 'http://localhost:8080/') {}

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
    console.log(`ContentService: Getting information to edit ${contentId}...`);
    const res = await fetch(`${this.baseUrl}/${contentId}/edit`);
    if (!res || !res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
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
  ): Promise<{ contentId: string; metadata: IContentMetadata }> => {
    console.log('Generating content...');

    const url = `http://localhost:8080/prompt/${contentType}`;

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: promptText,
    };

    console.log(requestOptions);

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        console.log('fetch is not working');
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json();
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
      console.log(`csrrf is ${this.csrfToken}`);
      console.log(`the content id is ${contentId} i think`);
      console.log(`ContentService: Savin content ${contentId}`);
    }

    const body = JSON.stringify(requestBody);
    console.log(body);

    const requestbod = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': this.csrfToken ?? '',
      },
      body: body,
    };
    console.log(requestbod);

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
