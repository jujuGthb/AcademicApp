const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Criteria = require("../models/Criteria")

// @route   GET api/criteria
// @desc    Get all criteria
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const criteria = await Criteria.find().sort({ fieldArea: 1, targetTitle: 1 })
    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   GET api/criteria/:fieldArea/:targetTitle/:isFirstAppointment
// @desc    Get criteria by field area, target title, and appointment type
// @access  Private
router.get("/:fieldArea/:targetTitle/:isFirstAppointment", auth, async (req, res) => {
  try {
    const { fieldArea, targetTitle, isFirstAppointment } = req.params

    const criteria = await Criteria.findOne({
      fieldArea,
      targetTitle,
      isFirstAppointment: isFirstAppointment === "true",
    })

    if (!criteria) {
      return res.status(404).json({ message: "Kriter bulunamadı" })
    }

    res.json(criteria)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   POST api/criteria/init
// @desc    Initialize criteria from the guidelines
// @access  Private (should be admin only in production)
router.post("/init", auth, async (req, res) => {
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

      // Fen Bilimleri ve Matematik - Dr. Öğretim Üyesi - İlk Atama
      {
        fieldArea: "Fen Bilimleri ve Matematik",
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

      // Add similar entries for all field areas and titles
      // ...

      // Güzel Sanatlar - Dr. Öğretim Üyesi - İlk Atama
      {
        fieldArea: "Güzel Sanatlar",
        targetTitle: "Dr. Öğretim Üyesi",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 200,
          categoryPoints: {
            A: 10,
          },
          activityCounts: {
            publications: 1,
            mainAuthor: 1,
            personalExhibitions: 2,
            groupExhibitions: 8,
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
      // Güzel Sanatlar - Doçent
      {
        fieldArea: "Güzel Sanatlar",
        targetTitle: "Doçent",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 350,
          categoryPoints: {
            A: 20,
            F: 15,
            H: 10,
          },
          activityCounts: {
            publications: 3,
            mainAuthor: 2,
            personalExhibitions: 3,
            groupExhibitions: 12,
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
      // Güzel Sanatlar - Profesör
      {
        fieldArea: "Güzel Sanatlar",
        targetTitle: "Profesör",
        isFirstAppointment: true,
        minimumRequirements: {
          totalPoints: 350,
          categoryPoints: {
            A: 20,
            F: 15,
            H: 10,
          },
          activityCounts: {
            publications: 3,
            mainAuthor: 3,
            personalExhibitions: 5,
            groupExhibitions: 20,
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
    ]

    await Criteria.insertMany(criteriaData)

    res.json({ message: "Kriterler başarıyla oluşturuldu", count: criteriaData.length })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

module.exports = router
