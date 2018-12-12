import React from 'react'

class Errores extends React.Component {
    render () {

        const {BUTTON_EDIT, EDIT_STYLE, UPDATE_STYLE, sumErrorsForm, tabReducer} = this.props;

        return (
            <div>
                    <p style={{ paddingTop: '10px' }}></p>
                    <Row xs={12} md={12} lg={12} style={idButton === BUTTON_EDIT ? EDIT_STYLE : UPDATE_STYLE}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '20px' }}>

                            {this.state.sumErrorsForm > 0 || tabReducer.get('errorsMessage') > 0 || tabReducer.get('errorNotesEditClient') ?
                                <div>
                                    <span
                                        style={{ marginLeft: "20px", marginTop: "10px", color: "red", fontSize: "12pt" }}>Falta información obligatoria del cliente (ver campos seleccionados).</span>
                                </div>
                                :
                                <div>
                                    <span style={{
                                        marginLeft: "20px",
                                        marginTop: "10px",
                                        color: "green",
                                        fontSize: "12pt"
                                    }}>La información del cliente está completa, recuerde revisarla. </span>
                                </div>
                            }
                            {idButton === BUTTON_UPDATE ?
                                <div>
                                    <BottonContactAdmin errorContact={errorContact} message={messageContact}
                                        functionToExecute={validateContactShareholder} />
                                    <BottonShareholderAdmin errorShareholder={errorShareholder}
                                        message={messageShareholder}
                                        functionToExecute={validateContactShareholder} />
                                </div>
                                :
                                <div></div>
                            }
                        </Col>
                    </Row>
                </div>
        )
    }
}