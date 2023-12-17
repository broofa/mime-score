const MIME_RE = /^([^/]+)\/([^;]+)/;

// Score RFC facets (see https://tools.ietf.org/html/rfc6838#section-3)
export const FACET_SCORES: Record<string, number> = {
  'prs.': 100,
  'x-': 200,
  'x.': 300,
  'vnd.': 400,
  default: 900,
};

// Score mime source (Logic originally from `jshttp/mime-types` module)
const SOURCE_SCORES: Record<string, number> = {
  nginx: 10,
  apache: 20,
  iana: 40,
  default: 30, // definitions added by `jshttp/mime-db` project?
};

const TYPE_SCORES: Record<string, number> = {
  // prefer application/xml over text/xml
  // prefer application/rtf over text/rtf
  application: 1,

  // prefer font/woff over application/font-woff
  font: 2,
  audio: 2,
  video: 3, // Prefer video over audio?

  default: 0,
};

/**
 * Get each component of the score for a mime type.  The sum of these is the
 * total score.  The higher the score, the more "official" the type.
 */
export default function (
  mimeType: string,
  source: keyof typeof SOURCE_SCORES = 'default'
) {
  if (typeof mimeType !== 'string') {
    throw new TypeError(`mimeType (${mimeType}) must be a string`);
  }

  if (!MIME_RE.test(mimeType)) return 0;

  const type = RegExp.$1 ?? '';
  const subtype = RegExp.$2 ?? '';
  const facet = (/^([a-z]+\.|x-)/.test(subtype) && RegExp.$1) || '';

  const facetScore = FACET_SCORES[facet] ?? FACET_SCORES.default;
  const sourceScore = SOURCE_SCORES[source] ?? SOURCE_SCORES.default;
  const typeScore = TYPE_SCORES[type] ?? TYPE_SCORES.default;

  // All other things being equal, prefer shorter types
  const lengthScore = 1 - mimeType.length / 100;

  return facetScore + sourceScore + typeScore + lengthScore;
}
