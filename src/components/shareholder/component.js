import React, {
  Component
} from 'react';
import {connect} from 'react-redux';
import SearchShareholderComponent from './searchShareholderComponent';
import BotonCreateShareholderComponent from './createShareholder/botonCreateShareholderComponent';
import PaginationShareholderComponent from './paginationShareholderComponent';
import ListShareholderComponent from './listShareholderComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';

class ShareholderComponent extends Component {

  constructor(props){
     super(props);
  }

  render() {
    const {shareholdersReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if(shareholdersReducer.get('rowCount') !== 0){
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className = "tab-pane quickZoomIn animated"
        style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        <Grid style={{ width: "100%"}}>
          <Row><Col xs={10} sm={10} md={11} lg={11}>
          <SearchShareholderComponent
          /></Col>
            <BotonCreateShareholderComponent/>
          </Row>
          <Row>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Tipo de accionista:</span>
            </Col>
          </Row>
        </Grid>
        </div>
          <Grid style= {{display:visibleTable, width: "100%"}}>
            <Row>
              <Col xs={12} sm={8} md={12} lg={12}>
              <ListShareholderComponent/>
              <PaginationShareholderComponent/>
              </Col>
            </Row>
          </Grid>
          <Grid style= {{display:visibleMessage, width: "100%"}}>
            <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span></Col>
            </Row>
          </Grid>
       </div>
    );
  }
}


function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps)(ShareholderComponent);
