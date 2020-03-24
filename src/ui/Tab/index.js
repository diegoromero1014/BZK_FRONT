import React, { Component } from "react";
import { Segment, Label, Menu } from "semantic-ui-react";
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
    const { name } = this.props.tabs[0];
    this.setState({ tabActive: name });
  }

  handleItemClick = name => this.setState({ tabActive: name });

  getMenu = tabActive => {
    const { tabs, classNameColor = 'blue' } = this.props;
    return (
      <div className="tabGenericComponent">
        <Menu pointing secondary style={{
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'initial', 
          width: '100%',
          overflowX: 'auto'
        }}>
          {tabs.map(({ name, number, disable }) => (
            <Menu.Item
              name={name}
              className="tabItem"
              style={
                !disable
                  ? { width: "250px" }
                  : { backgroundColor: "rgba(0, 0, 0, 0.09)", width: "250px" }
              }
              onClick={() => {
                !disable ? this.handleItemClick(name) : null;
              }}
              active={tabActive === name}
            >
              <div className="tabTextItem">{name}</div>
              {number && (
                <Label circular className={classNameColor}>
                  {number}
                </Label>
              )}
            </Menu.Item>
          ))}
        </Menu>
        {this.getSegment(tabActive)}
      </div>
    );
  };

  getSegment = tabActive => {
    const { tabs } = this.props;

    return tabs.filter(({ name }) => name === tabActive).map(({ content }) => <Segment>{content}</Segment>);
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
