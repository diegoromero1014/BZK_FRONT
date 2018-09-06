import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {getUserBlockingReport,
    stopBlockToReport} from '../../actionsGlobal';
import {TIME_REQUEST_BLOCK_REPORT, BLOCK_BUSINESS_PLAN} from '../../constantsGlobal';

export default function BlockingComponent(WrappedComponent, nameComponent) {

    class BaseComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                hasAccess : false,
                intervalId: null,
                userEditing: ''
            };

            this.logUser = window.localStorage.getItem('userNameFront');
            this.isComponentCreated = true;

            this.canUserEditBlockedReport = this.canUserEditBlockedReport.bind(this);
        }

        componentWillMount() {
            console.log("blockingComponent - WillMount: ",nameComponent);
            this.canUserEditBlockedReport(this.logUser).then((sucess) => {
                console.log("success");
                console.log(sucess);
            }).catch((reason) => {
                console.log("error");
                console.log(reason);
            });
           
        }

        componentWillUnmount() {
            console.log("blockingComponent - WillUnmount");
            clearInterval(this.state.intervalId);

            if (this.state.hasAccess) {

                let idClient = window.sessionStorage.getItem('idClientSelected');
                this.isComponentCreated;
                stopBlockToReport(idClient, BLOCK_BUSINESS_PLAN);
            }  
        }

        canUserEditBlockedReport(myUserName) {
            const { getUserBlockingReport } = this.props;
            let idClient = window.sessionStorage.getItem('idClientSelected');
    
            console.log('canUserEditBlockedReport');

            // Envio el id del cliente como primer parametro ya que solo hay un estudio de credito por cliente
    
            return getUserBlockingReport(idClient, nameComponent).then((success) => {

                console.log("inside getUserBlockingReport");
    
                if (! this.isComponentCreated) {
                    console.log('componente sin montar');
                    clearInterval(this.state.intervalId);
                    return;
                }
    
                if(success.payload.data.data == null) {
                    console.log('error en el servidor');
                    clearInterval(this.state.intervalId);
                    this.setState({ userEditing: "Error", shouldRedirect: true })
                    return;
                }
    
                let username = success.payload.data.data.username
    
                let name = success.payload.data.data.name
    
                if (_.isNull(username)) {
                    // Error servidor
                    console.log("Error en el servidor - Username null");
                    return Promise.reject(new Error('Error interno del servidor'))
                } else if (username.toUpperCase() === myUserName.toUpperCase()) {
                    // Usuario pidiendo permiso es el mismo que esta bloqueando
                    console.log('Ya lo estaba bloqueando');
                    if (!this.state.hasAccess) {
                        // Tengo permiso de editar y no estoy editando
                        console.log('Permite editar la primera vez')
                        this.setState({
                            hasAccess: true,
                            intervalId: setInterval(() => { this.canUserEditBlockedReport(myUserName) }, TIME_REQUEST_BLOCK_REPORT)
                        })
                    }
                } else { // El reporte esta siendo editado por otra persona
                    
                    if (this.state.hasAccess) {
                        // Estoy editando pero no tengo permisos
                        // Salir de edicion y detener intervalo
                        console.log('perdi los permisos');
                        clearInterval(this.state.intervalId);
                        this.setState({ userEditing: name, hasAccess: false })
                    } else {
                        // Mostar mensaje de el usuario que tiene bloqueado el informe
                        console.log('editado por alguien mas...');
                        this.setState({ userEditing: name })
                    }
    
                    return Promise.reject(new Error('el reporte se encuentra bloqueado por otro usuario'));
                }
    
                return success
            }).catch((reason) => {
                console.log(reason);
            })
    
        }

        render() {
            return <WrappedComponent {...this.props} hasAccess={this.state.hasAccess} userEditing={this.state.userEditing} />
        }

    }

    function mapStateToProps(state) {
        return {};
    }
    
    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            getUserBlockingReport,
            stopBlockToReport
        }, dispatch)
    }

    return connect(mapStateToProps, mapDispatchToProps)(BaseComponent);

}

