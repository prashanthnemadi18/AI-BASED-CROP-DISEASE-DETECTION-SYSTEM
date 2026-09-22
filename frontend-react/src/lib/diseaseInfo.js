/**
 * Helpers that turn the raw model label (e.g. "Tomato_Early_blight") into
 * human-friendly display data used across the UI.
 */

const CROP_MAP = {
  Tomato: 'Tomato',
  Potato: 'Potato',
  Pepper: 'Pepper (Bell)',
}

/** Extract the crop/plant name from a disease label. */
export function getCropFromDisease(disease = '') {
  const prefix = disease.split('_')[0]
  return CROP_MAP[prefix] || prefix || 'Unknown Crop'
}

/** Pretty-print a disease label: "Tomato_Early_blight" -> "Tomato Early Blight". */
export function formatDisease(disease = '') {
  return disease.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Whether the scan indicates a healthy plant or a detected disease. */
export function isHealthy(disease = '') {
  return disease.toLowerCase().includes('healthy')
}

/** Detection status text shown on result cards. */
export function getStatus(disease = '') {
  if (!disease || disease.toLowerCase().includes('unknown')) return 'Analysis Required'
  return isHealthy(disease) ? 'Healthy Plant' : 'Disease Detected'
}

/** Severity -> tailwind gradient + accent color for consistent styling. */
export function severityTheme(severity = 'Unknown') {
  switch (severity) {
    case 'Very High':
      return { gradient: 'from-red-600 to-rose-700', text: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', ring: 'ring-red-500' }
    case 'High':
      return { gradient: 'from-orange-500 to-red-600', text: 'text-orange-600', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700', ring: 'ring-orange-500' }
    case 'Moderate':
      return { gradient: 'from-amber-500 to-yellow-600', text: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', ring: 'ring-amber-500' }
    case 'None':
      return { gradient: 'from-emerald-500 to-green-600', text: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-500' }
    default:
      return { gradient: 'from-slate-500 to-slate-600', text: 'text-slate-600', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-700', ring: 'ring-slate-500' }
  }
}

const GENERIC_PREVENTION = [
  'Inspect plants regularly and remove any diseased leaves early.',
  'Practice crop rotation to reduce pathogen build-up in the soil.',
  'Water at the base of plants and avoid wetting the foliage.',
  'Ensure good air circulation and proper plant spacing.',
  'Use certified disease-free seeds and clean tools between plants.',
]

const SPECIFIC_PREVENTION = {
  blight: [
    'Avoid planting near potatoes and remove volunteer plants.',
    'Apply a protective fungicide before cool, wet weather.',
  ],
  bacterial: [
    'Use copper-based bactericide as a preventive spray.',
    'Avoid working in the field while plants are wet.',
  ],
  virus: [
    'Control insect vectors such as aphids and whiteflies.',
    'Use yellow sticky traps and plant resistant varieties.',
  ],
  mold: [
    'Reduce humidity and improve airflow around plants.',
    'Mulch soil to prevent splash onto lower leaves.',
  ],
  spot: [
    'Mulch around plants to prevent soil splash.',
    'Rotate crops each season to break the disease cycle.',
  ],
  mites: [
    'Increase humidity and monitor leaf undersides.',
    'Introduce predatory mites for biological control.',
  ],
}

/** Build a prevention-tips list from the disease label. */
export function getPreventionTips(disease = '') {
  if (isHealthy(disease)) {
    return [
      'Plant looks healthy — keep up regular watering and feeding.',
      'Continue monitoring for early signs of disease.',
      'Maintain good soil drainage and air circulation.',
    ]
  }
  const lower = disease.toLowerCase()
  const key = Object.keys(SPECIFIC_PREVENTION).find((k) => lower.includes(k))
  const tips = key ? [...SPECIFIC_PREVENTION[key], ...GENERIC_PREVENTION] : GENERIC_PREVENTION
  return Array.from(new Set(tips)).slice(0, 5)
}
