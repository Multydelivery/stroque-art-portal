import type { ArtistProfile, BusinessProfile, Project, ProjectRequest } from "@/types/entities";
import type { SessionUser } from "@/lib/auth";
import type { z } from "zod";
import type { artistProfileSchema, businessProfileSchema, projectRequestSchema, projectSchema, requestStatusSchema, signupSchema } from "@/lib/validation";

type TestUser = SessionUser & {
  password: string;
};

type TestStore = {
  users: TestUser[];
  artists: (ArtistProfile & { userId: string })[];
  businesses: (BusinessProfile & { userId: string })[];
  projects: Project[];
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
      bio: "Indianapolis-based mixed-media muralist creating warm, site-specific artwork for hospitality and retail interiors across Central Indiana.",
      location: "Indianapolis, IN",
      styles: ["Murals", "Botanical", "Contemporary"],
      services: ["Custom murals", "Canvas commissions"],
      startingPrice: 1800,
      portfolioImages: [fallbackImage]
    },
    {
      _id: "test-artist-2",
      userId: "test-user-artist-2",
      displayName: "Noah Vale",
      bio: "Fishers-based abstract painter focused on textured statement pieces for offices, lounges, and residential lobbies throughout Indiana.",
      location: "Fishers, IN",
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
      location: "Indianapolis, IN"
    }
  ];

  const projects: Project[] = [
    {
      _id: "test-project-1",
      businessId: businesses[0],
      spaceType: "Hotel lobby feature wall",
      dimensions: "10x20",
      budgetMin: 3000,
      budgetMax: 5500,
      timeline: "6-8 weeks",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
      stylePreference: "Warm botanical mural with contemporary details",
      description: "Large hospitality lobby focal piece with installation support and brand color constraints.",
      status: "open",
      createdAt: new Date().toISOString()
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
    projects,
    requests: [
      {
        _id: "test-request-1",
        projectId: projects[0],
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

  // Hydrate cached stores from older shapes after hot reloads.
  if (!globalForTestData.stroqueTestStore.projects) {
    globalForTestData.stroqueTestStore.projects = [];
  }

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
    projects: data.projects,
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
      location: "Indianapolis, IN"
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

export function getTestBusinessProjects(userId: string) {
  const business = getTestBusinessProfile(userId);
  if (!business) return [];
  return store().projects.filter((project) => project.businessId._id === business._id);
}

export function getTestBusinessProjectById(userId: string, id: string) {
  const business = getTestBusinessProfile(userId);
  if (!business) return null;
  return store().projects.find((project) => project._id === id && project.businessId._id === business._id) ?? null;
}

export function getTestProjectById(id: string) {
  return store().projects.find((project) => project._id === id) ?? null;
}

export function createTestProject(userId: string, data: z.infer<typeof projectSchema>) {
  const business = getTestBusinessProfile(userId);
  if (!business) return null;

  const created: Project = {
    _id: `test-project-${Date.now()}`,
    businessId: business,
    spaceType: data.spaceType,
    dimensions: data.dimensions,
    budgetMin: data.budgetMin,
    budgetMax: data.budgetMax,
    timeline: data.timeline,
    dueDate: data.dueDate,
    stylePreference: data.stylePreference,
    description: data.description,
    status: "open",
    createdAt: new Date().toISOString()
  };
  store().projects.unshift(created);
  return created;
}

export function updateTestProject(userId: string, id: string, data: z.infer<typeof projectSchema>) {
  const project = getTestBusinessProjectById(userId, id);
  if (!project) return null;

  project.spaceType = data.spaceType;
  project.dimensions = data.dimensions;
  project.budgetMin = data.budgetMin;
  project.budgetMax = data.budgetMax;
  project.timeline = data.timeline;
  project.dueDate = data.dueDate;
  project.stylePreference = data.stylePreference;
  project.description = data.description;
  return project;
}

export function updateTestProjectStatus(userId: string, id: string, status: Project["status"]) {
  const project = getTestBusinessProjectById(userId, id);
  if (!project) return null;

  project.status = status;
  return project;
}

export function deleteTestProject(userId: string, id: string) {
  const business = getTestBusinessProfile(userId);
  if (!business) return false;

  const projectIndex = store().projects.findIndex((item) => item._id === id && item.businessId._id === business._id);
  if (projectIndex < 0) return false;

  store().projects.splice(projectIndex, 1);
  store().requests = store().requests.filter((request) => request.projectId._id !== id);
  return true;
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
  const project = getTestBusinessProjectById(userId, data.projectId);
  if (!business || !artist || !project) return null;

  const created: ProjectRequest = {
    _id: `test-request-${Date.now()}`,
    projectId: project,
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

export function cancelTestBusinessRequest(userId: string, id: string) {
  const business = getTestBusinessProfile(userId);
  if (!business) return false;

  const index = store().requests.findIndex((item) => item._id === id && item.businessId._id === business._id);
  if (index < 0) return false;

  store().requests.splice(index, 1);
  return true;
}
