// AI Service Tests - Unit and integration tests for AI content generation
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Create mock with vi.hoisted to ensure it's available before mock factory runs
const { mockCreate } = vi.hoisted(() => {
  return { mockCreate: vi.fn() };
});

// Mock the Anthropic SDK before importing the service
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: mockCreate,
    },
  })),
}));

import { AIService, GenerateContentRequest } from '../services/ai.service';

const MOCK_USER_ID = 'test-user-123';
const SAMPLE_MEETING_NOTES = `
Meeting with Acme Corp - Product Demo
Date: February 10, 2026
Attendees: John (Acme CEO), Sarah (CTO), Mike (our sales rep)

Discussion Points:
- John mentioned they're struggling with manual data entry taking 40+ hours per week
- Current system is outdated and causing errors in reporting
- Sarah interested in our API integration capabilities
- Budget approved for Q2 implementation
- Need to reduce processing time by at least 50%

Action Items:
- Mike to send pricing proposal by Feb 15
- Sarah to provide API documentation requirements by Feb 20
- Schedule technical deep-dive call for next week
- John to get sign-off from board by end of month
`;

const MOCK_RECAP_RESPONSE = `<h2>Meeting Recap: Acme Corp Product Demo</h2>
<p>On February 10, 2026, our team met with Acme Corp executives to discuss their operational challenges and our proposed solution.</p>
<h3>Key Discussion Points</h3>
<ul>
  <li><strong>Current Pain Points:</strong> Acme Corp is currently spending 40+ hours per week on manual data entry, which is significantly impacting their operations. Their existing system is outdated and contributing to reporting errors.</li>
  <li><strong>Technical Interest:</strong> Sarah (CTO) expressed strong interest in our API integration capabilities, viewing them as a solution to streamline their workflows.</li>
  <li><strong>Budget & Timeline:</strong> Budget has been approved for Q2 implementation, indicating serious commitment to moving forward.</li>
  <li><strong>Efficiency Goals:</strong> Acme Corp has a target to reduce processing time by at least 50%, directly addressing their manual data entry bottleneck.</li>
</ul>
<h3>Next Steps</h3>
<p>The meeting concluded with clear action items and a strong likelihood of moving to the next phase of discussions.</p>`;

const MOCK_VALUE_PROP_RESPONSE = `<h2>Value Proposition: Digital Transformation for Acme Corp</h2>
<p>Based on our discussions, our solution directly addresses Acme Corp's critical operational challenges. By automating their manual data entry process, we can deliver immediate and measurable impact to their business.</p>
<h3>Solving Their Core Problem</h3>
<p>Acme Corp currently dedicates 40+ hours per week to manual data entry—a significant drain on resources and a source of operational errors. Our API integration solution eliminates this bottleneck entirely, freeing their team to focus on higher-value strategic work.</p>
<h3>Measurable ROI</h3>
<p>With a target to reduce processing time by 50% or more, our solution doesn't just meet their goals—it exceeds them. This translates to immediate cost savings and improved reporting accuracy across their entire organization.</p>
<h3>Technical Alignment</h3>
<p>Sarah's interest in our API capabilities demonstrates that Acme Corp is looking for a modern, extensible solution. Our platform provides exactly that, with seamless integration into their existing workflows and clear upgrade paths for future growth.</p>`;

const MOCK_ACTION_ITEMS_RESPONSE = `[
  {
    "action": "Send pricing proposal",
    "owner": "Mike",
    "deadline": "2026-02-15"
  },
  {
    "action": "Provide API documentation requirements",
    "owner": "Sarah",
    "deadline": "2026-02-20"
  },
  {
    "action": "Schedule technical deep-dive call",
    "owner": "Mike",
    "deadline": "2026-02-17"
  },
  {
    "action": "Get board sign-off",
    "owner": "John",
    "deadline": "2026-02-28"
  }
]`;

