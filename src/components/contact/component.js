import React, {
  Component
} from 'react';
import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';


class ContactComponent extends Component {
  render() {
    return (
      < div className = "tab-pane quickZoomIn animated"
          style={{width: "100%", height: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "15px"}} >
        <div className = "tab-content break-word" style={{zIndex :0}}>
          <SearchContactComponent / >
        < /div>
        < ListContactComponent / >
     < /div>
    );
  }
}

export default ContactComponent;
