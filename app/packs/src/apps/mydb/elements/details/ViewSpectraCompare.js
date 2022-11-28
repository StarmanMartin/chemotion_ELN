import React from "react";
import { Modal, Well } from "react-bootstrap";
import SpectraActions from 'src/stores/alt/actions/SpectraActions';
import SpectraStore from 'src/stores/alt/stores/SpectraStore';

class ViewSpectraCompare extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...SpectraStore.getState(),
    };

    this.onChange = this.onChange.bind(this);
    this.getContent = this.getContent.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentDidMount() {
    SpectraStore.listen(this.onChange);
  }

  componentWillUnmount() {
    SpectraStore.unlisten(this.onChange);
  }

  onChange(newState) {
    const origState = this.state;
    this.setState({ ...origState, ...newState });
  }

  getContent() {
    console.log(this.state);
    const { elementData } = this.props;
    
  }

  renderEmpty() {
    const content = <Well onClick={this.closeOp}>
    <i className="fa fa-exclamation-triangle fa-3x" />
    <h3>No Spectra Found!</h3>
    <h3>Please refresh the page!</h3>
    <br />
    <h5>Click here to close the window...</h5>
  </Well>

    return (
      <div className="card-box">
        {content}
      </div>
    );
  }
  
  render() {
    const { showCompareModal, spectraCompare } = this.state;
    console.log(spectraCompare);

    this.getContent();

    return (
      <div className="compare-spectra-editor">
        <Modal
          show={showCompareModal}
        >
          {
            this.renderEmpty()
          }
        </Modal>
      </div>
    );
  }
}



export default ViewSpectraCompare;
