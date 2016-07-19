import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import HeaderPipeline from '../headerPipeline';
import FormEditPipeline from './formEditPipeline';

class EditPipeline extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const {clientInformacion} = this.props;
		const infoClient = clientInformacion.get('responseClientInfo');
		if(_.isEmpty(infoClient)) {
        	redirectUrl("/dashboard/clientInformation");
    	}
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
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPipeline);
