import {DELETE_GROUP,VIEW_LINK_GROUP,TITTLE_MODAL_GROUP} from './constants';

export const mapDataGrid = (data = []) => {
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el grupo ";


    return data.map((group, idx) => ({
        countContact: group.countContact,
        modalNameLink: {
            id: group.id,
            text:group.name,
            modalTitle:TITTLE_MODAL_GROUP,
            component: VIEW_LINK_GROUP
        },
        actions: {
            actionView: true,
            id: group.id,
            urlServer: "./component",
            component: "VIEW_EMAILS_GROUP"
        },
        delete: {
            actionDelete: true,
            urlServer: "/deleteGroupFavoriteContact",
            typeDelete: DELETE_GROUP,
            mensaje: mensaje + group.name+ "?",
            json: {
                "messageHeader": {
                    "sessionToken": window.localStorage.getItem('sessionToken'),
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
                "messageBody": group.id,
            }
        }
}));
};
