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
              "https://salesassettest.blob.core.windows.net/salesasset/80000051773.pdf?sv=2025-01-05&se=2125-04-21T13%3A06%3A13Z&sr=b&sp=r&sig=eXvR%2FLjlGs6R6tcmChI3O1qlvcIF1OExRmBvyD5d8nI%3D"
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
              "https://salesassettest.blob.core.windows.net/salesasset/80000051773.pdf?sv=2025-01-05&se=2125-04-21T13%3A06%3A13Z&sr=b&sp=r&sig=eXvR%2FLjlGs6R6tcmChI3O1qlvcIF1OExRmBvyD5d8nI%3D"
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
