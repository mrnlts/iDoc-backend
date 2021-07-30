const express = require('express');
const createError = require('http-errors');
const { checkIsPatient } = require('../middlewares');

const User = require('../models/User');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.get('/profile', checkIsPatient, async (req, res) => {
	const { currentUser } = req.session;
	const appointments = await Appointment.find({ patient: currentUser }).populate('professional');
	currentUser.appointments = appointments;
	res.status(200).json(currentUser);
});

router.put('/profile', checkIsPatient, async (req, res, next) => {
	const { _id } = req.session.currentUser;
	const { email, phoneNr } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(_id, { email, phoneNr }, { new: true });
		if (updatedUser) {
			req.session.currentUser = updatedUser;
			return res.json(updatedUser);
		}
		return next(createError(500));
	} catch (error) {
		return next(error);
	}
});

router.get('/appointments', checkIsPatient, async (req, res) => {
	const { currentUser } = req.session;
	const appointments = await Appointment.find({ patient: currentUser }).populate('professional');
	return res.json(appointments);
});

router.get('/getdocs', checkIsPatient, async (req, res) => {
	const docs = await User.find({ isProfessional: true });
	return res.json(docs);
})

router.post('/appointments', async (req, res, next) => {
	const { appointmentDate, professional, _id } = req.body;
	try {
		const newAppointment = await Appointment.create({
			appointmentDate,
			patient: _id,
			professional,
		});
		if (newAppointment) {
			await User.findByIdAndUpdate(
				_id,
				{
					isPatient: true,
					$push: {
						appointments: newAppointment,
					},
				},
				{
					new: true,
				}
			);
			await User.findByIdAndUpdate(
				professional,
				{
					$push: {
						appointments: newAppointment,
					},
				},
				{
					new: true,
				}
			);
			return res.json(newAppointment);
		}
		return next(createError(500));
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
