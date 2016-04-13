import React, {
  Component
} from 'react';
import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';


class ContactComponent extends Component {
  render() {
    return (
      < div className = "tab-pane quickZoomIn animated" >
        <Grid>
            <Row end="xs">
              <Col xs={6}>
              <div className = "tab-content break-word" style={{zIndex :0}}>
                <SearchContactComponent / >
              < /div>
              </Col>
            </Row>
            <Row end="xs">
              <Col xs={12}>
                < ListContactComponent / >
              </Col>
            </Row>
        < /Grid >

       < /div>
    );
  }
}

export default ContactComponent;
