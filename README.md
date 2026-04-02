SpendLog
A personal expense tracker built with React and TypeScript. You can log your income and expenses, see a breakdown of where your money goes, and export everything to a CSV file.

What it does

Add income or expense transactions with a description, amount, date, and category
Dashboard shows your net balance, total income, total expenses, and a spending chart for the month
You can go back and forth between months to see older data
Filter and search through all your transactions
Export everything to a CSV file
Works on mobile too


Tech used

React — for building the UI
TypeScript — so we catch mistakes before they happen
Vite — runs the dev server and builds the project
Chart.js + react-chartjs-2 — for the doughnut and bar charts
localStorage — saves your data in the browser so it doesn't disappear on refresh


A few things worth knowing
Data is saved in the browser. Everything goes into localStorage, so if you clear your browser data, your transactions will be gone. There's no backend or database here.
Categories are hardcoded. Right now the list of categories (Food, Transport, Bills, etc.) lives in constants.ts. If you want to add a new one, just add it to the CATEGORIES array there.
The chart only shows expenses. Income transactions don't show up in the spending chart — only expenses do, grouped by category.
CSV export gives you everything. It exports all transactions regardless of the current month filter.

Known issues / things I'd improve later

No way to edit a transaction after adding it (you'd have to delete and re-add)
No budget limits or spending goals yet
Data only lives in the browser — would be nice to sync it somewhere or at least let you import a CSV back in
Imma add backend soon