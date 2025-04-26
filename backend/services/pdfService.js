const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const config = require("../config/config")

/**
 * Generate a PDF report for an academic application
 * @param {Object} report - Report object with user and activities
 * @param {String} outputPath - Path to save the PDF file (optional)
 * @returns {Promise<String>} - Path to the generated PDF file
 */
const generateReportPDF = async (report, outputPath = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ margin: 50 })

      // If outputPath is not provided, generate one
      if (!outputPath) {
        const userDir = path.join(config.uploadDir, report.user._id.toString())

        // Create user directory if it doesn't exist
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true })
        }

        outputPath = path.join(userDir, `report_${report._id}_${Date.now()}.pdf`)
      }

      // Pipe its output to a file
      const stream = fs.createWriteStream(outputPath)
      doc.pipe(stream)

      // Add content to the PDF
      addReportHeader(doc, report)
      addReportSummary(doc, report)
      addCategoryBreakdown(doc, report)
      addActivitiesList(doc, report)

      // Finalize the PDF and end the stream
      doc.end()

      stream.on("finish", () => {
        resolve(outputPath)
      })

      stream.on("error", (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Add report header to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} report - Report object
 */
const addReportHeader = (doc, report) => {
  // Add logo
  // doc.image('path/to/logo.png', 50, 45, { width: 50 });

  // Add title
  doc.fontSize(20).font("Helvetica-Bold").text("AKADEMİK YÜKSELTME RAPORU", { align: "center" })

  doc.moveDown()

  // Add user information
  doc.fontSize(12).font("Helvetica-Bold").text("Akademik Personel Bilgileri", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Ad Soyad: ${report.user.name}`)
    .text(`Unvan: ${report.user.title}`)
    .text(`Bölüm: ${report.user.department}`)
    .text(`Fakülte: ${report.user.faculty}`)
    .text(`Temel Alan: ${report.user.fieldArea}`)

  doc.moveDown()

  // Add report information
  doc.fontSize(12).font("Helvetica-Bold").text("Rapor Bilgileri", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Hedef Unvan: ${report.targetTitle}`)
    .text(`İlk Atama: ${report.isFirstAppointment ? "Evet" : "Hayır"}`)
    .text(`Başlangıç Tarihi: ${new Date(report.startDate).toLocaleDateString("tr-TR")}`)
    .text(`Bitiş Tarihi: ${new Date(report.endDate).toLocaleDateString("tr-TR")}`)
    .text(`Durum: ${getStatusText(report.status)}`)

  doc.moveDown()
}

/**
 * Add report summary to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} report - Report object
 */
const addReportSummary = (doc, report) => {
  doc.fontSize(12).font("Helvetica-Bold").text("Özet Bilgiler", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Toplam Puan: ${report.totalPoints.toFixed(2)}`)

  doc.moveDown(0.5)

  // Add activity counts
  doc.fontSize(10).font("Helvetica-Bold").text("Faaliyet Sayıları:")

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Yayın Sayısı: ${report.activityCounts.publications || 0}`)
    .text(`Başlıca Yazar Olduğu Yayın Sayısı: ${report.activityCounts.mainAuthor || 0}`)
    .text(`SCI/SSCI/AHCI Yayın Sayısı: ${report.activityCounts.sciPublications || 0}`)
    .text(`Proje Sayısı: ${report.activityCounts.projects || 0}`)
    .text(`Tez Danışmanlığı Sayısı: ${report.activityCounts.theses || 0}`)

  doc.moveDown()
}

/**
 * Add category breakdown to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} report - Report object
 */
const addCategoryBreakdown = (doc, report) => {
  doc.fontSize(12).font("Helvetica-Bold").text("Kategori Bazında Puanlar", { underline: true })

  doc.moveDown(0.5)

  // Create a table for category points
  const categories = {
    A: "Makaleler",
    B: "Bilimsel Toplantı Faaliyetleri",
    C: "Kitaplar",
    D: "Atıflar",
    E: "Eğitim Öğretim Faaliyetleri",
    F: "Tez Yöneticiliği",
    G: "Patentler",
    H: "Araştırma Projeleri",
    I: "Editörlük, Yayın Kurulu Üyeliği ve Hakemlik",
    J: "Ödüller",
    K: "İdari Görevler ve Üniversiteye Katkı",
    L: "Güzel Sanatlar Faaliyetleri",
  }

  // Table header
  const tableTop = doc.y
  const tableLeft = 50
  const colWidth = 150
  const colWidth2 = 100
  const rowHeight = 20

  // Draw header
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Kategori", tableLeft, tableTop)
    .text("Puan", tableLeft + colWidth, tableTop)

  doc
    .moveTo(tableLeft, tableTop + rowHeight)
    .lineTo(tableLeft + colWidth + colWidth2, tableTop + rowHeight)
    .stroke()

  // Draw rows
  let rowTop = tableTop + rowHeight

  for (const [category, name] of Object.entries(categories)) {
    const points = report.categoryPoints[category] || 0

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`${category} - ${name}`, tableLeft, rowTop)
      .text(points.toFixed(2), tableLeft + colWidth, rowTop)

    rowTop += rowHeight
  }

  // Draw total
  doc
    .moveTo(tableLeft, rowTop)
    .lineTo(tableLeft + colWidth + colWidth2, rowTop)
    .stroke()

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("TOPLAM", tableLeft, rowTop)
    .text(report.totalPoints.toFixed(2), tableLeft + colWidth, rowTop)

  doc.moveDown(2)
}

