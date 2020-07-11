(function () {

    $(document).ready(function () {
        if (localStorage.getItem("chores") == null)
            localStorage.setItem("chores", JSON.stringify([]));
        else
            loadChores();
    });

    const addIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4a.5.5 0 0 0-1 0v3.5H4a.5.5 0 0 0 0 1h3.5V12a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4z"/>
                    </svg>`;
                    
    const editIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>`;

    const deleteIcon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>`;
                     //Add Event Listener
    
    const doneIcon = `<i class="fas fa-tasks"></i>`;

    const buttonAdd = document.querySelector('#btnAdd');
    const buttonEdit = document.querySelector('#btnUpdate');
    const buttonDelete = document.querySelector('#btnDelete');    
    const buttonDeleteAll = document.querySelector('#btnDeleteAll');
    const statusItems = document.querySelectorAll('#ddlStatus li');
    const priorityItems = document.querySelectorAll('#ddlPriority li');

    //https://gist.github.com/gordonbrander/2230317    
    const ID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    buttonAdd.addEventListener('click', (e) => {
        const choreText = $('#txtChore').val();
        if(!choreText){
            //ShowErrorMessage('Type something to save!', 5000);
            return;
        }
        const noteID = ID();
        const createdAt = Date.now();
        const updatedAt = Date.now();
        let chore = {
            id: noteID,
            text: choreText,
            status:"1",
            completed:false,
            priority:"1",
            sorting:0,           
            createdAt: createdAt,
            updatedAt: updatedAt
        }
        setChore(chore);        
        loadChores();
    });

    buttonEdit.addEventListener('click', (e)=>{
        let text = $('#txtUpdateChore').val();
            
        const itemID = $('#hdID').val();
        const status = $('#btnStatus')[0].dataset.value;
        const priority = $('#btnPriority')[0].dataset.value;        
        const sorting = $('#txtSorting').val();
        let item = {
            text,
            priority,
            status,
            sorting
        } 
        editChore(item, itemID); 
        $('#updateModal').modal('hide');
        loadChores();
    });

    buttonDelete.addEventListener('click', (e)=>{
        const itemID = $('#hdDeleteId').val();
        deleteChore(itemID);
        $('#deleteModal').modal('hide');
        loadChores();
    });

    buttonDeleteAll.addEventListener('click', (e)=>{        
        deleteChores();
        $('#deleteModal').modal('hide');
        loadChores();
        $('#txtChore').focus();
    }); 

    statusItems.forEach( items => {
        items.addEventListener('click', (e)=>{
            let menuItem = $(e.target)[0];
            let selectedValue = menuItem.dataset.value;
            const UIParent = menuItem.parentNode.parentNode;
            const itemID = UIParent.dataset.itemId;
            let button = $(UIParent).prev(".dropdown-toggle");
            button[0].dataset.value = menuItem.dataset.value;            
            let spanText = $(button[0].childNodes);
            spanText[1].textContent = menuItem.text;            
            //btnText[0].textContent = " " + ;            
        });
    });

    priorityItems.forEach( items => {
        items.addEventListener('click', (e)=>{
            let menuItem = $(e.target)[0];
            let selectedValue = menuItem.dataset.value;
            const UIParent = menuItem.parentNode.parentNode;
            const itemID = UIParent.dataset.itemId;
            let button = $(UIParent).prev(".dropdown-toggle");
            button[0].dataset.value = menuItem.dataset.value;
            let spanText = $(button[0].childNodes);
            spanText[1].textContent = menuItem.text;            
            //btnText[0].textContent = " " + ;            
        });
    });

    $('#deleteModal').on('show.bs.modal', function(event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const itemID = button.data('itemId'); // Extract info from data-* attributes       
        const deleteAll = button.data('action');
        let modal = $(this);                
        
        if(itemID){
            modal.find('.modal-body #hdDeleteId').val(itemID);   
            modal.find('.modal-footer button[name="btnDelete"]').show();
            modal.find('.modal-footer button[name="btnDeleteAll"]').hide();
            modal.find('.modal-header h5').text('Delete Chore');
        }else if(deleteAll){
            modal.find('.modal-header h5').text('Delete All Chores');
            modal.find('.modal-footer button[name="btnDelete"]').hide();
            modal.find('.modal-footer button[name="btnDeleteAll"]').show();
        }      
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        
    });

    $('#updateModal').on('show.bs.modal', function(event){
        const button = $(event.relatedTarget); // Button that triggered the modal
        const itemID = button.data('itemId'); // Extract info from data-* attributes
        const item = getChore(itemID);     
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        let modal = $(this);       
        modal.find('.modal-body input').val(item[0].text);
        modal.find('.modal-body input[type=hidden]').val(item[0].id);     
        const statusMenuItems = document.querySelectorAll('.modal-body ul#ddlStatus li a');
        
        let btnStatus = document.querySelector('#btnStatus');
        let spanTextStatus = $(btnStatus.childNodes);                
        spanTextStatus[1].textContent = "Choose"; 
        btnStatus.dataset.value = 1;                                 
        statusMenuItems.forEach(menuItem=>{                            
            if(menuItem.dataset.value === item[0].status){                
                spanTextStatus[1].textContent = menuItem.text; 
                btnStatus.dataset.value = menuItem.dataset.value;                                 
            }
        });
        
        const priorityMenuItems = document.querySelectorAll('.modal-body ul#ddlPriority li a');

        let btnPriority = document.querySelector('#btnPriority');
        let spanTextPriority = $(btnPriority.childNodes);
        spanTextPriority[1].textContent = "Choose"; 
        btnPriority.dataset.value = "1";                                 
        priorityMenuItems.forEach(menuItem=>{                                    
            if(menuItem.dataset.value === item[0].priority){                
                spanTextPriority[1].textContent = menuItem.text; 
                btnPriority.dataset.value = menuItem.dataset.value;                                 
            }
        });

        $('#txtSorting').val(item[0].sorting);
    });


    function loadChores() {
        const choreList = document.querySelector('#chore-list');
        choreList.innerHTML = "";
        const chores = getAllChores();        
        if (chores && chores.length > 0) {
            $('#btnDeleteAllModal').show();
            let choreElementsArray = [];
            for (let i = 0; i < chores.length; i++) {
                let listItem = `<li class="list-group-item clearfix text-wrap">                                  
                                    ${chores[i].text}
                                    
                                    <span class="float-right">                                       
                                        <span class="btn btn-primary"
                                            data-item-id="${chores[i].id}"
                                            data-toggle="modal"
                                            data-target="#updateModal">
                                            ${editIcon}
                                        </span>
                                        <span class="btn btn-danger" 
                                                data-item-id="${chores[i].id}"
                                                data-toggle="modal"
                                                data-target="#deleteModal"
                                                >
                                            ${deleteIcon}
                                        </span>                                    
                                                                                                                                                           
                                    </span>
                                    
                                    <div class="row mt-2 h5">
                                        <span class="badge badge-secondary">${getPriorityValue(chores[i].priority)}</span>
                                        <span class="badge badge-secondary"> ${getStatusValue(chores[i].status)} </span>
                                        <span class="badge badge-info">${chores[i].sorting}</span>
                                    </div>
                                    </li>`;
                
                choreList.innerHTML += listItem;                            
            }
        } else {
            $('#btnDeleteAllModal').hide();
        }
      
    };

    const getStatusValue = (status) => {
        switch (status) {
            case "1":
                return "To Do";
            case "2":
                return "In Progress";
            case "3":
                return "Done";
            default:
                return "To Do";
        }
    }

    const getPriorityValue = (priority) => {
        switch (priority) {
            case "1":
                return `<i class="fas fa-arrow-down text-warning"></i> Low`;;
            case "2":
                return `<i class="fas fa-arrow-up text-warning"></i> Medium`;;
            case "3":
                return `<i class="fas fa-arrow-up text-danger"></i> High`;
            case "4":
                return `<i class="fas fa-arrow-up text-danger"></i> Highest`;
            default:
                return `<i class="fas fa-arrow-down text-warning"></i> Low`;
        }
    }

    const setChore = (chore) => {
        let choresString = localStorage.getItem("chores");
        if (!chore) {
            //Error Message
            return;
        }

        let chores = JSON.parse(choresString);
        chores.push(chore);
        localStorage.setItem("chores", JSON.stringify(chores));
        $('#txtChore').val('');
        $('#txtChore').focus();
    }

    const editChore = (item, ID) => {
        let chores = getAllChores();
        for(let i = 0; i < chores.length; i++){
            if(chores[i].id !== ID)
                continue;

                chores[i].text = item.text;
                chores[i].sorting = item.sorting;
                chores[i].status = item.status;
                chores[i].priority = item.priority;
                chores[i].updatedAt = Date.now();            
        }
        localStorage.setItem("chores", JSON.stringify(chores));        
    }

    function getAllChores() {
        return JSON.parse(localStorage.getItem("chores"));
    }

    const getChore = (id) => {
        let chores = getAllChores();
        return chores.filter((item)=>{
            return item.id == id;
        });
    }

    const deleteChore = (id) => {
        let oldChores = getAllChores();
        let newChores = oldChores.filter((chore)=> chore.id !== id);
        localStorage.setItem("chores", JSON.stringify(newChores));
    }

    const deleteChores = () => {
        localStorage.setItem("chores", JSON.stringify([]));
    }

    function ShowSuccessMessage(message, time){
        let alert = document.querySelector('#messageDiv');        
        alert.innerHTML =   `<div class="alert alert-success" role="alert">
                                <strong>Success!</strong> ${message}
                            </div>`; 
        setTimeout(() => {
            $('.alert-success').alert('close');
        }, time);
    }

    function ShowErrorMessage(message, time){
        let alert = document.querySelector('#messageDiv');        
        alert.innerHTML =   `<div class="alert alert-danger" role="alert">
                                ${message}
                            </div>`; 
        setTimeout(() => {
            $('.alert-danger').alert('close');
        }, time);
    }
}());

