import React from 'react';
import {Row, Col} from 'react-flexbox-grid';

import ToolTipComponent from '../../toolTip/toolTipComponent';

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
        const {text, icon, isSection, helpText} = this.props;
        return (
            <Row>
            <Col md={12}>
                <div className="tab-content-row" style={isSection ? styles.sectionDiv : styles.bordererDiv}>
                    {icon}
                    <span style={styles.span} className="title-middle">{text}</span>
                    {helpText && <ToolTipComponent text={helpText}>
                                <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                    className="help circle icon blue" />
                            </ToolTipComponent>}
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