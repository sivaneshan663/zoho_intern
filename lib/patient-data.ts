// Shared patient data management system

export interface Medicine {
  id: string
  name: string
  dosage: string
  timing: string
  isIssued?: boolean
}

export interface Test {
  id: string
  name: string
  status: "pending" | "completed"
  date: string
  report?: {
    title: string
    content: string
    fileName?: string
    fileData?: string
    fileType?: string
    uploadedBy?: string
    uploadedAt?: string
  }
  isPerformed?: boolean
  uploadedReport?: string
  uploadedFileData?: string
  uploadedFileType?: string
}

export interface Prescription {
  id: string
  medicine: string
  dosage: string
  timing: string
  isIssued?: boolean
}

export interface MedicalVisit {
  id: string
  date: string
  department: string
  doctor: string
  symptoms: string
  diagnosis: string
  treatment: string
  tests: Test[]
  prescriptions: Prescription[]
  visitToken: string // Temporary token for this visit
  visitStatus: "active" | "completed" | "cancelled"
}

export interface PatientRecord {
  patientId: string // Permanent patient ID (e.g., "P001")
  password: string // Password for login
  name: string
  dob: string
  age: number
  gender: string
  medicalHistory: MedicalVisit[]
  contactNumber: string
  allergies: string
  email?: string
  address?: string
  bloodGroup?: string
  emergencyContact?: string
}

// Staff user types
export interface StaffUser {
  id: string
  password: string
  name: string
  role: "doctor" | "nurse" | "admin" | "receptionist"
  department?: string
  specialization?: string
  contactNumber?: string
}

// Active visit token
export interface ActiveVisit {
  tokenNumber: string
  patientId: string
  patientName: string
  department: string
  doctor: string
  date: string
  time: string
  status: "waiting" | "in-progress" | "completed"
  createdAt: string
}

// Initial patient data
const initialPatients: { [key: string]: PatientRecord } = {
  P001: {
    patientId: "P001",
    password: "patient123",
    name: "Vaseekar",
    dob: "1990-05-15",
    age: 35,
    gender: "Male",
    contactNumber: "+1-555-0123",
    allergies: "Penicillin",
    email: "vaseekar@email.com",
    bloodGroup: "O+",
    medicalHistory: [
      {
        id: "visit1",
        date: "2025-01-15",
        department: "Cardiology",
        doctor: "Dr. Kaviya",
        symptoms: "Chest pain, shortness of breath",
        diagnosis: "Hypertension",
        treatment: "Prescribed medication",
        visitToken: "001",
        visitStatus: "completed",
        tests: [
          {
            id: "test1",
            name: "Blood Test",
            status: "completed",
            date: "2025-01-15",
            report: {
              title: "Blood Test Report",
              content: "All parameters normal. Hemoglobin: 14.5 g/dL, WBC: 7000/µL, Platelets: 250,000/µL",
              fileName: "Blood Test Report.pdf",
              uploadedBy: "Nurse",
              uploadedAt: new Date().toISOString(),
            },
            isPerformed: true,
            uploadedReport: "Blood Test Report.pdf",
          },
          {
            id: "test2",
            name: "ECG",
            status: "completed",
            date: "2025-01-15",
            report: {
              title: "ECG Report",
              content: "Normal sinus rhythm. Heart rate: 72 bpm. No abnormalities detected.",
              fileName: "ECG Report.pdf",
              uploadedBy: "Nurse",
              uploadedAt: new Date().toISOString(),
            },
            isPerformed: true,
            uploadedReport: "ECG Report.pdf",
          },
        ],
        prescriptions: [
          { id: "presc1", medicine: "Aspirin", dosage: "100mg", timing: "Once daily", isIssued: true },
          { id: "presc2", medicine: "Lisinopril", dosage: "10mg", timing: "Twice daily", isIssued: true },
        ],
      },
    ],
  },
  P002: {
    patientId: "P002",
    password: "patient123",
    name: "Hariharan",
    dob: "1985-08-20",
    age: 39,
    gender: "Male",
    contactNumber: "+1-555-0124",
    allergies: "None",
    email: "hariharan@email.com",
    bloodGroup: "A+",
    medicalHistory: [
      {
        id: "visit2",
        date: "2024-12-20",
        department: "General Medicine",
        doctor: "Dr. Pragadish",
        symptoms: "Persistent cough, fever",
        diagnosis: "Common Cold",
        treatment: "Rest and fluids",
        visitToken: "002",
        visitStatus: "completed",
        tests: [
          {
            id: "test3",
            name: "Chest X-Ray",
            status: "completed",
            date: "2024-12-20",
            report: {
              title: "Chest X-Ray Report",
              content: "No significant findings. Lungs appear clear.",
              fileName: "Chest X-Ray Report.pdf",
              uploadedBy: "Nurse",
              uploadedAt: new Date().toISOString(),
            },
            isPerformed: true,
            uploadedReport: "Chest X-Ray Report.pdf",
          },
        ],
        prescriptions: [
          { id: "presc3", medicine: "Paracetamol", dosage: "500mg", timing: "Three times daily", isIssued: true },
        ],
      },
    ],
  },
  P003: {
    patientId: "P003",
    password: "patient123",
    name: "sai dharan",
    dob: "1992-12-10",
    age: 32,
    gender: "Male",
    contactNumber: "+1-555-0125",
    allergies: "Sulfa drugs",
    email: "sai.dharan@email.com",
    bloodGroup: "B+",
    medicalHistory: [],
  },
}

