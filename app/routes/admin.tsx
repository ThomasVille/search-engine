import { Link, Outlet } from "@remix-run/react";

export default function BikesPage() {
    return (
        <div className="lg:container lg:mx-auto">
            <Header />
            <main className="py-14 lg:p-0 flex h-full bg-white">
                <Outlet></Outlet>
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
