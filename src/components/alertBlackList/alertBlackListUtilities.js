/**
 * Created by Andres Hurtado on 02/03/2017.
 */
import {shorterStringValue} from '../../actionsGlobal';

export const mapDataGrid = (data = []) => {
    return data.map((blackList, idx) => ({
        idBlackList: blackList.idBlackList,
        idClient: blackList.idClient,
        idEntity: blackList.idEntity,
        documentClient: blackList.documentClient,
        nameClient: shorterStringValue(blackList.nameClient),
        documentTypeEntity: blackList.documentTypeEntity,
        documentEntity: blackList.documentEntity,
        nameEntity: shorterStringValue(blackList.nameEntity),
        typeEntity: blackList.typeEntity,
        message: shorterStringValue(blackList.message, 300),
        level: blackList.levelBlackList
    }));
};
