// Specialty detector for BillingParadise medical billing services

const SPECIALTIES = {
    'cardiology': {
        keywords: ['cardiology', 'cardiac', 'heart', 'cardiovascular', 'cardiologist'],
        url: 'https://billingparadise.com/cardiology-billing-services',
        name: 'Cardiology Billing Services'
    },
    'orthopedics': {
        keywords: ['orthopedic', 'orthopedics', 'ortho', 'bone', 'joint', 'spine', 'musculoskeletal'],
        url: 'https://billingparadise.com/orthopedic-billing-services',
        name: 'Orthopedic Billing Services'
    },
    'radiology': {
        keywords: ['radiology', 'radiologist', 'imaging', 'x-ray', 'mri', 'ct scan', 'ultrasound'],
        url: 'https://billingparadise.com/radiology-billing-services',
        name: 'Radiology Billing Services'
    },
    'dermatology': {
        keywords: ['dermatology', 'dermatologist', 'skin', 'derma'],
        url: 'https://billingparadise.com/dermatology-billing-services',
        name: 'Dermatology Billing Services'
    },
    'neurology': {
        keywords: ['neurology', 'neurologist', 'brain', 'neurological', 'neuro'],
        url: 'https://billingparadise.com/neurology-billing-services',
        name: 'Neurology Billing Services'
    },
    'gastroenterology': {
        keywords: ['gastroenterology', 'gastro', 'gi', 'digestive', 'endoscopy'],
        url: 'https://billingparadise.com/gastroenterology-billing-services',
        name: 'Gastroenterology Billing Services'
    },
    'oncology': {
        keywords: ['oncology', 'oncologist', 'cancer', 'chemotherapy', 'radiation therapy'],
        url: 'https://billingparadise.com/oncology-billing-services',
        name: 'Oncology Billing Services'
    },
    'pediatrics': {
        keywords: ['pediatric', 'pediatrics', 'children', 'child', 'pediatrician'],
        url: 'https://billingparadise.com/pediatric-billing-services',
        name: 'Pediatric Billing Services'
    },
    'obstetrics-gynecology': {
        keywords: ['obgyn', 'ob/gyn', 'obstetrics', 'gynecology', 'womens health', 'pregnancy'],
        url: 'https://billingparadise.com/obgyn-billing-services',
        name: 'OB/GYN Billing Services'
    },
    'psychiatry': {
        keywords: ['psychiatry', 'psychiatrist', 'mental health', 'behavioral health'],
        url: 'https://billingparadise.com/psychiatry-billing-services',
        name: 'Psychiatry Billing Services'
    },
    'ophthalmology': {
        keywords: ['ophthalmology', 'ophthalmologist', 'eye', 'vision', 'optometry'],
        url: 'https://billingparadise.com/ophthalmology-billing-services',
        name: 'Ophthalmology Billing Services'
    },
    'urology': {
        keywords: ['urology', 'urologist', 'urological', 'kidney', 'bladder'],
        url: 'https://billingparadise.com/urology-billing-services',
        name: 'Urology Billing Services'
    },
    'pulmonology': {
        keywords: ['pulmonology', 'pulmonologist', 'lung', 'respiratory', 'pulmonary'],
        url: 'https://billingparadise.com/pulmonology-billing-services',
        name: 'Pulmonology Billing Services'
    },
    'endocrinology': {
        keywords: ['endocrinology', 'endocrinologist', 'diabetes', 'thyroid', 'hormone'],
        url: 'https://billingparadise.com/endocrinology-billing-services',
        name: 'Endocrinology Billing Services'
    },
    'nephrology': {
        keywords: ['nephrology', 'nephrologist', 'kidney', 'dialysis', 'renal'],
        url: 'https://billingparadise.com/nephrology-billing-services',
        name: 'Nephrology Billing Services'
    },
    'rheumatology': {
        keywords: ['rheumatology', 'rheumatologist', 'arthritis', 'autoimmune'],
        url: 'https://billingparadise.com/rheumatology-billing-services',
        name: 'Rheumatology Billing Services'
    },
    'anesthesiology': {
        keywords: ['anesthesiology', 'anesthesiologist', 'anesthesia', 'pain management'],
        url: 'https://billingparadise.com/anesthesiology-billing-services',
        name: 'Anesthesiology Billing Services'
    },
    'pathology': {
        keywords: ['pathology', 'pathologist', 'laboratory', 'lab'],
        url: 'https://billingparadise.com/pathology-billing-services',
        name: 'Pathology Billing Services'
    },
    'emergency-medicine': {
        keywords: ['emergency', 'er', 'emergency room', 'urgent care'],
        url: 'https://billingparadise.com/emergency-medicine-billing-services',
        name: 'Emergency Medicine Billing Services'
    },
    'family-medicine': {
        keywords: ['family medicine', 'family practice', 'primary care', 'general practice'],
        url: 'https://billingparadise.com/family-medicine-billing-services',
        name: 'Family Medicine Billing Services'
    },
    'internal-medicine': {
        keywords: ['internal medicine', 'internist', 'general medicine'],
        url: 'https://billingparadise.com/internal-medicine-billing-services',
        name: 'Internal Medicine Billing Services'
    },
    'plastic-surgery': {
        keywords: ['plastic surgery', 'cosmetic surgery', 'reconstructive surgery'],
        url: 'https://billingparadise.com/plastic-surgery-billing-services',
        name: 'Plastic Surgery Billing Services'
    },
    'general-surgery': {
        keywords: ['general surgery', 'surgeon', 'surgical'],
        url: 'https://billingparadise.com/general-surgery-billing-services',
        name: 'General Surgery Billing Services'
    },
    'otolaryngology': {
        keywords: ['ent', 'otolaryngology', 'ear nose throat', 'otolaryngologist'],
        url: 'https://billingparadise.com/ent-billing-services',
        name: 'ENT Billing Services'
    },
    'allergy-immunology': {
        keywords: ['allergy', 'immunology', 'allergist', 'immunologist'],
        url: 'https://billingparadise.com/allergy-immunology-billing-services',
        name: 'Allergy & Immunology Billing Services'
    },
    'infectious-disease': {
        keywords: ['infectious disease', 'infection', 'infectious'],
        url: 'https://billingparadise.com/infectious-disease-billing-services',
        name: 'Infectious Disease Billing Services'
    },
    'physical-medicine': {
        keywords: ['physical medicine', 'rehabilitation', 'physiatry', 'pm&r'],
        url: 'https://billingparadise.com/physical-medicine-billing-services',
        name: 'Physical Medicine & Rehabilitation Billing Services'
    },
    'hematology': {
        keywords: ['hematology', 'hematologist', 'blood', 'blood disorder'],
        url: 'https://billingparadise.com/hematology-billing-services',
        name: 'Hematology Billing Services'
    },
    'podiatry': {
        keywords: ['podiatry', 'podiatrist', 'foot', 'ankle'],
        url: 'https://billingparadise.com/podiatry-billing-services',
        name: 'Podiatry Billing Services'
    },
    'chiropractic': {
        keywords: ['chiropractic', 'chiropractor', 'spinal adjustment'],
        url: 'https://billingparadise.com/chiropractic-billing-services',
        name: 'Chiropractic Billing Services'
    }
}

