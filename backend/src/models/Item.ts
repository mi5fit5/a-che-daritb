import mongoose, { Schema, Document } from 'mongoose';

export const ITEM_PRIORITIES = [
	'essential',
	'high',
	'medium',
	'low',
	'fun',
] as const;

export type TItemPriority = (typeof ITEM_PRIORITIES)[number];

export interface IItem extends Document {
	_id: mongoose.Types.ObjectId;
	wishlist: mongoose.Types.ObjectId;
	title: string;
	image: string;
	shopUrl: string;
	price: number;
	priority?: TItemPriority;
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
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		priority: {
			type: String,
			enum: ITEM_PRIORITIES,
		},
	},
	{ timestamps: true }
);

ItemSchema.index({ wishlist: 1 });

export default mongoose.model<IItem>('Item', ItemSchema);
