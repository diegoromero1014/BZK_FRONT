import axios from 'axios';
import { setAuthorizationHeader, successInterceptor, errorInterceptor } from '../../../../src/api'

describe("Test api/index", () => {

    let historyRoute;

    beforeEach(() => {
       historyRoute = [];
    })

    afterEach(() => {

    })

    it("should set authorization header", () => {
        setAuthorizationHeader("prueba");
        expect(axios.defaults.headers.common['Authorization']).to.equal("Bearer prueba")
    });

    it("SuccessInterceptor should return response", () => {
        let response = successInterceptor("prueba");
        expect(response).to.equal("prueba");
    })

    it("ErrorInterceptor should redirect to login on 401 error code", () => {
        const error = {
            response: {
                status: 401
            }
        }
        errorInterceptor(historyRoute)(error);
        expect(historyRoute[0]).to.equal("/login");
    })

    it("ErrorInterceptor should redirect to dashboard on 403 error code", () => {
        const error = {
            response: {
                status: 403
            }
        }
        errorInterceptor(historyRoute)(error);
        expect(historyRoute[0]).to.equal("/dashboard");
    })

    it("ErrorInterceptor should return failed promise when error is not 403 or 401", () => {
        const error = {
            response: {
                status: 500
            }
        }
        let response = errorInterceptor(historyRoute)(error);
        response.then(() => {
            expect("promise should be rejected").to.equal("");
        }).catch((err) => {
            console.log(err);
            expect("rejected promise").to.equal("rejected promise");
            expect(err).to.equal(error);
        })
    })


})