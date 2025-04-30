// const Criteria = require("../models/Criteria")

// // @desc    Get all criteria
// // @route   GET /api/criteria
// // @access  Private
// exports.getAllCriteria = async (req, res) => {
//   try {
//     const criteria = await Criteria.find().sort({ fieldArea: 1, targetTitle: 1 })
//     res.json(criteria)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Get criteria by field area, target title, and appointment type
// // @route   GET /api/criteria/:fieldArea/:targetTitle/:isFirstAppointment
// // @access  Private
// exports.getCriteriaByParams = async (req, res) => {
//   try {
//     const { fieldArea, targetTitle, isFirstAppointment } = req.params

//     const criteria = await Criteria.findOne({
//       fieldArea,
//       targetTitle,
//       isFirstAppointment: isFirstAppointment === "true",
//     })

//     if (!criteria) {
//       return res.status(404).json({ message: "Criteria not found" })
//     }

//     res.json(criteria)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Create new criteria
// // @route   POST /api/criteria
// // @access  Private/Admin
// exports.createCriteria = async (req, res) => {
//   try {
//     const { fieldArea, targetTitle, isFirstAppointment, minimumRequirements, maximumLimits } = req.body

//     // Check if criteria already exists
//     const existingCriteria = await Criteria.findOne({
//       fieldArea,
//       targetTitle,
//       isFirstAppointment,
//     })

//     if (existingCriteria) {
//       return res.status(400).json({ message: "Criteria already exists" })
//     }

//     const newCriteria = new Criteria({
//       fieldArea,
//       targetTitle,
//       isFirstAppointment,
//       minimumRequirements,
//       maximumLimits,
//     })

//     const criteria = await newCriteria.save()
//     res.json(criteria)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Update criteria
// // @route   PUT /api/criteria/:id
// // @access  Private/Admin
// exports.updateCriteria = async (req, res) => {
//   try {
//     const { fieldArea, targetTitle, isFirstAppointment, minimumRequirements, maximumLimits } = req.body

//     const criteria = await Criteria.findById(req.params.id)

//     if (!criteria) {
//       return res.status(404).json({ message: "Criteria not found" })
//     }

//     // Update fields
//     if (fieldArea) criteria.fieldArea = fieldArea
//     if (targetTitle) criteria.targetTitle = targetTitle
//     if (isFirstAppointment !== undefined) criteria.isFirstAppointment = isFirstAppointment
//     if (minimumRequirements) criteria.minimumRequirements = minimumRequirements
//     if (maximumLimits) criteria.maximumLimits = maximumLimits
//     criteria.updatedAt = Date.now()

//     await criteria.save()
//     res.json(criteria)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Delete criteria
// // @route   DELETE /api/criteria/:id
// // @access  Private/Admin
// exports.deleteCriteria = async (req, res) => {
//   try {
//     const criteria = await Criteria.findById(req.params.id)

//     if (!criteria) {
//       return res.status(404).json({ message: "Criteria not found" })
//     }

//     await Criteria.findByIdAndDelete(req.params.id)
//     res.json({ message: "Criteria removed" })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Initialize criteria from the guidelines
// // @route   POST /api/criteria/init
// // @access  Private/Admin
// exports.initializeCriteria = async (req, res) => {
//   try {
//     // Clear existing criteria
//     await Criteria.deleteMany({})

