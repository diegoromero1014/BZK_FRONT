import Carousel from "../../../../src/components/carousel";

const defaultProps = {}

describe('Test carousel', () => {

    beforeEach(() => {
        defaultProps.dots = true;
        defaultProps.infinite = true;
        defaultProps.slidesToShow = 3;
    });

    describe('Redering unit test', () => {
        it('should render', () => {
            itRenders(<Carousel {...defaultProps} />);
        })
    });

    describe('Test component actions', () => {
        it('should execute buildSliders', () => {
            const wrapper = mount(<Carousel {...defaultProps} />);            

            const data = [
                {
                    component: <div></div>,
                    componentProps: {
                        title: 'Test'
                    }
                }
            ]

            wrapper.instance().buildSliders(data);

            expect(wrapper.find('Slider')).to.have.lengthOf(1);
            wrapper.unmount();
        })
    });
});