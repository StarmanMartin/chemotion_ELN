import React from "react";
import { Button, Modal, Well } from "react-bootstrap";
import SpectraActions from 'src/stores/alt/actions/SpectraActions';
import SpectraStore from 'src/stores/alt/stores/SpectraStore';
import { SpectraEditor, FN } from '@complat/react-spectra-editor';
import { TreeSelect } from "antd";
import { BuildSpectraComparedSelection, GetSelectedComparedAnalyses, BuildSpectraComparedInfos } from "src/utilities/SpectraHelper";
import PropTypes from 'prop-types';

class ViewSpectraCompare extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...SpectraStore.getState(),
    };

    this.onChange = this.onChange.bind(this);
    this.closeOp = this.closeOp.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.renderSpectraEditor = this.renderSpectraEditor.bind(this);
    this.handleChangeSelectAnalyses = this.handleChangeSelectAnalyses.bind(this);
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

  handleChangeSelectAnalyses(treeData, selectedFiles, info) {
    const { elementData, handleSampleChanged } = this.props;
    const { container } = this.state;
    const selectedData = GetSelectedComparedAnalyses(container, treeData, selectedFiles, info);
    container.extended_metadata.analyses_compared = selectedData;
    handleSampleChanged(elementData);

    const spcCompareInfo = BuildSpectraComparedInfos(elementData, container);
    SpectraActions.LoadSpectraCompare.defer(spcCompareInfo);
  }

  closeOp() {
    SpectraActions.ToggleCompareModal.defer(null);
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
    const { elementData } = this.props;
    const treeAnalysesData = BuildSpectraComparedSelection(elementData);
    const { container } = this.state;
    let modalTitle = '';
    let selectedFiles = [];
    if (container) {
      modalTitle = container.name;
      const { analyses_compared } = container.extended_metadata;
      if (analyses_compared) {
        selectedFiles = analyses_compared.map(analysis => (
          analysis.file.id
        ));
      }
    }

    return (
      <div className="spectra-editor-title">
        <span className="txt-spectra-editor-title">
          {modalTitle}
        </span>
        <div style={{ display: 'inline-flex', margin: '0 0 0 100px' }} >
          <TreeSelect
            style={{ width: '100%' }}
            placeholder="Please select"
            treeCheckable={true}
            treeData={treeAnalysesData}
            value={selectedFiles}
            onChange={this.handleChangeSelectAnalyses.bind(this, treeAnalysesData)}
          />
        </div>
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
        {
          (!multiEntities && multiEntities.length === 0 ) ? this.renderEmpty() :
          (
            <SpectraEditor
              entity={currEntity}
              multiEntities={multiEntities}
            />
          )
        }
        
      </Modal.Body>
    );
  }
  
  render() {
    
    const { showCompareModal, spectraCompare } = this.state;

    // this.getContent();

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

ViewSpectraCompare.propTypes = {
  elementData: PropTypes.object.isRequired,
  handleSampleChanged: PropTypes.func.isRequired,
};

export default ViewSpectraCompare;
