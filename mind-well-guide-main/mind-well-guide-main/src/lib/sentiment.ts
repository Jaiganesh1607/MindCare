// Sentiment analysis using Hugging Face Transformers
// This provides privacy-first, client-side emotion detection

import { pipeline } from '@huggingface/transformers';

let sentimentPipeline: any = null;
let emotionPipeline: any = null;

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: Array<{
    label: string;
    score: number;
  }>;
  intensity: 'mild' | 'moderate' | 'severe';
  suggestions: string[];
}

// Initialize the sentiment analysis pipeline
export const initializeSentimentAnalysis = async () => {
  try {
    if (!sentimentPipeline) {
      sentimentPipeline = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
    }
    
    if (!emotionPipeline) {
      emotionPipeline = await pipeline(
        'text-classification',
        'Xenova/bert-base-multilingual-uncased-sentiment'
      );
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize sentiment analysis:', error);
    return false;
  }
};

// Analyze text sentiment and emotions
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  try {
    // Initialize if not already done
    if (!sentimentPipeline) {
      await initializeSentimentAnalysis();
    }

    if (!sentimentPipeline) {
      throw new Error('Sentiment pipeline not initialized');
    }

    // Get sentiment analysis
    const sentimentResults = await sentimentPipeline(text);
    const sentiment = sentimentResults[0];

    // Simple emotion detection based on keywords and sentiment
    const emotions = detectEmotions(text, sentiment);
    
    // Determine intensity based on confidence and text analysis
    const intensity = determineIntensity(text, sentiment.score);
    
    // Generate suggestions based on sentiment and intensity
    const suggestions = generateSuggestions(sentiment.label.toLowerCase(), intensity, emotions);

    return {
      sentiment: mapSentimentLabel(sentiment.label),
      confidence: sentiment.score,
      emotions,
      intensity,
      suggestions
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    // Fallback analysis using keyword matching
    return fallbackAnalysis(text);
  }
};

// Map sentiment labels to our format
const mapSentimentLabel = (label: string): 'positive' | 'negative' | 'neutral' => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('positive')) return 'positive';
  if (lowerLabel.includes('negative')) return 'negative';
  return 'neutral';
};

// Simple emotion detection using keywords
const detectEmotions = (text: string, sentiment: any): Array<{label: string; score: number}> => {
  const lowerText = text.toLowerCase();
  const emotions = [];

  // Emotion keywords mapping
  const emotionKeywords = {
    joy: ['happy', 'excited', 'joy', 'cheerful', 'delighted', 'thrilled', 'glad'],
    sadness: ['sad', 'depressed', 'down', 'blue', 'miserable', 'unhappy', 'grief'],
    anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'rage', 'frustrated'],
    fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'panic', 'fearful'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen']
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(keyword => lowerText.includes(keyword));
    if (matches.length > 0) {
      emotions.push({
        label: emotion,
        score: Math.min(0.9, matches.length * 0.3 + sentiment.score * 0.4)
      });
    }
  }

  // If no specific emotions detected, add based on sentiment
  if (emotions.length === 0) {
    if (sentiment.label.toLowerCase() === 'positive') {
      emotions.push({ label: 'joy', score: sentiment.score });
    } else if (sentiment.label.toLowerCase() === 'negative') {
      emotions.push({ label: 'sadness', score: sentiment.score });
    } else {
      emotions.push({ label: 'calm', score: 0.5 });
    }
  }

  return emotions.sort((a, b) => b.score - a.score).slice(0, 3);
};

// Determine intensity based on various factors
const determineIntensity = (text: string, confidence: number): 'mild' | 'moderate' | 'severe' => {
  const lowerText = text.toLowerCase();
  
  // Intensity indicators
  const highIntensityWords = ['extremely', 'very', 'really', 'so', 'incredibly', 'absolutely', 'completely'];
  const urgentWords = ['help', 'can\'t', 'unbearable', 'overwhelming', 'desperate', 'crisis'];
  
  const hasHighIntensity = highIntensityWords.some(word => lowerText.includes(word));
  const hasUrgentWords = urgentWords.some(word => lowerText.includes(word));
  
  if (hasUrgentWords || (confidence > 0.9 && hasHighIntensity)) {
    return 'severe';
  } else if (confidence > 0.7 || hasHighIntensity) {
    return 'moderate';
  } else {
    return 'mild';
  }
};

// Generate personalized suggestions
const generateSuggestions = (
  sentiment: string, 
  intensity: string, 
  emotions: Array<{label: string; score: number}>
): string[] => {
  const suggestions: string[] = [];
  const topEmotion = emotions[0]?.label || 'calm';

  if (sentiment === 'negative') {
    if (intensity === 'severe') {
      suggestions.push(
        "It sounds like you're going through a really tough time. Consider reaching out to a mental health professional.",
        "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8.",
        "Remember: this feeling is temporary and you don't have to face it alone."
      );
    } else if (intensity === 'moderate') {
      suggestions.push(
        "Take a few deep breaths and try to ground yourself in the present moment.",
        "Consider going for a short walk or doing some light stretching.",
        "Write down three things you're grateful for today."
      );
    } else {
      suggestions.push(
        "Practice mindfulness for a few minutes to center yourself.",
        "Try listening to some calming music or nature sounds.",
        "Remember to be kind to yourself during difficult moments."
      );
    }
  } else if (sentiment === 'positive') {
    suggestions.push(
      "It's wonderful that you're feeling good! Take a moment to savor this feeling.",
      "Consider sharing your positive energy with someone you care about.",
      "Keep a note of what's making you feel good to remember for later."
    );
  } else {
    suggestions.push(
      "Sometimes feeling neutral is perfectly okay. You're doing well.",
      "Try a short meditation to connect with your inner self.",
      "Consider doing something small that usually brings you joy."
    );
  }

  // Add emotion-specific suggestions
  if (topEmotion === 'fear' || topEmotion === 'anxiety') {
    suggestions.push("Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.");
  } else if (topEmotion === 'anger') {
    suggestions.push("Channel this energy into physical activity or creative expression.");
  } else if (topEmotion === 'sadness') {
    suggestions.push("It's okay to feel sad. Allow yourself to experience this emotion without judgment.");
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

// Fallback analysis when AI models fail
const fallbackAnalysis = (text: string): SentimentResult => {
  const lowerText = text.toLowerCase();
  
  // Simple keyword-based analysis
  const positiveWords = ['good', 'great', 'happy', 'love', 'amazing', 'wonderful', 'excellent'];
  const negativeWords = ['bad', 'sad', 'hate', 'awful', 'terrible', 'worried', 'anxious', 'depressed'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.5;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.8, 0.5 + positiveCount * 0.1);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.8, 0.5 + negativeCount * 0.1);
  }
  
  return {
    sentiment,
    confidence,
    emotions: [{ label: sentiment === 'positive' ? 'joy' : sentiment === 'negative' ? 'sadness' : 'calm', score: confidence }],
    intensity: confidence > 0.7 ? 'moderate' : 'mild',
    suggestions: generateSuggestions(sentiment, confidence > 0.7 ? 'moderate' : 'mild', [])
  };
};