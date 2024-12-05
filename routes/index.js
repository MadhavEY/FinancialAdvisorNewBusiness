const applicationRoutes = require("./application");
const common = require("./common");


async function routes(fastify, options) {
  // Register KYC and Application Submission Routes
  fastify.register(applicationRoutes, {
    prefix: "/application"
  });
  fastify.register(common, {
    prefix: "/common"
  });
}

module.exports = routes;