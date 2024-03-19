const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/finance/expenseController');

// Add a new expense record
router.post("/add", expenseController.addExpense);

// Retrieve all expense records
router.get("/", expenseController.getAllExpenses);

// Retrieve a specific expense record by ID
router.get("/get/:id", expenseController.getExpenseById);

// Update a expense record
router.patch("/update/:id", expenseController.updateExpense);

// Delete a expense record
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;
