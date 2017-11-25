var MIME_RE = /^([^/]+)\/([^;]+)/;

// Score RFC facets (see https://tools.ietf.org/html/rfc6838#section-3)
var FACET_SCORES = {
  'prs.': 100,
  'x-': 200,
  'x.': 300,
  'vnd.': 400,
  default: 900
};

// Score mime source (Logic originally from `jshttp/mime-types` module)
var SOURCE_SCORES = {
  'nginx': 10,
  'apache': 20,
  'iana': 40,
  default: 30 // definitions added by `jsttp/mime-db` project?
};

var TYPE_SCORES = {
  // prefer application/xml over text/xml
  // prefer application/rtf over text/rtf
  application: 1,

  // prefer font/woff over application/font-woff
  font: 2,

  default: 0
}

/**
 * Get a mimetype "score" that can be used to resolve extension conflicts in a
 * deterministic way.
 *
 * @param mimeType (String) The mime type. E.g. "image/bmp"
 * @param source (String) Optinoal source of the mime type. May be one of "iana",
 *                        "apache", "nginx", or undefined
 *
 * @return (Number) Score corresponding to how "official" the type is.  The
 * number breaks down as follows:
 *  100's digit: determined by RFC facet
 *  10's digit : determined by source
 *  1's digit  : determined by general type. E.g. 'application' vs 'text'
 *  fraction   : inverse string length (shorter = larger value)
 */
module.exports = function mimeScore(mimeType, source) {
  if (!MIME_RE.test(mimeType)) return 0;
  var type = RegExp.$1;
  var subtype = RegExp.$2;
  var facet = /^([a-z]+\.|x-)/.test(subtype) && RegExp.$1 || undefined;

  return (FACET_SCORES[facet] || FACET_SCORES.default)
    + (SOURCE_SCORES[source] || SOURCE_SCORES.default)
    + (TYPE_SCORES[type] || TYPE_SCORES.default)
    + (1 - mimeType.length/100); // All other things being equal, prefer shorter types
};
