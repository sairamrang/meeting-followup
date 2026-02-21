// AI Service - AI-powered content generation using Anthropic Claude
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface GenerateContentRequest {
  type: 'recap' | 'valueProposition' | 'actionItems';
  sourceContent: string; // Either raw text or content fetched from URL
  context?: {
    meetingType?: string;
    companyName?: string;
    productName?: string;
  };
}

export class AIService {
  /**
   * Fetch content from a URL
   */
  private async fetchUrlContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');

      // Handle HTML content
      if (contentType?.includes('text/html')) {
        const html = await response.text();
        // Basic HTML to text conversion (strip tags)
        return html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      // Handle plain text
      if (contentType?.includes('text/plain')) {
        return await response.text();
      }

      // For other types, try to get text
      return await response.text();
    } catch (error: any) {
      throw new Error(`Failed to fetch content from URL: ${error.message}`);
    }
  }

  /**
   * Check if input is a URL
   */
  private isUrl(input: string): boolean {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get content from either text or URL
   */
  private async getContent(input: string): Promise<string> {
    if (this.isUrl(input)) {
      return await this.fetchUrlContent(input);
    }
    return input;
  }

  /**
   * Generate meeting recap from raw notes
   */
  async generateRecap(request: GenerateContentRequest): Promise<string> {
    const content = await this.getContent(request.sourceContent);

    const contextInfo = request.context
      ? `Meeting Type: ${request.context.meetingType || 'General'}
Company: ${request.context.companyName || 'N/A'}
Product: ${request.context.productName || 'N/A'}

`
      : '';

    const prompt = `${contextInfo}Please transform the following meeting notes into a well-structured, professional meeting recap.

The recap should:
- Use clear, concise language
- Highlight key discussion points
- Organize information logically
- Use HTML formatting (headings, paragraphs, lists)
- Be professional and engaging

Meeting Notes:
${content}

Generate the recap in HTML format (use <h2>, <h3>, <p>, <ul>, <li> tags):`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '';
  }

  /**
   * Generate value proposition from meeting context
   */
  async generateValueProposition(request: GenerateContentRequest): Promise<string> {
    const content = await this.getContent(request.sourceContent);

    const contextInfo = request.context
      ? `Company: ${request.context.companyName || 'N/A'}
Product: ${request.context.productName || 'N/A'}

`
      : '';

    const prompt = `${contextInfo}Based on the following meeting recap or notes, create a compelling value proposition that explains why this solution/product is valuable for the prospect.

The value proposition should:
- Be EXACTLY 3-6 sentences long - no more, no less. This is a strict constraint.
- Be punchy, direct, and impactful
- Highlight the most compelling benefits from the meeting
- Address the prospect's key pain points
- Use HTML formatting (wrap in a single <p> tag)
- Be persuasive but professional

Meeting Context:
${content}

Generate a concise 3-6 sentence value proposition in HTML format (single paragraph):`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '';
  }

  /**
   * Generate action items from meeting recap
   */
  async generateActionItems(request: GenerateContentRequest): Promise<Array<{ action: string; owner?: string; deadline?: string }>> {
    const content = await this.getContent(request.sourceContent);

    const prompt = `Based on the following meeting recap or notes, extract clear, actionable next steps.

For each action item, identify:
- The specific action to be taken
- Who should own it (if mentioned)
- Any deadline or timeframe (if mentioned)

Meeting Context:
${content}

Return ONLY a valid JSON array of action items in this exact format:
[
  {
    "action": "Description of the action",
    "owner": "Person's name or role (optional)",
    "deadline": "ISO date string or relative timeframe (optional)"
  }
]

Important: Return ONLY the JSON array, no other text or formatting.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return [];
    }

    try {
      // Extract JSON from the response
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const actionItems = JSON.parse(jsonMatch[0]);
      return Array.isArray(actionItems) ? actionItems : [];
    } catch (error) {
      console.error('Failed to parse action items:', error);
      return [];
    }
  }

  /**
   * Main generation method
   */
  async generateContent(request: GenerateContentRequest): Promise<any> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    switch (request.type) {
      case 'recap':
        return await this.generateRecap(request);

      case 'valueProposition':
        return await this.generateValueProposition(request);

      case 'actionItems':
        return await this.generateActionItems(request);

      default:
        throw new Error(`Unknown generation type: ${request.type}`);
    }
  }
}

export const aiService = new AIService();
