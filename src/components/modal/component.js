import React,{Component} from 'react';
import Modal from 'react-modal';

class ModalComponentDialog extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen : false
    }
    this.closeModal = this.closeModal.bind(this);
    this.openModal= this.openModal.bind(this);
  }
  closeModal(){
    this.setState({modalIsOpen: false});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  render(){
    return (
      <div>
        <button onClick={this.openModal}>Click Me !!</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="modal-dialog"
            >
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Modal title</h4>
              </div>
              <div className="modal-body">
                <p>One fine body&hellip;</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={this.closeModal}>Save changes</button>
              </div>
            </div>
          </Modal>
      </div>
    );
  }
}

export default ModalComponentDialog;
