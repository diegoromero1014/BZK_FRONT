import React, {Component, PropTypes} from 'react';

class ClientListItem extends Component{
  render(){
    const {dataName, dataNit, dataEconomicGroup, dataUrl, dataIsProspect} = this.props;
    return (
      <div>
        <div className="client-card" style={{float:"left"}}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName}</div>
            <div className="celula-name">NIT: {dataNit}</div>
            <div className="celula-title">{dataEconomicGroup}</div>
          </div>
        </div>
        <div className="celula-card-bottom">
          <div className="celula-card-bottom-left">
            <a href={dataUrl}><i className="icon-expand"></i></a>
          </div>
        </div>
        {dataIsProspect &&
        <div className="prospect-corner prospect badge badge-important animated bounceIn">P</div>
        }
        </div>
      </div>
    )
  }
}

ClientListItem.PropTypes = {
    dataName: PropTypes.string.isRequired,
    dataNit: PropTypes.string.isRequired,
    dataEconomicGroup: PropTypes.string.isRequired,
    dataUrl: PropTypes.string.isRequired,
    dataIsProspect: PropTypes.bool.isRequired
};

export default ClientListItem;
