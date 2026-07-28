import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const projectSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    spaceType: { type: String, required: true, trim: true },
    budgetMin: { type: Number, required: true, min: 1 },
    budgetMax: { type: Number, required: true, min: 1 },
    timeline: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true, trim: true },
    stylePreference: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export default (mongoose.models.Project as Model<ProjectDocument>) || mongoose.model("Project", projectSchema);