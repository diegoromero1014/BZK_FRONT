export const buildJsoncommercialReport = (commercialReport, usersPermission, confidential) => {
    let json = {
        "id": null,
        "isConfidential": confidential,
        "usersWithPermission": usersPermission,
        "status": null,
        "createdBy": null,
        "createdTimestamp": null
    }

    if (commercialReport) {
        json.id = commercialReport.id;
        json.status = commercialReport.status;
        json.createdBy = commercialReport.createdBy;
        json.createdTimestamp = commercialReport.createdTimestamp;
    }

    return json;
}

export const fillUsersPermissions = (usersWithPermission, addUsers) => {
    if (Array.isArray(usersWithPermission) && usersWithPermission.length) {
        usersWithPermission.forEach(userWithPermission => {
            let newUser = {
                id: userWithPermission.id,
                commercialReport: userWithPermission.commercialReport,
                user: {
                    id: userWithPermission.user.id,
                    username: userWithPermission.user.username,
                    name: userWithPermission.user.name
                }
            }
            
            addUsers(newUser);
        }); 
    }
}