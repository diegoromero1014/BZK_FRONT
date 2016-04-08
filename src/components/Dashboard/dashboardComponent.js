import React, {Component} from 'react';
import MenuComponent from '../menu/component';
import NavBarComponent from '../navBar/navBarComponent';
import {redirectUrl} from '../globalComponents/actions';
import moment from 'moment';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            widthComponent: '70px',
            widthComponentDiv: '95%'
        };
    }

    componentWillMount(){
      if( window.localStorage.getItem('sessionToken') === "" ){
        redirectUrl("/login");
      }
    }

    componentWillReceiveProps(){
        const {navBar} = this.props;
        if(this.state.widthComponent === "205px"){
            this.setState({widthComponent: '70px'});
            this.setState({widthComponentDiv: '95%'});
        } else {
            this.setState({widthComponent: '205px'});
            this.setState({widthComponentDiv: '85%'});
        }
        //console.log("navBar",navBar.get('status'));
    }
    render() {
        return (
            <div style={{width: "100%", height: "100%", position: "absolute", overflow: "hidden"}}>
                <div style={{float: "left", width: this.state.widthComponent, height: "100%", position: "absolute", transition: 'all 0.3s'}} >
                    <MenuComponent />
                </div>
                <div className="header" style={{paddingLeft: this.state.widthComponent, height: "100%", float: "left", width: this.state.widthComponentDiv, overflow: "hidden", transition: 'all 0.3s'}}>
                    <NavBarComponent />
                    <div style={{backgroundColor: "#ECECEC", height: "100%", width: "100%", float: "left", top: "60px"}}>
                      {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({login, navBar},ownerProps) {
  return {
    login,
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
