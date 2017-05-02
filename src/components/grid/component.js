import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import {Row, Grid, Col} from 'react-flexbox-grid';
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

class GridComponent extends Component {

  constructor(props){
      super(props);
      this._renderHeader = this._renderHeader.bind(this);
      this._renderCell = this._renderCell.bind(this);
      this._renderRow = this._renderRow.bind(this);
  }

  _renderHeader(header, idx){
      return <HeaderComponent key={idx} titleColumn={header.title} orderColumn={header.orderColumn} width={header.width} />;
  }

  _renderCell(row, headers,modalTitle){
      return headers.map((value, idx) => {
            var cell;


            if(value.key === 'actions'){
              cell = <ModalComponent key={idx} idModal={_.uniqueId()}  modalTitle={modalTitle} actions={_.get(row, value.key)}/>
            }else if(value.key === 'trafficLight'){
              cell = <TrafficLightComponent key={idx} colorTraffict={_.get(row, value.key)}/>
            }else if(value.key === 'delete' &&  _.get(row, value.key)){
              if( _.get(row, value.key).permissionsDelete !== undefined && !_.get(row, value.key).permissionsDelete ){
                cell = <TdComponent key={idx} columnRow={""} styles={value.style} />
              } else {
                cell = <ButtonDeleteComponent key={idx} actionsDelete={_.get(row, value.key)}/>
              }
            }else if(value.key === 'actionsRedirect'){
              if( _.get(row, value.key).permissionsView !== undefined && !_.get(row, value.key).permissionsView ){
                cell = <TdComponent key={idx} columnRow={""} styles={value.style} />
              } else {
                cell = <ButtonDetailsRedirectComponent key={idx} icon={value.icon}  actionsRedirect={_.get(row, value.key)}/>
              }
            }else if(value.key === 'actionsPdf' &&  _.get(row, value.key)){
              cell = <PdfLinkComponent key={idx} actionsPdf={_.get(row, value.key)}/>
            }else if(value.key === 'changeStateTask' &&  _.get(row, value.key)){
              if( _.get(_.get(row, value.key), 'permissionEdit') ){
                cell = <SelectTaskComponent key={idx} valueStatus={_.get(row, value.key)}/>
              } else {
                cell = <TdComponent key={idx} columnRow={_.get(_.get(row, value.key), 'statusPending')} title={_.get(_.get(row, value.key), 'statusPending')} />
              }
            }else if(value.key === 'clientNameLink'){
                cell = <LinkComponent text={_.get(row, 'clientNameLink.value')} url={_.get(row, 'clientNameLink.link')} isRedirect={_.get(value,'showLink')} idClient={_.get(row, 'clientNameLink.id')}/>
            } else if(value.key === 'modalNameLink'){

                cell = <LinkModalComponent showModal={_.get(value,'showLink')} properties={_.get(row, 'modalNameLink')}/>
            }else{
              cell = <TdComponent key={idx} columnRow={_.get(row, value.key)} title={_.get(row, 'title')} styles={value.style} />
            }
          return (
            cell
          );
      });
  }

  _renderRow(data,headers,modalTitle){
      return data.map((value, idx) => {
          return (
              <tr role="row" key={idx}>
                  {this._renderCell(value, headers,modalTitle)}
              </tr>
          );
      });
  }

  render() {
    const headers = this.props.headers;
    const data = this.props.data;
    const modalTitle = this.props.modalTitle;
    return (
          <table width="100%" className="tableBt4 tableBt4-striped has-column-selection dataTable no-footer" id="datagrid-container" role="grid" aria-describedby="datagrid-container_info">
            <thead style={{color: '#4c5360'}}>
              <tr role="row">
                {headers().map(this._renderHeader)}
              </tr>
            </thead>
            <tbody>
                {this._renderRow(data, headers(), modalTitle)}
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
