/**
 * Created by Andres Hurtado on 21/03/2017.
 */
export const CLOSE_SWT_MESSAGE = "CLOSE_SWT_MESSAGE";
export const SHOW_SWT_MESSAGE = "SHOW_SWT_MESSAGE";

/**
 * 
 * @param {String} typeMessage 
 * @param {String} title 
 * @param {String} message 
 * @param {Object} props - Recibe las siguientes propiedades:
 *          - onConfirmCallback: Funcion a ejecutar cuando se cierra el PopUp 
 */
export function swtShowMessage(typeMessage, title, message, props){
    return {
        type: SHOW_SWT_MESSAGE,
        typeMessage,
        title,
        message,
        props
    };
}

export function swtCloseMessage(){
    return {
        type: CLOSE_SWT_MESSAGE
    };
}
