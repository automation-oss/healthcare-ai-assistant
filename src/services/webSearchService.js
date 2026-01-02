// Web search service for billingparadise.com
// Calls backend API which handles web scraping

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3001'

export const searchBillingParadise = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      return {
        primaryUrl: result.data.primaryUrl,
        additionalUrls: result.data.additionalUrls || [],
        content: result.data.content || ''
      }
    }

    return null
  } catch (error) {
    console.error('Search error:', error)
    // Fallback to mock results if API fails
    const keywords = extractKeywords(query)
    return generateMockResults(keywords)
  }
}

const extractKeywords = (query) => {
  // Extract healthcare-related keywords
  const healthcareTerms = ['rcm', 'revenue cycle', 'medical coding', 'icd', 'cpt', 'billing',
    'claims', 'denials', 'healthcare', 'medical', 'coding', 'billing', 'revenue']

  const lowerQuery = query.toLowerCase()
  const foundTerms = healthcareTerms.filter(term => lowerQuery.includes(term))

  if (foundTerms.length > 0) {
    return foundTerms[0]
  }

  // Return first few words if no healthcare terms found
  return query.split(' ').slice(0, 3).join(' ')
}

const generateMockResults = (keywords) => {
  // Generate mock URLs based on keywords
  const baseUrl = 'https://www.billingparadise.com'

  const urlMap = {
    'rcm': {
      primaryUrl: `${baseUrl}/revenue-cycle-management/`,
      additionalUrls: [
        `${baseUrl}/rcm-best-practices/`,
        `${baseUrl}/rcm-workflow-optimization/`,
        `${baseUrl}/rcm-trends-2024/`
      ],
      content: 'Revenue Cycle Management (RCM) is crucial for healthcare organizations to optimize financial performance and ensure timely reimbursement.'
    },
    'medical coding': {
      primaryUrl: `${baseUrl}/medical-coding-guide/`,
      additionalUrls: [
        `${baseUrl}/icd-10-coding-tips/`,
        `${baseUrl}/cpt-coding-errors/`,
        `${baseUrl}/medical-coding-certification/`
      ],
      content: 'Medical coding requires precision and up-to-date knowledge of ICD-10, CPT, and HCPCS codes to ensure accurate billing and compliance.'
    },
    'claims': {
      primaryUrl: `${baseUrl}/claims-processing/`,
      additionalUrls: [
        `${baseUrl}/claim-denial-prevention/`,
        `${baseUrl}/claim-appeals/`,
        `${baseUrl}/clean-claims-submission/`
      ],
      content: 'Efficient claims processing is essential for maintaining cash flow and reducing denials in healthcare practices.'
    },
    'denials': {
      primaryUrl: `${baseUrl}/denial-management/`,
      additionalUrls: [
        `${baseUrl}/common-denial-reasons/`,
        `${baseUrl}/denial-appeal-strategies/`,
        `${baseUrl}/preventing-denials/`
      ],
      content: 'Effective denial management involves identifying root causes, implementing preventive measures, and developing strong appeal processes.'
    },
    'billing': {
      primaryUrl: `${baseUrl}/medical-billing/`,
      additionalUrls: [
        `${baseUrl}/billing-best-practices/`,
        `${baseUrl}/billing-compliance/`,
        `${baseUrl}/billing-automation/`
      ],
      content: 'Medical billing requires attention to detail, compliance with regulations, and efficient processes to maximize revenue.'
    }
  }

  // Find matching category
  const lowerKeywords = keywords.toLowerCase()
  for (const [key, value] of Object.entries(urlMap)) {
    if (lowerKeywords.includes(key)) {
      return value
    }
  }

  // Default results
  return {
    primaryUrl: `${baseUrl}/healthcare-resources/`,
    additionalUrls: [
      `${baseUrl}/blog/`,
      `${baseUrl}/resources/`,
      `${baseUrl}/healthcare-news/`
    ],
    content: 'Explore our comprehensive healthcare resources for medical coding, RCM, and billing best practices.'
  }
}

// Alias for consistency
export const searchBillingParadiseAPI = async (query) => {
  return await searchBillingParadise(query)
}

