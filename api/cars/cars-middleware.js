const carsModel = require("./cars-model");
const vinValidator = require("vin-validator");

const missing = (res, name) => res.status(400).json({message:`${name} is missing`});
const wrongType = (res, name, type) => res.status(400).json({message:`${name} must be of type ${type}`})

const checkCarId = (req, res, next) => {
  const id = req.params.id;
  carsModel.getById(id)
    .then(car => {
      if(car){
        req.car = car;
        next();
      } else {
        res.status(404).json({ message: `car with id ${id} is not found` });
      }
    })
    .catch(err => res.status(500).json({message:`error getting car with id ${id}`, error:err}));
}

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage, title, transmission} = req.body;
  if(!vin){
    missing(res, "vin");
  } else if(!make){
    missing(res, "make");
  } else if(!model){
    missing(res, "model");
  } else if(!mileage&&mileage!==0){
    missing(res, "mileage");
  } else if(typeof make !== "string"){
    wrongType(res, "make", "string");
  } else if(typeof model !== "string"){
    wrongType(res, "model", "string");
  } else if(typeof mileage !== "number"){
    wrongType(res, "mileage", "number")
  } else {
    req.payload = {vin, make, model, mileage}
    if(title) if(typeof title === "string") req.payload.title = title;
    if(transmission) if(typeof transmission ==="string") req.payload.transmission = transmission;
    next();
  }
}

const checkVinNumberValid = (req, res, next) => {
  vinValidator.validate(req.payload.vin) ? next() : res.status(400).json({ message: `vin ${req.payload.vin} is invalid` });
}

const checkVinNumberUnique = (req, res, next) => {
  const vin = req.payload.vin;
  carsModel.getAll()
    .then(cars => cars.reduce((acc, car) => acc&&car.vin!==vin, true))
    .then(noDups => noDups ? next() : res.status(400).json({ message: `vin ${vin} already exists` }))
    .catch(err => res.status(500).json({message:"error getting cars", error:err}));
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
};