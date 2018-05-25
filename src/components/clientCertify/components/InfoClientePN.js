import React from 'react';
import {Col, Row} from "react-flexbox-grid";
import Input from "../../../ui/input/inputComponent";

class InfoCliente extends React.Component {

    render() {

        const {razonSocial, idTypeClient, idNumber, firstName, middleName, lastName, middleLastName} = this.props;

        return (
            <Row style={{ padding: "10px 28px 10px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Primer nombre</span></dt>
                        <dt>
                            <Input
                                name="primerNombre"
                                type="text"
                                max="150"
                                placeholder="Primer nombre"
                                {...firstName}
                                disabled={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Segundo nombre</span></dt>
                        <dt>
                            <Input
                                name="segundoNombre"
                                type="text"
                                max="150"
                                placeholder="Segundo nombre"
                                {...middleName}
                                disabled={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Primer Apellido</span></dt>
                        <dt>
                            <Input
                                name="primerApellido"
                                type="text"
                                max="150"
                                placeholder="Primer apellido"
                                {...lastName}
                                disabled={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Segundo apellido</span></dt>
                        <dt>
                            <Input
                                name="segundoApellido"
                                type="text"
                                max="150"
                                placeholder="Segundo apellido"
                                {...middleLastName}
                                disabled={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Tipo de documento </span></dt>
                        <dt>
                            
                            <Input
                                 name="tipoDocumento"
                                 type="text"
                                 placeholder="Tipo de documento del cliente"
                                 {...idTypeClient}
                                 disabled={true}
                                 touched={true}
                            />

                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Número de documento </span></dt>
                        <dt>
                            <Input
                                name="documento"
                                type="text"
                                max="20"
                                placeholder="Número de documento del cliente"
                                {...idNumber}
                                touched={true}
                                disabled={true}
                            />
                        </dt>
                    </Col>

                    </Row>

        )
    }

}

export default InfoCliente;