import React, { Component, PropTypes } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import TitleSectionComponent from '../titleSection/titleSection';

class ComponentAccordion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { functionChange, codSection, title, componentView, icon } = this.props;
        return (
            <div>
                <div style={{ borderTop: "1px dotted #cea70b", marginTop: "25px" }} ></div>
                <Accordion defaultActiveIndex={codSection}>
                    <Accordion.Title onClick={functionChange}>
                        <TitleSectionComponent iconClass={icon} fontSize="25px" typeTitle={true}>
                            {title}
                        </TitleSectionComponent>
                    </Accordion.Title>
                    <Accordion.Content >
                        {componentView}
                    </Accordion.Content>
                </Accordion>
            </div>
        );
    };
}

ComponentAccordion.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default ComponentAccordion;