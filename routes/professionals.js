const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { checkEmailAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');

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
	try {
		const user = await User.findOne({ email });
		if (user) {
			if (!user.isPatient) {
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

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			name,
			isPatient: true,
			phoneNr,
			birthDate,
			weight,
			height,
			conditions,
			documents,
			appointments,
		});
		req.session.currentUser = newUser;
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
