import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {APP_URL} from '../../../constantsGlobal';
import {getCsvBusinessPlanByClient, clearBusinessPlan} from '../actions'

class ButtonDownloadBusinessPlanComponent extends Component {

	constructor(props) {
	  super(props);
		this._downloadPBusinessPlan = this._downloadPBusinessPlan.bind(this);
	}

	_downloadPBusinessPlan() {
		const {getCsvBusinessPlanByClient, clearBusinessPlan} = this.props;
		getCsvBusinessPlanByClient(window.localStorage.getItem('idClientSelected')).then(function(data) {
			if (data.payload.data.status === 200) {
				window.open(APP_URL + '/getCsvReport?filename=' + data.payload.data.data, '_blank');
			}
		});
	}

	render() {
		const {visibleDownload} = this.props;
		return (
			<div style={{display:visibleDownload, marginLeft: '-20px', position: 'fixed', border: '1px solid rgb(194, 194, 194)', bottom: '0px', width: '100%', marginBottom: '0px', height: '50px', background: 'rgba(255, 255, 255, 0.74902)'}}>
				<div style={{width: '580px', height: '100%', position: 'fixed', right: '0px'}}>
					<button className="btn" style={{float: 'right', margin: '8px 0px 0px 400px', position: 'fixed'}} title={'Exportar en formato CSV'} onClick={this._downloadPBusinessPlan}>
						<span style={{color: '#FFFFFF', padding: '10px'}}>{'Descargar '}<i className="file excel outline icon"></i></span>
					</button>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCsvBusinessPlanByClient, clearBusinessPlan
  }, dispatch);
}

function mapStateToProps({businessPlanReducer}, ownerProps) {
    return {
        businessPlanReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDownloadBusinessPlanComponent);
