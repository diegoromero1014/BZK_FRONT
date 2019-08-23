
export function getUserAgent() {
    return "";
}

export function isInternetExplorer() {
    return /MSIE|Trident|Edge/.test(getUserAgent());
}

export function executeFunctionIf(condition, doable, onError) {
    if(condition()) {
        doable();
    } else {
        onError();
    }
}

export function executeFunctionIfInternetExplorer(doable, onError) {
    executeFunctionIf(isInternetExplorer, doable, onError);
}

export function showSweetAlertErrorMessage(swtShowMessage) {
    return () => swtShowMessage("warning", "Funcionalidad no disponible", "Señor usuario, esta funcionalidad solo esta disponible en Internet Explorer")
}