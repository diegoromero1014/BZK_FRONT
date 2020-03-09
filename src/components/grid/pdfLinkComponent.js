import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import { generatePDF } from '../../components/reports/pdf/actions';
import { changeStateSaveData } from '../../components/main/actions';
import {bindActionCreators } from 'redux';

export class PdfLinkComponent extends Component {

  constructor(props){
      super(props);
     this._viewPdf = this._viewPdf.bind(this);
  }

  _viewPdf(){
    const {actionsPdf, dispatchChangeStateSaveData, dispatchGeneratePDF} = this.props;
    dispatchGeneratePDF(dispatchChangeStateSaveData, actionsPdf.requestBody);
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
function mapDispatchToProps(dispatch) {
  return bindActionCreators ({
    dispatchChangeStateSaveData: changeStateSaveData,
    dispatchGeneratePDF: generatePDF
  },dispatch)
}
export default connect(null, mapDispatchToProps) (PdfLinkComponent);
