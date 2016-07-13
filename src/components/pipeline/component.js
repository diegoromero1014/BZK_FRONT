import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import {NUMBER_RECORDS,FILTER_STATUS_PIPELINE_ID} from './constants';
import {pipelineByClientFindServer,clearPipeline} from './actions';
import ListPipelineComponent from './listPipelineComponent';
import PaginationPipelineComponent from './paginationPipelineComponent';
import {updateTitleNavBar} from '../navBar/actions';
import ButtonDownloadPipelineComponent from './downloadPipeline/buttonDownloadPipelineComponent';

class PipelineComponent extends Component {

  constructor(props){
    super(props);
    this.state= {
       value1: ""
    };
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }else{
      const {pipelineByClientFindServer,clearPipeline} = this.props;
      clearPipeline();
      pipelineByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,"pe.startDate",1,"");
    }
  }


  render() {
    const {pipelineReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    let visibleDownload = 'none';
    if(pipelineReducer.get('rowCount') !== 0){
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
          idTypeFilter={FILTER_STATUS_PIPELINE_ID}/>
          </Col>
          <Col xs>
          <button className="btn btn-primary" type="button" title="Crear pipeline" style={{marginTop: '21px'}}>
            <i className="file text outline icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
          </button>
        </Col>
          </Row>
        </Grid>
        </div>
          <Grid style= {{display:visibleTable, width: "100%"}}>
            <Row>
              <Col xs>
              <ListPipelineComponent
                value1={this.state.value1}/>
                <PaginationPipelineComponent
                  value1={this.state.value1}/>
              </Col>
            </Row>
          </Grid>
          <Grid style= {{display:visibleMessage, width: "100%"}}>
            <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span></Col>
            </Row>
          </Grid>
          <ButtonDownloadPipelineComponent visibleDownload={visibleDownload}/>
       </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    pipelineByClientFindServer,
    clearPipeline,
    updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({pipelineReducer, navBar}, ownerProps){
    return {
        pipelineReducer,
        navBar
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(PipelineComponent);
