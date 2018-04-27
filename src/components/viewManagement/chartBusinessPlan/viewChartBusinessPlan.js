import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {NUMERAL_MONTH} from '../constants';
import SweetAlert from '../../sweetalertFocus';
import {consultInformationBusinessPlans, changeLoadChart} from '../actions';
import BarSeries from '../barSeries';
import SelectYearComponent from '../../selectsComponent/selectFilterYear/selectYearComponent';
import {redirectUrl} from '../../globalComponents/actions';
import {Combobox} from 'react-widgets';
import {TYPE_YEAR} from '../constants';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import {RadialChart} from 'react-vis';

let defaultValueData = [{x: '', y: 0}];
var colors = ['#EF5D28', '#12939A', '#FF9833', '#1A3177', '#79C7E3', '#EF28BA', '#E57373', '#28EF5C', '#5C28EF', '#C83803', '#B0EF04', '#D32F2F'];
var numberBusinessPlans = 0;

var data = [];
var i;
for(i = moment('01-01-2015').year();i <= moment().year(); i++){
	var year = {};
	year.id = i + "";
	year.value = i + "";
	data.push(year);
}

class ViewChartBusinessPlan extends Component {

	constructor(props) {
	  super(props);
    this.state = {
      showErrorLoadChart: false,
			selectedNeed: '',
	    valueYear: moment().year(),
			dataBusiness: []
    };
    this._refreshChartBusiness = this._refreshChartBusiness.bind(this);
    this._mapNeeds = this._mapNeeds.bind(this);
    this.onSectionMouseOver = this.onSectionMouseOver.bind(this);
    this.onSectionMouseOut = this.onSectionMouseOut.bind(this);
		this._consultInfoBusinessPlan = this._consultInfoBusinessPlan.bind(this);
    this._onChangeYear = this._onChangeYear.bind(this);
	}

  _refreshChartBusiness(){
  	this._consultInfoBusinessPlan(this.state.valueYear);
  }

	onSectionMouseOver(data){
    this.setState({selectedNeed: data.id});
	}

	onSectionMouseOut(data){
    this.setState({selectedNeed: ''});
	}

  _mapNeeds(item, idx) {
      return <tr key={idx}>
				<td>
					<div style={{ width:"100%", backgroundColor:this.state.selectedNeed === item.id ? "#E9E8E8" : "#FFFFFF", height:"22px", paddingLeft:"4px", paddingRight:"5px"}}>
						<div style={{backgroundColor:colors[idx], height:"12px", width:"12px", borderRadius:"2px", float:"left", marginTop:"5px", marginRight:"4px"}}></div>
						<label style={{float:"left", padding: "0 0 -50px 3px"}}><b>{item.need}:</b> {item.angle} Reg. - {item.percentageNeed}%</label>
					</div>
				</td>
			</tr>
  }

	_consultInfoBusinessPlan(year){
    const {consultInformationBusinessPlans, changeLoadChart} = this.props;
		var dataBusinessAux = [];
		numberBusinessPlans = 0;
    changeLoadChart(true);
		consultInformationBusinessPlans(year).then((response) => {
			if ( !_.get(response, 'payload.data.validateLogin') ) {
				redirectUrl("/login");
			} else {
				var data = response.payload.data.data;
				var listNeeds = data.listNeeds;
				numberBusinessPlans = data.numberBusinessPlans;
				if(listNeeds != null && listNeeds != '' && listNeeds !== undefined){
					listNeeds.forEach(function(need){
						dataBusinessAux.push({
							angle: need[1],
							id:_.uniqueId('color_'),
							percentageNeed: need[2],
							need: need[0]
						});
					});
				}
				this.setState({
					dataBusiness: dataBusinessAux,
					valueYear: year
				});
			}
			changeLoadChart(false);
    }, (reason) => {
      changeLoadChart(false);
    });
	}

  _onChangeYear(value){
		var year = moment().year();
		if(value !== undefined){
			year = value;
		}
		this.setState({valueYear: year});
		this._consultInfoBusinessPlan(year);
  }

	componentWillMount() {
  	this._consultInfoBusinessPlan(moment().year());
	}

	render() {
		var styleCombo = {width:"120px", minWidth: "30px"};
		return (
			<div>
				<Row xs={12} md={12} lg={12}>
	        <Col xs={12} md={12} lg={12} style={{backgroundColor: "white", paddingTop: '20px', display: 'block'}}>
	          <Col xs={12} md={12} lg={12} className="div-head-chart" style={{paddingTop: '5px'}}>
	            <span style={{paddingTop: '10px', fontSize: '22px'}}> Informe de plan de negocio </span>
	            <a style={{float: 'right', cursor: 'pointer',textDecoration: 'underline', marginTop: '3px'}}
	                onClick={this._refreshChartBusiness}>
									Refrescar gráfica
							</a>
	          </Col>
	        </Col>
 	      </Row>
				<Row xs={12} md={12} lg={12} className="div-body-radial-chart" style={{height: '430px', margin: "-1px 30px 10px 30px"}}>
					<Col xs={12} md={12} lg={5} style={{padding: "30px 0px 0px 30px"}}>
						<p style={{paddingBottom: "5px", fontSize:"18px"}}><b>Número de planes de negocio:</b> {numberBusinessPlans}</p>
						<table style={{width:"100%"}}>
							<tbody>
								{this.state.dataBusiness.map(this._mapNeeds)}
							</tbody>
						</table>
					</Col>
          <Col xs={12} md={12} lg={5} style={{padding: "30px 0px 0px 50px"}}>
						<RadialChart onSectionMouseOver={this.onSectionMouseOver} onSectionMouseOut={this.onSectionMouseOut}
						  data={this.state.dataBusiness}
							colorRange={colors}
						  width={400}
						  height={400} />
          </Col>
					<Col xs={6} md={6} lg={2} style={{marginTop: "10px"}}>
						<div style={{textAlign: 'left'}}>
							<dt><span style={{marginLeft:"5px"}}>Año</span></dt>
						</div>
						<dt style={{textAlign: 'left'}}>
							<Combobox
								valueField='id'
								textField='value'
                data={data}
                onChange={val => this._onChangeYear(val.id)}
								minLength={3}
								filter='contains'
							/>
						</dt>
					</Col>
	      </Row>
				<SweetAlert
				 type='error'
				 show={this.state.showErrorLoadChart}
				 title="Error cargando información"
				 text="Señor usuario, ocurrió un error tratando de consultar la información del reporte de pipeline, por favor intente de nuevo."
				 onConfirm={() => this.setState({showErrorLoadChart: false })}
				 />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		consultInformationBusinessPlans,
		changeLoadChart,
		redirectUrl
	}, dispatch);
};

function mapStateToProps({viewManagementReducer}, ownerProps) {
	return {
		viewManagementReducer
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewChartBusinessPlan);
