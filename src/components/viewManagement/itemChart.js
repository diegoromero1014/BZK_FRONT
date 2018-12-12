import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { changeTabSeletedChartView, getCsv, changeErrorYearSeleted } from './actions';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import SelectYearComponent from '../selectsComponent/selectFilterYear/selectYearComponent';
import { TYPE_YEAR, TAB_PREVISIT, TAB_VISIT, TAB_PIPELINE, TAB_BUSINESS, TAB_TASKS } from './constants';
import { APP_URL, MESSAGE_DOWNLOAD_DATA, DESCARGAR } from '../../constantsGlobal';
import ButtonDownloadModal from './buttonDownloadModal';
import { changeStateSaveData } from '../dashboard/actions';

var styles = {
  minHeight: "30px",
  height: "30px",
  margin: "0px",
  padding: "7px",
  minWidth: "30px",
  width: "150px"
};

class ItemChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valueYear: "",
      item: ""
    };
    momentLocalizer(moment);
  }

  _clickSectionChart(itemSeleted) {
    const {changeTabSeletedChartView} = this.props;
    changeTabSeletedChartView(itemSeleted);
  }

  _clickDownloadExcel(itemSeleted) {
    let year;
    let url;
    if (itemSeleted === TAB_PIPELINE) {
      year = this.state.valueYear !== '' ? this.state.valueYear : moment().year();
      url = '/getCsvPipeline';
    }
    if (year === undefined || year === null) {
      const {changeErrorYearSeleted} = this.props;
      changeErrorYearSeleted(true);
    } else {
      const {changeStateSaveData, getCsv} = this.props;
      changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
      getCsv(year, url, false, false, false).then(function (data) {
        changeStateSaveData(false, "");
        if (data.payload.data.status === 200) {
          window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
        }
      });
    }
  }

  render() {
    const {textValue, iconValue, itemSeleted, styleColor, reducerGlobal} = this.props;
    var styleBorderDownload = "1px solid " + styleColor;
    return (
      <Col xs={12} md={6} lg={3} style={{ padding: '0 15px 10px 15px' }}>
        <div style={{ color: 'white', backgroundColor: styleColor, borderColor: styleColor, borderRadius: '4px 4px 0px 0px', cursor: 'pointer' }}
          onClick={this._clickSectionChart.bind(this, itemSeleted)}>
          <div style={{ height: '100px' }} >
            <Row>
              <Col xs={6} md={4} lg={4} style={{ padding: '0 15px 10px 15px' }}>
                <i className={iconValue} style={{ fontSize: "60px", marginTop: '45px', marginLeft: "15px" }} />
              </Col>
              <Col xs={6} md={8} lg={8} style={{ padding: '0 15px 10px 15px' }}>
                <span
                  style={{ fontSize: "28px", float: 'right', marginTop: '40px', marginRight: "25px" }}>{textValue}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{
          color: 'white', backgroundColor: '#f5f5f5', borderColor: styleColor,
          borderRadius: '0px 0px 4px 4px', height: '40px', border: styleBorderDownload
        }}>
          {_.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) && itemSeleted != TAB_TASKS &&
            <SelectYearComponent idTypeFilter={TYPE_YEAR} config={{ onChange: (value) => this.setState({ valueYear: value.id }) }} />
          }
          {itemSeleted === TAB_VISIT && _.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) &&
            <ButtonDownloadModal year={this.state.valueYear} itemSeleted={itemSeleted} />
          }
          {itemSeleted === TAB_PIPELINE && _.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) &&
            <i className='green file excel outline icon' title="Descargar información en Excel" onClick={this._clickDownloadExcel.bind(this, itemSeleted)}
              style={{ fontSize: "18px", float: 'right', marginTop: '10px', marginRight: "5px", cursor: 'pointer' }} />
          }
          {itemSeleted === TAB_PREVISIT && _.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) &&
            <ButtonDownloadModal year={this.state.valueYear} itemSeleted={itemSeleted} />
          }
          {itemSeleted === TAB_BUSINESS && _.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) &&
            <ButtonDownloadModal year={this.state.valueYear} itemSeleted={itemSeleted} />
          }
          {itemSeleted === TAB_TASKS && _.get(reducerGlobal.get('permissionsManagerialView'), _.indexOf(reducerGlobal.get('permissionsManagerialView'), DESCARGAR), false) &&
            <ButtonDownloadModal year={this.state.valueYear} itemSeleted={itemSeleted} />
          }
        </div>
      </Col>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeTabSeletedChartView,
    changeStateSaveData,
    changeErrorYearSeleted,
    getCsv
  }, dispatch);
}

function mapStateToProps({viewManagementReducer, reducerGlobal}, ownerProps) {
  return {
    viewManagementReducer,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemChart);
