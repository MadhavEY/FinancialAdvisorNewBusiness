const { responseFormatter, statusCodes } = require("../utils");
const { common, event } = require("../db");

exports.ekyc = async (request, reply) => {
    try {
        const {number} = request.body;
        if (number) {
            await event.insertEventTransaction(request.isValid);
            return reply
              .status(statusCodes.OK)
              .send(
                responseFormatter(
                  statusCodes.OK,
                  "KYC date fetched successfully",
                  number
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
                    "Internal server error occurred",
                    { error: error.message }
                )
            );
    }
}