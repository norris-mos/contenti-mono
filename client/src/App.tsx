import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import ContentListComponent from './components/ContentListComponent';
import { ContentService } from './services/ContentService';
import Login from './components/Login';

import './App.css';
import { Col, Row } from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.contentService = new ContentService('http://localhost:8080/h5p');
  }

  private contentService: ContentService;

  render() {
    return (
      <div className="App pastel-pink">
        <Container>
          <Row>
            <Col>
              <h1>Contenti: AI assisted Content Generation</h1>
            </Col>
            <Col md="auto" className="m-2">
              <Login contentService={this.contentService} />
            </Col>
          </Row>
          <Alert variant="warning">
            This demo is for debugging and demonstration purposes only and not
            suitable for production use!
          </Alert>
          <ContentListComponent
            contentService={this.contentService}
          ></ContentListComponent>
        </Container>
      </div>
    );
  }
}
