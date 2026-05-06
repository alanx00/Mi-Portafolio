let tareas = [];
function agregarTarea() {
    const input =
        document.getElementById('tareaInput');
        const texto = input.value;

        if (texto === '') return; 

        tareas.push(texto);
        guardarTareas();
        mostrarTareas();

        input.value = '';
}
function mostrarTareas() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    tareas.forEach((tarea, index) => {
        const li = document.createElement('li');
        li.textContent = tarea;

        li.onclick = function() {
            tareas.splice(index, 1);
            guardarTareas();
            mostrarTareas();
        };
        lista.appendChild(li);
    });}
    
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function cargarTareas() {
    const data = localStorage.getItem('tareas');
    if (data) {
        tareas = JSON.parse(data);
        mostrarTareas();
    }
}
cargarTareas();