import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

// MODELS
import { getBike } from "~/models/bikes.server";
import { BikeFilters, EnumFilter } from '~/models/bikes';
import { ebikes } from "@prisma/client";

type LoaderData = {
    bike: ebikes;
};

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

    return (
        <div className="w-full">
            <div className="p-2 lg:pl-0 flex cursor-pointer" onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>Recherche</span>
            </div>
            <form method="post" action={`/admin/velos/update/${data.bike.id}`}>
                <button type="submit">Récupérer infos</button>
            </form>
            <div className="table w-full border mt-4">
                <div className="table-header-group border bg-slate-100">
                    <div className="table-row">
                        <div className="table-cell">
                            Caractéristique
                        </div>
                        <div className="table-cell">
                            Valeur
                        </div>
                    </div>
                </div>
                <div className="table-row-group border">
                    <div className="table-row">
                        <div className="table-cell">
                            Nom du produit
                        </div>
                        <div className="table-cell">
                            {data.bike.product_name}
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Images
                        </div>
                        <div className="table-cell">
                            {data.bike.pictures}
                        </div>
                    </div>
                    <div className="table-row">
                        <div className="table-cell">
                            Autonomie
                        </div>
                        <div className="table-cell">
                            {data.bike.battery_life}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}