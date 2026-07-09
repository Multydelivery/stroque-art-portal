import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const artistProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    styles: [{ type: String, required: true, trim: true }],
    services: [{ type: String, required: true, trim: true }],
    startingPrice: { type: Number, required: true, min: 0 },
    portfolioImages: [{ type: String }]
  },
  { timestamps: true }
);

artistProfileSchema.index({
  displayName: "text",
  bio: "text",
  location: "text",
  styles: "text",
  services: "text"
});

export type ArtistProfileDocument = InferSchemaType<typeof artistProfileSchema>;

export default (mongoose.models.ArtistProfile as Model<ArtistProfileDocument>) ||
  mongoose.model("ArtistProfile", artistProfileSchema);
