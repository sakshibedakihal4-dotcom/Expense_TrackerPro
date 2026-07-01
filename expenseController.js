const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const [trips, expenses] = await Promise.all([
            Trip.find({ user: userId }).sort({ createdAt: -1 }),
            Expense.find({ user: userId })
                .populate("trip", "name")
                .sort({ expenseDate: -1 })
        ]);

        const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
        const categoryTotals = {};
        const paymentTotals = {};
        const dayTotals = {};

        expenses.forEach((expense) => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + Number(expense.amount || 0);
            paymentTotals[expense.paymentMode] = (paymentTotals[expense.paymentMode] || 0) + 1;
            const day = new Date(expense.expenseDate).toISOString().slice(0, 10);
            dayTotals[day] = (dayTotals[day] || 0) + Number(expense.amount || 0);
        });

        const highestExpense = expenses.reduce((highest, expense) => !highest || expense.amount > highest.amount ? expense : highest, null);
        const lowestExpense = expenses.reduce((lowest, expense) => !lowest || expense.amount < lowest.amount ? expense : lowest, null);
        const topKey = (values) => Object.entries(values).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

        return res.status(200).json({
            success: true,
            data: {
                totalTrips: trips.length,
                totalExpenses: expenses.length,
                totalAmount,
                averagePerTrip: trips.length ? totalAmount / trips.length : 0,
                highestExpense,
                lowestExpense,
                mostUsedCategory: topKey(categoryTotals),
                mostUsedPaymentMode: topKey(paymentTotals),
                categoryTotals,
                paymentTotals,
                dayTotals,
                recentTrips: trips.slice(0, 5),
                recentExpenses: expenses.slice(0, 6)
            }
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
    getDashboardSummary
};
