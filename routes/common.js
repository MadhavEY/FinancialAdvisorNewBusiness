const { common } = require("../controllers");
const { authentication, validation } = require("../middleware");

async function adminRoutes(fastify, options) {
    fastify.post(
        "/get-ekyc",
        { preHandler: [authentication, validation] },
        common.ekyc
    );
  }
  
  module.exports = adminRoutes;