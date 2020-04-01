import React, { Component } from "react";
import { Segment, Label, Menu, Popup } from "semantic-ui-react";
import PropTypes from "prop-types";

class TabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive: ""
    };
  }

  componentDidMount() {
    const { name } = this.props.tabs[0];
    this.setState({ tabActive: name });
  }

  handleItemClick = name => this.setState({ tabActive: name });
  getTabHeader = (name, number, disable, tabActive) => {
    return (
      <Menu.Item
        key={name}
        name={name}
        className="tabItem"
        style={
          !disable
            ? { width: "250px" }
            : {
                backgroundColor: "rgba(0, 0, 0, 0.09)",
                width: "250px"
              }
        }
        onClick={() => {
          !disable ? this.handleItemClick(name) : null;
        }}
        active={tabActive === name}
      >
        <div className="tabTextItem">{name}</div>
        {number && number > 0 ? (
          <Label circular color="red">
            {number >= 100 ? "+99" : number}
          </Label>
        ) : (
          ""
        )}
      </Menu.Item>
    );
  };
  getMenu = tabActive => {
    const { tabs } = this.props;
    return (
      <div className="tabGenericComponent">
        <Menu pointing secondary>
          {tabs.map(({ name, number, disable, tooltip }) =>
            tooltip ? (
              <Popup
                inverted
                style={{ padding: "5px", opacity: 0.8 }}
                content={tooltip}
                trigger={this.getTabHeader(name, number, disable, tabActive)}
                key={name}
              ></Popup>
            ) : (
              this.getTabHeader(name, number, disable, tabActive)
            )
          )}
        </Menu>
        {this.getSegment(tabActive)}
      </div>
    );
  };

  getSegment = tabActive => {
    const { tabs } = this.props;
    return tabs
      .filter(({ name }) => name === tabActive)
      .map(({ content, name }) => <Segment key={name}>{content}</Segment>);
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