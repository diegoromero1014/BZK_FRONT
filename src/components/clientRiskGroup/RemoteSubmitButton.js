import React from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'

const RemoteSubmitButton = ({ dispatch }) => (

    <button className="btn btn-prymary" type="button"
        onClick={() => dispatch(submit('submitMemberForm'))}
        style={{ cursor: 'pointer', marginLeft: "20px" }}>
        Agregar </button>


)
//                                  ^^^^^^^^^^^^ name of the form

export default connect()(RemoteSubmitButton)