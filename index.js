var STANDARD_FACET_SCORE = 900;

/**
 * Get a mimetype "score" that can be used to resolve extension conflicts in a
 * deterministic way.
 *
 * @param type (String) The mime type. E.g. "image/bmp"
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
module.exports = function mimeScore(type, source) {
  var pri = 0;
  var parts = type.split('/');
  type = parts[0];
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

  // Prefer application over other types (e.g. text/xml and application/xml, and
  // text/rtf and application/rtf all appear to be respectable mime thingz.)
  switch (type) {
    case 'application': pri += 1; break;
    default: break;
  }

  // All other things being equal, use length
  pri += 1 - type.length/100;

  return pri;
};
