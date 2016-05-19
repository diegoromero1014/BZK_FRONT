import React, {
  Component
} from 'react';
import {connect} from 'react-redux';
import {clearShareholder,shareholdersByClientFindServer} from './actions';
import {bindActionCreators} from 'redux';
import SearchShareholderComponent from './searchShareholderComponent';
import BotonCreateShareholderComponent from './createShareholder/botonCreateShareholderComponent';
import PaginationShareholderComponent from './paginationShareholderComponent';
import ListShareholderComponent from './listShareholderComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {NUMBER_RECORDS,SHAREHOLDER_KIND,SHAREHOLDER_TYPE} from './constants';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';

class ShareholderComponent extends Component {

  constructor(props){
     super(props);
     this.state= {
        value1: "",
        value2:"",
        checkValue: false
     };
     this._handleChangeValueCertificateShareholder = this._handleChangeValueCertificateShareholder.bind(this);
  }

  _handleChangeValueCertificateShareholder(value){
    this.setState({
      checkValue: value
    });
  }

  componentWillMount(){
    const{clearShareholder,shareholdersByClientFindServer} = this.props;
    clearShareholder();
    shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"sh.sharePercentage",1,"","","");
  }

  render() {
    const {shareholdersReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if(shareholdersReducer.get('rowCount') !== 0){
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    console.log("checkValue", this.state.checkValue);
    return (
      <div className = "tab-pane quickZoomIn animated"
        style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div style={{marginBottom: "10px"}}>
          <input type="checkbox"
              value={this.state.checkValue}
              onChange={val => this._handleChangeValueCertificateShareholder(val)} />
          <span> Certifico que el cliente no tiene accionstas con un porcentaje de participación mayor a 5%.</span>
        </div>
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        <Grid style={{ width: "100%"}}>
          <Row><Col xs={10} sm={10} md={11} lg={11}>
          <SearchShareholderComponent
            value1={this.state.value1}
            value2={this.state.value2}
          /></Col>
            <BotonCreateShareholderComponent/>
          </Row>
          <Row>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Tipo de accionista:</span>
            <SelectFilterContact config={{
                onChange: (value) => this.setState({value1: value.id})
            }}
            idTypeFilter={SHAREHOLDER_KIND}/>
            </Col>
            <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Tipo de persona:</span>
            <SelectFilterContact config={{
                onChange: (value) => this.setState({value2: value.id})
            }}
            idTypeFilter={SHAREHOLDER_TYPE}/>
            </Col>
          </Row>
        </Grid>
        </div>
          <Grid style= {{display:visibleTable, width: "100%"}}>
            <Row>
              <Col xs>
              <ListShareholderComponent
                value1={this.state.value1}
                value2={this.state.value2}/>
              <PaginationShareholderComponent
                value1={this.state.value1}
                value2={this.state.value2}/>
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

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clearShareholder,shareholdersByClientFindServer
  }, dispatch);
}

function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ShareholderComponent);
