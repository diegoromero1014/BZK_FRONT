import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import {businessPlanByClientFindServer,clearBusinessPlan} from './actions';
import {NUMBER_RECORDS, FILTER_STATUS_BUSINESS_PLAN_ID} from './constants';
import ListBusinessPlanComponent from './listBusinessPlanComponent';
import PaginationBusinessPlanComponent from './paginationBusinessPlanComponent';
import {updateTitleNavBar} from '../navBar/actions';
import ButtonDownloadBusinessPlanComponent from './downloadBusinessPlan/buttonDownloadBusinessPlanComponent';

class BusinessPlanComponent extends Component {

  constructor(props){
    super(props);
    this.state= {
       value1: ""
    };
    this._createBusinessPlan = this._createBusinessPlan.bind(this);
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }else{
      const {businessPlanByClientFindServer,clearBusinessPlan} = this.props;
      clearBusinessPlan();
      businessPlanByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,"bp.businessDate",1,"","");
    }
  }

  _createBusinessPlan() {
    const {updateTitleNavBar} = this.props;
    updateTitleNavBar('Informe de plan de negocio');
    redirectUrl('/dashboard/businessPlan');
  }

  render() {
    const {businessPlanReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    let visibleDownload = 'none';
    if(businessPlanReducer.get('rowCount') !== 0){
      visibleTable = 'block';
      visibleMessage = 'none';
      visibleDownload = 'block';
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
                idTypeFilter={FILTER_STATUS_BUSINESS_PLAN_ID}/>
              </Col>
              <Col xs>
                <button className="btn btn-primary" onClick={this._createBusinessPlan} type="button" title="Crear plan de negocio" style={{marginTop: '21px'}}>
                  <i className="file text outline icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                </button>
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style= {{display:visibleTable, width: "100%"}}>
          <Row>
            <Col xs>
              <ListBusinessPlanComponent
                value1={this.state.value1}/>
              <PaginationBusinessPlanComponent
                value1={this.state.value1}/>
            </Col>
          </Row>
        </Grid>
        <Grid style= {{display:visibleMessage, width: "100%"}}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span></Col>
          </Row>
        </Grid>
        <ButtonDownloadBusinessPlanComponent visibleDownload={visibleDownload} />
       </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    businessPlanByClientFindServer,
    clearBusinessPlan,
    updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({businessPlanReducer , navBar}, ownerProps){
    return {
        businessPlanReducer,
        navBar
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(BusinessPlanComponent);
