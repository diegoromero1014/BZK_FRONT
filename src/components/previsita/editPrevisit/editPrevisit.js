import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HeaderPrevisita from '../headerPrevisita';
import FormEditPrevisita from './formEditPrevisita';

import { redirectUrl } from '../../globalComponents/actions';

class EditPrevisit extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { clientInformacion } = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if (_.isEmpty(infoClient)) {
      redirectUrl("/dashboard/clientInformation");
    }
  }

  render() {
    const { params: { id }, viewBottons, closeModal } = this.props;
    return (
      <div>
        <HeaderPrevisita />
        <FormEditPrevisita id={id} viewBottons={viewBottons} closeModal={closeModal} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPrevisit);