import { supabase } from "./user.server";

export type Bike = {
  id: string;
  product_name: string;
  pictures: string[];
  source: string;
};

export async function getBikeListItems(battery_life: number[]): Promise<Bike[] | null> {
  if (battery_life.length != 2) return null;
  const { data } = await supabase
    .from("ebikes")
    .select("id, product_name, battery_life, source, pictures")
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
      source: data.source
    };
  }

  return null;
}
