import React from 'react';
import Pagination from '../../../../src/components/table/Pagination';
import { DEFAULT_PAGE } from '../../../../src/components/table/constants';

let defaultProps ;
let handleOnChangePage ;
let handlePrevPage ;
let handleNextPage ;
let getPages ;
let renderItem ;
let totalRecords ;
let recordsPerPage ;


describe('Test Pagination Component', () => {
    
    beforeEach(() => {
        handleOnChangePage = sinon.fake();
        handlePrevPage = sinon.fake();
        handleNextPage = sinon.fake();
        getPages = sinon.fake();
        renderItem = sinon.fake();

        defaultProps = {
            colSpan : '',
            recordsPerPage : '',
            totalRecords : '',

            handleOnChangePage,
            handlePrevPage,
            handleNextPage,
            getPages,
            renderItem,
            DEFAULT_PAGE
        }

    })

    describe('Test rendering', () => {

        it('Render Pagination Component', () => {
            itRenders(<Pagination {...defaultProps}/>)
        })
    })
    
    describe('Test function of Pagination Component', () => {
        
        it('Test function renderItem ', () => {
            defaultProps = {
                recordsPerPage : 5,
                totalRecords : 20,
    
                getPages,
                renderItem
            }
            const wrapper = shallow(<Pagination {...defaultProps}/>)
            wrapper.setState({
                totalPage: 0,
                page: 1,
                pages: []
            })
            wrapper.instance().renderItem();
            expect(wrapper.length).to.equal(1);
        })

        it('Test getPages function', () => {
            const wrapper = shallow(<Pagination {...defaultProps}/>)
            totalRecords = 20 ;
            recordsPerPage = 5 ; 
            wrapper.instance().getPages( totalRecords, recordsPerPage );
            
        })
    
        it('Test handleNextPage function', () => {
            const wrapper = shallow(<Pagination {...defaultProps}/>);
            wrapper.setState({
                totalPage: 0,
                page: 1,
                pages: []
            })
            wrapper.instance().handleNextPage();
            expect(wrapper.state().page).to.equal(2);
        })
    
        it('Test handlePrevPage  function', () => {
            const wrapper = shallow(<Pagination {...defaultProps}/>);
            wrapper.setState({
                totalPage: 0,
                page: 2,
                pages: []
            })
            wrapper.instance().handlePrevPage();
            expect(wrapper.state().page).to.equal(1);
        })

        it('Test handlePrevPage  function', () => {
            const wrapper = shallow(<Pagination {...defaultProps}/>);
            wrapper.setState({
                totalPage: 0,
                page: 2,
                pages: []
            })
            wrapper.instance().handlePrevPage();
            expect(wrapper.state().page).to.equal(1);
        })

        it('Test handleOnChangePage function', () => {
            const wrapper = shallow(<Pagination {...defaultProps}/>);
            wrapper.setState({
                totalPage: 0,
                page: 1,
                pages: []
            })
            let page = 4 ; 
            wrapper.instance().handleOnChangePage(page);
            expect(wrapper.state().page).to.equal(4);
        })

    })
})

