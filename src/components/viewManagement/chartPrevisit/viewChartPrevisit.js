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
 * Componente que consulta y grafica las previsitas que estan guardadas como definitivo
 * y agrupadas por mes desde el mes actual hasta seis meses atras.
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
		this._consultInfoPrevisit();
	}

	/**
	 * Función para refrescar la gráfica al momento de seleccionar la opción de refrescar en la interfaz.
	 */
	_refreshChart() {
		this._consultInfoPrevisit();
	}

	/**
	 * Función para llamar al action de previsitas y graficar los datos en la gráfica de previsitas.
	 */
	_consultInfoPrevisit() {
		const { consultInformationPrevisit, changeLoadChart } = this.props;
		changeLoadChart(true);
		this.setState({data: defaultValueData});
		consultInformationPrevisit().then((response) => {
			changeLoadChart(false);
			if ( (_.get(response, 'payload.data.validateLogin') === 'false') ) {
				redirectUrl("/login");
			} else {
				if ( (_.get(response, 'payload.data.status') === 500) ) {
					this.setState({showErrorLoadChart: true});
				} else {
					let dataListComplete = [];
					let dataAux = [];
					_.map(_.get(response, 'payload.data.data.hashValues'), objects => {
						let monthSum = 0;
						objects.forEach(function(object) {
							let date = moment(object[0], 'YYYY-MM').locale('es').format('YYYY MMM');
							dataAux.push({x: date, y: object[1]});
							if (monthSum === NUMERAL_MONTH) {
								monthSum = 0;
								dataListComplete.push(dataAux);
								dataAux = [];
							}
							monthSum++;
						});
					});
					const labels = _.chain(response).get('payload.data.data.hashValues.PUBLISHED', {0: []}).keys().value();
					this.setState({data: dataListComplete, labels: labels});
				}
			}
		}, (reason) => {
			changeLoadChart(false);
			this.setState({showErrorLoadChart: true});
		});
	}

	render() {
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
