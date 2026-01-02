import dotenv from 'dotenv';


import { detectSpecialty } from './specialtyDetector.js'

dotenv.config()

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export async function generateOllamaResponse(userMessage, category, history = [], searchContext = null) {
    try {
        // Detect specialty from user query
        const detectedSpecialty = detectSpecialty(userMessage)

        // If specialty detected, add context to prompt
        let specialtyInfo = ''
        if (detectedSpecialty) {
            specialtyInfo = `\n\nIMPORTANT: This query is about ${detectedSpecialty.name}. The user is asking about specialty billing services. Use the BillingParadise specialty page: ${detectedSpecialty.url}`
        }

        const systemContext = `You are a healthcare, medical coding, and RCM expert. Answer queries accurately.

IMPORTANT: After your main answer, insert the delimiter "###" and then ask a brief, relevant follow-up question.

Rules:
1. Answer the user's question clearly.
2. If related to specialty billing, mention the specific medical specialty.
3. Use "###" to separate the answer from the follow-up question.

Example:
User: "What is RCM?"
Assistant: "Revenue Cycle Management (RCM) is... [explanation].
###
Would you like to know about the specific steps in the RCM process?"`

        let conversationContext = ''
        if (history.length > 0) {
            const recentHistory = history.slice(-10)
            conversationContext = '\n\nPrevious conversation:\n'
            recentHistory.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant'
                conversationContext += `${role}: ${msg.content}\n`
            })
        }

        let searchInfo = ''
        if (searchContext && searchContext.content) {
            searchInfo = `\n\nRelevant information from billingparadise.com:\n${searchContext.content}\n\nUse this information to answer accurately. Mention it's from billingparadise.com if relevant.`
        }

        const fullPrompt = `${systemContext}${specialtyInfo}${conversationContext}${searchInfo}

User: ${userMessage}

IMPORTANT: Remember to use "###" before your follow-up question.`

        console.log('Calling Ollama API at:', OLLAMA_API_URL)
        if (detectedSpecialty) {
            console.log(`Detected specialty: ${detectedSpecialty.name}`)
        }

        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'qwen:0.5b',
                prompt: fullPrompt,
                stream: false
            })
        })

        console.log('Ollama API response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Ollama API error response:', errorText)
            throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
        }
        const result = await response.json();
        console.log('Ollama API JSON result:', JSON.stringify(result, null, 2));
        if (result && typeof result.response === 'string') {
            return result.response.trim();
        } else if (result && typeof result.output === 'string') {
            return result.output.trim();
        } else if (result && typeof result.content === 'string') {
            return result.content.trim();
        } else {
            throw new Error('Unexpected Ollama response format: no recognizable text field');
        }
    } catch (error) {
        console.error('Ollama API Error:', error.message)
        console.error('Full error:', error)
        throw new Error(`Failed to generate response: ${error.message}`)
    }
}
