import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["artist", "business"], required: true }
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export default (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model("User", userSchema);
