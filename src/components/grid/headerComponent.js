import React, {
  Component,
  PropTypes
} from 'react';

class HeaderComponent extends Component {
  render(){
    const {titleColumn, orderColumn, width} = this.props;
    return (
      <th style={width ? {textTransform:'none', width: width} : {textTransform:'none'}}>{titleColumn}{orderColumn}</th>
    );
  }
}

HeaderComponent.propTypes = {
   titleColumn: PropTypes.string.isRequired,
   orderColumn:PropTypes.object
};


export default HeaderComponent;
