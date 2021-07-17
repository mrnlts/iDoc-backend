const express = require('express');
const createError = require('http-errors');

const User = require('../models/User');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/profile', async (req, res) => {
	if (req.session.currentUser) {
		res.status(200).json(req.session.currentUser);
	}
});

router.put('/profile', async (req, res, next) => {
	const { _id } = req.session.currentUser;
	const { email, phoneNr } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(_id, { email, phoneNr });
		if (updatedUser) {
			return res.json(updatedUser);
		}
		return next(createError(500));
	} catch (error) {
		return next(error);
	}
});

router.get('/appointments', async (req, res, next) => {
	const { _id } = req.session.currentUser;
	try {
		const user = await User.findById(_id);
		return res.json(user.appointments);
	} catch (error) {
		return next(error);
	}
});

router.post('/appointments', async (req, res, next) => {
	const { appointmentDate, professional } = req.body;
	const { _id } = req.session.currentUser;
	try {
		const newAppointment = await Appointment.create({
			appointmentDate,
			patient: _id,
			professional,
		});
		if (newAppointment) {
			await User.findByIdAndUpdate(_id, {
				$push: {
					appointments: newAppointment,
				},
			});
			await User.findByIdAndUpdate(professional, {
				$push: {
					appointments: newAppointment,
				},
			});
			return res.json(newAppointment);
		}
		return next(createError(500));
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
