import type {
  VendorCategory,
  VendorService,
  VendorServiceContext,
  VendorSubcategory,
  VendorSubcategoryContext,
} from "@/types/category";

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    id: "venues",
    name: "Venues",
    slug: "venues",
    description:
      "Event spaces for weddings, parties, corporate events, and celebrations.",
    icon: "building",
    featuredServiceIds: [
      "ballroom",
      "hotel-venue",
      "rooftop-venue",
      "garden-venue",
      "event-hall",
    ],
    active: true,
    sortOrder: 1,

    subcategories: [
      {
        id: "indoor-venues",
        name: "Indoor Venues",
        slug: "indoor-venues",
        description: "Indoor spaces for private and public events.",
        active: true,
        sortOrder: 1,

        services: [
          {
            id: "ballroom",
            name: "Ballroom",
            slug: "ballroom",
            active: true,
          },
          {
            id: "banquet-hall",
            name: "Banquet Hall",
            slug: "banquet-hall",
            active: true,
          },
          {
            id: "event-hall",
            name: "Event Hall",
            slug: "event-hall",
            active: true,
          },
          {
            id: "conference-center",
            name: "Conference Center",
            slug: "conference-center",
            active: true,
          },
        ],
      },

      {
        id: "hospitality-venues",
        name: "Hotels & Hospitality",
        slug: "hotels-and-hospitality",
        description: "Hotels, resorts, restaurants, and private dining spaces.",
        active: true,
        sortOrder: 2,

        services: [
          {
            id: "hotel-venue",
            name: "Hotel Venue",
            slug: "hotel-venue",
            active: true,
          },
          {
            id: "resort-venue",
            name: "Resort Venue",
            slug: "resort-venue",
            active: true,
          },
          {
            id: "restaurant-venue",
            name: "Restaurant Venue",
            slug: "restaurant-venue",
            active: true,
          },
          {
            id: "private-dining-room",
            name: "Private Dining Room",
            slug: "private-dining-room",
            active: true,
          },
        ],
      },

      {
        id: "outdoor-venues",
        name: "Outdoor Venues",
        slug: "outdoor-venues",
        description: "Outdoor spaces for ceremonies and celebrations.",
        active: true,
        sortOrder: 3,

        services: [
          {
            id: "garden-venue",
            name: "Garden Venue",
            slug: "garden-venue",
            active: true,
          },
          {
            id: "rooftop-venue",
            name: "Rooftop Venue",
            slug: "rooftop-venue",
            active: true,
          },
          {
            id: "ranch-venue",
            name: "Ranch Venue",
            slug: "ranch-venue",
            active: true,
          },
          {
            id: "private-estate",
            name: "Private Estate",
            slug: "private-estate",
            active: true,
          },
        ],
      },
    ],
  },

  {
    id: "entertainment",
    name: "Entertainment",
    slug: "entertainment",
    description:
      "Music, performers, interactive entertainment, and event experiences.",
    icon: "music",
    featuredServiceIds: ["dj", "live-band", "mariachi", "mc", "photo-booth"],
    active: true,
    sortOrder: 2,

    subcategories: [
      {
        id: "music",
        name: "Music",
        slug: "music",
        description: "Live and recorded music services.",
        active: true,
        sortOrder: 1,

        services: [
          {
            id: "dj",
            name: "DJ",
            slug: "dj",
            active: true,
          },
          {
            id: "live-band",
            name: "Live Band",
            slug: "live-band",
            active: true,
          },
          {
            id: "mariachi",
            name: "Mariachi",
            slug: "mariachi",
            active: true,
          },
          {
            id: "solo-musician",
            name: "Solo Musician",
            slug: "solo-musician",
            active: true,
          },
          {
            id: "singer",
            name: "Singer",
            slug: "singer",
            active: true,
          },
        ],
      },

      {
        id: "hosts-and-performers",
        name: "Hosts & Performers",
        slug: "hosts-and-performers",
        description: "Hosts, performers, and live acts.",
        active: true,
        sortOrder: 2,

        services: [
          {
            id: "mc",
            name: "MC",
            slug: "mc",
            active: true,
          },
          {
            id: "magician",
            name: "Magician",
            slug: "magician",
            active: true,
          },
          {
            id: "comedian",
            name: "Comedian",
            slug: "comedian",
            active: true,
          },
          {
            id: "dance-group",
            name: "Dance Group",
            slug: "dance-group",
            active: true,
          },
        ],
      },

      {
        id: "interactive-entertainment",
        name: "Interactive Entertainment",
        slug: "interactive-entertainment",
        description: "Interactive attractions and guest experiences.",
        active: true,
        sortOrder: 3,

        services: [
          {
            id: "photo-booth",
            name: "Photo Booth",
            slug: "photo-booth",
            active: true,
          },
          {
            id: "karaoke",
            name: "Karaoke",
            slug: "karaoke",
            active: true,
          },
          {
            id: "casino-entertainment",
            name: "Casino Entertainment",
            slug: "casino-entertainment",
            active: true,
          },
          {
            id: "game-truck",
            name: "Game Truck",
            slug: "game-truck",
            active: true,
          },
        ],
      },
    ],
  },

  {
    id: "photography",
    name: "Photography",
    slug: "photography",
    description:
      "Photography, videography, content creation, and visual event coverage.",
    icon: "camera",
    featuredServiceIds: [
      "event-photographer",
      "event-videographer",
      "drone-photography",
      "content-creator",
      "360-booth",
    ],
    active: true,
    sortOrder: 3,

    subcategories: [
      {
        id: "photography-services",
        name: "Photography",
        slug: "photography-services",
        description:
          "Professional photography for weddings, parties, and special events.",
        active: true,
        sortOrder: 1,

        services: [
          {
            id: "event-photographer",
            name: "Event Photographer",
            slug: "event-photographer",
            active: true,
          },
          {
            id: "wedding-photographer",
            name: "Wedding Photographer",
            slug: "wedding-photographer",
            active: true,
          },
          {
            id: "quinceanera-photographer",
            name: "Quinceañera Photographer",
            slug: "quinceanera-photographer",
            active: true,
          },
          {
            id: "portrait-photographer",
            name: "Portrait Photographer",
            slug: "portrait-photographer",
            active: true,
          },
          {
            id: "corporate-photographer",
            name: "Corporate Photographer",
            slug: "corporate-photographer",
            active: true,
          },
        ],
      },

      {
        id: "videography-services",
        name: "Videography",
        slug: "videography-services",
        description: "Professional video coverage and event filmmaking.",
        active: true,
        sortOrder: 2,

        services: [
          {
            id: "event-videographer",
            name: "Event Videographer",
            slug: "event-videographer",
            active: true,
          },
          {
            id: "wedding-videographer",
            name: "Wedding Videographer",
            slug: "wedding-videographer",
            active: true,
          },
          {
            id: "quinceanera-videographer",
            name: "Quinceañera Videographer",
            slug: "quinceanera-videographer",
            active: true,
          },
          {
            id: "corporate-videographer",
            name: "Corporate Videographer",
            slug: "corporate-videographer",
            active: true,
          },
          {
            id: "live-streaming",
            name: "Live Streaming",
            slug: "live-streaming",
            active: true,
          },
        ],
      },

      {
        id: "aerial-media",
        name: "Drone & Aerial Media",
        slug: "drone-and-aerial-media",
        description:
          "Aerial photography and video services for events and venues.",
        active: true,
        sortOrder: 3,

        services: [
          {
            id: "drone-photography",
            name: "Drone Photography",
            slug: "drone-photography",
            active: true,
          },
          {
            id: "drone-videography",
            name: "Drone Videography",
            slug: "drone-videography",
            active: true,
          },
          {
            id: "venue-aerial-media",
            name: "Venue Aerial Media",
            slug: "venue-aerial-media",
            active: true,
          },
        ],
      },

      {
        id: "event-content",
        name: "Content Creation",
        slug: "content-creation",
        description:
          "Fast-turnaround social media and behind-the-scenes event content.",
        active: true,
        sortOrder: 4,

        services: [
          {
            id: "content-creator",
            name: "Event Content Creator",
            slug: "event-content-creator",
            active: true,
          },
          {
            id: "social-media-content",
            name: "Social Media Content",
            slug: "social-media-content",
            active: true,
          },
          {
            id: "same-day-editing",
            name: "Same-Day Editing",
            slug: "same-day-editing",
            active: true,
          },
          {
            id: "behind-the-scenes-content",
            name: "Behind-the-Scenes Content",
            slug: "behind-the-scenes-content",
            active: true,
          },
        ],
      },

      {
        id: "photo-experiences",
        name: "Photo Experiences",
        slug: "photo-experiences",
        description:
          "Interactive photography booths and guest photo experiences.",
        active: true,
        sortOrder: 5,

        services: [
          {
            id: "360-booth",
            name: "360 Booth",
            slug: "360-booth",
            active: true,
          },
          {
            id: "mirror-booth",
            name: "Mirror Booth",
            slug: "mirror-booth",
            active: true,
          },
          {
            id: "gif-booth",
            name: "GIF Booth",
            slug: "gif-booth",
            active: true,
          },
          {
            id: "instant-print-photography",
            name: "Instant Print Photography",
            slug: "instant-print-photography",
            active: true,
          },
        ],
      },
    ],
  },

  {
    id: "rentals",
    name: "Rentals",
    slug: "rentals",
    description:
      "Furniture, tents, lighting, equipment, and event infrastructure.",
    icon: "chair",
    featuredServiceIds: [
      "tables-and-chairs",
      "linen-rentals",
      "tent-rentals",
      "dance-floor-rentals",
      "lounge-furniture",
    ],
    active: true,
    sortOrder: 4,

    subcategories: [
      {
        id: "furniture-rentals",
        name: "Furniture",
        slug: "furniture",
        description: "Tables, chairs, lounge pieces, and event furniture.",
        active: true,
        sortOrder: 1,

        services: [
          {
            id: "tables-and-chairs",
            name: "Tables & Chairs",
            slug: "tables-and-chairs",
            active: true,
          },
          {
            id: "chiavari-chairs",
            name: "Chiavari Chairs",
            slug: "chiavari-chairs",
            active: true,
          },
          {
            id: "cocktail-tables",
            name: "Cocktail Tables",
            slug: "cocktail-tables",
            active: true,
          },
          {
            id: "lounge-furniture",
            name: "Lounge Furniture",
            slug: "lounge-furniture",
            active: true,
          },
        ],
      },

      {
        id: "tent-and-structure-rentals",
        name: "Tents & Structures",
        slug: "tents-and-structures",
        description: "Temporary coverings and event structures.",
        active: true,
        sortOrder: 2,

        services: [
          {
            id: "tent-rentals",
            name: "Tent Rentals",
            slug: "tent-rentals",
            active: true,
          },
          {
            id: "clear-tent-rentals",
            name: "Clear Tent Rentals",
            slug: "clear-tent-rentals",
            active: true,
          },
          {
            id: "canopy-rentals",
            name: "Canopy Rentals",
            slug: "canopy-rentals",
            active: true,
          },
          {
            id: "stage-rentals",
            name: "Stage Rentals",
            slug: "stage-rentals",
            active: true,
          },
        ],
      },

      {
        id: "lighting-and-production",
        name: "Lighting & Production",
        slug: "lighting-and-production",
        description:
          "Lighting, audio, staging, and event production equipment.",
        active: true,
        sortOrder: 3,

        services: [
          {
            id: "uplighting",
            name: "Uplighting",
            slug: "uplighting",
            active: true,
          },
          {
            id: "string-lighting",
            name: "String Lighting",
            slug: "string-lighting",
            active: true,
          },
          {
            id: "audio-equipment",
            name: "Audio Equipment",
            slug: "audio-equipment",
            active: true,
          },
          {
            id: "dance-floor-rentals",
            name: "Dance Floor Rentals",
            slug: "dance-floor-rentals",
            active: true,
          },
        ],
      },

      {
        id: "linens-and-tableware",
        name: "Linens & Tableware",
        slug: "linens-and-tableware",
        description:
          "Linens, table settings, dinnerware, and decorative table rentals.",
        active: true,
        sortOrder: 4,

        services: [
          {
            id: "linen-rentals",
            name: "Linen Rentals",
            slug: "linen-rentals",
            active: true,
          },
          {
            id: "tablecloth-rentals",
            name: "Tablecloth Rentals",
            slug: "tablecloth-rentals",
            active: true,
          },
          {
            id: "napkin-rentals",
            name: "Napkin Rentals",
            slug: "napkin-rentals",
            active: true,
          },
          {
            id: "dinnerware-rentals",
            name: "Dinnerware Rentals",
            slug: "dinnerware-rentals",
            active: true,
          },
          {
            id: "glassware-rentals",
            name: "Glassware Rentals",
            slug: "glassware-rentals",
            active: true,
          },
        ],
      },
    ],
  },
];

