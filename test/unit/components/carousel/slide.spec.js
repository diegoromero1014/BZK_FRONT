import Slide from "../../../../src/components/carousel/slide";

const defaultProps = {};

describe('Test slide', () => {
    describe('Redering unit test', () => {
        it('should render', () => {
            itRenders(<Slide {...defaultProps} />);
        })
    });
});