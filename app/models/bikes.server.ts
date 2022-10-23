import { BikeFilters, BikeFilterType } from "./bikes";
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

export async function getBikeListItems(input: {[fieldName: string]: string[]}): Promise<Bike[] | null> {
    let selectedFields = ["id", "product_name", "source", "pictures", "brand"];
    selectedFields = [...new Set(selectedFields.concat(Object.keys(BikeFilters)))];

    const query = supabase
        .from("ebikes")
        .select(selectedFields.join(", "));

    for (let [key, value] of Object.entries(BikeFilters)) {
        switch (value.type) {
            case BikeFilterType.RANGE:
                if (input[key].length != 2) break;
                query.gte(key, Math.min(...input[key].map(v => +v)))
                    .lte(key, Math.max(...input[key].map(v => +v)));
                break;
            case BikeFilterType.ENUM:
                query.in(key, input[key]);
                break;
            case BikeFilterType.BOOLEAN:
                if (input[key].includes("true") && !input[key].includes("false"))
                    query.eq(key, true);
                else if (!input[key].includes("true") && input[key].includes("false"))
                    query.eq(key, false);
                break;
        }
    }

    const { data } = await query;

    return data;
}
