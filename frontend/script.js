document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionsList = document.getElementById('transactions-list');
    const balanceBar = document.getElementById('balance-bar');
    const clearEntriesButton = document.getElementById('clear-entries');
    const addButton = transactionForm.querySelector('button');
    const viewOptions = document.getElementById('view-options');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function updateBalance() {
        const totalBalance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        balanceBar.textContent = `Total Balance: $${totalBalance.toFixed(2)}`;
        balanceBar.className = totalBalance >= 0 ? 'balance-bar balance-positive' : 'balance-bar balance-negative';
    }

    function renderTransactions() {
        const selectedOption = viewOptions.value;
        transactionsList.innerHTML = '';
        
        let transactionsToRender = selectedOption === 'recent' && transactions.length > 0 ? [transactions[transactions.length - 1]] : transactions;

        transactionsToRender.forEach(transaction => {
            const li = document.createElement('li');
            li.className = transaction.type === 'income' ? 'income' : 'expense';
            li.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)}`;
            transactionsList.appendChild(li);

            // Add subtle blink effect to the transaction
            li.classList.add(transaction.type === 'income' ? 'blink-subtle-green' : 'blink-subtle-red');
            setTimeout(() => {
                li.classList.remove('blink-subtle-green', 'blink-subtle-red');
            }, 1000);
        });
    }

    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        const transaction = { description, amount, type };
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        renderTransactions();
        updateBalance();

        // Blink the add button
        addButton.classList.add(type === 'income' ? 'blink-subtle-green' : 'blink-subtle-red');
        setTimeout(() => {
            addButton.classList.remove('blink-subtle-green', 'blink-subtle-red');
        }, 1000);

        transactionForm.reset();
    });

    clearEntriesButton.addEventListener('click', function() {
        transactions = [];
        localStorage.removeItem('transactions');
        renderTransactions();
        updateBalance();
    });

    viewOptions.addEventListener('change', renderTransactions);

    renderTransactions();
    updateBalance();
});
