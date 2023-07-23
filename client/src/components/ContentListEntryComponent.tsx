import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';

// want to add button ai button to generate new content and runs save on completion
// there will be a post request to h5p content file

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFingerprint,
  faBookOpen,
  faWindowClose,
  faSave,
  faCheck,
  faPlay,
  faPencilAlt,
  faFileDownload,
  faTrashAlt,
  faCopyright,
} from '@fortawesome/free-solid-svg-icons';

import { H5PEditorUI, H5PPlayerUI } from '@lumieducation/h5p-react';

import { IContentListEntry, IContentService } from '../services/ContentService';
import './ContentListEntryComponent.css';
import { runInNewContext, runInThisContext } from 'vm';

export default class ContentListEntryComponent extends React.Component<{
  contentService: IContentService;
  data: IContentListEntry;
  onDelete: (content: IContentListEntry) => void;
  onDiscard: (content: IContentListEntry) => void;
  onSaved: (data: IContentListEntry) => void;
  generateDownloadLink: (contentId: string) => string;
}> {
  constructor(props: {
    contentService: IContentService;
    data: IContentListEntry;
    onDiscard: (content: IContentListEntry) => void;
    onDelete: (content: IContentListEntry) => void;
    onSaved: (data: IContentListEntry) => void;

    generateDownloadLink: (contentId: string) => string;
  }) {
    super(props);
    this.state = {
      editing: props.data.contentId === 'new',
      playing: false,
      saving: false,
      saved: false,
      loading: true,
      saveErrorMessage: '',
      saveError: false,
      showingCustomCopyright: false,
      inputValue: 'Please select a content type to start',
      promptEdit: false,
    };
    this.h5pEditor = React.createRef();
    this.saveButton = React.createRef();
    this.h5pPlayer = React.createRef();
  }

  public state: {
    editing: boolean;
    loading: boolean;
    playing: boolean;
    saved: boolean;
    saving: boolean;
    saveError: boolean;
    saveErrorMessage: string;
    showingCustomCopyright: boolean;
    inputValue: string;
    promptEdit: boolean;
  };

  private h5pPlayer: React.RefObject<H5PPlayerUI>;
  private h5pEditor: React.RefObject<H5PEditorUI>;
  private saveButton: React.RefObject<HTMLButtonElement>;

  public render(): React.ReactNode {
    return (
      <ListGroupItem
        key={this.props.data.originalNewKey ?? this.props.data.contentId}
      >
        <Container>
          <Row>
            <Col className="p-2">
              <h5>{this.props.data.title}</h5>
              <Row className="small">
                <Col className="me-2" lg="auto">
                  <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                  {this.props.data.mainLibrary}
                </Col>
                <Col className="me-2" lg="auto">
                  <FontAwesomeIcon icon={faFingerprint} className="me-1" />
                  {this.props.data.contentId}
                </Col>
              </Row>
            </Col>
            {this.state.playing ? (
              <Col className="p-2" lg="auto">
                <Button variant="light" onClick={() => this.close()}>
                  <FontAwesomeIcon icon={faWindowClose} className="me-2" />
                  close player
                </Button>
              </Col>
            ) : undefined}
            {this.state.playing &&
            this.h5pPlayer.current?.hasCopyrightInformation() ? (
              <Col className="p-2" lg="auto">
                <Dropdown>
                  <Dropdown.Toggle variant="light">
                    <span>
                      <FontAwesomeIcon icon={faCopyright} className="me-2" />
                      Copyright
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        this.showCopyrightCustom();
                      }}
                    >
                      Show in custom dialog
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        this.showCopyrightNative();
                      }}
                    >
                      Show in native H5P dialog
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            ) : undefined}
            {this.state.editing ? (
              <Col className="p-2" lg="auto">
                <Overlay
                  target={this.saveButton.current}
                  show={this.state.saveError}
                  placement="right"
                >
                  <Tooltip id="error-tooltip">
                    {this.state.saveErrorMessage}
                  </Tooltip>
                </Overlay>
                <Button
                  ref={this.saveButton}
                  variant="primary"
                  className={
                    this.state.saving || this.state.loading ? 'disabled' : ''
                  }
                  disabled={this.state.saving || this.state.loading}
                  onClick={() => this.save()}
                >
                  {this.state.saving ? (
                    <div
                      className="spinner-border spinner-border-sm m-1 align-middle"
                      role="status"
                    ></div>
                  ) : (
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                  )}{' '}
                  save{' '}
                  {this.state.saved ? (
                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                  ) : undefined}
                </Button>
              </Col>
            ) : undefined}
            {this.state.editing && !this.isNew() ? (
              <Col className="p-2" lg="auto">
                <Button variant="light" onClick={() => this.close()}>
                  <FontAwesomeIcon icon={faWindowClose} className="me-2" />
                  close editor
                </Button>
              </Col>
            ) : undefined}
            {this.state.editing && this.isNew() ? (
              <Col className="p-2" lg="auto">
                <Button
                  variant="light"
                  onClick={() => this.props.onDiscard(this.props.data)}
                >
                  <FontAwesomeIcon icon={faWindowClose} className="me-2" />
                  discard
                </Button>
              </Col>
            ) : undefined}
            {!this.isNew() ? (
              <React.Fragment>
                <Col className="p-2" lg="auto">
                  <Button variant="success" onClick={() => this.play()}>
                    <FontAwesomeIcon icon={faPlay} className="me-2" />
                    play
                  </Button>
                </Col>
                <Col className="p-2" lg="auto">
                  <Button variant="secondary" onClick={() => this.edit()}>
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    edit
                  </Button>
                </Col>{' '}
                <Col className="p-2" lg="auto">
                  <a
                    href={this.props.generateDownloadLink(
                      this.props.data.contentId
                    )}
                  >
                    <Button variant="info">
                      <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                      download
                    </Button>
                  </a>
                </Col>
                <Col className="p-2" lg="auto">
                  <Button
                    variant="danger"
                    onClick={() => this.props.onDelete(this.props.data)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                    delete
                  </Button>
                </Col>
              </React.Fragment>
            ) : undefined}
          </Row>
        </Container>
        {this.state.editing ? (
          <div
            className={
              this.props.data.contentId !== 'new' && this.state.loading
                ? 'loading'
                : ''
            }
          >
            <div className="h5p-input-container">
              <H5PEditorUI
                key={this.state.promptEdit ? 'promptEdit' : 'regularEdit'}
                ref={this.h5pEditor}
                contentId={this.props.data.contentId}
                loadContentCallback={this.props.contentService.getEdit}
                saveContentCallback={this.props.contentService.save}
                onSaved={this.onSaved}
                onLoaded={this.onEditorLoaded}
                onSaveError={this.onSaveError}
              />

              <div className="input-wrapper">
                <textarea
                  id="chatbox"
                  name="gpt"
                  className="input"
                  value={this.state.inputValue}
                  onChange={(event) =>
                    this.setState({ inputValue: event.target.value })
                  }
                  onFocus={(event) => this.setState({ inputValue: '' })}
                />

                <button
                  className="generate-button"
                  onClick={() => this.prompt(this.state.inputValue)}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        ) : undefined}
        {this.state.playing ? (
          <div className={this.state.loading ? 'loading' : ''}>
            <H5PPlayerUI
              ref={this.h5pPlayer}
              contentId={this.props.data.contentId}
              loadContentCallback={this.props.contentService.getPlay}
              onInitialized={this.onPlayerInitialized}
              onxAPIStatement={(statement: any, context: any, event) =>
                console.log(statement, context, event)
              }
            />
            <div
              style={{
                visibility: this.state.loading ? 'visible' : 'collapse',
              }}
              className="spinner-border spinner-border-sm m-2"
              role="status"
            ></div>
          </div>
        ) : undefined}
        <Modal show={this.state.showingCustomCopyright}>
          <Modal.Header>
            <Modal.Title>Copyright information</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  this.h5pPlayer.current?.getCopyrightHtml() ??
                  'No copyright information',
              }}
            ></div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                this.closeCopyrightCustom();
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </ListGroupItem>
    );
  }

  protected play() {
    this.setState({ editing: false, playing: true });
  }

  protected clearInput(element: HTMLInputElement) {
    if (element.value === 'Describe what activity you would like to make')
      element.value = '';
  }
  protected edit() {
    this.setState({ editing: true, playing: false });
  }

  protected close() {
    this.setState({ editing: false, playing: false });
  }

  protected showCopyrightCustom() {
    this.setState({ showingCustomCopyright: true });
  }

  protected closeCopyrightCustom() {
    this.setState({ showingCustomCopyright: false });
  }

  protected showCopyrightNative() {
    this.h5pPlayer.current?.showCopyright();
  }

  private onPlayerInitialized = () => {
    this.setState({ loading: false });
  };

  protected async save() {
    this.setState({ saving: true });
    try {
      const returnData = await this.h5pEditor.current?.save();
      if (returnData) {
        await this.props.onSaved({
          contentId: returnData.contentId,
          mainLibrary: returnData.metadata.mainLibrary,
          title: returnData.metadata.title,
          originalNewKey: this.props.data.originalNewKey,
        });
      }
    } catch (error) {
      // We ignore the error, as we subscribe to the 'save-error' and
      // 'validation-error' events.
    }
  }

  // currently working on the prompting backend...
  // Need to build a this.prompt() method for the onClick response within the
  //generate button. This will call a method from the content service.
  // the method in the content service will send a post request to the server
  // the server will have an endpoint that accepts text and a content type.

  // get an error box to pop up. add the save() function to the output of the prompt
  protected async prompt(prompt: string) {
    const ctype =
      this.h5pEditor.current?.h5pEditor?.current?.editorInstance?.selector
        ?.currentLibrary;

    if (!ctype) {
      console.log('No content type has been selected');
    } else {
      console.log(`${ctype} has successfully been selected`);
      const res = await this.props.contentService.prompt(prompt, ctype);
      if (res) {
        this.props.onSaved({
          contentId: res.contentId,
          mainLibrary: res.metadata.mainLibrary,
          title: res.metadata.title,
          originalNewKey: this.props.data.originalNewKey,
        });
        this.setState({ promptEdit: true });

        console.log('data object created successfully ');
      }
    }
  }

  protected onSaveError = async (event: any) => {
    this.setState({
      saving: false,
      saved: false,
      saveError: true,
      saveErrorMessage: 'this doesnt work', // event.detail.message,
    });
    setTimeout(() => {
      this.setState({
        saveError: false,
      });
    }, 5000);
  };

  // NOTE that this onSaved is diferent
  protected onSaved = async (event: any) => {
    this.setState({
      saving: false,
      saved: true,
    });
    setTimeout(() => {
      this.setState({ saved: false });
    }, 3000);
  };

  protected onEditorLoaded = () => {
    this.setState({ loading: false });

    const selectedElement = this.props.data.mainLibrary;
    console.log(selectedElement);
    this.setState({
      inputValue: `You have selected ${selectedElement}. What type of ${selectedElement} would you like to create`,
    });
  };

  private isNew() {
    return this.props.data.contentId === 'new';
  }
}
