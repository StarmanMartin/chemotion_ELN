import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, ControlLabel, FormControl } from 'react-bootstrap';
import TextTemplateStore from 'src/stores/alt/stores/TextTemplateStore';
import TextTemplateActions from 'src/stores/alt/actions/TextTemplateActions';
import Select from 'react-select';
import { confirmOptions } from 'src/components/staticDropdownOptions/options';
import { TreeSelect } from 'antd';

export default class ContainerCompareAnalyses extends Component {
  constructor(props) {
    super(props);

    const { container, templateType } = props;
    const textTemplate = TextTemplateStore.getState()[templateType] || Map();
    this.state = {
      container,
      textTemplate: textTemplate && textTemplate.toJS()
    };

    this.onChange = this.onChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateTextTemplates = this.updateTextTemplates.bind(this);

    this.handleTemplateChange = this.handleTemplateChange.bind(this);
    this.buildSelectAnalysesMenu = this.buildSelectAnalysesMenu.bind(this);
    this.handleChangeSelectAnalyses = this.handleChangeSelectAnalyses.bind(this);
    
  }

  componentDidMount() {
    TextTemplateStore.listen(this.handleTemplateChange);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      container: nextProps.container,
    });
  }

  componentWillUnmount() {
    TextTemplateStore.unlisten(this.handleTemplateChange);
  }

  onChange(container) {
    this.props.onChange(container);
  }

  handleTemplateChange() {
    const { templateType } = this.props;

    const textTemplate = TextTemplateStore.getState()[templateType];
    this.setState({ textTemplate: textTemplate && textTemplate.toJS() });
  }

  handleInputChange(type, ev) {
    const { container } = this.state;
    let isChanged = false;
    switch (type) {
      case 'name':
        container.name = ev.currentTarget.value;
        isChanged = true;
        break;
      case 'description':
        container.description = ev.currentTarget.value;
        isChanged = true;
        break;
      case 'status':
        container.extended_metadata.status = ev ? ev.value : undefined;
        isChanged = true;
        break;
      case 'content':
        container.extended_metadata.content = ev;
        isChanged = true;
        break;
      default:
        break;
    }

    if (isChanged) this.onChange(container);
  }

  handleChangeSelectAnalyses(treeData, value) {
    const { container } = this.state;
    console.log(value);
    console.log(treeData);
    // const selectedData = treeData.filter((layout) => {
    //   const analyses = layout.children;
    //   console.log('analyses', analyses);
    //   const selectedAnalysis = analyses.filter((aic) => {
    //     const datasets = aic.children;
    //     const selectedDataSet = datasets.filter((dts) => {
    //       const listFiles = dts.children;
    //       const selectedFiles = listFiles.map((file) => {
    //         return value.includes(file.value);
    //       });
    //       return selectedFiles.length > 0;
    //     });
    //     return selectedDataSet.length > 0;
    //   });
    //   return selectedAnalysis.length > 0;
    // });
    // console.log('selectedData', selectedData);
    container.extended_metadata.analyses_compared = value;
    this.onChange(container);
  }

  // eslint-disable-next-line class-methods-use-this
  updateTextTemplates(textTemplate) {
    const { templateType } = this.props;
    TextTemplateActions.updateTextTemplates(templateType, textTemplate);
  }

  buildSelectAnalysesMenu() {
    const filteredAttachments = (dataset) => {
      if (dataset) {
        const filtered = dataset.attachments.filter((attch) => {
          const position = attch.filename.search(/[.]jdx$/);
          return position > 0;
        });
        return filtered;
      }
      return false;
    };

    const { sample } = this.props;
    const listComparible = sample.getAnalysisContainersCompareable();
    const menuItems = Object.keys(listComparible).map((layout) => {
      const listAics = listComparible[layout].map((aic)=> {
        const { children } = aic;
        let subSubMenu = null;
        if (children) {
          subSubMenu = children.map((dts) => {
            const attachments = filteredAttachments(dts);
            const dataSetName = dts.name;
            if (!attachments) {
              return { title: dataSetName, value: dts, checkable: false };
            }
            const spectraItems = attachments.map((item) => {
              return { title: item.filename, key: item.id, value: item.id }
            });
            return { title: dts.name, key: dts.id, value: dts, checkable: false , children: spectraItems };
          });
        }
        return { title: aic.name, key: aic.id, children: subSubMenu, checkable: false };
      });
      return { title: layout, value: layout, children: listAics, checkable: false }
    });
    return menuItems;
  }

  render() {
    const { container } = this.state;
    const { readOnly, disabled } = this.props;
    const treeAnalysesData = this.buildSelectAnalysesMenu();

    return (
      <div>
        <Col md={8}>
          <label>Name</label>
          <FormControl
            type="text"
            label="Name"
            value={container.name || '***'}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={this.handleInputChange.bind(this, 'name')}
            disabled={readOnly || disabled} />
        </Col>
        <Col md={4}>
          <div style={{ marginBottom: 11 }}>
            <label>Status</label>
            <Select
              name='status'
              multi={false}
              options={confirmOptions}
              value={container.extended_metadata['status']}
              disabled={readOnly || disabled}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={this.handleInputChange.bind(this, 'status')}
            />
          </div>
        </Col>
        <Col md={12}>
          <div style={{ marginBottom: 11 }}>
            <ControlLabel>Analyses</ControlLabel>
            <TreeSelect
              style={{ width: '100%' }}
              placeholder="Please select"
              treeCheckable={true}
              treeData={treeAnalysesData}
              onChange={this.handleChangeSelectAnalyses.bind(this, treeAnalysesData)}
            />
          </div>
        </Col>
      </div>
    );
  }
}


ContainerCompareAnalyses.propTypes = {
  templateType: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  container: PropTypes.object,
  sample: PropTypes.object,
}