//     // Create criteria for each field area and target title based on the guidelines
//     const criteriaData = [
//       // Sağlık Bilimleri - Dr. Öğretim Üyesi - İlk Atama
//       {
//         fieldArea: "Sağlık Bilimleri",
//         targetTitle: "Dr. Öğretim Üyesi",
//         isFirstAppointment: true,
//         minimumRequirements: {
//           totalPoints: 100,
//           categoryPoints: {
//             A: 45,
//           },
//           activityCounts: {
//             publications: 4,
//             mainAuthor: 1,
//           },
//         },
//         maximumLimits: {
//           categoryPoints: {
//             D: 1500,
//             E: 50,
//             K: 50,
//           },
//         },
//       },
//       // Sağlık Bilimleri - Dr. Öğretim Üyesi - Yeniden Atama
//       {
//         fieldArea: "Sağlık Bilimleri",
//         targetTitle: "Dr. Öğretim Üyesi",
//         isFirstAppointment: false,
//         minimumRequirements: {
//           totalPoints: 70, // %70 of original requirement for 2025 (transition period)
//           categoryPoints: {},
//           activityCounts: {},
//         },
//         maximumLimits: {
//           categoryPoints: {
//             D: 1500,
//             E: 50,
//             K: 50,
//           },
//         },
//       },
//       // Sağlık Bilimleri - Doçent
//       {
//         fieldArea: "Sağlık Bilimleri",
//         targetTitle: "Doçent",
//         isFirstAppointment: true,
//         minimumRequirements: {
//           totalPoints: 250,
//           categoryPoints: {
//             A: 125,
//             F: 15,
//             H: 20,
//           },
//           activityCounts: {
//             publications: 7,
//             mainAuthor: 2,
//             sciPublications: 3,
//             theses: 1,
//           },
//         },
//         maximumLimits: {
//           categoryPoints: {
//             D: 1500,
//             E: 50,
//             K: 50,
//           },
//         },
//       },
//       // Sağlık Bilimleri - Profesör
//       {
//         fieldArea: "Sağlık Bilimleri",
//         targetTitle: "Profesör",
//         isFirstAppointment: true,
//         minimumRequirements: {
//           totalPoints: 250,
//           categoryPoints: {
//             A: 125,
//             F: 15,
//             H: 20,
//           },
//           activityCounts: {
//             publications: 7,
//             mainAuthor: 3,
//             sciPublications: 3,
//             theses: 2,
//           },
//         },
//         maximumLimits: {
//           categoryPoints: {
//             D: 1500,
//             E: 50,
//             K: 50,
//           },
//         },
//       },
//       // Add more criteria for other field areas as needed
//     ]

//     await Criteria.insertMany(criteriaData)

//     res.json({ message: "Criteria initialized successfully", count: criteriaData.length })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

// // @desc    Check if report meets criteria
// // @route   POST /api/criteria/check
// // @access  Private
// exports.checkCriteria = async (req, res) => {
//   try {
//     const { fieldArea, targetTitle, isFirstAppointment, report } = req.body

//     // Get criteria for the field area and target title
//     const criteria = await Criteria.findOne({
//       fieldArea,
//       targetTitle,
//       isFirstAppointment,
//     })

//     if (!criteria) {
//       return res.status(404).json({ message: "Criteria not found for this field and title" })
//     }

//     // Check if report meets criteria
//     const result = {
//       meetsRequirements: true,
//       details: {
//         totalPoints: {
//           required: criteria.minimumRequirements.totalPoints,
//           actual: report.totalPoints,
//           meets: report.totalPoints >= criteria.minimumRequirements.totalPoints,
//         },
//         categoryPoints: {},
//         activityCounts: {},
//       },
//     }

//     // Check category points
//     for (const category in criteria.minimumRequirements.categoryPoints) {
//       if (criteria.minimumRequirements.categoryPoints[category] > 0) {
//         const required = criteria.minimumRequirements.categoryPoints[category]
//         const actual = report.categoryPoints[category] || 0
//         const meets = actual >= required

//         result.details.categoryPoints[category] = { required, actual, meets }

//         if (!meets) {
//           result.meetsRequirements = false
//         }
//       }
//     }

//     // Check activity counts
//     for (const countType in criteria.minimumRequirements.activityCounts) {
//       if (criteria.minimumRequirements.activityCounts[countType] > 0) {
//         const required = criteria.minimumRequirements.activityCounts[countType]
//         const actual = report.activityCounts[countType] || 0
//         const meets = actual >= required

//         result.details.activityCounts[countType] = { required, actual, meets }

