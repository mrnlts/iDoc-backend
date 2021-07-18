const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { checkEmailAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');
const Appointment = require('../models/Appointment');

const bcryptSalt = 10;

const router = express.Router();

router.get('/home', async (req, res) => {
	if (req.session.currentUser) {
		res.status(200).json(req.session.currentUser);
	}
});

router.post('/add', checkEmailAndPasswordNotEmpty, async (req, res, next) => {
	const { email, password, name, phoneNr, birthDate, weight, height, conditions, documents, appointments } =
		res.locals.auth;
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
				await User.findByIdAndUpdate(user.id, {
					$push: {
						appointments: newAppointment,
					},
				});
				await User.findByIdAndUpdate(_id, {
					$push: {
						appointments: newAppointment,
					},
				});
				const updatedUser = await User.findOneAndUpdate(
					{ email },
					{
						isPatient: true,
						phoneNr,
						birthDate,
						weight,
						height,
						conditions,
						documents,
						appointments,
					}
				);
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
			documents,
			appointments,
		});
		const newAppointment = await Appointment.create({
			appointmentDate: new Date().toISOString(),
			patient: newUser.id,
			professional: _id,
		});
		if (newAppointment) {
			await User.findByIdAndUpdate(newUser.id, {
				$push: {
					appointments: newAppointment,
				},
			});
			await User.findByIdAndUpdate(_id, {
				$push: {
					appointments: newAppointment,
				},
			});
		}
		return res.json(newUser);
	} catch (error) {
		return next(error);
	}
});

router.get('/patients/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (user) {
			return res.json(user);
		}
		return next(createError(422));
	} catch (error) {
		return next(error);
	}
});

router.put('/patients/:id', async (req, res, next) => {
	const { id } = req.params;
	const { name, weight, height, conditions, documents } = req.body;
	try {
		const updatedUser = await User.findByIdAndUpdate(id, { name, weight, height, conditions, documents });
		if (updatedUser) {
			return res.json(updatedUser);
		}
		return next(createError(500));
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
