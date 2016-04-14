import React, {
  Component
} from 'react';
import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer} from './actions';

class ContactComponent extends Component {

  componentWillMount(){
      const {
          contactsByClientFindServer
      } = this.props;
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSeleted'),10,"",0,"");
  }

  render() {
    var contactsList = [];
    const {
        contactsByClient
    } = this.props;
    contactsList = contactsByClient.get('contacts');
    return (
      < div className = "tab-pane quickZoomIn animated"
        style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div className = "tab-content break-word" style={{zIndex :0}}>
          <SearchContactComponent / >
        < /div>
          < ListContactComponent data={contactsList}/ >
       < /div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    contactsByClientFindServer
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
    return {
        contactsByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactComponent);
