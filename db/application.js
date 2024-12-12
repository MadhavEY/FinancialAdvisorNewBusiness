const {
    client
} = require("../config/db");

const getApplicationTrackerDetails = async (isCount, status, limit, offset, keyword = "") => {
    try {
        if (isCount) {
            let query = `SELECT COUNT(*), ROUND(SUM(premium),2) as TotalPremium FROM newbusiness.application_data WHERE status = $1`;
            const res = await client.query(query, [status]);
            return res?.rows[0] || 0;
        } else {
            let query = `SELECT * FROM newbusiness.application_data WHERE status = $1 `;
            if (keyword) {
                query += ` AND (application_id ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'firstName' ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'middleName' ILIKE '%${keyword}%' OR application_json->'personalDetails'->>'lastName' ILIKE '%${keyword}%') `;
            }
            query += ` ORDER BY id DESC LIMIT $2 OFFSET $3`;
            console.log(query)
            const res = await client.query(query, [status, limit, offset]);
            return res?.rows || [];
        }
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const getRequirementJson = async (appId) => {
    try {
        let query = `
        SELECT requirement_json
        FROM newbusiness.application_data 
        WHERE application_id = $1
        `;
        const res = await client.query(query, [appId]);
        return res?.rows[0].requirement_json;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const updateRequirementJson = async (requirementJson, status, appId) => {
    try {
        let query = `UPDATE newbusiness.application_data SET requirement_json = $1, status = $2 WHERE application_id = $3 RETURNING * `;
        const res = await client.query(query, [JSON.stringify(requirementJson), status, appId]);
        return res?.rows;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const updateApplicationStatus = async (status, appId) => {
    try {
        let query = `
        UPDATE 
        newbusiness.application_data
        SET status = $1
        WHERE application_id = $2
        RETURNING *
        `;
        const res = await client.query(query, [status, appId]);
        return res?.rows;
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

const getApplicationDetails = async (appId) => {
    try {
        let query = `SELECT * FROM newbusiness.application_data WHERE application_id = $1 OR lead_id = $1`;
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
            const res = await client.query(query, [applicationId, quoteId, leadId, status, applicationJson, quoteJson, JSON.stringify(requirementJson), premium]);
            return res?.rows || [];
        } else {
            let query = `UPDATE newbusiness.application_data SET quote_id = $2, lead_id = $3, status = $4, application_json = $5, quote_json = $6, requirement_json = $7, premium = $8 WHERE application_id = $1 RETURNING *`
            const res = await client.query(query, [applicationId, quoteId, leadId, status, applicationJson, quoteJson, JSON.stringify(requirementJson), premium]);
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
    getRequirementJson,
    updateRequirementJson,
    updateApplicationStatus,
    getApplicationDetails
};