//         if (!meets) {
//           result.meetsRequirements = false
//         }
//       }
//     }

//     // Check maximum limits
//     result.details.maximumLimits = {}

//     for (const category in criteria.maximumLimits.categoryPoints) {
//       const limit = criteria.maximumLimits.categoryPoints[category]
//       const actual = report.categoryPoints[category] || 0
//       const exceeds = actual > limit

//       result.details.maximumLimits[category] = { limit, actual, exceeds }

//       // If exceeds, we don't fail the requirements, but we note it
//       if (exceeds) {
//         result.details.maximumLimits[category].adjusted = limit
//       }
//     }

//     res.json(result)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: "Server error" })
//   }
// }

const ApplicationCriteria = require("../models/ApplicationCriteria");
const mongoose = require("mongoose");

// @desc    Create application criteria
// @route   POST /api/criteria
// @access  Private (Manager only)
exports.createCriteria = async (req, res) => {
  try {
    const {
      title,
      fieldArea,
      targetTitle,
      isFirstAppointment,
      description,
      minimumRequirements,
      specialRequirements,
    } = req.body;

    const newCriteria = new ApplicationCriteria({
      title,
      fieldArea,
      targetTitle,
      isFirstAppointment,
      description,
      minimumRequirements,
      specialRequirements,
      createdBy: req.user.id,
    });

    const criteria = await newCriteria.save();
    res.status(201).json(criteria);
  } catch (err) {
    console.error("Error creating criteria:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all criteria
// @route   GET /api/criteria
// @access  Private
exports.getAllCriteria = async (req, res) => {
  try {
    const { fieldArea, targetTitle, isActive } = req.query;
    const query = {};

    // Apply filters if provided
    if (fieldArea) query.fieldArea = fieldArea;
    if (targetTitle) query.targetTitle = targetTitle;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const criteria = await ApplicationCriteria.find(query)
      .sort({ fieldArea: 1, targetTitle: 1 })
      .populate("createdBy", "name email");

    res.json(criteria);
  } catch (err) {
    console.error("Error fetching criteria:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get criteria by ID
// @route   GET /api/criteria/:id
// @access  Private
exports.getCriteriaById = async (req, res) => {
  try {
    const criteria = await ApplicationCriteria.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" });
    }

    res.json(criteria);
  } catch (err) {
    console.error("Error fetching criteria:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Criteria not found" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update criteria
// @route   PUT /api/criteria/:id
// @access  Private (Manager only)
exports.updateCriteria = async (req, res) => {
  try {
    const {
      title,
      fieldArea,
      targetTitle,
      isFirstAppointment,
      description,
      minimumRequirements,
      specialRequirements,
      isActive,
    } = req.body;

    // Check if criteria exists
    let criteria = await ApplicationCriteria.findById(req.params.id);
    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" });
    }

    // Build update object
    const updateFields = {
      title,
      fieldArea,
      targetTitle,
      isFirstAppointment,
      description,
      minimumRequirements,
      specialRequirements,
      isActive,
      updatedBy: req.user.id,
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    // Update criteria
    criteria = await ApplicationCriteria.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate("createdBy updatedBy", "name email");

    res.json(criteria);
  } catch (err) {
    console.error("Error updating criteria:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Criteria not found" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete criteria
// @route   DELETE /api/criteria/:id
// @access  Private (Manager only)
exports.deleteCriteria = async (req, res) => {
  try {
    // Check if criteria exists
    const criteria = await ApplicationCriteria.findById(req.params.id);
    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" });
    }

    // Delete criteria
    await ApplicationCriteria.findByIdAndRemove(req.params.id);
    res.json({ message: "Criteria removed" });
  } catch (err) {
    console.error("Error deleting criteria:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Criteria not found" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Calculate applicant score based on criteria
// @route   POST /api/criteria/calculate-score
// @access  Private
exports.calculateScore = async (req, res) => {
  try {
    const { criteriaId, applicantData } = req.body;

    // Find the criteria
    const criteria = await ApplicationCriteria.findById(criteriaId);
    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" });
    }

    // Calculate score based on criteria and applicant data
    // This is a simplified example - actual implementation would be more complex
    const score = {
      publications: {
        A1A2: 0,
        A1A4: 0,
        A1A6: 0,
        total: 0,
      },
      mainAuthor: 0,
      projects: 0,
      thesisSupervision: 0,
      totalPoints: 0,
      meetsMinimumRequirements: false,
    };

    // Calculate publication scores
    if (applicantData.publications) {
      applicantData.publications.forEach((pub) => {
        // Add points based on publication type
        switch (pub.type) {
          case "A1":
          case "A2":
            score.publications.A1A2 += 1;
            score.publications.A1A4 += 1;
            score.publications.A1A6 += 1;
            score.publications.total += 1;
            score.totalPoints += pub.isQ1 ? 60 : 55; // Q1 or Q2
            break;
          case "A3":
          case "A4":
            score.publications.A1A4 += 1;
            score.publications.A1A6 += 1;
            score.publications.total += 1;
            score.totalPoints += pub.isQ3 ? 40 : 30; // Q3 or Q4
            break;
          case "A5":
          case "A6":
            score.publications.A1A6 += 1;
            score.publications.total += 1;
            score.totalPoints += pub.type === "A5" ? 25 : 20; // ESCI or Scopus
            break;
          default:
            score.publications.total += 1;
            score.totalPoints += 10; // Other publications
        }

        // Count main author publications
        if (pub.isMainAuthor) {
          score.mainAuthor += 1;
        }
      });
    }

    // Calculate project scores
    if (applicantData.projects) {
      score.projects = applicantData.projects.length;
      applicantData.projects.forEach((project) => {
        // Add points based on project type
        switch (project.role) {
          case "coordinator":
            score.totalPoints += 250;
            break;
          case "researcher":
            score.totalPoints += 100;
            break;
          case "consultant":
            score.totalPoints += 30;
            break;
          default:
            score.totalPoints += 20;
        }
      });
    }

    // Calculate thesis supervision scores
    if (applicantData.thesisSupervision) {
      score.thesisSupervision =
        (applicantData.thesisSupervision.phd || 0) +
        (applicantData.thesisSupervision.masters || 0);
      score.totalPoints += (applicantData.thesisSupervision.phd || 0) * 40; // 40 points per PhD
      score.totalPoints += (applicantData.thesisSupervision.masters || 0) * 15; // 15 points per Masters
    }

    // Check if applicant meets minimum requirements
    const minReq = criteria.minimumRequirements;
    score.meetsMinimumRequirements =
      score.publications.A1A2 >= (minReq.publicationCount?.A1A2 || 0) &&
      score.publications.A1A4 >= (minReq.publicationCount?.A1A4 || 0) &&
      score.publications.A1A6 >= (minReq.publicationCount?.A1A6 || 0) &&
      score.publications.total >= (minReq.publicationCount?.total || 0) &&
      score.mainAuthor >= (minReq.mainAuthorCount || 0) &&
      score.projects >= (minReq.projectCount || 0) &&
      score.totalPoints >= (minReq.minimumPoints?.total || 0);

    res.json({
      criteria: criteria.title,
      score,
      details: {
        publications: score.publications,
        mainAuthor: score.mainAuthor,
        projects: score.projects,
        thesisSupervision: score.thesisSupervision,
        totalPoints: score.totalPoints,
      },
    });
  } catch (err) {
    console.error("Error calculating score:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Generate Table 5 for application
// @route   POST /api/criteria/generate-table
// @access  Private
exports.generateTable5 = async (req, res) => {
  try {
    const { applicationId } = req.body;

    // This would typically involve generating a PDF based on the application data
    // For now, we'll just return a success message
    res.json({
      message: "Table 5 generation initiated",
      downloadUrl: `/api/applications/${applicationId}/table5.pdf`,
    });
  } catch (err) {
    console.error("Error generating Table 5:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
