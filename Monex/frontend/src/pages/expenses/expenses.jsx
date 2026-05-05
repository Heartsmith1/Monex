import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
export function Expenses() {





    return (

        <div>
            <div className="contenedor_Expenses">
                <SideBar />

                <div className="contenido_Expenses">
                    <Navbar />
                    <div className="contenedor_filtros_expenses">
                        <h1>helo</h1>
                    </div>

                    <div className="tabla_expenses">
                        <h1>helo</h1>
                    </div>
                </div>
            </div>
        </div>





    )
}