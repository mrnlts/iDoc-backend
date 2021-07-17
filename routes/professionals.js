const express = require('express');
const createError = require('http-errors');

const User = require('../models/User');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
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

router.post('/:id', async (req, res, next) => {
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
