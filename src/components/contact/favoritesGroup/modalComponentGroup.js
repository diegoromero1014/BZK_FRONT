import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {getGroupForId,changeKeywordNameNewGroup,getListContactGroupForId,getValidateExistGroup,
    searchContactForGroup,addContactList,clearContactName,deleteContactList,saveGroupFavoriteContacts,
    resetModal,groupFindServer

} from './actions';
import GridComponent from '../../grid/component';
import {DELETE_CONTACT_LIST_GROUP,NUMBER_RECORDS} from './constants';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { CONTACT_ID_TYPE} from '../../selectsComponent/constants';
import { getMasterDataFields } from '../../selectsComponent/actions';
import Input from '../../../ui/input/inputComponent';
import {swtShowMessage} from '../../sweetAlertMessages/actions';
import ButtonDeleteLocalComponent from '../../grid/buttonDeleteLocalComponent';
import Immutable from 'immutable';

const fields = ['numeroDocumento', 'tipoDocumento', 'searchGroup'];

class ModalComponentGroup extends Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        //this._handleChangeNameKeyword = this._handleChangeNameKeyword.bind(this);
        this._renderHeaders = this._renderHeaders.bind(this);
        this._renderCellView = this._renderCellView.bind(this);
        this._handleValidateExistGroup = this._handleValidateExistGroup.bind(this);
        this._searchContactForGroup = this._searchContactForGroup.bind(this);
        this._onClickLimpiar = this._onClickLimpiar.bind(this);
        this._addContactList = this._addContactList.bind(this);
        this._deleteContactList = this._deleteContactList.bind(this);
        this._saveGroupFavoriteContacts = this._saveGroupFavoriteContacts.bind(this);
        this.state = {
            modalIsOpen: false,
            visibleMessage: 'block',
            visibleTable: "none",
            visibleNameContact: "none",
            searchContact: "none",
            createGroup: true
        };
    }

    componentWillMount() {
        const { groupId,getGroupForId,
            getListContactGroupForId,
            getMasterDataFields,clearContactName,resetForm,
            resetModal,fields:{searchGroup}
            } = this.props;
        getMasterDataFields([CONTACT_ID_TYPE]);
        if (groupId != undefined) {
            getGroupForId(groupId);
            getListContactGroupForId(groupId);
        } else {
            searchGroup.value = '';
            clearContactName();
            resetForm();
            resetModal();
            this.setState({searchContact: 'none'});
        }
    }

    _handleValidateExistGroup() {
        const {fields:{searchGroup},getValidateExistGroup} = this.props;
        getValidateExistGroup(searchGroup.value);
    }


    _saveGroupFavoriteContacts() {
        const {groupsFavoriteContacts,saveGroupFavoriteContacts,groupFindServer,keyWordName,pageNum,swtShowMessage} = this.props;
        const group = groupsFavoriteContacts.get('group');
        const list = groupsFavoriteContacts.get('group').get('listContact');
        console.log(_.size(list));
        if(_.size(list) > 1){
            saveGroupFavoriteContacts(group.toJSON());
            groupFindServer(keyWordName,pageNum,NUMBER_RECORDS);
            swtShowMessage('success', 'Guardar', 'Señor usuario, se ha guardado con éxito');
            this.closeModal();
        }else{
            swtShowMessage('error', 'Guardar', 'Señor usuario, debe agregar por lo menos dos contactos');
        }
    }


    _addContactList() {
        const {addContactList,clearContactName,groupsFavoriteContacts,resetForm,swtShowMessage} = this.props;
        const contact = groupsFavoriteContacts.get('contact');
        const list = groupsFavoriteContacts.get('group').get('listContact');

        const exist = _.findIndex(list, (item)=>_.isEqual(item.id, contact.id));

        if (exist >= 0) {
            swtShowMessage('error', 'Contacto duplicado', 'Señor usuario, el contacto ya esta en el grupo');
        } else {
            if (_.size(list) === 50) {
                swtShowMessage('error', 'Contactos máximos', 'Señor usuario, el grupo ya tiene la máxima cantidad de contactos');
            } else {
                addContactList();
            }
            clearContactName();
            resetForm();
        }
    }


    _renderHeaders() {
        const headersTable = [
            {
                title: "Nombre de contacto",
                key: "nameContact"
            },
            {
                title: "Correo Electronico",
                key: "email"
            },
            {
                title: "",
                key: "deleteLocal"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {

        const mensaje = "Señor usuario ¿está seguro que desea eliminar el grupo ";
        return data.map((contact, idx) => ({
            nameContact: contact.firstName + " " + contact.middleName + " " + contact.firstLastName + " " + contact.secondLastName,
            email: contact.emailAddress,
            deleteLocal: {
                component: <ButtonDeleteLocalComponent key={contact.id} message={mensaje + contact.name + "?"}
                                                       fn={this._deleteContactList} args={[contact]}/>
            }
        }));
    }

    _deleteContactList(contact) {
        this.props.deleteContactList(contact.id);
    }

    _searchContactForGroup() {
        const { fields: {tipoDocumento,numeroDocumento},swtShowMessage,searchContactForGroup } = this.props;
        if (!_.isEqual(numeroDocumento.value.trim(), '') && !_.isEqual(tipoDocumento.value.trim(), '')) {
            searchContactForGroup(tipoDocumento.value, numeroDocumento.value, '').then((data) => {

            });
        } else {
            swtShowMessage('error', 'Campos obligatorios', 'Señor usuario, para agregar un contacto debe ingresar los campos obligatorios.');
        }
    }

    _onClickLimpiar() {
        const {resetForm,clearContactName} = this.props;
        resetForm();
        clearContactName();
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        let { groupId,fields:{numeroDocumento,tipoDocumento,searchGroup},groupsFavoriteContacts,selectsReducer} = this.props;
        let { createGroup,searchContact,visibleMessage,visibleTable,visibleNameContact} = this.state;
        const data = groupsFavoriteContacts.get('group').get('listContact');
        const contactSearch = groupsFavoriteContacts.get('contact');
        if (!_.isEqual(groupsFavoriteContacts.get('group').get('name').trim(), '')) {
            searchGroup.value = groupsFavoriteContacts.get('group').get('name');
        }


        let countFilter = _.size(data);

        if (countFilter !== 0) {
            visibleMessage = 'none';
            visibleTable = 'block';
        }

        if (searchGroup.value.trim() != '') {
            searchContact = 'block';
        } else {
            searchContact = 'none';
        }


        if (!_.isEqual(contactSearch.name, '')) {
            visibleNameContact = 'inline-flex';
        } else {
            visibleNameContact = 'none';
        }


        return (
            <div>
                <div className="modalBt4-body modal-body"
                     style={{overflowX: 'hidden', backgroundColor:"#ececec" ,minHeight:"400px !important"}}>

                    <div style={{margin:"-15px", padding:"15px 25px"}}>
                        <Row style={{borderBottom: "1px solid #D9DEDF"}}>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <dt><span>Nombre del grupo (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                <div className="InputAddOn">
                                    <input type="text" style={{padding: '0px 11px !important'}}
                                           placeholder="Nombre de grupo"
                                        {...searchGroup}
                                           className="input-lg input InputAddOn-field"/>
                                    <button onClick={this._handleValidateExistGroup}
                                            className="button InputAddOn-item">
                                        <i className="search icon"/>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{borderBottom: "1px solid #D9DEDF", paddingTop:"15px",display:searchContact}}>
                            <Row style={{ width: '100%'}}>
                                <Col xs={4} sm={4} md={4} lg={4}>
                                    <dl style={{ width: '100%' }}>
                                        <dt><span>Tipo de documento (<span style={{ color: 'red' }}>*</span>)</span>
                                        </dt>
                                        <dd><ComboBox
                                            name="tipoDocumento" labelInput="Seleccione"
                                            disabled={this.state.disabled}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                                            {...tipoDocumento}
                                        /></dd>
                                    </dl>
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4}>
                                    <dl style={{ width: '100%' }}>
                                        <dt><span>Número de documento (<span style={{ color: 'red' }}>*</span>)</span>
                                        </dt>
                                        <dd><Input
                                            name="numeroDocumento"
                                            type="text"
                                            max="20"
                                            disabled={this.state.disabled}
                                            {...numeroDocumento}
                                        /></dd>
                                    </dl>
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4}>
                                    <dl style={{ marginTop:"20px" }}>
                                        <button type="button" className="btn btn-primary" style={{ marginLeft:"20px" }}
                                                onClick={this._searchContactForGroup}>
                                            <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                               className="search icon"/>
                                        </button>
                                        <button type="button" className="btn btn-primary" style={{ marginLeft:"20px" }}
                                                onClick={this._onClickLimpiar}>
                                            <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                               className="erase icon"/>
                                        </button>
                                    </dl>
                                </Col>
                            </Row>
                            <Row style={{ width: '100%', display: visibleNameContact}}>
                                <Col xs={8} sm={8} md={8} lg={8}>
                                    <dl style={{ width: '100%' }}>
                                        <dt><span>Nombre de contacto</span></dt>
                                        <dd><Input
                                            name="nombreContacto"
                                            type="text"
                                            max="20"
                                            disabled="disabled"
                                            value={contactSearch.name}
                                        /></dd>
                                    </dl>
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4}>
                                    <dl style={{width: '100%', marginTop:"20px" }}>
                                        <button type="button" className="btn btn-primary" style={{ marginLeft:"20px" }}
                                                onClick={this._addContactList}>
                                            Agregar contacto
                                        </button>
                                    </dl>
                                </Col>
                            </Row>
                        </Row>
                        <Row>
                            <div style={{padding: "15px", fontSize: '25px', textAlign: 'center', width: '100%'}}>
                                Total: {countFilter}
                            </div>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} style={{display: visibleTable}}>
                                <div className="horizontal-scroll-wrapper"
                                     style={{overflow: 'scroll', background: '#fff', maxHeight:"200px !important", overflow:"scroll"}}>
                                    <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)}/>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} style={{display: visibleMessage}}>
                                <Row center="xs">
                                    <Col xs={12} sm={8} md={12} lg={12}>
                                        <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="button" onClick={this._saveGroupFavoriteContacts}
                            className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getGroupForId,
        changeKeywordNameNewGroup,
        getListContactGroupForId,
        getMasterDataFields,
        getValidateExistGroup,
        searchContactForGroup,
        swtShowMessage,
        addContactList,
        clearContactName,
        deleteContactList,
        saveGroupFavoriteContacts,
        resetModal,
        groupFindServer
    }, dispatch);
}

function mapStateToProps({groupsFavoriteContacts,selectsReducer}, ownerProps){
    const keyWordName = groupsFavoriteContacts.get('pageNum');
    const pageNum = groupsFavoriteContacts.get('keywordName');
    return {
        groupsFavoriteContacts, selectsReducer,keyWordName,pageNum
    };
}


export default reduxForm({
    form: 'FORM_SEARCH_CONTACTS',
    fields
}, mapStateToProps, mapDispatchToProps)(ModalComponentGroup);
