import Immutable from 'immutable';
import _ from 'lodash';
import { APP_URL, MESSAGE_DOWNLOAD_DATA } from './constantsGlobal';

export function createErrorsPriority(fields, order) {
}

export function shouldHandleError(mapSet, key) {
}

export function downloadReport(payload, endpoint, filename,changeStateSaveData) {
    changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);

    let request = new XMLHttpRequest();

    request.open('POST', APP_URL + endpoint, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        if (this.status === 200) {
            let type = request.getResponseHeader('Content-Type');

            let blob;

            if (typeof File === 'function') {
                blob = new File([this.response], filename, { type: type });
            } else {
                blob = new Blob([this.response], { type: type });
            }

            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);

                let a = document.createElement("a");

                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                URL.revokeObjectURL(downloadUrl);
            }
        } else {
            swtShowMessage('error', 'Error descargando tareas', 'Señor usuario, ocurrió un error al tratar de descargar las tareas pendientes.');
        }
    };

    request.onloadend = function () {
        changeStateSaveData(false, "");
    };

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(payload));
}
