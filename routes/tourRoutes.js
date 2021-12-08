const express = require('express');
const router = express.Router();
const tourControllers = require('./../controllers/tourControllers')

// used for validating requests whther they are valid users or tours etc...
// router.param('id',tourControllers.checkID);


router.route('/top-5-cheap').get(tourControllers.getTopFiveCheap,tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router.route('/')
.get(tourControllers.getAllTours)
.post(tourControllers.addTour);


router.route('/:id')
.get(tourControllers.getTour)
.patch(tourControllers.editTour)
.delete(tourControllers.deleteTour);

module.exports = router;