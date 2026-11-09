import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';
const req=(path,country,host='www.posxevents.com')=>new Request('https://'+host+path,{headers:{'x-vercel-ip-country':country}});
test('gate precedes canonical and HTML redirects for every method',()=>{
 for(const method of ['GET','HEAD','POST','OPTIONS','PATCH']) for(const path of ['/','/index.html','/calculator.html','/calculator','/assets/app.js','/buy','/api/buy','/missing/']) {
  const r=middleware(new Request('https://posxevents.com'+path,{method,headers:{'x-vercel-ip-country':'HK'}}));
  assert.equal(r.status,403);assert.equal(r.headers.get('location'),null);
 }
});
test('non-HK static clean URLs and canonical target remain available',()=>{
 assert.equal(middleware(req('/calculator.html?q=1','US')).headers.get('location'),'/calculator?q=1');
 assert.equal(middleware(req('/index.html','US')).headers.get('location'),'/');
 assert.equal(middleware(req('/calculator?q=1','US')).headers.get('x-middleware-rewrite'),'https://www.posxevents.com/calculator.html?q=1');
 assert.equal(middleware(req('/calculator?q=1','US','posxevents.com')).headers.get('location'),'https://www.posxevents.com/calculator?q=1');
 assert.equal(middleware(req('/assets/app.js','US')).headers.get('x-middleware-next'),'1');
});
