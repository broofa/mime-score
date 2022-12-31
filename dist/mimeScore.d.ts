export declare const FACET_SCORES: Record<string, number>;
declare const SOURCE_SCORES: Record<string, number>;
/**
 * Get each component of the score for a mime type.  The sum of these is the
 * total score.  The higher the score, the more "official" the type.
 */
export default function (mimeType: string, source?: keyof typeof SOURCE_SCORES): number;
export {};
