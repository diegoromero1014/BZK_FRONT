import React, {Component} from 'react';
import _ from 'lodash';

export const scrollToComponent = (ChildComponent) => {
    const name = _.uniqueId("scrollBox_");
    return class scrollComponent extends Component {
        constructor(props) {
            super(props);
            this.scrollTo = this.scrollTo.bind(this);
        }

        scrollTo(id) {
            if (this.refs[name] !== null && id) {
                var combo = this.refs[name];
                const parentScroll = document.getElementById(id).scrollTop;
                const diff = combo.getBoundingClientRect().height < 50 ? combo.getBoundingClientRect().height + 50 : combo.getBoundingClientRect().height;
                document.getElementById(id).scrollTop = parentScroll + combo.getBoundingClientRect().top - diff;
            }
        }

        componentDidMount() {
            var combo = this.refs[name];
            var comboRect = combo.getBoundingClientRect();
        }

        render() {
            return (
                <div ref={name}>
                    <ChildComponent scrollTo={this.scrollTo} {...this.props}/>
                </div>
            );
        }
    }
};
