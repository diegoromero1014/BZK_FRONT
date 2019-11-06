import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {
	BUSINESS_CATEGORY, ALL_BUSINESS_CATEGORIES
  } from "../../selectsComponent/constants";
  
  import {
	consultDataSelect
  } from "../../selectsComponent/actions";
import HeaderPipeline from '../headerPipeline';
import FormEditPipeline from './formEditPipeline';


class EditPipeline extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const {clientInformacion, consultDataSelect} = this.props;
		const infoClient = clientInformacion.get('responseClientInfo');
		if(_.isEmpty(infoClient)) {
        	redirectUrl("/dashboard/clientInformation");
		}
		consultDataSelect(BUSINESS_CATEGORY, ALL_BUSINESS_CATEGORIES);
  	}

	render() {
		const {params: {id}} = this.props;
		return (
			<div>
				<HeaderPipeline />
				<FormEditPipeline id={id} />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
	consultDataSelect
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPipeline);
