// AI service that generates healthcare-focused responses with Ollama AI integration

import { searchBillingParadise } from './webSearchService'

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || ''

const healthcareResponses = {
  'Medical Coding': {
    tone: 'professional coding specialist',
    expertise: 'ICD-10-CM, CPT, HCPCS coding guidelines, modifier usage, and coding compliance'
  },
  'Healthcare RCM': {
    tone: 'revenue cycle management expert',
    expertise: 'claims processing, payment posting, denial management, and revenue optimization'
  },
  'Claims & Denials': {
    tone: 'denial management specialist',
    expertise: 'claim submission, denial prevention, appeal processes, and payer requirements'
  },
  'Career Guidance': {
    tone: 'healthcare career advisor',
    expertise: 'certifications, career paths, professional development, and industry trends'
  },
  'General Healthcare Knowledge': {
    tone: 'healthcare operations consultant',
    expertise: 'healthcare administration, compliance, best practices, and industry standards'
  }
}

// Check if query is healthcare-related and should trigger web search
const isHealthcareQuery = (query) => {
  const healthcareKeywords = [
    'rcm', 'revenue cycle', 'medical coding', 'icd', 'cpt', 'billing',
    'claims', 'denials', 'healthcare', 'medical', 'coding', 'revenue',
    'modifier', 'hcpcs', 'denial', 'appeal', 'payer', 'reimbursement'
  ]
  const lowerQuery = query.toLowerCase()
  return healthcareKeywords.some(keyword => lowerQuery.includes(keyword))
}

export const generateAIResponse = async (userMessage, category, history = []) => {
  // Check if we should perform web search
  const shouldSearch = isHealthcareQuery(userMessage)
  let searchResults = null
  let sourceUrl = null
  let additionalUrls = []

  if (shouldSearch) {
    try {
      // Perform web search on billingparadise.com
      searchResults = await searchBillingParadise(userMessage)
      if (searchResults) {
        sourceUrl = searchResults.primaryUrl
        additionalUrls = searchResults.additionalUrls || []
      }
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  try {
    // Call Ollama API via backend
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        category: category,
        history: history,
        searchContext: searchResults
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    // Log the response for debugging
    console.log('AI Service Response:', data)

    // Handle different response formats
    let responseText = 'No response generated'
    if (typeof data.data === 'string') {
      // Backend returns string directly in data.data
      responseText = data.data
    } else if (data.data?.content) {
      responseText = data.data.content
    } else if (data.data?.response) {
      responseText = data.data.response
    } else if (data.data?.text) {
      responseText = data.data.text
    } else if (data.response) {
      responseText = data.response
    } else if (data.text) {
      responseText = data.text
    } else {
      console.warn('Unexpected response format:', data)
    }

    return {
      text: responseText,
      sourceUrl: sourceUrl || data.data?.specialtyUrl,
      additionalUrls: additionalUrls
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiUrl: `${API_BASE_URL}/api/generate`
    })

    // Fallback response
    const categoryInfo = healthcareResponses[category] || healthcareResponses['General Healthcare Knowledge']
    return {
      text: `I apologize, but I'm having trouble connecting to the AI service. As a ${categoryInfo.tone}, I'm here to help with ${categoryInfo.expertise}. Please try again in a moment. Error: ${error.message}`,
      sourceUrl: sourceUrl,
      additionalUrls: additionalUrls
    }
  }
}
