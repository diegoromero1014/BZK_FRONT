import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectFilter from '../../selectsComponent/selectFilterContact/selectFilterComponent';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {NUMERAL_MONTH} from '../constants';
import {PIPELINE_STATUS} from '../../selectsComponent/constants';
import {redirectUrl} from '../../globalComponents/actions';
import SweetAlert from 'sweetalert';
import {Combobox} from 'react-widgets';
import {consultInformationPipeline, consultCurrencys, changeLoadChart} from '../actions';
import BarSeries from './barSeries';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

var colors = [];
var defaultValueData = [{x: '', y: 0}];

class ViewChartPipeline extends Component{
  constructor(props) {
    super(props);
    this.state = {
      statePipelineValue: null,
      idCurrency: null,
      showErrorLoadChart: false,
      data: defaultValueData,
      labels: ["0"],
      contValues: ["0"]
    };
    this._changeStatePipeline = this._changeStatePipeline.bind(this);
    this._consultInfoPipeline = this._consultInfoPipeline.bind(this);
    this._refreshChartPipeline = this._refreshChartPipeline.bind(this);
    this._changeCurrency = this._changeCurrency.bind(this);
  }

  _changeStatePipeline(value){
    this.setState({
      statePipelineValue: value
    });
    this._consultInfoPipeline(value.id, this.state.idCurrency);
  }

  _changeCurrency(value){
    this.setState({
      idCurrency: value
    });
    const idStatus = this.state.statePipelineValue === null || this.state.statePipelineValue === undefined ? null : this.state.statePipelineValue.id;
    this._consultInfoPipeline(idStatus, value);
  }

  componentWillMount(){
    const {selectsReducer, getMasterDataFields, consultCurrencys} = this.props;
    this._consultInfoPipeline(null, null);
    consultCurrencys().then((data) => {
      if( !_.get(data, 'payload.data.validateLogin') ){
        redirectUrl("/login");
      }
    });
  }

  _refreshChartPipeline(){
    const {selectsReducer, getMasterDataFields} = this.props;
    var id = this.state.statePipelineValue === null || this.state.statePipelineValue === undefined || this.state.statePipelineValue === '' ? null: this.state.statePipelineValue.id;
    this._consultInfoPipeline(id);
  }

  _consultInfoPipeline(idStatus, idCurrency){
    const {consultInformationPipeline, changeLoadChart} = this.props;
    changeLoadChart(true);
    this.setState({ data: defaultValueData});
    consultInformationPipeline(idStatus, idCurrency).then((response) => {
      changeLoadChart(false);
      if((_.get(response, 'payload.data.validateLogin') === 'false')){
        redirectUrl("/login");
      } else {
        if((_.get(response, 'payload.data.status') === 500)){
          this.setState({showErrorLoadChart :true});
        } else {
          var dataListComplete = [];
          var dataAux = [];
          _.map(_.get(response, 'payload.data.data.hashValuesPipeline'), objects => {
            var monthSum = 0;
            objects.forEach(function(object){
              var fecha = moment(object[0], 'YYYY-MM').locale('es').format('YYYY MMM');
              dataAux.push({x: fecha, y: object[1], z: object[2]});
              if( monthSum === NUMERAL_MONTH ){
                monthSum = 0;
                dataListComplete.push(dataAux);
                dataAux = [];
              }
              monthSum++;
            });
          });
          const labels = _.chain(response).get('payload.data.data.hashValuesPipeline', {0:[]}).keys().value();
          this.setState({ data: dataListComplete, labels: labels});
        }
      }
    }, (reason) => {
      changeLoadChart(false);
      this.setState({showErrorLoadChart :true});
    })
  }

  render(){
    const {selectsReducer, viewManagementReducer} = this.props;
    const {data, labels} = this.state;
    return(
      <Row xs={12} md={12} lg={12}>
        <Col xs={12} md={12} lg={12} style={{backgroundColor: "white", paddingTop: '20px', paddingBottom: '20px', display: 'block'}}>
          <Col xs={12} md={12} lg={12} className="div-head-chart" style={{paddingTop: '5px'}}>
            <span style={{paddingTop: '10px', fontSize: '22px'}}> Informe de pipeline </span>
            <a style={{float: 'right', cursor: 'pointer',textDecoration: 'underline', marginTop: '3px'}}
                onClick={this._refreshChartPipeline}>Refrescar gráfica</a>
          </Col>
          <Col xs={12} md={12} lg={12} className="div-body-chart modalBt4-body" style={{height: '430px'}}>
            <Col xs={6} md={6} lg={6} style={{marginBottom: "10px", float: 'right'}}>
              <div style={{textAlign: 'left'}}>
                <dt><span>Estado</span></dt>
              </div>
              <dt style={{textAlign: 'left'}}>
                <SelectFilter
                  onChange={val => this._changeStatePipeline(val)}
                  idTypeFilter={PIPELINE_STATUS}
                />
              </dt>

              <div style={{textAlign: 'left', marginTop: "15px"}}>
                <dt><span>Moneda</span></dt>
              </div>
              <dt style={{textAlign: 'left'}}>
                <Combobox
                  valueField='id'
                  textField='code'
                  data={viewManagementReducer.get('valuesCurrency')}
                  onChange={val => this._changeCurrency(val.id)}
                  minLength={3}
                  filter='contains'
                />
              </dt>
            </Col>
            <BarSeries items={data} defaultData={defaultValueData} labels={labels}/>
          </Col>
        </Col>
        <SweetAlert
         type='error'
         show={this.state.showErrorLoadChart}
         title="Error cargando información"
         text="Señor usuario, ocurrió un error tratando de consultar la información del reporte de pipeline, por favor intente de nuevo."
         onConfirm={() => this.setState({showErrorLoadChart: false })}
         />
      </Row>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    consultInformationPipeline,
    consultCurrencys,
    changeLoadChart,
    redirectUrl
  }, dispatch);
}

function mapStateToProps({selectsReducer, viewManagementReducer},ownerProps) {
  return {
    selectsReducer,
    viewManagementReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewChartPipeline);
