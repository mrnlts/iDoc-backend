const createError = require('http-errors');

const Appointment = require('../models/Appointment');

const checkIfLoggedIn = (req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		next(createError(401));
	}
};

const checkEmailAndPasswordNotEmpty = (req, res, next) => {
	const { email, password } = req.body;

	if (email !== '' && password !== '') {
		res.locals.auth = req.body;
		next();
	} else {
		next(createError(422));
	}
};

const checkIsMyPatient = async (req, res, next) => {
	const { id } = req.params;
	const { _id } = req.session.currentUser;
	try {
		const appointment = await Appointment.find({ professional: _id, patient: id });
		if (appointment.length >= 1) {
			next();
		} else {
			next(createError(401));
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	checkIfLoggedIn,
	checkEmailAndPasswordNotEmpty,
	checkIsMyPatient,
};
