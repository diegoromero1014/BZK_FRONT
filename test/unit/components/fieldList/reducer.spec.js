import reducer from '../../../../src/components/fieldList/reducer';
import { createList, addFieldToList } from '../../../../src/components/fieldList/actions';
describe("Test fieldList/reducer", () => {

    it("should create new list", () => {

        const action = createList("listName", {
            defaultValue: "test"
        });

        const response = reducer(undefined, action);

        expect(response.hasOwnProperty("listName")).to.equal(true);
    });

    it("should create new list with default values", () => {

        const action = createList("listName", {
            defaultValue: "test"
        });

        const response = reducer(undefined, action);

        expect(response.hasOwnProperty("listName")).to.equal(true);
        expect(response["listName"].defaultValue).to.equal("test");
    });

    it("should return same state when the list was already created", () => {

        const action = createList("listName", {
            defaultValue: "test"
        });

        const state = {
            listName: {
                defaultValue: "initialValue"
            }
        }

        const response = reducer(state, action);

        expect(response.hasOwnProperty("listName")).to.equal(true);
        expect(response).to.equal(state);
    });

    it("should add fields to list", () => {

        const state = {
            listName: {
                fields: {

                }
            }
        }

        const action = addFieldToList("listName")("value", "prueba");
        const newState = reducer(state, action);

        expect(newState["listName"].fields.value).to.equal("prueba");

    });

});