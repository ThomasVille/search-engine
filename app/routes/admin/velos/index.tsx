import { ebikes } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBikeListItems } from "~/models/bikes.server";

type LoaderData = {
    bikeListItems: ebikes[];
};

export async function loader({ request }: LoaderArgs) {
    const { data: bikeListItems } = await getBikeListItems(0, {}, 'price.asc');

    return json({ bikeListItems });
};

export default function AdminBikesPage() {
    const data = useLoaderData<typeof loader>() as LoaderData;

    return <div className="divide-y">
        {(!data.bikeListItems || data.bikeListItems.length === 0) ? (
            <p className="p-4">Aucun vélo ne correspond à ces critères</p>
        ) : (
            data.bikeListItems.map((bike) => (
                <a href={`/velos/${bike.id}`} className="block">
                    <div key={bike.id} className="flex h-24 p-2 items-stretch w-screen">
                        <img
                            src={bike.pictures[0]}
                            loading="lazy"
                            alt={`Illustration du vélo ${bike.product_name}`}
                            className="w-20 h-20"
                        />
                        <div className="flex flex-col pl-2 flex-grow overflow-hidden">
                            <div className="font-bold w-full text-ellipsis overflow-hidden whitespace-nowrap">{bike.product_name}</div>
                            <h5>{bike.brand}</h5>
                            <div className="flex justify-between">
                                <p>{bike.battery_life + "km"}</p>
                                <p className="font-bold text-gray-500">{bike.price + "€"}</p>
                            </div>
                        </div>
                    </div>
                </a>
            ))
        )}
    </div>;
}