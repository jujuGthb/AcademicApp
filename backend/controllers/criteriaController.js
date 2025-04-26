const Criteria = require("../models/Criteria")

// @desc    Get all criteria
// @route   GET /api/criteria
// @access  Private
exports.getAllCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.find().sort({ fieldArea: 1, targetTitle: 1 })
    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get criteria by field area, target title, and appointment type
// @route   GET /api/criteria/:fieldArea/:targetTitle/:isFirstAppointment
// @access  Private
exports.getCriteriaByParams = async (req, res) => {
  try {
    const { fieldArea, targetTitle, isFirstAppointment } = req.params

    const criteria = await Criteria.findOne({
      fieldArea,
      targetTitle,
      isFirstAppointment: isFirstAppointment === "true",
    })

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" })
    }

    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create new criteria
// @route   POST /api/criteria
// @access  Private/Admin
exports.createCriteria = async (req, res) => {
  try {
    const { fieldArea, targetTitle, isFirstAppointment, minimumRequirements, maximumLimits } = req.body

    // Check if criteria already exists
    const existingCriteria = await Criteria.findOne({
      fieldArea,
      targetTitle,
      isFirstAppointment,
    })

    if (existingCriteria) {
      return res.status(400).json({ message: "Criteria already exists" })
    }

    const newCriteria = new Criteria({
      fieldArea,
      targetTitle,
      isFirstAppointment,
      minimumRequirements,
      maximumLimits,
    })

    const criteria = await newCriteria.save()
    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update criteria
// @route   PUT /api/criteria/:id
// @access  Private/Admin
exports.updateCriteria = async (req, res) => {
  try {
    const { fieldArea, targetTitle, isFirstAppointment, minimumRequirements, maximumLimits } = req.body

    const criteria = await Criteria.findById(req.params.id)

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" })
    }

    // Update fields
    if (fieldArea) criteria.fieldArea = fieldArea
    if (targetTitle) criteria.targetTitle = targetTitle
    if (isFirstAppointment !== undefined) criteria.isFirstAppointment = isFirstAppointment
    if (minimumRequirements) criteria.minimumRequirements = minimumRequirements
    if (maximumLimits) criteria.maximumLimits = maximumLimits
    criteria.updatedAt = Date.now()

    await criteria.save()
    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete criteria
// @route   DELETE /api/criteria/:id
// @access  Private/Admin
exports.deleteCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.findById(req.params.id)

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" })
    }

    await Criteria.findByIdAndDelete(req.params.id)
    res.json({ message: "Criteria removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Initialize criteria from the guidelines
// @route   POST /api/criteria/init
// @access  Private/Admin
exports.initializeCriteria = async (req, res) => {
  try {
    // Clear existing criteria
    await Criteria.deleteMany({})

    // Create criteria for each field area and target title based on the guidelines
    const criteriaData = [
      // Sağlık Bilimleri - Dr. Öğretim Üyesi - İlk Atama
      {
        fieldArea: "Sağlık Bilimleri",
        targetTitle: "Dr. Öğretim Üyesi",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 100,
          categoryPoints: {
            A: 45,
          },
          activityCounts: {
            publications: 4,
            mainAuthor: 1,
          },
        },
        maximumLimits: {
          categoryPoints: {
            D: 1500,
            E: 50,
            K: 50,
          },
        },
      },
      // Sağlık Bilimleri - Dr. Öğretim Üyesi - Yeniden Atama
      {
        fieldArea: "Sağlık Bilimleri",
        targetTitle: "Dr. Öğretim Üyesi",
        isFirstAppointment: false,
        minimumRequirements: {
          totalPoints: 70, // %70 of original requirement for 2025 (transition period)
          categoryPoints: {},
          activityCounts: {},
        },
        maximumLimits: {
          categoryPoints: {
            D: 1500,
            E: 50,
            K: 50,
          },
        },
      },
      // Sağlık Bilimleri - Doçent
      {
        fieldArea: "Sağlık Bilimleri",
        targetTitle: "Doçent",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 250,
          categoryPoints: {
            A: 125,
            F: 15,
            H: 20,
          },
          activityCounts: {
            publications: 7,
            mainAuthor: 2,
            sciPublications: 3,
            theses: 1,
          },
        },
        maximumLimits: {
          categoryPoints: {
            D: 1500,
            E: 50,
            K: 50,
          },
        },
      },
      // Sağlık Bilimleri - Profesör
      {
        fieldArea: "Sağlık Bilimleri",
        targetTitle: "Profesör",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 250,
          categoryPoints: {
            A: 125,
            F: 15,
            H: 20,
          },
          activityCounts: {
            publications: 7,
            mainAuthor: 3,
            sciPublications: 3,
            theses: 2,
          },
        },
        maximumLimits: {
          categoryPoints: {
            D: 1500,
            E: 50,
            K: 50,
          },
        },
      },
      // Add more criteria for other field areas as needed
    ]

    await Criteria.insertMany(criteriaData)

    res.json({ message: "Criteria initialized successfully", count: criteriaData.length })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Check if report meets criteria
// @route   POST /api/criteria/check
// @access  Private
exports.checkCriteria = async (req, res) => {
  try {
    const { fieldArea, targetTitle, isFirstAppointment, report } = req.body

    // Get criteria for the field area and target title
    const criteria = await Criteria.findOne({
      fieldArea,
      targetTitle,
      isFirstAppointment,
    })

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found for this field and title" })
    }

    // Check if report meets criteria
    const result = {
      meetsRequirements: true,
      details: {
        totalPoints: {
          required: criteria.minimumRequirements.totalPoints,
          actual: report.totalPoints,
          meets: report.totalPoints >= criteria.minimumRequirements.totalPoints,
        },
        categoryPoints: {},
        activityCounts: {},
      },
    }

    // Check category points
    for (const category in criteria.minimumRequirements.categoryPoints) {
      if (criteria.minimumRequirements.categoryPoints[category] > 0) {
        const required = criteria.minimumRequirements.categoryPoints[category]
        const actual = report.categoryPoints[category] || 0
        const meets = actual >= required

        result.details.categoryPoints[category] = { required, actual, meets }

        if (!meets) {
          result.meetsRequirements = false
        }
      }
    }

    // Check activity counts
    for (const countType in criteria.minimumRequirements.activityCounts) {
      if (criteria.minimumRequirements.activityCounts[countType] > 0) {
        const required = criteria.minimumRequirements.activityCounts[countType]
        const actual = report.activityCounts[countType] || 0
        const meets = actual >= required

        result.details.activityCounts[countType] = { required, actual, meets }

        if (!meets) {
          result.meetsRequirements = false
        }
      }
    }

    // Check maximum limits
    result.details.maximumLimits = {}

    for (const category in criteria.maximumLimits.categoryPoints) {
      const limit = criteria.maximumLimits.categoryPoints[category]
      const actual = report.categoryPoints[category] || 0
      const exceeds = actual > limit

      result.details.maximumLimits[category] = { limit, actual, exceeds }

      // If exceeds, we don't fail the requirements, but we note it
      if (exceeds) {
        result.details.maximumLimits[category].adjusted = limit
      }
    }

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}
