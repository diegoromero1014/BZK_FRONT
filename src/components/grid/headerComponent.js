import React, {
  Component,
  PropTypes
} from 'react';

class HeaderComponent extends Component {
  render(){
    const titleColumn = this.props.titleColumn;
    return (
      <th>{titleColumn}</th>
    );
  }
}

HeaderComponent.propTypes = {
   titleColumn: PropTypes.string.isRequired
};


export default HeaderComponent;
