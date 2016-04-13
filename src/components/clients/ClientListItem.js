import React, {Component, PropTypes} from 'react';

class ClientListItem extends Component{
  render(){
    const {dataName, dataDocumentType, dataDocument, dataAccountManager, dataEconomicGroup, dataIsProspect, dataIsAccess} = this.props;
    return (
      <div>
        <div className="client-card" style={{float:"left"}}>
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
    dataName: PropTypes.string.isRequired,
    dataDocumentType: PropTypes.string.isRequired,
    dataDocument: PropTypes.string.isRequired,
    dataAccountManager: PropTypes.string.isRequired,
    dataEconomicGroup: PropTypes.string.isRequired,
    dataIsProspect: PropTypes.bool.isRequired,
    dataIsAccess: PropTypes.bool.isRequired
};

export default ClientListItem;
