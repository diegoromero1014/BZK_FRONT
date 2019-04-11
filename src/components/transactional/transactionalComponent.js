import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllCategories } from './actions'
import { redirectUrl } from '../globalComponents/actions';
import CategoryComponent from './CategoryComponent';

import '../../../styles/modules/reportingCategories/category.scss';

class Transactional extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: []
        }
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { getAllCategories } = this.props;

            getAllCategories().then(resolve => {
                if (resolve && resolve.payload && resolve.payload.data) {
                    this.setState({
                        categories: resolve.payload.data.data
                    })
                }
            });
        }
    }

    renderCategories() {
        if (this.state.categories) {
            return this.state.categories.map((category, index) => {
                return (
                    <CategoryComponent
                        key={index + category.id}
                        title={category.name}
                        iconName={category.icon}
                        content={category.reports}
                    />
                )
            })
        }
    }

    render() {
        return (
            <div className="transactional-container">
                {this.renderCategories()}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllCategories
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Transactional);
