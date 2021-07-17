const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');

const { checkEmailAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.post('/signup', checkEmailAndPasswordNotEmpty, async (req, res, next) => {
	const { email, password, name, specialty } = res.locals.auth;
	try {
		const user = await User.findOne({ email });
		if (user) {
			return next(createError(422));
		}
		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			name,
			specialty,
			isProfessional: true,
		});
		req.session.currentUser = newUser;
		return res.json(newUser);
	} catch (error) {
		return next(error);
	}
});

router.post('/login', checkEmailAndPasswordNotEmpty, async (req, res, next) => {
	const { email, password } = res.locals.auth;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return next(createError(404));
		}
		if (bcrypt.compareSync(password, user.password)) {
			req.session.currentUser = user;
			return res.json(user);
		}
		return next(createError(404));
	} catch (error) {
		return next(error);
	}
});

router.post('/logout', (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			next(err);
		}

		return res.status(204).send();
	});
});

module.exports = router;
