const { client } = require("../config/db");

async function saveQuote(quoteData) {
  try {
    const query = `
        INSERT INTO newbusiness.application_data (
          application_id,
          quote_id,
          lead_id,
          quote_json,
          premium
        ) VALUES ($1, $2, $3, $4, $5);
      `;

    // Extract the values in the same order as the columns
    const values = [
      quoteData.applicationId,
      quoteData.quoteId,
      quoteData.leadId,
      quoteData.quoteJson,
      quoteData.quoteJson.InputValidationStatus[0].ModalPremium,
    ];
    const res = await client.query(query, values);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error.stack);
    throw error;
  }
}

module.exports = {
  saveQuote,
};
