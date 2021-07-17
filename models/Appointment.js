const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema(
	{
		appointmentDate: {
			day: Number,
			month: Number,
			year: Number,
		},
		patient: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		professional: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
