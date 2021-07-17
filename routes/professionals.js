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

module.exports = router;
