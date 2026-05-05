import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";


export function Expenses() {





    return (

        <div className="contenedor_expenses">
            <SideBar />

            <div className="contenido_expenses">
                <Navbar />

                <div className="layout_expenses">
                    <form action="POST">
                        <input className="buscar_gasto_nombre" type="text" />

                        <input className="buscar_gasto_fecha" type="text" />

                        <input className="select_gasto" type="text" />

                    </form>
                </div>
                
                <div class="tabla_expeses">

                    <table>
                        <thead className="nav_tabla_gastos">
                            <tr>
                                
                                <th>Nombre</th>
                                <th>Fecha de ingreso</th>
                                <th>Metodo de pago</th>
                                <th>Monto</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>

                            </tr>
                        </thead>
                        <tbody className="body_tabla_gastos">

                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>

                        </tbody>
                    </table>
                </div>

            </div>
        </div>

    )
}