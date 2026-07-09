import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const businessProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export type BusinessProfileDocument = InferSchemaType<typeof businessProfileSchema>;

export default (mongoose.models.BusinessProfile as Model<BusinessProfileDocument>) ||
  mongoose.model("BusinessProfile", businessProfileSchema);
