import React, { Component, PropTypes } from 'react';
import Highlighter from "react-highlight-words";
import _ from 'lodash';

import HeaderComponent from './headerComponent';
import TdComponent from './tdComponent';
import ButtonDeleteComponent from './buttonDeleteComponent';
import ModalComponent from '../modal/modalComponent';
import ButtonDetailsRedirectComponent from './buttonDetailsRedirectComponent';
import TrafficLightComponent from './trafficLightComponent';
import SelectTaskComponent from './selectTaskComponent';
import PdfLinkComponent from './pdfLinkComponent';
import LinkComponent from './linkComponent';
import LinkModalComponent from './linkModalComponent';
import BtnDeleteComponentNew from './buttonDeleteLocalComponent';
import CheckComponent from './checkComponent';
import TdConfidentialComponent from './tdConfidentialComponent';
import TdParticularityComponent from './tdParticularityComponent';
import TdUpdatedInfoComponent from './tdUpdatedInfoComponent';
import {mapDateValueFromTask} from '../../actionsGlobal';
import TrafficLightIndicator from './../../ui/TrafficLightIndicator';

import {htmlToTextRegex} from './../../actionsGlobal';

import { ACTION_CHECK, DATE_CELL } from './constants';

class GridComponent extends Component {

  constructor(props) {
    super(props);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderCell = this._renderCell.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  _renderHeader(header, idx) {
    return <HeaderComponent key={idx} titleColumn={header.title} orderColumn={header.orderColumn} width={header.width} />;
  }

  getCellFromType(row, value, idx) {
    let columnRow = _.get(row, value.key)
    if (value.type == DATE_CELL) {
      columnRow = mapDateValueFromTask(columnRow);
    }
    return <TdComponent key={idx} columnRow={columnRow} toolTip={_.get(row, 'toolTip')} headerToolTip={_.get(row, 'headerTooltip')} styles={value.style} />
  }

  _renderCell(row, headers, modalTitle, origin) {    
    return headers.map((value, idx) => {      
      let cell;
      if (value.key === ACTION_CHECK) {
        const info = _.get(row, ACTION_CHECK, {});
        cell = <CheckComponent key={idx} fn={info.fn} args={info.argsFn} isChecked={info.isChecked} />
      } else if (value.key === 'actions') {                 
        cell = <ModalComponent key={idx} idModal={_.uniqueId()} modalTitle={modalTitle} actions={_.get(row, value.key)} origin={origin} />
      } else if (value.key === 'trafficLight') {
        cell = <TrafficLightComponent key={idx} colorTraffict={_.get(row, value.key)} />
      } else if (value.key === 'trafficLightIndicator') {
        cell = <TrafficLightIndicator days={_.get(row, value.key).days} isFinalized={_.get(row, value.key).isFinalized} style={value.style} />
      } else if (value.key === 'delete' && _.get(row, value.key)) {
        if (_.get(row, value.key).permissionsDelete !== undefined && !_.get(row, value.key).permissionsDelete) {
          cell = <TdComponent key={idx} columnRow={""} styles={value.style} />
        } else {
          cell = <ButtonDeleteComponent key={idx} actionsDelete={_.get(row, value.key)} />
        }
      } else if (value.key === 'deleteNew' && _.get(row, value.key)) {
        //se crea un nuevo componente para eliminar que sea genérico y permita controlar
        //la acción desde el componente padre
        const info = _.get(row, 'deleteNew', {});
        if (_.get(row, value.key).permissionsDelete !== undefined && !_.get(row, value.key).permissionsDelete) {
          cell = <TdComponent key={idx} columnRow={""} styles={value.style} />
        } else {
          cell = <BtnDeleteComponentNew key={idx} message={info.message} typeAction={info.icon}
            fn={info.fn} args={info.argsFn} />
        }
      } else if (value.key === 'actionsRedirect') {
        if (_.get(row, value.key).permissionsView !== undefined && !_.get(row, value.key).permissionsView) {
          cell = <TdComponent key={idx} columnRow={""} styles={value.style} />
        } else {
          cell = <ButtonDetailsRedirectComponent key={idx} icon={value.icon} actionsRedirect={_.get(row, value.key)} style={value.style} />
        }
      } else if (value.key === 'actionsPdf' && _.get(row, value.key)) {
        cell = <PdfLinkComponent key={idx} actionsPdf={_.get(row, value.key)} />
      } else if (value.key === 'changeStateTask' && _.get(row, value.key)) {
        cell = <SelectTaskComponent key={idx} valueStatus={_.get(row, value.key)} isEditable={_.get(_.get(row, value.key), 'permissionEdit')}
          styles={_.get(_.get(row, value.key), 'styles')} />
      } else if (value.key === 'clientNameLink') {
        cell = <LinkComponent key={idx} text={_.get(row, 'clientNameLink.value')} url={_.get(row, 'clientNameLink.link')} isRedirect={_.get(value, 'showLink')} idClient={_.get(row, 'clientNameLink.id')} hasAccess={_.get(row, 'clientNameLink.hasAccess')} />
      } else if (value.key === 'modalNameLink') {
        cell = <LinkModalComponent key={idx} showModal={_.get(value, 'showLink')} properties={_.get(row, 'modalNameLink')} />
      } else if (value.key === 'deleteLocal') {
        cell = _.get(row, 'deleteLocal.component');
      } else if (value.key === 'commercialReport.isConfidential'){
        cell = <TdConfidentialComponent key={idx} columnRow={_.get(row, value.key) ? 'Confidencial': ''} styles={value.style}/>
      } else if (value.key === 'contactRelevantFeatures'){ 
        cell = <TdParticularityComponent key={idx} columnRow={_.get(row, value.key) ? _.get(row, value.key): ''} styles={value.style}/>
      } else if (value.key === 'updatedInfo'){ 
        cell = <TdUpdatedInfoComponent key={idx} columnRow={_.get(row, value.key)  ? '' : _.get(row, 'updatedInfoDesc')} styles={value.style}/>
      } else {
        cell = this.getCellFromType(row, value, idx);
      } 
      return (
        cell
      );
    });
  }

  renderRowExpanded = value => {
    const { headers } = this.props;
    if(_.has(value, 'text')) {
      const details = value.text;
      if(details){
        return (
          <tr>
            <td colSpan={headers().length}>
              {this.renderRowExpandedData(details)}
            </td>
          </tr>
        )
      }
    }
    return null;
  }

  renderRowExpandedData = details => {
    const {textToHighlight} = this.props;
    return (
      <div style={{padding: '5px 0px 0px 45px'}}>
        <Highlighter
          searchWords={[textToHighlight]}
          autoEscape={true}
          textToHighlight={htmlToTextRegex(details)}
          highlightClassName={'highlightClass'}
        />
      </div>
    )
  }

  _renderRow() {
    const {headers, data, modalTitle, origin, expandRow } = this.props;
    return data.map((value, idx) => {
      return [
        <tr role="row" key={idx}>
          {this._renderCell(value, headers(), modalTitle, origin)}
        </tr>,
        expandRow && this.renderRowExpanded(value)
      ];
    });
  }

  render() {
    const {headers} = this.props;
    return (
      <table width="100%" className="tableBt4 tableBt4-striped has-column-selection dataTable no-footer" id="datagrid-container" role="grid" aria-describedby="datagrid-container_info">
        <thead style={{ color: '#4c5360' }}>
          <tr role="row">
            {headers().map(this._renderHeader)}
          </tr>
        </thead>
        <tbody>
          {this._renderRow()}
        </tbody>
      </table>
    );
  }
}

GridComponent.propTypes = {
  headers: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  modalTitle: PropTypes.string,
};

export default GridComponent;