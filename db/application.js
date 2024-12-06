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

const updateRequirementJson = async (requirementJson, appId) => {
    try {
        let query = `
        UPDATE 
        newbusiness.application_data
        SET requirement_json = $1 
        WHERE application_id = $2
        RETURNING *
        `;
        const res = await client.query(query, [JSON.stringify(requirementJson), appId]);
        return res?.rows[0].requirement_json;
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
        let query = `SELECT * FROM newbusiness.application_data WHERE application_id = $1 `;
        const res = await client.query(query, [appId]);
        return res?.rows || [];
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

module.exports = {
    getApplicationTrackerDetails,
    getRequirementJson,
    updateRequirementJson,
    updateApplicationStatus,
    getApplicationDetails
};