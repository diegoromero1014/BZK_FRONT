import { downloadReport } from '../../../utils';

export function generatePDF(changeStateSaveData, requestBody){
    const payload = {
      "messageHeader": {
          "sessionToken": window.localStorage.getItem('sessionTokenFront'),
          "timestamp": new Date().getTime(),
          "service": "",
          "status": "0",
          "language": "es",
          "displayErrorMessage": "",
          "technicalErrorMessage": "",
          "applicationVersion": "",
          "debug": true,
          "isSuccessful": true
      },
      "messageBody": requestBody
    };

    downloadReport(payload, "/generate/PDF", requestBody.name, changeStateSaveData);
}