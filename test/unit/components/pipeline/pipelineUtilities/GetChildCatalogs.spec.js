import GetChildCatalogs from './../../../../../src/components/pipeline/pipelineUtilities/GetChildCatalogs';

describe("Test GetChildCatalogs function", () => {
    it("Should set children catalogs to each state", async () => {
        let dispatcher = () => new Promise((resolve, reject) =>
          resolve({
            payload:{
                data:{
                    data:[{ field: "productFamily",},{ field: "products",},{ field: "businessCategory",},]
                }
            }
          } ));
        var state= [];
        const localState = (stateValue) => {
            state = [...state, stateValue ]
        };
        await GetChildCatalogs(1, dispatcher, localState);
        assert.isArray(state);
        expect(state[0]).to.eql({ productsFamily: [{ field: "productFamily" }] });
        expect(state[1]).to.eql({ products: [ { field: 'products' } ] });
        expect(state[2]).to.eql({
          businessCategories: [{ field: "businessCategory" }],
          businessCategories2: [{ field: "businessCategory" }],
        });
    });
});