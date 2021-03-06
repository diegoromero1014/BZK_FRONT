import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import {getUserBlockingReport,
    stopBlockToReport, validateIsNullOrUndefined} from '../../actionsGlobal';
import {TIME_REQUEST_BLOCK_REPORT, BLOCK_BUSINESS_PLAN} from '../../constantsGlobal';

export default function BlockingComponent(WrappedComponent, nameComponent) {

    class BaseComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                hasAccess : true,
                intervalId: null,
                userEditing: ''
            };

            this.logUser = window.localStorage.getItem('userNameFront');
            this.firstAccess = true;
            this.isComponentCreated = true;
            this.canUserEditBlockedReport = this.canUserEditBlockedReport.bind(this);
            this.idEntity = null;
        }

        componentWillMount() {
            const {id} = this.props;
            this.idEntity = id;
            this.canUserEditBlockedReport()
            .then(() => {})
            .catch(() => {});
        }

        componentWillUnmount() {

            clearInterval(this.state.intervalId);
            if (this.state.hasAccess) {
                this.isComponentCreated = false;
                stopBlockToReport(this.idEntity, BLOCK_BUSINESS_PLAN);
            }  
        }

        canUserEditBlockedReport() {
            const { getUserBlockingReport } = this.props;
            
            let myUserName = this.logUser;
            let idEntity = this.idEntity;

            return getUserBlockingReport(idEntity, nameComponent).then((success) => {

                if (! this.isComponentCreated) {
                    clearInterval(this.state.intervalId);
                    return;
                }
    
                if(success.payload.data.data == null) {
                    clearInterval(this.state.intervalId);
                    this.setState({ userEditing: "Error", shouldRedirect: true })
                    return;
                }
    
                let username = success.payload.data.data.username
                let name = success.payload.data.data.name
                
                if (validateIsNullOrUndefined(username)) {
                    // Error servidor
                    return Promise.reject(new Error('Error interno del servidor'))
                } else if (username.toUpperCase() === myUserName.toUpperCase()) {
                    // Usuario pidiendo permiso es el mismo que esta bloqueando
                    if (!this.state.hasAccess || this.firstAccess) {
                        // Tengo permiso de editar y no estoy editando
                        this.setState({
                            hasAccess: true,
                            intervalId: setInterval(this.canUserEditBlockedReport, TIME_REQUEST_BLOCK_REPORT)
                        })
                        this.firstAccess = false;
                    }
                } else { // El reporte esta siendo editado por otra persona
                    
                    if (this.state.hasAccess) {
                        // Estoy editando pero no tengo permisos
                        // Salir de edicion y detener intervalo
                        clearInterval(this.state.intervalId);
                        this.setState({ userEditing: name, hasAccess: false })
                    } else {
                        // Mostar mensaje de el usuario que tiene bloqueado el informe
                        this.setState({ userEditing: name })
                    }
    
                    return Promise.reject(new Error('el reporte se encuentra bloqueado por otro usuario'));
                }
    
                return success
            });
    
        }

        render() {
            return <WrappedComponent {...this.props} hasAccess={this.state.hasAccess} 
                        userEditing={this.state.userEditing}
                        canUserEditBlockedReport={this.canUserEditBlockedReport} />
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

