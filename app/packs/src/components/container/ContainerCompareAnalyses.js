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
      case 'kind': {
        let kind = (ev || '');
        kind = `${kind.split('|')[0].trim()} | ${(kind.split('|')[1] || '').trim()}`;
        container.extended_metadata.kind = kind;
        isChanged = true;
        break;
      }
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

  // eslint-disable-next-line class-methods-use-this
  updateTextTemplates(textTemplate) {
    const { templateType } = this.props;
    TextTemplateActions.updateTextTemplates(templateType, textTemplate);
  }

  buildSelectAnalysesMenu() {
    const filteredAttachments = (dataset) => {
      if (dataset) {
        const filtered = dataset.attachments.filter((attch) => {
          const position = attch.filename.search(/[.]?dx$/);
          return position > 0;
        });
        return filtered;
      }
      return false;
    };

    const { sample } = this.props;
    const listLayouts = sample.getListAnalysesLayouts();
    const { layouts, data } = listLayouts;
    let menuItems = layouts.map((layout) => {
      const itemData = data.filter((d) => {
        return d.extended_metadata.kind ? d.extended_metadata.kind.indexOf(layout) : false;
      });
      let children = null;
      if (itemData) {
        children = itemData.map((item) => {
          const { children } = item;
          const dataSets = children.filter(el => ~el.container_type.indexOf('dataset'));
          let subSubMenu = null;
          if (dataSets) {
            subSubMenu = dataSets.map((dts) => {
              const attachments = filteredAttachments(dts);
              if (!attachments) {
                return { title: dts.name, value: dts, checkable: false };
              }
              const subSubMenuChildren = attachments.map((item) => {
                return { title: item.filename, value: item.id }
              });
              return { title: dts.name, value: dts, checkable: false , children: subSubMenuChildren };
            });
          }
          return { title: item.name, children: subSubMenu, checkable: false };
        });
      }
      return { title: layout, value: layout, children: children, checkable: false }
    });
    return menuItems;
  }

  render() {
    const { container, textTemplate } = this.state;
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