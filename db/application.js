const {
    client
} = require("../config/db");

const getApplicationTrackerDetails = async (isCount, status, limit, offset, keyword = "") => {
    try {
        if (isCount) {
            let query = `SELECT COUNT(*) FROM newbusiness.application_data WHERE status = $1`;
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

module.exports = {
    getApplicationTrackerDetails,
};