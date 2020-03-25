import React from 'react';
import ProgressBarComponent from '../../../../src/ui/ProgressBar';
const defaultProps = {
    pending:30,
    finalized:70
}
describe("Test ProgressBar Component",  () => {
    it("Should render the progress bar", ()=>{
        itRenders(<ProgressBarComponent {...defaultProps}></ProgressBarComponent>);
    });
});