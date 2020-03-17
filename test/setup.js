
import sinon from 'sinon';
// -----------------
// JSDom
// -----------------
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
document['getElementById'] = () => { return {} };
global.document = document;
global.window = document.defaultView;
global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};

global.window.matchMedia =
    window.matchMedia ||
    (() => {
        return { matches: false, addListener: () => {}, removeListener: () => {} };
    });

global.navigator = {
    userAgent: 'node.js',
    platform: 'Win32'
};

// ------------------
// Chai
// ------------------
const chai = require('chai')
const spies = require('chai-spies');
chai.use(spies);
global.expect = chai.expect;
global.should = chai.should();
global.spy = (object) => chai.spy(object);

// ------------------
// Enzyme
// ------------------
const { shallow, mount, render, configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });
global.shallow = shallow;
global.mount = mount;
global.render = render;
global.sinon = sinon;

// ------------------
// React (if using ProvidePlugin from webpack all of these are needed)
// ------------------
const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
global.React = React;
global.PropTypes = PropTypes;
global.ReactDOM = ReactDOM;
global.Node = {};
global.window.localStorage = { getItem: () => {}, setItem: () => {} };
global.window.sessionStorage = { getItem: () => {}, setItem: () => {}, removeItem: () => {}, clear: () => {} };
global.window.open = () => {}
global.window.dataLayer = [];
global.window.Object = Object;
global.window.Math = Math;

// ------------------
// Helpers
// ------------------
global.itRenders = Component => {
    const wrapper = shallow(Component);
    expect(shallow(Component).length).to.eql(1);
    return wrapper;
};

global.itRendersChildComponent = (parent, child, num = 1) => {
    const wrapper = shallow(parent);
    expect(wrapper.find(child)).to.have.length(num);
    return wrapper;
}

/*
  Disable webpack-specific 'loaders' for tests
  extensions: [".styl",".css",".png",".jpg",".gif",".svg",".ico"]
*/
require.extensions['.scss'] = function() {
    return null;
};