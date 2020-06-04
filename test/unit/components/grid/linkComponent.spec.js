import LinkComponentRedux from '../../../../src/components/grid/linkComponent';
import { LinkComponent } from '../../../../src/components/grid/linkComponent';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let dispatchConsultInfoClient;
let dispatchSeletedButton;
let defaultProps;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;

describe('Unit test LinkComponent', () => {

    beforeEach(() => {
        store = mockStore({});
        dispatchConsultInfoClient = sinon.fake();
        dispatchSeletedButton = sinon.fake();

        defaultProps = {
            dispatchConsultInfoClient,
            dispatchSeletedButton,

            text : "",
            url : '/dashboard/clientEdit',
            isRedirect : false,
            idClient : 102155

        }
    }) 

    describe('Rendering test', () => {
        
        it('render component with redux', () => {
            itRenders(<LinkComponentRedux store={store}/>)
        })

        it('render component', () => {
            itRenders(<LinkComponent {...defaultProps}/>)
        })

    })    

})
