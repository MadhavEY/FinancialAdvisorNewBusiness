const {
    client
} = require("../config/db");

const getApplicationTrackerDetails = async (isCount, status, limit, offset, keyword = "") => {
    try {
        if (isCount) {
            let query = `SELECT COUNT(*), SUM(premium) as TotalPremium FROM newbusiness.application_data WHERE status = $1`;
            const res = await client.query(query, [status]);
            return res?.rows[0] || 0;
        } else {
            let query = `SELECT * FROM newbusiness.application_data WHERE status = $1 `;
            if (keyword) {
                query += ` AND (application_id ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'firstName' ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'middleName' ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'lastName' ILIKE '%${keyword}%') `;
            }
            query += ` LIMIT $2 OFFSET $3`;
            console.log(query)
            const res = await client.query(query, [status, limit, offset]);
            return res?.rows || [];
        }
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const getApplicationDetails = async (appId) => {
    try {
        let query = `SELECT * FROM newbusiness.application_data WHERE application_id = $1 `;
        const res = await client.query(query, [appId]);
        return res?.rows || [];
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const createUpdateApplication = async (appId = "", request) => {
    try {
        const {
            applicationId,
            quoteId = null,
            applicationJson = null,
            leadId = null,
            status = 1,
            quoteJson = null,
            requirementJson = null,
            premium = 0
        } = request;
        if (!appId) {
            let query = `INSERT INTO newbusiness.application_data (application_id, quote_id, lead_id, status, application_json, quote_json, requirement_json, premium) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`
            const res = await client.query(query, [applicationId, quoteId, leadId, status, applicationJson, quoteJson, requirementJson, premium]);
            return res?.rows || [];
        } else {
            let query = `UPDATE newbusiness.application_data SET quote_id = $2, lead_id = $3, status = $4, application_json = $5, quote_json = $6, requirement_json = $7, premium = $8 WHERE application_id = $1 RETURNING *`
            const res = await client.query(query, [applicationId, quoteId, leadId, status, applicationJson, quoteJson, requirementJson, premium]);
            return res?.rows || [];
        }
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

module.exports = {
    getApplicationTrackerDetails,
    createUpdateApplication,
    getApplicationDetails
};