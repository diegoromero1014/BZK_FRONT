import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCsvBusinessPlan, getCsvBusinessPlanByClient} from '../actions';
import {TAB_BUSINESS} from '../../viewManagement/constants';
import {APP_URL} from '../../../constantsGlobal';

class ButtonDownloadBusinessPlanComponent extends Component {

	constructor(props) {
	  super(props);
	  this._downloadBusinessPlans = this._downloadBusinessPlans.bind(this);
	}

	_downloadBusinessPlans() {
		const {getCsvBusinessPlanByClient, itemSeletedModal, yearModal, getCsvBusinessPlan} = this.props;
		getCsvBusinessPlanByClient(window.localStorage.getItem('idClientSelected'), null).then(function(data) {
			if (data.payload.data.status === 200) {
				window.open(APP_URL + '/getExcelReport?filename=' + data.payload.data.data, '_blank');
			}
		});
	}

	render() {
		const {visibleDownload} = this.props;
		return (
			<div style={{display:visibleDownload, marginLeft: '-20px',position: 'fixed', border: '1px solid rgb(194, 194, 194)', bottom: '0px', width: '100%', marginBottom: '0px', height: '50px', background: 'rgba(255, 255, 255, 0.74902)'}}>
				<div style={{width: '580px', height: '100%', position: 'fixed', right: '0px'}}>
	        <button className="btn" style={{float: 'right', margin: '8px 0px 0px 400px', position: 'fixed'}} title={'Exportar en formato CSV'} onClick={this._downloadBusinessPlans}>
	          <span style={{color: "#FFFFFF", padding:"10px"}}>{'Descargar '}<i className="file excel outline icon"></i></span>
	        </button>
    		</div>
    	</div>
		);
	}
}


function mapStateToProps({businessPlanReducer}, ownerProps) {
  return {
    businessPlanReducer
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCsvBusinessPlanByClient, getCsvBusinessPlan
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDownloadBusinessPlanComponent);
