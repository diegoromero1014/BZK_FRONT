import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {NUMERAL_MONTH} from '../constants';
import SweetAlert from 'sweetalert-react';
import {Combobox} from 'react-widgets';
import {consultInformationBusinessPlans, changeLoadChart} from '../actions';
import BarSeries from '../chartPipeline/barSeries';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import {RadialChart} from 'react-vis';

let defaultValueData = [{x: '', y: 0}];
var colors = ['#EF5D28', '#12939A', '#FF9833', '#1A3177', '#79C7E3', '#EF28BA', '#E57373', '#28EF5C', '#5C28EF', '#C83803', '#B0EF04', '#D32F2F'];
var dataBusiness = [
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')},
	{angle: 10, id:_.uniqueId('color_')}
];

class ViewChartBusinessPlan extends Component {

	constructor(props) {
	  super(props);
    this.state = {
      showErrorLoadChart: false,
			selectedNeed: ''
    };
    this._refreshChartBusiness = this._refreshChartBusiness.bind(this);
    this._mapNeeds = this._mapNeeds.bind(this);
    this.onSectionMouseOver = this.onSectionMouseOver.bind(this);
    this.onSectionMouseOut = this.onSectionMouseOut.bind(this);
	}

  _refreshChartBusiness(){

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
						<label style={{float:"left", padding: "0 0 -50px 3px"}}>acá esta esta esta esta esta esta</label>
					</div>
				</td>
			</tr>
  }

	componentWillMount() {
		const {consultInformationBusinessPlans} = this.props;
		consultInformationBusinessPlans(2016).then((response) => {
			console.log("response", response);
    }, (reason) => {
			console.log("reason", reason);
    })
	}

	render() {
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
					<Col xs={4} md={4} lg={4} style={{padding: "30px 0px 0px 30px"}}>
						<table style={{width:"100%"}}>
							<tbody>
								{dataBusiness.map(this._mapNeeds)}
							</tbody>
						</table>
					</Col>
          <Col xs={8} md={8} lg={8} style={{padding: "30px 0px 0px 50px"}}>
						<RadialChart onSectionMouseOver={this.onSectionMouseOver} onSectionMouseOut={this.onSectionMouseOut}
						  data={dataBusiness}
							colorRange={colors}
						  width={400}
						  height={400} />
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
		changeLoadChart
	}, dispatch);
};

function mapStateToProps({viewManagementReducer}, ownerProps) {
	return {
		viewManagementReducer
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewChartBusinessPlan);
