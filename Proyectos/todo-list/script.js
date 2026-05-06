let tareas = [];

function agregarTarea() {
    const input = document.getElementById("tareaInput");
    const texto = input.value.trim();

    if (texto === "") return;

    tareas.push({
        texto: texto,
        completada: false
    });

    guardarTareas();
    mostrarTareas();

    input.value = "";
}

function mostrarTareas() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    tareas.forEach((tarea, index) => {

        const li = document.createElement("li");

        if (tarea.completada) {
            li.classList.add("completada");
        }

        const span = document.createElement("span");
        span.textContent = tarea.texto;

        const botones = document.createElement("div");
        botones.classList.add("botones");

        const btnCompletar = document.createElement("button");
        btnCompletar.textContent = "✓";

        btnCompletar.onclick = function () {
            tareas[index].completada = !tareas[index].completada;
            guardarTareas();
            mostrarTareas();
        };

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "🗑";

        btnEliminar.onclick = function () {
            tareas.splice(index, 1);
            guardarTareas();
            mostrarTareas();
        };

        botones.appendChild(btnCompletar);
        botones.appendChild(btnEliminar);

        li.appendChild(span);
        li.appendChild(botones);

        lista.appendChild(li);
    });
}

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarTareas() {
    const data = localStorage.getItem("tareas");

    if (data) {
        tareas = JSON.parse(data);
        mostrarTareas();
    }
}

document
.getElementById("tareaInput")
.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        agregarTarea();
    }
});

cargarTareas();