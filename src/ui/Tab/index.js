import React, { Component } from "react";
import { Label, Menu, Popup, Segment } from "semantic-ui-react";
import PropTypes from "prop-types";
import '../../../styles/tabs/main.scss';

class TabComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabActive: ""
        };
    }

    componentDidMount() {
        const { tabs } = this.props;

        if (Array.isArray(tabs) && tabs.length) {
            this.setState({ tabActive: tabs[0].name });
        }
    }

    handleItemClick = (name, callback) => {
        this.setState({ tabActive: name });

        if (callback) {
            callback(name);
        }
    };

    getMenu = tabActive => {
        const { tabs, classNameColor = 'blue' } = this.props;
        return (
            <div className="tabGenericComponent">
                <div style={{ overflowX: 'auto' }}>
                    <Menu pointing secondary>
                        {tabs.map(({ name, number, disable, callback, tooltip, className }) =>
                            tooltip ? (
                                <Popup
                                    inverted
                                    style={{ padding: "5px", opacity: 0.8 }}
                                    content={tooltip}
                                    trigger={this.getTabHeader(name, number, disable, tabActive, classNameColor, callback, className)}
                                    key={name}
                                ></Popup>
                            ) : (
                                    this.getTabHeader(name, number, disable, tabActive, classNameColor, callback, className)
                                )
                        )}
                    </Menu>
                </div>
                {this.getSegment(tabActive)}
            </div>
        );
    };

    getTabHeader = (name, number, disable, tabActive, classNameColor, callback, className = '') => (
        <Menu.Item
            key={name}
            name={name}
            className={`tabItem ${className} ${disable ? 'disable-tab' : ''}`}
            onClick={() => {
                !disable ? this.handleItemClick(name, callback) : null;
            }}
            active={tabActive === name}
        >
            <div className="tabTextItem">{name}</div>
            {number && number > 0 ? (
                <Label circular className={classNameColor}>
                    {number >= 100 ? "+99" : number}
                </Label>
            ) : (
                    ""
                )}
        </Menu.Item>
    );

    getSegment = tabActive => {
        const { tabs } = this.props;
        return tabs.filter(({ name }) => name === tabActive).map(({ content }, index) => <Segment key={index} className={'generic-tab-segment'}>{content}</Segment>);
    };

    render() {
        return <div>{this.getMenu(this.state.tabActive)}</div>;
    }
}

TabComponent.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            content: PropTypes.element.isRequired,
            callback: PropTypes.func,
            number: PropTypes.number,
            disable: PropTypes.bool,
        })
    )
};

export default TabComponent;
