/**
 * Validation Service
 * Provides validation functions for various data types in the application
 */

// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
const DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i

/**
 * Validate user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateUserRegistration = (userData) => {
  const errors = {}

  // Required fields
  if (!userData.name || userData.name.trim() === "") {
    errors.name = "Ad Soyad alanı zorunludur"
  }

  if (!userData.email || !EMAIL_REGEX.test(userData.email)) {
    errors.email = "Geçerli bir e-posta adresi giriniz"
  }

  if (!userData.password) {
    errors.password = "Şifre alanı zorunludur"
  } else if (userData.password.length < 6) {
    errors.password = "Şifre en az 6 karakter olmalıdır"
  } else if (!PASSWORD_REGEX.test(userData.password)) {
    errors.password = "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
  }

  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = "Şifreler eşleşmiyor"
  }

  // Academic fields validation for candidates
  if (userData.role === "candidate" || !userData.role) {
    if (!userData.title) {
      errors.title = "Akademik ünvan seçiniz"
    }

    if (!userData.department || userData.department.trim() === "") {
      errors.department = "Bölüm alanı zorunludur"
    }

    if (!userData.faculty || userData.faculty.trim() === "") {
      errors.faculty = "Fakülte alanı zorunludur"
    }

    if (!userData.fieldArea) {
      errors.fieldArea = "Temel alan seçiniz"
    }
  }

  // Date validations
  if (userData.doctorateDate && !DATE_REGEX.test(userData.doctorateDate)) {
    errors.doctorateDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  if (userData.lastPromotionDate && !DATE_REGEX.test(userData.lastPromotionDate)) {
    errors.lastPromotionDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate login data
 * @param {Object} loginData - Login data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateLogin = (loginData) => {
  const errors = {}

  if (!loginData.email || !EMAIL_REGEX.test(loginData.email)) {
    errors.email = "Geçerli bir e-posta adresi giriniz"
  }

  if (!loginData.password) {
    errors.password = "Şifre alanı zorunludur"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate activity data
 * @param {Object} activityData - Activity data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateActivity = (activityData) => {
  const errors = {}

  // Required fields
  if (!activityData.category) {
    errors.category = "Kategori seçiniz"
  }

  if (!activityData.subcategory) {
    errors.subcategory = "Alt kategori seçiniz"
  }

  if (!activityData.title || activityData.title.trim() === "") {
    errors.title = "Başlık alanı zorunludur"
  }

  if (!activityData.date) {
    errors.date = "Tarih alanı zorunludur"
  } else if (!DATE_REGEX.test(activityData.date)) {
    errors.date = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  // Author count validation
  if (!activityData.authorCount || isNaN(activityData.authorCount) || activityData.authorCount < 1) {
    errors.authorCount = "Geçerli bir yazar sayısı giriniz"
  }

  // Base points validation
  if (!activityData.basePoints || isNaN(activityData.basePoints) || activityData.basePoints < 0) {
    errors.basePoints = "Geçerli bir baz puan giriniz"
  }

  // Category-specific validations
  if (activityData.category === "A") {
    // Journal article validations
    if (!activityData.journal || activityData.journal.trim() === "") {
      errors.journal = "Dergi adı zorunludur"
    }

    if (activityData.doi && !DOI_REGEX.test(activityData.doi)) {
      errors.doi = "Geçerli bir DOI formatı giriniz"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate report data
 * @param {Object} reportData - Report data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateReport = (reportData) => {
  const errors = {}

  // Required fields
  if (!reportData.targetTitle) {
    errors.targetTitle = "Hedef ünvan seçiniz"
  }

  if (reportData.isFirstAppointment === undefined) {
    errors.isFirstAppointment = "İlk atama bilgisi zorunludur"
  }

  if (!reportData.startDate) {
    errors.startDate = "Başlangıç tarihi zorunludur"
  } else if (!DATE_REGEX.test(reportData.startDate)) {
    errors.startDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  if (!reportData.endDate) {
    errors.endDate = "Bitiş tarihi zorunludur"
  } else if (!DATE_REGEX.test(reportData.endDate)) {
    errors.endDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  // Date range validation
  if (reportData.startDate && reportData.endDate && new Date(reportData.startDate) > new Date(reportData.endDate)) {
    errors.dateRange = "Başlangıç tarihi bitiş tarihinden sonra olamaz"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate application data
 * @param {Object} applicationData - Application data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateApplication = (applicationData) => {
  const errors = {}

  // Required fields
  if (!applicationData.jobPostingId) {
    errors.jobPostingId = "İş ilanı seçiniz"
  }

  // Either report or activities must be provided
  if (!applicationData.reportId && (!applicationData.activityIds || applicationData.activityIds.length === 0)) {
    errors.activities = "Rapor veya faaliyetler zorunludur"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate job posting data
 * @param {Object} jobPostingData - Job posting data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateJobPosting = (jobPostingData) => {
  const errors = {}

  // Required fields
  if (!jobPostingData.title || jobPostingData.title.trim() === "") {
    errors.title = "Başlık alanı zorunludur"
  }

  if (!jobPostingData.department || jobPostingData.department.trim() === "") {
    errors.department = "Bölüm alanı zorunludur"
  }

  if (!jobPostingData.faculty || jobPostingData.faculty.trim() === "") {
    errors.faculty = "Fakülte alanı zorunludur"
  }

  if (!jobPostingData.position) {
    errors.position = "Pozisyon seçiniz"
  }

  if (!jobPostingData.fieldArea) {
    errors.fieldArea = "Temel alan seçiniz"
  }

  if (!jobPostingData.description || jobPostingData.description.trim() === "") {
    errors.description = "Açıklama alanı zorunludur"
  }

  if (!jobPostingData.startDate) {
    errors.startDate = "Başlangıç tarihi zorunludur"
  } else if (!DATE_REGEX.test(jobPostingData.startDate)) {
    errors.startDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  if (!jobPostingData.endDate) {
    errors.endDate = "Bitiş tarihi zorunludur"
  } else if (!DATE_REGEX.test(jobPostingData.endDate)) {
    errors.endDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  // Date range validation
  if (
    jobPostingData.startDate &&
    jobPostingData.endDate &&
    new Date(jobPostingData.startDate) > new Date(jobPostingData.endDate)
  ) {
    errors.dateRange = "Başlangıç tarihi bitiş tarihinden sonra olamaz"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate evaluation data
 * @param {Object} evaluationData - Evaluation data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateEvaluation = (evaluationData) => {
  const errors = {}

  // Required fields
  if (!evaluationData.applicationId) {
    errors.applicationId = "Başvuru seçiniz"
  }

  if (!evaluationData.decision) {
    errors.decision = "Karar seçiniz"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate file upload
 * @param {Object} file - File object
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @param {Number} maxSize - Maximum file size in bytes
 * @returns {Object} - Validation result with isValid flag and error message
 */
