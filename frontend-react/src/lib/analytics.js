import { isHealthy, formatDisease, getCropFromDisease } from './diseaseInfo'

const CROP_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

/**
 * Compute all analytics figures from a list of detection records.
 * Returns a single object consumed by the Analytics and Dashboard pages.
 */
export function computeAnalytics(detections = []) {
  const total = detections.length
  const healthy = detections.filter((d) => isHealthy(d.disease)).length
  const diseased = total - healthy

  // Most frequently detected disease
  const diseaseCounts = {}
  detections.forEach((d) => {
    diseaseCounts[d.disease] = (diseaseCounts[d.disease] || 0) + 1
  })
  const sortedDiseases = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])
  const mostFrequent = sortedDiseases[0]
    ? { disease: formatDisease(sortedDiseases[0][0]), count: sortedDiseases[0][1] }
    : null

  // Average confidence
  const avgConfidence = total
    ? Math.round(detections.reduce((s, d) => s + (Number(d.confidence) || 0), 0) / total * 10) / 10
    : 0

  // Distribution by crop (for donut chart)
  const cropCounts = {}
  detections.forEach((d) => {
    const crop = d.crop || getCropFromDisease(d.disease)
    cropCounts[crop] = (cropCounts[crop] || 0) + 1
  })
  const cropDistribution = Object.entries(cropCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: CROP_COLORS[i % CROP_COLORS.length] }))

  // Top diseases (for bar chart)
  const topDiseases = sortedDiseases.slice(0, 6).map(([disease, value]) => ({
    label: formatDisease(disease),
    value,
    color: isHealthy(disease) ? 'from-emerald-500 to-green-600' : 'from-amber-500 to-orange-600',
  }))

  // Trend: detections per day over the last 14 days
  const trend = buildDailyTrend(detections, 14)

  return {
    total,
    healthy,
    diseased,
    mostFrequent,
    avgConfidence,
    cropDistribution,
    topDiseases,
    trend,
    recent: detections.slice(0, 5),
  }
}

function buildDailyTrend(detections, days) {
  const buckets = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = 0
  }
  detections.forEach((det) => {
    const key = (det.timestamp || '').slice(0, 10)
    if (key in buckets) buckets[key] += 1
  })
  return Object.entries(buckets).map(([key, value]) => ({
    label: key.slice(5), // MM-DD
    value,
  }))
}
