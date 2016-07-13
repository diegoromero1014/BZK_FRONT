import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectFilter from '../../selectsComponent/selectFilterContact/selectFilterComponent';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {PIPELINE_STATUS} from '../../selectsComponent/constants';
import {XYPlot, XAxis, YAxis, VerticalGridLines, VerticalBarSeries , HorizontalGridLines,
  LineSeries, Crosshair} from 'react-vis';
import SweetAlert from 'sweetalert-react';
import {consultInformationPipeline} from '../actions';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

class ViewChartPipeline extends Component{
  constructor(props) {
    super(props);
    this.state = {
      crosshairValues: [],
      statePipelineValue: null,
      showErrorLoadChart: false,
      data: [{x: '', y: 0}]
    };
    this._changeStatePipeline = this._changeStatePipeline.bind(this);

    this._crosshairValues = [];
    this._consultInfoPipeline = this._consultInfoPipeline.bind(this);
    this._refreshChartPipeline = this._refreshChartPipeline.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onNearestXs = [ this._onNearestX.bind(this, 0) ];
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(seriesIndex, value) {
    this._crosshairValues = this._crosshairValues.concat();
    this._crosshairValues[seriesIndex] = value;
    value.y = '$' + numeral(value.y).format('0,000');
    this.setState({crosshairValues: this._crosshairValues});
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this._crosshairValues = [];
    this.setState({crosshairValues: this._crosshairValues});
  }

  _changeStatePipeline(value){
    this.setState({
      statePipelineValue: value
    });
    this._consultInfoPipeline(value.id);
  }

  componentWillMount(){
    const {selectsReducer, getMasterDataFields} = this.props;
    this._consultInfoPipeline(null);
  }

  _refreshChartPipeline(){
    const {selectsReducer, getMasterDataFields} = this.props;
    var id = this.state.statePipelineValue === null || this.state.statePipelineValue === undefined || this.state.statePipelineValue === '' ? null: this.state.statePipelineValue.id;
    this._consultInfoPipeline(id);
  }

  _consultInfoPipeline(idstatus){
    const {consultInformationPipeline} = this.props;
    consultInformationPipeline(idstatus).then((response) => {
      if((_.get(response, 'payload.data.validateLogin') === 'false')){
        redirectUrl("/login");
      } else {

        if((_.get(response, 'payload.data.status') === 500)){
          this.setState({showErrorLoadChart :true});
        } else {

          var dataAux = [];
          _.map(_.get(response, 'payload.data.data.listValoresPipeline'), object => {
            var fecha = moment(object[0], 'YYYY-MM').locale('es').format('YYYY MMM');
            dataAux.push({x: fecha + " (" + object[2] + " reg.)", y: object[1]});
          });
          this.setState({
            data: dataAux
          });

        }
      }
    }, (reason) => {
      this.setState({showErrorLoadChart :true});
    })
  }

  render(){
    const {selectsReducer} = this.props;
    return(
      <Row xs={12} md={12} lg={12}>
        <Col xs={12} md={12} lg={12} style={{backgroundColor: "white", paddingTop: '20px', paddingBottom: '20px', display: 'block'}}>
          <Col xs={12} md={12} lg={12} className="div-head-chart" style={{paddingTop: '5px'}}>
            <span style={{paddingTop: '10px', fontSize: '22px'}}> Informe de pipeline </span>
            <a style={{float: 'right', cursor: 'pointer',textDecoration: 'underline', marginTop: '3px'}}
                onClick={this._refreshChartPipeline}>Refrescar gráfica</a>
          </Col>
          <Col xs={12} md={12} lg={12} className="div-body-chart modalBt4-body" style={{height: '430px'}}>
            <Col xs={6} md={6} lg={6} style={{marginBottom: "10px"}}>
              <div style={{textAlign: 'left'}}>
                <dt><span>Estado</span></dt>
              </div>
              <dt style={{textAlign: 'left'}}>
                <SelectFilter
                  onChange={val => this._changeStatePipeline(val)}
                  idTypeFilter={PIPELINE_STATUS}
                />
              </dt>
            </Col>
            <div style={{overflowX: 'auto'}}>
              <XYPlot
                onMouseLeave={this._onMouseLeave}
                margin={{left:80, top: 20, right: 20, bottom: 40}}
                xType="ordinal"
                width={900}
                height={350}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                  onNearestX={this._onNearestXs[0]}
                  data={this.state.data}/>
                  <Crosshair values={this.state.crosshairValues}/>
              </XYPlot>
            </div>
          </Col>
        </Col>
        <SweetAlert
         type='error'
         show={this.state.showErrorLoadChart}
         title="Error cargando información"
         text="Señor usuario, ocurrió un error tratando de consultar la información del reporte de Pipeline, por favor intente de nuevo."
         onConfirm={() => this.setState({showErrorLoadChart: false })}
         />
      </Row>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    consultInformationPipeline
  }, dispatch);
}

function mapStateToProps({selectsReducer},ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewChartPipeline);
