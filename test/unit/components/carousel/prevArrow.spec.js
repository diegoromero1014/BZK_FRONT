import PrevArrow from "../../../../src/components/carousel/prevArrow";

const defaultProps = {}

describe('Test PrevArrow', () => {

    beforeEach(() => {
        defaultProps.onClick = sinon.fake();
    });

    describe('Redering unit test', () => {
        it('should render', () => {
            itRenders(<PrevArrow {...defaultProps} />);
        })
    });
});