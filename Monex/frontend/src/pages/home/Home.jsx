import { SideBar } from "../../components/SideBar/SideBar";

export function Home() {
    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <h1>Home</h1>
            </div>
        </div>
    );
}