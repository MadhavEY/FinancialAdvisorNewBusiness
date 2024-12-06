const {
    responseFormatter,
    statusCodes
} = require("../utils");
const {
    application,
    event
} = require("../db");
const {
    v4: uuidv4
} = require('uuid');

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

exports.appDetailSubmit = async (request, reply) => {
    try {
        const {
            leadId,
            status,
            applicationId,
            personalDetails,
            analysis,
            agentDetails,
            proposerDetails,
            nomineeDetails,
            payoutDetails,
            healthDetails,
            fatcaCraDetails
        } = request.body;
        const uuid = uuidv4();

        let tableData, row;
        if (applicationId) {
            const data = await application.getApplicationDetails(applicationId);
            if (!data?.length) {
                return reply
                    .status(statusCodes.NOT_FOUND)
                    .send(
                        responseFormatter(
                            statusCodes.NOT_FOUND,
                            "Application not found"
                        )
                    );
            }
            row = data[0];
        }

        tableData = {
            applicationId: applicationId || uuid,
            quoteId: row?.quote_id || null,
            leadId: leadId || row?.lead_id,
            status: status || row?.status || 1,
            applicationJson: {
                ...row?.application_json,
                personalDetails: personalDetails || row?.application_json?.personalDetails,
                analysis: analysis || row?.application_json?.analysis,
                agentDetails: agentDetails || row?.application_json?.agentDetails,
                proposerDetails: proposerDetails || row?.application_json?.proposerDetails,
                nomineeDetails: nomineeDetails || row?.application_json?.nomineeDetails,
                payoutDetails: payoutDetails || row?.application_json?.payoutDetails,
                healthDetails: healthDetails || row?.application_json?.healthDetails,
                fatcaCraDetails: fatcaCraDetails || row?.application_json?.fatcaCraDetails,
            },
            quoteJson: row?.quote_json || null,
            requirementJson: row?.requirement_json || null,
            premium: row?.premium || 0,
        }

        const response = await application.createUpdateApplication(applicationId, tableData);

        reply
            .status(statusCodes.OK)
            .send(
                responseFormatter(
                    statusCodes.OK,
                    !applicationId ? "Application created successfully!" : "Application updated successfully!",
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

exports.appSubmission = async (request, reply) => {}