var budgetController = (function() {

    var currentIncome = document.querySelector('.budget__income--value');
    var currentExpenses = document.querySelector('.budget__expenses--value');
    var newIncome;
    var newExpense;

    function calculate(newItem) {
    if (newItem.incomeOrExpense == 'inc') {
        newIncome = parseFloat(currentIncome.textContent.slice(2)); // Remove the + and convert the string to a number.
        newIncome = newIncome + parseFloat(newItem.number);
    } else {
        newExpense = parseFloat(currentExpenses.textContent.slice(2)); // Remove the - and convert the string to a number.
        newExpense = newExpense + parseFloat(newItem.number);
    }
    }
    // Subtract the total expenses from the total income, then update the budget value.

    // For expenses, calculate the percentage of the income that the expense represents.

    return {
        updateNumbers: function(newItem) {
            calculate(newItem);
        },
        get newIncome () { return newIncome },
        get newExpense () { return newExpense }
    }
})();

var uiController = (function() {

    var listOfIncome = [];
    var listOfExpenses = [];

    function addItemToUi(newItem) {
        var arrLength;
        var list;
        if (newItem.incomeOrExpense == 'inc') {
            newItem.number = '+ ' + newItem.number;
            listOfIncome.push(newItem);
            arrLength = listOfIncome.length;
            list = document.querySelector('.income__list');
            duplicateDiv('income', newItem, arrLength, list);
        } else {
            newItem.number = '- ' + newItem.number;
            listOfExpenses.push(newItem);
            arrLength = listOfExpenses.length;
            list = document.querySelector('.expenses__list');
            duplicateDiv('expense', newItem, arrLength, list);
        }
    }

    function duplicateDiv(elementName, obj, arrLength, list) {
        var htmlToParse;
        if (elementName == 'income') {
            htmlToParse = '<div class="item clearfix" id="income-"><div class="item__description"></div><div class="right clearfix"><div class="item__value"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else {
            htmlToParse = '<div class="item clearfix" id="expense-"><div class="item__description"></div><div class="right clearfix"><div class="item__value"></div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        list.insertAdjacentHTML('beforeend', htmlToParse);
        var elementId = elementName + '-' + (arrLength - 1);
        document.getElementById(elementName + '-').id = elementId;
        document.getElementById(elementId).querySelector('.item__description').textContent = obj.description; 
        document.getElementById(elementId).querySelector('.item__value').textContent = obj.number;
        if (elementName == 'expense') {
            document.getElementById(elementId).querySelector('.item__percentage').textContent = 'placeholder';
        }
    }

    function updateIncomeOrExpenseTotal () {
        //currentIncome.textContent = '+ ' + newIncome;
    }

    return {
        updateUi: function(newItem) {
            addItemToUi(newItem);
        }
    }
})();


var controller = (function(budgetCtrl, uiCtrl) {
    var Transaction = function(incomeOrExpense, description, number) {
        this.incomeOrExpense = incomeOrExpense,
        this.description = description,
        this.number = number
    }

    document.querySelector('.add__btn').addEventListener("click", clickedAddButton);
    //document.querySelector('.item__delete--btn').addEventListener('click', uiCtrl.deleteItem);

    function clickedAddButton () {
        var newItem = new Transaction(document.querySelector('.add__type').value, document.querySelector('.add__description').value, document.querySelector('.add__value').value);
        budgetCtrl.updateNumbers(newItem);
        uiCtrl.updateUi(newItem);
        console.log(budgetCtrl.newIncome);
        console.log(budgetCtrl.newExpense);
    }

    // Update the ui with the numbers calculated by the budgetController

})(budgetController, uiController);
