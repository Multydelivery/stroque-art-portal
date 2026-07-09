export type ArtistProfile = {
  _id: string;
  displayName: string;
  bio: string;
  location: string;
  styles: string[];
  services: string[];
  startingPrice: number;
  portfolioImages: string[];
};

export type BusinessProfile = {
  _id: string;
  businessName: string;
  industry: string;
  location: string;
};

export type ProjectRequest = {
  _id: string;
  businessId: BusinessProfile;
  artistId: ArtistProfile;
  spaceType: string;
  budget: number;
  timeline: string;
  stylePreference: string;
  description: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
};
