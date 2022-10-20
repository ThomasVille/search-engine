import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData, useSubmit, useSearchParams } from "@remix-run/react";
import React, { useCallback } from 'react';
import {debounce} from 'lodash';
import invariant from "tiny-invariant";

import type { Bike } from "~/models/bikes.server";
import { getBikeListItems } from "~/models/bikes.server";
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

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
		debounce((target: any, options: any) => submit(target, options), 500),
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
          <Outlet />
          {(!data.bikeListItems || data.bikeListItems.length === 0) ? (
              <p className="p-4">Pas de vélos</p>
            ) : (
              <ol>
                {data.bikeListItems.map((bike) => (
                  <li key={bike.id}>
                    <a href={bike.source}>
                      {bike.pictures && bike.pictures.length > 0 ? <img className="inline-block w-40" src={bike.pictures[0]}/> : ''} {bike.product_name}
                    </a>
                  </li>
                ))}
              </ol>
            )}
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