/**
 * Add activities list to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} report - Report object with populated activities
 */
const addActivitiesList = (doc, report) => {
  // Start a new page for activities
  doc.addPage()

  doc.fontSize(14).font("Helvetica-Bold").text("FAALİYET LİSTESİ", { align: "center" })

  doc.moveDown()

  // Group activities by category
  const activitiesByCategory = {}

  if (report.activities && report.activities.length > 0) {
    report.activities.forEach((activity) => {
      if (!activitiesByCategory[activity.category]) {
        activitiesByCategory[activity.category] = []
      }
      activitiesByCategory[activity.category].push(activity)
    })

    // Sort activities within each category
    for (const category in activitiesByCategory) {
      activitiesByCategory[category].sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
    }

    // Print activities by category
    const categories = {
      A: "Makaleler",
      B: "Bilimsel Toplantı Faaliyetleri",
      C: "Kitaplar",
      D: "Atıflar",
      E: "Eğitim Öğretim Faaliyetleri",
      F: "Tez Yöneticiliği",
      G: "Patentler",
      H: "Araştırma Projeleri",
      I: "Editörlük, Yayın Kurulu Üyeliği ve Hakemlik",
      J: "Ödüller",
      K: "İdari Görevler ve Üniversiteye Katkı",
      L: "Güzel Sanatlar Faaliyetleri",
    }

    for (const category in categories) {
      if (activitiesByCategory[category] && activitiesByCategory[category].length > 0) {
        // Add category header
        doc.fontSize(12).font("Helvetica-Bold").text(`${category} - ${categories[category]}`, { underline: true })

        doc.moveDown(0.5)

        // Add activities
        activitiesByCategory[category].forEach((activity, index) => {
          // Check if we need a new page
          if (doc.y > 700) {
            doc.addPage()
          }

          doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(`${index + 1}. ${activity.title}`)

          doc
            .fontSize(9)
            .font("Helvetica")
            .text(`Tarih: ${new Date(activity.date).toLocaleDateString("tr-TR")}`)
            .text(`Alt Kategori: ${activity.subcategory}`)

          if (activity.authors) {
            doc.text(`Yazarlar: ${activity.authors}`)
          }

          if (activity.journal) {
            let journalInfo = `Dergi: ${activity.journal}`
            if (activity.volume) journalInfo += `, Cilt: ${activity.volume}`
            if (activity.issue) journalInfo += `, Sayı: ${activity.issue}`
            if (activity.pages) journalInfo += `, Sayfa: ${activity.pages}`
            doc.text(journalInfo)
          }

          if (activity.indexType) {
            let indexInfo = `İndeks: ${activity.indexType}`
            if (activity.quartile) indexInfo += ` (${activity.quartile})`
            doc.text(indexInfo)
          }

          doc.text(`Yazar Sayısı: ${activity.authorCount}, Başlıca Yazar: ${activity.isMainAuthor ? "Evet" : "Hayır"}`)
          doc.text(`Baz Puan: ${activity.basePoints}, Hesaplanan Puan: ${activity.calculatedPoints.toFixed(2)}`)

          doc.moveDown()
        })

        doc.moveDown()
      }
    }
  } else {
    doc.fontSize(10).font("Helvetica").text("Bu raporda faaliyet bulunmamaktadır.")
  }
}

/**
 * Generate a PDF for an application
 * @param {Object} application - Application object with populated fields
 * @param {String} outputPath - Path to save the PDF file (optional)
 * @returns {Promise<String>} - Path to the generated PDF file
 */
