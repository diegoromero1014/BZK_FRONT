import React from 'react';
import {ModalComponentDeleteRiskGroup} from '../../../../src/components/clientRiskGroup/modalComponentDeleteRiskGroup';
import {createFieldsFromArray} from "../../../helpers/ReduxFormField";
import * as actions from '../../../../src/components/globalComponents/actions';

describe('Test clientRiskGroup/ComponentDeleteRiskGroup', ()=>{

    let fields = createFieldsFromArray(["id","justification"]);
    let defaultProps;
    let deleteRiskGroup;
    let stubRedirect;
    let swtShowMessage;
    let isOpen;

    beforeEach(() => {

        swtShowMessage = sinon.fake();
        isOpen = sinon.fake();
        deleteRiskGroup = sinon.stub();
        deleteRiskGroup.resolves("");
        stubRedirect = sinon.stub(actions, "redirectUrl");

        defaultProps = {
            fields: fields,
            handleSubmit: () => {},
            deleteRiskGroup,
            swtShowMessage,
            isOpen,
            riskGroup:{
                id:"id"
            }
        };
    });

    afterEach(() => {
        stubRedirect.restore();
    });

    it('should render components', ()=>{
        itRenders(<ModalComponentDeleteRiskGroup {...defaultProps} />);
    })

    it('should delete riskGroup', ()=>{


        const wrapper = shallow(
            <ModalComponentDeleteRiskGroup {...defaultProps}  />
        );

        wrapper.instance().requestDeleteRiskGroup();
        expect(deleteRiskGroup.called).to.equal(true);
    })
});