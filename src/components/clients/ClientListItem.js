import React, {Component, PropTypes} from 'react';
import {redirectUrl} from '../globalComponents/actions';

class ClientListItem extends Component{
  constructor(props){
    super(props);
    this._handleClickClientItem = this._handleClickClientItem.bind(this);
  }

  _handleClickClientItem(e){
    const {dataId, dataIsAccess} = this.props;
    if(dataIsAccess){
      window.localStorage.setItem('idClientSeleted', dataId);
      redirectUrl("/dashboard/clientInformation");
    } else {
      alert("Señor usuario, usted no pertenece a la célula del cliente seleccionado, por tal motivo no puede ver su información");
    }
  }

  render(){
    const {dataId, dataName, dataDocumentType, dataDocument, dataAccountManager, dataEconomicGroup, dataIsProspect, dataIsAccess} = this.props;
    return (
      <div>
        <div className="client-card" onClick={this._handleClickClientItem} style={{float:"left"}}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument}</div>
            <div className="celula-title">{dataEconomicGroup}</div>
            <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>{dataAccountManager}</div>
          </div>
        </div>

        <div className="celula-card-bottom" style={{backgroundColor:dataIsAccess ? "#B0E0E6" : "#DCDCDC"}}>
          <div className="celula-card-bottom-left">
            {dataIsAccess ? <a href="#"><i className="icon-expand"></i></a> : ''}
          </div>
        </div>
        {dataIsProspect &&
        <div className="prospect-corner prospect badge badge-important animated bounceIn" style={{borderRadius:"10px"}}>P</div>
        }
        </div>
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
