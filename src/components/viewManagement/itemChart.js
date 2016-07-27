import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {changeTabSeletedChartView,getCsv} from './actions';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import SelectYearComponent from '../selectsComponent/selectFilterYear/selectYearComponent';
import {TYPE_YEAR,TAB_PREVISIT, TAB_VISIT, TAB_PIPELINE, TAB_BUSINESS} from './constants';
import {APP_URL} from '../../constantsGlobal';

class ItemChart extends Component{

  constructor(props){
    super(props);
    this.state= {
    valueyear: "",
    item : ""};
    momentLocalizer(moment);
  }

  _clickSectionChart(itemSeleted){
    const {changeTabSeletedChartView} = this.props;
    changeTabSeletedChartView(itemSeleted);
  }

  _clickDownloadExcel(itemSeleted){
   let year;
   let url;
    if(itemSeleted === TAB_PIPELINE){
       year = this.state.valueyear !== '' ? this.state.valueyear : moment().year();
       url = '/getCsvPipeline';
    }else if(itemSeleted === TAB_VISIT){
      year = this.state.valueyear !== '' ? this.state.valueyear : moment().year();
      url = '/getCsvVisits';
    }
    const {getCsv} = this.props;
    getCsv(year,url).then(function(data) {
      if (data.payload.data.status === 200) {
        window.open(APP_URL + '/getCsvReport?filename=' + data.payload.data.data, '_blank');
      }
    });
  }

  render(){
    const {textValue, iconValue, itemSeleted, styleColor} = this.props;
    var styleBorderDownload = "1px solid " + styleColor;
    return(
      <Col xs={12} md={6} lg={3} style={{padding: '10px 15px 10px 15px'}}>
        <div style={{color: 'white', backgroundColor: styleColor, borderColor: styleColor, borderRadius: '4px 4px 0px 0px', cursor: 'pointer'}}
          onClick={this._clickSectionChart.bind(this, itemSeleted)}>
          <div style={{height: '100px'}} >
            <i className={iconValue} style={{fontSize: "60px", marginTop: '45px', marginLeft: "15px"}}/>
            <span style={{fontSize: "30px", float: 'right', marginTop: '40px', marginRight: "25px"}} >{textValue}</span>
          </div>
        </div>
        <div
          style={{color: 'white', backgroundColor: '#f5f5f5', borderColor: styleColor,
          borderRadius: '0px 0px 4px 4px', height: '40px', border: styleBorderDownload}}>
          <SelectYearComponent idTypeFilter={TYPE_YEAR} config={{
              onChange: (value) => this.setState({valueyear: value.id, item:itemSeleted})
          }}/>
          <i className='green file excel outline icon'
            title="Descargar información en formato CSV"
            onClick={this._clickDownloadExcel.bind(this, itemSeleted)}
            style={{fontSize: "18px", float: 'right', marginTop: '10px', marginRight: "5px", cursor: 'pointer'}}/>
        </div>
      </Col>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeTabSeletedChartView,
    getCsv
  }, dispatch);
}

function mapStateToProps({viewManagementReducer},ownerProps) {
  return {
    viewManagementReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemChart);
