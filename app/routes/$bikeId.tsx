import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { Bike } from "~/models/bikes.server";
import { getBike } from "~/models/bikes.server";
import invariant from "tiny-invariant";

type LoaderData = {
  note: Bike;
};

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.bikeId, "bikeId not found");

  const note = await getBike({ id: params.bikeId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.bikeId, "bikeId not found");

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.product_name}</h3>
      <p className="py-6">Description</p>
      <hr className="my-4" />
    </div>
  );
}
