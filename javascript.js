document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("button");
    button.addEventListener("click", fetchInsumos);
});

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
        })
        .catch(error => {
            alert(error.message);
        });
}

function renderTable(data) {
    const container = document.getElementById("insumos-container");
    container.innerHTML = ""; // Limpiar contenido anterior
    
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
    
    container.appendChild(table);
}
