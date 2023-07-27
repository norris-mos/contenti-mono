import React from 'react';
import Button from 'react-bootstrap/Button';
import './LabelsMetadataComponent.css';

interface LabelState {
  showLabels2: boolean;
  labelsSelected: string[];
  newLabel: string; // State variable to store selected labels
  newComment;
}

export default class Label extends React.Component<any, LabelState> {
  state: LabelState = {
    showLabels2: false,
    labelsSelected: [],
    newLabel: '',
    newComment: '', // State variable to store selected labels
  };

  // Method to handle showing the LabelsComponent
  protected showLabelsComponent = () => {
    this.setState({ showLabels2: true });
  };

  protected handleNewLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newLabel: event.target.value });
  };

  // Method to handle selecting/deselecting labels
  protected handleLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    if (checked) {
      // If the label is checked, add it to the selected labels
      this.setState((prevState) => ({
        labelsSelected: [...prevState.labelsSelected, value],
      }));
    } else {
      // If the label is unchecked, remove it from the selected labels
      this.setState((prevState) => ({
        labelsSelected: prevState.labelsSelected.filter(
          (label) => label !== value
        ),
      }));
    }
  };

  // Method to handle saving the selected labels
  protected saveLabels = () => {
    // Process and save the selected labels here
    // For example, you can store them in the component's state or call a service to save them
    console.log(this.state.labelsSelected); // Print selected labels for demonstration
    this.setState({ showLabels2: false });
  };

  protected addNewLabel = () => {
    const { newLabel, labelsSelected } = this.state;
    if (newLabel.trim() !== '') {
      this.setState({
        labelsSelected: [...labelsSelected, newLabel],
        newLabel: '',
      });
    }
  };

  protected removeLabel = (label: string) => {
    this.setState((prevState) => ({
      labelsSelected: prevState.labelsSelected.filter((l) => l !== label),
    }));
  };

  protected handleNewCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ newComment: event.target.value });
  };

  // Add the render method
  render() {
    return <div>{this.LabelsComponent()}</div>;
  }

  // Move the LabelsComponent method outside the render method
  protected LabelsComponent = () => {
    return (
      <div className="labels-container">
        {/* Your label selection component code here */}
        {/* For example, you can use a form with checkboxes */}

        <div className="input-form-container">
          <h5>Choose Labels:</h5>
          <input
            className="input-form"
            type="text"
            value={this.state.newLabel}
            onChange={this.handleNewLabelChange}
            placeholder="Enter a new label"
          />
          <Button
            className="add-label-btn"
            variant="primary"
            onClick={this.addNewLabel}
          >
            Add Label
          </Button>
          <div className="label-tags">
            {this.state.labelsSelected.map((label) => (
              <div key={label} className="label-tag">
                <span>{label}</span>
                {/* Use an SVG icon for the discard cross */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                  onClick={() => this.removeLabel(label)}
                >
                  <path d="M5.293 5.293a1 1 0 0 1 1.414 0L8 6.586l1.293-1.293a1 1 0 1 1 1.414 1.414L9.414 8l1.293 1.293a1 1 0 0 1-1.414 1.414L8 9.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L6.586 8 5.293 6.707a1 1 0 0 1 0-1.414z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="comments-container">
          <h5>Add Comments</h5>
          <textarea
            className="comment-input"
            value={this.state.newComment}
            onChange={this.handleNewCommentChange}
            placeholder="Enter a new comment"
            rows={6} // Set the initial number of rows
            cols={150} // Set the initial number of columns
          />
        </div>

        {/* Add more labels as needed */}
        {/* Add a button to save the labels */}
        <Button
          className="save-button"
          variant="primary"
          onClick={this.saveLabels}
        >
          Save Changes
        </Button>
      </div>
    );
  };
}
