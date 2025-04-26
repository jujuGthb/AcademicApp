const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

/**
 * Generate a random token
 * @param {Number} bytes - Number of bytes for the token
 * @returns {String} - Random token
 */
const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex")
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {String} - Formatted date string
 */
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Calculate date difference in days
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {Number} - Difference in days
 */
const dateDiffInDays = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {Boolean} - True if date is in the past
 */
const isDatePast = (date) => {
  return new Date(date) < new Date()
}

/**
 * Check if a file exists
 * @param {String} filePath - Path to the file
 * @returns {Boolean} - True if file exists
 */
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath)
  } catch (err) {
    return false
  }
}

/**
 * Create directory if it doesn't exist
 * @param {String} dirPath - Path to the directory
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Get file extension
 * @param {String} filename - Filename
 * @returns {String} - File extension
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase()
}

/**
 * Check if file is an image
 * @param {String} filename - Filename
 * @returns {Boolean} - True if file is an image
 */
const isImageFile = (filename) => {
  const ext = getFileExtension(filename)
  return [".jpg", ".jpeg", ".png", ".gif", ".svg"].includes(ext)
}

/**
 * Check if file is a document
 * @param {String} filename - Filename
 * @returns {Boolean} - True if file is a document
 */
const isDocumentFile = (filename) => {
  const ext = getFileExtension(filename)
  return [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].includes(ext)
}

/**
 * Sanitize filename
 * @param {String} filename - Filename to sanitize
 * @returns {String} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, "_")
}

/**
 * Truncate text to a specific length
 * @param {String} text - Text to truncate
 * @param {Number} length - Maximum length
 * @returns {String} - Truncated text
 */
const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + "..."
}

/**
 * Capitalize first letter of each word
 * @param {String} text - Text to capitalize
 * @returns {String} - Capitalized text
 */
const capitalizeWords = (text) => {
  if (!text) return ""
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Slugify text
 * @param {String} text - Text to slugify
 * @returns {String} - Slugified text
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

/**
 * Parse boolean from string
 * @param {String} value - String value
 * @returns {Boolean} - Parsed boolean
 */
const parseBoolean = (value) => {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1"
  }
  return !!value
}

/**
 * Format number with commas
 * @param {Number} number - Number to format
 * @returns {String} - Formatted number
 */
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Format currency
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency code
 * @returns {String} - Formatted currency
 */
const formatCurrency = (amount, currency = "TRY") => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Get random item from array
 * @param {Array} array - Array to get random item from
 * @returns {*} - Random item
 */
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array to remove duplicates from
 * @returns {Array} - Array without duplicates
 */
const removeDuplicates = (array) => {
  return [...new Set(array)]
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {String} key - Key to group by
 * @returns {Object} - Grouped object
 */
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

module.exports = {
  generateToken,
  formatDate,
  dateDiffInDays,
  isDatePast,
  fileExists,
  ensureDirectoryExists,
  getFileExtension,
  isImageFile,
  isDocumentFile,
  sanitizeFilename,
  truncateText,
  capitalizeWords,
  slugify,
  parseBoolean,
  formatNumber,
  formatCurrency,
  getRandomItem,
  shuffleArray,
  removeDuplicates,
  groupBy,
}
