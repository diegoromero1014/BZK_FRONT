import React from 'react';
import {MenuListFatherComponent} from "../../../../src/components/menu/menuListFatherComponent";
import Immutable from "immutable";
import * as globalActions from "../../../../src/components/globalComponents/actions";

describe('MenuListFatherComponent test',() =>{


    let menu = Immutable.Map({ menu: ["activeItem","Mis clientes"] });
    let children = Immutable.Map({ children: [{link: "/dashboard/myPendings/draftDocuments"},{text: "Documentos en borrador"}]})
    let defaultProps;
    let changeActiveItemMenu;
    let redirectUrl;
    let closeSession;
    let labelText;
    let linkUrlFather;


    beforeEach(()=>{

        changeActiveItemMenu = sinon.fake();
        closeSession = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps={
            menu,
            children,
            changeActiveItemMenu,
            labelText,
            linkUrlFather
        }
    });

    afterEach(() => {
        redirectUrl.restore();
    });

    it('Should render Component', ()=>{
        itRenders(<MenuListFatherComponent {...defaultProps}/>)
    });

    it('Should render Component equald active item', ()=>{
        let menu = Immutable.Map({ menu: ["activeItem","Mis clientes"] });
        let labelText = "Mis clientes";
        let linkUrlFather = "/link"

        defaultProps.menu = menu;
        defaultProps.labelText = labelText;
        defaultProps.linkUrlFather = linkUrlFather;
        itRenders(<MenuListFatherComponent {...defaultProps}/>)
    });

    it('should execute function _handleClickMenuItemChildren', ()=>{
        const link ="/logout";
        const wrapper = shallow(
          <MenuListFatherComponent {...defaultProps}/>
        );

        wrapper.instance()._handleClickMenuItemChildren(link);
    });
    it('should execute function _handleClickMenuItemChildren when link is diferent at /logout', ()=>{
        const link ="/logIn";
        const wrapper = shallow(
          <MenuListFatherComponent {...defaultProps}/>
        );

        wrapper.instance()._handleClickMenuItemChildren(link);
    });

    it('should execute function _handleClickMenuItemChildren when link is undefined', ()=>{
        const wrapper = shallow(
            <MenuListFatherComponent {...defaultProps}/>
        );

        wrapper.instance()._handleClickMenuItemChildren();
    });

    it('should execute fuction _mapMenuItemsChildren', () => {
        const item ="";
        const wrapper = shallow(
            <MenuListFatherComponent {...defaultProps}/>
        );

        wrapper.instance()._mapMenuItemsChildren(item);
    });
    it('should execute fuction _mapMenuItemsChildren when item with icon', () => {
        const item = {icon: "sign out"};
        const wrapper = shallow(
            <MenuListFatherComponent {...defaultProps}/>
        );

        wrapper.instance()._mapMenuItemsChildren(item);
    });
});