// Initial staff data
const initialStaff: { [key: string]: StaffUser } = {
  D001: {
    id: "D001",
    password: "doctor123",
    name: "Dr. Kaviya",
    role: "doctor",
    department: "Cardiology",
    specialization: "Cardiologist",
    contactNumber: "+1-555-1001",
  },
  D002: {
    id: "D002",
    password: "doctor123",
    name: "Dr. Pragadish",
    role: "doctor",
    department: "General Medicine",
    specialization: "General Physician",
    contactNumber: "+1-555-1002",
  },
  N001: {
    id: "N001",
    password: "nurse123",
    name: "Nurse Surya",
    role: "nurse",
    department: "General",
    contactNumber: "+1-555-2001",
  },
  N002: {
    id: "N002",
    password: "nurse123",
    name: "Nurse Rohith",
    role: "nurse",
    department: "Emergency",
    contactNumber: "+1-555-2002",
  },
  A001: {
    id: "A001",
    password: "admin123",
    name: "Admin Krishiv",
    role: "admin",
    contactNumber: "+1-555-3001",
  },
  R001: {
    id: "R001",
    password: "reception123",
    name: "Reception Mary",
    role: "receptionist",
    contactNumber: "+1-555-4001",
  },
}

// In-memory database
let patientsDB: { [key: string]: PatientRecord } = {}
let staffDB: { [key: string]: StaffUser } = {}
let activeVisitsDB: { [key: string]: ActiveVisit } = {}

// Initialize the database
function initializeDatabase() {
  if (typeof window !== "undefined") {
    // Initialize patients
    const storedPatients = localStorage.getItem("patients_db")
    if (storedPatients) {
      try {
        const parsed = JSON.parse(storedPatients)
        patientsDB = { ...JSON.parse(JSON.stringify(initialPatients)) }
        // Override with stored data but preserve passwords from initial if missing
        for (const key of Object.keys(parsed)) {
          if (patientsDB[key] && initialPatients[key]) {
            patientsDB[key] = {
              ...parsed[key],
              // Force use initial patient's name, id, password
              name: initialPatients[key].name,
              id: initialPatients[key].patientId,
              password: initialPatients[key].password || parsed[key].password || "patient123",
            }
          } else if (patientsDB[key]) {
            // Initial patient not in initialPatients anymore
            patientsDB[key] = {
              ...patientsDB[key],
              ...parsed[key],
              password: parsed[key].password || patientsDB[key].password || "patient123",
            }
          } else {
            // New patient from storage (user registered)
            patientsDB[key] = parsed[key]
          }
        }
        localStorage.setItem("patients_db", JSON.stringify(patientsDB))
      } catch (e) {
        patientsDB = JSON.parse(JSON.stringify(initialPatients))
        localStorage.setItem("patients_db", JSON.stringify(patientsDB))
      }
    } else {
      patientsDB = JSON.parse(JSON.stringify(initialPatients))
      localStorage.setItem("patients_db", JSON.stringify(patientsDB))
    }

    // Initialize staff - Always ensure initial staff credentials are available
    const storedStaff = localStorage.getItem("staff_db")
    if (storedStaff) {
      try {
        const parsed = JSON.parse(storedStaff)
        staffDB = { ...JSON.parse(JSON.stringify(initialStaff)) }
        for (const key of Object.keys(parsed)) {
          if (staffDB[key] && initialStaff[key]) {
            staffDB[key] = {
              ...parsed[key],
              // Force use initial staff's name, id, role, department, password
              name: initialStaff[key].name,
              id: initialStaff[key].id,
              role: initialStaff[key].role,
              department: initialStaff[key].department,
              password: initialStaff[key].password || parsed[key].password,
            }
          } else if (staffDB[key]) {
            staffDB[key] = {
              ...staffDB[key],
              ...parsed[key],
              password: parsed[key].password || staffDB[key].password,
            }
          } else {
            staffDB[key] = parsed[key]
          }
        }
        localStorage.setItem("staff_db", JSON.stringify(staffDB))
      } catch (e) {
        staffDB = JSON.parse(JSON.stringify(initialStaff))
        localStorage.setItem("staff_db", JSON.stringify(staffDB))
      }
    } else {
      staffDB = JSON.parse(JSON.stringify(initialStaff))
      localStorage.setItem("staff_db", JSON.stringify(staffDB))
    }

    // Initialize active visits
    const storedVisits = localStorage.getItem("active_visits_db")
    if (storedVisits) {
      try {
        activeVisitsDB = JSON.parse(storedVisits)
      } catch (e) {
        activeVisitsDB = {}
        localStorage.setItem("active_visits_db", JSON.stringify(activeVisitsDB))
      }
    }
  }
}

