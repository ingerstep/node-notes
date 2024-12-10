import Knex from "knex";

const config = require("./knexfile");

export const knex = Knex(config);
