import React, {Component} from 'react';
import TableComponent from '../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findShareHolder, keepKeyword} from './actions';



const headers = [
	{
		"title": "Tipo de documento",
		"key": "shareHolderIdType"
	}, {
		"title": "Número",
		"key": "shareHolderIdNumber"
	}, {
		"title": "Tipo de accionista",
		"key": "shareHolderType"
	}, {
		"title": "Nombre",
		"key": "name"
	}, {
		"title": "Porcentaje",
		"key": "percentage"
	}
];

class ShareHolderTableComponent extends Component {

	 _mapShareHolderItems(objShareHolders) {
	 	var listShareHolders = new Array();
	 	objShareHolders.forEach(function(shareHolder){
	 		listShareHolders.push({
	 			'shareHolderIdType': shareHolder.shareHolderIdType,
          		'shareHolderIdNumber': shareHolder.shareHolderIdNumber,
          		'shareHolderType': shareHolder.shareHolderType,
          		'name': shareHolder.name,
          		'percentage': shareHolder.percentage
	 		});
	 	});
  		return listShareHolders;
  	}

	render() {
		const {shareHolders} = this.props;
		return (
			<div className="col-xs-12 horizontal-scroll-wrapper">
				<TableComponent headers={headers} data={this._mapShareHolderItems(shareHolders.get('responseShareHolder'))} />
			</div>
		);
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		findShareHolder, keepKeyword
	}, dispatch);
}

function mapStateToProps({shareHolders}, ownerProps) {
	return {
		shareHolders
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareHolderTableComponent);