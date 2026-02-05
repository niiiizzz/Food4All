import { UserRole } from "./types";

export const APP_NAME = "Food4All";
export const LAVANDIER_COLOR = "#c3a8f9";

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: "Customer",
  [UserRole.RESTAURANT]: "Restaurant / Hotel",
  [UserRole.NGO]: "NGO / Shelter",
  [UserRole.DELIVERY]: "Delivery Partner",
  [UserRole.ADMIN]: "Admin (Govt)",
  [UserRole.ANIMAL_SHELTER]: "Animal Shelter",
  [UserRole.ORPHANAGE]: "Orphanage",
  [UserRole.OLD_AGE_HOME]: "Old Age Home",
  [UserRole.REHAB_CENTER]: "Rehab Center",
};

export const SAMPLE_COORDS = [51.505, -0.09]; // Default map center