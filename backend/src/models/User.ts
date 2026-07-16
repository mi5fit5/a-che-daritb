import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	_id: mongoose.Types.ObjectId;
	username: string;
	passwordHash: string;
	createdAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 30,
		},
		passwordHash: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
