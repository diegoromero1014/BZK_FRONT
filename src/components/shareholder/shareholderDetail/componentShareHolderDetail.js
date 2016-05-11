import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getDetailShareHolder} from './actions';

const fields = [];

const validate = values => {
    const errors = {}

    return errors;
};

class ComponentShareHolderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditable: false
    };
  }

  componentWillMount(){
    const {shareHolderId, getDetailShareHolder} = this.props;
    if(shareHolderId !== undefined && shareHolderId !== null && shareHolderId !== ''){
      getDetailShareHolder(shareHolderId);
    }
  }

  //Edita el cliente después de haber validado los campos, solo acá se validan las notas
  _submitEditShareHolderDetail(){
  }

  render() {
    const {fields: {}, shareHolderId, handleSubmit, editShareholderReducer} = this.props;
    var shareHolderInfo = editShareholderReducer.get('shareHolderEdit');
    console.log("shareHolderInfo", shareHolderInfo);
    return (
      <form onSubmit={handleSubmit(this._submitEditShareHolderDetail)}>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDetailShareHolder
  }, dispatch);
}

function mapStateToProps({editShareholderReducer, selectsReducer, notes},ownerProps) {
  const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
  return {
    editShareholderReducer,
    selectsReducer
    /*initialValues:{
      id: shareHolderEdit.id,
      address: shareHolderEdit.address,
      cityId: shareHolderEdit.cityId,
      clientId: shareHolderEdit.clientId,
      comment: shareHolderEdit.comment,
      countryId: shareHolderEdit.countryId,
      firstLastName: shareHolderEdit.firstLastName,
      firstName: shareHolderEdit.firstName,
      fiscalCountryId: shareHolderEdit.fiscalCountryId,
      genderId: shareHolderEdit.genderId,
      middleName: shareHolderEdit.middleName,
      provinceId: shareHolderEdit.provinceId,
      secondLastName: shareHolderEdit.secondLastName,
      shareHolderIdNumber: shareHolderEdit.shareHolderIdNumber,
      shareHolderIdType: shareHolderEdit.shareHolderIdType,
      shareHolderKindId: shareHolderEdit.,
      shareHolderName: shareHolderEdit.,
      shareHolderType: shareHolderEdit.,
      sharePercentage: shareHolderEdit.,
      tributaryNumber: shareHolderEdit.
    }*/
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ComponentShareHolderDetail);
