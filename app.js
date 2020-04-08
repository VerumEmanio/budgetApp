var budgetController = (function() {
    var incomeLabel = document.querySelector('.budget__income--value');
    var expensesLabel = document.querySelector('.budget__expenses--value');
    var totalIncome = parseFloat(incomeLabel.textContent.slice(2)); // Remove the + and convert the string to a number.
    var totalExpenses = parseFloat(expensesLabel.textContent.slice(2));
    var availableBudget;
    var itemPercentOfTotalIncome = 0;
    var expensePercentOfTotalIncome = 0;
    var allExpenses;
    var newPercentages = [];

    function calculate(newItem) {
    if (newItem.incomeOrExpense == 'inc') {
        totalIncome = totalIncome + parseFloat(newItem.number); 
        allExpenses = document.querySelectorAll('[id^="expense-"]'); // Select all ids in the doc that start with 'expense-'.
        allExpenses.forEach(recalculatePercentage);
    } else {
        totalExpenses = totalExpenses + parseFloat(newItem.number);
        itemPercentOfTotalIncome = (parseFloat(newItem.number) / totalIncome) * 100;
    }
    availableBudget = totalIncome - totalExpenses;
    expensePercentOfTotalIncome = totalExpenses / totalIncome;

    if (totalIncome == 0) { // Avoid printing 'infinity' from dividing by 0.
        itemPercentOfTotalIncome = 0;
        expensePercentOfTotalIncome = 0;
    }
    }

    function recalculatePercentage (expenseDiv) {
        var divId = expenseDiv.id;
        var percent = Math.round((document.getElementById(divId).querySelector('.item__value').textContent.slice(2) / totalIncome) * 100);
        newPercentages.push(divId);
        newPercentages.push(percent);
    }

    function getDeleteButtonDivInfo (elementId) {

    }

    return {
        updateNumbers: function(newItem) {
            calculate(newItem);
        },
        getDivInfo: function (elementId) {
            getDeleteButtonDivInfo(elementId);
        },
        get totalIncome () {
            return totalIncome;
        },
        get totalExpenses () {
            return totalExpenses;
        },
        get availableBudget () {
            return availableBudget;
        },
        get itemPercentOfTotalIncome () {
            return itemPercentOfTotalIncome;
        },
        get expensePercentOfTotalIncome () {
            return expensePercentOfTotalIncome;
        },
        get newPercentages () {
            return newPercentages;
        }
    }
})();

var uiController = (function() {
    var listOfIncome = [];
    var listOfExpenses = [];

    function addItemToUi(newItem, totalIncome, totalExpenses, availableBudget,
        itemPercentOfTotalIncome, expensePercentOfTotalIncome, newPercentages) {
        var arrLength;
        var list;
        if (newItem.incomeOrExpense == 'inc') {
            newItem.number = '+ ' + newItem.number;
            listOfIncome.push(newItem);
            arrLength = listOfIncome.length;
            list = document.querySelector('.income__list');
            duplicateDiv('income', newItem, arrLength, list, itemPercentOfTotalIncome);
            if (newPercentages.length >= 0) {
                updateExpensePercentages(newPercentages);
            }    
        } else {
            newItem.number = '- ' + newItem.number;
            listOfExpenses.push(newItem);
            arrLength = listOfExpenses.length;
            list = document.querySelector('.expenses__list');
            duplicateDiv('expense', newItem, arrLength, list, itemPercentOfTotalIncome);
        }
        document.querySelector('.budget__income--value').textContent = '+ ' + totalIncome;
        document.querySelector('.budget__expenses--value').textContent = '- ' + totalExpenses;
        document.querySelector('.budget__value').textContent = '$' + availableBudget;
        document.querySelector('.budget__expenses--percentage').textContent = Math.round((expensePercentOfTotalIncome * 100)) + '%';
    }

    function duplicateDiv(elementName, obj, arrLength, list, percent) {
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
            document.getElementById(elementId).querySelector('.item__percentage').textContent = percent + '%';
        }
    }

    function updateExpensePercentages (newPercentages) {
        for (var i = 0; i < newPercentages.length; i += 2) {
            var divId = newPercentages[i]; 
            var percent = newPercentages[1 + i]; 
            document.getElementById(divId).querySelector('.item__percentage').textContent = percent + ' %';
        }
    }

    return {
        updateUi: function(newItem, totalIncome, totalExpenses, availableBudget,
            itemPercentOfTotalIncome, expensePercentOfTotalIncome, updatedPercent) {
            addItemToUi(newItem, totalIncome, totalExpenses, availableBudget,
                itemPercentOfTotalIncome, expensePercentOfTotalIncome, updatedPercent);
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
    document.querySelector('.income__list').addEventListener("click", function () {
        if (event.target.nodeName == 'I') {
            console.log('found the button!');
        }
    });
    //document.querySelector('.expenses__list').addEventListener("click", checkForItems);

    function clickedAddButton () {
        var newItem = new Transaction(document.querySelector('.add__type').value, document.querySelector('.add__description').value, document.querySelector('.add__value').value);
        budgetCtrl.updateNumbers(newItem);
        uiCtrl.updateUi(newItem, budgetCtrl.totalIncome, budgetCtrl.totalExpenses, budgetCtrl.availableBudget,
            budgetCtrl.itemPercentOfTotalIncome, budgetCtrl.expensePercentOfTotalIncome, budgetCtrl.newPercentages);
    }
})(budgetController, uiController);