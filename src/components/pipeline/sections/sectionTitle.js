import React from 'react';

export default class SectionTitle extends React.Component {

    render() {

        const { text } = this.props;

        return (
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                <i className="browser icon" style={{ fontSize: "20px" }} />
                <span style={{ fontSize: "20px" }}>{text}</span>
            </div>
        )

        
    }

}