const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		password: String,
		name: String,
		specialty: {
			type: String,
			enum: [
				'Anesthesiologist',
				'Cardiologist',
				'Dermatologist',
				'Family medicine physician',
				'Geriatrician',
				'Gynecologist',
				'Neurologist',
				'Nurse',
				'Ocupational therapist',
				'Oncologist',
				'Ophthalmologist',
				'Otolaryngologist',
				'Pediatrician',
				'Psychiatrist',
				'Psychologyst',
				'Speech therapist',
				'Surgeon',
				'Urologist',
			],
		},
		isProfessional: {
			type: Boolean,
			required: true,
			default: true,
		},
		isPatient: {
			type: Boolean,
			required: true,
			default: false,
		},
		phoneNr: Number,
		birthDate: Date,
		weight: Number,
		height: Number,
		conditions: [String],
		documents: [],
		appointments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Appointment',
			},
		],
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
