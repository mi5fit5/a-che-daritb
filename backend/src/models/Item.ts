import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
	_id: mongoose.Types.ObjectId;
	wishlist: mongoose.Types.ObjectId;
	title: string;
	image: string;
	shopUrl: string;
	createdAt: Date;
}

const ItemSchema = new Schema<IItem>(
	{
		wishlist: {
			type: Schema.Types.ObjectId,
			ref: 'Wishlist',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		image: {
			type: String,
			required: true,
		},
		shopUrl: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

ItemSchema.index({ wishlist: 1 });

export default mongoose.model<IItem>('Item', ItemSchema);
