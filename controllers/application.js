const {
    responseFormatter,
    statusCodes
} = require("../utils");
const {
    application,
    event
} = require("../db");

exports.appTrackerCount = async (request, reply) => {
    try {
        await event.insertEventTransaction(request.isValid);
        const [draft, requirementPending, qcUW, decisionProvided] = await Promise.all([
            application.getApplicationTrackerDetails(true, 1),
            application.getApplicationTrackerDetails(true, 2),
            application.getApplicationTrackerDetails(true, 3),
            application.getApplicationTrackerDetails(true, 4),
        ]);

        reply
            .status(statusCodes.OK)
            .send(responseFormatter(
                statusCodes.OK,
                "Data fetched successfully!", {
                    draft,
                    requirementPending,
                    qcUW,
                    decisionProvided
                }
            ))
    } catch (error) {
        await event.insertEventTransaction(request.inValid);
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                        error: error.message
                    }
                )
            );
    }
}

exports.appTrackerList = async (request, reply) => {
    try {
        await event.insertEventTransaction(request.isValid);
        const {
            statusType,
            limit,
            pageNo,
            searchKeyword
        } = request.body;

        const pageLimit = Number(limit);
        const offset = pageLimit * Number(pageNo)
        const response = await application.getApplicationTrackerDetails(false, statusType, pageLimit, offset, searchKeyword)
        reply
            .status(statusCodes.OK)
            .send(responseFormatter(
                statusCodes.OK,
                "List fetched successfully!",
                response
            ))
    } catch (error) {
        await event.insertEventTransaction(request.inValid);
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                        error: error.message
                    }
                )
            );
    }
}

exports.appDetails = async (request, reply) => {
    try {
        await event.insertEventTransaction(request.isValid);
        const {
            applicationId
        } = request.body;
        const response = await application.getApplicationDetails(applicationId)

        reply
            .status(statusCodes.OK)
            .send(
                responseFormatter(
                    response?.length === 0 ? statusCodes.NOT_FOUND : statusCodes.OK,
                    response?.length === 0 ? "Application not found!" : "Application details fetched successfully",
                    response
                )
            );
    } catch (error) {
        await event.insertEventTransaction(request.inValid);
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                        error: error.message
                    }
                )
            );
    }
}

exports.agentDetails = async (request, reply) => {
    try {
        const {
            agentCode
        } = request.body;

        const response = {
            agentCode: 'AGT12345',
            name: 'Rahul Sharma',
            branchCode: 'BRC5678',
            branchName: 'Mumbai Central',
            branchLocation: 'Mumbai, Maharashtra'
        }
        if (response) {
            await event.insertEventTransaction(request.isValid);
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Agent data fetched successfully",
                        response
                    )
                );
        } else {
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Data not found",
                        response
                    )
                );
        }
    } catch (error) {
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                    error: error.message
                }
                )
            );
    }
}

exports.requiredDocList = async (request, reply) => {
    try {
        const response = {
            docList: [
                {
                    docName: 'Age Proof',
                    required: true,
                    info: ""
                },
                {
                    docName: 'Identity Proof',
                    required: true,
                    info: ""
                },
                {
                    docName: 'Photo Proof',
                    required: true
                },
                {
                    docName: 'Address Proof',
                    required: true,
                    info: ""
                },
                {
                    docName: 'Income Proof',
                    required: true,
                    info: ""
                }
            ],
            pivc_medical: [
                {
                    docName: 'PIVC',
                    required: true
                },
                {
                    docName: 'VMER',
                    required: true
                },
                {
                    docName: 'TMER',
                    required: true
                },
                {
                    docName: 'Physical medical',
                    required: true,
                    info: ""
                }
            ]
        }
        if (response) {
            await event.insertEventTransaction(request.isValid);
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Document list fetched successfully",
                        response
                    )
                );
        } else {
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Data not found",
                        response
                    )
                );
        }
    } catch (error) {
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                    error: error.message
                }
                )
            );
    }
}

exports.uploadDocument = async (request, reply) => {
    try {
        const {applicationId, fileName, base64Data} = request.body;
        let requiredDocsFromDB = await application.getRequirementJson(applicationId); //Getting requirement_json from DB
        requiredDocsFromDB.forEach(item => { //checking file name and updating values
            if(item.docName === fileName){
                item.base64Data = base64Data,
                item.required = false
            }
        });
        const updatedRes = await application.updateRequirementJson(requiredDocsFromDB, applicationId); // update the new data in DB
        const ifAnyRequiredDocExists = updatedRes.some(item => item.required); // checking if any doc is still 'required: true'
        if(!ifAnyRequiredDocExists){
            await application.updateApplicationStatus('3', applicationId); // if all docs are 'required: false' then update the status to 3
        }
        if (updatedRes.length) {
            await event.insertEventTransaction(request.isValid);
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Document uploaded successfully"
                    )
                );
        } else {
            return reply
                .status(statusCodes.OK)
                .send(
                    responseFormatter(
                        statusCodes.OK,
                        "Data not found"
                    )
                );
        }
    } catch (error) {
        return reply
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(
                responseFormatter(
                    statusCodes.INTERNAL_SERVER_ERROR,
                    "Internal server error occurred", {
                    error: error.message
                }
                )
            );
    }
}

exports.appSubmission = async (request, reply) => {}