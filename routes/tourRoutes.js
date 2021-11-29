const express = require('express');
const router = express.Router();
const tourControllers = require('./../controllers/tourControllers')

// used for validating requests whther they are valid users or tours etc...
// router.param('id',tourControllers.checkID);



router.route('/')
.get(tourControllers.getAllTours)
.post(tourControllers.addTour);


router.route('/:id')
.get(tourControllers.getTour)
.patch(tourControllers.editTour)
.delete(tourControllers.deleteTour);

module.exports = router;