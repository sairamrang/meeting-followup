// Confirmation types - Micro-commitment confirmation tracking

// Enum matching Prisma schema
export enum ConfirmationType {
  RECAP_ACCURATE = 'RECAP_ACCURATE',         // "Is this recap accurate?" - Yes
  RECAP_INACCURATE = 'RECAP_INACCURATE',     // "Is this recap accurate?" - No/Something's off
  VALUE_PROP_CLEAR = 'VALUE_PROP_CLEAR',     // "Does this resonate?" - Yes
  VALUE_PROP_UNCLEAR = 'VALUE_PROP_UNCLEAR', // "Does this resonate?" - Tell me more
  INTERESTED = 'INTERESTED',                 // "Interested? Book a call" - Yes, interested
  SCHEDULE_CALL = 'SCHEDULE_CALL',           // "Book a call" - Clicked to schedule
}

// Confirmation entity
export interface FollowupConfirmation {
  id: string;
  followupId: string;
  sessionId?: string | null;
  type: ConfirmationType;
  confirmedAt: Date;
  comment?: string | null;
}

// DTO for creating a confirmation (public - no auth required)
export interface CreateConfirmationDTO {
  type: ConfirmationType;
  sessionId?: string;
  comment?: string;
}

// Confirmation analytics/metrics
export interface ConfirmationMetrics {
  followupId: string;
  total: number;
  byType: {
    [key in ConfirmationType]?: number;
  };
  // Calculated percentages
  recapAccuracyRate: number | null; // % who found recap accurate (out of those who responded)
  valuePropResonanceRate: number | null; // % who said value prop resonated
  interestRate: number | null; // % who expressed interest
  // Recent confirmations for detail view
  recentConfirmations: FollowupConfirmation[];
}

// Response for public confirmation endpoint
export interface ConfirmationResponse {
  success: boolean;
  confirmation: FollowupConfirmation;
  message: string;
}
