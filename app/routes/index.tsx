import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit, useSearchParams } from "@remix-run/react";
import React, { useCallback } from 'react';
import {debounce} from 'lodash';

// MODELS
import type { Bike } from "~/models/bikes.server";
import { getBikeListItems } from "~/models/bikes.server";

// UI
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";

type LoaderData = {
  bikeListItems: Bike[];
};

export async function loader ({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const battery_life: number[] = url.searchParams.getAll("battery_life").map(v => +v);

  const bikeListItems = await getBikeListItems(battery_life.length ? battery_life : [0, 200]);

  return json({ bikeListItems });
};

export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const battery_life: number[] = url.searchParams.getAll("battery_life").map(v => +v);

  return json(await getBikeListItems(battery_life.length ? battery_life : [0, 200]));
};

function valueText(value: number) {
  return `${value}km`;
}

export default function BikesPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const battery_life = searchParams.getAll("battery_life").map(v => +v);
  const [value, setValue] = React.useState<number[]>(battery_life.length ? battery_life : [0, 200]);

  const debouncedSubmit = useCallback(
		debounce((target: any, options: any) => submit(target, options), 250),
		[],
	);

  const handleBatteryLifeChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    debouncedSubmit(document.forms[0], { replace: true });
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <hr />
          <div className="flex-1 p-6">
            <Form method="get">
              <Typography style={{marginBottom: "2rem"}}>
                Autonomie
              </Typography>
              <Slider
                name="battery_life"
                getAriaLabel={() => 'Autonomie'}
                value={value}
                onChange={handleBatteryLifeChange}
                valueLabelDisplay="on"
                valueLabelFormat={valueText}
                getAriaValueText={valueText}
                min={0}
                max={200}
              />
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
