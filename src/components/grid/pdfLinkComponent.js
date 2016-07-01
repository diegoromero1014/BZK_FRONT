import React, {
  Component,
  PropTypes
} from 'react';
import {APP_URL} from '../../constantsGlobal';

class PdfLinkComponent extends Component {

  constructor(props){
      super(props);
     this._viewPdf = this._viewPdf.bind(this);
  }

  _viewPdf(){
    const {actionsPdf} = this.props;
    window.open(APP_URL + actionsPdf.urlRedirect);
  }

  render(){
  const {actionsPdf} = this.props;
    return (
      <td><a style={{cursor: 'pointer',textDecoration: 'underline'}} onClick={this._viewPdf}>{actionsPdf.title}</a></td>
    );
  }
}

PdfLinkComponent.propTypes = {
   actionsPdf: PropTypes.object
};

export default PdfLinkComponent;
