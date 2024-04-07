// Seleção de elementos
const todoForm = document.querySelector("#to-do-form");
const todoInput = document.querySelector("#to-do-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");
// Ações que serão mapeadas pelo JS com as funcionalidades do Todo

let oldInputValue;


// Funções
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div"); // Cria uma div onde irá conter os elementos da tarefa como h3, buttons etc.
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3"); // Cria o elemento h3 da div
    todoTitle.innerText = text; // Adiciona o texto recebido da função saveTodo
    todo.appendChild(todoTitle); // Recebe o elemento h3

    // Cria os botões
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Coloca o botão finalizar tarefa dentro da linha da tarefa
    doneBtn.style.borderRadius = "5px"; // Adiciona um borderRadius ao botão
    doneBtn.style.padding = "10px"; // Adiciona um padding ao botão
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; // Coloca o botão editar tarefa dentro da linha da tarefa
    editBtn.style.borderRadius = "5px"; // Adiciona um borderRadius ao botão
    editBtn.style.padding = "10px"; // Adiciona um padding ao botão
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Coloca o botão deletar tarefa dentro da linha da tarefa
    deleteBtn.style.borderRadius = "5px"; // Adiciona um borderRadius ao botão
    deleteBtn.style.padding = "10px"; // Adiciona um padding ao botão
    todo.appendChild(deleteBtn);
    // Atalho para selecionar vários elementos, clique Ctrl + D


    // Utilizando dados da localStorage
    if (done) {
        todo.classList.add("done");
    }

    if (save) {
        saveTodoLocalStorage({ text, done: 0 });
    }

    // Coloca o todo na lista geral da div todo-list
    todoList.appendChild(todo);

    // Limpa o campo do input após o usuário clicar em adicionar
    todoInput.value = "";

    //Foca o cursor novamente no campo após o usuário digitar a tarefa
    todoInput.focus();

};

// Esconde um formulário e cria outro
const toggleForms = () => {
    editForm.classList.toggle("hide"); // Se a lista de edição não estiver sendo exibida, ela aparece ou é escondida
    todoForm.classList.toggle("hide"); // Esconde a lista de adicionar quando o usuário estiver editando uma tarefa
    todoList.classList.toggle("hide");

};

// Seleciona o todo para edição
const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo"); // Seleciona todos os Todos da classe .todo

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3"); // Seleciona o título do todo atual

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }

        // Utilizando dados da localStorage
        updateTodoLocalStorage(oldInputValue, text);
    });
}


// Criando a função de pesquisa
const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        todo.style.display = "flex";

        console.log(todoTitle);

        if (!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    });
};

// Criando os filtros
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));

            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );

            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );

            break;

        default:
            break;
    }
};


// Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault(); // Evita que o formulário seja enviado quando pressionado o botão

    const inputValue = todoInput.value; // Recebe o valor do input digitado pelo usuário para criar a tarefa

    if (inputValue) {
        // Salvar o Todo
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
    // Identifica o elemento no qual o usuário clicou e executa a ação de marcar como concluída
    const targetEl = e.target;
    const parentEl = targetEl.closest("div"); // Seleciona o elemento pai mais próximo, que nesse caso é o todo
    let todoTitle; // Possui nível global dentro do bloco de código

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText || "";
    }

    // Marcar como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done"); // Quando o usuário clica no botão concluir, o item é marcado ou desmarcado com o toggle

        updateTodoStatusLocalStorage(todoTitle);
    }

    // Remover tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle; // Deixa o valor da edição pré-preenchido
        oldInputValue = todoTitle; // Salva o valor na memória
    }
});


// Evento para cancelar a adição da tarefa
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});


// Deletando todas as tarefas
document.querySelector("#delete-all").addEventListener("click", (e) => {

    e.preventDefault();

    const deleteElements = document.querySelectorAll("#todo-list div");

    // Itera sobre cada elemento
    deleteElements.forEach((element) => {
        // Obtém o título da tarefa
        let todoTitle;
        if (element.querySelector("h3")) {
            todoTitle = element.querySelector("h3").innerText || "";
        }

        // Remove a tarefa do armazenamento local
        removeTodoLocalStorage(todoTitle);

        // Remove o elemento
        element.remove();
    });
});


// Sumbeter formulário de edição
editForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const editInputValue = editInput.value; //Recebe o valor novo digitado pelo usuário

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text != todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) =>
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();

