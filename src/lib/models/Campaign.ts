import mongoose, { Schema, Document } from 'mongoose';

export type CampaignType = 'social' | 'influencer' | 'traditional' | 'mixed';
export type CampaignTier = 'basic' | 'premium' | 'enterprise';
export type CampaignGender = 'all' | 'male' | 'female' | 'other';

export interface ICampaign extends Document {
  name: string;
  type: CampaignType;
  targetAudience: {
    ageRange: number[];
    gender: CampaignGender;
    interests: string[];
    locations: string[];
  };
  budget: number;
  tier: CampaignTier;
  duration: number;
  startDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['social', 'influencer', 'traditional', 'mixed'],
      required: true,
    },
    targetAudience: {
      ageRange: { type: [Number], required: true },
      gender: {
        type: String,
        enum: ['all', 'male', 'female', 'other'],
        required: true,
      },
      interests: { type: [String], default: [] },
      locations: { type: [String], default: [] },
    },
    budget: { type: Number, required: true },
    tier: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      required: true,
    },
    duration: { type: Number, required: true },
    startDate: { type: Date },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
