import { ActionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";

// MODELS
import { getBike } from "~/models/bikes.server";
import { BikeFilters, EnumFilter } from '~/models/bikes';
import { ebikes } from "@prisma/client";

export async function action({ request, params }: ActionArgs) {
    if (!params.bikeId) {
        throw new Response("Not Found", { status: 404 });
    }
    const bike = await getBike(params.bikeId)
    let page
    if (!bike?.source) {
        throw new Response("Not Found", { status: 404 });
    }
    try {
        page = await axios.get(bike.source)
    } catch(e) {
        console.error('error while fetching the page', e)
        throw new Response("Not Found", { status: 404 });
    }
    console.log('fetching the page of the bike', page);
    return redirect(`/admin/velos/${params.bikeId}`);
  }