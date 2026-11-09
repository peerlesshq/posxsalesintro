import { next, rewrite } from '@vercel/functions';
import { regionResponse } from './lib/hk-region-gate.mjs';

// Platform cleanUrls redirects precede Proxy; normalize only after the gate.
const htmlRoutes = new Set(["/calculator", "/posx-infographic"]);
export default function middleware(request) {
  const denied = regionResponse(request);
  if (denied) return denied;
  const url = new URL(request.url);
  if (url.hostname === 'posxevents.com') {
    url.hostname = 'www.posxevents.com';
    return new Response(null, {status:307, headers:{Location:url.href}});
  }
  if (url.pathname.endsWith('.html')) {
    url.pathname = url.pathname === '/index.html' ? '/' : url.pathname.slice(0,-5);
    return new Response(null, {status:308, headers:{Location:url.pathname + url.search}});
  }
  if (htmlRoutes.has(url.pathname)) {
    url.pathname += '.html';
    return rewrite(url);
  }
  return next();
}
