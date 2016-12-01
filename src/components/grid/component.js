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
import PdfLinkComponent from './pdfLinkComponent';

class GridComponent extends Component {

  constructor(props){
      super(props);
      this._renderHeader = this._renderHeader.bind(this);
      this._renderCell = this._renderCell.bind(this);
      this._renderRow = this._renderRow.bind(this);
  }

  _renderHeader(header, idx){
      return <HeaderComponent key={idx} titleColumn={header.title} orderColumn={header.orderColumn} />;
  }

  _renderCell(row, headers,modalTitle){
      return headers.map((value, idx) => {
            var cell;
            if(value.key === 'actions'){
              cell = <ModalComponent key={idx} idModal={_.uniqueId()}  modalTitle={modalTitle} actions={_.get(row, value.key)}/>
            }else if(value.key === 'trafficLight'){
              cell = <TrafficLightComponent key={idx} colorTraffict={_.get(row, value.key)}/>
            }else if(value.key === 'delete' &&  _.get(row, value.key)){
              cell = <ButtonDeleteComponent key={idx} actionsDelete={_.get(row, value.key)}/>
            }else if(value.key === 'actionsRedirect'){
              cell= <ButtonDetailsRedirectComponent key={idx} icon={value.icon} actionsRedirect={_.get(row, value.key)}/>
            }else if(value.key === 'actionsPdf' &&  _.get(row, value.key)){
              cell = <PdfLinkComponent key={idx} actionsPdf={_.get(row, value.key)}/>
            }else{
              cell = <TdComponent key={idx} columnRow={_.get(row, value.key)} styles={value.style} />
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
          <table width="100%" className="tableBt4 tableBt4-striped has-column-selection dataTable no-footer" id="datagrid-container" role="grid" aria-describedby="datagrid-container_info" >
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
