const { common } = require("../controllers");
const { authentication, validation } = require("../middleware");

async function adminRoutes(fastify, options) {
    fastify.post(
        "/kyc",
        { preHandler: [authentication, validation] },
        common.kyc
    );
    fastify.post(
        "/verify-kyc",
        { preHandler: [authentication, validation] },
        common.verifyKyc
    );
  }
  
  module.exports = adminRoutes;