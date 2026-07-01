const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

// =====================================
// Create Trip
// =====================================

const createTrip = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;
        
        console.log(req.body);
        
        if (!name || !startDate) {
            return res.status(400).json({
                success: false,
                message: "Trip name and start date are required."
            });
        }

        const trip = await Trip.create({
            user: req.user.id,
            name,
            startDate,
            endDate
        });

        return res.status(201).json({
            success: true,
            message: "Trip created successfully.",
            data: trip
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
// Get All Trips
// =====================================

const getAllTrips = async (req, res) => {
    try {

        const trips = await Trip.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
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
// Get Trip By ID
// =====================================

const getTripById = async (req, res) => {

    try {

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: trip
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
// Update Trip
// =====================================

const updateTrip = async (req, res) => {

    try {

        const { name, startDate, endDate } = req.body;

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }

        trip.name = name || trip.name;
        trip.startDate = startDate || trip.startDate;
        trip.endDate = endDate || trip.endDate;

        await trip.save();

        return res.status(200).json({
            success: true,
            message: "Trip updated successfully.",
            data: trip
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
// Delete Trip
// =====================================

const deleteTrip = async (req, res) => {

    try {

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }

        await Expense.deleteMany({
            trip: req.params.id,
            user: req.user.id
        });

        await Trip.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Trip deleted successfully."
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
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip
};