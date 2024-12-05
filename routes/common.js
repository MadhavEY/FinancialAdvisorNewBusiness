const { common } = require("../controllers");
const { authentication, validation } = require("../middleware");

async function adminRoutes(fastify, options) {
    fastify.post(
        "/verify-ekyc",
        { preHandler: [authentication, validation] },
        common.ekyc
    );
    fastify.post(
        "/verify-ckyc",
        { preHandler: [authentication, validation] },
        common.ckyc
    );
  }
  
  module.exports = adminRoutes;