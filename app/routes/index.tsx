import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

// MODELS
import { Bike, getBikeListItems } from "~/models/bikes.server";
import { BikeFilters, BikeFilterType, getDefaultValue } from "~/models/bikes";

// UI
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";

import RangeFilter from "~/ui/RangeFilter";
import EnumFilter from "~/ui/EnumFilter";
import BooleanFilter from "~/ui/BooleanFilter";

type LoaderData = {
  bikeListItems: Bike[];
};

export async function loader({ request }: LoaderArgs) {
    const url = new URL(request.url);
    const searchFields = Object.fromEntries(
      Object.entries(BikeFilters).map(([key, value]) => {
        const urlValue = url.searchParams.getAll(key);
        return [key, urlValue.length ? urlValue : getDefaultValue(BikeFilters[key]).map(v => v.toString())];
      })
    );

    const bikeListItems = await getBikeListItems(searchFields);

    return json({ bikeListItems });
};

export default function BikesPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
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
                          name={key}
                          description={value}
                      />;
                    case BikeFilterType.ENUM:
                      return <EnumFilter
                          name={key}
                          description={value}
                      />;
                    case BikeFilterType.BOOLEAN:
                      return <BooleanFilter
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
                    left_footer={bike.battery_life + "km"}
                    right_footer={""} />
                </Grid>
              ))
            )}
          </Grid>
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
