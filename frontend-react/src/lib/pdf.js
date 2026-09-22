import jsPDF from 'jspdf'

/**
 * Generate and download a PDF report for a detection record.
 */
export function downloadReport(rec) {
  if (!rec) return
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header banner
  doc.setFillColor(16, 185, 129)
  doc.rect(0, 0, pageWidth, 38, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('AgroGuard AI - Detection Report', pageWidth / 2, 24, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(new Date(rec.timestamp).toLocaleString(), pageWidth / 2, 31, { align: 'center' })

  doc.setTextColor(0, 0, 0)
  y = 52

  const section = (title) => {
    doc.setFont(undefined, 'bold')
    doc.setFontSize(12)
    doc.text(title, 18, y)
    y += 6
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
  }
  const wrap = (text) => {
    const lines = doc.splitTextToSize(text || '', pageWidth - 36)
    doc.text(lines, 18, y)
    y += lines.length * 5 + 3
  }

  section('Summary')
  wrap(`Crop / Plant: ${rec.crop || 'Unknown'}`)
  wrap(`Detected Disease: ${(rec.disease || '').replace(/_/g, ' ')}`)
  wrap(`Confidence: ${rec.confidence}%`)
  wrap(`Status: ${rec.status}  |  Severity: ${rec.severity}`)
  y += 2

  if (rec.description) { section('Description'); wrap(rec.description) }
  if (rec.symptoms) { section('Possible Symptoms'); wrap(rec.symptoms) }

  if (rec.treatment?.length) {
    section('Recommended Treatment')
    rec.treatment.forEach((t, i) => wrap(`${i + 1}. ${t}`))
  }
  if (rec.prevention?.length) {
    section('Prevention Tips')
    rec.prevention.forEach((t) => wrap(`- ${t}`))
  }

  if (rec.weather?.city) {
    section('Weather')
    wrap(`Location: ${rec.weather.city}`)
    wrap(`Temperature: ${rec.weather.temperature} C  |  Humidity: ${rec.weather.humidity}%  |  Wind: ${rec.weather.wind_speed} m/s`)
  }

  doc.save(`AgroGuard_Report_${(rec.disease || 'scan')}_${new Date(rec.timestamp).toISOString().slice(0, 10)}.pdf`)
}
