import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mode, content, numQuestions, difficulty } = await req.json()

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create prompt based on mode
    const prompt = mode === 'topic' 
      ? `Generate ${numQuestions} multiple choice questions about "${content}" with ${difficulty} difficulty level.`
      : `Generate ${numQuestions} multiple choice questions based on the following text with ${difficulty} difficulty level:\n\n${content}`

    const systemPrompt = `You are a quiz generator. Create exactly ${numQuestions} multiple choice questions with 4 options each. 
    
    Return ONLY a valid JSON array with this exact structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 2
      }
    ]
    
    Requirements:
    - Each question must have exactly 4 options
    - correctAnswer is the index (0-3) of the correct option
    - Questions should be ${difficulty} difficulty level
    - Make questions clear and unambiguous
    - Ensure only one correct answer per question`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Parse AI response as JSON
    let questions
    try {
      questions = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Invalid response format from AI')
    }

    // Validate response structure
    if (!Array.isArray(questions) || questions.length !== numQuestions) {
      throw new Error('Invalid number of questions generated')
    }

    // Add unique IDs to questions
    const questionsWithIds = questions.map((q: any, index: number) => ({
      id: `q${index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }))

    return new Response(
      JSON.stringify({ questions: questionsWithIds }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error generating quiz:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate quiz questions' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})