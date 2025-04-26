/**
 * Calculate points for an academic activity based on author count and main author status
 * @param {Object} activity - The academic activity
 * @returns {Number} - Calculated points
 */
const calculatePoints = (activity) => {
  let calculatedPoints = Number.parseFloat(activity.basePoints)

  // Apply author count multiplier
  if (activity.authorCount > 1) {
    if (activity.authorCount === 2) {
      calculatedPoints *= 0.8
    } else if (activity.authorCount === 3) {
      calculatedPoints *= 0.6
    } else if (activity.authorCount === 4) {
      calculatedPoints *= 0.5
    } else if (activity.authorCount >= 5 && activity.authorCount <= 9) {
      calculatedPoints *= 1 / activity.authorCount
    } else if (activity.authorCount >= 10) {
      calculatedPoints *= 0.1
    }
  }

  // Apply main author bonus for 5+ authors
  if (activity.authorCount >= 5 && activity.isMainAuthor) {
    calculatedPoints *= 1.8
  }

  return calculatedPoints
}

/**
 * Calculate total points and category points for a list of activities
 * @param {Array} activities - List of academic activities
 * @returns {Object} - Total points and category points
 */
const calculateTotalPoints = (activities) => {
  let totalPoints = 0
  const categoryPoints = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
  }

  activities.forEach((activity) => {
    totalPoints += activity.calculatedPoints
    categoryPoints[activity.category] += activity.calculatedPoints
  })

  return { totalPoints, categoryPoints }
}

/**
 * Count activities by type
 * @param {Array} activities - List of academic activities
 * @returns {Object} - Counts of different activity types
 */
const countActivities = (activities) => {
  const counts = {
    publications: 0,
    mainAuthor: 0,
    projects: 0,
    theses: 0,
    sciPublications: 0,
    internationalPublications: 0,
    nationalPublications: 0,
    personalExhibitions: 0,
    groupExhibitions: 0,
  }

  activities.forEach((activity) => {
    // Count publications
    if (activity.category === "A") {
      counts.publications++

      // Count main author publications
      if (activity.isMainAuthor) {
        counts.mainAuthor++
      }

      // Count SCI/SSCI/AHCI publications
      if (["SCI-E", "SSCI", "AHCI"].includes(activity.indexType)) {
        counts.sciPublications++
      }

      // Count international publications
      if (["SCI-E", "SSCI", "AHCI", "ESCI", "Scopus", "Diğer Uluslararası"].includes(activity.indexType)) {
        counts.internationalPublications++
      }

      // Count national publications
      if (["TR Dizin", "Diğer Ulusal"].includes(activity.indexType)) {
        counts.nationalPublications++
      }
    }

    // Count projects
    if (activity.category === "H") {
      counts.projects++
    }

    // Count theses
    if (activity.category === "F") {
      counts.theses++
    }

    // Count exhibitions
    if (activity.category === "L") {
      if (["L.5", "L.6"].includes(activity.subcategory)) {
        counts.personalExhibitions++
      }

      if (["L.7", "L.8"].includes(activity.subcategory)) {
        counts.groupExhibitions++
      }
    }
  })

  return counts
}

module.exports = {
  calculatePoints,
  calculateTotalPoints,
  countActivities,
}
