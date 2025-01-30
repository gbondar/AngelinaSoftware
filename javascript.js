document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const insumosContainer = document.getElementById("insumos-container");

     // Asegurar que el modal esté oculto al inicio
     modal.style.display = "none";

    document.querySelector("button").addEventListener("click", fetchInsumos);

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

    function renderTable(data) {
        insumosContainer.innerHTML = ""; // Limpiar contenido anterior
        
        const table = document.createElement("table");
        table.classList.add("insumos-table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Precio Unitario</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector("tbody");
        data.forEach(insumo => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${insumo.nombre}</td>
                <td>${insumo.cantidad}</td>
                <td>${insumo.unidad_medida}</td>
                <td>$${insumo.precio_unitario}</td>
            `;
            tbody.appendChild(row);
        });

        insumosContainer.appendChild(table);
    }

    function openModal() {
        modal.style.display = "block";
    }

    window.closeModal = function () {
        modal.style.display = "none";
    };

    // Cerrar el modal si se hace clic fuera del contenido
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };
});
