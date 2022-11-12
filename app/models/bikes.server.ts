import { BikeFilters, BikeFilterType, getSortDetails, NB_ELEMENTS_PER_PAGE } from "./bikes";
import { supabase } from "./supabase.server";

export type Bike = {
    id: string;
    product_name: string;
    pictures: string[];
    source: string;
    battery_life: number;
    brand: string;
    motor_kind: string;
    price: number;
    torque: number | undefined;
    removable_battery: boolean | undefined;
};

const getPagination = (page: number, size: number) => {
    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1

    return { from, to }
}

export async function getBikeListItems(page: number, input: {[fieldName: string]: string[]}, sort: string): Promise<{data: Bike[] | null, count: number | null}> {
    let selectedFields = ["id", "product_name", "source", "pictures", "brand", "price"];
    selectedFields = [...new Set(selectedFields.concat(Object.keys(BikeFilters)))];
    const { from, to } = getPagination(page, NB_ELEMENTS_PER_PAGE);

    const { field: sortField, ascending } = getSortDetails(sort);

    const query = supabase
        .from("ebikes")
        .select(selectedFields.join(", "), { count: "exact" })
        .order(sortField, { ascending })
        .range(from, to);

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

    return await query;
}

export async function getBike(bikeId: string): Promise<{data: Bike | null}> {
    let selectedFields = ["id", "product_name", "source", "pictures", "brand", "price", "torque", "removable_battery"];
    selectedFields = [...new Set(selectedFields.concat(Object.keys(BikeFilters)))];

    const query = supabase
        .from("ebikes")
        .select(selectedFields.join(", "))
        .eq("id", bikeId)
        .limit(1)
        .maybeSingle();

    return await query;
}