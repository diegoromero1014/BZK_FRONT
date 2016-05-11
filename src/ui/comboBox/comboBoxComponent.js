import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

var focusInField = false;


class comboBoxComponent extends Component {
   constructor(props) {
       super(props);
       this.state = {
           value: ''
       };
       this.mapValuesToDropDown = this.mapValuesToDropDown.bind(this);
       this.scrollTo = this.scrollTo.bind(this);
   }

   scrollTo() {
       console.log(this.state);
       window.scrollTo(this.state.right, this.state.top);
   }

   componentWillReceiveProps({value, name}) {
     const selector = $(`.ui.selection.dropdown.${name}`);
     selector.dropdown('refresh');
     if (_.isEqual(value, '')) {
         selector.dropdown('clear');
     }else{
       if( value !== null && value !== undefined && value !== "" ){
         selector.dropdown('set selected', value);
         selector.dropdown('set value', value);
       }
     }
   }

   componentDidMount() {
     const {onChange, onBlur, name, defaultValue, value, data} = this.props;
     const selector = $(`.ui.selection.dropdown.${name}`);
     const self = this;
     selector.dropdown({
         onChange: function (id, text) {
             focusInField = false;
             self.touched = true;
             self.setState({
                 value: id
             });
             onBlur(id, text);
             onChange(id, text);
         }
     });

     const {comboScroll} = this.refs;
     const compoRect = comboScroll.getBoundingClientRect();
     this.setState({
         top: compoRect.top,
         bottom: compoRect.bottom,
         left: compoRect.left,
         right: compoRect.right
     });
   }

   mapValuesToDropDown(item, idx) {
       const {textProp, valueProp, value} = this.props;
       return (
           <div className="item" data-value={_.get(item, valueProp)} value={value || this.state.value} key={idx}>
               {_.get(item, textProp)}
           </div>
       );
   }

   render() {
      console.log(this.state);
       const {nameInput, labelInput, invalid, data, touched, error, name, disabled, deployUp} = this.props;
       if( touched && invalid){
         this.scrollTo();
       }
       return (
         <div ref="comboScroll">
               <div className={`styleWidthComponents ui search selection dropdown ${disabled} ${name} ${deployUp === true ? 'bottom pointing' : ''}`}>
                   <input type="hidden" name={nameInput}/>
                   <i className="dropdown icon"/>
                   <div className="default text">{labelInput}</div>
                   <div className="right menu">
                       {_.map(data, this.mapValuesToDropDown)}
                   </div>
               </div>
               {
                   touched && error &&
                   <div>
                       <div className="ui pointing red basic label">
                           {error}
                       </div>
                   </div>
               }
          </div>
       );
   }
}

comboBoxComponent.PropTypes = {
  nameInput: PropTypes.string.isRequired,
  labelInput: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  textProp: PropTypes.string.isRequired,
  valueProp: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string
};

export default comboBoxComponent;
