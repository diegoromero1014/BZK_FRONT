import React, {Component} from 'react';
import MenuComponent from '../menu/component';
import NavBarComponent from '../navBar/navBarComponent';
import {redirectUrl} from '../globalComponents/actions';
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

    render() {
        const {navBar} = this.props;
        var widthComponent = '70px';
        var widthComponentDiv = '95%';
        if(navBar.get('status') === "closed"){
            widthComponent = '205px';
            widthComponentDiv = '85%';
        } else {
            widthComponent= '70px';
            widthComponentDiv= '95%';
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", overflow: "hidden"}}>
                <div style={{float: "left", width: widthComponent, height: "100%", position: "absolute", transition: 'all 0.3s'}} >
                    <MenuComponent />
                </div>
                <div className="header" style={{paddingLeft: widthComponent, height: "100%", float: "left", width: widthComponentDiv, overflow: "hidden", transition: 'all 0.3s'}}>
                    <NavBarComponent />
                    <div style={{backgroundColor: "#ECECEC", width: "100%", height: "91%", float: "left", top: "60px", overflowX: "auto"}}>
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
