import React, {
  Component,
  PropTypes
} from 'react';
import {redirectUrl} from '../globalComponents/actions';

class ButtonDetailsRedirectComponent extends Component {

  constructor(props){
    super(props);
    this._detailVisit = this._detailVisit.bind(this);
  }

  _detailVisit(){
      const {actionsRedirect} = this.props;
      redirectUrl(actionsRedirect.urlRedirect + '/' + actionsRedirect.id);
  }

  render(){
    const {actionsRedirect} = this.props;
    return (
      <td><button className="btn btn-primary btn-sm" onClick={this._detailVisit}>
        <i className="zoom icon" style={{margin:'0em', fontSize : '1.2em'}} />
      </button></td>
    );
  }
}

ButtonDetailsRedirectComponent.propTypes = {
  actionsRedirect: PropTypes.object
};


export default ButtonDetailsRedirectComponent;
