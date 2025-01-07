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
    if (quoteData.Status == "Fail") {
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
              "https://salesasset.blob.core.windows.net/salesassetblob/80000051773.pdf?sv=2025-01-05&se=2124-12-07T17%3A12%3A19Z&sr=b&sp=r&sig=fI4iIF15gRixnLvIg94Nn44%2FJEmPe4UuRQSE8FPhEII%3D"
            )
          );
      } else {
        return reply
          .status(statusCodes.OK)
          .send(responseFormatter(statusCodes.OK, "Quote not saved", []));
      }
    } else {
      // const buffer = Buffer.from(quoteData.pdfData, "base64");
      // const quotePdf = await azureBlob.uploadFileToBlob(
      //   request.body.quoteId,
      //   buffer
      // );
      quoteToSave["quoteJson"] = quoteData;
      const savedQuote = await quote.saveQuote(quoteToSave);
      if (savedQuote) {
        await event.insertEventTransaction(request.isValid);
        // return reply
        //   .status(statusCodes.OK)
        //   .send(
        //     responseFormatter(
        //       statusCodes.OK,
        //       "Quote saved successfully",
        //       quotePdf
        //     )
        //   );
        return reply
          .status(statusCodes.OK)
          .send(
            responseFormatter(
              statusCodes.OK,
              "Quote saved successfully",
              "https://salesasset.blob.core.windows.net/salesassetblob/80000051773.pdf?sv=2025-01-05&se=2124-12-07T17%3A12%3A19Z&sr=b&sp=r&sig=fI4iIF15gRixnLvIg94Nn44%2FJEmPe4UuRQSE8FPhEII%3D"
            )
          );
      } else {
        return reply
          .status(statusCodes.OK)
          .send(responseFormatter(statusCodes.OK, "Quote not saved", []));
      }
    }
  } catch (error) {
    console.log(error);
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
