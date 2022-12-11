import { Button } from "@mui/joy";
import { ebikes } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBikeListItems } from "~/models/bikes.server";
import { Else, If, Then } from "~/ui/If";
import { Map } from "~/ui/Map";

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
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th>Nom du produit</th>
                    <th>URL</th>
                    <th>Récupérer les infos</th>
                </tr>
            </thead>
            <tbody>
                <If when={!!data.bikeListItems}>
                    <Then>
                        <Map array={data.bikeListItems}>
                            {(bike: ebikes) => (
                                <tr key={bike.id}>
                                    <td>{bike.product_name}</td>
                                    <td>{bike.source}</td>
                                    <td className='text-center'>
                                            <Button variant="soft" className="w-40" type="submit">Récupérer</Button>
                                    </td>
                                </tr>
                            )}
                        </Map>
                    </Then>
                    <Else>
                        Aucun vélo
                    </Else>
                </If>
            </tbody>
        </table>
    </div>;
}