
const state = {
    earning: 0,
    expense: 0,
    net: 0,
    transactions: [
        // {
        // id: 120,
        // text: "demo creadit",
        // amount: 500,
        // type: "creadit",
        // },
    ]
}

// Local Storage Helpers
const saveToLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
};

const loadFromLocalStorage = () => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (savedTransactions && Array.isArray(savedTransactions)) {
        state.transactions = savedTransactions;
    }
};

let isUpdate = false;
let tId;


const transactionsForm = document.getElementById("transactions-form");

const renderTrasactions = () => {
    const transactionContainerEl = document.querySelector(".transactions");
    const netAmmountEl = document.getElementById("netAmmount");
    const earningEl = document.getElementById("earning");
    const expenseEl = document.getElementById("expense");
    const darkModeToggle = document.getElementById("darkModeToggle");

    const transactions = state.transactions;


    let earning = 0;
    let expense = 0;
    let net = 0;

    transactionContainerEl.innerHTML = "";
    transactions.forEach((transaction) => {

        const {id,text,amount,type} = transaction;
        const isCredit = type === "creadit" ? true : false;
        const sign = isCredit ? "+" : "-"


        transactionElement = `
        <div class="transaction" id="${id}">
            <div class="content" onClick="showEdit(${id})">
                <div class="left">
                <p>${text}</p>
                <p>${sign} Rs ${amount}</p>
                </div>
                <div class="status ${isCredit ? "credit" : "debit"}">${isCredit ? "C" : "D"}</div>
            </div>
            <div class="lower">
                <div class="icon" onClick="elementUpdate(${id})">
                    <img src="./pen.svg" alt="pen">
                </div>
                <div class="icon" onClick="elementDelete(${id})">
                    <img src="./trash.svg" alt="trash">
                </div>
            </div>
        </div>`;

        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;

        transactionContainerEl.insertAdjacentHTML('afterbegin', transactionElement)

    });

    console.log(net,earning,expense)

    netAmmountEl.innerHTML = `Rs ${net}`;
    earningEl.innerHTML = `Rs ${earning}`;
    expenseEl.innerHTML =`Rs ${expense}`;
}

const addTransaction = (e) => {
    e.preventDefault();
    const isEarn = e.submitter.id === "earnBtn" ? true : false;
    const formData = new FormData(transactionsForm);
    const tData = {};
    formData.forEach((value, key) => {
        tData[key] = value;
    });

    const { text, amount } = tData;

    //  empty input
    if (!text.trim() || !amount.trim() || isNaN(amount) || Number(amount) === 0) {
        alert("Please enter a valid description and a non-zero amount.");
        return;
    }

    const transaction = {
        id: isUpdate ? tId : Math.floor(Math.random() * 1000),
        text: text,
        amount: +amount,
        type: isEarn ? "creadit" : "debit",
    }

    if(isUpdate){
        const tIndex = state.transactions.findIndex((t) => t.id === tId);
        state.transactions[tIndex] = transaction;
        isUpdate = false;
        tId = null;
    }else{
         state.transactions.push(transaction);
    }
    saveToLocalStorage(); 
    transactionsForm.reset();
    renderTrasactions();

    console.log({ state });
}

const showEdit = (id) => {
    const selectedTrasaction = document.getElementById(id);
    const lowerEl = selectedTrasaction.querySelector(".lower")
    lowerEl.classList.toggle("showLower")
}

const elementUpdate = (id) => {
    const transactionFind = state.transactions.find((t) => t.id === id);
    const {text, amount} = transactionFind;
    const textInput = document.getElementById("text");
    const amountInput = document.getElementById("amount");

    textInput.value = text;
    amountInput.value = amount;
    tId = id;
    isUpdate = true;
    console.log({text, amount});
}

const elementDelete = (id) => {
    filteredTransaction = state.transactions.filter((t) => t.id !== id)
    state.transactions = filteredTransaction;
    saveToLocalStorage();
    renderTrasactions();
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

loadFromLocalStorage();

renderTrasactions();
transactionsForm.addEventListener("submit", addTransaction)
