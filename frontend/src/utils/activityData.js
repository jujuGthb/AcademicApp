// Activity categories
export const activityCategories = [
  { code: "A", name: "Makaleler" },
  { code: "B", name: "Bilimsel Toplantı Faaliyetleri" },
  { code: "C", name: "Kitaplar" },
  { code: "D", name: "Atıflar" },
  { code: "E", name: "Eğitim Öğretim Faaliyetleri" },
  { code: "F", name: "Tez Yöneticiliği" },
  { code: "G", name: "Patentler" },
  { code: "H", name: "Araştırma Projeleri" },
  { code: "I", name: "Editörlük, Yayın Kurulu Üyeliği ve Hakemlik" },
  { code: "J", name: "Ödüller" },
  { code: "K", name: "İdari Görevler ve Üniversiteye Katkı" },
  { code: "L", name: "Güzel Sanatlar Faaliyetleri" },
];

// Subcategories for each category
const subcategories = {
  A: [
    {
      code: "A.1",
      name: "SCI-E, SSCI, AHCI kapsamındaki dergilerde yayımlanmış makale (Q1)",
      points: 120,
    },
    {
      code: "A.2",
      name: "SCI-E, SSCI, AHCI kapsamındaki dergilerde yayımlanmış makale (Q2)",
      points: 100,
    },
    {
      code: "A.3",
      name: "SCI-E, SSCI, AHCI kapsamındaki dergilerde yayımlanmış makale (Q3)",
      points: 80,
    },
    {
      code: "A.4",
      name: "SCI-E, SSCI, AHCI kapsamındaki dergilerde yayımlanmış makale (Q4)",
      points: 70,
    },
    {
      code: "A.5",
      name: "ESCI veya Scopus kapsamındaki dergilerde yayımlanmış makale",
      points: 60,
    },
    {
      code: "A.6",
      name: "TR Dizin kapsamındaki dergilerde yayımlanmış makale",
      points: 40,
    },
    {
      code: "A.7",
      name: "Diğer uluslararası hakemli dergilerde yayımlanmış makale",
      points: 30,
    },
    {
      code: "A.8",
      name: "Diğer ulusal hakemli dergilerde yayımlanmış makale",
      points: 20,
    },
  ],
  B: [
    {
      code: "B.1",
      name: "Uluslararası kongre/sempozyumda sunulan ve tam metni basılan bildiri",
      points: 25,
    },
    {
      code: "B.2",
      name: "Uluslararası kongre/sempozyumda sunulan ve özeti basılan bildiri",
      points: 15,
    },
    {
      code: "B.3",
      name: "Ulusal kongre/sempozyumda sunulan ve tam metni basılan bildiri",
      points: 15,
    },
    {
      code: "B.4",
      name: "Ulusal kongre/sempozyumda sunulan ve özeti basılan bildiri",
      points: 10,
    },
  ],
  // Add more subcategories for other categories
  C: [
    {
      code: "C.1",
      name: "Uluslararası yayınevleri tarafından yayımlanan kitap",
      points: 100,
    },
    {
      code: "C.2",
      name: "Uluslararası yayınevleri tarafından yayımlanan kitapta bölüm",
      points: 40,
    },
    {
      code: "C.3",
      name: "Ulusal yayınevleri tarafından yayımlanan kitap",
      points: 60,
    },
    {
      code: "C.4",
      name: "Ulusal yayınevleri tarafından yayımlanan kitapta bölüm",
      points: 25,
    },
  ],
  D: [
    {
      code: "D.1",
      name: "SCI-E, SSCI, AHCI kapsamındaki dergilerde yayınlara yapılan atıf",
      points: 4,
    },
    {
      code: "D.2",
      name: "ESCI veya Scopus kapsamındaki dergilerde yayınlara yapılan atıf",
      points: 3,
    },
    {
      code: "D.3",
      name: "Diğer uluslararası hakemli dergilerde yayınlara yapılan atıf",
      points: 2,
    },
    {
      code: "D.4",
      name: "Ulusal hakemli dergilerde yayınlara yapılan atıf",
      points: 1,
    },
    { code: "D.5", name: "Kitaplarda yapılan atıf", points: 2 },
  ],
  // Continue with other categories
};

/**
 * Get subcategories for a specific category
 * @param {string} category - Category code
 * @returns {Array} Array of subcategories
 */
export const getSubcategories = (category) => {
  return subcategories[category] || [];
};

/**
 * Get base points for a specific subcategory
 * @param {string} category - Category code
 * @param {string} subcategory - Subcategory code
 * @returns {number} Base points
 */
export const getBasePoints = (category, subcategory) => {
  const subcats = getSubcategories(category);
  const subcat = subcats.find((s) => s.code === subcategory);
  return subcat ? subcat.points : 0;
};
