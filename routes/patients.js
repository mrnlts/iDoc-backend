const express = require('express');
const createError = require('http-errors');

const User = require('../models/User');

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

module.exports = router;
