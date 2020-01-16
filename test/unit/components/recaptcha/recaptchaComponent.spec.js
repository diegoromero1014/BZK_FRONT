import ReCaptcha from "../../../../src/components/recaptcha/ReCaptcha";

describe('Test reCaptcha component', () => {

    let defaultProps ;
    let _getValueRecaptcha;

    beforeEach(() => {
        _getValueRecaptcha = sinon.fake();

        defaultProps = {_getValueRecaptcha};
    });

    it('should render component', () => {
        itRenders(<ReCaptcha {...defaultProps}></ReCaptcha>);
    });

    it('when execute handleCaptchaResponseChange', () => {
        let value = "xcd45";
        const wrapper = shallow(
            <ReCaptcha {...defaultProps}/>
        );

        wrapper.instance().handleCaptchaResponseChange(value);
        expect(_getValueRecaptcha.called).to.equal(true);

    });
});