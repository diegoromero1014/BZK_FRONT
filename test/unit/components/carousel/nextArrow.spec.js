import NextArrow from "../../../../src/components/carousel/nextArrow";

const defaultProps = {}

describe('Test NextArrow', () => {

    beforeEach(() => {
        defaultProps.onClick = sinon.fake();
    });

    describe('Redering unit test', () => {
        it('should render', () => {
            itRenders(<NextArrow {...defaultProps} />);
        })
    });
});