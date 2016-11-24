import React, {Component, PropTypes} from 'react';
import {redirectUrl} from '../globalComponents/actions';
import SweetAlert from 'sweetalert-react';

class ClientPendingUpdateListItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      showEr: false
    };
    this._handleClickClientItem = this._handleClickClientItem.bind(this);
    this._closeError = this._closeError.bind(this);
  }

    _handleClickClientItem(e){
        const {dataId, dataIsAccess} = this.props;
        if(dataIsAccess){
            window.localStorage.setItem('idClientSelected', dataId);
            redirectUrl("/dashboard/clientInformation");
        } else {
            this.setState({showEr: true});
        }
    }

  _closeError(){
    this.setState({showEr: false});
  }

  render(){
    const {dataId, dataName, dataDocumentType, dataDocument, dataRegion, dataZone, dataDateLastUpdate} = this.props;
    return (
      <div>
        <div className="client-card" onClick={this._handleClickClientItem} style={{float:"left"}}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
              <div className="celula-title">Región: {dataRegion}</div>
              <div className="celula-title">Zona: {dataZone}</div>
              <div className="celula-title">Última actualización: {dataDateLastUpdate}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="chevron circle right icon blue" style={{marginTop:"-15px"}}></i>
        </div>
        </div>
        <SweetAlert
         type= "warning"
         show={this.state.showEr}
         title="Acceso denegado"
         text="Señor usuario, usted no pertenece a la célula del cliente seleccionado, por tal motivo no puede ver su información."
         onConfirm={() => this._closeError()}
         />
      </div>
    )
  }
}

ClientPendingUpdateListItem.PropTypes = {
    dataId: PropTypes.string.isRequired,
    dataName: PropTypes.string.isRequired,
    dataDocumentType: PropTypes.string.isRequired,
    dataDocument: PropTypes.string.isRequired,
    dataRegion: PropTypes.string.isRequired,
    dataZone: PropTypes.string.isRequired,
    dataDateLastUpdate: PropTypes.bool.isRequired,
    dataIsAccess: PropTypes.bool.isRequired
};

export default ClientPendingUpdateListItem;
