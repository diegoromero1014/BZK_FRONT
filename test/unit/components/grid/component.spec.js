import GridComponent from '../../../../src/components/grid/component';
import TdComponent from '../../../../src/components/grid/tdComponent';
import Highlighter from "react-highlight-words";
import {DATE_CELL} from '../../../../src/components/grid/constants';
import * as actionsGlobal from '../../../../src/actionsGlobal';

describe("Test Grid Component", () => {

    let defaultProps;
    let headers;

    beforeEach(() => {
        let headersList = [
            {
                title: "titulo",
                key: "prueba"
            }
        ];
        let data = [
            {
                "prueba": "valor prueba"
            }
        ];

        headers = sinon.fake.returns(headersList);
        defaultProps = {
            headers,
            data
        }
    });

    it("Should render component ", () => {
        itRenders(<GridComponent headers={defaultProps.headers} data={defaultProps.data} />);
        expect(headers.callCount).to.equal(4);
    });

    it("Should render TDComponent", () => {
        const wrapper = shallow(<GridComponent {...defaultProps} />);
        expect(wrapper.find(TdComponent).find({columnRow: "valor prueba"})).to.have.length(1);
    });

});

describe("Test CELL_DATA", () => {

    let defaultProps;
    let headers;
    let stubAction;

    beforeEach(() => {
        let headersList = [
            {
                type: DATE_CELL,
                title: "Fecha de creación",
                key: "createDate"
            }
        ];
        let data = [
            "sad"
        ];

        headers = sinon.fake.returns(headersList);
        stubAction = sinon.stub(actionsGlobal, "mapDateValueFromTask");
        stubAction.returns("hola");

        defaultProps = {
            headers,
            data
        }
    });

    afterEach(() => {
        stubAction.restore();
    });

    it("Should render CELL_DATA", () => {
        const wrapper = shallow(<GridComponent {...defaultProps} />);
        expect(wrapper.find(TdComponent).find({columnRow:"hola"})).to.have.length(1);
        expect(stubAction.called).to.equal(true);
    });

});


describe("Test renderRowExpanded", ()=>{

    let defaultProps;
    let headers;
    let htmlToTextRegexStub;

    beforeEach(() => {
        htmlToTextRegexStub = sinon.stub(actionsGlobal, 'htmlToTextRegex');
        let headersList = [
            {
                title: "Fecha de creación",
                key: "createDate"
            }
        ];
        let data = [
            "sad"
        ];

        headers = sinon.fake.returns(headersList);

        defaultProps = {
            headers,
            data,
            textToHighlight:'resaltado'
        }
    });

    afterEach(() => {
        htmlToTextRegexStub.restore();
    });

    it("Should execute rowExpanded when has text attribute in value", ()=>{

        let value = {
            text: 'Texto para el resaltado'
        };

        const wrapper = shallow(<GridComponent {...defaultProps} />);
        const response = shallow(wrapper.instance().renderRowExpanded(value))
        const rowExpanded = wrapper.instance().renderRowExpanded(value);
        expect(rowExpanded).not.to.equal(null);
        response.html();
    });

    it("Should execute rowExpanded when has text attribute but not values", ()=>{

        let value = {
            text: ''
        };
        const wrapper = shallow(<GridComponent {...defaultProps} />);
        const rowExpanded = wrapper.instance().renderRowExpanded(value);
        expect(rowExpanded).to.equal(null);
    });

    it("Should execute rowExpanded when has text attribute in value", ()=>{

        const wrapper = shallow(<GridComponent {...defaultProps} />);
        const rowExpanded = wrapper.instance().renderRowExpanded({});
        expect(rowExpanded).to.equal(null);
    });

    it('should execute rowExpandedData when has value', ()=>{
        let value = {
            text: 'Texto para el resaltado'
        };
        const wrapper = shallow(<GridComponent {...defaultProps} />);
        const response = shallow(wrapper.instance().renderRowExpandedData (value));
        expect(response.find(Highlighter)).to.have.length(1);
    });

});