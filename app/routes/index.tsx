import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

// MODELS
import { Bike, getBikeListItems } from "~/models/bikes.server";
import { BikeFilterDescription, BikeFilterType } from "~/models/bikes";

// UI
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";

import RangeFilter from "~/ui/RangeFilter";
import EnumFilter from "~/ui/EnumFilter";

type LoaderData = {
  bikeListItems: Bike[];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const default_battery_life: number[] = url.searchParams.getAll("battery_life").map(v => +v);
  const default_motor_kind = url.searchParams.getAll("motor_kind");
  const default_integrated_lights = url.searchParams.getAll("integrated_lights");

  const bikeListItems = await getBikeListItems(
    default_battery_life.length ? default_battery_life : BikeFilterDescription.battery_life.defaultValue,
    default_motor_kind.length ? default_motor_kind : BikeFilterDescription.motor_kind.defaultValue,
    default_integrated_lights.length ? default_integrated_lights : BikeFilterDescription.integrated_lights.defaultValue,
  );

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
                Object.entries(BikeFilterDescription).map(([key, value]) => {
                  switch (value.type) {
                    case BikeFilterType.RANGE:
                      return <RangeFilter
                        label={value.label}
                        dbName={key}
                        unit="km"
                        defaultValue={value.defaultValue}
                        min={Math.min(...value.range)}
                        max={Math.max(...value.range)}
                      />;
                    case BikeFilterType.ENUM:
                      return <EnumFilter
                        label={value.label}
                        dbName={key}
                        defaultValue={value.defaultValue}
                        options={value.options}
                      />;
                    case BikeFilterType.BOOLEAN:
                      return <EnumFilter
                        label={value.label}
                        dbName={key}
                        defaultValue={value.defaultValue}
                        options={[
                          {
                            label: "Oui",
                            value: "true",
                          },
                          {
                            label: "Non",
                            value: "false",
                          },
                        ]}
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
