import React, {
  Component,
  PropTypes
} from 'react';

class TdComponent extends Component {
  render(){
    const columnRow = this.props.columnRow;
    return (
      <td>{columnRow}</td>
    );
  }
}

TdComponent.propTypes = {
  columnRow: PropTypes.string.isRequired
};


export default TdComponent;
