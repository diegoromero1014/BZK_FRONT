import React, {Component, PropTypes} from 'react';

export const ScrollTo = Child => class extends Component {
      constructor(props) {
          super(props);
          this.state = {};
          this.scrollTo = this.scrollTo.bind(scrollTo);
      }

      scrollTo() {
          window.scrollTo(this.state.right, this.state.top);
      }

      componentDidMount() {
          const {scrollComp} = this.refs;
          const compoRect = scrollComp.getBoundingClientRect();
          this.setState({
              top: compoRect.top,
              bottom: compoRect.bottom,
              left: compoRect.left,
              right: compoRect.right
          });
      }

      render() {
          const {child, children} = this.props;
          return (
            <div ref="scrollComp">
              <Child scrollTo={this.scrollTo} {...this.props} coords={...this.state}/>
            </div>
          );
      }
  }
