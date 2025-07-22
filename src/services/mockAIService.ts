// Mock AI fact-checking service
export interface FactCheckResult {
  originalText: string;
  isFactual: boolean;
  confidence: number;
  explanation: string;
  sources?: string[];
}

export class MockAIService {
  static async factCheck(text: string): Promise<FactCheckResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock fact-checking responses based on text content
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('earth is flat')) {
      return {
        originalText: text,
        isFactual: false,
        confidence: 0.95,
        explanation: "The Earth is not flat. Scientific evidence overwhelmingly supports that the Earth is an oblate spheroid. This has been proven through satellite imagery, physics experiments, and direct observation.",
        sources: ["NASA", "National Geographic", "Scientific American"]
      };
    }
    
    if (lowerText.includes('water boils at 100')) {
      return {
        originalText: text,
        isFactual: true,
        confidence: 0.98,
        explanation: "Water boils at 100°C (212°F) at standard atmospheric pressure (1 atm or 101.325 kPa). This is a well-established scientific fact.",
        sources: ["Physics textbooks", "NIST", "Encyclopedia Britannica"]
      };
    }
    
    if (lowerText.includes('humans only use 10% of their brain')) {
      return {
        originalText: text,
        isFactual: false,
        confidence: 0.92,
        explanation: "This is a myth. Neurological research shows that humans use virtually all of their brain tissue. Brain imaging studies demonstrate activity throughout the brain even during simple tasks.",
        sources: ["Scientific American", "Nature Neuroscience", "Harvard Medical School"]
      };
    }
    
    // Default response for other text
    return {
      originalText: text,
      isFactual: true,
      confidence: 0.75,
      explanation: "Based on available information, this statement appears to be factually accurate, though additional verification is recommended for critical use cases.",
      sources: ["General knowledge database"]
    };
  }
}