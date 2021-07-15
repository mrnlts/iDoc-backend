const createError = require('http-errors');

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

module.exports = {
	checkIfLoggedIn,
	checkEmailAndPasswordNotEmpty,
};
