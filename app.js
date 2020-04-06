var budgetController = (function() {

    var newItem;
    var totalIncome;
    var totalExpenses;

    // If the object says 'inc', increase the income label by the amount listed in the object's value. Otherwise increase the expense label.
    if (newItem.incomeOrExpense == 'inc') {
        // var totalIncome = the existing total income without the +
        totalIncome = 
        document.querySelector('.budget__income--value').textContent = '+ ' + (totalIncome + newItem.number);
    } else {
        // var totalExpenses = the existing total expenses without the -
        document.querySelector('.budget__expenses--value').textContent = '- ' + (totalIncome + newItem.number);
    }

    function calculate() {

    }
    // Subtract the total expenses from the total income, then update the budget value.

    // For expenses, calculate the percentage of the income that the expense represents.

    return {
        updateNumbers: function(newItem) {
            calculate(newItem);
        }
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
        uiCtrl.updateUi(newItem);
    }

    // Update the ui with the numbers calculated by the budgetController
    
})(budgetController, uiController);
