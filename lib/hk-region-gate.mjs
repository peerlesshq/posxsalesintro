// Platform geolocation only. Vercel overwrites this header at the public edge.
// Local HTTP fixtures set it explicitly; there is no production bypass or client consent.
const countries = new Set("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" "));
const restrictedHtml = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Access Restricted / Service Unavailable in Hong Kong</title><style>html{color-scheme:light}body{margin:0;background:#f8f6f3;color:#231e4c;font:17px/1.7 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;min-height:100svh;display:grid;place-items:center}main{box-sizing:border-box;width:min(100%,800px);padding:48px 24px}h1{font-size:32px;line-height:1.2;letter-spacing:-.025em;margin:0 0 24px}h2{font-size:24px;line-height:1.4;margin:40px 0 16px}p{margin:0;overflow-wrap:break-word}main:before{content:\"\";display:block;width:48px;height:5px;background:#6352ce;margin-bottom:32px}</style></head><body><main><h1>Access Denied (Hong Kong)</h1><p>Access to this website and any associated services, staking mechanisms, or digital token features is strictly prohibited and unavailable to users located in or residents of Hong Kong.</p><section lang=\"zh-Hans\"><h2>访问受限（香港地区）</h2><p>本网站及相关技术机制、服务或代币功能严格不向位于香港地区的用户或香港居民开放。</p></section></main></body></html>\n";
const unavailableHtml = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Service Temporarily Unavailable</title><style>html{color-scheme:light}body{margin:0;background:#f8f6f3;color:#231e4c;font:17px/1.7 system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;min-height:100svh;display:grid;place-items:center}main{box-sizing:border-box;width:min(100%,800px);padding:48px 24px}h1{font-size:32px;line-height:1.2;margin:0 0 24px}h2{font-size:24px;margin:40px 0 16px}p{margin:0}main:before{content:\"\";display:block;width:48px;height:5px;background:#6352ce;margin-bottom:32px}</style></head><body><main><h1>Service Temporarily Unavailable</h1><p>Access is temporarily unavailable because your region could not be verified. Please try again later.</p><section lang=\"zh-Hans\"><h2>服务暂时不可用</h2><p>暂时无法核实访问地区，请稍后重试。</p></section></main></body></html>\n";

export function regionResponse(request) {
  const country = request.headers.get("x-vercel-ip-country");
  const status = country === "HK" ? 403 : country && countries.has(country) ? null : 503;
  if (status === null) return null;
  return new Response(request.method === "HEAD" ? null : status === 403 ? restrictedHtml : unavailableHtml, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-POSX-Region-Policy": "hk-site-20261109-v1",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      ...(status === 503 ? { "Retry-After": "60" } : {}),
    },
  });
}
