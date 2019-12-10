import ReCaptcha from "../../../../src/components/recaptcha/component";

describe('Test reCaptcha component', () => {

    let defaultProps = {};

    it('should render component', () => {
        itRenders(<ReCaptcha {...defaultProps}></ReCaptcha>);
    });

    it('should render reCaptcha div', () => {
        itRendersChildComponent(<ReCaptcha {...defaultProps}></ReCaptcha>, 'div.recaptcha');
    });
});