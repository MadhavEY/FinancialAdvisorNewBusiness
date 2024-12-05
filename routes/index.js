const common = require("./common");


async function routes(fastify, options) {
  // Register user and lead routes with prefixes
  fastify.register(common, { prefix: "/common" });
}

module.exports = routes;
