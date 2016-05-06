import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class ComponentShareHolderDetail extends Component {

render() {
  const {shareHolderId} = this.props;
    return (
      <form>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
        {shareHolderId}
        </div>
        <div className="modalBt4-footer modal-footer">
          <button
            type="submit"
            className="btn btn-primary modal-button-edit"
            >{'Guardar'}</button>
        </div>
      </form>
    );
  }
}

ComponentShareHolderDetail.PropTypes = {
  shareHolderId: PropTypes.number
};
export default ComponentShareHolderDetail;