initializeDatabase()

export function refreshDatabase() {
  if (typeof window !== "undefined") {
    const storedPatients = localStorage.getItem("patients_db")
    if (storedPatients) {
      try {
        patientsDB = JSON.parse(storedPatients)
      } catch (e) {
        console.error("Error refreshing from localStorage:", e)
      }
    }
    const storedVisits = localStorage.getItem("active_visits_db")
    if (storedVisits) {
      try {
        activeVisitsDB = JSON.parse(storedVisits)
      } catch (e) {
        console.error("Error refreshing visits:", e)
      }
    }
  }
}

// ============ PATIENT AUTHENTICATION ============
export function loginPatient(patientId: string, password: string): PatientRecord | null {
  refreshDatabase()
  const upperCaseId = patientId.toUpperCase()
  const patient = patientsDB[upperCaseId]

  console.log("[v0] Login attempt:", { patientId: upperCaseId, passwordProvided: password })
  console.log("[v0] Patient found:", patient ? { id: patient.patientId, hasPassword: !!patient.password } : null)

  if (patient && patient.password === password) {
    console.log("[v0] Login successful")
    return patient
  }

  console.log("[v0] Login failed - password mismatch or patient not found")
  return null
}

export function getPatientById(patientId: string): PatientRecord | null {
  refreshDatabase()
  return patientsDB[patientId.toUpperCase()] || null
}

// Legacy function for backward compatibility
export function getPatient(token: string, dob: string): PatientRecord | null {
  refreshDatabase()
  // Try to find by patient ID first
  const patient = patientsDB[token.toUpperCase()]
  if (patient && patient.dob === dob) {
    return patient
  }
  // Fallback: search by visit token
  for (const p of Object.values(patientsDB)) {
    if (p.dob === dob) {
      const hasToken = p.medicalHistory.some((v) => v.visitToken === token)
      if (hasToken) return p
    }
  }
  return null
}

export function registerPatient(data: {
  name: string
  dob: string
  age: number
  gender: string
  contactNumber: string
  email?: string
  password: string
  allergies?: string
  bloodGroup?: string
  address?: string
  emergencyContact?: string
}): PatientRecord {
  refreshDatabase()

  // Generate new patient ID
  const existingIds = Object.keys(patientsDB).filter((id) => id.startsWith("P"))
  const maxNum = existingIds.reduce((max, id) => {
    const num = Number.parseInt(id.replace("P", ""))
    return num > max ? num : max
  }, 0)
  const newPatientId = `P${String(maxNum + 1).padStart(3, "0")}`

  const newPatient: PatientRecord = {
    patientId: newPatientId,
    password: data.password,
    name: data.name,
    dob: data.dob,
    age: data.age,
    gender: data.gender,
    contactNumber: data.contactNumber,
    email: data.email,
    allergies: data.allergies || "None",
    bloodGroup: data.bloodGroup,
    address: data.address,
    emergencyContact: data.emergencyContact,
    medicalHistory: [],
  }

  patientsDB[newPatientId] = newPatient
  if (typeof window !== "undefined") {
    localStorage.setItem("patients_db", JSON.stringify(patientsDB))
  }
  return newPatient
}

