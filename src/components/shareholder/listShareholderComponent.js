import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shareholdersByClientFindServer,clearShareholder,orderColumnShareholder,clearShareholderDelete} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_SHAREHOLDER} from './constants';

let v1 = "";
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

  componentWillReceiveProps(nextProps){
      const {
          value1
      } = nextProps;
      if (v1 !== nextProps.value1) {
      v1 = nextProps.value1;
      this._orderColumn(0,"");
    }
  }


  _orderColumn(orderShareholder,columnShareholder){
    if(orderShareholder === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {shareholdersReducer,shareholdersByClientFindServer,orderColumnShareholder,clearShareholderDelete} = this.props;
    clearShareholderDelete();
    orderColumnShareholder(orderShareholder,columnShareholder);
    shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,columnShareholder,orderShareholder,shareholdersReducer.get('keywordShareholder'),v1);
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
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"sh.shareHolderKind.id")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"sh.shareHolderKind.id")}></i></span>,
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
    shareholdersByClientFindServer,clearShareholder,orderColumnShareholder,clearShareholderDelete
  }, dispatch);
}

function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListShareholderComponent);
