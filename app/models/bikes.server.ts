import { supabase } from "./supabase.server";

export type Bike = {
  id: string;
  product_name: string;
  pictures: string[];
  source: string;
  battery_life: number;
  brand: string;
  motor_kind: string;
};

export async function getBikeListItems(battery_life: number[], motor_kind: string[], integrated_lights: string[]): Promise<Bike[] | null> {
  if (battery_life.length != 2) return null;
  const query = supabase
    .from("ebikes")
    .select("id, product_name, battery_life, source, pictures, brand, motor_kind")
    .gte("battery_life", Math.min(...battery_life))
    .lte("battery_life", Math.max(...battery_life))
    .in("motor_kind", motor_kind);

  if (integrated_lights.includes("true") && !integrated_lights.includes("false"))
    query.eq("integrated_lights", true);
  else if (!integrated_lights.includes("true") && integrated_lights.includes("false"))
    query.eq("integrated_lights", false);

  const { data } = await query;

  return data;
}
