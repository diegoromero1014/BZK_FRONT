import { PdfLinkComponent } from "../../../../src/components/grid/pdfLinkComponent";

describe("Test PdfLinkComponent", () => {

    let defaultProps;
    let title = "title";
    let dispatchGeneratePDF;

    beforeEach(() => {
        dispatchGeneratePDF = sinon.fake();
        defaultProps = {
          actionsPdf: { title, requestBody: {} },
          dispatchGeneratePDF
        };
        
    });

    it("should render pdfLinkComponent", () => {
        itRenders(<PdfLinkComponent {...defaultProps} />);
    });

    it("should render title", () => {
        const wrapper = shallow(<PdfLinkComponent {...defaultProps} />);
        expect(wrapper.find("a").text()).to.equal(title);
    })

    it("should call dispatchGeneratePDF", () => {
        const wrapper = shallow(<PdfLinkComponent {...defaultProps} />);
        wrapper.find("a").simulate("click");
        expect(dispatchGeneratePDF.callCount).to.equal(1);
    });

})