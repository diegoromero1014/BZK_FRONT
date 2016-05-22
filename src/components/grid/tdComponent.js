import React, {
  Component,
  PropTypes
} from 'react';

class TdComponent extends Component {
  render(){
    const {columnRow,styles} = this.props;
    return (
      <td style={styles}>{columnRow}</td>
    );
  }
}

TdComponent.propTypes = {
  columnRow: PropTypes.string
};


export default TdComponent;
