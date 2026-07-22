export const COLLECTIONS = {
  users: "users",
  vendors: "vendors",
  locations: "locations",
  reviews: "reviews",
  favorites: "favorites",
  conversations: "conversations",
  messages: "messages",
  subscriptions: "subscriptions",
  reports: "reports",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
