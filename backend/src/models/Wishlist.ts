import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	coverImage: string;
	author: mongoose.Types.ObjectId;
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		coverImage: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

WishlistSchema.index({ author: 1 });
WishlistSchema.index({ createdAt: -1 });

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);
