import mongoose, { Schema, Document, Types } from 'mongoose';
import type { FilterClause } from '@/types/filters';

export interface ISavedFilter extends Document {
  userId: Types.ObjectId;
  name: string;
  query: string;
  filters: FilterClause[];
  createdAt: Date;
  updatedAt: Date;
}

const SavedFilterSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    query: { type: String, required: true },
    filters: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.SavedFilter ||
  mongoose.model<ISavedFilter>('SavedFilter', SavedFilterSchema);
