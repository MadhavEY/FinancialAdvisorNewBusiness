const {
    application
} = require("../controllers");
const {
    authentication,
    validation
} = require("../middleware");

async function applicationRoutes(fastify) {
    fastify.get(
        "/tracker-count", {
            preHandler: [authentication, validation]
        },
        application.appTrackerCount
    );
    fastify.post(
        "/tracker-list", {
            preHandler: [authentication, validation]
        },
        application.appTrackerList
    );
}

module.exports = applicationRoutes;