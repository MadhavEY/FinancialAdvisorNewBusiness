const {
  client
} = require("../config/db");

async function saveQuote(quoteData) {
  try {
    const query = `UPDATE newbusiness.application_data SET quote_id = $2, lead_id = $3, quote_json = $4, premium = $5 WHERE application_id = $1 RETURNING * `;
    const inputValidation = quoteData.quoteJson.InputValidationStatus;
    let premium;
    if (inputValidation == null) {
      premium = 0;
    } else {
      premium = inputValidation[0].ModalPremium;
    }

    // Extract the values in the same order as the columns
    const values = [
      quoteData.applicationId,
      quoteData.quoteId,
      quoteData.leadId,
      quoteData.quoteJson,
      premium,
    ];
    const res = await client.query(query, values);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error.stack);
    throw error;
  }
}

async function getList() {
  try {
    const query = `
    SELECT 
    mm.meta_master_name,
    md.meta_data_name,
    md.idmetadata
    FROM 
    newbusiness.nb_metamaster mm
    JOIN 
    newbusiness.nb_metadata md
    ON mm.idmetamaster = md.idmetamaster
    WHERE 
    mm.meta_master_name IN ('docList', 'pivc_medical')  -- Filter for the two meta_master_name
    AND md.activeflag = 1  -- Ensure that the metadata is active
    ORDER BY 
    mm.meta_master_name, md.meta_data_name;
    `;
    const res = await client.query(query);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error.stack);
    throw error;
  }
}

module.exports = {
  getList,
  saveQuote,
};