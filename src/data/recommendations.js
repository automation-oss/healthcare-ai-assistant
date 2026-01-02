// Content recommendations based on keywords and categories

export const getRecommendations = (query, category) => {
  const queryLower = query.toLowerCase()
  
  // Medical Coding recommendations
  if (category === 'Medical Coding' || queryLower.includes('coding') || queryLower.includes('icd') || queryLower.includes('cpt') || queryLower.includes('modifier')) {
    return {
      title: 'Medical Coding Resources',
      items: [
        { text: 'Top ICD-10 Guidelines for Beginners', type: 'article' },
        { text: 'How to Avoid Common CPT Coding Errors', type: 'article' },
        { text: 'Understanding Modifier Usage in Medical Billing', type: 'article' },
        { text: 'Read More Medical Coding Blogs', type: 'cta', action: 'explore' }
      ]
    }
  }
  
  // RCM recommendations
  if (category === 'Healthcare RCM' || queryLower.includes('rcm') || queryLower.includes('revenue') || queryLower.includes('billing') || queryLower.includes('claim')) {
    return {
      title: 'RCM Resources',
      items: [
        { text: 'Revenue Cycle Management Best Practices', type: 'article' },
        { text: 'Optimizing Your Claims Submission Process', type: 'article' },
        { text: 'Denial Management Strategies That Work', type: 'article' },
        { text: 'Explore RCM Workflow Tips', type: 'cta', action: 'explore' }
      ]
    }
  }
  
  // Claims & Denials recommendations
  if (category === 'Claims & Denials' || queryLower.includes('denial') || queryLower.includes('claim') || queryLower.includes('appeal')) {
    return {
      title: 'Claims & Denials Resources',
      items: [
        { text: 'Common Claim Denial Reasons and Solutions', type: 'article' },
        { text: 'How to Write Effective Appeal Letters', type: 'article' },
        { text: 'Preventing Denials Before They Happen', type: 'article' },
        { text: 'View Denial Management Guides', type: 'cta', action: 'explore' }
      ]
    }
  }
  
  // Career Guidance recommendations
  if (category === 'Career Guidance' || queryLower.includes('career') || queryLower.includes('certification') || queryLower.includes('job') || queryLower.includes('salary')) {
    return {
      title: 'Career Development Resources',
      items: [
        { text: 'Medical Coding Certification Guide', type: 'article' },
        { text: 'RCM Career Path and Salary Expectations', type: 'article' },
        { text: 'Continuing Education for Healthcare Professionals', type: 'article' },
        { text: 'Browse Career Resources', type: 'cta', action: 'explore' }
      ]
    }
  }
  
  // General Healthcare recommendations
  if (category === 'General Healthcare Knowledge' || queryLower.includes('healthcare') || queryLower.includes('medical') || queryLower.includes('patient')) {
    return {
      title: 'Healthcare Knowledge Base',
      items: [
        { text: 'Healthcare Compliance Essentials', type: 'article' },
        { text: 'HIPAA Guidelines for Healthcare Providers', type: 'article' },
        { text: 'Patient Privacy and Data Security', type: 'article' },
        { text: 'Explore Healthcare Articles', type: 'cta', action: 'explore' }
      ]
    }
  }
  
  // Default recommendations
  return {
    title: 'Recommended Resources',
    items: [
      { text: 'Getting Started with Medical Coding', type: 'article' },
      { text: 'RCM Fundamentals', type: 'article' },
      { text: 'Healthcare Best Practices', type: 'article' },
      { text: 'Browse All Resources', type: 'cta', action: 'explore' }
    ]
  }
}

