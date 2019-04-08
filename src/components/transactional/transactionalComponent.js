import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import {
    PARAMETER_FUND_FLOWS_URL,
    FUND_FLOWS_TITLE,
    VISOR_CONSOLIDATE_TITLE,
    MODULE_WALLET_SHARE_TITLE,
    CONTROL_DASHBOARD_TITLE
} from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { setUrlParameter } from './actions';
import { consultParameterServer } from '../../actionsGlobal';
import { Card, Icon, Button } from 'semantic-ui-react'
import { MODULE_TRANSACTIONAL } from '../../constantsGlobal';
import VisorConsolidate from './visorConsolidate';


class Transactional extends Component {
    constructor(props) {
        super(props);

        this.state = {
            VISOR_CONSOLIDATE_MODAL: false
        }

        this.openWalletShare = this.openWalletShare.bind(this);
        this.openControlDashboard = this.openControlDashboard.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { consultParameterServer, updateTitleNavBar, setUrlParameter } = this.props;
            consultParameterServer(PARAMETER_FUND_FLOWS_URL).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(PARAMETER_FUND_FLOWS_URL, JSON.parse(data.payload.data.parameter).value);
                }
            });
            updateTitleNavBar(MODULE_TRANSACTIONAL);
        }
    }

    downLoadFileUrl(url) {
        window.open(url, "_blank");
    }

    openWalletShare() {
        redirectUrl("/dashboard/walletShare");
    }

    openControlDashboard() {
        redirectUrl("/dashboard/controlDashboard");
    }

    render() {
        const { transactional } = this.props;
        const styleHeader = { minHeight: '10px', paddingBottom: '0.5em', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' };
        return (
            <div >
                <Row xs={12} md={12} lg={12} style={{ padding: '15px 20px 10px 20px' }}>
                    <Card.Group>
                        <Card >
                            <Card.Content>
                                <Card.Header style={styleHeader}>
                                    {MODULE_WALLET_SHARE_TITLE}
                                </Card.Header>
                                <Card.Description>
                                    <ul>
                                        <li>Mide la participación en cartera del Grupo Bancolombia frente al sistema
                                            financiero desde un nivel general (Grupo Bancolombia) hasta el nivel cliente.
                                        </li>
                                        <li>Brinda la posibilidad de medir participaciones de Leasing Bancolombia,
                                            Bancolombia o Grupo Bancolombia consolidado.
                                        </li>
                                    </ul>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid
                                    onClick={this.openWalletShare}>
                                    <Icon color="blue" name='computer' />Abrir</Button>
                            </Card.Content>
                        </Card>                        
                        <Card >
                            <Card.Content>
                                <Card.Header style={styleHeader}>
                                    {VISOR_CONSOLIDATE_TITLE}
                                </Card.Header>
                                <Card.Description>
                                    Rentabilidad para la VEG a nivel de gerente, zona, región, banca, segmento, sector y relación.
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid
                                    onClick={() => {
                                        this.setState({
                                            VISOR_CONSOLIDATE_MODAL: true
                                        })
                                    }}>
                                    <Icon color="green" name='computer' />Abrir</Button>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Content>
                                <Card.Header style={styleHeader}>
                                    {FUND_FLOWS_TITLE}
                                </Card.Header>
                                <Card.Description>
                                    <ul>
                                        <li>Consolida la información de pagos y recaudos.</li>
                                        <li>Información discriminada por canal.</li>
                                    </ul>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid
                                    onClick={this.downLoadFileUrl.bind(this, transactional.get(PARAMETER_FUND_FLOWS_URL))}>
                                    <Icon color="green" name='file excel outline' />Descargar</Button>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header style={styleHeader}>
                                    {CONTROL_DASHBOARD_TITLE}
                                </Card.Header>
                                <Card.Description>
                                    Observación: El tablero de control muestra la información de ventas hechas con tarjetas débito.
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid
                                    onClick={this.openControlDashboard}>
                                    <Icon color="blue" name='computer' />Abrir</Button>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Row>
                {this.state.VISOR_CONSOLIDATE_MODAL &&
                    <VisorConsolidate closeModal={() => {                        
                        this.setState({
                            VISOR_CONSOLIDATE_MODAL: false
                        })
                    }} />
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setUrlParameter,
        updateTitleNavBar,
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ transactional }) {
    return { transactional };
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactional);
