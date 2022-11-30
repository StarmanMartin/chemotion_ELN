import React from "react";
import { Button, Modal, Well } from "react-bootstrap";
import SpectraActions from 'src/stores/alt/actions/SpectraActions';
import SpectraStore from 'src/stores/alt/stores/SpectraStore';
import { SpectraEditor, FN } from '@complat/react-spectra-editor';

class ViewSpectraCompare extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...SpectraStore.getState(),
    };

    this.onChange = this.onChange.bind(this);
    this.closeOp = this.closeOp.bind(this);
    this.getContent = this.getContent.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.renderSpectraEditor = this.renderSpectraEditor.bind(this);
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

  closeOp() {
    SpectraActions.ToggleCompareModal.defer();
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

  renderTitle() {
    return (
      <div className="spectra-editor-title">
        <span className="txt-spectra-editor-title">
          {'modalTitle'}
        </span>
        <Button
          bsStyle="danger"
          bsSize="small"
          className="button-right"
          onClick={this.closeOp}
        >
          <span>
            <i className="fa fa-times" /> Close without Save
          </span>
        </Button>
      </div>
    );
  }

  renderSpectraEditor(spectraCompare) {
    console.log(spectraCompare);

    let currEntity = null;

    const multiEntities = spectraCompare.map((spc) => {
      const {
        entity
      } = FN.buildData(spc.jcamp);
      currEntity = entity;
      return entity;
    });
    
    // const operations = this.buildOpsByLayout(currEntity);
    // const descriptions = this.getQDescVal();
    // const forecast = {
    //   btnCb: this.predictOp,
    //   refreshCb: this.saveOp,
    //   molecule: 'molecule',
    //   predictions,
    // };

    return (
      <Modal.Body>
        <SpectraEditor
          entity={currEntity}
          multiEntities={multiEntities}
        />
      </Modal.Body>
    );
  }
  
  render() {
    const { showCompareModal, spectraCompare } = this.state;
    console.log(spectraCompare);

    this.getContent();

    return (
      <div className="spectra-editor">
        <Modal
          show={showCompareModal}
          dialogClassName={'spectra-editor-dialog'}
        >
          {
            this.renderTitle()
          }
          {
            (spectraCompare && spectraCompare.length > 0) ? this.renderSpectraEditor(spectraCompare) : this.renderEmpty()
          }
        </Modal>
      </div>
    );
  }
}



export default ViewSpectraCompare;
