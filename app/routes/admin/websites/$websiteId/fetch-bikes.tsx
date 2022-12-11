import { ActionArgs, redirect } from "@remix-run/node";
import * as cheerio from 'cheerio';
import { createBikes } from "~/models/bikes.server";

// MODELS
import { getWebsite } from "~/models/websites.server";

export async function action({ request, params }: ActionArgs) {
    if (!params.websiteId) {
        throw new Response("Not Found", { status: 404 });
    }
    const website = await getWebsite(params.websiteId);
    if (!website?.bikes_list_pages || website.bikes_list_pages.length === 0) {
        throw new Response("Not Found", { status: 404 });
    }

    const $ = cheerio.load(website.bikes_list_pages[0]);

    const computed_bikes = Array.from($('div.product-list > div.vtmn-flex')).map(e => ({
        source: (new URL(Array.from($('a.dpb-product-model-link', e))[0].attribs.href, new URL(website.base_url).origin)).href,
        product_name: $('a.dpb-product-model-link span', e).text(),
    })).filter(e => !e.product_name.toLowerCase().includes('reconditionné'))
    console.log(
        {computed_bikes},
    )

    const res = await createBikes(computed_bikes);
    console.log(res)
    return redirect(`/admin/websites`);
}