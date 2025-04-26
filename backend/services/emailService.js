const nodemailer = require("nodemailer")
const config = require("../config/config")

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
})

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text version of the email
 * @param {String} options.html - HTML version of the email
 * @returns {Promise} - Nodemailer send mail promise
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: config.emailFrom,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send a welcome email to a new user
 * @param {Object} user - User object
 * @returns {Promise} - Email sending promise
 */
const sendWelcomeEmail = async (user) => {
  const subject = "Hoş Geldiniz - Akademik Yükseltme Sistemi"
  const text = `Merhaba ${user.name},\n\nAkademik Yükseltme Sistemi'ne hoş geldiniz. Hesabınız başarıyla oluşturuldu.\n\nSaygılarımızla,\nAkademik Yükseltme Sistemi Ekibi`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #343a40;">Akademik Yükseltme Sistemi'ne Hoş Geldiniz</h2>
      <p>Merhaba <strong>${user.name}</strong>,</p>
      <p>Akademik Yükseltme Sistemi'ne hoş geldiniz. Hesabınız başarıyla oluşturuldu.</p>
      <p>Akademik faaliyetlerinizi kaydetmeye ve puanlarınızı hesaplamaya hemen başlayabilirsiniz.</p>
      <p style="margin-top: 30px;">Saygılarımızla,<br>Akademik Yükseltme Sistemi Ekibi</p>
    </div>
  `

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  })
}

/**
 * Send an application status update email
 * @param {Object} application - Application object
 * @param {Object} user - User object
 * @returns {Promise} - Email sending promise
 */
const sendApplicationStatusEmail = async (application, user) => {
  const statusMap = {
    pending: "Beklemede",
    under_review: "İnceleniyor",
    approved: "Onaylandı",
    rejected: "Reddedildi",
  }

  const subject = `Başvuru Durumu Güncellendi - ${statusMap[application.status]}`
  const text = `Merhaba ${user.name},\n\nBaşvurunuzun durumu "${statusMap[application.status]}" olarak güncellenmiştir.\n\nDetayları görmek için sisteme giriş yapabilirsiniz.\n\nSaygılarımızla,\nAkademik Yükseltme Sistemi Ekibi`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #343a40;">Başvuru Durumu Güncellendi</h2>
      <p>Merhaba <strong>${user.name}</strong>,</p>
      <p>Başvurunuzun durumu <strong style="color: ${
        application.status === "approved"
          ? "#28a745"
          : application.status === "rejected"
            ? "#dc3545"
            : application.status === "under_review"
              ? "#ffc107"
              : "#6c757d"
      };">${statusMap[application.status]}</strong> olarak güncellenmiştir.</p>
      <p>Detayları görmek için <a href="http://localhost:3000/candidate/applications">sisteme giriş yapabilirsiniz</a>.</p>
      <p style="margin-top: 30px;">Saygılarımızla,<br>Akademik Yükseltme Sistemi Ekibi</p>
    </div>
  `

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  })
}

/**
 * Send a notification to jury members about a new evaluation assignment
 * @param {Object} evaluation - Evaluation object
 * @param {Object} juryMember - Jury member user object
 * @param {Object} application - Application object
 * @returns {Promise} - Email sending promise
 */
const sendJuryAssignmentEmail = async (evaluation, juryMember, application) => {
  const subject = "Yeni Değerlendirme Görevi"
  const text = `Merhaba ${juryMember.name},\n\nYeni bir değerlendirme görevi atandı. Lütfen sisteme giriş yaparak değerlendirmenizi tamamlayın.\n\nSaygılarımızla,\nAkademik Yükseltme Sistemi Ekibi`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #343a40;">Yeni Değerlendirme Görevi</h2>
      <p>Merhaba <strong>${juryMember.name}</strong>,</p>
      <p>Size yeni bir değerlendirme görevi atanmıştır.</p>
      <p>Lütfen <a href="http://localhost:3000/jury/evaluations">sisteme giriş yaparak</a> değerlendirmenizi tamamlayın.</p>
      <p style="margin-top: 30px;">Saygılarımızla,<br>Akademik Yükseltme Sistemi Ekibi</p>
    </div>
  `

  return sendEmail({
    to: juryMember.email,
    subject,
    text,
    html,
  })
}

/**
 * Send a password reset email
 * @param {Object} user - User object
 * @param {String} resetToken - Password reset token
 * @returns {Promise} - Email sending promise
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`
  const subject = "Şifre Sıfırlama"
  const text = `Merhaba ${user.name},\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n${resetUrl}\n\nBu bağlantı 1 saat sonra geçerliliğini yitirecektir.\n\nEğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.\n\nSaygılarımızla,\nAkademik Yükseltme Sistemi Ekibi`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #343a40;">Şifre Sıfırlama</h2>
      <p>Merhaba <strong>${user.name}</strong>,</p>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Şifremi Sıfırla
        </a>
      </p>
      <p>Bu bağlantı 1 saat sonra geçerliliğini yitirecektir.</p>
      <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      <p style="margin-top: 30px;">Saygılarımızla,<br>Akademik Yükseltme Sistemi Ekibi</p>
    </div>
  `

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  })
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendApplicationStatusEmail,
  sendJuryAssignmentEmail,
  sendPasswordResetEmail,
}
