const carsModel = require("./cars-model");
const carsMiddleware = require("./cars-middleware");
const express = require("express");

const carsRouter = express.Router();

carsRouter.get("/", (req, res) => {
  carsModel.getAll().then(cars => res.status(200).json(cars))
    .catch(err => res.status(500).json({message:"error getting all cars", error:err}));
});

carsRouter.get("/:id", carsMiddleware.checkCarId, (req, res) => {
  res.status(200).json(req.car);
});

carsRouter.post("/", carsMiddleware.checkCarPayload, carsMiddleware.checkVinNumberValid, carsMiddleware.checkVinNumberUnique, (req, res) => {
  carsModel.create(req.payload)
    .then(idArray => {
      carsModel.getById(idArray[0])
        .then(car => res.status(201).json(car))
        .catch(err => res.status(201).json({message:"car created but error getting car", error:err}))
    })
    .catch(err => res.status(500).json({message:"error creating car", error:err}));
});

module.exports = carsRouter;