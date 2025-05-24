document.addEventListener("DOMContentLoaded", () => {  
    const modal = document.getElementById("modal");
    const addModal = document.getElementById("addModal");
    const modifModal = document.getElementById("modifModal");
    const insumosContainer = document.getElementById("tableBody");
    const modifNombre = document.getElementById("modifNombre");
    const modifCampo = document.getElementById("modifCampo");
    const inputsModif = document.getElementById("inputsModif");
    const modifInsumosRecetaModal = document.getElementById('modifInsumosRecetaModal');
    const recetaSelect = document.getElementById("recetaSelect");
    const insumoRecetaContainer = document.getElementById("insumoRecetaContainer");
    const btnAgregarNuevoInsumo = document.getElementById("btnAgregarNuevoInsumo");
    const btnAceptarModifInsumo = document.getElementById("btnAceptarModifInsumo");
    const floatingButton = document.getElementById("floatingButton");
    const floatingMenu = document.getElementById("floatingMenu");
    
    const btnAgregarInsumosRecetas = document.getElementById("btnAgregarInsumosRecetas");
    const modalVentas = document.getElementById("modalVentas");
    const btnCaja = document.getElementById("btnCaja");
    const closeModalVentas = document.getElementById("closeModalVentas");
    const fechaDesde = document.getElementById("fechaDesde");
    const fechaHasta = document.getElementById("fechaHasta");
    const btnFiltrarVentas = document.getElementById("btnFiltrarVentas");
    const ventasTableBody = document.getElementById("ventasTableBody");
    const totalVentas = document.getElementById("totalVentas");
    const verVenta = document.getElementById('verVenta');
    const addVenta = document.getElementById('addVenta');
    const btnAgregarVenta = document.getElementById("btnAgregarVenta");
    const btnAgregarDetalle = document.getElementById("btnAgregarDetalle");
    const ventaTableBody = document.getElementById("ventaTableBody");
    btnAgregarDetalle.addEventListener("click", agregarVentaATabla);
    const fechaVenta = document.getElementById('fechaVenta');
    const confirmarEliminarVentaModal = document.getElementById("confirmarEliminarVentaModal");
    const modalReportes = document.getElementById("modalReportes");
    const modalClientes = document.getElementById('modalClientes');
    const modalPedidos = document.getElementById("modalPedidos");
    const modalAnalisis = document.getElementById("modalAnalisis");
    const btnConfirmarAnalisis = document.getElementById("btnConfirmarAnalisis");
    const alertaInsumos = document.getElementById("alertaInsumos")

    //TODO ESTO ES MODULO VENTAS
    verVenta.style.display = "none";
    confirmarEliminarVentaModal.style.display = "none";
    

    // ✅ Establecer fechas por defecto al día actual
    const hoy = new Date().toISOString().split("T")[0];
    fechaDesde.value = hoy;
    fechaHasta.value = hoy;

    // ✅ Abrir el modal de ventas
    btnCaja.addEventListener("click", () => {
        fechaDesde.value = hoy; // Establece la fecha actual en "Desde"
        fechaHasta.value = hoy; // Establece la fecha actual en "Hasta"
        modalVentas.style.display = "flex";
        cargarVentas(hoy, hoy); // Cargar ventas del día actual
    });

    // ✅ Cerrar modal de ventas
    closeModalVentas.addEventListener("click", () => {
        modalVentas.style.display = "none";
    });

    // ✅ Filtrar ventas según la fecha
    btnFiltrarVentas.addEventListener("click", () => {
        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;
        if (new Date(hasta) < new Date(desde)) {
            alert("⚠️ La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
            return; // Detiene la ejecución si hay un error
        }
        cargarVentas(desde, hasta);
    });

    // ✅ Función para obtener y mostrar ventas según fecha
    async function cargarVentas(desde, hasta) {
        try {
            // Asegurar que la fecha tenga formato correcto
            const desdeISO = `${desde}T00:00:00`;
            const hastaISO = `${hasta}T23:59:59`;
    
            const response = await fetch(`http://localhost:5000/api/ventas?desde=${desdeISO}&hasta=${hastaISO}`);
            if (!response.ok) throw new Error("Error al obtener ventas");
    
            const ventas = await response.json();
            renderVentasTable(ventas);
        } catch (error) {
            console.error("Error cargando ventas:", error);
            alert("Error al cargar ventas.");
        }
    }
    

    // ✅ Función para renderizar la tabla de ventas
    // ✅ Función para renderizar la tabla de ventas con formato nuevo
    function renderVentasTable(ventas) {
        ventasTableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas ventas
        let total = 0;
    
        // 🔹 Eliminar cualquier total anterior en el tfoot
        const ventasTableFooter = document.getElementById("ventasTableFooter");
        if (ventasTableFooter) {
            ventasTableFooter.innerHTML = ""; // Limpia la fila de total previa
        }
    
        if (ventas.length === 0) {
            for (let i = 0; i < 6; i++) {
                const row = document.createElement("tr");
                row.innerHTML = `<td colspan="3" style="text-align:center;">-</td>`;
                ventasTableBody.appendChild(row);
            }
        } else {
            ventas.forEach(venta => {
                const row = document.createElement("tr");
                row.setAttribute("data-venta-id", venta.venta_id); 

    
                // ✅ Validar y formatear la fecha
                let fechaFormateada = "Fecha inválida";
                if (venta.fecha && !isNaN(Date.parse(venta.fecha))) {
                    const fechaObj = new Date(venta.fecha);
                    fechaFormateada = fechaObj.toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                }
    
                total += venta.total; // Acumular el total
    
                row.innerHTML = `
                    <td>${fechaFormateada}</td>
                    <td>${venta.unidades_totales}</td>
                    <td>$${venta.total.toFixed(2)}</td>
                `;
                  // ✅ Evento para marcar fila en violeta al hacer clic
                row.addEventListener("click", () => {
                    document.querySelectorAll("#ventasTableBody tr").forEach(tr => tr.classList.remove("selected"));
                    row.classList.add("selected");
                });

                // ✅ Evento para abrir verVenta() al hacer doble clic
                row.addEventListener("dblclick", () => {
                    const ventaId = venta.venta_id; // Obtener el venta_id almacenado
                    verVentas(ventaId);  // Llamar a verVentas pasando el venta_id
                });

                
    
                ventasTableBody.appendChild(row);
            });
        
    
        // ✅ Actualizar la fila del total en el `tfoot`
        ventasTableFooter.innerHTML = `
            <tr>
                <td colspan="2" style="text-align:right; font-weight:bold;">Total:</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;
    
        // ✅ También actualiza el total en caso de que haya otro elemento que lo use
        totalVentas.textContent = `$${total.toFixed(2)}`;
    }
    

        // ✅ Actualizar total de ventas
        totalVentas.textContent = `$${total.toFixed(2)}`;
    }
    
    //MODULO AGREGAR NUEVA VENTA DENTRO MODULO VENTAS
    btnAgregarVenta.addEventListener("click", () => {
        limpiarYPrepararVenta();
        cargarRecetasyPrecio()
        addVenta.style.display = "flex";

    });

    function actualizarTotalVenta() {
        let total = 0;
        document.querySelectorAll("#ventaTableBody .subtotal-cell").forEach(cell => {
            total += parseFloat(cell.textContent.replace("$", "")) || 0;
        });
        document.getElementById("totalVenta").textContent = `$${total.toFixed(2)}`;
    }
    


    // ✅ Función para agregar una venta a la tabla
    async function agregarVentaATabla() {
        // Obtener valores de los inputs
        const selectReceta = document.getElementById("recetaVenta");
        const recetaId = selectReceta.value;
        const recetaNombres = selectReceta.options[selectReceta.selectedIndex].text;
        const cantidad = parseFloat(document.getElementById("cantidadVenta").value);
        const precio = parseFloat(document.getElementById("precioVenta").value);
        const ventaTableBody = document.getElementById("ventaTableBody");

        // Validaciones
        if (!recetaId || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
            alert("Por favor, completa todos los campos con valores válidos.");
            return;
        }

        try {
            // 🔹 Verificar si la receta tiene insumos en receta_insumos
            const response = await fetch(`http://localhost:5000/api/receta_insumos/${recetaId}`);
            const insumos = await response.json();

            if (!response.ok) {
                throw new Error("Error al obtener insumos de la receta.");
            }

            if (insumos.length === 0) {
                alert("⚠️ La receta seleccionada no tiene insumos cargados. Proceda primero a cargarlos desde el boton '+' en la pestaña principal.");
                return; // Detener la función si no hay insumos
            }

            // Calcular subtotal
            const subtotal = cantidad * precio;

            // Crear una nueva fila para la tabla
            const row = document.createElement("tr");
            row.setAttribute("data-receta-id", recetaId); // ✅ Almacenar el ID de la receta
            row.innerHTML = `
                <td>${recetaNombres}</td>
                <td>${cantidad}</td>
                <td>$${precio.toFixed(2)}</td>
                <td class="subtotal-cell">
                    $${subtotal.toFixed(2)}
                </td>
            `;

            // Agregar fila a la tabla
            ventaTableBody.appendChild(row);

            // Limpiar los campos después de agregar
            limpiarCamposVenta();

            // ✅ Actualizar el total después de agregar la fila
            actualizarTotalVenta();

        } catch (error) {
            console.error("❌ Error verificando insumos de la receta:", error);
            alert("Hubo un error al verificar los insumos de la receta.");
        }
    }


            
        
    
    // Función para limpiar los inputs después de agregar una venta
    function limpiarCamposVenta() {
        document.getElementById("recetaVenta").value = "";
        document.getElementById("cantidadVenta").value = "";
        document.getElementById("precioVenta").value = "";
        document.getElementById("totalVenta").textContent = "$0";

    }

    // ✅ Función que limpia el modal antes de abrirlo
    function limpiarYPrepararVenta() {
        document.getElementById("recetaVenta").value = "";
        document.getElementById("cantidadVenta").value = "";
        document.getElementById("precioVenta").value = "";
        document.getElementById("medioVenta").value = ""; // Resetea el select
        document.getElementById("nombreCliente").value = "";
        document.getElementById("celularCliente").value = "";
        
       

        // ✅ Limpiar la tabla de ventas anteriores
        document.getElementById("ventaTableBody").innerHTML = "";
        document.getElementById("totalVenta").textContent = "$0";

        // ✅ Cargar la fecha actual con hora, minutos y segundos
        const now = new Date();
        const fechaHoy = now.toISOString().slice(0, 16); // Formato "YYYY-MM-DDTHH:MM"
        document.getElementById("fechaVenta").value = fechaHoy;
    }


    //FUNCIONES DE ENVIAR AL BACKEND EN NUEVA VENTA

    async function enviarVenta() {
        const fechaVenta = document.getElementById("fechaVenta").value;
        const medioVenta = document.getElementById("medioVenta").value;
        const nombreCliente = document.getElementById("nombreCliente").value.trim();
        const celularCliente = document.getElementById("celularCliente").value.trim();
        const ventaTableBody = document.getElementById("ventaTableBody").querySelectorAll("tr");
    
        let totalVenta = 0;
        let detallesVenta = [];
        let insumosAActualizar = [];
    
        // Recorrer la tabla para obtener los detalles de la venta
        for (const row of ventaTableBody) {
            const recetaId = row.dataset.recetaId; 
            const cantidad = parseInt(row.cells[1].textContent);
            const precio = parseFloat(row.cells[2].textContent.replace("$", ""));
            const subtotal = parseFloat(row.cells[3].textContent.replace("$", ""));
    
            if (!recetaId || isNaN(cantidad) || isNaN(precio)) {
                console.error("❌ Error en detalle: Falta receta_id, cantidad o precio.");
                return;
            }
    
            totalVenta += subtotal;
    
            detallesVenta.push({
                receta_id: recetaId,
                unidades: cantidad,
                precio_venta: precio
            });
    
            // 🔹 Obtener insumos usados en esta receta
            const responseRecetaInsumos = await fetch(`http://localhost:5000/api/receta_insumos/${recetaId}`);
            const recetaInsumos = await responseRecetaInsumos.json();

    
            if (!responseRecetaInsumos.ok) {
                console.error("❌ Error al obtener insumos de la receta:", recetaInsumos);
                alert("Error al obtener insumos de la receta.");
                return;
            }
    
            // 🔹 Calcular cuántos insumos se deben descontar
            recetaInsumos.forEach(insumo => {
                insumosAActualizar.push({
                    insumo_id: insumo.insumo_id,
                    cantidad: insumo.cantidad * cantidad  // Se multiplica por la cantidad vendida
                });
            });
        }
    
        if (!fechaVenta || !medioVenta || totalVenta === 0 || detallesVenta.length === 0) {
            alert("Faltan datos para completar la venta.");
            console.error("❌ Error: Datos de la venta incompletos.");
            return;
        }
    
        try {
            // ✅ 1. Enviar la venta y obtener `venta_id`
            const responseVenta = await fetch("http://localhost:5000/api/ventas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fecha_venta: fechaVenta,
                    medio_venta: medioVenta,
                    total_venta: totalVenta
                })
            });
    
            const resultVenta = await responseVenta.json();
    
            if (!responseVenta.ok) {
                console.error("❌ Error al registrar la venta:", resultVenta);
                alert("Error al registrar la venta.");
                return;
            }
    
            const ventaId = resultVenta.venta_id;
    
            // ✅ 2. Enviar los detalles de la venta
            const responseDetalles = await fetch("http://localhost:5000/api/detalle_ventas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ venta_id: ventaId, detalles: detallesVenta })
            });
    
            const resultDetalles = await responseDetalles.json();
    
            if (!responseDetalles.ok) {
                console.error("❌ Error al registrar detalles de venta:", resultDetalles);
                alert("Error al registrar los detalles de la venta.");
                return;
            }
    
    
            // ✅ 3. Actualizar los insumos
            if (insumosAActualizar.length > 0) {
                const responseInsumos = await fetch("http://localhost:5000/api/insumos/update_bulk", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(insumosAActualizar)
                });
    
                const resultInsumos = await responseInsumos.json();
    
                if (!responseInsumos.ok) {
                    console.error("❌ Error al actualizar insumos:", resultInsumos);
                    alert("Error al actualizar los insumos.");
                    return;
                }
    
            }
    
            // ✅ 4. Registrar cliente si corresponde
            if (nombreCliente || celularCliente) {
                const clienteResponse = await fetch("http://localhost:5000/api/clientes", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: nombreCliente || "ANON",
                        celular: celularCliente
                    })
                });
    
                const resultCliente = await clienteResponse.json();
    
                if (!clienteResponse.ok) {
                    console.error("❌ Error al registrar cliente:", resultCliente);
                    alert("Error al registrar el cliente.");
                    return;
                }
    
                const clienteId = resultCliente.cliente_id;
    
                // ✅ 5. Asociar cliente con la venta
                const clienteVentaResponse = await fetch("http://localhost:5000/api/cliente_ventas", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cliente_id: clienteId, venta_id: ventaId })
                });
    
                const resultClienteVenta = await clienteVentaResponse.json();
    
                if (!clienteVentaResponse.ok) {
                    console.error("❌ Error al asociar cliente con venta:", resultClienteVenta);
                    alert("Error al asociar el cliente con la venta.");
                    return;
                }
    
            }
    
            alert("✅ Venta registrada correctamente");
            document.getElementById("addVenta").style.display = "none";
            cargarVentas(hoy, hoy);
    
        } catch (error) {
            console.error("❌ Error en la petición:", error);
        }
    }
    

    function enviaryactualizar(){
        enviarVenta();
        cargarVentas(hoy,hoy);
    }
    
    // ✅ Asignar evento al botón "Aceptar"
    document.getElementById("btnAceptarDetalle").addEventListener("click", enviaryactualizar);
    
    // ✅ Función para abrir el modal de confirmación de eliminación
    function abrirModalEliminarVenta() {
        const selectedRow = document.querySelector("#ventasTableBody .selected");

        if (!selectedRow) {
            alert("⚠️ Debes seleccionar una venta para eliminar.");
            return;
        }

        // Obtener datos de la venta seleccionada
        const fechaVenta = selectedRow.cells[0].textContent; // La fecha está en la primera celda
        const totalVenta = selectedRow.cells[2].textContent; // El total está en la tercera celda

        // Configurar el mensaje dentro del modal
        document.getElementById("mensajeEliminarVenta").textContent = `¿Desea eliminar la venta de ${fechaVenta} - Total ${totalVenta}?`;

        // Mostrar el modal
        document.getElementById("confirmarEliminarVentaModal").style.display = "flex";
    }

    // ✅ Evento para abrir el modal de confirmación al hacer clic en "Eliminar Venta"
    document.getElementById("btnEliminarVenta").addEventListener("click", abrirModalEliminarVenta);

        // ✅ Evento para cerrar el modal al hacer clic en la X
    document.getElementById("closeEliminarVenta").addEventListener("click", () => {
        document.getElementById("confirmarEliminarVentaModal").style.display = "none";
    });

    // ✅ Evento para cerrar el modal al hacer clic en "Cancelar"
    document.getElementById("btnCancelarEliminarVenta").addEventListener("click", () => {
        document.getElementById("confirmarEliminarVentaModal").style.display = "none";
    });

        // ✅ Evento para confirmar la eliminación de una venta
    //Funcion de eliminar venta
    document.getElementById("btnConfirmarEliminarVenta").addEventListener("click", async () => {
        const selectedRow = document.querySelector("#ventasTableBody .selected");

        if (!selectedRow) {
            alert("⚠️ No hay ninguna venta seleccionada.");
            return;
        }

        const ventaId = selectedRow.getAttribute("data-venta-id"); // Obtener el ID de la venta
        

        try {
            const response = await fetch(`http://localhost:5000/api/ventas/${ventaId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                alert(`❌ Error al eliminar la venta: ${result.error}`);
                return;
            }

            alert(`✅ Venta eliminada correctamente.`);
            document.getElementById("confirmarEliminarVentaModal").style.display = "none";

            // Recargar la lista de ventas después de eliminar
            cargarVentas(hoy, hoy);
        } catch (error) {
            console.error("❌ Error en la eliminación:", error);
        }
    });
    //FIN MODULO VENTAS

    //MODULO REPORTES

    async function descargarReporteVentas() {
        const fechaDesde = document.getElementById("fechaDesdeAnalisis").value;
        const fechaHasta = document.getElementById("fechaHastaAnalisis").value;
    
        if (!fechaDesde || !fechaHasta) {
            alert("Por favor, selecciona ambas fechas.");
            return;
        }
    
        const apiUrl = `http://localhost:5000/api/reporte_ventas?desde=${fechaDesde}&hasta=${fechaHasta}`;
        const nombreArchivo = `reporte_ventas_${fechaDesde}_a_${fechaHasta}.xlsx`;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Error al generar el reporte");
    
            // ✅ Descargar el archivo
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
        } catch (error) {
            console.error("❌ Error al descargar el reporte:", error);
            alert("Hubo un error al generar el reporte.");
        }
    }

    
    // ✅ Asociar la función al botón
    
    document.getElementById("btnConfirmarAnalisis").addEventListener("click", descargarReporteVentas);

     

    async function reporteCliente() {
        const fechaDesde = document.getElementById("fechaDesdeCliente").value;
        const fechaHasta = document.getElementById("fechaHastaCliente").value;
    
        if (!fechaDesde || !fechaHasta) {
            alert("Por favor, selecciona ambas fechas.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/reporte_clientes?desde=${fechaDesde}&hasta=${fechaHasta}`);
            if (!response.ok) throw new Error("Error al generar el reporte");
    
            // ✅ Descargar el archivo
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_clientes_${fechaDesde}_a_${fechaHasta}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("❌ Error al descargar el reporte:", error);
            alert("Hubo un error al generar el reporte.");
        }
    }
    
    // ✅ Asociar la función al botón
    document.getElementById("btnConfirmarCliente").addEventListener("click", reporteCliente);


    async function reportePedidos() {
        const fechaDesde = document.getElementById("fechaDesdePedidos").value;
        const fechaHasta = document.getElementById("fechaHastaPedidos").value;
    
        if (!fechaDesde || !fechaHasta) {
            alert("Por favor, selecciona ambas fechas.");
            return;
        }
    
        const apiUrl = `http://localhost:5000/api/reporte_pedidos?desde=${fechaDesde}&hasta=${fechaHasta}`;
        const nombreArchivo = `reporte_pedidos_${fechaDesde}_a_${fechaHasta}.xlsx`;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Error al generar el reporte");
    
            // ✅ Descargar el archivo
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("❌ Error al descargar el reporte:", error);
            alert("Hubo un error al generar el reporte.");
        }
    }


    document.getElementById("btnConfirmarPedidos").addEventListener("click", reportePedidos);


    //----------------------------------------------FIN MODULO REPORTES------------------------------------------------------------
    //---------------------------------------------MODULO ALERTA INSUMOS ----------------------------------------------------------
    document.addEventListener("DOMContentLoaded", checkInsumos);

    async function checkInsumos() {
        try {
            // 1️⃣ Fetch de insumos (stock disponible)
            const responseInsumos = await fetch('http://localhost:5000/api/insumos');
            const insumos = await responseInsumos.json();
    
            // 2️⃣ Fetch de recetas
            const responseRecetas = await fetch('http://localhost:5000/api/recetas');
            const recetas = await responseRecetas.json();
    
            let totalInsumosNecesarios = {};
    
            // 3️⃣ Recorrer todas las recetas y sumar los insumos necesarios
            for (let receta of recetas) {
                const responseRecetaInsumos = await fetch(`http://localhost:5000/api/receta_insumos/${receta.id}`);
                const insumosReceta = await responseRecetaInsumos.json();
    
                insumosReceta.forEach(insumo => {
                    if (!totalInsumosNecesarios[insumo.insumo]) {
                        totalInsumosNecesarios[insumo.insumo] = 0;
                    }
                    totalInsumosNecesarios[insumo.insumo] += parseFloat(insumo.cantidad);
                });
            }
    
    
            // 4️⃣ Verificar si hay stock suficiente
            let alertas = [];
            insumos.forEach(insumo => {
                let requerido = (totalInsumosNecesarios[insumo.nombre] || 0).toFixed(2);
                let cantidadRedondeada = parseFloat(insumo.cantidad).toFixed(2); // Redondear a 2 decimales
                if (insumo.cantidad < requerido) {
                    alertas.push(`⚠️ Insumo **${insumo.nombre}** en cantidad crítica (${cantidadRedondeada} disponibles, necesita mínimo ${requerido}).`);
                }
            });
    
            // 5️⃣ Si hay alertas, mostrar el botón de alerta
            if (alertas.length > 0) {
                mostrarAlerta(alertas);
            } else {
                ocultarAlerta();
            }
    
        } catch (error) {
            console.error("Error al verificar insumos:", error);
        }
    }
    
    // ✅ Función para mostrar el botón de alerta
    function mostrarAlerta(alertas) {
        let alertaButton = document.getElementById("alertaInsumos");
        let detalleAlertas = document.getElementById("detalleAlertas");
    
        // Mostrar el botón de alerta
        alertaButton.style.display = "block";
    
        // Guardar las alertas en el div de detalles (pero mantenerlo oculto)
        detalleAlertas.innerHTML = alertas.join("<br>");
        detalleAlertas.style.display = "none";
    
        // Agregar evento para mostrar/ocultar el detalle al hacer clic
        alertaButton.onclick = function () {
            if (detalleAlertas.style.display === "none") {
                detalleAlertas.style.display = "block";
            } else {
                detalleAlertas.style.display = "none";
            }
        };
    }
    
    // ✅ Función para ocultar la alerta si no hay insumos críticos
    function ocultarAlerta() {
        document.getElementById("alertaInsumos").style.display = "none";
        document.getElementById("detalleAlertas").style.display = "none";
    }
    
    // Ejecutar el chequeo de insumos al cargar
    checkInsumos();
    // Ejecutar checkInsumos cada 15 segundos
    setInterval(checkInsumos, 900000);

    //------------------------------------------------------------FINALIZA CHECK INSUMOS ------------------------------------------------------

    // Asegurar que los modales inicien cerrados
    modal.style.display = "none";
    addModal.style.display = "none";
    modifModal.style.display = "none";
    elimModal.style.display = "none";
    modalReportes.style.display="none";
    modalClientes.style.display = "none";
    modalPedidos.style.display = "none";
    modalAnalisis.style.display = "none";

   
    modalRecetas.style.display = "none";
    addModalRecetas.style.display = "none";
    modifModalRecetas.style.display = "none";
    modifInsumosRecetaModal.style.display = "none";
    modalVentas.style.display = "none";
    addVenta.style.display = "none";
    
    //document.getElementById("btnAgregarInsumosRecetas").style.display = "flex";



  // Alternar visibilidad del menú al tocar el "+"
    floatingButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que se cierre inmediatamente al abrir
        floatingMenu.style.display = (floatingMenu.style.display === "block") ? "none" : "block";
    });

    // Cerrar el menú al hacer clic fuera de él y del botón
    document.addEventListener("click", (event) => {
        if (!floatingButton.contains(event.target) && !floatingMenu.contains(event.target)) {
            floatingMenu.style.display = "none";
        }
    });

    // Al tocar la opción, abrir el modal y cerrar el menú
    btnAgregarInsumosRecetas.addEventListener("click", () => {
        document.getElementById("modifInsumosRecetaModal").style.display = "flex";
        floatingMenu.style.display = "none";
    });
     /*
    elimModalRecetas.style.display = "none";
    
    
    */


      // Evento para seleccionar qué campo modificar
      let insumoSeleccionado = {}; // Almacena los datos del insumo seleccionado

      // Evento para seleccionar qué campo modificar
      modifCampo.addEventListener("change", () => {
          actualizarOrdenInputs();
      });
  
      // Evento para cargar datos del insumo seleccionado
      modifNombre.addEventListener("change", async () => {
          const nombre = modifNombre.value;
          if (!nombre) return;
  
          try {
              const response = await fetch(`http://localhost:5000/api/insumos/${encodeURIComponent(nombre)}`);
              if (!response.ok) throw new Error("Error al obtener el insumo");
              insumoSeleccionado = await response.json();
              
              actualizarOrdenInputs(); // Una vez que tenemos los datos, reordenamos
          } catch (error) {
              alert(error.message);
          }
      });


    //funciones de lectura en la bbdd 

    function fetchInsumos() {
        fetch("http://localhost:5000/api/insumos")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener los insumos");
                }
                return response.json();
            })
            .then(data => {
                renderTable(data);
                openModal();
            })
            .catch(error => {
                alert(error.message);
            });
    }

    function fetchRecetas() {
        // Cerrar el modal de insumos si está abierto
        document.getElementById("modal").style.display = "none";
    
        fetch("http://localhost:5000/api/recetas")
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error); });
                }
                return response.json();
            })
            .then(data => {
                renderRecetasTable(data); // Asegúrate de tener una función específica para recetas
                openModalRecetas(); // Abre el modal correcto
            })
            .catch(error => {
                console.error("Error en fetchRecetas:", error);
                alert(error.message);
            });
    }

    function openModalRecetas() {
        document.getElementById("modalRecetas").style.display = "block";
    }

    function closeAddModalRecetas() {
        document.getElementById("addModalRecetas").style.display = "none";
    }

    function closeElimModalRecetas() {
        document.getElementById("elimModalRecetas").style.display = "none";
    }
    function closeModifInsumosRecetaModal() {
        document.getElementById("modifInsumosRecetaModal").style.display = "none";
        limpiarInsumosAgregados()
    }

    function closeVerVenta() {
        document.getElementById('verVenta').style.display = "none";
    }

   

    

    async function verVentas(ventaId) {
        try {
            const response = await fetch(`http://localhost:5000/api/detalle_ventas?venta_id=${ventaId}`);
            if (!response.ok) throw new Error("Error al obtener los detalles de la venta");
    
            const detalles = await response.json();
            mostrarDetallesVenta(detalles, ventaId);
        } catch (error) {
            console.error("Error cargando detalles de venta:", error);
            alert("Error al cargar los detalles de la venta.");
        }
    }
    

    function mostrarDetallesVenta(detalles) {
        const detallesContainer = document.getElementById("detallesTableBody");
        const totalDetVentas = document.getElementById("totalDetVentas"); // Elemento donde se muestra el total general
    
        detallesContainer.innerHTML = ""; // Limpiar antes de agregar nuevos datos
    
        let total = 0; // Inicializa el total
    
        if (detalles.length === 0) {
            detallesContainer.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay detalles disponibles.</td></tr>`;
        } else {
            detalles.forEach(detalle => {
                const row = document.createElement("tr");
    
                row.innerHTML = `
                    <td>${detalle.receta_nombre}</td>
                    <td>${detalle.unidades}</td>
                    <td>$${detalle.precio_venta.toFixed(2)}</td>
                    <td>$${detalle.subtotal.toFixed(2)}</td>
                `;
    
                detallesContainer.appendChild(row);
                total += detalle.subtotal; // ✅ Sumar el subtotal al total general
            });
    
            // ✅ Actualiza solo el contenido de `totalDetVentas`, sin tocar el `tfoot`
            if (totalDetVentas) {
                totalDetVentas.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
            }
            
        }
    
        // ✅ Asegurar que el modal de detalles de venta se muestra
        document.getElementById("verVenta").style.display = "flex";
    }
    
    
    


    
    
    

    //Esta funcion le da formato a la tabla que se muestra al abrir insumos

    function renderTable(data) {
        insumosContainer.innerHTML = ""; 
        data.forEach(insumo => {
            const row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${insumo.nombre}</td>
                <td>${insumo.cantidad.toFixed(1)}</td>
                <td>${insumo.unidad_medida}</td>
                <td>$${insumo.precio_unitario}</td>
            `;
    
            // Evento para seleccionar una fila
            row.addEventListener("click", () => {
                document.querySelectorAll("#tableBody tr").forEach(tr => tr.classList.remove("selected"));
                row.classList.add("selected");
            
                // Guarda el insumo seleccionado en una variable global
                window.selectedInsumo = {
                    nombre: insumo.nombre,
                    cantidad: insumo.cantidad,
                    unidad_medida: insumo.unidad_medida,
                    precio_unitario: insumo.precio_unitario
                };
            });
    
            insumosContainer.appendChild(row);
        });
    }

    function renderRecetasTable(data) {
        const recetasContainer = document.getElementById("tableBodyRecetas");
        recetasContainer.innerHTML = ""; // Limpiar antes de agregar
    
        data.forEach(receta => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${receta.nombre}</td>
                <td>$${receta.precio_venta.toFixed(2)}</td>
                <td>$${receta.precio_venta_2.toFixed(2)}</td>
            `;
    
            // Evento para seleccionar una fila
            row.addEventListener("click", () => {
                document.querySelectorAll("#tableBodyRecetas tr").forEach(tr => tr.classList.remove("selected"));
                row.classList.add("selected");
    
                // Guarda la receta seleccionada en una variable global
                window.selectedReceta = {
                    id: receta.id,
                    nombre: receta.nombre,
                    precio_venta: receta.precio_venta,
                    precio_venta_2: receta.precio_venta_2
                };
            });
    
            recetasContainer.appendChild(row);
        });
    }
    
    
    

    // Funciones para mostrar o ocultar los modals, no tiene otra funcion que eso
    function openModal() {
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function actualizarOrdenInputs() {
        const selectedField = modifCampo.value;
        if (!selectedField || !insumoSeleccionado) return;
    
        // Extraer estilos de un input original
        const originalInput = document.querySelector("input");
        const computedStyles = window.getComputedStyle(originalInput);
    
        const fields = {
            unidad: { label: "Unidad de Medida:", value: insumoSeleccionado.unidad_medida, type: "text" },
            cantidad: { label: "Cantidad:", value: insumoSeleccionado.cantidad, type: "number" },
            precio: { label: "Precio Unitario:", value: insumoSeleccionado.precio_unitario, type: "number" }
        };
    
        const orderedFields = [selectedField, ...Object.keys(fields).filter(f => f !== selectedField)];
    
        inputsModif.innerHTML = ""; 
        inputsModif.style.display = "flex";  
        inputsModif.style.flexDirection = "column";  
        inputsModif.style.gap = "15px";  
        inputsModif.style.width = "100%"; 
    
        orderedFields.forEach((key, index) => {
            const fieldData = fields[key];
            const isEditable = index === 0;
    
            // Crear label
            const label = document.createElement("label");
            label.setAttribute("for", `modif${key.charAt(0).toUpperCase() + key.slice(1)}`);
            label.textContent = fieldData.label;
            label.style.fontSize = computedStyles.fontSize;
            label.style.fontWeight = computedStyles.fontWeight;
            label.style.fontFamily = computedStyles.fontFamily;
    
            // Crear input
            const input = document.createElement("input");
            input.setAttribute("type", fieldData.type);
            input.setAttribute("id", `modif${key.charAt(0).toUpperCase() + key.slice(1)}`);
            input.value = fieldData.value;
            input.disabled = !isEditable;
    
            // Aplicar estilos del input original
            input.style.width = computedStyles.width;
            input.style.padding = computedStyles.padding;
            input.style.borderRadius = computedStyles.borderRadius;
            input.style.border = computedStyles.border;
            input.style.fontSize = computedStyles.fontSize;
            input.style.fontFamily = computedStyles.fontFamily;
            input.style.fontWeight = computedStyles.fontWeight;
            input.style.marginBottom = computedStyles.marginBottom;
            input.style.color = isEditable ? computedStyles.color : "#888";  
            input.style.backgroundColor = isEditable ? "#ffffff" : "#e0e0e0";
    
            inputsModif.appendChild(label);
            inputsModif.appendChild(input);
        });
    }
    
    function openAddModal() {
        fetch("http://localhost:5000/api/insumos")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("insumoSelect");
                select.innerHTML = '<option value="">Selecciona un insumo</option>';
    
                data.forEach(insumo => {
                    const option = document.createElement("option");
                    option.value = insumo.nombre;
                    option.textContent = `${insumo.nombre} (${insumo.unidad_medida})`; // Agrega la unidad de medida
                    select.appendChild(option);
                });
    
                // Agregar opción "Agregar nuevo..."
                const newOption = document.createElement("option");
                newOption.value = "nuevo";
                newOption.textContent = "Agregar nuevo...";
                select.appendChild(newOption);
    
                document.getElementById("nuevoInsumoFields").style.display = "none";
                limpiarVentanaInsumos();
                document.getElementById("cantidad").value = "";
                document.getElementById("precio").value = "";
    
                document.getElementById("addModal").style.display = "flex";
            })
            .catch(error => {
                alert("Error al cargar los insumos");
                console.error(error);
            });
    }

    function handleInsumoSelection() {
        const select = document.getElementById("insumoSelect");
        const nuevoFields = document.getElementById("nuevoInsumoFields");
    
        if (select.value === "nuevo") {
            nuevoFields.style.display = "flex";  // Asegura que use flexbox como el form
            nuevoFields.style.flexDirection = "column"; // Mantiene la estructura en columna
            nuevoFields.style.gap = "15px";  // Ajusta el espacio entre los inputs
        } else {
            nuevoFields.style.display = "none";
        }
    }

   
    function closeElimModalRecetas() {
        elimModalRecetas.style.display = "none";
    }

    function openModalRecetas() {
        document.getElementById("modalRecetas").style.display = "flex";
    }

    async function openModifModal() {
        try {
            const response = await fetch("http://localhost:5000/api/insumos");
            if (!response.ok) throw new Error("Error al obtener los insumos.");
            const data = await response.json();

            modifNombre.innerHTML = '<option value="">Selecciona un insumo</option>';
            data.forEach(insumo => {
                const option = document.createElement("option");
                option.value = insumo.nombre;
                option.textContent = insumo.nombre;
                modifNombre.appendChild(option);
            });

            modifModal.style.display = "flex";
        } catch (error) {
            alert(error.message);
        }
    }

    async function cargarRecetas() {
        try {
            const response = await fetch("http://localhost:5000/api/recetas");
            if (!response.ok) throw new Error("Error al obtener recetas");

            const recetas = await response.json();
            recetaSelect.innerHTML = ""; 

            // Agregar opción por defecto
            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Seleccione una receta";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            recetaSelect.appendChild(defaultOption);

            // Agregar recetas obtenidas de la API
            recetas.forEach(receta => {
                const option = document.createElement("option");
                option.value = receta.id;
                option.setAttribute("data-id", receta.id); // Guardar receta-id en un atributo
                option.textContent =receta.nombre;
                option.dataset.precioVenta = receta.precio_venta;  // Precio normal (Pedidos Ya)
                option.dataset.precioVenta2 = receta.precio_venta_2; // Precio con Descuento
                recetaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando recetas:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        cargarRecetas();
    });
    
    async function cargarRecetasyPrecio() {
        try {
            const response = await fetch("http://localhost:5000/api/recetas");
            if (!response.ok) throw new Error("Error al obtener recetas");
    
            const recetas = await response.json();
            const selectReceta = document.getElementById("recetaVenta");
            const precioVenta = document.getElementById("precioVenta");
            const medioVenta = document.getElementById("medioVenta");
    
            // ✅ Limpiar opciones previas antes de cargar nuevas recetas
            selectReceta.innerHTML = '<option value="">Selecciona una receta</option>';
    
            recetas.forEach(receta => {
                const option = document.createElement("option");
                option.value = receta.id;
                option.textContent = receta.nombre;
                option.dataset.precioVenta = receta.precio_venta;  // Precio PedidosYa
                option.dataset.precioVenta2 = receta.precio_venta_2; // Precio WhatsApp
                selectReceta.appendChild(option);
            });
    
            // ✅ Función para actualizar el precio basado en la receta seleccionada y el medio de venta
            function actualizarPrecio() {
                const selectedOption = selectReceta.options[selectReceta.selectedIndex];
                const medioSeleccionado = medioVenta.value;
    
                if (!selectedOption.value) {
                    precioVenta.value = "";
                    return;
                }
    
                // ✅ Determinar el precio basado en el medio de venta
                let precio = medioSeleccionado === "PedidosYa" 
                    ? selectedOption.dataset.precioVenta 
                    : selectedOption.dataset.precioVenta2;
    
                precioVenta.value = precio ? parseFloat(precio).toFixed(2) : "";
            }
    
            // ✅ Eventos para actualizar el precio
            selectReceta.addEventListener("change", actualizarPrecio);
            medioVenta.addEventListener("change", actualizarPrecio);
    
        } catch (error) {
            console.error("Error cargando recetas:", error);
        }
    }
    
    // ✅ Ejecutar la función al cargar la página
    document.addEventListener("DOMContentLoaded", cargarRecetasyPrecio);
    

    // Click para abrir el modal de modificar insumo-receta
    document.getElementById("btnAgregarInsumosRecetas").addEventListener("click", function() {
        document.getElementById("modifInsumosRecetaModal").style.display = "flex";
        cargarRecetas();
    });

    //Click para cerrar el modal de modificar insumo-receta
    document.getElementById("btnCancelarModifInsumo").addEventListener("click", function() {
        document.getElementById("modifInsumosRecetaModal").style.display = "none";
        limpiarInsumosAgregados()
    });



    document.getElementById("btnmodaceptInsumo").addEventListener("click", async () => {
        const selectedField = modifCampo.value;
        if (!selectedField || !insumoSeleccionado) {
            alert("Selecciona un insumo y un campo a modificar.");
            return;
        }

        // Obtener el valor del input modificado
        const updatedValue = document.getElementById(`modif${selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}`).value;

        // Enviar la actualización con TODOS los valores (manteniendo los no modificados)
        const updatedInsumo = {
            nombre: insumoSeleccionado.nombre,
            unidad_medida: selectedField === "unidad" ? updatedValue : insumoSeleccionado.unidad_medida,
            cantidad: selectedField === "cantidad" ? updatedValue : insumoSeleccionado.cantidad,
            precio_unitario: selectedField === "precio" ? updatedValue : insumoSeleccionado.precio_unitario
        };

        try {
            const response = await fetch("http://localhost:5000/api/insumos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedInsumo)
            });

            if (!response.ok) throw new Error("Error al modificar el insumo.");
            alert("Insumo modificado con éxito.");
            closeModifModal();
            fetchInsumos(); // Recargar tabla
        } catch (error) {
            alert(error.message);
        }
    });
    
    
    function closeModifModal() {
        modifModal.style.display = "none";
        insumoSeleccionado = {}; // Limpiar datos del insumo seleccionado
        inputsModif.innerHTML = ""; // Limpiar inputs
    }

    function closeModifRecModal() {
        modifModal.style.display = "none";
    }

    function closeModifModalRecetas() {
        document.getElementById("modifModalRecetas").style.display = "none";
    }
    
  

    function openElimModal() {
        if (!window.selectedInsumo) {
            alert("Selecciona un insumo para eliminar.");
            return;
        }
    
        const message = document.getElementById("elimMessage");
        message.textContent = `¿Estás seguro que deseas eliminar "${window.selectedInsumo.nombre}"?`;
    
        document.getElementById("elimModal").style.display = "flex";
    }
    
    function closeElimModal() {
        document.getElementById("elimModal").style.display = "none";
    }

    function openElimModalRecetas() {
        if (!window.selectedReceta) {
            alert("Selecciona una receta para eliminar.");
            return;
        }
    
        document.getElementById("elimMessageReceta").textContent = 
            `¿Está seguro de eliminar la receta: ${window.selectedReceta.nombre}?`;
        
        document.getElementById("elimModalRecetas").style.display = "flex";
    }
    
    //Botones de insumo-receta
    function openModifInsumosRecetaModal() {
        document.getElementById('modifInsumosRecetaModal').style.display = 'flex';
    }

      // Función para obtener los insumos desde el backend para modulo receta insumos
    async function cargarInsumos() {
        try {
            const response = await fetch("http://localhost:5000/api/insumos");
            if (!response.ok) throw new Error("Error al obtener insumos");

            return await response.json();
        } catch (error) {
            console.error("Error cargando insumos:", error);
            return [];
        }
    }


     // Función para obtener unidades equivalentes modulo receta insumos
     function obtenerUnidadesEquivalentes(unidadBase) {
        const equivalencias = {
            "Kg": ["Kg", "Gr"],
            "Gr": ["Kg", "Gr"],
            "Lt": ["Lt", "Ml"],
            "ml": ["Lt", "Ml"],
            "Unidades": ["Unidades"]
        };

        return equivalencias[unidadBase] || [unidadBase]; // Si no está en la lista, devuelve la unidad original
    }

    //funciones para actualizar los inputs de la tabla receta-insumos
    function actualizarOpcionesInsumo(select, insumos) {
        const insumosSeleccionados = new Set(
            Array.from(document.querySelectorAll(".insumo"))
                .map(select => select.value)
                .filter(value => value !== "")
        );
    
        // Filtrar y agregar opciones disponibles
        insumos
            .filter(insumo => !insumosSeleccionados.has(insumo.id.toString())) // Filtra los repetidos
            .forEach(insumo => {
                const option = document.createElement("option");
                option.value = insumo.id;  // ✅ Ahora el value contiene el ID correctamente
                option.textContent = insumo.nombre;
                option.setAttribute("data-unidad", insumo.unidad_medida);  // Guardar unidad base
                select.appendChild(option);
            });
    }

    function actualizarOpcionesUnidad(select, unidadBase) {
        select.innerHTML = ""; // Limpiar unidades previas
    
        // Obtener las unidades equivalentes
        const unidadesDisponibles = obtenerUnidadesEquivalentes(unidadBase);
    
        // Agregar todas las opciones disponibles al select de unidades
        unidadesDisponibles.forEach(unidad => {
            const option = document.createElement("option");
            option.value = unidad;
            option.textContent = unidad;
            select.appendChild(option);
        });
    }

    function actualizarTodosLosSelects() {
        const insumos = document.querySelectorAll(".insumo");
        insumos.forEach(select => {
            const insumosDisponibles = Array.from(select.options).map(option => option.value);
            const insumosSeleccionados = new Set(
                Array.from(insumos)
                    .map(sel => sel.value)
                    .filter(value => value !== "")
            );
    
            // Recorrer opciones y ocultar las que ya están seleccionadas
            Array.from(select.options).forEach(option => {
                if (insumosSeleccionados.has(option.value) && option.value !== select.value) {
                    option.hidden = true;
                } else {
                    option.hidden = false;
                }
            });
        });
    }

    function limpiarVentanaInsumos() {
        document.getElementById("nombreNuevo").value = "";  // Limpia el campo del nombre
        document.getElementById("unidadNuevo").value = "";  // Limpia la unidad de medida
        document.getElementById("cantidad").value = "";     // Limpia la cantidad
        document.getElementById("precio").value = "";       // Limpia el precio
    }
    
    
    //Esto sirve para hacer que lea los insumos ya cargados a insumo-receta. 
    document.getElementById("recetaSelect").addEventListener("change", async function () {
        const recetaId = this.value;
        if (!recetaId) return;
    
        try {
            const response = await fetch(`http://localhost:5000/api/receta_insumos/${recetaId}`);
            if (!response.ok) throw new Error("Error al obtener los insumos de la receta");
    
            const insumosGuardados = await response.json();
            insumoRecetaContainer.innerHTML = ""; // Limpiar inputs anteriores
    
            // Llamar a agregarFilaInsumoDesdeBD() para cada insumo de la BD
            insumosGuardados.forEach(insumo => agregarFilaInsumoDesdeBD(insumo));
        } catch (error) {
            console.error("Error al obtener insumos de la receta:", error);
            alert("Hubo un error al cargar los insumos de la receta.");
        }
    });
    
    
    
    

    btnAgregarNuevoInsumo.addEventListener("click", agregarFilaInsumoManual);
    

    // Función para agregar una nueva fila con selects dinámicos modulo receta insumos
    // ✅ Función para agregar insumos desde la Base de Datos (Con botón EDITAR)
  // ✅ Función para agregar insumos desde la Base de Datos (Con botón EDITAR)
    async function agregarFilaInsumoDesdeBD(insumoData) {
    
        const row = document.createElement("div");
        row.classList.add("fila-insumo");

        // Obtener los insumos del backend para poblar el select
        const insumos = await cargarInsumos();

        // Crear el select de insumo (bloqueado)
        const selectInsumo = document.createElement("select");
        selectInsumo.classList.add("insumo", "form-select");
        selectInsumo.disabled = true; // Bloqueado porque viene de la BD

        // Opción por defecto
        const defaultOptionInsumo = document.createElement("option");
        defaultOptionInsumo.value = "";
        defaultOptionInsumo.textContent = "Selecciona un insumo";
        defaultOptionInsumo.disabled = true;
        selectInsumo.appendChild(defaultOptionInsumo);

        // Agregar opciones de insumos
        insumos.forEach(insumo => {
            const option = document.createElement("option");
            option.value = insumo.id;
            option.textContent = insumo.nombre;
            option.setAttribute("data-unidad", insumo.unidad_medida);
            
            // ✅ Comparar el nombre en vez de `insumo_id`
            if (insumoData.insumo === insumo.nombre) option.selected = true;
            
            selectInsumo.appendChild(option);
        });

        // Crear el select de unidad de medida (bloqueado)
        const selectUnidad = document.createElement("select");
        selectUnidad.classList.add("unidad", "form-select");
        selectUnidad.disabled = true; // Bloqueado porque viene de la BD

        // Agregar unidad de medida
        const optionUnidad = document.createElement("option");
        optionUnidad.value = insumoData.unidad_medida;
        optionUnidad.textContent = insumoData.unidad_medida;
        optionUnidad.selected = true;
        selectUnidad.appendChild(optionUnidad);

        // Input de Cantidad (bloqueado)
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.classList.add("cantidad", "form-input");
        inputCantidad.value = insumoData.cantidad;
        inputCantidad.disabled = true; // Bloqueado porque viene de la BD

        // Botón de editar ✏️
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.classList.add("editarFila");
        btnEditar.addEventListener("click", () => {
            selectInsumo.disabled = false;
            selectUnidad.disabled = false;
            inputCantidad.disabled = false;
            btnEditar.style.display = "none"; // Ocultar botón de editar después de activarlo
        });

        // Agregar elementos a la fila
        row.appendChild(selectInsumo);
        row.appendChild(selectUnidad);
        row.appendChild(inputCantidad);
        row.appendChild(btnEditar);
        
        insumoRecetaContainer.appendChild(row);
    }


    // ✅ Función para agregar insumos manualmente (Con botón ELIMINAR)
    async function agregarFilaInsumoManual() {

        const row = document.createElement("div");
        row.classList.add("fila-insumo");

        // Obtener los insumos del backend
        const insumos = await cargarInsumos();

        // Obtener los insumos ya agregados en receta_insumo
        const insumosSeleccionados = [...document.querySelectorAll(".fila-insumo select.insumo")]
            .map(select => select.value)
            .filter(value => value !== "");


        // Crear el select de insumo (editable)
        const selectInsumo = document.createElement("select");
        selectInsumo.classList.add("insumo", "form-select");

        // Opción por defecto
        const defaultOptionInsumo = document.createElement("option");
        defaultOptionInsumo.value = "";
        defaultOptionInsumo.textContent = "Selecciona un insumo";
        defaultOptionInsumo.disabled = true;
        defaultOptionInsumo.selected = true;
        selectInsumo.appendChild(defaultOptionInsumo);

        // Agregar opciones de insumos que NO estén ya en receta_insumo
        insumos.forEach(insumo => {
            if (!insumosSeleccionados.includes(insumo.id.toString())) { // Evita duplicados
                const option = document.createElement("option");
                option.value = insumo.id;
                option.textContent = insumo.nombre;
                option.setAttribute("data-unidad", insumo.unidad_medida);
                selectInsumo.appendChild(option);
            }
        });

        // Crear el select de unidad de medida (editable)
        const selectUnidad = document.createElement("select");
        selectUnidad.classList.add("unidad", "form-select");

        // Opción por defecto
        const defaultOptionUnidad = document.createElement("option");
        defaultOptionUnidad.value = "";
        defaultOptionUnidad.textContent = "Unidad de Medida";
        defaultOptionUnidad.disabled = true;
        defaultOptionUnidad.selected = true;
        selectUnidad.appendChild(defaultOptionUnidad);

        // Actualizar unidades cuando se selecciona un insumo
        selectInsumo.addEventListener("change", function () {
            const selectedOption = selectInsumo.options[selectInsumo.selectedIndex];
            const unidadMedida = selectedOption.getAttribute("data-unidad");
            selectUnidad.innerHTML = ""; // Limpiar unidades previas
            const unidadesDisponibles = obtenerUnidadesEquivalentes(unidadMedida);
            unidadesDisponibles.forEach(unidad => {
                const optionUnidad = document.createElement("option");
                optionUnidad.value = unidad;
                optionUnidad.textContent = unidad;
                selectUnidad.appendChild(optionUnidad);
            });
        });

        // Input de Cantidad (editable)
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.classList.add("cantidad", "form-input");
        inputCantidad.min = "0";

        // Botón de eliminar ❌
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.classList.add("eliminarFila");
        btnEliminar.addEventListener("click", () => {
            row.remove();
        });

        // Agregar elementos a la fila
        row.appendChild(selectInsumo);
        row.appendChild(selectUnidad);
        row.appendChild(inputCantidad);
        row.appendChild(btnEliminar);
        
        insumoRecetaContainer.appendChild(row);
    }



    function limpiarInsumosAgregados() {
        document.getElementById("insumoRecetaContainer").innerHTML = ""; // Borra todas las filas agregadas
    }

    document.getElementById("recetaSelect").addEventListener("change", function () {
        limpiarInsumosAgregados();
    });
    

    //Boton aceptar para agregar receta-insumo
        // Mapeo de conversiones de unidades (kg ↔ g, lt ↔ ml)
        function convertirUnidad(cantidad, unidadOrigen, unidadDestino) {
            const conversiones = {
                "Kg": { "Gr": 1000 },
                "Gr": { "Kg": 0.001 },
                "Lt": { "Ml": 1000 },
                "Ml": { "Lt": 0.001 },
                "unidad": { "unidad": 1 }
            };
    
            if (unidadOrigen === unidadDestino) {
                return cantidad; // No hay conversión necesaria
            }
    
            return conversiones[unidadOrigen]?.[unidadDestino] 
                ? cantidad * conversiones[unidadOrigen][unidadDestino] 
                : null; // Retorna null si la conversión no es válida
        }
    
        async function enviarInsumosAlBackend() {
            const recetaSelect = document.getElementById("recetaSelect");
        
            // Obtener receta_id desde el atributo correcto
            const recetaId = recetaSelect.options[recetaSelect.selectedIndex].getAttribute("data-id");
        
            if (!recetaId) {
                alert("Por favor selecciona una receta.");
                return;
            }
        
            const insumoRows = document.querySelectorAll(".fila-insumo");
            let errores = [];  // Array para almacenar errores
            let insumosActualizar = [];
            let insumosEliminar = [];
        
            insumoRows.forEach((row, index) => {
                const insumoSelect = row.querySelector(".insumo");
                const unidadSelect = row.querySelector(".unidad");
                const cantidadInput = row.querySelector(".cantidad");
        
                const insumoId = insumoSelect.value;
                const unidadMedidaSeleccionada = unidadSelect.value;
                const cantidadIngresada = parseFloat(cantidadInput.value);
                const esNuevo = row.querySelector(".eliminarFila") !== null; // ✅ Si tiene botón de eliminar, es un insumo nuevo
        
                // Validaciones
                if (!insumoId) {
                    errores.push(`Fila ${index + 1}: No has seleccionado un insumo.`);
                }
                if (!unidadMedidaSeleccionada) {
                    errores.push(`Fila ${index + 1}: No has seleccionado una unidad de medida.`);
                }
                if (isNaN(cantidadIngresada)) {
                    errores.push(`Fila ${index + 1}: La cantidad ingresada no es válida.`);
                }
        
                // 🔴 Si es un insumo nuevo (manual) y la cantidad es <= 0, mostrar error
                if (esNuevo && cantidadIngresada <= 0) {
                    errores.push(`Fila ${index + 1}: No se puede agregar un insumo con cantidad 0 o negativa.`);
                }
        
                // Si hay errores en esta fila, no procesarla
                if (errores.length > 0) return;
        
                // Obtener la unidad base del insumo seleccionado
                const unidadBase = insumoSelect.options[insumoSelect.selectedIndex].getAttribute("data-unidad");
        
                // Convertir cantidad si es necesario
                const cantidadConvertida = convertirUnidad(cantidadIngresada, unidadMedidaSeleccionada, unidadBase);
                if (cantidadConvertida === null) {
                    errores.push(`Fila ${index + 1}: No se puede convertir ${unidadMedidaSeleccionada} a ${unidadBase}.`);
                    return;
                }
        
                if (!esNuevo && cantidadIngresada === 0) {
                    // ✅ Si el insumo viene de la BD y la cantidad es 0 → Agregar a eliminar
                    insumosEliminar.push({
                        insumo_id: parseInt(insumoId)
                    });
                } else {
                    // ✅ Si es nuevo o modificado y cantidad > 0 → Agregar a actualizar
                    insumosActualizar.push({
                        insumo_id: parseInt(insumoId),
                        cantidad: cantidadConvertida,
                        unidad_medida: unidadBase
                    });
                }
            });
        
            // Si hay errores, mostrar alerta y cancelar envío
            if (errores.length > 0) {
                alert("⚠️ No se pudo guardar la receta debido a los siguientes errores:\n\n" + errores.join("\n"));
                return;
            }
        
            // Si no hay insumos para actualizar ni eliminar, mostrar alerta
            if (insumosActualizar.length === 0 && insumosEliminar.length === 0) {
                alert("No hay cambios para guardar.");
                return;
            }
        
            try {
                // **Enviar datos de actualización**
                if (insumosActualizar.length > 0) {
                    const responseUpdate = await fetch(`http://localhost:5000/api/receta_insumos/${recetaId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(insumosActualizar)
                    });
        
                    if (!responseUpdate.ok) throw new Error("Error al actualizar insumos.");
                }
        
                // **Enviar datos de eliminación**
                for (const insumo of insumosEliminar) {
                    const responseDelete = await fetch(`http://localhost:5000/api/receta_insumos/${recetaId}/${insumo.insumo_id}`, {
                        method: "DELETE"
                    });
        
                    if (!responseDelete.ok) throw new Error(`Error al eliminar insumo ID: ${insumo.insumo_id}`);
                }
        
                alert("✅ Receta actualizada correctamente.");
            } catch (error) {
                console.error("Error:", error);
                alert("❌ Hubo un problema al actualizar la receta.");
            }
        }
        
        
        
        
    
        btnAceptarModifInsumo.addEventListener("click", enviarInsumosAlBackend);
    

    


    //Aqui empiezan las funciones de eventos que modifican la bbdd

    function addInsumo() {
        const select = document.getElementById("insumoSelect");
        const insumoSeleccionado = select.value;
        const cantidadNueva = parseFloat(document.getElementById("cantidad").value);
        const precioNuevo = parseFloat(document.getElementById("precio").value);
    
        if (!cantidadNueva || !precioNuevo || cantidadNueva <= 0 || precioNuevo <= 0) {
            alert("Por favor, complete todos los campos.");
            return;
        }
    
        if (insumoSeleccionado === "nuevo") {
            // Se trata de un insumo completamente nuevo
            const nombreNuevo = document.getElementById("nombreNuevo").value.trim();
            const unidadNuevo = document.getElementById("unidadNuevo").value.trim();
    
            if (!nombreNuevo || !unidadNuevo) {
                alert("Por favor, complete todos los campos del nuevo insumo.");
                return;
            }
    
            fetch("http://localhost:5000/api/insumos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombreNuevo,
                    unidad_medida: unidadNuevo,
                    cantidad: cantidadNueva,
                    precio_unitario: precioNuevo
                })
            })
            .then(response => response.json())
            .then(data => {
                alert("Insumo agregado correctamente.");
                fetchInsumos(); // Recargar la tabla
                closeAddModal();
            })
            .catch(error => {
                console.error("Error al agregar insumo:", error);
                alert("Error al agregar insumo.");
            });
    
        } else {
            // Se trata de un insumo existente, se debe actualizar
            fetch(`http://localhost:5000/api/insumos/${encodeURIComponent(insumoSeleccionado)}`)
            .then(response => response.json())
            .then(insumoExistente => {
                if (!insumoExistente) {
                    alert("Error: Insumo no encontrado.");
                    return;
                }
            
                // Obtener la unidad de medida del insumo existente
                const unidadMedida = insumoExistente.unidad_medida;
            
                // Cálculo del promedio ponderado para el nuevo precio unitario
                const cantidadActual = parseFloat(insumoExistente.cantidad);
                const precioActual = parseFloat(insumoExistente.precio_unitario);
            
                const nuevaCantidadTotal = cantidadActual + cantidadNueva;
                const nuevoPrecioUnitario = parseFloat(
                    (((cantidadActual * precioActual) + (cantidadNueva * precioNuevo)) / nuevaCantidadTotal).toFixed(1)
                );
                            
                // Enviar actualización al backend
                fetch(`http://localhost:5000/api/insumos`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: insumoSeleccionado,
                        cantidad: nuevaCantidadTotal,
                        unidad_medida: unidadMedida, // Mantiene la unidad de medida existente
                        precio_unitario: nuevoPrecioUnitario
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert("Insumo actualizado correctamente.");
                    fetchInsumos(); // Recargar la tabla
                    closeAddModal();
                })
                .catch(error => {
                    console.error("Error al actualizar insumo:", error);
                    alert("Error al actualizar insumo.");
                });
            })
            .catch(error => {
                console.error("Error al obtener insumo:", error);
                alert("Error al obtener información del insumo.");
            });
            
        }
    }
    
    function modifyInsumo(event) {
        event.preventDefault(); 
    
        const nombre = document.getElementById("modifNombre").value.trim();
        const unidad = document.getElementById("modifUnidad").value.trim();
        const cantidad = document.getElementById("modifCantidad").value.trim();
        const precio = document.getElementById("modifPrecio").value.trim();
    
        if (!nombre || !unidad || !cantidad || !precio) {
            alert("Por favor, completa todos los campos.");
            return;
        }
    
        fetch("http://localhost:5000/api/insumos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                unidad_medida: unidad,
                cantidad: parseFloat(cantidad),
                precio_unitario: parseFloat(precio),
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al modificar el insumo");
            }
            return response.json();
        })
        .then(() => {
            alert("Insumo modificado con éxito");
            closeModifModal(); 
            fetchInsumos();  
        })
        .catch(error => {
            alert(error.message);
        });
    }

    function Eliminsumo() {
        if (!window.selectedInsumo) {
            alert("No hay insumo seleccionado para eliminar.");
            return;
        }

        fetch("http://localhost:5000/api/insumos", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: window.selectedInsumo.nombre
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar el insumo");
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            closeElimModal();
            fetchInsumos(); // Recargar la tabla
        })
        .catch(error => {
            alert(error.message);
        });
    }

    //COMIENZA MODULO RECETA

    function addReceta(event) {
        event.preventDefault();
    
        const nombre = document.getElementById("nombreReceta").value.trim();
        const precio = document.getElementById("precioReceta").value.trim();
        const precio2 = document.getElementById("precioReceta2").value.trim();
    
        if (!nombre || !precio) {
            alert("Por favor, completa todos los campos.");
            return;
        }
    
        fetch("http://localhost:5000/api/recetas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                precio_venta: parseFloat(precio),
                precio_venta_2: parseFloat(precio2),
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al agregar la receta");
            }
            return response.json();
        })
        .then(() => {
            alert("Receta agregada con éxito");
            closeAddModalRecetas();
            fetchRecetas(); 
        })
        .catch(error => {
            alert(error.message);
        });
    }
    
    function openModifModalRecetas() {
        if (!window.selectedReceta) {
            alert("Selecciona una receta para modificar.");
            return;
        }
    
        fetch("http://localhost:5000/api/recetas")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("modifNombreReceta");
                select.innerHTML = '<option value="">Selecciona una receta</option>'; 
    
                data.forEach(receta => {
                    const option = document.createElement("option");
                    option.value = receta.id;
                    option.textContent = receta.nombre;
    
                    if (window.selectedReceta && window.selectedReceta.id === receta.id) {
                        option.selected = true;
                    }
    
                    select.appendChild(option);
                });
    
                // ✅ Asegurar que el objeto tenga precio_venta_2 antes de asignarlo
                document.getElementById("modifPrecioReceta").value = window.selectedReceta.precio_venta ?? 0;
                document.getElementById("modifPrecioReceta2").value = window.selectedReceta.precio_venta_2 ?? 0; 
    
                // ✅ Escuchar cambios en el select para actualizar el campo de precio dinámicamente
                select.addEventListener("change", (event) => {
                    const selectedId = parseInt(event.target.value);
                    const selectedReceta = data.find(receta => receta.id === selectedId);
                    if (selectedReceta) {
                        document.getElementById("modifPrecioReceta").value = selectedReceta.precio_venta ?? 0;
                        document.getElementById("modifPrecioReceta2").value = selectedReceta.precio_venta_2 ?? 0;
                    }
                });
    
                document.getElementById("modifModalRecetas").style.display = "flex";
            })
            .catch(error => {
                alert("Error al cargar las recetas para modificar.");
                console.error(error);
            });
    }
    
    
    function modifyReceta(event) {
        event.preventDefault();
    
        const recetaId = document.getElementById("modifNombreReceta").value;
        const precio = document.getElementById("modifPrecioReceta").value.trim();
        const precio2 = document.getElementById("modifPrecioReceta2").value.trim();
    
        if (!recetaId || !precio || !precio2) {
            alert("Por favor, selecciona una receta y completa todos los campos.");
            return;
        }
    
        fetch(`http://localhost:5000/api/recetas/${recetaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: document.getElementById("modifNombreReceta").selectedOptions[0].text,
                precio_venta: parseFloat(precio),
                precio_venta_2: parseFloat(precio2),
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al modificar la receta");
            }
            return response.json();
        })
        .then(() => {
            alert("Receta modificada con éxito");
            closeModifModalRecetas();
            fetchRecetas(); // Recargar la tabla
        })
        .catch(error => {
            alert(error.message);
        });
    }

    function deleteReceta() {
        if (!window.selectedReceta) {
            alert("No hay receta seleccionada para eliminar.");
            return;
        }
    
        fetch(`http://localhost:5000/api/recetas/${window.selectedReceta.id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar la receta.");
            }
            return response.json();
        })
        .then(() => {
            alert(`Receta "${window.selectedReceta.nombre}" eliminada con éxito.`);
            closeElimModalRecetas();
            fetchRecetas();
        })
        .catch(error => {
            alert(error.message);
        });
    }

       //click de insumos
    document.getElementById("btnInsumos").addEventListener("click", fetchInsumos);

    //click a agregar insumo
    document.getElementById("btnAgregarInsumo").addEventListener("click", openAddModal);

    //Click a agregar insumo existente
    document.getElementById("insumoSelect").addEventListener("change", handleInsumoSelection);

    //click aceptar agregar insumo
    document.getElementById("btnAddInsumo").addEventListener("click", addInsumo);

    //click cancelar agregar insumo
    document.getElementById("btnCancelInsumo").addEventListener("click", closeAddModal);

    //click modificar insumo
    document.getElementById("btnModifInsumo").addEventListener("click", openModifModal);

     //click cancelar agregar insumo
     document.getElementById("btnmodcancelInsumo").addEventListener("click", closeModifModal);

     // click de abrir eliminar insumo
     document.getElementById("btnDelInsumo").addEventListener("click", openElimModal);
    // click de aceptar-eliminar insumo
    document.getElementById("btneliaceptInsumo").addEventListener("click", Eliminsumo);

    // click de cancelar-eliminar insumo
    document.getElementById("btnelicancelInsumo").addEventListener("click", closeElimModal);


    
    //click a recetas
    document.getElementById("btnRecetas").addEventListener("click", fetchRecetas);

    function limpiarVentanaRecetas() {
        document.getElementById("nombreReceta").value = "";  
        document.getElementById("precioReceta").value = "";  
    }

    function openAddModalRecetas() {
        limpiarVentanaRecetas();  
        document.getElementById("addModalRecetas").style.display = "flex";
    }

    // Click para abrir el modal de agregar receta
    document.getElementById("btnAgregarReceta").addEventListener("click", openAddModalRecetas);

     
    //click agregar receta
    document.getElementById("btnAddReceta").addEventListener("click", addReceta);


    
    //click cancelar agregar receta
    document.getElementById("btnCancelReceta").addEventListener("click", closeAddModalRecetas);


    // Click para abrir el modal de modificar receta
    document.getElementById("btnModifReceta").addEventListener("click", openModifModalRecetas);

    // Click para aceptar la modificación de la receta
    document.getElementById("btnModifRecetaAceptar").addEventListener("click", modifyReceta);

    // Click para cancelar la modificación de la receta
    document.getElementById("btnModifRecetaCancelar").addEventListener("click", closeModifModalRecetas);

    //click eliminar receta
    document.getElementById("btnDelReceta").addEventListener("click", openElimModalRecetas);
    //click aceptar eliminar receta
    document.getElementById("btnEliAceptReceta").addEventListener("click", deleteReceta);
    //click cancelar eliminar receta
    document.getElementById("btnEliCancelReceta").addEventListener("click", closeElimModalRecetas);

    function openReportes(){
        document.getElementById('modalReportes').style.display = "flex";
    }

    function closeReportes(){
        document.getElementById('modalReportes').style.display = "none";
    }


    //click abrir reportes
    document.getElementById("btnReportes").addEventListener("click", openReportes)


    function openClientes(){
        document.getElementById('modalClientes').style.display = "flex";
    }

    function closeClientes(){
        document.getElementById('modalClientes').style.display = "none";
    }

    //click abrir reporte clientes fecha
    document.getElementById("btnReporteClient").addEventListener("click", openClientes)

    //click cerrar reporte clientes fecha
    document.getElementById("btnCancelarCliente").addEventListener("click", closeClientes)


    //Open y cierre pedidos

    function openPedidos(){
        document.getElementById('modalPedidos').style.display = "flex";
    }

    function closePedidos(){
        document.getElementById('modalPedidos').style.display = "none";
    }

    //click abrir reporte Pedidos fecha
    document.getElementById("btnReporteTend").addEventListener("click", openPedidos)

    //click cerrar reporte Pedidos fecha
    document.getElementById("btnCancelarPedidos").addEventListener("click", closePedidos)


    //Open y cierre ventas

    function openAnalisis(){
        document.getElementById('modalAnalisis').style.display = "flex";
    }

    function closeAnalisis(){
        document.getElementById('modalAnalisis').style.display = "none";
    }

    //click abrir reporte ventas fecha
    document.getElementById("btnReporteCurrent").addEventListener("click", openAnalisis)

    //click cerrar reporte venta fecha
    document.getElementById("btnCancelarAnalisis").addEventListener("click", closeAnalisis)

    
     function closeAddModal() {
        addModal.style.display = "none";
    }

    function closeModalRecetas() {
        modalRecetas.style.display = "none";
    }




    // Agregar eventos a las cruces de los modales
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("closeAddModal").addEventListener("click", closeAddModal);
    document.getElementById("closeModifModal").addEventListener("click", closeModifModal);
    document.getElementById("closeElimModal").addEventListener("click", closeElimModal);
    document.getElementById("closeModalRecetas").addEventListener("click", closeModalRecetas);

    document.getElementById("closeAddModalRecetas").addEventListener("click", closeAddModalRecetas);

    document.getElementById("closeModifModalRecetas").addEventListener("click", closeModifModalRecetas);
    document.getElementById("closeElimModalRecetas").addEventListener("click", closeElimModalRecetas);
    document.getElementById('closeInsuRecet').addEventListener('click',closeModifInsumosRecetaModal);
    document.getElementById('closeVerVenta').addEventListener('click',closeVerVenta);
    document.getElementById('closeModalReportes').addEventListener('click',closeReportes);
    document.getElementById('closeModalCliente').addEventListener('click',closeClientes);
    document.getElementById('closeModalPedidos').addEventListener('click',closePedidos);
    document.getElementById('closeModalAnalisis').addEventListener('click',closeAnalisis);



    function closeaddVenta() {
        document.getElementById("addVenta").style.display = "none";
        // ✅ Reiniciar la tabla y el total de la venta
        document.getElementById("ventaTableBody").innerHTML = "";
        document.getElementById("totalVenta").textContent = "$0";
    }
    document.getElementById('closeaddVenta').addEventListener('click',closeaddVenta);
    
    
    
    document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // Detecta qué modal está activo
        if (addModal.style.display === "flex") {
            document.getElementById("btnAddInsumo").click(); // Llama al botón de agregar insumo
        } else if (modifModal.style.display === "flex") {
            document.getElementById("btnmodaceptInsumo").click(); // Llama al botón de modificar insumo
        } else if (elimModal.style.display === "flex") {
            document.getElementById("btneliaceptInsumo").click(); // Llama al botón de eliminar insumo
        } else if (modalRecetas.style.display === "flex") {
            document.getElementById("btnAddReceta").click(); // Llama al botón de agregar receta
        } else if (addModalRecetas.style.display === "flex") {
            document.getElementById("btnAddReceta").click(); // Llama al botón de aceptar receta
        } else if (modifModalRecetas.style.display === "flex") {
            document.getElementById("btnModifRecetaAceptar").click(); // Llama al botón de modificar receta
        } else if (elimModalRecetas.style.display === "flex") {
            document.getElementById("btnEliAceptReceta").click(); // Llama al botón de eliminar receta
        }
    }
});

});

