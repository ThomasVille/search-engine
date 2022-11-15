import { BikeFilters, BikeFilterType, getSortDetails, NB_ELEMENTS_PER_PAGE } from "./bikes";
import { prisma } from "./db.server";
import { ebikes } from '@prisma/client'

export async function getBikeListItems(page: number, input: {[fieldName: string]: string[]}, sort: string): Promise<{data: ebikes[] | null, count: number | null}> {
    const { field: sortField, ascending } = getSortDetails(sort);

    let whereClause: any = {};
    for (let [key, value] of Object.entries(BikeFilters)) {
        switch (value.type) {
            case BikeFilterType.RANGE:
                if (input[key].length != 2) break;
                whereClause[key] = {
                    gte: Math.min(...input[key].map(v => +v)),
                    lte: Math.max(...input[key].map(v => +v)),
                };
                break;
            case BikeFilterType.ENUM:
                whereClause[key] = {
                    in: input[key]
                };
                break;
            case BikeFilterType.BOOLEAN:
                if (input[key].includes("true") && !input[key].includes("false"))
                    whereClause[key] = {
                        equals: true
                    };
                else if (!input[key].includes("true") && input[key].includes("false"))
                    whereClause[key] = {
                        equals: false
                    };
                break;
        }
    }

    const res = await prisma.$transaction([
        prisma.ebikes.count({
            where: whereClause
        }),
        prisma.ebikes.findMany({
            skip: page * NB_ELEMENTS_PER_PAGE,
            take: NB_ELEMENTS_PER_PAGE,
            orderBy: {
                [sortField]: ascending ? 'asc' : 'desc'
            },
            where: whereClause
        }),
      ]);

    return {
        count: res[0],
        data: res[1],
    };
}

export async function getBike(bikeId: string): Promise<ebikes | null> {
    return await prisma.ebikes.findUnique({
        where: {
            id: parseInt(bikeId)
        }
    });
}