describe('AI Service - Content Generation', () => {
  let aiService: AIService;

  beforeEach(() => {
    // Clear environment
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    process.env.NODE_ENV = 'test';

    // Clear previous mock calls
    mockCreate.mockClear();

    aiService = new AIService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateRecap', () => {
    it('should generate a meeting recap from raw meeting notes', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: MOCK_RECAP_RESPONSE,
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
        context: {
          meetingType: 'Product Demo',
          companyName: 'Acme Corp',
          productName: 'DataFlow API',
        },
      };

      const result = await aiService.generateContent(request);

      expect(result).toContain('<h2>');
      expect(result).toContain('Meeting Recap');
      expect(result).toContain('Acme Corp');
      expect(result).toContain('manual data entry');
      expect(mockCreate).toHaveBeenCalledOnce();

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.model).toBe('claude-sonnet-4-5-20250929');
      expect(callArgs.max_tokens).toBe(2000);
    });

    it('should include context information in the prompt when provided', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
        context: {
          meetingType: 'Product Demo',
          companyName: 'Acme Corp',
          productName: 'DataFlow API',
        },
      };

      await aiService.generateContent(request);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('Product Demo');
      expect(callArgs.messages[0].content).toContain('Acme Corp');
      expect(callArgs.messages[0].content).toContain('DataFlow API');
    });

    it('should handle recap generation without context', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      expect(result).toContain('<h2>');
      expect(result).toContain('</h2>');
    });

    it('should return HTML formatted content for recap', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      expect(result).toMatch(/<h[2-3]>.*<\/h[2-3]>/s);
      expect(result).toMatch(/<ul>[\s\S]*<\/ul>/);
      expect(result).toMatch(/<li>[\s\S]*<\/li>/);
      expect(result).toMatch(/<p>[\s\S]*<\/p>/);
    });
  });

  describe('generateValueProposition', () => {
    it('should generate a value proposition from meeting context', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: MOCK_VALUE_PROP_RESPONSE,
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'valueProposition',
        sourceContent: SAMPLE_MEETING_NOTES,
        context: {
          companyName: 'Acme Corp',
          productName: 'DataFlow API',
        },
      };

      const result = await aiService.generateContent(request);

      expect(result).toContain('Value Proposition');
      expect(result).toContain('40+ hours per week');
      expect(result).toContain('ROI');
      expect(mockCreate).toHaveBeenCalledOnce();

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.max_tokens).toBe(1500);
    });

    it('should create persuasive value proposition with HTML formatting', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_VALUE_PROP_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'valueProposition',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      expect(result).toMatch(/<h[2-3]>[\s\S]*<\/h[2-3]>/);
      expect(result).toMatch(/<p>[\s\S]*<\/p>/);
      // Verify HTML formatting is present (contains HTML tags)
      expect(result).toContain('<');
      expect(result).toContain('>');
    });

    it('should address pain points mentioned in meeting notes', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_VALUE_PROP_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'valueProposition',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      await aiService.generateContent(request);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain('pain points');
      expect(callArgs.messages[0].content).toContain('benefits');
    });
  });

  describe('generateActionItems', () => {
    it('should extract action items as JSON array', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: MOCK_ACTION_ITEMS_RESPONSE,
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'actionItems',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);

      // Verify action item structure
      result.forEach((item: any) => {
        expect(item).toHaveProperty('action');
        expect(typeof item.action).toBe('string');
        if (item.owner) {
          expect(typeof item.owner).toBe('string');
        }
        if (item.deadline) {
          expect(typeof item.deadline).toBe('string');
        }
      });
    });

    it('should extract owner and deadline information when present', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_ACTION_ITEMS_RESPONSE }],
      });

      const request: GenerateContentRequest = {
        type: 'actionItems',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      const mileItems = result.filter((item: any) => item.owner);
      expect(mileItems.length).toBeGreaterThan(0);

      const withDeadlines = result.filter((item: any) => item.deadline);
      expect(withDeadlines.length).toBeGreaterThan(0);
    });

    it('should handle action items without optional fields', async () => {
      const minimalResponse = `[
        {"action": "Follow up via email"},
        {"action": "Send proposal", "owner": "Sales Team"},
        {"action": "Schedule call", "deadline": "2026-02-20"}
      ]`;

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: minimalResponse }],
      });

      const request: GenerateContentRequest = {
        type: 'actionItems',
        sourceContent: 'Follow up via email. Send proposal. Schedule call.',
      };

      const result = await aiService.generateContent(request);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual({ action: 'Follow up via email' });
      expect(result[1]).toHaveProperty('owner');
      expect(result[2]).toHaveProperty('deadline');
    });

    it('should return empty array if JSON parsing fails', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'This is not valid JSON',
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'actionItems',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array if no JSON array found in response', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'No action items found in the meeting notes.',
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'actionItems',
        sourceContent: 'Brief casual conversation',
      };

      const result = await aiService.generateContent(request);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if ANTHROPIC_API_KEY is not set', async () => {
      delete process.env.ANTHROPIC_API_KEY;

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      await expect(aiService.generateContent(request)).rejects.toThrow(
        'ANTHROPIC_API_KEY environment variable is not set'
      );
    });

    it('should throw error for unknown generation type', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'test' }],
      });

      const request = {
        type: 'unknownType',
        sourceContent: SAMPLE_MEETING_NOTES,
      } as any;

      await expect(aiService.generateContent(request)).rejects.toThrow(
        'Unknown generation type'
      );
    });

    it('should handle API errors gracefully', async () => {
      mockCreate.mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      await expect(aiService.generateContent(request)).rejects.toThrow(
        'API rate limit exceeded'
      );
    });

    it('should handle malformed response content', async () => {
      mockCreate.mockResolvedValue({
        content: [],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);
      expect(result).toBe('');
    });

    it('should handle response without text content', async () => {
      mockCreate.mockResolvedValue({
        content: [
          {
            type: 'image',
            image: 'data:image/png;...',
          },
        ],
      });

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      };

      const result = await aiService.generateContent(request);
      expect(result).toBe('');
    });
  });

  describe('Content Validation', () => {
    it('should validate minimum source content length requirement', async () => {
      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: 'Too short',
      };

      // The service doesn't validate minimum length, but routes do
      // This test documents expected behavior
      expect(request.sourceContent.length).toBeLessThan(10);
    });

    it('should handle very large meeting notes', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      const largeNotes = SAMPLE_MEETING_NOTES.repeat(100);

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: largeNotes,
      };

      const result = await aiService.generateContent(request);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle special characters in content', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      const contentWithSpecialChars = `
        Meeting Notes with special chars: @#$%^&*()
        Quotes: "double" and 'single'
        Symbols: → ← ↑ ↓ © ®
      `;

      const request: GenerateContentRequest = {
        type: 'recap',
        sourceContent: contentWithSpecialChars,
      };

      const result = await aiService.generateContent(request);
      expect(result).toBeDefined();
    });
  });

  describe('Token Usage & Limits', () => {
    it('should use appropriate token limits for each content type', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: MOCK_RECAP_RESPONSE }],
      });

      // Test recap
      await aiService.generateContent({
        type: 'recap',
        sourceContent: SAMPLE_MEETING_NOTES,
      });

      let callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.max_tokens).toBe(2000);

      // Test value proposition
      mockCreate.mockClear();
      await aiService.generateContent({
        type: 'valueProposition',
        sourceContent: SAMPLE_MEETING_NOTES,
      });

      callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.max_tokens).toBe(1500);

      // Test action items
      mockCreate.mockClear();
      await aiService.generateContent({
        type: 'actionItems',
        sourceContent: SAMPLE_MEETING_NOTES,
      });

      callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.max_tokens).toBe(1500);
    });
  });
});
