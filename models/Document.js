const mongoose = require('mongoose');

const { Schema } = mongoose;

const documentSchema = new Schema(
	{
		title: String,
		description: String,
		documentUrl: String,
		patient: {
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

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
