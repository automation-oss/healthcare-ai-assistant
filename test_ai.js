import { generateAIResponse } from './src/services/aiService.js'

async function test() {
    console.log("Testing AI Service...")

    // Test 1: General greeting
    console.log("\n--- Test 1: Greeting ---")
    const res1 = await generateAIResponse("Hello, how are you?", "General Healthcare Knowledge")
    console.log("User: Hello, how are you?")
    console.log("AI:", res1.content)

    // Test 2: Medical Coding Question (should trigger search)
    console.log("\n--- Test 2: Coding Question ---")
    const res2 = await generateAIResponse("What is the ICD-10 code for hypertension?", "Medical Coding")
    console.log("User: What is the ICD-10 code for hypertension?")
    console.log("AI:", res2.content)

    // Test 3: RCM Question (fallback)
    console.log("\n--- Test 3: RCM Question (Fallback) ---")
    const res3 = await generateAIResponse("How to improve RCM?", "Healthcare RCM")
    console.log("User: How to improve RCM?")
    console.log("AI:", res3.content)
}

test().catch(console.error)
