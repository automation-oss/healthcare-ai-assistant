import axios from 'axios'
import * as cheerio from 'cheerio'
import { detectSpecialty } from './specialtyDetector.js'

/**
 * Search billingparadise.com for healthcare-related content
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results with URLs and content
 */
export async function searchBillingParadise(query) {
  try {
    // First, check if this is a specialty query
    const detectedSpecialty = detectSpecialty(query)

    if (detectedSpecialty) {
      console.log(`🎯 Specialty detected: ${detectedSpecialty.name}`)

      // Fetch the specialty page directly
      try {
        const response = await axios.get(detectedSpecialty.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 10000
        })

        const $ = cheerio.load(response.data)

        // Extract content from the specialty page
        let content = ''

        // Try to extract main content
        const contentSelectors = [
          '.entry-content p',
          'article p',
          '.post-content p',
          '.content p',
          'main p'
        ]

        for (const selector of contentSelectors) {
          const paragraphs = $(selector)
          if (paragraphs.length > 0) {
            // Get first 2-3 paragraphs
            paragraphs.slice(0, 3).each((i, elem) => {
              const text = $(elem).text().trim()
              if (text.length > 50) {
                content += text + ' '
              }
            })
            if (content.length > 100) break
          }
        }

        // Limit content length
        if (content.length > 500) {
          content = content.substring(0, 500) + '...'
        }

        return {
          primaryUrl: detectedSpecialty.url,
          additionalUrls: getRelatedSpecialtyUrls(detectedSpecialty.key),
          content: content || `Information about ${detectedSpecialty.name} from BillingParadise.`
        }
      } catch (error) {
        console.error(`Error fetching specialty page: ${error.message}`)
        // Return specialty info even if fetch fails
        return {
          primaryUrl: detectedSpecialty.url,
          additionalUrls: getRelatedSpecialtyUrls(detectedSpecialty.key),
          content: `Learn more about ${detectedSpecialty.name} at BillingParadise.`
        }
      }
    }

    // If no specialty detected, perform general search
    const keywords = extractKeywords(query)
    const searchUrl = `https://www.billingparadise.com/?s=${encodeURIComponent(keywords)}`

    console.log(`🔍 Searching: ${searchUrl}`)

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const results = extractSearchResults($, keywords)

    console.log(`✅ Found ${results.additionalUrls.length} results`)

    return results

  } catch (error) {
    console.error('Scraping error:', error.message)

    // Fallback to mock results if scraping fails
    return generateFallbackResults(query)
  }
}

/**
 * Get related specialty URLs
 */
function getRelatedSpecialtyUrls(currentSpecialtyKey) {
  const relatedUrls = [
    'https://billingparadise.com/medical-billing-services',
    'https://billingparadise.com/revenue-cycle-management',
    'https://billingparadise.com/medical-coding-services'
  ]

  return relatedUrls.slice(0, 3)
}

/**
 * Extract keywords from user query
 */
function extractKeywords(query) {
  const healthcareTerms = [
    'rcm', 'revenue cycle', 'medical coding', 'icd', 'cpt', 'billing',
    'claims', 'denials', 'healthcare', 'medical', 'coding', 'revenue',
    'modifier', 'hcpcs', 'denial', 'appeal', 'payer', 'reimbursement'
  ]

  const lowerQuery = query.toLowerCase()
  const foundTerms = healthcareTerms.filter(term => lowerQuery.includes(term))

  if (foundTerms.length > 0) {
    return foundTerms[0]
  }

  // Return first few words if no healthcare terms found
  return query.split(' ').slice(0, 3).join(' ')
}

/**
 * Extract search results from the page HTML
 */
