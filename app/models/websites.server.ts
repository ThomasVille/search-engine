import { websites } from "@prisma/client";
import { prisma } from "./db.server";


export async function getWebsites(): Promise<websites[] | null> {
    return await prisma.websites.findMany({
    });
}

export async function getWebsite(websiteId: string): Promise<websites | null> {
    return await prisma.websites.findUnique({
        where: {
            id: websiteId
        }
    });
}

export async function createWebsite(website: Pick<websites, 'name' | 'base_url' | 'bikes_list_selector' | 'bikes_list_pages'>) {
    return prisma.websites.create({ data: website });
}
