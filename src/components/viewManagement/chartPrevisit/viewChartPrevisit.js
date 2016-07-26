import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectFilter from '../../selectsComponent/selectFilterContact/selectFilterComponent';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {NUMERAL_MONTH} from '../constants';
import SweetAlert from 'sweetalert-react';
import {Combobox} from 'react-widgets';
import {consultInformationPrevisit, changeLoadChart} from '../actions';
import BarSeries from '../chartPipeline/barSeries';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

let defaultValueData = [{x: '', y: 0}];

/**
 * 
 * @extends Component
 */
class ViewChartPrevisit extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	showErrorLoadChart: false,
	  	data: defaultValueData,
	  	labels: ['0']
	  };

	  this._refreshChart = this._refreshChart.bind(this);
	  this._consultInfoPrevisit = this._consultInfoPrevisit.bind(this);
	}

	componentWillMount() {
		console.log('componentWillMount');
		this._consultInfoPrevisit();
	}

	_refreshChart() {
		console.log('_refreshChart');
		this._consultInfoPrevisit();
	}

	_consultInfoPrevisit() {
		console.log('_consultInfoPrevisit');
		const { consultInformationPrevisit, changeLoadChart } = this.props;
		changeLoadChart(true);
		this.setState({data: defaultValueData});
		consultInformationPrevisit().then((response) => {
			changeLoadChart(false);
			console.log('response -> ', response);
			if ( (_.get(response, 'payload.data.validateLogin') == 'false') ) {
				redirectUrl("/login");
			} else {
				if ( (_.get(response, 'payload.data.status') == 500) ) {
					this.setState({showErrorLoadChart: true});
				} else {
					let dataListComplete = [];
					let dataAux = [];
					_.map(_.get(response, 'payload.data.data.hashValues'), objects => {
						let monthSum = 0;
						console.log('objects -> ', objects);
						objects.forEach(function(object) {
							console.log('object -> ', object);
							let date = moment(object[0], 'YYYY-MM').locale('es').format('YYYY MMM');
							console.log('date -> ', date);
							dataAux.push({x: date, y: object[1]});
							console.log('dataAux -> ', dataAux);
							if (monthSum === NUMERAL_MONTH) {
								monthSum = 0;
								dataListComplete.push(dataAux);
								dataAux = [];
							}
							monthSum++;
						});
					});
					const labels = _.chain(response).get('payload.data.data.hashValues.PUBLISHED', {0: []}).keys().value();
					console.log('labels -> ', labels);
					console.log('dataListComplete -> ', dataListComplete);
					this.setState({data: dataListComplete, labels: labels});
				}
			}
		}, (reason) => {
			changeLoadChart(false);
			this.setState({showErrorLoadChart: true});
		});
	}

	render() {
		console.log('render');
		const {data, labels} = this.state;
		return (
			<Row xs={12} md={12} lg={12}>
				<Col xs={12} md={12} lg={12} style={{backgroudColor: "white", paddingTop: '20px', paddingBottom: '20px', display: 'block'}}>
					<Col xs={12} md={12} lg={12} className="div-head-chart" style={{paddingTop: '5px'}}>
						<span style={{paddingTop: '10px', fontSize: '22px'}}>Informe de previsita</span>
						<a style={{float: 'right', cursor: 'pointer', textDecoration: 'underline', marginTop: '3px'}}
							onClick={this._refreshChart}>Regrescar gráfica</a>
					</Col>
					<Col xs={12} md={12} lg={12} className="div-body-chart modalBt4-body" style={{height: '430px'}}>
						<BarSeries items={data} defaultData={defaultValueData} labels={labels} />
					</Col>
				</Col>
				<SweetAlert
					type='error'
					show={this.state.showErrorLoadChart}
					title="Error cargando información"
					text="Señor usuario, ocurrió un error tratando de consultar la información del reporte de previsita, por favor intente de nuevo."
					onConfirm={() => this.setState({showErrorLoadChart: false})}
				/>
			</Row>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		consultInformationPrevisit,
		changeLoadChart
	}, dispatch);
};

function mapStateToProps({viewManagementReducer}, ownerProps) {
	return {
		viewManagementReducer
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewChartPrevisit);