// ============ STAFF AUTHENTICATION ============
export function loginStaff(staffId: string, password: string): StaffUser | null {
  if (typeof window !== "undefined") {
    const storedStaff = localStorage.getItem("staff_db")
    if (storedStaff) {
      staffDB = JSON.parse(storedStaff)
    }
  }
  const staff = staffDB[staffId.toUpperCase()]
  if (staff && staff.password === password) {
    return staff
  }
  return null
}

export function getStaffById(staffId: string): StaffUser | null {
  if (typeof window !== "undefined") {
    const storedStaff = localStorage.getItem("staff_db")
    if (storedStaff) {
      staffDB = JSON.parse(storedStaff)
    }
  }
  return staffDB[staffId.toUpperCase()] || null
}

export function getAllStaff(): StaffUser[] {
  if (typeof window !== "undefined") {
    const storedStaff = localStorage.getItem("staff_db")
    if (storedStaff) {
      staffDB = JSON.parse(storedStaff)
    }
  }
  return Object.values(staffDB)
}

export function addStaff(data: {
  name: string
  role: "doctor" | "nurse" | "admin" | "receptionist"
  password: string
  department?: string
  specialization?: string
  contactNumber?: string
}): StaffUser {
  if (typeof window !== "undefined") {
    const storedStaff = localStorage.getItem("staff_db")
    if (storedStaff) {
      staffDB = JSON.parse(storedStaff)
    }
  }

  const prefix = data.role === "doctor" ? "D" : data.role === "nurse" ? "N" : data.role === "admin" ? "A" : "R"
  const existingIds = Object.keys(staffDB).filter((id) => id.startsWith(prefix))
  const maxNum = existingIds.reduce((max, id) => {
    const num = Number.parseInt(id.replace(prefix, ""))
    return num > max ? num : max
  }, 0)
  const newStaffId = `${prefix}${String(maxNum + 1).padStart(3, "0")}`

  const newStaff: StaffUser = {
    id: newStaffId,
    password: data.password,
    name: data.name,
    role: data.role,
    department: data.department,
    specialization: data.specialization,
    contactNumber: data.contactNumber,
  }

  staffDB[newStaffId] = newStaff
  if (typeof window !== "undefined") {
    localStorage.setItem("staff_db", JSON.stringify(staffDB))
  }
  return newStaff
}

// ============ VISIT TOKEN MANAGEMENT ============
export function generateVisitToken(patientId: string, department: string, doctor: string): ActiveVisit | null {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient) return null

  // Generate sequential token for today
  const today = new Date().toISOString().split("T")[0]
  const todayVisits = Object.values(activeVisitsDB).filter((v) => v.date === today)
  const tokenNum = String(todayVisits.length + 1).padStart(3, "0")

  const newVisit: ActiveVisit = {
    tokenNumber: tokenNum,
    patientId: patient.patientId,
    patientName: patient.name,
    department: department,
    doctor: doctor,
    date: today,
    time: new Date().toLocaleTimeString(),
    status: "waiting",
    createdAt: new Date().toISOString(),
  }

  activeVisitsDB[tokenNum] = newVisit
  if (typeof window !== "undefined") {
    localStorage.setItem("active_visits_db", JSON.stringify(activeVisitsDB))
  }

  // Also add to patient's medical history
  const medicalVisit: MedicalVisit = {
    id: `visit-${Date.now()}`,
    date: today,
    department: department,
    doctor: doctor,
    symptoms: "To be recorded",
    diagnosis: "Pending",
    treatment: "Pending",
    visitToken: tokenNum,
    visitStatus: "active",
    tests: [],
    prescriptions: [],
  }
  patientsDB[patientId.toUpperCase()].medicalHistory.push(medicalVisit)
  localStorage.setItem("patients_db", JSON.stringify(patientsDB))

  return newVisit
}

export function getActiveVisitByToken(tokenNumber: string): ActiveVisit | null {
  refreshDatabase()
  return activeVisitsDB[tokenNumber] || null
}

