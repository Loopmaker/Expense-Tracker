# SpendLog

A full-stack personal expense tracker built with React and TypeScript, powered by Supabase for authentication and database management.

Track your income and expenses, analyze your spending habits, and manage your finances with a clean and responsive interface.

---
## Live Demo
- [View Live App](https://expense-tracker-eight-ruby-53.vercel.app/)
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

## Known Limitations

- No edit feature yet (only delete and re-add)  
- No budget tracking or spending limits
- Categories are currently hardcoded  

---

## Future Plans

- Add edit/update transaction feature 
- Allow editing transactions  
- Add budgets and spending goals 
- Improve UI/UX (loading states, better feedback) 