import { Link, NavLink, Outlet } from "@remix-run/react";

export default function BikesPage() {
    return (
        <div className="lg:container lg:mx-auto">
            <Header />
            <main className="py-14 lg:p-0 flex h-full bg-white">
                <div className="flex flex-col gap-2 bg-gray-50 h-full w-80">
                    <NavLink
                        to={'/admin/websites'}
                        className={({ isActive }) =>
                            isActive ? "bg-gray-200" : undefined
                            }
                        >
                        <div className="w-full h-10 text-left flex items-center p-4 text-xl">
                            Sites web
                        </div>
                    </NavLink>

                    <NavLink
                        to={'/admin/velos'}
                        className={({ isActive }) =>
                            isActive ? "bg-gray-200" : undefined
                            }
                        >
                        <div className="w-full h-10 text-left flex items-center p-4 text-xl">
                            Vélos
                        </div>
                    </NavLink>
                </div>
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
