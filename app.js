var budgetController = (function() {
    var incomeLabel = document.querySelector('.budget__income--value');
    var expensesLabel = document.querySelector('.budget__expenses--value');
    var totalIncome = parseFloat(incomeLabel.textContent.slice(2)); /* Remove the + and convert the string to a number. */
    var totalExpenses = parseFloat(expensesLabel.textContent.slice(2));
    var availableBudget = 0;
    var itemPercentOfTotalIncome = 0;
    var expensePercentOfTotalIncome = 0;
    var allExpenses = document.querySelectorAll('[id^="expense-"]'); /* Select all ids in the doc that start with 'expense-'. */
    var newPercentages = [];

    function calculate(newItem) {
    if (newItem.incomeOrExpense == 'inc') {
        totalIncome = totalIncome + parseFloat(newItem.number); 
        allExpenses.forEach(recalculatePercentage);
    } else {
        totalExpenses = totalExpenses + parseFloat(newItem.number);
        itemPercentOfTotalIncome = (parseFloat(newItem.number) / totalIncome) * 100;
    }
    availableBudget = totalIncome - totalExpenses;
    expensePercentOfTotalIncome = (totalExpenses / totalIncome) * 100;

    if (totalIncome == 0) { /* Avoid printing 'infinity' from dividing by 0. */
        itemPercentOfTotalIncome = 0;
        expensePercentOfTotalIncome = '-';
    }
    }

    function recalculatePercentage (expenseDiv) {
        var divId = expenseDiv.id;
        var percent = Math.round((document.getElementById(divId).querySelector('.item__value').textContent.slice(2) / totalIncome) * 100);
        newPercentages.push(divId);
        newPercentages.push(percent);
    }

    function getDeleteButtonDivInfo (elementId) {
        var myDiv = document.getElementById(elementId);
        var itemValue = myDiv.querySelector('.item__value').textContent.slice(2);
        var plusOrMinus = myDiv.querySelector('.item__value').textContent.substring(0, 1);

        if (plusOrMinus == '+') { 
            totalIncome = totalIncome - parseFloat(itemValue);
        } else { 
            totalExpenses = totalExpenses - parseFloat(itemValue);
        }
        availableBudget = totalIncome - totalExpenses;
        expensePercentOfTotalIncome = Math.floor(totalExpenses / totalIncome) * 100;
        if (plusOrMinus == '+') {
            allExpenses = document.querySelectorAll('[id^="expense-"]');
            allExpenses.forEach(recalculatePercentage);
        }
    }

    return {
        updateNumbers: function(newItem) {
            calculate(newItem);
        },
        passDivId: function (elementId) {
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
    var arrOfPercentages;
    var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
    var d = new Date();

    document.querySelector('.budget__title--month').textContent = monthNames[d.getMonth()] + ' ' + d.getFullYear();

    function addItemToUi(newItem, totalIncome, totalExpenses, availableBudget,
        itemPercentOfTotalIncome, expensePercentOfTotalIncome, newPercentages) {
        var arrLength;
        var list;
        arrOfPercentages = newPercentages;
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
        document.querySelector('.budget__expenses--percentage').textContent = Math.round(expensePercentOfTotalIncome) + '%';
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
            document.getElementById(elementId).querySelector('.item__percentage').textContent = Math.floor(percent) + '%';
        }
    }

    function updateExpensePercentages(newPercentages) {
        var length = newPercentages.length;
        for (var i = 0; i < length; i += 2) {
            var divId = newPercentages[i]; 
            var percent = newPercentages[1 + i]; 
            document.getElementById(divId).querySelector('.item__percentage').textContent = percent + ' %';
        }
    }

    function deleteItemFromUi(elementId, totalIncome, totalExpenses, availableBudget, expensePercentOfTotalIncome, newPercentages) {
        var myDiv = document.getElementById(elementId);
        myDiv.remove();
        document.querySelector('.budget__income--value').textContent = '+ ' + totalIncome;
        document.querySelector('.budget__expenses--value').textContent = '- ' + totalExpenses;
        document.querySelector('.budget__value').textContent = '$' + availableBudget;
        document.querySelector('.budget__expenses--percentage').textContent = Math.round(expensePercentOfTotalIncome) + '%';
        updateExpensePercentages(newPercentages);
    }

    function changeColor () {
        var addType = document.querySelector('.add__type');
        var addDescription = document.querySelector('.add__description');
        var addValue = document.querySelector('.add__value');
        var checkButton = document.querySelector('.add__btn');

        if (addType.value == 'exp') {
            addType.classList.add('red-focus');
            addDescription.classList.add('red-focus');
            addValue.classList.add('red-focus');
            checkButton.classList.add('red');
        } else {
            addType.className = 'add__type';
            addDescription.className = 'add__description';
            addValue.className = 'add__value';
            checkButton.className = 'add__btn';
        }
    }

    return {
        updateUi: function(newItem, totalIncome, totalExpenses, availableBudget,
            itemPercentOfTotalIncome, expensePercentOfTotalIncome, newPercentages) {
            addItemToUi(newItem, totalIncome, totalExpenses, availableBudget,
                itemPercentOfTotalIncome, expensePercentOfTotalIncome, newPercentages);
        },
        deleteDiv: function (elementId, totalIncome, totalExpenses, availableBudget, expensePercentOfTotalIncome, newPercentages) {
            deleteItemFromUi(elementId, totalIncome, totalExpenses, availableBudget, expensePercentOfTotalIncome, newPercentages);
        },
        changeColor: function () {
            changeColor();
        }
    }
})();


var controller = (function(budgetCtrl, uiCtrl) {
    var Transaction = function(incomeOrExpense, description, number) {
        this.incomeOrExpense = incomeOrExpense,
        this.description = description,
        this.number = number
    }
    var buttonAncestor = '';
    var addType = document.querySelector('.add__type');
    var addDescription = document.querySelector('.add__description');
    var addValue = document.querySelector('.add__value');
    var checkButton = document.querySelector('.add__btn');

    checkButton.addEventListener('click', clickedAddButton);
    document.querySelector('.income__list').addEventListener('click', clickedDeleteButton);
    document.querySelector('.expenses__list').addEventListener('click', clickedDeleteButton);
    addType.addEventListener('change', uiCtrl.changeColor);
    
    function clickedAddButton () {
        if ((document.querySelector('.budget__value').textContent == '+ 0') && (addType.value == 'exp') && (document.getElementById('expense-0') == null))
        {
            alert('Please add at least one income item to the list before adding any expenses.');
        } else {
            var newItem = new Transaction(addType.value, addDescription.value, addValue.value);
            budgetCtrl.updateNumbers(newItem);
            uiCtrl.updateUi(newItem, budgetCtrl.totalIncome, budgetCtrl.totalExpenses, budgetCtrl.availableBudget,
                budgetCtrl.itemPercentOfTotalIncome, budgetCtrl.expensePercentOfTotalIncome, budgetCtrl.newPercentages);
        }
    }

    function clickedDeleteButton () {
        if (event.target.nodeName == 'I') {
            buttonAncestor = event.target.parentElement.parentElement.parentElement.parentElement.id; /* Get the id of the div containing the clicked button. */
            budgetCtrl.passDivId(buttonAncestor);
            uiCtrl.deleteDiv(buttonAncestor, budgetCtrl.totalIncome, budgetCtrl.totalExpenses, budgetCtrl.availableBudget,
            budgetCtrl.expensePercentOfTotalIncome, budgetCtrl.newPercentages);
        }
    }
})(budgetController, uiController);