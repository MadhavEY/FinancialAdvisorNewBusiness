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
        await event.insertEventTransaction(request.invalid);
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
        await event.insertEventTransaction(request.invalid);
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

