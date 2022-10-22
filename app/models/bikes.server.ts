import { supabase } from "./supabase.server";

export type Bike = {
  id: string;
  product_name: string;
  pictures: string[];
  source: string;
  battery_life: number;
  brand: string;
};

export async function getBikeListItems(battery_life: number[]): Promise<Bike[] | null> {
  if (battery_life.length != 2) return null;
  const { data } = await supabase
    .from("ebikes")
    .select("id, product_name, battery_life, source, pictures, brand")
    .gte("battery_life", Math.min(...battery_life))
    .lte("battery_life", Math.max(...battery_life));

  return data;
}

export async function getBike({
  id,
}: Pick<Bike, "id">): Promise<Bike | null> {
  const { data, error } = await supabase
    .from("ebikes")
    .select("*")
    .eq("id", id)
    .single();

  if (!error) {
    return {
      id: data.id,
      product_name: data.product_name,
      pictures: data.pictures,
      source: data.source,
      battery_life: data.battery_life,
      brand: data.brand,
    };
  }

  return null;
}
