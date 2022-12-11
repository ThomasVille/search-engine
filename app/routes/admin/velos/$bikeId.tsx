import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import * as cheerio from 'cheerio';

// MODELS
import { getBike } from "~/models/bikes.server";
import { ebikes } from "@prisma/client";

type LoaderData = {
    bike: ebikes;
};

function findTextRecursively(text: string, node: any): string | undefined {
    if (!('children' in node) || !Array.isArray(node.children)) return;

    for (let child of Array.from<any>(node.children)) {
        if ('data' in child && child.data.indexOf(text) != -1)
            return child.data;
        else if ('children' in child) {
            let found = findTextRecursively(text, child);

            if (found) {
                return found;
            }
        }
    }
}

export async function loader({ params }: LoaderArgs) {
    if (!params.bikeId) {
        throw new Response("Not Found", { status: 404 });
    }
    const bike = await getBike(params.bikeId);

    return json({ bike });
};

export default function BikesPage() {
    const data = useLoaderData<typeof loader>() as LoaderData;
    const navigate = useNavigate();

    let $;
    let computed_images: string[] = [];
    let computed_battery_life: number = 0;

    if (data.bike.source_page)
        $ = cheerio.load(data.bike.source_page);

    if ($) {
        computed_images = Array.from($('.slides .fluid img')).map(e => e.attribs.src).filter(v => v.indexOf('data:image') === -1)
        console.log(
            Array.from($('.tech-info')).map(e => findTextRecursively('km', e)).filter(e => e)
        )
    }
    return (
        <div className="w-full">
            <div className="p-2 lg:pl-0 flex cursor-pointer" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>Recherche</span>
            </div>
            <form method="post" action={`/admin/velos/update/${data.bike.id}`}>
                <button type="submit">Récupérer la page</button>
            </form>
            <div className="table w-full border mt-4">
                <div className="table-header-group border bg-slate-100">
                    <div className="table-row">
                        <div className="table-cell">
                            Caractéristique
                        </div>
                        <div className="table-cell w-1/3">
                            Valeur stockée
                        </div>
                        <div className="table-cell w-1/3">
                            Valeur calculée
                        </div>
                    </div>
                </div>
                <div className="table-row-group border">
                    <div className="table-row">
                        <div className="table-cell">
                            Nom du produit
                        </div>
                        <div className="table-cell w-1/3">
                            {data.bike.product_name}
                        </div>
                        <div>
                            {
                                $ ? (
                                    $.text($('.product-main-infos .product-summary h1'))
                                ) : <span>Pas de valeur</span>
                            }
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Source
                        </div>
                        <div className="table-cell w-1/3">
                            <a href={data.bike.source || undefined}>{data.bike.source}</a>
                        </div>
                        <div>
                            <span>Pas de valeur</span>
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Images
                        </div>
                        <div className="table-cell w-1/3">
                            {
                                data.bike.pictures ? (
                                    data.bike.pictures.map(p => (
                                        <img className="w-40 h-40 object-cover" key={p} src={p} />
                                    ))
                                ) : null
                            }
                        </div>
                        <div>
                            {
                                computed_images.length > 0 ? (
                                    computed_images.map(p => (
                                        <img className="w-40 h-40 object-cover" key={p} src={p} />
                                    ))
                                ) : null
                            }
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Autonomie
                        </div>
                        <div className="table-cell w-1/3">
                            {data.bike.battery_life}
                        </div>
                        <div>
                            {
                                $ ? (
                                    null//cheerio.text($('.product-main-infos .product-summary h1'))
                                ) : <span>Pas de valeur</span>
                            }
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Code source
                        </div>
                        <div className="table-cell w-1/3">
                            <textarea className="w-full h-20" onChange={() => { }} value={data.bike.source_page || undefined}></textarea>
                        </div>
                        <div>
                            <span>Pas de valeur</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}