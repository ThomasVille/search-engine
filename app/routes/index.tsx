import React, { useCallback } from 'react';
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import useMediaQuery from '@mui/material/useMediaQuery';

// MODELS
import { Bike, getBikeListItems } from "~/models/bikes.server";
import { BikeFilters, getDefaultValue, NB_ELEMENTS_PER_PAGE } from "~/models/bikes";

// UI
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import SortMenu from "~/ui/SortMenu";
import { Box } from "@mui/joy";
import { debounce } from 'lodash';
import FilterMenu from '~/ui/FilterMenu';

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
    const sortField: string = url.searchParams.get("sort") || 'price';

    const { data: bikeListItems, count } = await getBikeListItems(page - 1, searchFields, sortField);

    return json({ bikeListItems, count });
};

export default function BikesPage() {
    const data = useLoaderData<typeof loader>() as LoaderData;
    const location = useLocation();
    const submit = useSubmit();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);
    const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
    const [sortField, setSortField] = React.useState(query.get('sort') || 'price');
    const debouncedSubmit = useCallback(
        debounce((target: any, options: any) => submit(target, options), 250),
        [],
    );

    const handleSetSortField = (value: string) => {
        setSortField(value);
        debouncedSubmit(document.forms[0], { replace: true });
    }

    const totalNbResults = data.count || 0;
    return (
        <div className="lg:container lg:mx-auto">
            <Header />
            <main className="py-14 lg:p-0 flex h-full bg-white">
                <div className="flex">
                    {
                        isDesktop ?
                        <FilterMenu sortField={sortField} /> : null
                    }

                    <div className="p-0 flex-1 flex-col lg:p-4">
                        {
                            isDesktop ? (
                                <Box className="flex flex-row pb-4">
                                    <Box className="pr-4"><SortMenu selected={sortField} setSelected={handleSetSortField} /></Box>
                                </Box>
                            ) : null
                        }
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
                </div>
                {
                    isDesktop ? null : (
                        <div className="fixed bottom-0 left-0 w-full flex items-center h-12 justify-evenly bg-slate-800">
                            <FilterMenu sortField={sortField} />
                            <SortMenu selected={sortField} setSelected={handleSetSortField} />
                        </div>
                    )
                }
            </main>
        </div>
    );
}

function Header() {
    return (
        <header className="fixed lg:relative w-full z-20 flex items-center justify-between bg-slate-800 p-4 text-white h-14">
            <h1 className="text-3xl font-bold">
                <Link to="/">Vélos électriques</Link>
            </h1>
        </header>
    );
}
