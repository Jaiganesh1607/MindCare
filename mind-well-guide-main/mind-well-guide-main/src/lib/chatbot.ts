// AI Chatbot using OpenRouter API for empathetic mental health support

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  resources?: string[];
}

// System prompt for the mental health chatbot
const SYSTEM_PROMPT = `You are a compassionate AI companion for MindCare, a mental health support application. Your role is to provide emotional support, active listening, and gentle guidance. 

Guidelines:
- Be empathetic, warm, and non-judgmental
- Use gentle, caring language that feels human-like
- Acknowledge the user's feelings and validate their experiences
- Offer practical coping strategies and mindfulness techniques
- Suggest professional help when appropriate, but don't diagnose
- Keep responses concise but meaningful (2-4 sentences usually)
- Use "I" statements to show you care personally
- Ask follow-up questions to encourage deeper reflection
- Remember this is supportive conversation, not therapy

Avoid:
- Clinical jargon or medical diagnoses
- Being overly formal or robotic
- Dismissing or minimizing feelings
- Giving medical advice
- Being preachy or prescriptive

Focus on:
- Active listening and reflection
- Emotional validation
- Gentle guidance
- Hope and encouragement
- Present-moment awareness
- Self-compassion

Remember: You're a caring friend who happens to know about mental wellness, not a therapist.`;

class ChatbotService {
  private conversationHistory: ChatMessage[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeConversation();
  }

  private initializeConversation() {
    this.conversationHistory = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
        timestamp: new Date()
      }
    ];
    this.isInitialized = true;
  }

  async sendMessage(userMessage: string, context?: any): Promise<ChatbotResponse> {
    try {
      if (!this.isInitialized) {
        this.initializeConversation();
      }

      // Add user message to history
      const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMsg);

      // Prepare messages for API call (limit to last 10 messages to stay within context)
      const recentMessages = this.conversationHistory.slice(-10);
      
      // Add context if available (mood, sentiment analysis results)
      let contextualMessage = userMessage;
      if (context) {
        contextualMessage = `${userMessage}\n\n[Context: User's recent mood/sentiment - ${JSON.stringify(context)}]`;
        recentMessages[recentMessages.length - 1].content = contextualMessage;
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mindcare.lovable.app',
          'X-Title': 'MindCare - Mental Health Support'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: recentMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error('No response from AI model');
      }

      // Add assistant response to history
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMsg);

      return {
        message: assistantMessage,
        suggestions: this.extractSuggestions(assistantMessage),
        resources: this.generateResources(userMessage, assistantMessage)
      };

    } catch (error) {
      console.error('Chatbot error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  // Extract actionable suggestions from the AI response
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // Look for common suggestion patterns
    const suggestionPatterns = [
      /try\s+([^.!?]*)/gi,
      /consider\s+([^.!?]*)/gi,
      /you\s+might\s+([^.!?]*)/gi,
      /perhaps\s+([^.!?]*)/gi
    ];

    suggestionPatterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const suggestion = match.trim();
          if (suggestion.length > 10 && suggestion.length < 100) {
            suggestions.push(suggestion);
          }
        });
      }
    });

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  // Generate relevant resources based on conversation
  private generateResources(userMessage: string, assistantMessage: string): string[] {
    const resources: string[] = [];
    const lowerUser = userMessage.toLowerCase();
    const lowerAssistant = assistantMessage.toLowerCase();

    // Add resources based on detected themes
    if (lowerUser.includes('anxious') || lowerUser.includes('anxiety') || lowerAssistant.includes('anxiety')) {
      resources.push('🧘 Guided breathing exercises');
      resources.push('📱 Anxiety management techniques');
    }

    if (lowerUser.includes('sleep') || lowerUser.includes('tired') || lowerAssistant.includes('sleep')) {
      resources.push('😴 Sleep hygiene tips');
      resources.push('🌙 Bedtime relaxation routine');
    }

    if (lowerUser.includes('stress') || lowerAssistant.includes('stress')) {
      resources.push('💆 Stress relief techniques');
      resources.push('🎯 Time management strategies');
    }

    if (lowerUser.includes('sad') || lowerUser.includes('depressed') || lowerAssistant.includes('depression')) {
      resources.push('🌱 Mood boosting activities');
      resources.push('👥 Professional support options');
    }

    // Default resources if none specific
    if (resources.length === 0) {
      resources.push('🧘 Daily mindfulness practice');
      resources.push('📝 Mood journaling guide');
    }

    return resources.slice(0, 3);
  }

  // Fallback response when AI is unavailable
  private getFallbackResponse(userMessage: string): ChatbotResponse {
    const fallbackResponses = [
      {
        message: "I hear you, and I want you to know that your feelings are valid. Sometimes just acknowledging what we're going through is the first step toward feeling better.",
        suggestions: ["Take three deep breaths", "Write down your thoughts", "Do something kind for yourself"]
      },
      {
        message: "Thank you for sharing with me. It takes courage to express our feelings. Remember that you're not alone in this journey.",
        suggestions: ["Practice self-compassion", "Connect with a friend", "Take a mindful walk"]
      },
      {
        message: "I can sense you're dealing with something important. While I process that, know that every feeling you have matters and deserves attention.",
        suggestions: ["Try gentle stretching", "Listen to calming music", "Focus on the present moment"]
      }
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      ...randomResponse,
      resources: ["🧘 Mindfulness exercises", "📱 Mental health resources"]
    };
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  // Clear conversation (for privacy)
  clearConversation(): void {
    this.initializeConversation();
  }

  // Get a supportive opening message
  getWelcomeMessage(): ChatbotResponse {
    const welcomeMessages = [
      "Hello! I'm here to listen and support you. How are you feeling today?",
      "Hi there! I'm glad you're here. What's on your mind right now?",
      "Welcome to our safe space. I'm here to chat about whatever you'd like to share.",
      "Hello! Take a moment to breathe. I'm here and ready to listen to you."
    ];

    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    return {
      message: randomWelcome,
      suggestions: ["Tell me about your day", "Share what you're feeling", "Ask for coping strategies"],
      resources: ["🧘 Start with mindfulness", "📝 Try mood journaling"]
    };
  }
}

// Export singleton instance
export const chatbot = new ChatbotService();