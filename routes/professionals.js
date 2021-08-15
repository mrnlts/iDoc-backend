const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { checkEmailAndPasswordNotEmpty, checkIsMyPatient, checkIsProfessional } = require('../middlewares');
const uploadCloud = require('../configs/cloudinary.config');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Document = require('../models/Document');

const bcryptSalt = 10;

const router = express.Router();

router.get('/appointments', checkIsProfessional, async (req, res) => {
	const appointments = await Appointment.find({ professional: req.session.currentUser }).populate('patient');
	if (appointments) {
		res.status(200).json(appointments);
	} else {
		res.status(404);
	}
});

router.post('/add', checkEmailAndPasswordNotEmpty, checkIsProfessional, async (req, res, next) => {
	const { email, password, name } = req.body;
	let { phoneNr, birthDate, weight, height, conditions } = req.body;
	phoneNr = Number(phoneNr);
	birthDate = new Date(birthDate);
	weight = Number(weight);
	height = Number(height);
	conditions = [...conditions];
	const { _id } = req.session.currentUser;

	try {
		const user = await User.findOne({ email });
		// If user exists (as professional) in DB create default appointment, make isPatient true and add patient props to user profile
		if (user && !user.isPatient) {
			const newAppointment = await Appointment.create({
				appointmentDate: new Date().toISOString(),
				patient: user.id,
				professional: _id,
			});
			if (newAppointment) {
				const updatedUser = await User.findByIdAndUpdate(
					user.id,
					{
						isPatient: true,
						phoneNr,
						birthDate,
						weight,
						height,
						conditions,
						$push: {
							appointments: newAppointment,
						},
					},
					{
						new: true,
					}
				);
				const updatedProfessional = await User.findByIdAndUpdate(
					_id,
					{
						$push: {
							appointments: newAppointment,
						},
					},
					{
						new: true,
					}
				);
				req.session.currentUser = updatedProfessional;
				return res.json(updatedUser);
			}
			return next(createError(422));
		}
		// If user does not exist create default appointment, hash password and add user to DB
		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			name,
			isPatient: true,
			isProfessional: false,
			phoneNr,
			birthDate,
			weight,
			height,
			conditions,
			// documents,
			// appointments,
		});

		const newAppointment = await Appointment.create({
			appointmentDate: new Date().toISOString(),
			patient: newUser.id,
			professional: _id,
		});

		if (newAppointment) {
			await User.findByIdAndUpdate(
				newUser.id,
				{
					appointments: newAppointment,
				},
				{
					new: true,
				}
			);
			const updatedProfessional = await User.findByIdAndUpdate(
				_id,
				{
					$push: {
						appointments: newAppointment,
					},
				},
				{
					new: true,
				}
			);
			req.session.currentUser = updatedProfessional;
		}
		return res.json(newUser);
	} catch (error) {
		console.log("error!", error)
		return next(error);
	}
});

router.get('/getpatients', checkIsProfessional, async (req, res) => {
	const patientArr = [];
	try {
		const appointments = await Appointment.find({ professional: req.session.currentUser }).populate('patient');
		appointments.map(appointment => {
			if (patientArr.find(patient => patient.id === appointment.patient.id) === undefined) {
				return patientArr.push({ id: appointment.patient.id, name: appointment.patient.name });
			}
			return null;
		});
		return res.json(patientArr);
	} catch (e) {
		console.log(e);
	}
})

router.get('/patients/:id', checkIsMyPatient, async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		const usersAppointments = await Appointment.find({ patient: id }).populate('professional');

		if (user) {
			return res.json({ user, usersAppointments });
		}
		return next(createError(422));
	} catch (error) {
		return next(error);
	}
});

router.put(
	'/patients/:id',
	checkIsMyPatient,
	checkIsProfessional,
	uploadCloud.single('document'),
	async (req, res, next) => {
		const { id } = req.params;
		const { name, weight, height, conditions, title, description, documentUrl } = req.body;
		try {
			const newDocument = await Document.create({ title, description, documentUrl, patient: id });
			console.log(newDocument);
			const updatedUser = await User.findByIdAndUpdate(
				id,
				{
					name,
					weight,
					height,
					conditions,
				},
				{
					new: true,
				}
			);
			if (updatedUser) {
				return res.json(updatedUser);
			}
			return next(createError(500));
		} catch (error) {
			return next(error);
		}
});

router.delete('/patients/:id', checkIsMyPatient, checkIsProfessional, async (req, res, next) => {
	const { id } = req.params;
	try {
		const deletedAppointments = await Appointment.deleteMany({ patient: id });
		const deletedUser = await User.findByIdAndDelete(id);
		if (deletedAppointments && deletedUser) {
			return res.status(200);
		}
		return res.status(500);
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
