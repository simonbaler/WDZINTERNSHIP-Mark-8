import { generateTextContent } from '@/lib/gemini';

interface AISearchResult {
  interpretation: string;
  suggestions: string[];
  relatedTerms: string[];
}

/**
 * Use Gemini AI to interpret search queries and provide intelligent suggestions
 */
export const useAISearch = async (query: string): Promise<AISearchResult> => {
  if (!query.trim()) {
    return {
      interpretation: '',
      suggestions: [],
      relatedTerms: [],
    };
  }

  try {
    const prompt = `You are a camera equipment expert. Analyze this search query and provide:
1. A clear interpretation of what the user is looking for
2. 3-4 specific product suggestions they might be interested in
3. 3-4 related search terms they could use

Query: "${query}"

Respond in JSON format:
{
  "interpretation": "What the user is looking for",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "relatedTerms": ["term1", "term2", "term3"]
}`;

    const response = await generateTextContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        interpretation: parsed.interpretation || '',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        relatedTerms: Array.isArray(parsed.relatedTerms) ? parsed.relatedTerms : [],
      };
    } catch {
      return {
        interpretation: response,
        suggestions: [],
        relatedTerms: [],
      };
    }
  } catch (error) {
    console.error('AI search failed:', error);
    return {
      interpretation: '',
      suggestions: [],
      relatedTerms: [],
    };
  }
};

/**
 * Filter products based on AI interpretation
 */
export const filterProductsByAIInterpretation = (
  products: any[],
  interpretation: string
): any[] => {
  if (!interpretation) return products;

  const keywords = interpretation.toLowerCase().split(/\s+/);
  
  return products.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    keywords.forEach(keyword => {
      if (a.name?.toLowerCase().includes(keyword)) scoreA += 2;
      if (a.description?.toLowerCase().includes(keyword)) scoreA += 1;
      if (a.specs && Object.values(a.specs).some(s => String(s).toLowerCase().includes(keyword))) scoreA += 1;

      if (b.name?.toLowerCase().includes(keyword)) scoreB += 2;
      if (b.description?.toLowerCase().includes(keyword)) scoreB += 1;
      if (b.specs && Object.values(b.specs).some(s => String(s).toLowerCase().includes(keyword))) scoreB += 1;
    });

    return scoreB - scoreA;
  });
};
