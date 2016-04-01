import React, {Component, PropTypes} from 'react';

class ImageBigLogin extends Component{
  render(){
    const {style} = this.props;
    console.log(style);
    return (
      <div
          style={style}
      >
        <p>Holaaaa</p>
      </div>
    )
  }
}

ImageBigLogin.propTypes = {
   style: PropTypes.object.isRequired
};

export default ImageBigLogin;
