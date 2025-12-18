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
              "https://salesassetdemo.blob.core.windows.net/salesasset/80000051773.pdf?sp=r&st=2025-12-18T16:06:48Z&se=2026-12-19T00:21:48Z&spr=https&sv=2024-11-04&sr=b&sig=bVcAEEDHpA1jQ9r5aCPZMHt30Ys0SE1t9KZsnJRZ7oI%3D"
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
              "https://salesassetdemo.blob.core.windows.net/salesasset/80000051773.pdf?sp=r&st=2025-12-18T16:06:48Z&se=2026-12-19T00:21:48Z&spr=https&sv=2024-11-04&sr=b&sig=bVcAEEDHpA1jQ9r5aCPZMHt30Ys0SE1t9KZsnJRZ7oI%3D"
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

 
