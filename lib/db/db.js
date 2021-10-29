const { PrismaClient } = require("@prisma/client");

const init = () => new PrismaClient();

module.exports = init;
