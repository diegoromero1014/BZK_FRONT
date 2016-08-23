import React, {Component, PropTypes} from 'react';
import {scrollToComponent} from '../../components/scrollTo/scrollComponent';
import $ from 'jquery';
import _ from 'lodash';

class comboBoxComponent extends Component {
   constructor(props) {
       super(props);
       this.state = {
           value: '',
           used: false
       };
       this.mapValuesToDropDown = this.mapValuesToDropDown.bind(this);
       this._setUsed = this._setUsed.bind(this);
       this._changeValue = this._changeValue.bind(this);
       this._setPristine = this._setPristine.bind(this);
   }

   _setUsed(used){
     this.setState({
       used
     });
   }

   _clearValues(name){
      const selector = $(`.ui.selection.dropdown.${name}`);
      selector.dropdown('clear');
   }

   _changeValue(value, name){
       const selector = $(`.ui.selection.dropdown.${name}`);
       selector.dropdown('set selected', value);
       selector.dropdown('set value', value);
       this._setUsed(true);
   }

   _setPristine(labelInput, name){
     const selector = $(`.ui.selection.dropdown.${name}`);
     selector.dropdown('clear');
     this._setUsed(false);
     selector.dropdown('set text', labelInput);
   }

   componentWillReceiveProps({value, name, pristine, labelInput}) {
     const selector = $(`.ui.selection.dropdown.${name}`);
     selector.dropdown('refresh');
     const isEmptyAndUsed = _.isEqual(value, '') && this.state.used;
     const valueIsNotEmpty = value !== null && value !== undefined && value !== "";
     const setPristineAgain =  (value === null || value === undefined || value === "") && pristine && this.state.used;
     if(setPristineAgain){
        this._setPristine(labelInput, name);
     }
     else{
       if(valueIsNotEmpty){
         this._changeValue(value, name);
       } else {
           if (isEmptyAndUsed) {
               this._clearValues(name);
           }
       }
     }
   }

   componentDidMount() {
     const {onChange, onBlur, name, defaultValue, value, data} = this.props;
     const selector = $(`.ui.selection.dropdown.${name}`);
     const self = this;
     selector.dropdown({
         onChange: function (id, text) {
             self.touched = true;
             self.setState({
                 value: id,
                 used: true
             });
             onBlur(id, text);
             onChange(id, text);
         }
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
       const {nameInput, labelInput, data, touched, invalid, error, name, disabled, deployUp, scrollTo, parentId,searchClient, styles} = this.props;
       if( touched && invalid ){
         scrollTo(parentId);
       }
       return (
           <div>
               <div className={`styleWidthComponents ui search selection dropdown ${disabled} ${name} ${deployUp === true ? 'bottom pointing' : ''}`} style={styles}>
                   <input type="hidden" name={nameInput}/>
                   <i className="dropdown icon"/>
                   <div className={`default text ${searchClient}`}>{labelInput}</div>
                   <div className={`right menu ${name}`}>
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

export default scrollToComponent(comboBoxComponent);
