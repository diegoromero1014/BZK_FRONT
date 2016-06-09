import React, {Component, PropTypes} from 'react';
import {scrollToComponent} from '../../components/scrollTo/scrollComponent';
import $ from 'jquery';
import _ from 'lodash';

class comboBoxFilter extends Component {
   constructor(props) {
       super(props);
   }

    componentWillReceiveProps({value, name, pristine, labelInput, data}) {
      const selector =  $(`.ui.search.${name}`);
      selector.search({
          cache: false,
          source: data,
          searchFields: [
            'title',
            'description'
          ],
          onSelect : function(event) {
            console.log("event.title", event.title);
            self.touched = true;
            value = event.title;
            return 'default';
          },
          onChange: function (id, text) {
            console.log("onChange");
            self.touched = true;
          }
        });
        console.log("value", value);
        selector.search('set value', value);
        selector.search('search local', value);
        selector.focus();
    }

   componentDidMount() {

   }

   render() {
       const {nameInput, labelInput, data, touched, invalid, error, scrollTo, name, parentId, onChange, onBlur, onKeyPress, onSelect, value} = this.props;
       if( touched && invalid ){
         scrollTo(parentId);
       }
       return (
           <div>
             <div className={`styleWidthComponents ui search selection fluid ${name}`}>
               <div className="ui icon input" style={{width: "100%"}}>
                 <input className="prompt" id={nameInput}
                   style={{borderRadius: "3px"}}
                   autoComplete="off"
                   type="text"
                   value={value}
                   onBlur={onBlur}
                   onChange={onChange}
                   placeholder="Ingrese un criterio de búsqueda..."
                   onKeyPress={onKeyPress}
                   onSelect={onSelect}
                 />
                 <i className="search icon"></i>
               </div>
               <div className="results"></div>
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

comboBoxFilter.PropTypes = {
  nameInput: PropTypes.string,
  labelInput: PropTypes.string,
  data: PropTypes.array,
  textProp: PropTypes.string,
  valueProp: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string
};

export default scrollToComponent(comboBoxFilter);
