import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit, useSearchParams } from "@remix-run/react";
import React, { useCallback } from 'react';
import { debounce } from 'lodash';

// MODELS
import type { Bike } from "~/models/bikes.server";
import { getBikeListItems } from "~/models/bikes.server";

// UI
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/material/Grid';
import OverflowCard from "~/ui/OverflowCard";

import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Switch from '@mui/joy/Switch';

type LoaderData = {
  bikeListItems: Bike[];
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const default_battery_life: number[] = url.searchParams.getAll("battery_life").map(v => +v);
  const default_motor_kind = url.searchParams.getAll("motor_kind");
  const default_integrated_lights = url.searchParams.getAll("integrated_lights");

  const bikeListItems = await getBikeListItems(
    default_battery_life.length ? default_battery_life : [0, 200],
    default_motor_kind.length ? default_motor_kind : ["rear", "center", "front"],
    default_integrated_lights.length ? default_integrated_lights : ["true", "false"],
  );

  return json({ bikeListItems });
};

function valueText(value: number) {
  return `${value}km`;
}

export default function BikesPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const default_battery_life = searchParams.getAll("battery_life").map(v => +v);
  const default_motor_kind = searchParams.getAll("motor_kind");
  const default_integrated_lights = searchParams.getAll("integrated_lights");
  const [value, setValue] = React.useState<number[]>(default_battery_life.length ? default_battery_life : [0, 200]);

  const debouncedSubmit = useCallback(
    debounce((target: any, options: any) => submit(target, options), 250),
    [],
  );

  const handleBatteryLifeChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    debouncedSubmit(document.forms[0], { replace: true });
  };

  const [motorKind, setMotorKind] = React.useState(default_motor_kind.length ? default_motor_kind : ["rear", "center", "front"]);

  const handleMotorKindChange = (checkedMotorKind: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.checked) {
      setMotorKind([...new Set(motorKind.concat(checkedMotorKind))]);
    } else {
      setMotorKind(motorKind.filter(v => v !== checkedMotorKind));
    }
    debouncedSubmit(document.forms[0], { replace: true });
  }

  const [integratedLights, setIntegratedLights] = React.useState(default_integrated_lights.length ? default_integrated_lights : ["true", "false"]);

  const handleIntegratedLightsChange = (checkedIntegratedLights: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.checked) {
      setIntegratedLights([...new Set(integratedLights.concat(checkedIntegratedLights))]);
    } else {
      setIntegratedLights(integratedLights.filter(v => v !== checkedIntegratedLights));
    }
    debouncedSubmit(document.forms[0], { replace: true });
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <hr />
          <div className="flex-1 p-6">
            <Form method="get">
              <Typography id="battery-life-group" level="body1" fontWeight="lg" mb={1} style={{ marginBottom: "2rem" }}>
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
              <Typography id="motor-kind-group" level="body1" fontWeight="lg" mb={1}>
              Type de moteur
              </Typography>
              <Box role="group" aria-labelledby="motor-kind-group">
                <List size="sm">
                  <ListItem>
                    <Checkbox name="motor_kind" value="rear" label="Roue Arrière" checked={motorKind.includes("rear")} onChange={handleMotorKindChange("rear")}/>
                  </ListItem>
                  <ListItem>
                    <Checkbox name="motor_kind" value="center" label="Pédalier" checked={motorKind.includes("center")} onChange={handleMotorKindChange("center")}/>
                  </ListItem>
                  <ListItem>
                    <Checkbox name="motor_kind" value="front" label="Roue Avant" checked={motorKind.includes("front")} onChange={handleMotorKindChange("front")}/>
                  </ListItem>
                </List>
              </Box>
              <Typography id="integrated-lights-group" level="body1" fontWeight="lg" mb={1}>
              Lumières intégrées
              </Typography>
              <Box role="group" aria-labelledby="integrated-lights-group">
                <List size="sm">
                  <ListItem>
                    <Checkbox name="integrated_lights" value="true" label="Oui" checked={integratedLights.includes("true")} onChange={handleIntegratedLightsChange("true")}/>
                  </ListItem>
                  <ListItem>
                    <Checkbox name="integrated_lights" value="false" label="Non" checked={integratedLights.includes("false")} onChange={handleIntegratedLightsChange("false")}/>
                  </ListItem>
                </List>
              </Box>
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
