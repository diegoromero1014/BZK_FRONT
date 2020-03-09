import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCsvBusinessPlan } from '../actions';
import { MESSAGE_DOWNLOAD_DATA } from '../../../constantsGlobal';
import { changeStateSaveData } from '../../main/actions';

class ButtonDownloadTaskComponent extends Component {

	constructor(props) {
	  super(props);
	  this._downloadTasks = this._downloadTasks.bind(this);
	}

	_downloadTasks() {
		const {changeStateSaveData, getXlsTask, itemSeletedModal, yearModal, APP_URL} = this.props;
		changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
		getXlsTask(window.sessionStorage.getItem('idClientSelected'), null).then(function(data) {
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
	        <button className="btn" style={{float: 'right', margin: '8px 0px 0px 400px', position: 'fixed'}} title={'Exportar en formato Excel'} onClick={this._downloadTasks}>
	          <span style={{color: "#FFFFFF", padding:"10px"}}>{'Descargar '}<i className="file excel outline icon"></i></span>
	        </button>
    		</div>
    	</div>
		);
	}
}


function mapStateToProps({taskReducer}, ownerProps) {
  return {
    taskReducer,
		changeStateSaveData
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getXlsTask, getCsvBusinessPlan
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDownloadTaskComponent);
