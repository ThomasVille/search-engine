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
            <div className="flex flex-col lg:flex-row">
                <img
                    src={data.bike.pictures[0]}
                    loading="lazy"
                    alt={`Illustration du vélo ${data.bike.product_name}`}
                    className="w-full lg:w-96 h-96 lg:mr-4 object-cover"
                />
                <div className="lg:flex lg:flex-col p-4 lg:flex-grow">
                    <div className="flex justify-between font-bold text-2xl lg:flex-col">
                        <div className="flex flex-col">
                            <span>{data.bike.product_name}</span>
                            <span className="text-base text-gray-500">{data.bike.brand}</span>
                        </div>
                        <span>{data.bike.price + "€"}</span>
                    </div>
                    <div className="flex divide-x-2 justify h-20">
                        <div className="basis-1/3 flex justify-center m-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                            </svg>
                            <div className="pl-2">
                                {data.bike.battery_life + " km"}
                            </div>
                        </div>
                        <div className="basis-1/3 flex justify-center m-auto items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            <div className="pl-2 flex flex-col">
                                <div>{data.bike.torque + " nm"}</div>
                                <div className="text-sm text-gray-500">{(BikeFilters.motor_kind as EnumFilter).options.find(o => o.value === data.bike.motor_kind)?.label}</div>
                            </div>
                        </div>
                        <div className="basis-1/3 flex justify-center m-auto items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
                            </svg>
                            <div className="pl-2 w-16">
                                {data.bike.removable_battery ? "Batterie amovible" : "Batterie fixe"}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold text-xl">Revendeurs</div>
                        <a href={data.bike.source || ''}>Revendeur 1</a>
                    </div>
                </div>
            </div>
        </div>
    );
}