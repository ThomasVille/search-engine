import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useLocation } from "@remix-run/react";

// MODELS
import { Bike, getBikeListItems } from "~/models/bikes.server";
import { BikeFilters, BikeFilterType, getDefaultValue, NB_ELEMENTS_PER_PAGE } from "~/models/bikes";

// UI
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import RangeFilter from "~/ui/RangeFilter";
import EnumFilter from "~/ui/EnumFilter";
import BooleanFilter from "~/ui/BooleanFilter";

type LoaderData = {
    bikeListItems: Bike[];
    count: number | null;
};

export async function loader({ request }: LoaderArgs) {
    const url = new URL(request.url);
    const searchFields = Object.fromEntries(
        Object.entries(BikeFilters).map(([key, value]) => {
            const urlValue = url.searchParams.getAll(key);
            return [key, urlValue.length ? urlValue : getDefaultValue(BikeFilters[key]).map(v => v.toString())];
        })
    );

    const page: number = parseInt(url.searchParams.get("page") || '1', 10);

    const { data: bikeListItems, count } = await getBikeListItems(page - 1, searchFields);

    return json({ bikeListItems, count });
};

export default function BikesPage() {
    const data = useLoaderData<typeof loader>() as LoaderData;
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);

    const totalNbResults = data.count || 0;
    return (
        <div className="container mx-auto">
            <Header />
            <main className="flex h-full bg-white">
                <div className="h-full w-80 border-r bg-gray-50">
                    <hr />
                    <div className="flex-1 p-6">
                        <Form method="get">
                            {
                                Object.entries(BikeFilters).map(([key, value]) => {
                                    switch (value.type) {
                                        case BikeFilterType.RANGE:
                                            return <RangeFilter
                                                key={key}
                                                name={key}
                                                description={value}
                                            />;
                                        case BikeFilterType.ENUM:
                                            return <EnumFilter
                                                key={key}
                                                name={key}
                                                description={value}
                                            />;
                                        case BikeFilterType.BOOLEAN:
                                            return <BooleanFilter
                                                key={key}
                                                name={key}
                                                description={value}
                                            />;
                                    }
                                })
                            }
                        </Form>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <Grid container spacing={1}>
                        {(!data.bikeListItems || data.bikeListItems.length === 0) ? (
                            <p className="p-4">Aucun vélo ne correspond à ces critères</p>
                        ) : (
                            data.bikeListItems.map((bike) => (
                                <Grid item key={bike.id}>
                                    <OverflowCard
                                        img={bike.pictures[0]}
                                        link={bike.source}
                                        title={bike.product_name}
                                        subtitle={bike.brand}
                                        left_footer={bike.price + "€"}
                                        right_footer={bike.battery_life + "km"} />
                                </Grid>
                            ))
                        )}
                    </Grid>
                    {
                        (totalNbResults <= NB_ELEMENTS_PER_PAGE && totalNbResults > 0) ?
                        <p className="pt-5" style={{ textAlign: "center" }}>Fin des résultats !</p> :
                        <Pagination
                            page={page}
                            count={Math.ceil((totalNbResults || 0) / NB_ELEMENTS_PER_PAGE)}
                            className="pt-5"
                            sx={{ ul: { justifyContent: "center" }}}
                            renderItem={(item) => {
                                const query = new URLSearchParams(location.search);
                                query.set('page', item.page ? item.page.toString() : '');

                                return <PaginationItem
                                    component={Link}
                                    to={`/?${query.toString()}`}
                                    {...item}
                                />;
                            }}
                        />
                    }

                </div>
            </main>
        </div>
    );
}

function Header() {
    return (
        <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
            <h1 className="text-3xl font-bold">
                <Link to=".">Vélos électriques</Link>
            </h1>
        </header>
    );
}
