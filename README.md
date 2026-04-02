SpendLog
A simple personal expense tracker built with React and TypeScript.
You can track your income and expenses, see where your money goes, and export your data anytime.

Features
Add income and expense transactions
(description, amount, date, category)
Dashboard with:
Net balance
Total income
Total expenses
Monthly spending chart
Navigate between months to view past data
Search and filter transactions easily
Export all data to CSV
Mobile-friendly design

Tech Stack
React — UI building
TypeScript — type safety
Vite — fast development and build tool
Chart.js + react-chartjs-2 — charts and data visualization
localStorage — saves data in the browser

Important Notes
Data is stored in your browser using localStorage
→ If you clear your browser data, everything will be deleted
Categories are currently hardcoded
→ You can edit them in constants.ts (CATEGORIES array)
Charts only show expenses
→ Income is not included in the chart
CSV export includes all transactions
→ Not affected by filters or selected month

Known Issues / Future Improvements
No edit feature yet (only delete and re-add)
No budget tracking or spending limits
No backend (data is not synced anywhere)


Future Plans
Add backend support (save data online)
Allow editing transactions
Add budgets and spending goals