export function getActiveVisitsForToday(): ActiveVisit[] {
  refreshDatabase()
  const today = new Date().toISOString().split("T")[0]
  return Object.values(activeVisitsDB).filter((v) => v.date === today)
}

export function getPatientActiveVisit(patientId: string): ActiveVisit | null {
  refreshDatabase()
  const today = new Date().toISOString().split("T")[0]
  return (
    Object.values(activeVisitsDB).find(
      (v) => v.patientId === patientId.toUpperCase() && v.date === today && v.status !== "completed",
    ) || null
  )
}

export function updateVisitStatus(tokenNumber: string, status: "waiting" | "in-progress" | "completed"): boolean {
  refreshDatabase()

  if (activeVisitsDB[tokenNumber]) {
    activeVisitsDB[tokenNumber].status = status

    if (typeof window !== "undefined") {
      localStorage.setItem("active_visits_db", JSON.stringify(activeVisitsDB))
    }

    // If completed, update the medical history
    if (status === "completed") {
      const visit = activeVisitsDB[tokenNumber]
      const patient = patientsDB[visit.patientId]
      if (patient) {
        const visitIndex = patient.medicalHistory.findIndex((v) => v.visitToken === tokenNumber)
        if (visitIndex !== -1) {
          patient.medicalHistory[visitIndex].visitStatus = "completed"
          patientsDB[visit.patientId] = patient
          localStorage.setItem("patients_db", JSON.stringify(patientsDB))
        }
      }
    }
    return true
  }
  return false
}

// ============ PATIENT DATA OPERATIONS ============
export function getAllPatients(): PatientRecord[] {
  refreshDatabase()
  return Object.values(patientsDB)
}

export function searchPatientByToken(visitToken: string): PatientRecord | null {
  refreshDatabase()

  // First check active visits
  const activeVisit = activeVisitsDB[visitToken]
  if (activeVisit) {
    return patientsDB[activeVisit.patientId] || null
  }

  // Search in medical history
  for (const patient of Object.values(patientsDB)) {
    if (patient.medicalHistory.some((v) => v.visitToken === visitToken)) {
      return patient
    }
  }
  return null
}

export function addTestsToPatient(patientId: string, tests: Test[]): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient) return false

  if (patient.medicalHistory.length === 0) {
    const newVisit: MedicalVisit = {
      id: `visit-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      department: "General",
      doctor: "Doctor",
      symptoms: "As discussed",
      diagnosis: "Pending",
      treatment: "Pending",
      visitToken: "000",
      visitStatus: "active",
      tests: tests,
      prescriptions: [],
    }
    patient.medicalHistory.push(newVisit)
  } else {
    const lastVisitIndex = patient.medicalHistory.length - 1
    patient.medicalHistory[lastVisitIndex].tests = [...patient.medicalHistory[lastVisitIndex].tests, ...tests]
  }

  patientsDB[patientId.toUpperCase()] = patient
  if (typeof window !== "undefined") {
    localStorage.setItem("patients_db", JSON.stringify(patientsDB))
  }
  return true
}

export function addPrescriptionsToPatient(patientId: string, prescriptions: Prescription[]): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient) return false

  if (patient.medicalHistory.length === 0) {
    const newVisit: MedicalVisit = {
      id: `visit-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      department: "General",
      doctor: "Doctor",
      symptoms: "As discussed",
      diagnosis: "Pending",
      treatment: "Medication prescribed",
      visitToken: "000",
      visitStatus: "active",
      tests: [],
      prescriptions: prescriptions,
    }
    patient.medicalHistory.push(newVisit)
  } else {
    const lastVisitIndex = patient.medicalHistory.length - 1
    patient.medicalHistory[lastVisitIndex].prescriptions = [
      ...patient.medicalHistory[lastVisitIndex].prescriptions,
      ...prescriptions,
    ]
  }

  patientsDB[patientId.toUpperCase()] = patient
  if (typeof window !== "undefined") {
    localStorage.setItem("patients_db", JSON.stringify(patientsDB))
  }
  return true
}

export function markTestAsPerformed(patientId: string, testId: string, isPerformed: boolean): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return false

  const lastVisitIndex = patient.medicalHistory.length - 1
  const test = patient.medicalHistory[lastVisitIndex].tests?.find((t) => t.id === testId)
  if (test) {
    test.isPerformed = isPerformed
    patientsDB[patientId.toUpperCase()] = patient
    if (typeof window !== "undefined") {
      localStorage.setItem("patients_db", JSON.stringify(patientsDB))
    }
    return true
  }
  return false
}

