const { quote } = require("../controllers");
const { authentication, validation } = require("../middleware");

async function quoteRoutes(fastify, options) {
  fastify.post(
    "/save-quote",
    { preHandler: [authentication, validation] },
    quote.saveQuote
  );
}

module.exports = quoteRoutes;
