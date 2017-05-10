import React, {Component, PropTypes} from 'react';
import { Icon } from 'semantic-ui-react';


class TitleSectionComponent extends Component {

    constructor(props) {
        super(props);
        this._renderIcon = this._renderIcon.bind(this);
    }


    _renderIcon(fontSize){
        const {iconClass} = this.props;
        if(!_.isUndefined(iconClass)){
            return (
                <i className={`${iconClass} icon`} style={{fontSize:fontSize}}></i>
            );
        }else{
            return '';
        }
    }

    render() {
        const fontSize = (_.isUndefined(this.props.fontSize)) ? '15px' : this.props.fontSize;
        return (
            <table>
                <tbody>
                <tr>
                    <td>
                        <dl style={{fontSize: fontSize, color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                            {this.props.typeTitle && <Icon name='dropdown'/>}
                            {this._renderIcon(fontSize)}
                            <span className="title-middle"> {this.props.children}</span>
                        </dl>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}

TitleSectionComponent.propTypes = {
    iconClass: PropTypes.string,
    fontSize: PropTypes.string,
    typeTitle: PropTypes.bool.isRequired
};


export default TitleSectionComponent;
