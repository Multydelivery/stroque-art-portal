import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const projectRequestSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "ArtistProfile", required: true },
    spaceType: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 1 },
    timeline: { type: String, required: true, trim: true },
    stylePreference: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export type ProjectRequestDocument = InferSchemaType<typeof projectRequestSchema>;

export default (mongoose.models.ProjectRequest as Model<ProjectRequestDocument>) ||
  mongoose.model("ProjectRequest", projectRequestSchema);
