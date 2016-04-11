import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import HeaderComponent from './headerComponent';
import TdComponent from './tdComponent';
import ButtonModalComponent from './buttonModalComponent';

class GridComponent extends Component {

  constructor(props){
      super(props);
      this._renderHeader = this._renderHeader.bind(this);
      this._renderCell = this._renderCell.bind(this);
      this._renderRow = this._renderRow.bind(this);
  }

  _renderHeader(header, idx){
      return <HeaderComponent  key={idx} titleColumn={header.title} />;
  }

  _renderCell(row, headers){
      return headers.map((value, idx) => {
        var cell;
        if(value.key == 'actions'){
          cell = <ButtonModalComponent key={idx} action={_.get(row, value.key)}/>
        }else{
          cell = <TdComponent key={idx} columnRow={_.get(row, value.key)} />
        }
          return (
            cell
          );
      });
  }

  _renderRow(data, headers){
      return data.map((value, idx) => {
          return (
              <tr role="row" key={idx}>
                  {this._renderCell(value, headers)}
              </tr>
          );
      });
  }

  render() {
    const headers = this.props.headers;
    const data = this.props.data;
    return (
      <table width="100%" className="table table-striped has-column-selection dataTable no-footer" id="datagrid-container"  role="grid" aria-describedby="datagrid-container_info" >
        <thead>
          <tr role="row">
            {headers.map(this._renderHeader)}
          </tr>
        </thead>
        <tbody>
            {this._renderRow(data, headers)}
        </tbody>
      </table>
    );
  }
}

GridComponent.propTypes = {
   headers: PropTypes.array.isRequired,
   data: PropTypes.array.isRequired
};


export default GridComponent;