export function getCategoryById(
  categoryId: string,
): VendorCategory | undefined {
  return VENDOR_CATEGORIES.find((category) => category.id === categoryId);
}

export function getSubcategoryById(
  subcategoryId: string,
): VendorSubcategory | undefined {
  return getSubcategoryContextById(subcategoryId)?.subcategory;
}

export function getSubcategoryContextById(
  subcategoryId: string,
): VendorSubcategoryContext | undefined {
  for (const category of VENDOR_CATEGORIES) {
    const subcategory = category.subcategories.find(
      (item) => item.id === subcategoryId,
    );

    if (subcategory) {
      return {
        category,
        subcategory,
      };
    }
  }

  return undefined;
}

export function getServiceById(serviceId: string): VendorService | undefined {
  return getServiceContextById(serviceId)?.service;
}

export function getServiceContextById(
  serviceId: string,
): VendorServiceContext | undefined {
  for (const category of VENDOR_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      const service = subcategory.services.find(
        (item) => item.id === serviceId,
      );

      if (service) {
        return {
          category,
          subcategory,
          service,
        };
      }
    }
  }

  return undefined;
}

export function getAllServices(): VendorService[] {
  return VENDOR_CATEGORIES.flatMap((category) =>
    category.subcategories.flatMap((subcategory) => subcategory.services),
  );
}

export function getCategoryIdsFromServices(serviceIds: string[]): string[] {
  const categoryIds = serviceIds
    .map((serviceId) => getServiceContextById(serviceId)?.category.id)
    .filter((categoryId): categoryId is string => Boolean(categoryId));

  return [...new Set(categoryIds)];
}

export function getSubcategoryIdsFromServices(serviceIds: string[]): string[] {
  const subcategoryIds = serviceIds
    .map((serviceId) => getServiceContextById(serviceId)?.subcategory.id)
    .filter((subcategoryId): subcategoryId is string => Boolean(subcategoryId));

  return [...new Set(subcategoryIds)];
}

export function getFeaturedServices(categoryId: string): VendorService[] {
  const category = getCategoryById(categoryId);

  if (!category) {
    return [];
  }

  return category.featuredServiceIds
    .map((serviceId) => getServiceById(serviceId))
    .filter((service): service is VendorService => Boolean(service));
}
