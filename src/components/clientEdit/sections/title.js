import React from 'react';
import {Row, Col} from 'react-flexbox-grid';

const styles = {
    bordererDiv: {
        fontSize: "25px",
        color: "#CEA70B",
        paddingTop: "10px"
    },
    sectionDiv: {
        borderTop: "1px dotted #cea70b",
        fontSize: "25px",
        color: "#CEA70B",
        paddingTop: "10px"
    },
    span: {
        marginLeft: "5px"
    }
}

class Title extends React.Component {
    render() {
        const {text, icon, isSection} = this.props;
        return (
            <Row>
            <Col md={12}>
                <div className="tab-content-row" style={isSection ? styles.sectionDiv : styles.bordererDiv}>
                    {icon}
                    <span style={styles.span} className="title-middle">{text}</span>
                </div>
            </Col>
            </Row>
        )
    }
}

Title.defaultProps = {
    isSection: true
}

export default Title;