const JobPosting = require("../models/JobPosting");
const Application = require("../models/Application");
// @desc    Get all job postings
// @route   GET /api/job-postings
// @access  Public
exports.getAllJobPostings = async (req, res) => {
  console.log("allJob");

  try {
    const jobPostings = await JobPosting.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(jobPostings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get job postings by status
// @route   GET /api/job-postings/status/:status
// @access  Public
exports.getJobPostingsByStatus = async (req, res) => {
  console.log("getjobStatus");

  try {
    const { status } = req.params;
    const jobPostings = await JobPosting.find({ status })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(jobPostings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get job posting by ID
// @route   GET /api/job-postings/:id
// @access  Public
exports.getJobPostingById = async (req, res) => {
  console.log("getJob");

  try {
    const jobPosting = await JobPosting.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create job posting
// @route   POST /api/job-postings
// @access  Private/Admin
exports.createJobPosting = async (req, res) => {
  const {
    title,
    department,
    faculty,
    position,
    fieldArea,
    description,
    requiredDocuments,
    startDate,
    endDate,
    status,
  } = req.body;

  try {
    const newJobPosting = new JobPosting({
      title,
      department,
      faculty,
      position,
      fieldArea,
      description,
      requiredDocuments: requiredDocuments || [],
      startDate,
      endDate,
      status: status || "draft",
      createdBy: req.user.id,
    });

    const jobPosting = await newJobPosting.save();
    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update job posting
// @route   PUT /api/job-postings/:id
// @access  Private/Admin
exports.updateJobPosting = async (req, res) => {
  const {
    title,
    department,
    faculty,
    position,
    fieldArea,
    description,
    requiredDocuments,
    startDate,
    endDate,
    status,
  } = req.body;

  try {
    const jobPosting = await JobPosting.findById(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Update fields
    jobPosting.title = title || jobPosting.title;
    jobPosting.department = department || jobPosting.department;
    jobPosting.faculty = faculty || jobPosting.faculty;
    jobPosting.position = position || jobPosting.position;
    jobPosting.fieldArea = fieldArea || jobPosting.fieldArea;
    jobPosting.description = description || jobPosting.description;
    jobPosting.requiredDocuments =
      requiredDocuments || jobPosting.requiredDocuments;
    jobPosting.startDate = startDate || jobPosting.startDate;
    jobPosting.endDate = endDate || jobPosting.endDate;
    jobPosting.status = status || jobPosting.status;
    jobPosting.updatedAt = Date.now();

    await jobPosting.save();
    res.json(jobPosting);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/job-postings/:id
// @access  Private/Admin
exports.deleteJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    await jobPosting.remove();
    res.json({ message: "Job posting removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new job posting
// @route   POST /api/job-postings
// @access  Private (Admin only)
exports.createJobPosting = async (req, res) => {
  try {
    const {
      title,
      faculty,
      department,
      position,
      fieldArea,
      description,
      requirements,
      startDate,
      endDate,
      requiredDocuments,
      status,
    } = req.body;

    const newJobPosting = new JobPosting({
      title,
      faculty,
      department,
      position,
      fieldArea,
      description,
      requirements,
      startDate,
      endDate,
      requiredDocuments: requiredDocuments || [],
      status: status || "draft",
      createdBy: req.user.id,
    });

    const jobPosting = await newJobPosting.save();
    res.status(201).json(jobPosting);
  } catch (err) {
    console.error("Error creating job posting:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all job postings
// @route   GET /api/job-postings
// @access  Private
exports.getAllJobPostings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    // If status is provided, filter by status
    if (status) {
      query.status = status;
    }

    const jobPostings = await JobPosting.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json(jobPostings);
  } catch (err) {
    console.error("Error fetching job postings:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get job posting by ID
// @route   GET /api/job-postings/:id
// @access  Private
exports.getJobPostingById = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.json(jobPosting);
  } catch (err) {
    console.error("Error fetching job posting:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update job posting
// @route   PUT /api/job-postings/:id
// @access  Private (Admin only)
exports.updateJobPosting = async (req, res) => {
  try {
    const {
      title,
      faculty,
      department,
      position,
      fieldArea,
      description,
      requirements,
      startDate,
      endDate,
      requiredDocuments,
      status,
    } = req.body;

    // Check if job posting exists
    let jobPosting = await JobPosting.findById(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (faculty) updateFields.faculty = faculty;
    if (department) updateFields.department = department;
    if (position) updateFields.position = position;
    if (fieldArea) updateFields.fieldArea = fieldArea;
    if (description) updateFields.description = description;
    if (requirements) updateFields.requirements = requirements;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (requiredDocuments) updateFields.requiredDocuments = requiredDocuments;
    if (status) updateFields.status = status;

    // Update job posting
    jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(jobPosting);
  } catch (err) {
    console.error("Error updating job posting:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete job posting
// @route   DELETE /api/job-postings/:id
// @access  Private (Admin only)
exports.deleteJobPosting = async (req, res) => {
  try {
    // Check if job posting exists
    const jobPosting = await JobPosting.findById(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Check if there are any applications for this job posting
    const applications = await Application.find({ jobPosting: req.params.id });
    if (applications.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete job posting with existing applications. Consider closing it instead.",
      });
    }

    // Delete job posting
    await JobPosting.findByIdAndRemove(req.params.id);
    res.json({ message: "Job posting removed" });
  } catch (err) {
    console.error("Error deleting job posting:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update job posting status
// @route   PATCH /api/job-postings/:id/status
// @access  Private (Admin only)
exports.updateJobPostingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["draft", "published", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if job posting exists
    let jobPosting = await JobPosting.findById(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Update status
    jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    res.json(jobPosting);
  } catch (err) {
    console.error("Error updating job posting status:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get application statistics for a job posting
// @route   GET /api/job-postings/:id/stats
// @access  Private (Admin and Manager only)
exports.getJobPostingStats = async (req, res) => {
  try {
    // Check if job posting exists
    const jobPosting = await JobPosting.findById(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Get application counts by status
    const applications = await Application.find({ jobPosting: req.params.id });

    const stats = {
      total: applications.length,
      byStatus: {
        draft: applications.filter((app) => app.status === "draft").length,
        submitted: applications.filter((app) => app.status === "submitted")
          .length,
        under_review: applications.filter(
          (app) => app.status === "under_review"
        ).length,
        approved: applications.filter((app) => app.status === "approved")
          .length,
        rejected: applications.filter((app) => app.status === "rejected")
          .length,
      },
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching job posting stats:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Job posting not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
