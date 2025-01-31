document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const addModal = document.getElementById("addModal");
    const modifModal = document.getElementById("modifModal");
    const insumosContainer = document.getElementById("tableBody");

    // Asegurar que los modales inicien cerrados
    modal.style.display = "none";
    addModal.style.display = "none";
    modifModal.style.display = "none";
    


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

    // Agregar eventos a las cruces de los modales
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("closeAddModal").addEventListener("click", closeAddModal);
    document.getElementById("closeModifModal").addEventListener("click", closeModifModal);


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
            insumosContainer.appendChild(row);
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

    function openModifModal()  {
        modifModal.style.display = "flex";
    }

    function closeModifModal() {
        modifModal.style.display = "none";
    }



    //Aqui empiezan las funciones de eventos que modifican la bbdd

    function addInsumo(event) {
        event.preventDefault(); 

        const nombre = document.getElementById("nombre").value.trim();
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
    
    //Cierra al tocar afuera de los modals
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        } else if (event.target === addModal) {
            closeAddModal();
        }
    };
});
