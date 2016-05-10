import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shareholdersByClientFindServer,clearShareholder} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_SHAREHOLDER} from './constants';

class ListShareholderComponent extends Component {

  constructor(props){
      super(props);
      this._renderCellView = this._renderCellView.bind(this);
      this._renderHeaders = this._renderHeaders.bind(this);
      this.state = {
        column : "",
        order : "",
        orderA: 'inline-block',
        orderD: 'none'
      }
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tipo de documento",
        key:"shareHolderIdType"
      },
      {
        title: "Número de documento",
        key:"shareHolderIdNumber"
      },
      {
        title: "Tipo de persona",
        key:"shareHolderType"
      },
      {
        title: "Nombre/Razón social",
        key:"name"
      },
      {
        title: "% de participación",
        key:"percentage"
      },
      {
        title: "Tipo de accionista",
        key:"shareHolderKind"
      },
      {
        title: "",
        key:"delete"
      },
    ]
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el accionista ";
    return _.forOwn(data, function(value, key) {
            _.set(value, 'actions',  {
              actionView: true,
              id: value.id,
              urlServer: "./component",
              component : "VIEW_SHAREHOLDER"
            });
            _.set(value, 'delete',  {
              actionDelete: true,
              urlServer: "/",
              typeDelete : DELETE_TYPE_SHAREHOLDER,
              mensaje: mensaje + value.name + "?",
              json: ''
            });
      });
  }

  render() {
    const modalTitle = 'Accionista Detalle';
    const {shareholdersReducer} = this.props;
    const data = shareholdersReducer.get('shareholders');
    return ( < div className = "horizontal-scroll-wrapper" >
      <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle}/>
    </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    shareholdersByClientFindServer,clearShareholder
  }, dispatch);
}

function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListShareholderComponent);
