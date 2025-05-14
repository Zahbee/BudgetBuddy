
"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState, useMemo } from 'react';

export type Income = {
  amount: number; // This will represent the total accumulated income
  date: Date;   // This will represent the date of the latest income addition
};

export type Expense = {
  id: string;
  name: string;
  amount: number;
  date: string; // Always store as ISO string for consistency
  type: 'essential' | 'variable';
  category: string; // Main Category Group OR Detailed Category
  subCategory?: string; // Explicit Detailed Category (Optional)
};

export interface ExpenseCategoryGroup {
  name: string; // Main Category: e.g., "Housing"
  options: string[]; // Detailed Options / Sub-Categories: e.g., ["Rent / Mortgage", ...]
}

interface AppContextType {
  income: Income | null;
  setIncomeState: (newIncomeEntry: { amount: number; date: Date }) => void; // Changed to accept an income entry object
  expenses: Expense[];
  addExpenseToList: (expense: Omit<Expense, 'id'> & { date: Date | string }) => void;
  deleteExpenseById: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  fixedCategoryGroups: ExpenseCategoryGroup[];
  variableCategoryGroups: ExpenseCategoryGroup[];
  allCategoryOptions: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const housingOptions = ['Rent / Mortgage', 'Property Taxes', 'Homeowners/Renters Insurance', 'HOA Fees', 'Home Maintenance / Repairs', 'Other Housing'];
const utilitiesOptions = ['Electricity / Gas', 'Water / Sewer', 'Internet / Cable TV', 'Mobile Phone', 'Trash / Recycling', 'Other Utilities'];
const transportationOptions = ['Car Payment', 'Car Insurance', 'Fuel (Gas/Petrol)', 'Public Transportation (Bus, Train, Metro)', 'Ride Sharing (Uber, Lyft, Ola, etc.)', 'Vehicle Maintenance / Repairs', 'Parking Fees / Tolls', 'Other Transportation'];
const debtPaymentsOptions = ['Credit Card Payments', 'Student Loans', 'Personal Loans', 'Other Loan Payments'];
const foodOptions = ['Groceries', 'Dining Out / Restaurants', 'Coffee Shops', 'Takeaway / Delivery', 'Other Food'];
const personalCareOptions = ['Haircuts / Salon', 'Toiletries / Personal Hygiene Products', 'Gym / Fitness', 'Clothing / Shoes', 'Dry Cleaning / Laundry', 'Other Personal Care'];
const entertainmentOptions = ['Streaming Services (Netflix, Spotify, etc.)', 'Movies / Cinema', 'Concerts / Events', 'Hobbies', 'Books / Music', 'Video Games', 'Other Entertainment'];
const shoppingOptions = ['General Shopping', 'Electronics', 'Home Goods', 'Gifts', 'Other Shopping'];

const defaultFixedCategoryGroups: ExpenseCategoryGroup[] = [
  { name: "Housing", options: housingOptions },
  { name: "Utilities", options: utilitiesOptions },
  { name: "Transportation", options: transportationOptions },
  { name: "Debt Payments", options: debtPaymentsOptions },
];

const defaultVariableCategoryGroups: ExpenseCategoryGroup[] = [
  { name: "Food", options: foodOptions },
  { name: "Personal Care", options: personalCareOptions },
  { name: "Entertainment", options: entertainmentOptions },
  { name: "Shopping", options: shoppingOptions },
];

const allOptions = [...defaultFixedCategoryGroups, ...defaultVariableCategoryGroups]
                    .flatMap(group => group.options);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [income, setIncome] = useState<Income | null>(null); // Corrected variable name
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userName, setUserName] = useState<string>('Guest');

  // Updated setIncomeState to handle cumulative income
  const setIncomeState = (newIncomeEntry: { amount: number; date: Date }) => {
    setIncome(prevIncome => { // Corrected variable name
      if (prevIncome === null) {
        // First time adding income
        return { amount: newIncomeEntry.amount, date: newIncomeEntry.date };
      } else {
        // Subsequent income additions: sum amounts and update date
        return {
          amount: prevIncome.amount + newIncomeEntry.amount,
          date: newIncomeEntry.date, // Date of the latest transaction
        };
      }
    });
  };

  const addExpenseToList = (expenseData: Omit<Expense, 'id'> & { date: Date | string }) => {
    let definitiveDate: Date;
    const now = new Date(); 

    if (typeof expenseData.date === 'string') {
      const parsedDate = new Date(expenseData.date);
      if (!isNaN(parsedDate.getTime())) { 
        const hasTimeComponent = /[T\s_:]\d{1,2}/.test(expenseData.date);
        if (!hasTimeComponent) { 
          definitiveDate = new Date(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );
        } else { 
          definitiveDate = parsedDate;
        }
      } else { 
        console.warn(`Invalid date string received: "${expenseData.date}". Defaulting to current date.`);
        definitiveDate = new Date(now); 
      }
    } else {
      const d = expenseData.date as Date;
      if (d && !isNaN(d.getTime())) { 
        const isMidnight = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0 && d.getMilliseconds() === 0;
        if (isMidnight) {
          definitiveDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
          );
        } else { 
          definitiveDate = d;
        }
      } else { 
        console.warn(`Received Date object is invalid. Defaulting to current date.`);
        definitiveDate = new Date(now);
      }
    }

    const newExpense: Expense = {
      name: expenseData.name,
      amount: expenseData.amount,
      type: expenseData.type,
      category: expenseData.category,
      subCategory: expenseData.subCategory,
      date: definitiveDate.toISOString(), 
      id: new Date().toISOString() + Math.random().toString(), 
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const deleteExpenseById = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const totalIncome = useMemo(() => income?.amount ?? 0, [income]); // Corrected variable name

  const totalExpenses = useMemo(() => {
      return expenses.reduce((sum, exp) => {
          const amount = typeof exp.amount === 'number' && !isNaN(exp.amount) ? exp.amount : 0;
          return sum + amount;
      }, 0);
  }, [expenses]);

  const availableBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  return (
    <AppContext.Provider value={{
      income: income,  // Corrected variable name
      setIncomeState,
      expenses,
      addExpenseToList,
      deleteExpenseById,
      totalIncome,
      totalExpenses,
      availableBalance,
      userName,
      setUserName,
      fixedCategoryGroups: defaultFixedCategoryGroups,
      variableCategoryGroups: defaultVariableCategoryGroups,
      allCategoryOptions: allOptions,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

    