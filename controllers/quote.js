const {
  responseFormatter,
  statusCodes,
  quoteUtils,
  azureBlob,
} = require("../utils");
const { quote, event } = require("../db");
require("dotenv").config();

exports.saveQuote = async (request, reply) => {
  try {
    const quoteToSave = request.body;
    const requestForGetQuote = {
      QuotationNo: request.body.quoteId,
      IsPDF: true,
    };
    const quoteData = await quoteUtils.getQuote(requestForGetQuote);
    const buffer = Buffer.from(quoteData.pdfData, "base64");
    const quotePdf = await azureBlob.uploadFileToBlob(
      request.body.quoteId,
      buffer
    );
    quoteToSave["quoteJson"] = quoteData;
    const savedQuote = await quote.saveQuote(quoteToSave);
    if (savedQuote) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Quote saved successfully",
            quotePdf
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