export function markMedicineAsIssued(patientId: string, medicineId: string, isIssued: boolean): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return false

  const lastVisitIndex = patient.medicalHistory.length - 1
  const medicine = patient.medicalHistory[lastVisitIndex].prescriptions?.find((p) => p.id === medicineId)
  if (medicine) {
    medicine.isIssued = isIssued
    patientsDB[patientId.toUpperCase()] = patient
    if (typeof window !== "undefined") {
      localStorage.setItem("patients_db", JSON.stringify(patientsDB))
    }
    return true
  }
  return false
}

export function saveTestReport(
  patientId: string,
  testId: string,
  reportName: string,
  reportContent?: string,
  fileData?: string,
  fileType?: string,
): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return false

  const lastVisitIndex = patient.medicalHistory.length - 1
  const test = patient.medicalHistory[lastVisitIndex].tests?.find((t) => t.id === testId)
  if (test) {
    test.uploadedReport = reportName
    test.status = "completed"
    test.isPerformed = true

    if (fileData) {
      test.uploadedFileData = fileData
      test.uploadedFileType = fileType
    }

    test.report = {
      title: `${test.name} Report`,
      content:
        reportContent || `Test: ${test.name}\nDate: ${test.date}\nStatus: Completed\n\nReport file: ${reportName}`,
      fileName: reportName,
      fileData: fileData || undefined,
      fileType: fileType || undefined,
      uploadedBy: "Nurse",
      uploadedAt: new Date().toISOString(),
    }

    patientsDB[patientId.toUpperCase()] = patient
    if (typeof window !== "undefined") {
      localStorage.setItem("patients_db", JSON.stringify(patientsDB))
    }
    return true
  }
  return false
}

export function updatePatientVisit(
  patientId: string,
  updates: { tests?: Test[]; prescriptions?: Prescription[]; diagnosis?: string; treatment?: string },
): boolean {
  refreshDatabase()

  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return false

  const lastVisitIndex = patient.medicalHistory.length - 1
  if (updates.tests) {
    patient.medicalHistory[lastVisitIndex].tests = updates.tests
  }
  if (updates.prescriptions) {
    patient.medicalHistory[lastVisitIndex].prescriptions = updates.prescriptions
  }
  if (updates.diagnosis) {
    patient.medicalHistory[lastVisitIndex].diagnosis = updates.diagnosis
  }
  if (updates.treatment) {
    patient.medicalHistory[lastVisitIndex].treatment = updates.treatment
  }

  patientsDB[patientId.toUpperCase()] = patient
  if (typeof window !== "undefined") {
    localStorage.setItem("patients_db", JSON.stringify(patientsDB))
  }
  return true
}

export function getPatientTests(patientId: string): Test[] {
  refreshDatabase()
  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return []
  return patient.medicalHistory[patient.medicalHistory.length - 1].tests || []
}

export function getPatientPrescriptions(patientId: string): Prescription[] {
  refreshDatabase()
  const patient = patientsDB[patientId.toUpperCase()]
  if (!patient || patient.medicalHistory.length === 0) return []
  return patient.medicalHistory[patient.medicalHistory.length - 1].prescriptions || []
}

export function resetDatabase() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("patients_db")
    localStorage.removeItem("staff_db")
    localStorage.removeItem("active_visits_db")
    localStorage.removeItem("patient_session")
    localStorage.removeItem("doctor_session")
    localStorage.removeItem("nurse_session")
    localStorage.removeItem("admin_session")
    localStorage.removeItem("currentPatient")
    localStorage.removeItem("doctorSearch")
    localStorage.removeItem("nurseSearch")

    // Reset in-memory databases
    patientsDB = JSON.parse(JSON.stringify(initialPatients))
    staffDB = JSON.parse(JSON.stringify(initialStaff))
    activeVisitsDB = {}

    // Save fresh data
    localStorage.setItem("patients_db", JSON.stringify(patientsDB))
    localStorage.setItem("staff_db", JSON.stringify(staffDB))
    localStorage.setItem("active_visits_db", JSON.stringify(activeVisitsDB))
  }
}
