import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from "react-flexbox-grid";

const EDIT_STYLE = {
    border: '1px solid #e5e9ec',
    backgroundColor: '#F8F8F8',
    borderRadius: '2px',
    margin: '0px 28px 0 20px',
    height: '60px'
};

class Errores extends React.Component {
    render () {

        const {sumErrorsForm, tabReducer} = this.props;

        return (
            <div>
                    <p style={{ paddingTop: '10px' }}></p>
                    <Row xs={12} md={12} lg={12} style={ EDIT_STYLE }>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '20px' }}>
                            {sumErrorsForm > 0 || tabReducer.get('errorsMessage') > 0 || tabReducer.get('errorNotesEditClient') ?
                                <div>
                                    <span
                                        style={{ marginLeft: "20px", marginTop: "10px", color : "red", fontSize: "12pt" }}>Falta información obligatoria del cliente (ver campos seleccionados).
                                    </span>
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
                        </Col>
                    </Row>
                </div>
        )
    }
}


function mapStateToProps({tabReducer}) {
    return {
        tabReducer
    }
}



export default connect(mapStateToProps, {})(Errores)