const validateFileUpload = (file, allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  if (!file) {
    return {
      isValid: false,
      error: "Dosya bulunamadı",
    }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Desteklenmeyen dosya türü. İzin verilen türler: ${allowedTypes.join(", ")}`,
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Dosya boyutu çok büyük. Maksimum boyut: ${Math.round(maxSize / (1024 * 1024))}MB`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Validate criteria data
 * @param {Object} criteriaData - Criteria data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateCriteria = (criteriaData) => {
  const errors = {}

  // Required fields
  if (!criteriaData.fieldArea) {
    errors.fieldArea = "Temel alan seçiniz"
  }

  if (!criteriaData.targetTitle) {
    errors.targetTitle = "Hedef ünvan seçiniz"
  }

  if (criteriaData.isFirstAppointment === undefined) {
    errors.isFirstAppointment = "İlk atama bilgisi zorunludur"
  }

  if (!criteriaData.minimumRequirements || !criteriaData.minimumRequirements.totalPoints) {
    errors.totalPoints = "Toplam puan zorunludur"
  } else if (isNaN(criteriaData.minimumRequirements.totalPoints) || criteriaData.minimumRequirements.totalPoints < 0) {
    errors.totalPoints = "Geçerli bir toplam puan giriniz"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate password change
 * @param {Object} passwordData - Password change data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validatePasswordChange = (passwordData) => {
  const errors = {}

  if (!passwordData.currentPassword) {
    errors.currentPassword = "Mevcut şifre zorunludur"
  }

  if (!passwordData.newPassword) {
    errors.newPassword = "Yeni şifre zorunludur"
  } else if (passwordData.newPassword.length < 6) {
    errors.newPassword = "Şifre en az 6 karakter olmalıdır"
  } else if (!PASSWORD_REGEX.test(passwordData.newPassword)) {
    errors.newPassword = "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = "Şifreler eşleşmiyor"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate profile update data
 * @param {Object} profileData - Profile update data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateProfileUpdate = (profileData) => {
  const errors = {}

  if (profileData.name && profileData.name.trim() === "") {
    errors.name = "Ad Soyad alanı boş olamaz"
  }

  if (profileData.email && !EMAIL_REGEX.test(profileData.email)) {
    errors.email = "Geçerli bir e-posta adresi giriniz"
  }

  // Date validations
  if (profileData.doctorateDate && !DATE_REGEX.test(profileData.doctorateDate)) {
    errors.doctorateDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  if (profileData.lastPromotionDate && !DATE_REGEX.test(profileData.lastPromotionDate)) {
    errors.lastPromotionDate = "Geçerli bir tarih formatı giriniz (YYYY-MM-DD)"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate ObjectId
 * @param {String} id - MongoDB ObjectId string
 * @returns {Boolean} - True if valid ObjectId, false otherwise
 */
const isValidObjectId = (id) => {
  if (!id) return false

  // MongoDB ObjectId is a 24-character hex string
  const objectIdPattern = /^[0-9a-fA-F]{24}$/
  return objectIdPattern.test(id)
}

/**
 * Sanitize input to prevent XSS attacks
 * @param {String} input - Input string
 * @returns {String} - Sanitized string
 */
const sanitizeInput = (input) => {
  if (!input || typeof input !== "string") return input

  // Replace potentially dangerous characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateActivity,
  validateReport,
  validateApplication,
  validateJobPosting,
  validateEvaluation,
  validateFileUpload,
  validateCriteria,
  validatePasswordChange,
  validateProfileUpdate,
  isValidObjectId,
  sanitizeInput,
}
