import React, {
  Component
} from 'react';
import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer} from './actions';
import {Combobox} from 'react-widgets';
import SelectFilterContact from '../selectsComponent/SelectFilterContact/SelectFilterComponent';
import {FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID} from './constants';

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
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        <Grid style={{paddingRight: "16px", width: "100%"}}>
          <Row><Col xs={12} sm={8} md={12} lg={12}><SearchContactComponent/></Col></Row>
          <Row>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Función</span><SelectFilterContact key={1} idTypeFilter={FILTER_FUNCTION_ID}/></Col>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Entidad/Línea de negocio</span><SelectFilterContact key={2} idTypeFilter={FILTER_TYPE_LBO_ID}/></Col>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Tipo de contacto</span><SelectFilterContact key={3} idTypeFilter={FILTER_TYPE_CONTACT_ID}/></Col>
          </Row>
        </Grid>
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
