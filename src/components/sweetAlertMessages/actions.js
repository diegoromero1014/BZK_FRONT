/**
 * Created by Andres Hurtado on 21/03/2017.
 */
export const CLOSE_SWT_MESSAGE = "CLOSE_SWT_MESSAGE";
export const SHOW_SWT_MESSAGE = "SHOW_SWT_MESSAGE";

export function swtShowMessage(typeMessage, title, message){
    return {
        type: SHOW_SWT_MESSAGE,
        typeMessage,
        title,
        message
    };
}

export function swtCloseMessage(){
    return {
        type: CLOSE_SWT_MESSAGE
    };
}
