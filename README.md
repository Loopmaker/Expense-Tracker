# SpendLog

A simple personal expense tracker built with React and TypeScript.  
You can track your income and expenses, see where your money goes, and export your data anytime.

---

## Features
- User authentication (Sign up & Login)
- Add income and expense transactions  
  *(description, amount, date, category)*
- Dashboard with:
  - Net balance
  - Total income
  - Total expenses
  - Monthly spending chart
- Navigate between months to view past data
- Search and filter transactions easily
- Data is saved online per user
- Export all data to CSV
- Mobile-friendly design

---

## Tech Stack

- **React** — UI building  
- **TypeScript** — type safety  
- **Vite** — fast development and build tool  
- **Chart.js + react-chartjs-2** — charts and data visualization 
- **Supabase** — authentication + database  
- **localStorage** — optional caching

---

## Important Notes

- Data is stored in Supabase (cloud database)  
  → Your data is persistent and tied to your account  

- localStorage may still be used for temporary storage or caching

- Categories are currently hardcoded  
  → You can edit them in `constant.ts` (`CATEGORIES` array)  

- Charts only show expenses  
  → Income is not included in the chart  

- CSV export includes all transactions  
  → Not affected by filters or selected month  

---

## Known Issues / Future Improvements

- No edit feature yet (only delete and re-add)  
- No budget tracking or spending limits  

---

## Future Plans

- Add backend support (save data online)  
- Allow editing transactions  
- Add budgets and spending goals 
- Improve UI/UX (loading states, better feedback) 