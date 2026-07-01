const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// =====================================
// Recalculate Trip Total Expense
// =====================================

const updateTripTotal = async (tripId) => {

    const expenses = await Expense.find({ trip: tripId });

    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    await Trip.findByIdAndUpdate(tripId, {
        totalExpense: total
    });

};

// =====================================
// Create Expense
// =====================================

const createExpense = async (req, res) => {

    try {

        const {
            trip,
            title,
            amount,
            category,
            paymentMode,
            expenseDate,
            location,
            notes
        } = req.body;

        if (
            !trip ||
            !title ||
            !amount ||
            !category ||
            !paymentMode ||
            !expenseDate
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }

        const tripExists = await Trip.findOne({
            _id: trip,
            user: req.user.id
        });

        if (!tripExists) {

            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });

        }

        const expense = await Expense.create({

            user: req.user.id,

            trip,

            title,

            amount,

            category,

            paymentMode,

            expenseDate,

            location,

            notes,

            receiptImage: req.file ? req.file.filename : ""

        });

        await updateTripTotal(trip);

        return res.status(201).json({

            success: true,

            message: "Expense added successfully.",

            data: expense

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Get All Expenses
// =====================================

const getAllExpenses = async (req, res) => {

    try {

        const expenses = await Expense.find({

            user: req.user.id

        })

        .populate("trip", "name")

        .sort({

            expenseDate: -1

        });

        return res.status(200).json({

            success: true,

            count: expenses.length,

            data: expenses

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Get Expense By ID
// =====================================

const getExpenseById = async (req, res) => {

    try {

        const expense = await Expense.findOne({

            _id: req.params.id,

            user: req.user.id

        }).populate("trip", "name");

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: expense

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Update Expense
// =====================================

const updateExpense = async (req, res) => {

    try {

        const expense = await Expense.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found."

            });

        }

        const previousTripId = expense.trip.toString();

        Object.assign(expense, req.body);

        if (req.file) {

            expense.receiptImage = req.file.filename;

        }

        await expense.save();

        await updateTripTotal(expense.trip);

        if (previousTripId !== expense.trip.toString()) {
            await updateTripTotal(previousTripId);
        }

        return res.status(200).json({

            success: true,

            message: "Expense updated successfully.",

            data: expense

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Delete Expense
// =====================================

const deleteExpense = async (req, res) => {

    try {

        const expense = await Expense.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found."

            });

        }

        const tripId = expense.trip;

        await Expense.findByIdAndDelete(req.params.id);

        await updateTripTotal(tripId);

        return res.status(200).json({

            success: true,

            message: "Expense deleted successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createExpense,

    getAllExpenses,

    getExpenseById,

    updateExpense,

    deleteExpense

};