import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import GridComponent from '../grid/component';

import { previsitByClientFindServer, orderColumnPrevisit, clearPrevisitOrder } from './actions';

import { NUMBER_RECORDS, DELETE_TYPE_PREVISIT } from './constants';
import { ELIMINAR } from '../../constantsGlobal';
import { MODULE_PREVISIT } from '../grid/constants';

let v1 = '';

class ListPrevisitComponent extends Component {

	constructor(props) {
		super(props);
		this._renderCellView = this._renderCellView.bind(this);
		this._renderHeaders = this._renderHeaders.bind(this);
		this.state = {
			column: '',
			order: '',
			orderA: 'none',
			orderD: 'inline-block'
		};
	}

	componentWillMount() {
		this.state = {
			orderA: 'none',
			orderD: 'inline-block'
		};
	}

	componentWillReceiveProps(nextProps) {
		if ((v1 !== nextProps.value1)) {
			v1 = nextProps.value1;
			const { clearPrevisitOrder } = this.props;
			clearPrevisitOrder();
			this._orderColumn(1, 'pvd.visitTime');
		}
	}

	_orderColumn(orderPrevisit, columnPrevisit) {
		if (orderPrevisit === 1) {
			this.setState({ orderA: 'none', orderD: 'inline-block' });
		} else {
			this.setState({ orderA: 'inline-block', orderD: 'none' });
		}
		const { previsitByClientFindServer, orderColumnPrevisit, clearPrevisitOrder } = this.props;
		clearPrevisitOrder();
		orderColumnPrevisit(orderPrevisit, columnPrevisit);
		previsitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, columnPrevisit, orderPrevisit, v1);
	}

	_renderHeaders() {
		return [{
			title: "",
			key: "actionsRedirect"
		},
		{
			title: "Tipo de reunión",
			key: "typePrevisit"
		}, {
			title: "Fecha de reunión",
			key: "datePrevisitFormat",
			orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(0, "pvd.visitTime")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(1, "pvd.visitTime")}></i></span>
		}, {
			title: "Estado del documento",
			key: "statusDocument"
		}, {
			title: "",
			key: "delete"
		}]
	}

	_renderCellView(data) {
		const mensaje = "Señor usuario ¿está seguro que desea eliminar el informe de previsita?";
		const { reducerGlobal } = this.props;
		var permissionsPrevisits = reducerGlobal.get('permissionsPrevisits');
		return _.forOwn(data, function (value, key) {
			let json1 = {
				'messageHeader': {
					'sessionToken': window.localStorage.getItem('sessionTokenFront'),
					'timestamp': new Date().getTime(),
					'service': '',
					'status': '0',
					'language': 'es',
					'displayErrorMessage': '',
					'technicalErrorMessage': '',
					'applicationVersion': '',
					'debug': true,
					'isSuccessful': true
				},
				'messageBody': {
					'entity': 'PRE_VISIT',
					'id': value.id
				}
			};
			_.set(value, 'actionsRedirect', {
				actionView: true,
				id: value.id,
				typeClickDetail: MODULE_PREVISIT,
				ownerDraft: value.idStatusDocument,
				urlRedirect: '/dashboard/previsitaEditar',
				component: 'VIEW_PREVISIT'
			});
			let datePrevisitFormat = moment(value.datePrevisit).locale('es');
			_.set(value, 'datePrevisitFormat', datePrevisitFormat.format('DD') + ' ' + datePrevisitFormat.format('MMM')
				+ ' ' + datePrevisitFormat.format('YYYY') + ', ' + datePrevisitFormat.format('hh:mm a'));

			if (_.get(permissionsPrevisits, _.indexOf(permissionsPrevisits, ELIMINAR), false)) {
				if (value.idStatusDocument === 0) {
					_.set(value, 'delete', {
						actionDelete: true,
						urlServer: '/deleteEntity',
						typeDelete: DELETE_TYPE_PREVISIT,
						mensaje: mensaje,
						json: json1
					});
				}
			}
		});
	}

	render() {
		const modalTitle = 'Vista Detalle';
		const { previsitReducer } = this.props;
		const data = previsitReducer.get('previsitList');
		return (
			<div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll' }}>
				<GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		previsitByClientFindServer, orderColumnPrevisit, clearPrevisitOrder
	}, dispatch);
}

function mapStateToProps({ previsitReducer, reducerGlobal }, ownerProps) {
	return {
		previsitReducer,
		reducerGlobal
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPrevisitComponent);