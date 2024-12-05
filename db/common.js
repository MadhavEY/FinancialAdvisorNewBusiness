const { client } = require("../config/db");

const getKyc = async (data) => {
    try {

    } catch (error) {
        console.error("Error inserting data:", error);
        throw error;
    }
};

module.exports = {
    getKyc
}