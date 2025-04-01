  function addTransaction(){
    var transactionType = document.getElementById("transactionInput").value;
    var description = document.getElementById("Description").value;
    var amount = parseFloat(document.getElementById("Amount").value);
    var total_expense = parseFloat(localStorage.getItem("total_expense")) || 0;
    var total_income =  parseFloat(localStorage.getItem("total_income")) || 0;
    var net_balance =  parseFloat(localStorage.getItem("net_balance")) || 0

    if (description === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }
    if(transactionType === "income"){
        if (!isNaN(amount)) {
            total_income = total_income + amount;
        } else {
            alert("Please enter a valid amount");
        }
    }
    if(transactionType === "expense"){
        if (!isNaN(amount)) {
            total_expense = total_expense + amount;
           
        } else {
            alert("Please enter a valid amount");
        }
    }
   
    var table = document.getElementById("TrackerTable");
    let newRow = table.insertRow(table.rows.length);

    // Insert data into cells of the new row
    newRow.insertCell(0).innerHTML = transactionType;
    newRow.insertCell(1).innerHTML = description.trim();
    newRow.insertCell(2).innerHTML = "$" + amount;
    newRow.insertCell(3).innerHTML =
        '<button onclick="editData(this)">Edit</button>' + '<button onclick="deleteData(this)">Delete</button>';
    
    var transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push({ type: transactionType, description: description, amount: amount });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    accountSummary(total_income, total_expense);
    clearInputs();
}

function editData(button){

    let row = button.parentNode.parentNode;

    let typeCell = row.cells[0];
    let descriptionCell = row.cells[1];
    let amountCell = row.cells[2];

    let total_income = parseFloat(localStorage.getItem("total_income")) || 0;
    let total_expense = parseFloat(localStorage.getItem("total_expense")) || 0;

    let previousType = typeCell.innerHTML.trim()
    let previousAmount =  parseFloat(amountCell.innerHTML.replace("$", "").trim())
   
    let typeInput = prompt("Enter transaction type (income/expense):", typeCell.innerHTML);
    if (!typeInput|| typeInput !== "income" && typeInput !== "expense") {
        alert("Invalid transaction type. Please enter 'income' or 'expense'.");
        return;
    }
    let descriptionInput = prompt("Enter the updated description:",descriptionCell.innerHTML);
    if (!descriptionInput) {
        alert("Description cannot be empty.");
        return;
    }
    let amountInput = prompt("Enter the updated amount: $", previousAmount);
    amountInput = parseFloat(amountInput);
    if (isNaN(amountInput) || amountInput <= 0) {
        alert("Please enter a valid positive number for amount.");
        return;
    }

    if(previousType === "income"){
        total_income -= previousAmount
    }else if(previousType === "expense"){
        total_expense -= previousAmount
    }

    typeCell.innerHTML = typeInput;
    descriptionCell.innerHTML = descriptionInput;
    amountCell.innerHTML = "$" +amountInput;

    if (typeInput === "income") {
        total_income += amountInput;
    } else if (typeInput === "expense") {
        total_expense += amountInput;
    } 

    updateLocalStorage();
    accountSummary(total_income, total_expense);

    
}

function deleteData(button){
    let row = button.parentNode.parentNode;
    let typeCell = row.cells[0];
    let descriptionCell = row.cells[1];
    let amountCell = row.cells[2];

    let previousAmount =  parseFloat(amountCell.innerHTML.replace("$", "").trim())

    let total_income = parseFloat(localStorage.getItem("total_income")) || 0;
    let total_expense = parseFloat(localStorage.getItem("total_expense")) || 0;
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let index = transactions.findIndex(transaction => 
        transaction.type === typeCell.innerHTML.trim() && 
        transaction.description === descriptionCell.innerHTML.trim() && 
        transaction.amount === parseFloat(amountCell.innerHTML.replace("$", "").trim()));
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (typeCell.innerHTML.trim().toLowerCase() === "income") {
        total_income -= previousAmount;
    } else if (typeCell.innerHTML.trim().toLowerCase() === "expense") {
        total_expense -= previousAmount;
    } 

    row.parentNode.removeChild(row);
    accountSummary(total_income, total_expense);
    
}

function accountSummary(total_income, total_expense){

    let net_balance = total_income - total_expense;
    document.getElementById("total_income").textContent = "Total Income: $" + total_income;
    document.getElementById("total_expense").textContent = "Total Expense: $" + total_expense;
    document.getElementById("net_balance").textContent = "Net Balance: $"+ net_balance;

    localStorage.setItem("total_income", total_income);
    localStorage.setItem("total_expense", total_expense);
    localStorage.setItem("net_balance", net_balance);
}    


function updateLocalStorage() {
    let table = document.getElementById("TrackerTable");
    let transactions = [];

    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let type = row.cells[0].innerHTML;
        let description = row.cells[1].innerHTML.trim();
        let amount = parseFloat(row.cells[2].innerHTML.replace("$", "").trim());

        transactions.push({ type: type, description: description, amount: amount });
    }

    localStorage.setItem("transactions", JSON.stringify(transactions));
}


function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let total_income = parseFloat(localStorage.getItem("total_income")) || 0;
    let total_expense = parseFloat(localStorage.getItem("total_expense")) || 0;

    
    let table = document.getElementById("TrackerTable");

    transactions.forEach(transaction => {
        let newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).innerHTML = transaction.type;
        newRow.insertCell(1).innerHTML = transaction.description;
        newRow.insertCell(2).innerHTML = "$" + transaction.amount.toFixed(2);
        newRow.insertCell(3).innerHTML =
            '<button onclick="editData(this)">Edit</button> <button onclick="deleteData(this)">Delete</button>';
    });
    accountSummary(total_income, total_expense)
}
window.onload = loadTransactions;

function clearInputs(){
    document.getElementById("transactionInput").value ="income";
    document.getElementById("Description").value ="";
    document.getElementById("Amount").value="";

}


function clearTransaction(button){

    localStorage.clear();
    location.reload(true)
    const table = document.getElementById('TrackerTable'); 
    while (table.rows.length > 1) {
    table.deleteRow(1);
}

}