/**
 * Detect medical specialty from user query
 * @param {string} query - User's question
 * @returns {object|null} - Specialty info or null if not detected
 */
export function detectSpecialty(query) {
    const lowerQuery = query.toLowerCase()

    // Check each specialty's keywords
    for (const [specialtyKey, specialtyData] of Object.entries(SPECIALTIES)) {
        for (const keyword of specialtyData.keywords) {
            if (lowerQuery.includes(keyword)) {
                console.log(`Detected specialty: ${specialtyData.name}`)
                return {
                    key: specialtyKey,
                    name: specialtyData.name,
                    url: specialtyData.url,
                    keywords: specialtyData.keywords
                }
            }
        }
    }

    console.log('No specific specialty detected')
    return null
}

/**
 * Get all specialties (for related content)
 * @returns {array} - Array of all specialties
 */
export function getAllSpecialties() {
    return Object.entries(SPECIALTIES).map(([key, data]) => ({
        key,
        name: data.name,
        url: data.url
    }))
}

/**
 * Get specialty by key
 * @param {string} key - Specialty key
 * @returns {object|null} - Specialty info or null
 */
export function getSpecialtyByKey(key) {
    const specialty = SPECIALTIES[key]
    if (!specialty) return null

    return {
        key,
        name: specialty.name,
        url: specialty.url,
        keywords: specialty.keywords
    }
}
