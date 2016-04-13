import React, {
  Component
} from 'react';
import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';


class ContactComponent extends Component {
  render() {
    return ( < div className = "tab-pane quickZoomIn animated active" >
      < div >
      < div className = "tab-content break-word" style={{zIndex :0}}>
      < SearchContactComponent / >
      < /div> < div className = "row" > < ListContactComponent / >
      < /div> < /div > < /div>
    );
  }
}

export default ContactComponent;
