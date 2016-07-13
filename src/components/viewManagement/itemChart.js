import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {changeTabSeletedChartView} from './actions';

class ItemChart extends Component{

  constructor(props){
    super(props);
  }

  _clickSectionChart(itemSeleted){
    const {changeTabSeletedChartView} = this.props;
    changeTabSeletedChartView(itemSeleted);
  }

  _clickDownloadExcel(itemSeleted){
    console.log("itemSeleted download", itemSeleted);
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
          <i className='green file excel outline icon'
            title="Descargar información en formato CSV"
            onClick={this._clickDownloadExcel.bind(this, itemSeleted)}
            style={{fontSize: "18px", marginLeft: "20px", float: 'right', marginTop: '10px', marginRight: "5px", cursor: 'pointer'}}/>
        </div>
      </Col>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeTabSeletedChartView
  }, dispatch);
}

function mapStateToProps({viewManagementReducer},ownerProps) {
  return {
    viewManagementReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemChart);
