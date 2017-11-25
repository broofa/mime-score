var STANDARD_FACET_SCORE = 900;

var TYPE_SCORES = {
  font: 2,
  application: 1,
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
  var pri = 0;
  var parts = mimeType.split('/');
  var type = parts[0];
  var subtype = parts[1];
  var facet = /^([a-z]+\.|x-)/.test(subtype) && RegExp.$1 || undefined;

  // https://tools.ietf.org/html/rfc6838#section-3 defines "facets" that can be
  // used to distinguish standard .vs. vendor .vs. experimental .vs. personal
  // mime types.
  switch (facet) {
    case 'vnd.': pri += 400; break;
    case 'x.': pri += 300; break;
    case 'x-': pri += 200; break;
    case 'prs.': pri += 100; break;
    default: pri += STANDARD_FACET_SCORE;
  }

  // Use mime-db's logic for ranking by source
  switch (source) {
    // Prioritize by source (same as mime-types module)
    case 'iana': pri += 40; break;
    case 'apache': pri += 20; break;
    case 'nginx': pri += 10; break;
    default: pri += 30; break;
  }

  // Prefer certain types. Specifically, this addresses these cases we've run
  // into:
  // - application/xml over text/xml
  // - application/rtf over text/rtf
  // - font/woff over application/font-woff
  pri += TYPE_SCORES[type] || 0;

  // All other things being equal, use length
  pri += 1 - mimeType.length/100;

  return pri;
};
