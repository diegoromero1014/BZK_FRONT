import React, {Component} from 'react';
import SearchContactComponent from './searchShareHolderComponent';
import ShareHolderTableComponent from './shareHolderTableComponent';
import {Row, Grid, Col} from 'react-flexbox-grid';

class ShareHolderComponent extends Component {
	render() {
		return (
			<div>
      			<Row>
      				<Col xs={3} md={3}>
      					<SearchContactComponent />
      				</Col>
      			</Row>
      			<Row>
      				<Col xs={12}>
        				<ShareHolderTableComponent />
        			</Col>
      			</Row>
						</div>
		);
	}
}

export default ShareHolderComponent;
