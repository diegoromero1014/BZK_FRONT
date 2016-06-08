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
      const self = this;
      selector.search({
          cache: false,
          source: data,
          searchFields: [
            'title',
            'description'
          ],
          onSelect : function(event) {
            self.touched = true;
            self.setState({
                value: event
            });
            return 'default';
          },
          onChange: function (id, text) {
            self.touched = true;
          }
        });
        selector.search('search local', value);
        selector.focus();
    }

   componentDidMount() {

   }

   render() {
       const {nameInput, labelInput, data, touched, invalid, error, scrollTo, name, parentId, onChange, onBlur, onKeyPress, value} = this.props;
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
  defaultValue: PropTypes.string
};

export default scrollToComponent(comboBoxFilter);
