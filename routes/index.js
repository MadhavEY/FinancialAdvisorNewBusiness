const applicationRoutes = require("./application");
const common = require("./common");
const quoteRoutes = require("./quote");

async function routes(fastify, options) {
  // Register KYC and Application Submission Routes
  fastify.register(applicationRoutes, {
    prefix: "/application",
  });
  fastify.register(common, {
    prefix: "/common",
  });
  fastify.register(quoteRoutes, {
    prefix: "/quote",
  });
}

module.exports = routes;
