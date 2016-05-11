import React, {Component, PropTypes} from 'react';
import {redirectUrl} from '../globalComponents/actions';
import SweetAlert from 'sweetalert-react';

class ClientListItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      showEr: false
    }
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
    const {dataId, dataName, dataDocumentType, dataDocument, dataAccountManager, dataEconomicGroup, dataIsProspect, dataIsAccess} = this.props;
    return (
      <div>
        <div className="client-card" onClick={this._handleClickClientItem} style={{float:"left"}}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
            <div className="celula-title">{dataEconomicGroup.length > 30 ? dataEconomicGroup.substring(0, 30) + "..." : dataEconomicGroup}</div>
            <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>{dataAccountManager}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{backgroundColor:dataIsAccess ? "#B0E0E6" : "#DCDCDC"}}>
          {dataIsAccess ? <i className="chevron circle right icon blue" style={{marginTop:"-15px"}}></i> : ''}
        </div>
        {dataIsProspect &&
        <div className="prospect-corner prospect badge badge-important animated bounceIn" style={{borderRadius:"10px"}}>P</div>
        }
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

ClientListItem.PropTypes = {
    dataId: PropTypes.string.isRequired,
    dataName: PropTypes.string.isRequired,
    dataDocumentType: PropTypes.string.isRequired,
    dataDocument: PropTypes.string.isRequired,
    dataAccountManager: PropTypes.string.isRequired,
    dataEconomicGroup: PropTypes.string.isRequired,
    dataIsProspect: PropTypes.bool.isRequired,
    dataIsAccess: PropTypes.bool.isRequired
};

export default ClientListItem;
