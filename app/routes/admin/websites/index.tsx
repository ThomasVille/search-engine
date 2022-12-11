
import { Button } from '@mui/joy';
import { websites } from '@prisma/client';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { getWebsites } from '~/models/websites.server';

type LoaderData = {
    websites: websites[] | null
};

export async function loader() {
    const websites = await getWebsites();

    return json({ websites });
};

export default function AdminWebsitesPage() {
    const data = useLoaderData<typeof loader>() as LoaderData;

    return (
        <div className='p-4 w-full'>
            <Link to={'/admin/websites/add'}>
                <Button variant="solid" className="w-40">
                    Ajouter
                </Button>
            </Link>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Nom du site</th>
                        <th>URL</th>
                        <th>Récupérer la liste des vélos</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.websites ? data.websites.map(website => (
                            <tr>
                                <td>{website.name}</td>
                                <td>{website.base_url}</td>
                                <td className='text-center'>
                                    <Form method="post" action={`/admin/websites/${website.id}/fetch-bikes`}>
                                        <Button variant="soft" className="w-40" type="submit">Récupérer</Button>
                                    </Form>
                                </td>
                            </tr>
                        )) : 'Aucun site web'
                    }
                </tbody>
            </table>


        </div>
    )
}