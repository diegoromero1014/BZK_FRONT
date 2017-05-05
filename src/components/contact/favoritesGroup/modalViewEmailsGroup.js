/**
 * Created by Andres Hurtado on 25/04/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {Row, Col} from 'react-flexbox-grid';
import {getEmailsForGroup} from './actions';
import Textarea from '../../../ui/textarea/textareaComponent';
import _ from 'lodash';
import {showLoading} from '../../loading/actions';
import {swtShowMessage} from '../../sweetAlertMessages/actions';

const fields = ["emails"];



class ModalViewEmailsGroup extends Component {

    constructor(props) {
        super(props);
        this._copy = this._copy.bind(this);
    }

    componentWillMount() {
        let {getEmailsForGroup,idGroup,fields:{emails}} = this.props;
        getEmailsForGroup(idGroup).then((data) => {
            let emailsString = _.get(data.payload, 'data.data', []);
            console.log(emailsString);
            emails.value = emailsString;
        });
    }
    _copy(){

    }


    render() {
        let {fields:{emails}} = this.props;
        return (
            <div>
                <div className="modalBt4-body modal-body clearfix"
                     style={{overflowX: 'hidden', maxHeight: '490px !important'}}>
                    <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
                        <Row style={{paddingTop: '10px'}}>
                            <Col xs={12} md={12} lg={12}>
                                <h4>Correos electronicos</h4>
                                <div>
                                            <Textarea
                                                name="actionArea"
                                                type="text"
                                                style={{width: '100%', height: '100%', textAlign: 'justify'}}
                                                max="1000"
                                                rows={5}
                                                {...emails}
                                            />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this._copy}
                            className="btn btn-primary modal-button-edit">Copiar
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getEmailsForGroup
    }, dispatch);
}

function mapStateToProps({groupsFavoriteContacts}, ownerProps) {
    return {
        groupsFavoriteContacts
    };
}

export default reduxForm({
    form: 'FORM_VIEW_EMAILS_GROUP',
    fields
}, mapStateToProps, mapDispatchToProps)(ModalViewEmailsGroup);