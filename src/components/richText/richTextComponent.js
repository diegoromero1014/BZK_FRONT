import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {nonValidateEnter} from '../../actionsGlobal';
import ReactQuill from 'react-quill'
import {isNull} from 'lodash'

class RichText extends Component {
    constructor(props) {
        super(props);
        this.reactQuillRef = null;
        this.quillRef = null;
        this.attachQuillRefs = this.attachQuillRefs.bind(this);
        this.state = {
            text: null
        }

        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    componentDidMount() {
        this.attachQuillRefs()
    }

    componentDidUpdate() {
        this.attachQuillRefs()
    }

    attachQuillRefs() {
        // Ensure React-Quill reference is available:
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        // Skip if Quill reference is defined:
        if (this.quillRef != null) return;

        const quillRef = this.reactQuillRef.getEditor();
        if (quillRef != null) this.quillRef = quillRef;
    }

    handleOnBlur() {
        
        const {onChange} = this.props;
        onChange(this.reactQuillRef.state.value);
        
      }

      componentWillReceiveProps(nextProps) {

        if(nextProps.value != this.state.value) {
            this.setState({value: nextProps.value});
        }

    }
    
    render() {
        const {value, touched, error, disabled} = this.props;
        if (!isNull(this.quillRef)) {
            const quillSize = this.quillRef.getLength();
            const quillText = this.quillRef.getText();
        }
        // No quitar el onChange={(value) => null }, se realiza para evitar que se llame el onChange de reduxForm
        return (
            <div onBlur={() => this.handleOnBlur()}>
                <ReactQuill
                    ref={(el) => {
                        this.reactQuillRef = el
                    }}
                    className={disabled}
                    value={value || ''}
                    modules={RichText.modules}
                    formats={RichText.formats}
                    {...this.props}
                    onChange={(value) => null }
                    
                    />
                {
                    touched && error &&
                    <div style={{marginTop: '15pt'}}>
                        <div className="ui pointing red basic label">
                            {error}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
RichText.modules = {};
RichText.modules.toolbar = [
    [{'size': ['small', false, 'large', 'huge']}],  // header dropdown
    [{'color': []}, {'background': []}],         // dropdown with defaults
    ['bold', 'italic', 'underline'],       // toggled buttons
    [{'list': 'ordered'}, {'list': 'bullet'}],    //
    ['clean'],
];

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
RichText.formats = [
    'header', 'font', 'background', 'color', 'code', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'align', 'direction',
    'link', 'image', 'code-block', 'formula', 'video'
];

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter
    }, dispatch);
}

function mapStateToProps({reducerGlobal}, ownerProps) {
    return {
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RichText);