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

export type Project = {
  _id: string;
  businessId: BusinessProfile;
  spaceType: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  dueDate: string;
  stylePreference: string;
  description: string;
  status: "open" | "closed";
  createdAt: string;
};

export type ProjectRequest = {
  _id: string;
  projectId: Project;
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
