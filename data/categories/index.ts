import type { BusinessCategory } from "./types";

import { VENUES_CATEGORY } from "./categories/venues";
import { FOOD_AND_DRINKS_CATEGORY } from "./categories/food-and-drinks";
import { ENTERTAINMENT_CATEGORY } from "./categories/entertainment";
import { PHOTOGRAPHY_AND_VIDEO_CATEGORY } from "./categories/photography-and-video";
import { DECOR_AND_FLORALS_CATEGORY } from "./categories/decor-and-florals";
import { RENTALS_CATEGORY } from "./categories/rentals";
import { BEAUTY_AND_STYLING_CATEGORY } from "./categories/beauty-and-styling";
import { TRANSPORTATION_CATEGORY } from "./categories/transportation";
import { PLANNING_AND_COORDINATION_CATEGORY } from "./categories/planning-and-coordination";
import { EVENT_STAFF_AND_SUPPORT_CATEGORY } from "./categories/event-staff-and-support";

export const VENDOR_CATEGORIES: BusinessCategory[] = [
  VENUES_CATEGORY,
  FOOD_AND_DRINKS_CATEGORY,
  ENTERTAINMENT_CATEGORY,
  PHOTOGRAPHY_AND_VIDEO_CATEGORY,
  DECOR_AND_FLORALS_CATEGORY,
  RENTALS_CATEGORY,
  BEAUTY_AND_STYLING_CATEGORY,
  TRANSPORTATION_CATEGORY,
  PLANNING_AND_COORDINATION_CATEGORY,
  EVENT_STAFF_AND_SUPPORT_CATEGORY,
];

export type { BusinessCategory, BusinessType } from "./types";

export {
  getCategoryById,
  getBusinessTypeById,
  getCategoryIdsFromBusinessTypes,
} from "./helpers";
