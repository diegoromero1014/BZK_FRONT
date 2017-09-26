import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import {
    PARAMETER_FUND_FLOWS_URL,
    PARAMETER_COMEX_URL,
    FUND_FLOWS_TITLE,
    COMEX_TITLE,
    MODULE_WALLET_SHARE_TITLE
} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import {updateTitleNavBar} from '../navBar/actions';
import {setUrlParameter} from './actions';
import {consultParameterServer} from '../../actionsGlobal';
import {Card, Icon, Button} from 'semantic-ui-react'
import {MODULE_TRANSACTIONAL} from '../../constantsGlobal';

class Transactional extends Component {
    constructor(props) {
        super(props);
        this.openWalletShare = this.openWalletShare.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const {consultParameterServer, updateTitleNavBar, setUrlParameter} = this.props;
            consultParameterServer(PARAMETER_FUND_FLOWS_URL).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(PARAMETER_FUND_FLOWS_URL, JSON.parse(data.payload.data.parameter).value);
                }
            });
            consultParameterServer(PARAMETER_COMEX_URL).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(PARAMETER_COMEX_URL, JSON.parse(data.payload.data.parameter).value);
                }
            });
            updateTitleNavBar(MODULE_TRANSACTIONAL);
        }
    }

    downLoadFileUrl(url) {
        window.open(url, "_blank");
    }

    openWalletShare(){
        redirectUrl("/dashboard/walletShare");
    }

    render() {
        const {transactional} = this.props;
        const styleHeader = {minHeight: '10px', paddingBottom: '0.5em', borderBottom: '1px solid rgba(0, 0, 0, 0.05)'};
        return (
            <div >
                <Row xs={12} md={12} lg={12} style={{padding: '15px 20px 10px 20px'}}>
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
                                    <Icon color="blue" name='computer'/>Abrir</Button>
                            </Card.Content>
                        </Card>
                        <Card >
                            <Card.Content>
                                <Card.Header style={styleHeader}>
                                    {COMEX_TITLE}
                                </Card.Header>
                                <Card.Description>
                                    <ul>
                                        <li>Resume la actividad de comercio internacional (importaciones +
                                            exportaciones) del cliente durante los últimos cinco (5) trimestres.
                                        </li>
                                        <li>Presenta un resumen de los productos del Grupo que utiliza para su
                                            actividad de comercio internacional, el resumen también se puede
                                            consultar por gerente de Moneda Extranjera.
                                        </li>
                                    </ul>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button fluid
                                        onClick={this.downLoadFileUrl.bind(this, transactional.get(PARAMETER_COMEX_URL))}>
                                    <Icon color="green" name='file excel outline'/>Descargar</Button>
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
                                    <Icon color="green" name='file excel outline'/>Descargar</Button>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Row>
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

function mapStateToProps({transactional}) {
    return {transactional};
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactional);
