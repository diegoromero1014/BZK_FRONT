import React, {Component} from 'react';
import {redirectUrl} from '../globalComponents/actions';
import DetailsInfoClient from '../clientDetailsInfo/detailsInfoClient';
import ContactInfo from '../contact/component'
import {Grid, Row, Col} from 'react-flexbox-grid';

class TabClientInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      tabActive: 1
    };
  }

  _handleClickTabItem(tabSeleted, e){
    this.setState({
      tabActive: tabSeleted
    });
  }

  render(){
    const {infoClient} = this.props;
    var styleInfo = true;
    var styleContacts = false;
    var styleShareholders = false;

    var backgroundInfo = {height: "57px", borderBottomStyle: "solid", borderBottomColor: "#3498db", width: "70px"};
    var backgroundContacts = {height: "57px", borderBottomStyle: "none", width: "70px"};
    var backgroundShareholders = {height: "57px", borderBottomStyle: "none", width: "70px"};

    const {tabActive} = this.state;
    if( tabActive === 1 ){
      //la configuración ya se hizo arriba
    } else if( tabActive === 2 ){
      styleInfo = false;
      styleContacts = true;
      styleShareholders = false;

      backgroundInfo = {height: "57px", borderBottomStyle: "none", width: "70px"};
      backgroundContacts = {height: "57px", borderBottomStyle: "solid", borderBottomColor: "#3498db", width: "70px"};
      backgroundShareholders = {height: "57px", borderBottomStyle: "none", width: "70px"};
    } else if( tabActive === 3 ){
      styleInfo = false;
      styleContacts = false;
      styleShareholders = true;

      backgroundInfo = {height: "57px", borderBottomStyle: "none", width: "70px"};
      backgroundContacts = {height: "57px", borderBottomStyle: "none", width: "70px"};
      backgroundShareholders = {height: "57px", borderBottomStyle: "solid", borderBottomColor: "#3498db", width: "70px"};
    }
    return (
      <div className="my-custom-tab" style={{marginTop: "2px"}}>
        <ul className="nav nav-tabs custom-tab" style={{backgroundColor: "white", height: "60px",
          boxShadow: "0px 1px 0px 0 rgba(0, 0, 0, 0.2)", marginTop: "0px"}}>
  				<li style={backgroundInfo} onClick={this._handleClickTabItem.bind(this, 1)}>
            <a className="button-link-url" style={{marginRight: "15px"}}>Info</a>
          </li>
  				<li style={backgroundContacts} onClick={this._handleClickTabItem.bind(this, 2)}>
            <a className="button-link-url" style={{marginRight: "15px"}}>Contactos</a>
          </li>
  				<li style={backgroundShareholders} onClick={this._handleClickTabItem.bind(this, 3)}>
            <a className="button-link-url" style={{marginRight: "15px"}}>Accionistas</a>
          </li>
  			</ul>
        <div className="header-client-detail" style={{paddingLeft: "20px", height: "84%", paddingRight: "20px", backgroundColor: "white", marginTop: "-8px"}}>
          {styleInfo && <DetailsInfoClient infoClient={infoClient}/>}
          {styleContacts && <ContactInfo infoClient={infoClient}/>}
        </div>
      </div>
    );
  }
}

export default TabClientInfo;
