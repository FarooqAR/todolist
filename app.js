function init() {
    var form = document.getElementById("todo_form"),
        dialog = document.getElementById("dialog"),
        btnCloseDialog = document.getElementById("btn_close_dialog"),
        btnDeleteSelected = document.getElementById("btn_delete_selected"),
        btnDeleteTodo = document.getElementById("btn_delete_todo"),
        btnSaveTodo = document.getElementById("btn_save_todo"),
        inputTodo = document.getElementById("todo_input"),
        inputEditTodo = document.getElementById("edit_todo"),
        todoList = document.getElementById("todo_list");


    var todos = [],//collection of todo objects like {id:number, text:string}
        checkedTodos = [],// ids of todos whose checkboxes are checked
        currentOpenedTodo = null; // todo object for which edit dialog is currrently opened
    form.addEventListener("submit", function (e) {
        e.preventDefault();//prevents page from reloading
        todoText = inputTodo.value;
        todoText = /^\s*$/.test(todoText) ? false : todoText;//check if input value only contain spaces or nothing

        if (todoText) {
            addTodo(todoText);
        }
        inputTodo.value = "";
        inputTodo.focus();
    });

    btnCloseDialog.addEventListener("click", closeDialog);
    btnDeleteSelected.addEventListener("click", deleteSelectedTodos);
    btnDeleteTodo.addEventListener("click",function(){
        deleteTodo(currentOpenedTodo.id);
    });

    btnSaveTodo.addEventListener("click", function(){
        if(!/^\s*$/.test(inputEditTodo.value) && currentOpenedTodo.text !== inputEditTodo.value){
            editTodo(currentOpenedTodo.id , inputEditTodo.value);
        }
        closeDialog();
    });
    function openDialog() {
        dialog.className = "dialog open";
        inputEditTodo.value = currentOpenedTodo.text;
        inputEditTodo.focus();
    }

    function closeDialog() {
        dialog.className = "dialog close";
    }
    function editTodo(id, newText){
        currentOpenedTodo.text = newText;
        // refresh the dom
        var todoListItems = todoList.getElementsByTagName("li");
        for(var i = 0, l = todoListItems.length; i < l; i+=1){
            var el = todoListItems[i];
            var dataId = el ? +el.getAttribute("data-id") : -1;
            if(dataId == id){
                el.getElementsByTagName("p")[0].innerText = newText;
                
                break;
            }
        }
        // refresh the list
        for(var i = 0, l = todos.length; i < l; i += 1){
            if(todos[i].id == id){
                todos[i].text = newText;
                break;
            }
        }
    }
    function deleteSelectedTodos() {
        // remove todos with selected ids from the list
        todos = todos.filter(function (todo) {
            return checkedTodos.indexOf(todo.id) == -1;
        });

        // refresh dom
        var todoListItems = todoList.getElementsByTagName("li");
        for(var i = 0, l = todoListItems.length; i < l; i++){
            var el = todoListItems[i];
            var id = el ? +el.getAttribute("data-id") : -1;
            if(checkedTodos.indexOf(id) >= 0){
                todoList.removeChild(todoListItems[i]);
                i--;
            }
        }
        
        checkedTodos = [];
        hideBtnSelected();
    }
    function deleteTodo(id){
        todos = todos.filter(function (todo) {
            return todo.id !== id;
        });
        deleteCheckedId(id);//delete id from checked list if exists
        //refresh dom
        var todoListItems = todoList.getElementsByTagName("li");
        for(var i = 0, l = todoListItems.length; i < l; i++){
            var el = todoListItems[i];
            var dataId = el ? +el.getAttribute("data-id") : -1;
            if(dataId == id){
                    todoList.removeChild(todoListItems[i]);
                closeDialog();
                break;
            }
        }
        
    }
    function deleteCheckedId(id){
        checkedTodos = checkedTodos.filter(function(checkedId){
            return checkedId !== id;
        });
        if(checkedTodos.length == 0){
            hideBtnSelected();
        }
    }
    function hideBtnSelected(){
        btnDeleteSelected.style.display = "none";
    }
    function addTodo(todoText) {
        var li = document.createElement("li");
        var todoId = todos.length;
        var todo = {id: todoId, text: todoText};
        //data-id will be used to identify todos later
        li.setAttribute("data-id", todoId);

        li.innerHTML = "<label for='checkbox"+todoId+"'>" +
            "<input type='checkbox' id='checkbox"+todoId+"' class='check_todo'/>" +
            "</label>" +
            "<p>" + todoText + "</p>" +
            "<button class='btn btn_edit_todo'></button>";
        
        todoList.insertBefore(li, todoList.firstChild);// insert the todo at the top
        li.getElementsByClassName("btn_edit_todo")[0].onclick = (function(t){
            return function(){
                currentOpenedTodo = todo;
                openDialog();
            }
        })(todo);
        // change display of btn_delete_selected when an item is checked
        li.getElementsByClassName("check_todo")[0].onclick = (function (id) {
            return function () {
                if (this.checked) {
                    checkedTodos.push(id);
                } else {
                    deleteCheckedId(id);
                }
                if (checkedTodos.length > 0) {
                    btnDeleteSelected.style.display = "inline-block";
                } else {
                    btnDeleteSelected.style.display = "none";
                }
                
            }
        })(todoId);

        todos.push(todo);
        
    }
}

window.onload = init;