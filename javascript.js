document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const addModal = document.getElementById("addModal");
    const modifModal = document.getElementById("modifModal");
    const insumosContainer = document.getElementById("tableBody");
    const modifNombre = document.getElementById("modifNombre");
    const modifCampo = document.getElementById("modifCampo");
    const inputsModif = document.getElementById("inputsModif");

    // Asegurar que los modales inicien cerrados
    modal.style.display = "none";
    addModal.style.display = "none";
    modifModal.style.display = "none";
    elimModal.style.display = "none";

   
    modalRecetas.style.display = "none";
    addModalRecetas.style.display = "none";
    modifModalRecetas.style.display = "none";
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

    // Click para abrir el modal de agregar receta
    document.getElementById("btnAgregarReceta").addEventListener("click", function() {
        document.getElementById("addModalRecetas").style.display = "flex";
    });

     
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


    // Agregar eventos a las cruces de los modales
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("closeAddModal").addEventListener("click", closeAddModal);
    document.getElementById("closeModifModal").addEventListener("click", closeModifModal);
    document.getElementById("closeElimModal").addEventListener("click", closeElimModal);
    document.getElementById("closeModalRecetas").addEventListener("click", closeModalRecetas);

    document.getElementById("closeAddModalRecetas").addEventListener("click", closeAddModalRecetas);

    document.getElementById("closeModifModalRecetas").addEventListener("click", closeModifModalRecetas);
    document.getElementById("closeElimModalRecetas").addEventListener("click", closeElimModalRecetas);

    

    
    
    


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
                console.log("Recetas obtenidas:", data);
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
    
    
    

    //Esta funcion le da formato a la tabla que se muestra al abrir insumos

    function renderTable(data) {
        insumosContainer.innerHTML = ""; 
        data.forEach(insumo => {
            const row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${insumo.nombre}</td>
                <td>${insumo.cantidad}</td>
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
                <td>${receta.precio_venta}</td>
            `;
    
            // Evento para seleccionar una fila
            row.addEventListener("click", () => {
                document.querySelectorAll("#tableBodyRecetas tr").forEach(tr => tr.classList.remove("selected"));
                row.classList.add("selected");
    
                // Guarda la receta seleccionada en una variable global
                window.selectedReceta = {
                    id: receta.id,
                    nombre: receta.nombre,
                    precio_venta: receta.precio_venta
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
                    option.textContent = insumo.nombre;
                    select.appendChild(option);
                });
    
                // Agregar opción "Agregar nuevo..."
                const newOption = document.createElement("option");
                newOption.value = "nuevo";
                newOption.textContent = "Agregar nuevo...";
                select.appendChild(newOption);
    
                document.getElementById("nuevoInsumoFields").style.display = "none";
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

    function closeAddModal() {
        addModal.style.display = "none";
    }

    function closeModalRecetas() {
        modalRecetas.style.display = "none";
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
            closeModifModal();  // Cierra el modal correcto
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
                select.innerHTML = '<option value="">Selecciona una receta</option>'; // Resetear opciones
    
                data.forEach(receta => {
                    const option = document.createElement("option");
                    option.value = receta.id;
                    option.textContent = receta.nombre;
    
                    if (window.selectedReceta && window.selectedReceta.id === receta.id) {
                        option.selected = true;
                    }
    
                    select.appendChild(option);
                });
    
                // Precargar los valores en los campos
                document.getElementById("modifPrecioReceta").value = window.selectedReceta.precio_venta;
    
                // Escuchar cambios en el select para actualizar el campo de precio dinámicamente
                select.addEventListener("change", (event) => {
                    const selectedId = parseInt(event.target.value);
                    const selectedReceta = data.find(receta => receta.id === selectedId);
                    if (selectedReceta) {
                        document.getElementById("modifPrecioReceta").value = selectedReceta.precio_venta;
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
    
        if (!recetaId || !precio) {
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

    
    
    
    //Cierra al tocar afuera de los modals
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        } else if (event.target === addModal) {
            closeAddModal();
        }
    };
});

