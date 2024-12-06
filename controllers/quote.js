const { responseFormatter, statusCodes } = require("../utils");
const { quote, event } = require("../db");

exports.saveQuote = async (request, reply) => {
  try {
    const quoteToSave = request.body;
    const savedQuote = await quote.saveQuote(quoteToSave);
    if (savedQuote) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Quote saved successfully",
            savedQuote
          )
        );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(responseFormatter(statusCodes.OK, "Quote not saved", []));
    }
  } catch (error) {
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred",
        {
          error: error.message,
        }
      )
    );
  }
};
