export interface DestinationOption {
  key: string;
  icon: "mountain" | "building" | "wave" | "sun";
}

export const popularDestinations: DestinationOption[] = [
  { key: "giza", icon: "mountain" },
  { key: "cairo", icon: "building" },
  { key: "northCoast", icon: "wave" },
  { key: "alexandria", icon: "wave" },
  { key: "marsaMatrouh", icon: "sun" },
  { key: "elGouna", icon: "sun" },
  { key: "elDabaa", icon: "wave" },
];
