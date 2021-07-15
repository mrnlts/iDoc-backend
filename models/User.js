const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			// required: true,
		},
		password: {
			type: String,
			// required: true,
		},
		// name: String,
		// specialty: {
		// 	type: String,
		// 	enum: [
		// 		'Anesthesiologist',
		// 		'Cardiologist',
		// 		'Dermatologist',
		// 		'Family medicine physician',
		// 		'Geriatrician',
		// 		'Gynecologist',
		// 		'Neurologist',
		// 		'Nurse',
		// 		'Ocupational therapist',
		// 		'Oncologist',
		// 		'Ophthalmologist',
		// 		'Otolaryngologist',
		// 		'Pediatrician',
		// 		'Psychiatrist',
		// 		'Psychologyst',
		// 		'Speech therapist',
		// 		'Surgeon',
		// 		'Urologist',
		// 	],
		// },
		// isPatient: {
		// 	type: Boolean,
		// 	required: true,
		// },
		// phoneNr: Number,
		// birthDate: {
		// 	day: Number,
		// 	month: Number,
		// 	year: Number,
		// },
		// weight: Number,
		// height: Number,
		// conditions: String,
		// documents: [],
		// appointments: [
		// 	{
		// 		type: Schema.Types.ObjectId,
		// 		ref: 'Appointment',
		// 	},
		// ],
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
