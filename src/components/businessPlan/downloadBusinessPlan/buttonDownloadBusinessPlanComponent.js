import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCsvBusinessPlan, getCsvBusinessPlanByClient} from '../actions';
import {APP_URL, MESSAGE_DOWNLOAD_DATA} from '../../../constantsGlobal';
import {changeStateSaveData} from '../../main/actions';

class ButtonDownloadBusinessPlanComponent extends Component {

	constructor(props) {
	  super(props);
	  this._downloadBusinessPlans = this._downloadBusinessPlans.bind(this);
	}

	_downloadBusinessPlans() {
		const {changeStateSaveData, getCsvBusinessPlanByClient, itemSeletedModal, yearModal, getCsvBusinessPlan} = this.props;
		changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
		getCsvBusinessPlanByClient(window.sessionStorage.getItem('idClientSelected'), null).then(function(data) {
			changeStateSaveData(false, "");
			if (data.payload.data.status === 200) {
				window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data.filename + '&id=' + data.payload.data.data.sessionToken, '_blank');
			}
		});
	}

	render() {
		const {visibleDownload} = this.props;
		return (
			<div style={{display:visibleDownload, marginLeft: '-20px',position: 'fixed', border: '1px solid rgb(194, 194, 194)', bottom: '0px', width: '100%', marginBottom: '0px', height: '50px', background: 'rgba(255, 255, 255, 0.74902)'}}>
				<div style={{width: '580px', height: '100%', position: 'fixed', right: '0px'}}>
	        <button className="btn" style={{float: 'right', margin: '8px 0px 0px 400px', position: 'fixed'}} title={'Exportar en formato Excel'} onClick={this._downloadBusinessPlans}>
	          <span style={{color: "#FFFFFF", padding:"10px"}}>{'Descargar '}<i className="file excel outline icon"></i></span>
	        </button>
    		</div>
    	</div>
		);
	}
}


function mapStateToProps({businessPlanReducer}, ownerProps) {
  return {
    businessPlanReducer,
		changeStateSaveData
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCsvBusinessPlanByClient, getCsvBusinessPlan
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDownloadBusinessPlanComponent);
