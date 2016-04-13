import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findShareHolder, keepKeyword} from '../shareHolder/actions';

class SearchContactComponent extends Component {

	constructor(props) {
		super(props);

		this.state = {
			keyword: ''
		};

		this._handleFindShareHolder = this._handleFindShareHolder.bind(this);
		this._handleChangeKeyword = this._handleChangeKeyword.bind(this);

	}

	_handleFindShareHolder(e) {
		console.log('palabra', this.state.keyword);
		const {findShareHolder} = this.props;
		findShareHolder(this.state.keyword);
	}

	_handleChangeKeyword(e) {
		this.setState({
			keyword: e.target.value
		});
	}

    render() {
        return (
			<div className="InputAddOn">
				<input className="InputAddOn-field" placeholder="Búsqueda por número, nombre, función, cargo" value={this.state.keyword} onChange={this._handleChangeKeyword} />
				<button className="InputAddOn-item icon-search-sm" onClick={this._handleFindShareHolder}></button>
			</div>
        );
    }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		findShareHolder, keepKeyword
	}, dispatch);
}

function mapStateToProps({shareHolders}, ownerProps) {
	return {
		shareHolders
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContactComponent);