const generateApplicationPDF = async (application, outputPath = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ margin: 50 })

      // If outputPath is not provided, generate one
      if (!outputPath) {
        const userDir = path.join(config.uploadDir, application.candidate._id.toString())

        // Create user directory if it doesn't exist
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true })
        }

        outputPath = path.join(userDir, `application_${application._id}_${Date.now()}.pdf`)
      }

      // Pipe its output to a file
      const stream = fs.createWriteStream(outputPath)
      doc.pipe(stream)

      // Add content to the PDF
      addApplicationHeader(doc, application)
      addApplicationSummary(doc, application)
      addDocumentsList(doc, application)

      // Finalize the PDF and end the stream
      doc.end()

      stream.on("finish", () => {
        resolve(outputPath)
      })

      stream.on("error", (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Add application header to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} application - Application object
 */
const addApplicationHeader = (doc, application) => {
  // Add title
  doc.fontSize(20).font("Helvetica-Bold").text("AKADEMİK BAŞVURU FORMU", { align: "center" })

  doc.moveDown()

  // Add candidate information
  doc.fontSize(12).font("Helvetica-Bold").text("Aday Bilgileri", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Ad Soyad: ${application.candidate.name}`)
    .text(`Unvan: ${application.candidate.title}`)
    .text(`Bölüm: ${application.candidate.department}`)
    .text(`Fakülte: ${application.candidate.faculty}`)
    .text(`Temel Alan: ${application.candidate.fieldArea}`)

  doc.moveDown()

  // Add job posting information
  doc.fontSize(12).font("Helvetica-Bold").text("İlan Bilgileri", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`İlan Başlığı: ${application.jobPosting.title}`)
    .text(`Bölüm: ${application.jobPosting.department}`)
    .text(`Fakülte: ${application.jobPosting.faculty}`)
    .text(`Pozisyon: ${application.jobPosting.position}`)
    .text(`Temel Alan: ${application.jobPosting.fieldArea}`)

  doc.moveDown()

  // Add application information
  doc.fontSize(12).font("Helvetica-Bold").text("Başvuru Bilgileri", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Başvuru Tarihi: ${new Date(application.createdAt).toLocaleDateString("tr-TR")}`)
    .text(`Durum: ${getStatusText(application.status)}`)

  if (application.submittedAt) {
    doc.text(`Gönderim Tarihi: ${new Date(application.submittedAt).toLocaleDateString("tr-TR")}`)
  }

  doc.moveDown()
}

/**
 * Add application summary to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} application - Application object
 */
const addApplicationSummary = (doc, application) => {
  doc.fontSize(12).font("Helvetica-Bold").text("Özet Bilgiler", { underline: true })

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Toplam Puan: ${application.totalPoints.toFixed(2)}`)

  doc.moveDown(0.5)

  // Add activity counts
  doc.fontSize(10).font("Helvetica-Bold").text("Faaliyet Sayıları:")

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Yayın Sayısı: ${application.activityCounts.publications || 0}`)
    .text(`Başlıca Yazar Olduğu Yayın Sayısı: ${application.activityCounts.mainAuthor || 0}`)
    .text(`SCI/SSCI/AHCI Yayın Sayısı: ${application.activityCounts.sciPublications || 0}`)
    .text(`Proje Sayısı: ${application.activityCounts.projects || 0}`)
    .text(`Tez Danışmanlığı Sayısı: ${application.activityCounts.theses || 0}`)

  doc.moveDown()

  // Add category points
  doc.fontSize(10).font("Helvetica-Bold").text("Kategori Bazında Puanlar:")

  const categories = {
    A: "Makaleler",
    B: "Bilimsel Toplantı Faaliyetleri",
    C: "Kitaplar",
    D: "Atıflar",
    E: "Eğitim Öğretim Faaliyetleri",
    F: "Tez Yöneticiliği",
    G: "Patentler",
    H: "Araştırma Projeleri",
    I: "Editörlük, Yayın Kurulu Üyeliği ve Hakemlik",
    J: "Ödüller",
    K: "İdari Görevler ve Üniversiteye Katkı",
    L: "Güzel Sanatlar Faaliyetleri",
  }

  for (const [category, name] of Object.entries(categories)) {
    const points = application.categoryPoints[category] || 0
    if (points > 0) {
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${category} - ${name}: ${points.toFixed(2)}`)
    }
  }

  doc.moveDown()
}

/**
 * Add documents list to the PDF
 * @param {PDFDocument} doc - PDF document
 * @param {Object} application - Application object
 */
const addDocumentsList = (doc, application) => {
  doc.fontSize(12).font("Helvetica-Bold").text("Yüklenen Belgeler", { underline: true })

  doc.moveDown(0.5)

  if (application.documents && application.documents.length > 0) {
    application.documents.forEach((document, index) => {
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${index + 1}. ${document.name}`)
        .text(`   Kategori: ${document.category || "Genel"}`)
        .text(`   Yükleme Tarihi: ${new Date(document.uploadDate).toLocaleDateString("tr-TR")}`)
        .text(`   Doğrulanma Durumu: ${document.verified ? "Doğrulanmış" : "Doğrulanmamış"}`)

      doc.moveDown(0.5)
    })
  } else {
    doc.fontSize(10).font("Helvetica").text("Bu başvuruda belge bulunmamaktadır.")
  }
}

/**
 * Get status text in Turkish
 * @param {String} status - Status code
 * @returns {String} - Status text in Turkish
 */
const getStatusText = (status) => {
  const statusMap = {
    draft: "Taslak",
    submitted: "Gönderildi",
    under_review: "İnceleniyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    pending: "Beklemede",
    closed: "Kapatıldı",
    completed: "Tamamlandı",
    published: "Yayınlandı",
  }

  return statusMap[status] || status
}

module.exports = {
  generateReportPDF,
  generateApplicationPDF,
}