function extractSearchResults($, keywords) {
  const results = {
    primaryUrl: null,
    additionalUrls: [],
    content: ''
  }

  try {
    // Try to find article/post links
    const selectors = [
      'article a',
      '.post a',
      '.entry-title a',
      'h2 a',
      'h3 a',
      '.search-result a',
      '.post-title a'
    ]

    const foundUrls = new Set()

    for (const selector of selectors) {
      $(selector).each((i, elem) => {
        const href = $(elem).attr('href')
        if (href && href.includes('billingparadise.com')) {
          let cleanUrl = href
          if (href.startsWith('/')) {
            cleanUrl = `https://www.billingparadise.com${href}`
          }
          if (!cleanUrl.startsWith('http')) {
            cleanUrl = `https://www.billingparadise.com/${cleanUrl}`
          }

          foundUrls.add(cleanUrl)
        }
      })
    }

    // Convert to array and limit results
    const urls = Array.from(foundUrls).slice(0, 5)

    if (urls.length > 0) {
      results.primaryUrl = urls[0]
      results.additionalUrls = urls.slice(1)

      // Try to extract content snippet
      const firstResult = $('article').first() || $('.post').first()
      if (firstResult.length > 0) {
        const excerpt = firstResult.find('.excerpt, .entry-summary, p').first().text().trim()
        if (excerpt) {
          results.content = excerpt.substring(0, 300) + '...'
        }
      }
    }

    // If no results found, try alternative approach
    if (urls.length === 0) {
      $('a[href*="billingparadise.com"]').each((i, elem) => {
        if (i < 5) {
          const href = $(elem).attr('href')
          if (href && !href.includes('#') && !href.includes('mailto:')) {
            let cleanUrl = href
            if (href.startsWith('/')) {
              cleanUrl = `https://www.billingparadise.com${href}`
            }
            if (!cleanUrl.startsWith('http')) {
              cleanUrl = `https://www.billingparadise.com/${cleanUrl}`
            }
            foundUrls.add(cleanUrl)
          }
        }
      })

      const altUrls = Array.from(foundUrls).slice(0, 5)
      if (altUrls.length > 0) {
        results.primaryUrl = altUrls[0]
        results.additionalUrls = altUrls.slice(1)
      }
    }

  } catch (error) {
    console.error('Error extracting results:', error)
  }

  // If still no results, use fallback
  if (!results.primaryUrl) {
    return generateFallbackResults(keywords)
  }

  return results
}

/**
 * Generate fallback results when scraping fails
 */
function generateFallbackResults(query) {
  const baseUrl = 'https://www.billingparadise.com'
  const lowerQuery = query.toLowerCase()

  const urlMap = {
    'rcm': {
      primaryUrl: `${baseUrl}/revenue-cycle-management/`,
      additionalUrls: [
        `${baseUrl}/rcm-best-practices/`,
        `${baseUrl}/medical-billing-services/`,
        `${baseUrl}/healthcare-consulting/`
      ],
      content: 'Revenue Cycle Management (RCM) is crucial for healthcare organizations to optimize financial performance and ensure timely reimbursement.'
    },
    'medical coding': {
      primaryUrl: `${baseUrl}/medical-coding-services/`,
      additionalUrls: [
        `${baseUrl}/icd-10-coding/`,
        `${baseUrl}/cpt-coding/`,
        `${baseUrl}/medical-coding-audit/`
      ],
      content: 'Medical coding requires precision and up-to-date knowledge of ICD-10, CPT, and HCPCS codes to ensure accurate billing and compliance.'
    },
    'claims': {
      primaryUrl: `${baseUrl}/claims-processing/`,
      additionalUrls: [
        `${baseUrl}/claim-denial-management/`,
        `${baseUrl}/claim-appeals/`,
        `${baseUrl}/medical-billing-services/`
      ],
      content: 'Efficient claims processing is essential for maintaining cash flow and reducing denials in healthcare practices.'
    },
    'denials': {
      primaryUrl: `${baseUrl}/denial-management/`,
      additionalUrls: [
        `${baseUrl}/denial-prevention/`,
        `${baseUrl}/appeal-services/`,
        `${baseUrl}/revenue-cycle-management/`
      ],
      content: 'Effective denial management involves identifying root causes, implementing preventive measures, and developing strong appeal processes.'
    },
    'billing': {
      primaryUrl: `${baseUrl}/medical-billing-services/`,
      additionalUrls: [
        `${baseUrl}/billing-compliance/`,
        `${baseUrl}/revenue-cycle-management/`,
        `${baseUrl}/credentialing-services/`
      ],
      content: 'Medical billing requires attention to detail, compliance with regulations, and efficient processes to maximize revenue.'
    }
  }

  // Find matching category
  for (const [key, value] of Object.entries(urlMap)) {
    if (lowerQuery.includes(key)) {
      return value
    }
  }

  // Default results
  return {
    primaryUrl: `${baseUrl}/medical-billing-services/`,
    additionalUrls: [
      `${baseUrl}/revenue-cycle-management/`,
      `${baseUrl}/medical-coding-services/`,
      `${baseUrl}/healthcare-consulting/`
    ],
    content: 'Explore our comprehensive healthcare services for medical coding, RCM, and billing solutions.'
  }
}
