const axios = require("axios");
const https = require("https");
require("dotenv").config();

const getQuote = async (quoteData) => {
  try {
    quoteData["APIKey"] = process.env.APIKEY;
    const url = process.env.NVESTGETURL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await axios.post(url, config);
    const response = await axios.post(url, quoteData, {
      httpsAgent: agent,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getQuote,
};
