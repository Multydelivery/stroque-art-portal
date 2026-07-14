import type { ArtistProfile, BusinessProfile, ProjectRequest } from "@/types/entities";
import type { SessionUser } from "@/lib/auth";
import type { z } from "zod";
import type { artistProfileSchema, businessProfileSchema, projectRequestSchema, requestStatusSchema, signupSchema } from "@/lib/validation";

type TestUser = SessionUser & {
  password: string;
};

type TestStore = {
  users: TestUser[];
  artists: (ArtistProfile & { userId: string })[];
  businesses: (BusinessProfile & { userId: string })[];
  requests: ProjectRequest[];
};

const fallbackImage = "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80";

const globalForTestData = globalThis as typeof globalThis & {
  stroqueTestStore?: TestStore;
};

function createStore(): TestStore {
  const artists: TestStore["artists"] = [
    {
      _id: "test-artist-1",
      userId: "test-user-artist",
      displayName: "Mara Ellis",
      bio: "Mixed-media muralist creating warm, site-specific artwork for hospitality and retail interiors.",
      location: "Brooklyn, NY",
      styles: ["Murals", "Botanical", "Contemporary"],
      services: ["Custom murals", "Canvas commissions"],
      startingPrice: 1800,
      portfolioImages: [fallbackImage]
    },
    {
      _id: "test-artist-2",
      userId: "test-user-artist-2",
      displayName: "Noah Vale",
      bio: "Abstract painter focused on textured statement pieces for offices, lounges, and residential lobbies.",
      location: "Austin, TX",
      styles: ["Abstract", "Textural", "Minimal"],
      services: ["Original artwork", "Art consulting"],
      startingPrice: 950,
      portfolioImages: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80"]
    }
  ];

  const businesses: TestStore["businesses"] = [
    {
      _id: "test-business-1",
      userId: "test-user-business",
      businessName: "Stroque Hotel Group",
      industry: "Hospitality",
      location: "New York, NY"
    }
  ];

  return {
    users: [
      { id: "test-user-artist", name: "Mara Ellis", email: "artist@example.com", password: "password123", role: "artist" },
      { id: "test-user-business", name: "Stroque Buyer", email: "business@example.com", password: "password123", role: "business" },
      { id: "test-user-admin", name: "Stroque Administrator", email: "admin@example.com", password: "password123", role: "admin" }
    ],
    artists,
    businesses,
    requests: [
      {
        _id: "test-request-1",
        businessId: businesses[0],
        artistId: artists[0],
        spaceType: "Hotel lobby",
        budget: 4200,
        timeline: "Next quarter",
        stylePreference: "Botanical and warm contemporary",
        description: "We are testing a large lobby mural concept with colors that connect to the neighborhood.",
        status: "pending",
        createdAt: new Date().toISOString()
      }
    ]
  };
}

function store() {
  globalForTestData.stroqueTestStore ??= createStore();
  return globalForTestData.stroqueTestStore;
}

export function getTestArtists(params: Record<string, string | undefined> = {}) {
  const q = params.q?.toLowerCase();
  const style = params.style?.toLowerCase();
  const location = params.location?.toLowerCase();
  const service = params.service?.toLowerCase();
  const maxBudget = params.maxBudget ? Number(params.maxBudget) : undefined;

  return store().artists.filter((artist) => {
    const text = [artist.displayName, artist.bio, artist.location, ...artist.styles, ...artist.services].join(" ").toLowerCase();
    if (q && !text.includes(q)) return false;
    if (style && !artist.styles.some((item) => item.toLowerCase().includes(style))) return false;
    if (location && !artist.location.toLowerCase().includes(location)) return false;
    if (service && !artist.services.some((item) => item.toLowerCase().includes(service))) return false;
    if (maxBudget !== undefined && artist.startingPrice > maxBudget) return false;
    return true;
  });
}

export function getTestArtist(id: string) {
  return store().artists.find((artist) => artist._id === id) ?? null;
}

export function findTestUserByEmail(email: string) {
  return store().users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function findTestUserById(id: string) {
  return store().users.find((user) => user.id === id) ?? null;
}

export function getTestAdminDashboard() {
  const data = store();
  return {
    users: data.users.map(({ id, name, email, role }) => ({ id, name, email, role })),
    artists: data.artists,
    businesses: data.businesses,
    requests: data.requests
  };
}

export function createTestUser(data: z.infer<typeof signupSchema>) {
  const existing = findTestUserByEmail(data.email);
  if (existing) return null;

  const user: TestUser = {
    id: `test-user-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role
  };
  store().users.push(user);

  if (user.role === "artist") {
    store().artists.push({
      _id: `test-artist-${Date.now()}`,
      userId: user.id,
      displayName: user.name,
      bio: "Tell businesses what makes your art practice distinctive.",
      location: "Add your location",
      styles: ["Contemporary"],
      services: ["Custom artwork"],
      startingPrice: 500,
      portfolioImages: []
    });
  } else {
    store().businesses.push({
      _id: `test-business-${Date.now()}`,
      userId: user.id,
      businessName: user.name,
      industry: "Hospitality",
      location: "Add your location"
    });
  }

  return user;
}

export function getTestArtistProfile(userId: string) {
  return store().artists.find((artist) => artist.userId === userId) ?? null;
}

export function upsertTestArtistProfile(userId: string, data: z.infer<typeof artistProfileSchema>) {
  const existing = getTestArtistProfile(userId);
  if (existing) {
    Object.assign(existing, data);
    return existing;
  }

  const profile = { _id: `test-artist-${Date.now()}`, userId, ...data };
  store().artists.push(profile);
  return profile;
}

export function getTestBusinessProfile(userId: string) {
  return store().businesses.find((business) => business.userId === userId) ?? null;
}

export function upsertTestBusinessProfile(userId: string, data: z.infer<typeof businessProfileSchema>) {
  const existing = getTestBusinessProfile(userId);
  if (existing) {
    Object.assign(existing, data);
    return existing;
  }

  const profile = { _id: `test-business-${Date.now()}`, userId, ...data };
  store().businesses.push(profile);
  return profile;
}

export function getTestArtistRequests(userId: string) {
  const artist = getTestArtistProfile(userId);
  if (!artist) return [];
  return store().requests.filter((request) => request.artistId._id === artist._id);
}

export function getTestBusinessRequests(userId: string) {
  const business = getTestBusinessProfile(userId);
  if (!business) return [];
  return store().requests.filter((request) => request.businessId._id === business._id);
}

export function createTestProjectRequest(userId: string, data: z.infer<typeof projectRequestSchema>) {
  const business = getTestBusinessProfile(userId);
  const artist = getTestArtist(data.artistId);
  if (!business || !artist) return null;

  const created: ProjectRequest = {
    _id: `test-request-${Date.now()}`,
    businessId: business,
    artistId: artist,
    spaceType: data.spaceType,
    budget: data.budget,
    timeline: data.timeline,
    stylePreference: data.stylePreference,
    description: data.description,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  store().requests.unshift(created);
  return created;
}

export function updateTestRequestStatus(userId: string, id: string, data: z.infer<typeof requestStatusSchema>) {
  const artist = getTestArtistProfile(userId);
  const request = store().requests.find((item) => item._id === id);
  if (!artist || !request || request.artistId._id !== artist._id) return null;

  request.status = data.status;
  return request;
}
