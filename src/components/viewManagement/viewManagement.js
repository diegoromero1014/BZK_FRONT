import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import {updateTitleNavBar} from '../navBar/actions';
import ItemChart from './ItemChart';
import {changeTabSeletedChartView} from './actions';
import ViewChartPipeline from './chartPipeline/viewChartPipeline';
import ViewChartPrevisit from './chartPrevisit/viewChartPrevisit';
import ViewChartVisit from './chartVisit/viewChartVisit';
import ViewChartBusinessPlan from './chartBusinessPlan/viewChartBusinessPlan';
import {TAB_PREVISIT, TAB_VISIT, TAB_PIPELINE, TAB_BUSINESS} from './constants';
import _ from 'lodash';

const itemsChart = [
  {
      text: "Previsitas",
      icon: "bar chart icon",
      styleColor: "#337ab7",
      tab: TAB_PREVISIT
  },
 {
      text: "Visitas",
      icon: "bar chart icon",
      styleColor: "#5cb85c",
      tab: TAB_VISIT
  },
  {
      text: "Pipeline",
      icon: "bar chart icon",
      styleColor: "#f0ad4e",
      tab: TAB_PIPELINE
  },
  {
      text: "Negocios",
      icon: "bar chart icon",
      styleColor: "#d9534f",
      tab: TAB_BUSINESS
  }

];

class ViewManagement extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    } else {
      const {changeTabSeletedChartView, updateTitleNavBar} = this.props;
      changeTabSeletedChartView(0);
      updateTitleNavBar("Vista gerencial");
    }
  }

  _mapChartItems(item, idx) {
      return <ItemChart
          key={idx}
          textValue={item.text}
          iconValue={item.icon}
          styleColor={item.styleColor}
          itemSeleted={item.tab}
      />
  }

  render(){
    const {viewManagementReducer} = this.props;
    const tabSeletedReducer = viewManagementReducer.get('tabSeleted');
    const isLoadChart = viewManagementReducer.get('loadChart');
    return(
      <div className="ui segment">
        <div style={{backgroundColor: "white"}}>
          <Row xs={12} md={12} lg={12} style={{padding: '15px 20px 10px 20px'}}>
            {itemsChart.map(this._mapChartItems)}
          </Row>
        </div>
        { tabSeletedReducer === TAB_PIPELINE && <ViewChartPipeline /> }
        { tabSeletedReducer === TAB_PREVISIT && <ViewChartPrevisit /> }
        { tabSeletedReducer === TAB_VISIT && <ViewChartVisit /> }
        { tabSeletedReducer === TAB_BUSINESS && <ViewChartBusinessPlan /> }
        {isLoadChart && tabSeletedReducer !== 0 &&
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Cargando gráfica</div>
          </div>
        }
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTitleNavBar,
    changeTabSeletedChartView
  }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar},ownerProps) {
  return {
    viewManagementReducer,
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewManagement);
