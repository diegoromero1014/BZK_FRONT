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