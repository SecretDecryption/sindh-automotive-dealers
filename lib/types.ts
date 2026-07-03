export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  priceNote?: string;
  mileage: number;
  transmission: "Automatic" | "Manual";
  fuelType: string;
  drivetrain: string;
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  description: string;
  features: string[];
  images: string[];
};
