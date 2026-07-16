import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
	_id: mongoose.Types.ObjectId;
	item: mongoose.Types.ObjectId;
	bookedBy: mongoose.Types.ObjectId;
	createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
	{
		item: {
			type: Schema.Types.ObjectId,
			ref: 'Item',
			required: true,
			unique: true,
		},
		bookedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

BookingSchema.index({ bookedBy: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
