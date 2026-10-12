import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const projectSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
    spaceType: { type: String, required: true, trim: true },
    dimensions: { type: String, trim: true, default: "" },
    budgetMin: { type: Number, required: true, min: 1 },
    budgetMax: { type: Number, required: true, min: 1 },
    timeline: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true, trim: true },
    stylePreference: { type: String, trim: true, default: "" },
    description: { type: String, required: true },
    category: { type: String, trim: true },
    deliverables: { type: String, trim: true },
    budget: { type: Number, min: 100, max: 10000 },
    paymentStructure: { type: String, enum: ["fixed"] },
    specialRequirements: { type: String, trim: true, default: "" },
    artistExperience: { type: String, trim: true, default: "" },
    referenceFiles: [{
      _id: false,
      name: { type: String, required: true },
      url: { type: String, required: true }
    }],
    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export default (mongoose.models.Project as Model<ProjectDocument>) || mongoose.model("Project", projectSchema);