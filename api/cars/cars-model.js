const db = require("../../data/db-config");

const getAll = () => {
  return db("cars"); // returns an array of car objects
}

const getById = id => {
  return db("cars").where({id}).first(); //returns a car object with the id passed in
}

const create = car => {
  return db("cars").insert(car); // returns an id array of the newly created car
}

module.exports = {
  getAll,
  getById,
  create
};