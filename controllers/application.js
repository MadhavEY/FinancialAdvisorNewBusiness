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