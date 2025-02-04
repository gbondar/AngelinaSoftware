document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const addModal = document.getElementById("addModal");
    const modifModal = document.getElementById("modifModal");
    const insumosContainer = document.getElementById("tableBody");

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
    


    //click de insumos
    document.getElementById("btnInsumos").addEventListener("click", fetchInsumos);

    //click a agregar insumo
    document.getElementById("btnAgregarInsumo").addEventListener("click", openAddModal);

    //click aceptar agregar insumo
    document.getElementById("btnAddInsumo").addEventListener("click", addInsumo);

    //click cancelar agregar insumo
    document.getElementById("btnCancelInsumo").addEventListener("click", closeAddModal);

    //click modificar insumo
    document.getElementById("btnModifInsumo").addEventListener("click", openModifModal);

    //click modificar-aceptar insumo
    document.getElementById("btnmodaceptInsumo").addEventListener("click", modifyInsumo);

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

    function openAddModal() {
        addModal.style.display = "flex";
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

    function openModifModal() {
        fetch("http://localhost:5000/api/insumos")
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById("modifNombre");
                select.innerHTML = '<option value="">Selecciona un insumo</option>'; // Resetear opciones
    
                data.forEach(insumo => {
                    const option = document.createElement("option");
                    option.value = insumo.nombre;
                    option.textContent = insumo.nombre;
    
                    // Si el insumo seleccionado es el mismo, se preselecciona
                    if (window.selectedInsumo && window.selectedInsumo.nombre === insumo.nombre) {
                        option.selected = true;
                    }
    
                    select.appendChild(option);
                });
    
                // Función para actualizar los campos al cambiar el select
                function updateFields(selectedName) {
                    const selectedInsumo = data.find(insumo => insumo.nombre === selectedName);
                    if (selectedInsumo) {
                        document.getElementById("modifUnidad").value = selectedInsumo.unidad_medida;
                        document.getElementById("modifCantidad").value = selectedInsumo.cantidad;
                        document.getElementById("modifPrecio").value = selectedInsumo.precio_unitario;
                    } else {
                        document.getElementById("modifUnidad").value = "";
                        document.getElementById("modifCantidad").value = "";
                        document.getElementById("modifPrecio").value = "";
                    }
                }
    
                // Si ya había un insumo seleccionado, actualizar los campos al abrir el modal
                if (window.selectedInsumo) {
                    updateFields(window.selectedInsumo.nombre);
                }
    
                // Escuchar cambios en el select para actualizar los campos dinámicamente
                select.addEventListener("change", (event) => {
                    updateFields(event.target.value);
                });
    
                modifModal.style.display = "flex";
            })
            .catch(error => {
                alert("Error al cargar los insumos para modificar.");
                console.error(error);
            });
    }
    
    
    
    function closeModifModal() {
        modifModal.style.display = "none";
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

    function addInsumo(event) {
        event.preventDefault(); 

        const nombre = document.getElementById("nombre").value;
        const unidad = document.getElementById("unidad").value.trim();
        const cantidad = document.getElementById("cantidad").value.trim();
        const precio = document.getElementById("precio").value.trim();

        if (!nombre || !unidad || !cantidad || !precio) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        fetch("http://localhost:5000/api/insumos", {
            method: "POST",
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
                throw new Error("Error al agregar el insumo");
            }
            return response.json();
        })
        .then(() => {
            alert("Insumo agregado con éxito");
            closeAddModal();
            fetchInsumos(); 
        })
        .catch(error => {
            alert(error.message);
        });
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

