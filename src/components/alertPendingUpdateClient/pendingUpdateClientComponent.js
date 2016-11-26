/**
 * Created by ahurtado on 11/23/2016.
 */
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {clientsFindServer, clearFilter,changePage, changeKeyword} from './actions';
import ClientListItem from './clientPendingUpdateListItem';
import SearchBarClient from './searchClientAlertPendingUpdate';
import {NUMBER_RECORDS} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {consultList,getMasterDataFields,consultListWithParameterUbication,consultDataSelect} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import {clearContact} from '../contact/actions';
import {clearInfoClient} from '../clientInformation/actions';
import {SESSION_EXPIRED, MODULE_PROSPECT, MODULE_CLIENTS} from '../../constantsGlobal';
import {validatePermissionsByModule} from '../../actionsGlobal';

const fields =["team","region","zone"];

class ClientsPendingUpdate extends Component {
    constructor(props) {
        super(props);
        this._onChangeTeam = this._onChangeTeam.bind(this);
        this._onChangeRegionStatus = this._onChangeRegionStatus.bind(this);
        this._onChangeZoneStatus = this._onChangeZoneStatus.bind(this);
        this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
        this.state ={
            valueTeam :"",
            valueCertification:""
        }
    }

    componentWillMount(){
        if(window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined){
            redirectUrl("/login");
        } else {
            const {clearFilter,consultList,getMasterDataFields, clearContact, clearInfoClient,consultDataSelect} = this.props;
            clearFilter();
            getMasterDataFields([constants.CERTIFICATION_STATUS]).then((data) => {
                if( _.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED  ){
                    redirectUrl("/login");
                }
            });
            consultList(constants.TEAM_FOR_EMPLOYEE);
            consultDataSelect(constants.LIST_REGIONS);
            const {updateTitleNavBar, validatePermissionsByModule} = this.props;
            updateTitleNavBar("Alerta de clientes pendientes actualización");
            clearInfoClient();
            clearContact();
            validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
                if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                } else {
                    if( !_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false' ) {
                        redirectUrl("/dashboard");
                    }
                }
            });
        }
    }

    _cleanSearch(){
        const {fields: {team},clearFilter} = this.props;
        this.props.resetForm();
        clearFilter();

    }

    _onChangeTeam(val){
        const {fields: {team}} = this.props;
        team.onChange(val);
        if(val){
            this._handleClientsFind();
        }
    }

    _onChangeRegionStatus(val){
        const {fields: {region,zone},consultListWithParameterUbication} = this.props;
        region.onChange(val);
        zone.onChange(null);
        consultListWithParameterUbication(constants.LIST_ZONES,val);
        if(val){
            this._handleClientsFind();
        }
    }
    _onChangeZoneStatus(val){
        const {fields: {zone}} = this.props;
        zone.onChange(val);
        if(val){
            this._handleClientsFind();
        }
    }

    _handleClientsFind(){
        const {fields: {team,region,zone}} = this.props;
        const {clientsFindServer,alertPendingUpdateClient,changePage} = this.props;
        clientsFindServer(alertPendingUpdateClient.get('keywordNameNit'), 0, NUMBER_RECORDS,region.value,team.value).then((data) => {
            if ( !_.get(data, 'payload.data.validateLogin') ) {
                redirectUrl("/login");
            }
        });
        changePage(1);
    }

    _mapClientItems(item, idx) {
        return <ClientListItem
            key={idx}
            dataId={item.id}
            dataName={item.name}
            dataDocumentType={item.documentType}
            dataDocument={item.document}
            dataAccountManager={item.accountManager}
            dataEconomicGroup={item.economicGroup}
            dataIsProspect={item.prospect}
            dataIsAccess={item.access}
        />
    }

    _clickButtonCreateProps(){
        redirectUrl("/dashboard/createPropspect");
    }

    render() {
        var clientItems = [];
        const {fields:{team,region,zone}, handleSubmit, navBar, reducerGlobal} = this.props;
        const {alertPendingUpdateClient,selectsReducer} = this.props;
        var countClients = alertPendingUpdateClient.get('countClients');
        var status = alertPendingUpdateClient.get('status');
        clientItems = alertPendingUpdateClient.get('responseClients');
        return (
            <div>
                <form>
                    <Row style={{borderBottom:"2px solid #D9DEDF",marginTop:"15px"}}>
                        <Col xs={12} sm={12} md={4} lg={4} style={{width:'60%'}}>
                            <SearchBarClient valueTeam = {team.value} valueCertification={region.value}/>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width:'60%'}}>
                            <ComboBox
                                name="celula"
                                labelInput="Célula"
                                {...team}
                                onChange={val => this._onChangeTeam(val)}
                                value={team.value}
                                onBlur={team.onBlur}
                                valueProp={'id'}
                                textProp={'description'}
                                searchClient ={'client'}
                                data={selectsReducer.get('teamValueObjects')}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width:'60%'}}>
                            <ComboBox
                                name="region"
                                labelInput="Región"
                                {...region}
                                onChange={val => this._onChangeRegionStatus(val)}
                                value={region.value}
                                onBlur={region.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient ={'client'}
                                data={selectsReducer.get(constants.LIST_REGIONS) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={2} style={{width:'60%'}}>
                            <ComboBox
                                name="zona"
                                labelInput="Zona"
                                {...zone}
                                onChange={val => this._onChangeZoneStatus(val)}
                                value={zone.value}
                                onBlur={zone.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                searchClient ={'client'}
                                data={selectsReducer.get(constants.LIST_ZONES) || []}
                            />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{width:'100%'}}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch} title="Limpiar búsqueda" style={{marginLeft:"17px"}}>
                                <i className="erase icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                            </button>
                        </Col>
                    </Row>
                </form>
                <Row style={{paddingLeft: "10px"}}>
                    <Col xs={12} md={12} lg={12}>
                        <div className="news-page content">
                            <div className="team-modal">
                                {countClients === 0 && status === 'processed' ? <div style={{textAlign:"center", marginTop:"15px"}}> <h4 className="form-item">Señor usuario, no se encontraron clientes que cumplan el criterio de búsqueda.</h4> </div>:
                                    clientItems.map(this._mapClientItems)}
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        <Pagination valueTeam = {team.value} valueCertification={region.value}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        clientsFindServer,
        clearFilter,
        getMasterDataFields,
        changePage,
        changeKeyword,
        consultList,
        updateTitleNavBar,
        clearContact,
        clearInfoClient,
        validatePermissionsByModule,
        consultListWithParameterUbication,
        consultDataSelect
    }, dispatch);
}

function mapStateToProps({alertPendingUpdateClient, selectsReducer, navBar, contactsByClient, clientInformacion, reducerGlobal},{fields}){
    return {
        alertPendingUpdateClient,
        selectsReducer,
        navBar,
        contactsByClient,
        clientInformacion,
        reducerGlobal
    };
}

export default reduxForm({form: 'simple',fields}, mapStateToProps, mapDispatchToProps)(ClientsPendingUpdate);

