const JobPosting = require("../models/JobPosting");

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
