const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://newadmin:admin123@cluster0.pbbnlak.mongodb.net/hostelDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const complaintSchema = new mongoose.Schema({
    name: String,
    campusId: String,
    room: String,
    type: String,
    description: String,
    status: {
        type: String,
        default: "Pending"
    }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "API is running 🚀",
        endpoints: {
            submit: "POST /complaint",
            track: "GET /complaint/:id",
            resolve: "GET /resolve/:id"
        }
    });
});

// Submit Complaint
app.post("/complaint", async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        await complaint.save();

        res.json({
            success: true,
            id: complaint._id
        });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

app.get("/complaint/:id", async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            res.json({
                success: true,
                data: complaint
            });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.json({ success: false });
    }
});

// Track Complaint
app.get("/resolve/:id", async (req, res) => {
    await Complaint.findByIdAndUpdate(req.params.id, {
        status: "Resolved"
    });

    res.send("✅ Complaint marked as Resolved");
});
// Update Status
app.put("/complaint/:id", async (req, res) => {
    try {
        await Complaint.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        });

        res.json({ success: true });
    } catch {
        res.json({ success: false });
    }
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});