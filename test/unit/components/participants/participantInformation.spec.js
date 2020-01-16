import React from 'react';

import { ParticipantInformation } from '../../../../src/components/participants/ParticipantInformation';

let defaultProps = {
    selectedRecord: { interlocutorObjs: [{ id: '', text: 'Any text' }] },
    dispatchCleanList: sinon.fake(),
    dispatchCreateList: sinon.fake(),
    dispatchAddToList: sinon.fake()
}

describe('ParticipantInformation Test', () => {


    it('Should render ParticipantInformation', () => { 
        itRenders(<ParticipantInformation {...defaultProps} />)
    })

    it('When interlocutorObjs is undefinded', () => { 
        defaultProps.selectedRecord.interlocutorObjs = undefined;
        itRenders(<ParticipantInformation {...defaultProps} />)
    })

    it('When interlocutorObjs has information', () => { 
        defaultProps.selectedRecord.interlocutorObjs = [{ id: '', text: 'Any text' }];
        itRenders(<ParticipantInformation {...defaultProps} />)
    })

})