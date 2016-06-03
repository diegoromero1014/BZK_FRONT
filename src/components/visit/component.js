import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import {NUMBER_RECORDS,FILTER_STATUS_VISIT_ID} from './constants';
import {visitByClientFindServer,clearVisit} from './actions';
import ListVisitComponent from './listVisitComponent';
import PaginationVisitComponent from './paginationVisitComponent';

class VisitComponent extends Component {

  constructor(props){
     super(props);
    this._createVisit = this._createVisit.bind(this);
    this.state= {
       value1: ""
    };
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }else{
      const {visitByClientFindServer,clearVisit} = this.props;
      clearVisit();
      visitByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,"vd.visitTime",1,"");
    }
  }

  _createVisit(){
      redirectUrl("/dashboard/visita");
  }

  render() {
    const {visitReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if(visitReducer.get('rowCount') !== 0){
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className = "tab-pane quickZoomIn animated"
        style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        <Grid style={{ width: "100%"}}>
          <Row>
          <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Estado del documento:</span>
          <SelectFilterContact config={{
              onChange: (value) => this.setState({value1: value.id})
          }}
          idTypeFilter={FILTER_STATUS_VISIT_ID}/>
          </Col>
          <Col xs>
          <button className="btn btn-primary" type="button" title="Crear visita" style={{marginTop: '21px'}} onClick={this._createVisit}>
            <i className="file text outline icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
          </button>
        </Col>
          </Row>
        </Grid>
        </div>
          <Grid style= {{display:visibleTable, width: "100%"}}>
            <Row>
              <Col xs>
              <ListVisitComponent
                value1={this.state.value1}/>
                <PaginationVisitComponent
                  value1={this.state.value1}/>
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
  visitByClientFindServer,clearVisit
  }, dispatch);
}

function mapStateToProps({visitReducer}, ownerProps){
    return {
        visitReducer
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(VisitComponent);
