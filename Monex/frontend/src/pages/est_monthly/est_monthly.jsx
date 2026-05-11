import { useState, useEffect } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import alertaMensualIcon from "../../assets/icon/Alerta_mensual.png";
import "../../css/pages/est_monthly.css";

export function EstMensual() {
  const [estimaciones, setEstimaciones] = useState({
    totalEstimado: 1180000,
    comprasConTarjeta: 14,
    meses: [
      { mes: "Abril", monto: 250000 },
      { mes: "Mayo", monto: 480000 },
      { mes: "Junio", monto: 450000 }
    ],
    pagosEstimados: [
      { mes: "Abril", monto: 300000 },
      { mes: "Mayo", monto: 420000 },
      { mes: "Junio", monto: 380000 }
    ],
    detallesPagos: [
      { nombre: "Medicamento", monto: 100000, cuotas: 4, pagoEstimado: 25000 },
      { nombre: "Supermercado", monto: 92000, cuotas: 2, pagoEstimado: 46000 },
      { nombre: "Restaurante", monto: 65000, cuotas: 6, pagoEstimado: 10833 }
    ],
    deudaTotal: 850000,
    pagoMes: 350000,
    cuotasPendientes: 54
  });

  const maxMonto = Math.max(...estimaciones.pagosEstimados.map(p => p.monto));

  return (
    <div className="est_mensual_layout">
      <SideBar />
      <Navbar />
      <div className="contenedor_est_mensual">
        <div className="est_header">
          <h1>Estimación Mensual</h1>
          <p className="est_descripcion">Aqui puedes ver una estimación de los pagos mensuales de tu tarjeta de crédito basado en tus gastos registrados</p>
        </div>

        <div className="est_content">
          <div className="est_main">
            {/* Sección Estimación Mensual */}
            <div className="est_card">
              <div className="est_card_header">
                <h2 className="est_card_title">Estimación Mensual</h2>
              </div>

              <div className="est_card_body">
                <div className="est_monto">
                  <span className="monto_valor">${estimaciones.totalEstimado.toLocaleString()}</span>
                  <p className="monto_texto">Basado en {estimaciones.comprasConTarjeta} compras con tarjeta de crédito</p>
                </div>
                <div className="est_progress_bar"></div>

                <div className="est_meses">
                  {estimaciones.meses.map((item, index) => (
                    <div key={index} className="mes_item">
                      <span className="mes_monto">${item.monto.toLocaleString()}</span>
                      <span className="mes_nombre">{item.mes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección Detalles de Próximos Pagos */}
            <div className="est_table_card">
              <h2>Detalles de los Próximos Pagos</h2>
              <table className="est_table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Monto</th>
                    <th>Cuotas</th>
                    <th>Pago Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {estimaciones.detallesPagos.map((pago, index) => (
                    <tr key={index}>
                      <td>{pago.nombre}</td>
                      <td>${pago.monto.toLocaleString()}</td>
                      <td>{pago.cuotas}</td>
                      <td>${pago.pagoEstimado.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección Derecha */}
          <div className="est_sidebar">
            {/* Gráfico de Barras */}
            <div className="est_chart_card">
              <h2>Pagos Mensuales Estimados</h2>
              <div className="est_chart">
                <div className="chart_axis">
                  {estimaciones.pagosEstimados.map((pago, index) => (
                    <span key={index} className="chart_axis_label">${pago.monto.toLocaleString()}</span>
                  ))}
                </div>

                <div className="chart_plot">
                  {estimaciones.pagosEstimados.map((pago, index) => (
                    <div key={index} className="chart_bar_container">
                      <div
                        className="chart_bar"
                        style={{ height: `${(pago.monto / maxMonto) * 100}%` }}
                      ></div>
                      <span className="chart_label">{pago.mes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="est_resumen">
              <div className="resumen_item">
                <span className="resumen_label">Deuda en total:</span>
                <span className="resumen_valor">${estimaciones.deudaTotal.toLocaleString()}</span>
              </div>
              <div className="resumen_item">
                <span className="resumen_label">Pago estimado del mes:</span>
                <span className="resumen_valor">${estimaciones.pagoMes.toLocaleString()}</span>
              </div>
              <div className="resumen_item">
                <span className="resumen_label">Total de cuotas pendientes:</span>
                <span className="resumen_valor">{estimaciones.cuotasPendientes}</span>
              </div>
            </div>

            {/* Alerta */}
            <div className="est_alerta">
              <img className="alerta_icono" src={alertaMensualIcon} alt="Alerta mensual" />
              <span className="alerta_texto">La deuda y el pago mensual son estimaciones basadas en los gastos ingresados, ya que el sistema no se conecta con entidades bancarias.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}