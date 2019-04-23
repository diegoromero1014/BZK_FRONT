import React, { Component, PropTypes } from 'react';
import { Icon } from "semantic-ui-react";
import ReportsCardsComponent from './ReportsCardsComponent';


class CategoryComponent extends Component {

    componentDidMount() {
        this.handleOnClick();
    }

    handleOnClick() {
        const categories = document.getElementsByClassName('container-category');

        for (let i = 0; i < categories.length; i++) {
            categories[i].onclick = function () {
                const content = this.nextElementSibling;

                if (content.style.height) {
                    content.style.height = null;
                    content.style.paddingTop = "20px";
                    content.style.paddingBottom = "30px";
                    
                    let currentArrow = document.getElementsByClassName("arrow-active");

                    currentArrow[0].className = currentArrow[0].className.replace("arrow-active", "");
                } else {
                    content.style.height = "0px";
                    content.style.paddingTop = "0px";
                    content.style.paddingBottom = "0px";
                    

                    this.children[2].className += " arrow-active";
                }
            }
        }
    }

    handleRenderContent(content) {
        if (content) {
            const contentMain = content.map((content, index) => {
                return (
                    <ReportsCardsComponent
                        key={index + content.id}
                        title={content.name}
                        description={content.description}
                        type={content.type}
                        url={content.value}
                    />
                )
            })

            return contentMain;
        }
    }

    render() {
        const { title, iconName, content } = this.props;

        return (
            <div>
                <div className="container-category">
                    <div className="container-icon">
                        <Icon name={iconName ? iconName : 'chart bar'} size="big" />
                    </div>

                    <div className="container-title">
                        <h1>{title}</h1>
                    </div>

                    <div className="container-arrow">
                        <Icon name="angle down" size="big" />
                    </div>
                </div>
                <div className="category-content">
                    {this.handleRenderContent(content)}
                </div>
            </div>
        );
    }
}

CategoryComponent.propTypes = {
    title: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    content: PropTypes.array.isRequired,
};

export default CategoryComponent;