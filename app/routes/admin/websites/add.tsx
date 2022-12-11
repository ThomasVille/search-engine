import { Button, TextField } from "@mui/joy";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import axios from "axios";
import invariant from "tiny-invariant";
import { createWebsite } from "~/models/websites.server";

type ActionData =
  | {
        name: null | string;
        base_url: null | string;
        bikes_list_selector: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({
    request,
  }) => {
    const formData = await request.formData();

    const name = formData.get("name");
    const base_url = formData.get("base_url");
    const bikes_list_selector = formData.get("bikes_list_selector");

    const errors: ActionData = {
        name: name ? null : "Le nom du site est requis",
        base_url: base_url ? null : "L'URL du site est requise",
        bikes_list_selector: bikes_list_selector ? null : "Le code de sélection des vélos est requis.",
    };
    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    );

    if (hasErrors) {
        return json<ActionData>(errors);
    }

    invariant(
        typeof name === "string",
        "name must be a string"
    );
    invariant(
        typeof base_url === "string",
        "base_url must be a string"
    );
    invariant(
        typeof bikes_list_selector === "string",
        "bikes_list_selector must be a string"
    );

    let page;
    try {
        page = await axios.get(base_url);
    } catch(e) {
        console.error('error while fetching the page', e);
        throw new Response("Not Found", { status: 404 });
    }

    await createWebsite({ name, base_url, bikes_list_selector, bikes_list_pages: [page.data] });

    return redirect("/admin/websites");
};

export default function AdminWebsitesAddPage() {
    const errors = useActionData<ActionData>();

    return (
        <div className='p-4'>
            <Form method="post" action="/admin/websites/add">
                <TextField required name="name" label="Nom du site" helperText={errors?.name} error={!!errors?.name}/>
                <TextField required name="base_url" label="URL" helperText={errors?.base_url} error={!!errors?.base_url}/>
                <TextField required name="bikes_list_selector" label="Code de sélection des vélos" helperText={errors?.bikes_list_selector} error={!!errors?.bikes_list_selector}/>
                <Button variant="solid" className="w-40" type="submit">
                    Ajouter
                </Button>
            </Form>
        </div>
    )
}