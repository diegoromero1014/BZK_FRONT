import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import numeral from 'numeral';
import _ from 'lodash';

class clientsEconomicGroup extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {dataName, dataDocumentType, dataDocument, dataEconomicGroup, dataAccountManager, dataIsProspect, dataIsAccess} = this.props;
    return (
      <div className="client-card" style={{width:"265px", float:"left"}}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
            <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>{dataAccountManager}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{backgroundColor:dataIsAccess ? "#B0E0E6" : "#DCDCDC"}}>
        </div>
        {dataIsProspect &&
        <div className="prospect-corner prospect badge badge-important animated bounceIn" style={{borderRadius:"10px"}}>P</div>
        }
      </div>
    );
  }
}

export default clientsEconomicGroup;
