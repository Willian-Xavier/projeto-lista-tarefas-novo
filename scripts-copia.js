// Seleção de elementos
const todoForm = document.querySelector("#to-do-form");
const todoInput = document.querySelector("#to-do-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
// Ações que serão mapeadas pelo JS com as funcionalidades do Todo

let oldInputValue;


// Funções
const saveTodo = (text) => {
    const todo = document.createElement("div"); // Cria uma div onde irá conter os elementos da tarefa como h3, buttons etc.
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3"); // Cria o elemento h3 da div
    todoTitle.innerText = text; // Adiciona o texto recebido da função saveTodo
    todo.appendChild(todoTitle); // Recebe o elemento h3

    // Cria os botões
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Coloca o botão finalizar tarefa dentro da linha da tarefa
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; // Coloca o botão editar tarefa dentro da linha da tarefa
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Coloca o botão deletar tarefa dentro da linha da tarefa
    todo.appendChild(deleteBtn);
    // Atalho para selecionar vários elementos, clique Ctrl + D

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

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;
        }

    });
}

// Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault(); // Evita que o formulário seja enviado quando pressionado o botão

    const inputValue = todoInput.value; // Recebe o valor do input digitado pelo usuário para criar a tarefa

    if (inputValue){
        // Salvar o Todo
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) =>{
    // Identifica o elemento no qual o usuário clicou e executa a ação de marcar como concluída
    const targetEl = e.target;
    const parentEl = targetEl.closest("div"); // Seleciona o elemento pai mais próximo, que nesse caso é o todo
    let todoTitle; // Possui nível global dentro do bloco de código

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Marcar como concluída
    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done"); // Quando o usuário clica no botão concluir, o item é marcado ou desmarcado com o toggle
    }

    // Remover tarefa
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();
    }

    // Editar tarefa
    if(targetEl.classList.contains("edit-todo")){
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

// Sumbeter formulário de edição
editForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const editInputValue = editInput.value; //Recebe o valor novo digitado pelo usuário

    if(editInputValue){
        updateTodo(editInputValue);
    }

    toggleForms();
});
