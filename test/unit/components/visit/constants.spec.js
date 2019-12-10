import { getRequestBodyDownloadPDF } from "../../../../src/components/visit/constants";

describe("Test Visit/constants", () => {

    it("should return Request body", () => {
        const result = getRequestBodyDownloadPDF("prueba");
        expect(result.params.P_ID_PREVISIT).to.equal("prueba");
    })

})