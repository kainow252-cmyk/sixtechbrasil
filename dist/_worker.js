var Ot=Object.defineProperty;var Xe=t=>{throw TypeError(t)};var jt=(t,e,r)=>e in t?Ot(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var h=(t,e,r)=>jt(t,typeof e!="symbol"?e+"":e,r),He=(t,e,r)=>e.has(t)||Xe("Cannot "+r);var n=(t,e,r)=>(He(t,e,"read from private field"),r?r.call(t):e.get(t)),x=(t,e,r)=>e.has(t)?Xe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),f=(t,e,r,o)=>(He(t,e,"write to private field"),o?o.call(t,r):e.set(t,r),r),v=(t,e,r)=>(He(t,e,"access private method"),r);var Ye=(t,e,r,o)=>({set _(a){f(t,e,a,r)},get _(){return n(t,e,o)}});var Qe=(t,e,r)=>(o,a)=>{let i=-1;return s(0);async function s(l){if(l<=i)throw new Error("next() called multiple times");i=l;let c,d=!1,p;if(t[l]?(p=t[l][0][0],o.req.routeIndex=l):p=l===t.length&&a||void 0,p)try{c=await p(o,()=>s(l+1))}catch(u){if(u instanceof Error&&e)o.error=u,c=await e(u,o),d=!0;else throw u}else o.finalized===!1&&r&&(c=await r(o));return c&&(o.finalized===!1||d)&&(o.res=c),o}},Dt=Symbol(),Pt=async(t,e=Object.create(null))=>{const{all:r=!1,dot:o=!1}=e,i=(t instanceof gt?t.raw.headers:t.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?Tt(t,{all:r,dot:o}):{}};async function Tt(t,e){const r=await t.formData();return r?It(r,e):{}}function It(t,e){const r=Object.create(null);return t.forEach((o,a)=>{e.all||a.endsWith("[]")?Lt(r,a,o):r[a]=o}),e.dot&&Object.entries(r).forEach(([o,a])=>{o.includes(".")&&(Ft(r,o,a),delete r[o])}),r}var Lt=(t,e,r)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(r):t[e]=[t[e],r]:e.endsWith("[]")?t[e]=[r]:t[e]=r},Ft=(t,e,r)=>{if(/(?:^|\.)__proto__\./.test(e))return;let o=t;const a=e.split(".");a.forEach((i,s)=>{s===a.length-1?o[i]=r:((!o[i]||typeof o[i]!="object"||Array.isArray(o[i])||o[i]instanceof File)&&(o[i]=Object.create(null)),o=o[i])})},lt=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Mt=t=>{const{groups:e,path:r}=Nt(t),o=lt(r);return Bt(o,e)},Nt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(r,o)=>{const a=`@${o}`;return e.push([a,r]),a}),{groups:e,path:t}},Bt=(t,e)=>{for(let r=e.length-1;r>=0;r--){const[o]=e[r];for(let a=t.length-1;a>=0;a--)if(t[a].includes(o)){t[a]=t[a].replace(o,e[r][1]);break}}return t},Pe={},qt=(t,e)=>{if(t==="*")return"*";const r=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const o=`${t}#${e}`;return Pe[o]||(r[2]?Pe[o]=e&&e[0]!==":"&&e[0]!=="*"?[o,r[1],new RegExp(`^${r[2]}(?=/${e})`)]:[t,r[1],new RegExp(`^${r[2]}$`)]:Pe[o]=[t,r[1],!0]),Pe[o]}return null},_e=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return e(r)}catch{return r}})}},Ht=t=>_e(t,decodeURI),dt=t=>{const e=t.url,r=e.indexOf("/",e.indexOf(":")+4);let o=r;for(;o<e.length;o++){const a=e.charCodeAt(o);if(a===37){const i=e.indexOf("?",o),s=e.indexOf("#",o),l=i===-1?s===-1?void 0:s:s===-1?i:Math.min(i,s),c=e.slice(r,l);return Ht(c.includes("%25")?c.replace(/%25/g,"%2525"):c)}else if(a===63||a===35)break}return e.slice(r,o)},$t=t=>{const e=dt(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},Q=(t,e,...r)=>(r.length&&(e=Q(e,...r)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),pt=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),r=[];let o="";return e.forEach(a=>{if(a!==""&&!/\:/.test(a))o+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){r.length===0&&o===""?r.push("/"):r.push(o);const i=a.replace("?","");o+="/"+i,r.push(o)}else o+="/"+a}),r.filter((a,i,s)=>s.indexOf(a)===i)},$e=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?_e(t,ft):t):t,ut=(t,e,r)=>{let o;if(!r&&e&&!/[%+]/.test(e)){let s=t.indexOf("?",8);if(s===-1)return;for(t.startsWith(e,s+1)||(s=t.indexOf(`&${e}`,s+1));s!==-1;){const l=t.charCodeAt(s+e.length+1);if(l===61){const c=s+e.length+2,d=t.indexOf("&",c);return $e(t.slice(c,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";s=t.indexOf(`&${e}`,s+1)}if(o=/[%+]/.test(t),!o)return}const a={};o??(o=/[%+]/.test(t));let i=t.indexOf("?",8);for(;i!==-1;){const s=t.indexOf("&",i+1);let l=t.indexOf("=",i);l>s&&s!==-1&&(l=-1);let c=t.slice(i+1,l===-1?s===-1?void 0:s:l);if(o&&(c=$e(c)),i=s,c==="")continue;let d;l===-1?d="":(d=t.slice(l+1,s===-1?void 0:s),o&&(d=$e(d))),r?(a[c]&&Array.isArray(a[c])||(a[c]=[]),a[c].push(d)):a[c]??(a[c]=d)}return e?a[e]:a},Vt=ut,Ut=(t,e)=>ut(t,e,!0),ft=decodeURIComponent,Ze=t=>_e(t,ft),fe,T,V,ht,mt,Ue,N,ot,gt=(ot=class{constructor(t,e="/",r=[[]]){x(this,V);h(this,"raw");x(this,fe);x(this,T);h(this,"routeIndex",0);h(this,"path");h(this,"bodyCache",{});x(this,N,t=>{const{bodyCache:e,raw:r}=this,o=e[t];if(o)return o;const a=Object.keys(e)[0];return a?e[a].then(i=>(a==="json"&&(i=JSON.stringify(i)),new Response(i)[t]())):e[t]=r[t]()});this.raw=t,this.path=e,f(this,T,r),f(this,fe,{})}param(t){return t?v(this,V,ht).call(this,t):v(this,V,mt).call(this)}query(t){return Vt(this.url,t)}queries(t){return Ut(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((r,o)=>{e[o]=r}),e}async parseBody(t){return Pt(this,t)}json(){return n(this,N).call(this,"text").then(t=>JSON.parse(t))}text(){return n(this,N).call(this,"text")}arrayBuffer(){return n(this,N).call(this,"arrayBuffer")}bytes(){return n(this,N).call(this,"arrayBuffer").then(t=>new Uint8Array(t))}blob(){return n(this,N).call(this,"blob")}formData(){return n(this,N).call(this,"formData")}addValidatedData(t,e){n(this,fe)[t]=e}valid(t){return n(this,fe)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[Dt](){return n(this,T)}get matchedRoutes(){return n(this,T)[0].map(([[,t]])=>t)}get routePath(){return n(this,T)[0].map(([[,t]])=>t)[this.routeIndex].path}},fe=new WeakMap,T=new WeakMap,V=new WeakSet,ht=function(t){const e=n(this,T)[0][this.routeIndex][1][t],r=v(this,V,Ue).call(this,e);return r&&/\%/.test(r)?Ze(r):r},mt=function(){const t={},e=Object.keys(n(this,T)[0][this.routeIndex][1]);for(const r of e){const o=v(this,V,Ue).call(this,n(this,T)[0][this.routeIndex][1][r]);o!==void 0&&(t[r]=/\%/.test(o)?Ze(o):o)}return t},Ue=function(t){return n(this,T)[1]?n(this,T)[1][t]:t},N=new WeakMap,ot),_t={Stringify:1},xt=async(t,e,r,o,a)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const i=t.callbacks;return i!=null&&i.length?(a?a[0]+=t:a=[t],Promise.all(i.map(l=>l({phase:e,buffer:a,context:o}))).then(l=>Promise.all(l.filter(Boolean).map(c=>xt(c,e,!1,o,a))).then(()=>a[0]))):Promise.resolve(t)},Gt="text/plain; charset=UTF-8",Ve=(t,e)=>({"Content-Type":t,...e}),ke=(t,e)=>new Response(t,e),Se,Re,B,ge,q,R,ze,he,me,re,Oe,je,G,pe,at,Kt=(at=class{constructor(t,e){x(this,G);x(this,Se);x(this,Re);h(this,"env",{});x(this,B);h(this,"finalized",!1);h(this,"error");x(this,ge);x(this,q);x(this,R);x(this,ze);x(this,he);x(this,me);x(this,re);x(this,Oe);x(this,je);h(this,"render",(...t)=>(n(this,he)??f(this,he,e=>this.html(e)),n(this,he).call(this,...t)));h(this,"setLayout",t=>f(this,ze,t));h(this,"getLayout",()=>n(this,ze));h(this,"setRenderer",t=>{f(this,he,t)});h(this,"header",(t,e,r)=>{this.finalized&&f(this,R,ke(n(this,R).body,n(this,R)));const o=n(this,R)?n(this,R).headers:n(this,re)??f(this,re,new Headers);e===void 0?o.delete(t):r!=null&&r.append?o.append(t,e):o.set(t,e)});h(this,"status",t=>{f(this,ge,t)});h(this,"set",(t,e)=>{n(this,B)??f(this,B,new Map),n(this,B).set(t,e)});h(this,"get",t=>n(this,B)?n(this,B).get(t):void 0);h(this,"newResponse",(...t)=>v(this,G,pe).call(this,...t));h(this,"body",(t,e,r)=>v(this,G,pe).call(this,t,e,r));h(this,"text",(t,e,r)=>!n(this,re)&&!n(this,ge)&&!e&&!r&&!this.finalized?new Response(t):v(this,G,pe).call(this,t,e,Ve(Gt,r)));h(this,"json",(t,e,r)=>v(this,G,pe).call(this,JSON.stringify(t),e,Ve("application/json",r)));h(this,"html",(t,e,r)=>{const o=a=>v(this,G,pe).call(this,a,e,Ve("text/html; charset=UTF-8",r));return typeof t=="object"?xt(t,_t.Stringify,!1,{}).then(o):o(t)});h(this,"redirect",(t,e)=>{const r=String(t);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,e??302)});h(this,"notFound",()=>(n(this,me)??f(this,me,()=>ke()),n(this,me).call(this,this)));f(this,Se,t),e&&(f(this,q,e.executionCtx),this.env=e.env,f(this,me,e.notFoundHandler),f(this,je,e.path),f(this,Oe,e.matchResult))}get req(){return n(this,Re)??f(this,Re,new gt(n(this,Se),n(this,je),n(this,Oe))),n(this,Re)}get event(){if(n(this,q)&&"respondWith"in n(this,q))return n(this,q);throw Error("This context has no FetchEvent")}get executionCtx(){if(n(this,q))return n(this,q);throw Error("This context has no ExecutionContext")}get res(){return n(this,R)||f(this,R,ke(null,{headers:n(this,re)??f(this,re,new Headers)}))}set res(t){if(n(this,R)&&t){t=ke(t.body,t);for(const[e,r]of n(this,R).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const o=n(this,R).headers.getSetCookie();t.headers.delete("set-cookie");for(const a of o)t.headers.append("set-cookie",a)}else t.headers.set(e,r)}f(this,R,t),this.finalized=!0}get var(){return n(this,B)?Object.fromEntries(n(this,B)):{}}},Se=new WeakMap,Re=new WeakMap,B=new WeakMap,ge=new WeakMap,q=new WeakMap,R=new WeakMap,ze=new WeakMap,he=new WeakMap,me=new WeakMap,re=new WeakMap,Oe=new WeakMap,je=new WeakMap,G=new WeakSet,pe=function(t,e,r){const o=n(this,R)?new Headers(n(this,R).headers):n(this,re)??new Headers;if(typeof e=="object"&&"headers"in e){const i=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[s,l]of i)s.toLowerCase()==="set-cookie"?o.append(s,l):o.set(s,l)}if(r)for(const[i,s]of Object.entries(r))if(typeof s=="string")o.set(i,s);else{o.delete(i);for(const l of s)o.append(i,l)}const a=typeof e=="number"?e:(e==null?void 0:e.status)??n(this,ge);return ke(t,{status:a,headers:o})},at),w="ALL",Wt="all",Jt=["get","post","put","delete","options","patch"],bt="Can not add a route since the matcher is already built.",vt=class extends Error{},Xt="__COMPOSED_HANDLER",Yt=t=>t.text("404 Not Found",404),et=(t,e)=>{if("getResponse"in t){const r=t.getResponse();return e.newResponse(r.body,r)}return console.error(t),e.text("Internal Server Error",500)},I,k,yt,L,Z,Te,Ie,xe,Qt=(xe=class{constructor(e={}){x(this,k);h(this,"get");h(this,"post");h(this,"put");h(this,"delete");h(this,"options");h(this,"patch");h(this,"all");h(this,"on");h(this,"use");h(this,"router");h(this,"getPath");h(this,"_basePath","/");x(this,I,"/");h(this,"routes",[]);x(this,L,Yt);h(this,"errorHandler",et);h(this,"onError",e=>(this.errorHandler=e,this));h(this,"notFound",e=>(f(this,L,e),this));h(this,"fetch",(e,...r)=>v(this,k,Ie).call(this,e,r[1],r[0],e.method));h(this,"request",(e,r,o,a)=>e instanceof Request?this.fetch(r?new Request(e,r):e,o,a):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${Q("/",e)}`,r),o,a)));h(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(v(this,k,Ie).call(this,e.request,e,void 0,e.request.method))})});[...Jt,Wt].forEach(i=>{this[i]=(s,...l)=>(typeof s=="string"?f(this,I,s):v(this,k,Z).call(this,i,n(this,I),s),l.forEach(c=>{v(this,k,Z).call(this,i,n(this,I),c)}),this)}),this.on=(i,s,...l)=>{for(const c of[s].flat()){f(this,I,c);for(const d of[i].flat())l.map(p=>{v(this,k,Z).call(this,d.toUpperCase(),n(this,I),p)})}return this},this.use=(i,...s)=>(typeof i=="string"?f(this,I,i):(f(this,I,"*"),s.unshift(i)),s.forEach(l=>{v(this,k,Z).call(this,w,n(this,I),l)}),this);const{strict:o,...a}=e;Object.assign(this,a),this.getPath=o??!0?e.getPath??dt:$t}route(e,r){const o=this.basePath(e);return r.routes.map(a=>{var s;let i;r.errorHandler===et?i=a.handler:(i=async(l,c)=>(await Qe([],r.errorHandler)(l,()=>a.handler(l,c))).res,i[Xt]=a.handler),v(s=o,k,Z).call(s,a.method,a.path,i,a.basePath)}),this}basePath(e){const r=v(this,k,yt).call(this);return r._basePath=Q(this._basePath,e),r}mount(e,r,o){let a,i;o&&(typeof o=="function"?i=o:(i=o.optionHandler,o.replaceRequest===!1?a=c=>c:a=o.replaceRequest));const s=i?c=>{const d=i(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};a||(a=(()=>{const c=Q(this._basePath,e),d=c==="/"?0:c.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(d)||"/",new Request(u,p)}})());const l=async(c,d)=>{const p=await r(a(c.req.raw),...s(c));if(p)return p;await d()};return v(this,k,Z).call(this,w,Q(e,"*"),l),this}},I=new WeakMap,k=new WeakSet,yt=function(){const e=new xe({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,f(e,L,n(this,L)),e.routes=this.routes,e},L=new WeakMap,Z=function(e,r,o,a){e=e.toUpperCase(),r=Q(this._basePath,r);const i={basePath:a!==void 0?Q(this._basePath,a):this._basePath,path:r,method:e,handler:o};this.router.add(e,r,[o,i]),this.routes.push(i)},Te=function(e,r){if(e instanceof Error)return this.errorHandler(e,r);throw e},Ie=function(e,r,o,a){if(a==="HEAD")return(async()=>new Response(null,await v(this,k,Ie).call(this,e,r,o,"GET")))();const i=this.getPath(e,{env:o}),s=this.router.match(a,i),l=new Kt(e,{path:i,matchResult:s,env:o,executionCtx:r,notFoundHandler:n(this,L)});if(s[0].length===1){let d;try{d=s[0][0][0][0](l,async()=>{l.res=await n(this,L).call(this,l)})}catch(p){return v(this,k,Te).call(this,p,l)}return d instanceof Promise?d.then(p=>p||(l.finalized?l.res:n(this,L).call(this,l))).catch(p=>v(this,k,Te).call(this,p,l)):d??n(this,L).call(this,l)}const c=Qe(s[0],this.errorHandler,n(this,L));return(async()=>{try{const d=await c(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return v(this,k,Te).call(this,d,l)}})()},xe),wt=[];function Zt(t,e){const r=this.buildAllMatchers(),o=(a,i)=>{const s=r[a]||r[w],l=s[2][i];if(l)return l;const c=i.match(s[0]);if(!c)return[[],wt];const d=c.indexOf("",1);return[s[1][d],c]};return this.match=o,o(t,e)}var Fe="[^/]+",Ce=".*",Ee="(?:|/.*)",ue=Symbol(),er=new Set(".\\+*[^]$()");function tr(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Ce||t===Ee?1:e===Ce||e===Ee?-1:t===Fe?1:e===Fe?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var oe,ae,F,ne,rr=(ne=class{constructor(){x(this,oe);x(this,ae);x(this,F,Object.create(null))}insert(e,r,o,a,i){if(e.length===0){if(n(this,oe)!==void 0)throw ue;if(i)return;f(this,oe,r);return}const[s,...l]=e,c=s==="*"?l.length===0?["","",Ce]:["","",Fe]:s==="/*"?["","",Ee]:s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const p=c[1];let u=c[2]||Fe;if(p&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ue;if(d=n(this,F)[u],!d){if(Object.keys(n(this,F)).some(g=>g!==Ce&&g!==Ee))throw ue;if(i)return;d=n(this,F)[u]=new ne,p!==""&&f(d,ae,a.varIndex++)}!i&&p!==""&&o.push([p,n(d,ae)])}else if(d=n(this,F)[s],!d){if(Object.keys(n(this,F)).some(p=>p.length>1&&p!==Ce&&p!==Ee))throw ue;if(i)return;d=n(this,F)[s]=new ne}d.insert(l,r,o,a,i)}buildRegExpStr(){const r=Object.keys(n(this,F)).sort(tr).map(o=>{const a=n(this,F)[o];return(typeof n(a,ae)=="number"?`(${o})@${n(a,ae)}`:er.has(o)?`\\${o}`:o)+a.buildRegExpStr()});return typeof n(this,oe)=="number"&&r.unshift(`#${n(this,oe)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},oe=new WeakMap,ae=new WeakMap,F=new WeakMap,ne),Me,De,it,or=(it=class{constructor(){x(this,Me,{varIndex:0});x(this,De,new rr)}insert(t,e,r){const o=[],a=[];for(let s=0;;){let l=!1;if(t=t.replace(/\{[^}]+\}/g,c=>{const d=`@\\${s}`;return a[s]=[d,c],s++,l=!0,d}),!l)break}const i=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let s=a.length-1;s>=0;s--){const[l]=a[s];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(l)!==-1){i[c]=i[c].replace(l,a[s][1]);break}}return n(this,De).insert(i,e,o,n(this,Me),r),o}buildRegExp(){let t=n(this,De).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const r=[],o=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,i,s)=>i!==void 0?(r[++e]=Number(i),"$()"):(s!==void 0&&(o[Number(s)]=++e),"")),[new RegExp(`^${t}`),r,o]}},Me=new WeakMap,De=new WeakMap,it),ar=[/^$/,[],Object.create(null)],Le=Object.create(null);function kt(t){return Le[t]??(Le[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function ir(){Le=Object.create(null)}function sr(t){var d;const e=new or,r=[];if(t.length===0)return ar;const o=t.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[g,b])=>p?1:g?-1:u.length-b.length),a=Object.create(null);for(let p=0,u=-1,g=o.length;p<g;p++){const[b,A,j]=o[p];b?a[A]=[j.map(([D])=>[D,Object.create(null)]),wt]:u++;let z;try{z=e.insert(A,u,b)}catch(D){throw D===ue?new vt(A):D}b||(r[u]=j.map(([D,y])=>{const P=Object.create(null);for(y-=1;y>=0;y--){const[U,O]=z[y];P[U]=O}return[D,P]}))}const[i,s,l]=e.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let g=0,b=r[p].length;g<b;g++){const A=(d=r[p][g])==null?void 0:d[1];if(!A)continue;const j=Object.keys(A);for(let z=0,D=j.length;z<D;z++)A[j[z]]=l[A[j[z]]]}const c=[];for(const p in s)c[p]=r[s[p]];return[i,c,a]}function de(t,e){if(t){for(const r of Object.keys(t).sort((o,a)=>a.length-o.length))if(kt(r).test(e))return[...t[r]]}}var K,W,Ne,At,st,nr=(st=class{constructor(){x(this,Ne);h(this,"name","RegExpRouter");x(this,K);x(this,W);h(this,"match",Zt);f(this,K,{[w]:Object.create(null)}),f(this,W,{[w]:Object.create(null)})}add(t,e,r){var l;const o=n(this,K),a=n(this,W);if(!o||!a)throw new Error(bt);o[t]||[o,a].forEach(c=>{c[t]=Object.create(null),Object.keys(c[w]).forEach(d=>{c[t][d]=[...c[w][d]]})}),e==="/*"&&(e="*");const i=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const c=kt(e);t===w?Object.keys(o).forEach(d=>{var p;(p=o[d])[e]||(p[e]=de(o[d],e)||de(o[w],e)||[])}):(l=o[t])[e]||(l[e]=de(o[t],e)||de(o[w],e)||[]),Object.keys(o).forEach(d=>{(t===w||t===d)&&Object.keys(o[d]).forEach(p=>{c.test(p)&&o[d][p].push([r,i])})}),Object.keys(a).forEach(d=>{(t===w||t===d)&&Object.keys(a[d]).forEach(p=>c.test(p)&&a[d][p].push([r,i]))});return}const s=pt(e)||[e];for(let c=0,d=s.length;c<d;c++){const p=s[c];Object.keys(a).forEach(u=>{var g;(t===w||t===u)&&((g=a[u])[p]||(g[p]=[...de(o[u],p)||de(o[w],p)||[]]),a[u][p].push([r,i-d+c+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(n(this,W)).concat(Object.keys(n(this,K))).forEach(e=>{t[e]||(t[e]=v(this,Ne,At).call(this,e))}),f(this,K,f(this,W,void 0)),ir(),t}},K=new WeakMap,W=new WeakMap,Ne=new WeakSet,At=function(t){const e=[];let r=t===w;return[n(this,K),n(this,W)].forEach(o=>{const a=o[t]?Object.keys(o[t]).map(i=>[i,o[t][i]]):[];a.length!==0?(r||(r=!0),e.push(...a)):t!==w&&e.push(...Object.keys(o[w]).map(i=>[i,o[w][i]]))}),r?sr(e):null},st),J,H,nt,cr=(nt=class{constructor(t){h(this,"name","SmartRouter");x(this,J,[]);x(this,H,[]);f(this,J,t.routers)}add(t,e,r){if(!n(this,H))throw new Error(bt);n(this,H).push([t,e,r])}match(t,e){if(!n(this,H))throw new Error("Fatal error");const r=n(this,J),o=n(this,H),a=r.length;let i=0,s;for(;i<a;i++){const l=r[i];try{for(let c=0,d=o.length;c<d;c++)l.add(...o[c]);s=l.match(t,e)}catch(c){if(c instanceof vt)continue;throw c}this.match=l.match.bind(l),f(this,J,[l]),f(this,H,void 0);break}if(i===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,s}get activeRouter(){if(n(this,H)||n(this,J).length!==1)throw new Error("No active router has been determined yet.");return n(this,J)[0]}},J=new WeakMap,H=new WeakMap,nt),Ae=Object.create(null),lr=t=>{for(const e in t)return!0;return!1},X,S,ie,be,C,$,ee,ve,dr=(ve=class{constructor(e,r,o){x(this,$);x(this,X);x(this,S);x(this,ie);x(this,be,0);x(this,C,Ae);if(f(this,S,o||Object.create(null)),f(this,X,[]),e&&r){const a=Object.create(null);a[e]={handler:r,possibleKeys:[],score:0},f(this,X,[a])}f(this,ie,[])}insert(e,r,o){f(this,be,++Ye(this,be)._);let a=this;const i=Mt(r),s=[];for(let l=0,c=i.length;l<c;l++){const d=i[l],p=i[l+1],u=qt(d,p),g=Array.isArray(u)?u[0]:d;if(g in n(a,S)){a=n(a,S)[g],u&&s.push(u[1]);continue}n(a,S)[g]=new ve,u&&(n(a,ie).push(u),s.push(u[1])),a=n(a,S)[g]}return n(a,X).push({[e]:{handler:o,possibleKeys:s.filter((l,c,d)=>d.indexOf(l)===c),score:n(this,be)}}),a}search(e,r){var p;const o=[];f(this,C,Ae);let i=[this];const s=lt(r),l=[],c=s.length;let d=null;for(let u=0;u<c;u++){const g=s[u],b=u===c-1,A=[];for(let z=0,D=i.length;z<D;z++){const y=i[z],P=n(y,S)[g];P&&(f(P,C,n(y,C)),b?(n(P,S)["*"]&&v(this,$,ee).call(this,o,n(P,S)["*"],e,n(y,C)),v(this,$,ee).call(this,o,P,e,n(y,C))):A.push(P));for(let U=0,O=n(y,ie).length;U<O;U++){const We=n(y,ie)[U],_=n(y,C)===Ae?{}:{...n(y,C)};if(We==="*"){const ce=n(y,S)["*"];ce&&(v(this,$,ee).call(this,o,ce,e,n(y,C)),f(ce,C,_),A.push(ce));continue}const[zt,Je,ye]=We;if(!g&&!(ye instanceof RegExp))continue;const M=n(y,S)[zt];if(ye instanceof RegExp){if(d===null){d=new Array(c);let le=r[0]==="/"?1:0;for(let we=0;we<c;we++)d[we]=le,le+=s[we].length+1}const ce=r.substring(d[u]),qe=ye.exec(ce);if(qe){if(_[Je]=qe[0],v(this,$,ee).call(this,o,M,e,n(y,C),_),lr(n(M,S))){f(M,C,_);const le=((p=qe[0].match(/\//))==null?void 0:p.length)??0;(l[le]||(l[le]=[])).push(M)}continue}}(ye===!0||ye.test(g))&&(_[Je]=g,b?(v(this,$,ee).call(this,o,M,e,_,n(y,C)),n(M,S)["*"]&&v(this,$,ee).call(this,o,n(M,S)["*"],e,_,n(y,C))):(f(M,C,_),A.push(M)))}}const j=l.shift();i=j?A.concat(j):A}return o.length>1&&o.sort((u,g)=>u.score-g.score),[o.map(({handler:u,params:g})=>[u,g])]}},X=new WeakMap,S=new WeakMap,ie=new WeakMap,be=new WeakMap,C=new WeakMap,$=new WeakSet,ee=function(e,r,o,a,i){for(let s=0,l=n(r,X).length;s<l;s++){const c=n(r,X)[s],d=c[o]||c[w],p={};if(d!==void 0&&(d.params=Object.create(null),e.push(d),a!==Ae||i&&i!==Ae))for(let u=0,g=d.possibleKeys.length;u<g;u++){const b=d.possibleKeys[u],A=p[d.score];d.params[b]=i!=null&&i[b]&&!A?i[b]:a[b]??(i==null?void 0:i[b]),p[d.score]=!0}}},ve),se,ct,pr=(ct=class{constructor(){h(this,"name","TrieRouter");x(this,se);f(this,se,new dr)}add(t,e,r){const o=pt(e);if(o){for(let a=0,i=o.length;a<i;a++)n(this,se).insert(t,o[a],r);return}n(this,se).insert(t,e,r)}match(t,e){return n(this,se).search(t,e)}},se=new WeakMap,ct),Ct=class extends Qt{constructor(t={}){super(t),this.router=t.router??new cr({routers:[new nr,new pr]})}},ur=t=>{const e={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...t},r=(a=>typeof a=="string"?a==="*"?()=>a:i=>a===i?i:null:typeof a=="function"?a:i=>a.includes(i)?i:null)(e.origin),o=(a=>typeof a=="function"?a:Array.isArray(a)?()=>a:()=>[])(e.allowMethods);return async function(i,s){var d;function l(p,u){i.res.headers.set(p,u)}const c=await r(i.req.header("origin")||"",i);if(c&&l("Access-Control-Allow-Origin",c),e.credentials&&l("Access-Control-Allow-Credentials","true"),(d=e.exposeHeaders)!=null&&d.length&&l("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),i.req.method==="OPTIONS"){e.origin!=="*"&&l("Vary","Origin"),e.maxAge!=null&&l("Access-Control-Max-Age",e.maxAge.toString());const p=await o(i.req.header("origin")||"",i);p.length&&l("Access-Control-Allow-Methods",p.join(","));let u=e.allowHeaders;if(!(u!=null&&u.length)){const g=i.req.header("Access-Control-Request-Headers");g&&(u=g.split(/\s*,\s*/))}return u!=null&&u.length&&(l("Access-Control-Allow-Headers",u.join(",")),i.res.headers.append("Vary","Access-Control-Request-Headers")),i.res.headers.delete("Content-Length"),i.res.headers.delete("Content-Type"),new Response(null,{headers:i.res.headers,status:204,statusText:"No Content"})}await s(),e.origin!=="*"&&i.header("Vary","Origin",{append:!0})}};const m={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},te="https://api.sixtechbrasil.com.br",fr="https://sixtechworkspace.kainow252-cmyk.workers.dev",Y=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:m.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:m.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:m.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:m.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:m.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:m.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:m.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:m.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:m.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:m.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:m.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:m.powerful,internalUrl:`${te}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:m.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:m.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:m.powerful,internalUrl:`${te}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:m.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:m.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:m.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:m.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:m.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:m.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:m.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:m.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:m.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:m.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:m.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:m.coder,internalUrl:`${te}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:m.powerful,internalUrl:`${te}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:m.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:m.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:m.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:m.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:m.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:m.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:m.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:m.powerful,internalUrl:`${te}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:m.balanced,internalUrl:`${te}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function gr(t,e){try{const r=new AbortController,o=setTimeout(()=>r.abort(),8e3),a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:e,message:e}),signal:r.signal});if(clearTimeout(o),!a.ok)return null;const i=await a.json();return i.result||i.response||i.output||null}catch{return null}}async function tt(t,e,r,o,a=1200){var l,c,d,p,u;const i=[{role:"system",content:r},{role:"user",content:o}],s=await t.run(e,{messages:i,max_tokens:a,stream:!1});if(s&&typeof s=="object"){const g=s;if("getReader"in g||"pipeTo"in g){const b=g.getReader(),A=new TextDecoder;let j="";for(;;){const{done:z,value:D}=await b.read();if(z)break;const y=A.decode(D,{stream:!0});for(const P of y.split(`
`)){if(!P.startsWith("data:"))continue;const U=P.slice(5).trim();if(U!=="[DONE]")try{const O=JSON.parse(U);j+=(O==null?void 0:O.response)??((d=(c=(l=O==null?void 0:O.choices)==null?void 0:l[0])==null?void 0:c.delta)==null?void 0:d.content)??(O==null?void 0:O.token)??""}catch{}}}return j}if("response"in g&&typeof g.response=="string")return g.response||"";if(Array.isArray(g.choices)&&g.choices.length>0){const b=g.choices[0];if((p=b==null?void 0:b.message)!=null&&p.content)return String(b.message.content);if((u=b==null?void 0:b.delta)!=null&&u.content)return String(b.delta.content);if(b!=null&&b.text)return String(b.text)}if(g.result&&typeof g.result=="object"&&"response"in g.result)return String(g.result.response||"")}return String(s||"")}async function Ge(t,e,r){const o=Date.now();let a="",i=!1,s=t.source;try{if(t.source==="hybrid"&&t.internalUrl){const l=await gr(t.internalUrl,e);l?(a=l,s="internal",i=!1):(a=await tt(r,t.model,t.system,e,1500),s="cloudflare",i=!0)}else a=await tt(r,t.model,t.system,e,1500),s="cloudflare",i=!1}catch(l){a=`❌ Erro: ${(l==null?void 0:l.message)||"falha inesperada"}`}return{agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:s,usedFallback:i,response:a,duration:Date.now()-o}}function hr(t){const e=t.toLowerCase(),r=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(e)&&r.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(e)&&r.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(e)&&r.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(e)&&r.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(e)&&r.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(e)&&r.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(e)&&r.push("reviewer"),r.length===0&&r.push("orchestrator"),r.length>1&&r.push("orchestrator"),[...new Set(r)]}const mr={sixtech:"sixtech@2025",admin:"Admin@SixTech1"},Ke="st_sess",Et=60*60*8,xr="SixTechMAS_JWT_S3cr3t_2025_x9kLmP";async function St(t){const e=new TextEncoder,r=await crypto.subtle.importKey("raw",e.encode(xr),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),o=await crypto.subtle.sign("HMAC",r,e.encode(t));return btoa(String.fromCharCode(...new Uint8Array(o))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}async function br(t,e){return await St(t)===e}async function vr(t){const e=btoa(JSON.stringify({u:t,exp:Math.floor(Date.now()/1e3)+Et})).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,""),r=await St(e);return`${e}.${r}`}async function yr(t){try{const[e,r]=t.split(".");if(!e||!r||!await br(e,r))return null;const a=e.replace(/-/g,"+").replace(/_/g,"/"),i=JSON.parse(atob(a+"===".slice(a.length%4||4)));return Math.floor(Date.now()/1e3)>i.exp?null:{user:i.u}}catch{return null}}async function Be(t){const r=(t.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${Ke}=([^;]+)`));return r?yr(r[1]):null}const E=new Ct;E.use("*",ur());E.get("/favicon.ico",t=>new Response(null,{status:204}));E.post("/api/login",async t=>{const{username:e,password:r}=await t.req.json(),o=mr[e==null?void 0:e.trim()];if(!o||o!==r)return t.json({ok:!1,error:"Usuário ou senha incorretos"},401);const a=await vr(e.trim()),i=`${Ke}=${a}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Et}`;return new Response(JSON.stringify({ok:!0,user:e.trim()}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":i,"Access-Control-Allow-Origin":"*"}})});E.post("/api/logout",t=>new Response(JSON.stringify({ok:!0}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":`${Ke}=; Path=/; Max-Age=0`}}));E.get("/api/me",async t=>{const e=await Be(t);return e?t.json({ok:!0,user:e.user}):t.json({ok:!1},401)});const wr=["/api/login","/api/me","/api/logout","/api/status","/api/models"];E.use("/api/*",async(t,e)=>{const r=new URL(t.req.url).pathname;return wr.includes(r)||await Be(t)?e():t.json({error:"Não autorizado",code:401},401)});E.get("/api/agents",t=>t.json({total:Y.length,models:Object.keys(m).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:Y.map(e=>({id:e.id,name:e.name,emoji:e.emoji,color:e.color,desc:e.desc,source:e.source,model:e.model,category:e.category,capabilities:e.capabilities,basedOn:e.basedOn,internalUrl:e.internalUrl}))}));E.post("/api/agent/:id",async t=>{const e=Y.find(i=>i.id===t.req.param("id"));if(!e)return t.json({error:"Agente não encontrado"},404);const{message:r,task:o}=await t.req.json(),a=await Ge(e,r||o||"",t.env.AI);return t.json(a)});E.post("/api/orchestrate",async t=>{var l;const{task:e,message:r}=await t.req.json(),o=e||r||"";if(!o)return t.json({error:"task obrigatório"},400);const a=hr(o),i=a.map(c=>Y.find(d=>d.id===c)).filter(Boolean),s=[];for(const c of i){const d=c.id==="orchestrator"&&s.length>0?`Tarefa original: "${o}"

Resultados dos agentes especializados:
${s.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:o;s.push(await Ge(c,d,t.env.AI))}return t.json({task:o,agentsUsed:a,results:s,summary:((l=s[s.length-1])==null?void 0:l.response)||""})});E.post("/api/pipeline",async t=>{const{task:e,agentIds:r}=await t.req.json();if(!e||!(r!=null&&r.length))return t.json({error:"task e agentIds obrigatórios"},400);const o=r.map(c=>Y.find(d=>d.id===c)).filter(Boolean),a=[];let i=e;for(const c of o){o[o.length-1];const d=a.length===0?e:c.id==="orchestrator"&&a.length>0?`Tarefa original: "${e}"

${a.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${e}

[Contexto do ${a[a.length-1].name}]:
${a[a.length-1].response.slice(0,800)}`,p=await Ge(c,d,t.env.AI);a.push(p),i=p.response}const s=a.filter(c=>c.source==="cloudflare").length,l=a.filter(c=>c.source==="internal").length;return t.json({task:e,steps:a.length,cloudflareSteps:s,internalSteps:l,results:a,final:i})});E.post("/api/document/generate",async t=>{if(!await Be(t))return t.json({error:"Não autorizado"},401);const{agentId:r,docType:o,instructions:a,context:i}=await t.req.json(),s=Y.find(p=>p.id===r);if(!s)return t.json({error:"Agente não encontrado"},404);const c=[{role:"system",content:`${s.system}

MODO: GERADOR DE DOCUMENTOS PROFISSIONAIS
Você irá gerar um documento completo e profissional do tipo: ${o}
Instruções específicas: ${a}
${i?`Contexto adicional: ${i}`:""}

REGRAS OBRIGATÓRIAS:
1. Gere o documento COMPLETO, não resumido
2. Use formatação Markdown rica (## títulos, **negrito**, tabelas, listas)
3. Inclua TODAS as seções necessárias para um documento profissional
4. No início, coloque o título do documento em # TÍTULO
5. Separe seções com --- quando necessário
6. Para contratos/NDAs: inclua cláusulas numeradas, partes, objeto, vigência, assinaturas
7. Responda APENAS com o documento, sem explicações antes ou depois`},{role:"user",content:`Gere agora o documento: ${o}

Instruções: ${a}`}],d=await t.env.AI.run(s.model,{messages:c,max_tokens:4096,stream:!0});return new Response(d,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});E.post("/api/document/analyze",async t=>{if(!await Be(t))return t.json({error:"Não autorizado"},401);const{agentId:r,fileContent:o,fileName:a,instruction:i}=await t.req.json(),s=Y.find(p=>p.id===r);if(!s)return t.json({error:"Agente não encontrado"},404);const l=`${s.system}

MODO: ANÁLISE DE DOCUMENTO
Analise criticamente o documento fornecido pelo usuário.
${i?`Instrução específica: ${i}`:""}

ESTRUTURA DA ANÁLISE (use Markdown):
## 📋 Resumo Executivo
## ✅ Pontos Positivos
## ⚠️ Pontos de Atenção / Riscos
## 🔧 Sugestões de Melhoria
## 📝 Versão Corrigida (se aplicável — reescreva trechos problemáticos)
## ✔️ Conclusão e Score (0-10)`,c=`Arquivo: ${a}

--- CONTEÚDO DO DOCUMENTO ---
${o.slice(0,12e3)}
--- FIM DO DOCUMENTO ---

${i||"Analise este documento e aponte melhorias, erros e ajustes necessários."}`,d=await t.env.AI.run(s.model,{messages:[{role:"system",content:l},{role:"user",content:c}],max_tokens:4096,stream:!0});return new Response(d,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});E.post("/api/chat",async t=>{const{messages:e,model:r}=await t.req.json(),o=r||m.balanced;e.some(i=>i.role==="system")||e.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const a=await t.env.AI.run(o,{messages:e,max_tokens:2048,stream:!0});return new Response(a,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});E.get("/api/models",t=>t.json({models:Object.entries(m).map(([e,r])=>({key:e,id:r,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[e]||e}))}));E.get("/api/status",t=>t.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:te},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:fr},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:Y.length,models:Object.keys(m).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));E.get("/",t=>t.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SixTech MAS v3.0</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
/* ── Reset & Vars ─────────────────────────────────────────── */
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:#6C63FF;--secondary:#22D3EE;--accent:#EC4899;
  --bg:#0B0D17;--surface:#111320;--card:#1B1E2E;
  --border:#2A2D40;--text:#E8E9F3;--muted:#6B7280;
  --sidebar-w:220px;--header-h:54px;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* ── Login Overlay ────────────────────────────────────────── */
#login-overlay{
  position:fixed;inset:0;z-index:9999;
  background:var(--bg);
  display:flex;align-items:center;justify-content:center;
}
#login-overlay.hidden{display:none}
.login-box{
  width:100%;max-width:400px;
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;padding:36px 32px 32px;
  display:flex;flex-direction:column;align-items:center;gap:0;
  box-shadow:0 24px 60px rgba(0,0,0,.5);
}
.login-logo{
  width:56px;height:56px;border-radius:16px;
  background:linear-gradient(135deg,#6C63FF,#22D3EE);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;margin-bottom:14px;
}
.login-title{font-size:22px;font-weight:800;color:#fff;text-align:center;margin-bottom:4px}
.login-sub{font-size:12px;color:var(--muted);text-align:center;margin-bottom:28px}
.login-field{width:100%;margin-bottom:14px}
.login-label{display:block;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.login-input{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:10px;padding:11px 14px;
  font-size:14px;font-family:inherit;
}
.login-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(108,99,255,.18)}
.login-btn{
  width:100%;margin-top:8px;padding:13px;border-radius:12px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;font-size:15px;font-weight:700;
  cursor:pointer;transition:opacity .15s;
}
.login-btn:hover{opacity:.88}
.login-btn:disabled{opacity:.45;cursor:not-allowed}
.login-error{
  width:100%;margin-top:12px;padding:10px 14px;border-radius:10px;
  background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);
  color:#F87171;font-size:13px;text-align:center;display:none;
}
.login-footer{margin-top:20px;font-size:11px;color:var(--muted);text-align:center}

/* ── Header ───────────────────────────────────────────────── */
header{
  height:var(--header-h);flex-shrink:0;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px;
  background:rgba(17,19,32,0.95);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border);
  position:relative;z-index:100;
}
.hdr-left{display:flex;align-items:center;gap:10px}
.hdr-logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#6C63FF,#22D3EE);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.hdr-title{font-weight:700;font-size:15px;color:#fff;line-height:1.2}
.hdr-sub{font-size:10px;color:var(--muted)}
.hdr-badge{font-size:10px;padding:1px 6px;border-radius:999px;background:#1e3a5f;color:#60A5FA;margin-left:6px;vertical-align:middle}
.hdr-right{display:flex;align-items:center;gap:10px}
.status-pill{display:flex;align-items:center;gap:5px;font-size:11px;color:#34D399}
.pulse{width:7px;height:7px;border-radius:50%;background:#34D399;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.btn-gh{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px;background:var(--card);border:1px solid var(--border);color:var(--text);font-size:12px;text-decoration:none;cursor:pointer}
.btn-gh:hover{background:var(--border)}
.btn-sidebar-toggle{background:none;border:none;color:var(--text);cursor:pointer;font-size:16px;padding:6px;border-radius:6px;transition:background .15s}
.btn-sidebar-toggle:hover{background:var(--card)}

/* ── Layout Body ──────────────────────────────────────────── */
.app-body{flex:1;display:flex;overflow:hidden}

/* ── Sidebar ──────────────────────────────────────────────── */
aside{
  width:var(--sidebar-w);flex-shrink:0;overflow-y:auto;
  background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  transition:width .22s ease, transform .22s ease;
}
aside.collapsed{width:0;overflow:hidden}

.sidebar-section{padding:12px 0 4px}
.sidebar-section-title{
  padding:4px 14px 6px;font-size:10px;font-weight:700;letter-spacing:.08em;
  color:var(--muted);text-transform:uppercase;
}
.nav-item{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;
  font-size:13px;color:var(--muted);
  border-left:3px solid transparent;
  transition:all .15s;white-space:nowrap;overflow:hidden;
}
.nav-item:hover{background:rgba(108,99,255,.08);color:var(--text)}
.nav-item.active{background:rgba(108,99,255,.12);color:#fff;border-left-color:var(--primary)}
.nav-item i{width:16px;text-align:center;font-size:13px;flex-shrink:0}
.nav-arrow{font-size:10px;color:var(--muted);padding-left:18px;margin-top:-4px}

.sidebar-stat{padding:12px 14px;border-top:1px solid var(--border);margin-top:auto}
.sidebar-stat-title{font-size:10px;color:var(--muted);font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:8px}
.sstat{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px;color:var(--muted)}
.sstat-val{color:var(--text);font-weight:600}

/* ── Main Content ─────────────────────────────────────────── */
main{flex:1;overflow-y:auto;display:flex;flex-direction:column}
.tab-panel{display:none;flex:1;padding:20px}
.tab-panel.active{display:flex;flex-direction:column;gap:16px}
/* Full-screen chat não usa scroll no main — gerencia internamente */
#tab-agent-chat{overflow:hidden}

/* ── Cards ────────────────────────────────────────────────── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:7px}
.card-title i{font-size:12px}

/* ── Grid helpers ─────────────────────────────────────────── */
.grid-chat{display:grid;grid-template-columns:220px 1fr;gap:14px}
.col-left{display:flex;flex-direction:column;gap:12px}

/* ── Form elements ────────────────────────────────────────── */
textarea,input[type=text],select{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:10px;padding:9px 12px;
  font-size:13px;font-family:inherit;resize:none;
}
textarea:focus,input:focus,select:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(108,99,255,.18)}
select option{background:var(--card)}

/* ── Buttons ──────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:opacity .15s}
.btn:hover{opacity:.85}
.btn-primary{background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff}
.btn-success{background:linear-gradient(135deg,#059669,#10b981);color:#fff}
.btn-ghost{background:var(--surface);border:1px solid var(--border);color:var(--muted)}
.btn-icon{padding:9px 11px}
.btn-full{width:100%;margin-top:10px}

/* ── Badges ───────────────────────────────────────────────── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
.badge-cf{background:#1e3a5f;color:#60A5FA}
.badge-hybrid{background:#1e2d1e;color:#34D399}
.badge-int{background:#2d1e1e;color:#F87171}

/* ── Chat ─────────────────────────────────────────────────── */
.chat-box{display:flex;flex-direction:column;height:calc(100vh - var(--header-h) - 60px);background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.chat-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.msg{border-radius:10px;padding:12px 14px;font-size:13px;line-height:1.6}
.msg-ai{background:var(--surface);border-left:3px solid var(--secondary)}
.msg-user{background:rgba(108,99,255,.12);border-left:3px solid var(--primary)}
.msg-name{font-size:11px;font-weight:600;margin-bottom:5px}
.msg-name.ai{color:var(--secondary)}
.msg-name.user{color:var(--primary)}
.chat-input-row{padding:12px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0}
#chat-input{resize:none;height:60px}
#typing-indicator{display:none;padding:4px 16px;font-size:11px;color:var(--muted)}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--secondary);display:inline-block;animation:pulse 1.2s infinite;margin-right:3px}
.cursor-blink{display:inline-block;width:2px;height:1em;background:var(--secondary);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:2px}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ── Stats ────────────────────────────────────────────────── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px}
.stat-val{font-size:28px;font-weight:800;line-height:1}
.stat-label{font-size:11px;color:var(--muted);margin-top:5px}
.gtext{background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── Responsive ───────────────────────────────────────────── */
@media(max-width:860px){
  .grid-chat{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:540px){
  .stats-grid{grid-template-columns:1fr}
  aside{position:fixed;top:var(--header-h);left:0;height:calc(100vh - var(--header-h));z-index:200;transform:translateX(0)}
  aside.collapsed{transform:translateX(-100%);width:var(--sidebar-w)}
  .sidebar-overlay{display:block}
}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:190}
.spin{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Agents Screen ────────────────────────────────────────── */
.agents-screen-hdr{
  display:flex;align-items:center;gap:12px;
  padding:0 0 16px 0;border-bottom:1px solid var(--border);margin-bottom:18px;
}
.agents-screen-icon{
  width:44px;height:44px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;
}
.agents-screen-title{font-size:18px;font-weight:800;color:#fff}
.agents-screen-sub{font-size:12px;color:var(--muted);margin-top:2px}
.agents-back-btn{
  display:flex;align-items:center;gap:6px;padding:6px 12px;
  border-radius:8px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
  margin-left:auto;
}
.agents-back-btn:hover{color:#fff;background:var(--border)}
.search-box{
  display:flex;align-items:center;gap:8px;
  background:var(--card);border:1px solid var(--border);border-radius:10px;
  padding:6px 12px;
}
.search-box input{background:none;border:none;color:var(--text);font-size:13px;outline:none;width:180px}
.search-box i{color:var(--muted);font-size:12px}

/* ── Agents Grid (nova versão) ────────────────────────────── */
.agents-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.agent-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:14px;overflow:hidden;
  transition:box-shadow .18s;
}
.agent-card:hover{box-shadow:0 6px 24px rgba(108,99,255,.18)}
.agent-card-top{
  padding:16px;cursor:pointer;
  display:flex;flex-direction:column;gap:10px;
}
.agent-card-hdr{display:flex;align-items:flex-start;gap:10px}
.agent-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.agent-card-name{font-size:14px;font-weight:700;color:#fff;line-height:1.2}
.agent-card-cat{font-size:10px;color:var(--muted);margin-top:2px}
.agent-card-desc{font-size:12px;color:var(--muted);line-height:1.55}
.caps{display:flex;flex-wrap:wrap;gap:4px}
.cap-pill{font-size:10px;padding:2px 7px;border-radius:999px;background:rgba(108,99,255,.12);color:#a5b4fc;border:1px solid rgba(108,99,255,.25)}
.agent-card-btn{
  display:flex;align-items:center;justify-content:center;gap:7px;
  padding:9px 0;margin:0 16px 14px;
  border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;
  background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);
  color:#a5b4fc;transition:all .15s;
}
.agent-card-btn:hover{background:rgba(108,99,255,.28);color:#fff;border-color:var(--primary)}
.agent-card-btn.active{background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff;border-color:transparent}

/* ── Inline Chat Panel ────────────────────────────────────── */
.inline-chat{
  display:none;border-top:1px solid var(--border);
  background:var(--surface);flex-direction:column;
  max-height:420px;
}
.inline-chat.open{display:flex}
.inline-chat-hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 16px;border-bottom:1px solid var(--border);flex-shrink:0;
  font-size:12px;font-weight:600;color:var(--secondary);
}
.inline-chat-hdr button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:2px 6px;border-radius:4px}
.inline-chat-hdr button:hover{color:#fff;background:var(--border)}
.inline-msgs{
  flex:1;overflow-y:auto;padding:12px 16px;
  display:flex;flex-direction:column;gap:8px;min-height:100px;
}
.inline-msg{border-radius:8px;padding:8px 12px;font-size:12px;line-height:1.55}
.inline-msg.ai{background:var(--card);border-left:3px solid var(--secondary)}
.inline-msg.user{background:rgba(108,99,255,.1);border-left:3px solid var(--primary)}
.inline-msg .mn{font-size:10px;font-weight:700;margin-bottom:3px}
.inline-msg .mn.ai{color:var(--secondary)}
.inline-msg .mn.user{color:var(--primary)}
.inline-typing{display:none;padding:3px 16px;font-size:10px;color:var(--muted);flex-shrink:0}
.inline-quick{display:flex;gap:5px;padding:0 16px 8px;flex-wrap:wrap;flex-shrink:0}
.inline-qbtn{font-size:10px;padding:3px 9px;border-radius:6px;background:var(--card);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .15s}
.inline-qbtn:hover{background:rgba(108,99,255,.15);color:#fff;border-color:var(--primary)}
.inline-input-row{
  display:flex;gap:8px;padding:10px 16px;
  border-top:1px solid var(--border);flex-shrink:0;
}
.inline-input-row textarea{flex:1;height:42px;resize:none;font-size:12px;border-radius:8px;padding:8px 10px}
.inline-send-btn{
  height:42px;width:42px;flex-shrink:0;border-radius:8px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;cursor:pointer;font-size:14px;
  transition:opacity .15s;
}
.inline-send-btn:hover{opacity:.85}
.inline-send-btn:disabled{opacity:.4;cursor:not-allowed}

/* ── Home Screen (categorias) ─────────────────────────────── */
.home-hdr{margin-bottom:20px}
.home-hdr h2{font-size:20px;font-weight:800;color:#fff}
.home-hdr p{font-size:12px;color:var(--muted);margin-top:4px}
.cats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.cat-card{
  background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:16px;cursor:pointer;transition:all .18s;
  display:flex;flex-direction:column;align-items:flex-start;gap:8px;
}
.cat-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.3);border-color:var(--primary)}
.cat-card-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px}
.cat-card-name{font-size:13px;font-weight:700;color:#fff}
.cat-card-count{font-size:11px;color:var(--muted)}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.anim-in{animation:slideIn .22s ease}

/* ── Sidebar Accordion (sb-cat-*) ─────────────────────────── */
.sb-cat-group{border-bottom:1px solid rgba(42,45,64,.5)}
.sb-cat-header{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;
  font-size:12px;font-weight:600;color:var(--text);
  border-left:3px solid transparent;
  transition:all .15s;user-select:none;
}
.sb-cat-header:hover{background:rgba(108,99,255,.08);color:#fff}
.sb-cat-header.open{color:#fff;background:rgba(108,99,255,.1);border-left-color:var(--primary)}
.sb-cat-icon{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.sb-cat-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-cat-count{font-size:9px;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:1px 5px;color:var(--muted);flex-shrink:0}
.sb-cat-arrow{font-size:12px;color:var(--muted);transition:transform .22s;flex-shrink:0;line-height:1}
.sb-cat-header.open .sb-cat-arrow{transform:rotate(90deg)}
.sb-cat-agents{overflow:hidden;max-height:0;transition:max-height .28s ease}
.sb-cat-agents.open{max-height:600px}
.sb-agent-item{
  display:flex;align-items:center;gap:8px;
  padding:7px 14px 7px 30px;cursor:pointer;
  border-left:3px solid transparent;
  transition:all .15s;font-size:12px;color:var(--muted);
}
.sb-agent-item:hover{background:rgba(108,99,255,.07);color:var(--text)}
.sb-agent-item.active{background:rgba(108,99,255,.14);color:#fff;border-left-color:var(--primary)}
.sb-ag-emoji{font-size:14px;flex-shrink:0;width:18px;text-align:center}
.sb-ag-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-ag-badge{font-size:9px;padding:1px 5px;border-radius:999px;flex-shrink:0}

/* ── Full-Screen Agent Chat (fc-*) ────────────────────────── */
#tab-agent-chat{padding:0!important;gap:0!important}
.fc-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.fc-hdr{
  display:flex;align-items:center;gap:12px;
  padding:14px 20px;border-bottom:1px solid var(--border);flex-shrink:0;
  background:var(--surface);
}
.fc-agent-icon-el{
  width:46px;height:46px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;
}
.fc-hdr-info{flex:1;min-width:0}
.fc-hdr-name{font-size:16px;font-weight:800;color:#fff;line-height:1.2}
.fc-hdr-sub{font-size:11px;color:var(--muted);margin-top:2px}
.fc-hdr-caps{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.fc-hdr-actions{display:flex;gap:8px;flex-shrink:0}
.fc-back-btn{
  display:flex;align-items:center;gap:6px;padding:7px 14px;
  border-radius:9px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
}
.fc-back-btn:hover{color:#fff;background:var(--border)}
.fc-clear-btn{
  display:flex;align-items:center;gap:6px;padding:7px 14px;
  border-radius:9px;background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;transition:all .15s;
}
.fc-clear-btn:hover{color:#F87171;border-color:#F87171}
.fc-body{flex:1;display:flex;flex-direction:column;overflow:hidden}
.fc-msgs{
  flex:1;overflow-y:auto;padding:20px 24px;
  display:flex;flex-direction:column;gap:12px;
}
.fc-msg{border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.65;animation:slideIn .18s ease}
.fc-msg.ai{background:var(--surface);border-left:3px solid var(--secondary);max-width:85%}
.fc-msg.user{background:rgba(108,99,255,.12);border-left:3px solid var(--primary);max-width:85%;align-self:flex-end}
.fc-mn{font-size:11px;font-weight:700;margin-bottom:5px}
.fc-mn.ai{color:var(--secondary)}
.fc-mn.user{color:var(--primary)}
.fc-stream{display:inline}
.fc-typing{
  display:none;padding:6px 24px;font-size:11px;color:var(--muted);
  align-items:center;gap:6px;flex-shrink:0;
}
.fc-quick{
  display:flex;gap:6px;padding:10px 24px 4px;
  flex-wrap:wrap;flex-shrink:0;border-top:1px solid var(--border);
}
.fc-qbtn{
  font-size:11px;padding:5px 11px;border-radius:8px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);cursor:pointer;transition:all .15s;
}
.fc-qbtn:hover{background:rgba(108,99,255,.15);color:#fff;border-color:var(--primary)}
.fc-input-row{
  display:flex;gap:10px;padding:12px 20px 14px;
  border-top:1px solid var(--border);flex-shrink:0;
  background:var(--surface);
}
#fc-input{flex:1;height:52px;resize:none;font-size:13px;border-radius:10px;padding:10px 14px}
#fc-send-btn{
  height:52px;width:52px;flex-shrink:0;border-radius:10px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;cursor:pointer;font-size:16px;
  transition:opacity .15s;
}
#fc-send-btn:hover{opacity:.85}
#fc-send-btn:disabled{opacity:.4;cursor:not-allowed}

/* ── Abas do agente (Chat / Documento / Analisar) ─────────── */
.fc-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);flex-shrink:0;background:var(--surface)}
.fc-tab{
  padding:10px 18px;font-size:12px;font-weight:600;color:var(--muted);
  cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;
  display:flex;align-items:center;gap:7px;white-space:nowrap;
}
.fc-tab:hover{color:var(--text);background:rgba(108,99,255,.06)}
.fc-tab.active{color:#fff;border-bottom-color:var(--primary);background:rgba(108,99,255,.08)}
.fc-tab-panel{display:none;flex:1;flex-direction:column;overflow:hidden;min-height:0}
.fc-tab-panel.active{display:flex}

/* ── Painel Documento: gerar ──────────────────────────────── */
.doc-gen-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.doc-gen-form{
  padding:18px 22px;border-bottom:1px solid var(--border);flex-shrink:0;
  display:flex;flex-direction:column;gap:12px;background:var(--surface);
}
.doc-gen-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.doc-field label{display:block;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px}
.doc-field input,.doc-field textarea,.doc-field select{
  width:100%;background:var(--bg);border:1px solid var(--border);
  color:var(--text);border-radius:9px;padding:9px 12px;
  font-size:13px;font-family:inherit;resize:none;
}
.doc-field input:focus,.doc-field textarea:focus,.doc-field select:focus{
  outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(108,99,255,.18)
}
.doc-types-grid{display:flex;flex-wrap:wrap;gap:6px}
.doc-type-btn{
  font-size:11px;padding:5px 11px;border-radius:8px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);cursor:pointer;transition:all .15s;
}
.doc-type-btn:hover,.doc-type-btn.sel{background:rgba(108,99,255,.18);color:#fff;border-color:var(--primary)}
.doc-gen-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn-gen-doc{
  display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);color:#fff;
  border:none;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;
}
.btn-gen-doc:hover{opacity:.88}
.btn-gen-doc:disabled{opacity:.45;cursor:not-allowed}

/* ── Resultado do documento gerado ───────────────────────── */
.doc-result-wrap{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}
.doc-result-toolbar{
  display:flex;align-items:center;gap:8px;padding:10px 18px;
  border-bottom:1px solid var(--border);flex-shrink:0;
  background:var(--surface);flex-wrap:wrap;
}
.doc-result-title{font-size:13px;font-weight:700;color:#fff;flex:1}
.btn-dl{
  display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:9px;
  font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s;
}
.btn-dl-pdf{background:rgba(239,68,68,.15);color:#F87171;border:1px solid rgba(239,68,68,.3)}
.btn-dl-pdf:hover{background:rgba(239,68,68,.28);color:#fff}
.btn-dl-word{background:rgba(59,130,246,.15);color:#60A5FA;border:1px solid rgba(59,130,246,.3)}
.btn-dl-word:hover{background:rgba(59,130,246,.28);color:#fff}
.btn-dl-txt{background:rgba(52,211,153,.12);color:#34D399;border:1px solid rgba(52,211,153,.25)}
.btn-dl-txt:hover{background:rgba(52,211,153,.22);color:#fff}
.btn-copy-doc{background:var(--card);color:var(--muted);border:1px solid var(--border)}
.btn-copy-doc:hover{color:#fff;background:var(--border)}
.doc-preview{
  flex:1;overflow-y:auto;padding:22px 28px;
  font-size:13px;line-height:1.75;color:var(--text);
}
.doc-preview h1{font-size:1.3rem;font-weight:800;color:#fff;margin:0 0 16px;text-align:center;border-bottom:2px solid var(--primary);padding-bottom:10px}
.doc-preview h2{font-size:1rem;font-weight:700;color:#a5b4fc;margin:18px 0 8px}
.doc-preview h3{font-size:.9rem;font-weight:600;color:#22D3EE;margin:14px 0 6px}
.doc-preview strong{color:#fff}
.doc-preview hr{border:none;border-top:1px solid var(--border);margin:18px 0}
.doc-preview pre{background:#0d0d1a;border:1px solid var(--border);border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0}
.doc-preview code{color:#f472b6;font-family:monospace;font-size:12px}
.doc-preview blockquote{border-left:3px solid var(--primary);padding-left:12px;color:var(--muted);margin:8px 0}
.doc-preview table{width:100%;border-collapse:collapse;margin:10px 0}
.doc-preview th{background:var(--card);padding:8px 12px;text-align:left;font-size:12px;color:#a5b4fc;border:1px solid var(--border)}
.doc-preview td{padding:7px 12px;font-size:12px;border:1px solid var(--border)}
.doc-preview li{margin:3px 0;padding-left:4px}
.doc-empty{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  flex:1;gap:12px;color:var(--muted);padding:40px;text-align:center;
}
.doc-empty-icon{font-size:48px;opacity:.4}
.doc-streaming{padding:22px 28px;font-size:13px;line-height:1.75;color:var(--text);overflow-y:auto;flex:1}

/* ── Painel Analisar arquivo ──────────────────────────────── */
.analyze-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden}
.upload-zone{
  margin:18px 22px 0;border:2px dashed var(--border);border-radius:14px;
  padding:28px;text-align:center;cursor:pointer;transition:all .2s;flex-shrink:0;
  background:var(--card);
}
.upload-zone:hover,.upload-zone.drag-over{border-color:var(--primary);background:rgba(108,99,255,.07)}
.upload-zone-icon{font-size:36px;margin-bottom:8px;opacity:.6}
.upload-zone-txt{font-size:13px;color:var(--muted)}
.upload-zone-sub{font-size:11px;color:var(--muted);margin-top:4px;opacity:.7}
.upload-file-name{
  margin:10px 22px 0;padding:10px 14px;background:rgba(108,99,255,.1);
  border:1px solid rgba(108,99,255,.25);border-radius:10px;
  display:none;align-items:center;gap:10px;font-size:13px;color:#a5b4fc;flex-shrink:0;
}
.upload-file-name i{font-size:18px}
.analyze-instruction{padding:12px 22px;flex-shrink:0}
.analyze-instruction textarea{height:56px;resize:none;font-size:12px}
.analyze-actions{padding:0 22px 14px;flex-shrink:0;display:flex;gap:8px}
.btn-analyze{
  display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;
  background:linear-gradient(135deg,#059669,#10b981);color:#fff;
  border:none;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;
}
.btn-analyze:hover{opacity:.88}
.btn-analyze:disabled{opacity:.45;cursor:not-allowed}
.analyze-result{flex:1;overflow-y:auto;padding:18px 22px;min-height:0}
</style>
</head>
<body>

<!-- ══ LOGIN OVERLAY ════════════════════════════════════════ -->
<div id="login-overlay">
  <div class="login-box">
    <div class="login-logo">🤖</div>
    <div class="login-title">SixTech MAS</div>
    <div class="login-sub">Multi-Agent System v3.0 · Cloudflare Workers AI</div>

    <div class="login-field">
      <label class="login-label" for="l-user">Usuário</label>
      <input class="login-input" type="text" id="l-user" placeholder="Digite seu usuário"
        autocomplete="username" onkeydown="if(event.key==='Enter')document.getElementById('l-pass').focus()">
    </div>
    <div class="login-field">
      <label class="login-label" for="l-pass">Senha</label>
      <input class="login-input" type="password" id="l-pass" placeholder="••••••••••"
        autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
    </div>

    <button class="login-btn" id="login-btn" onclick="doLogin()">
      <i class="fas fa-sign-in-alt" style="margin-right:8px"></i>Entrar
    </button>
    <div class="login-error" id="login-error"></div>

    <div class="login-footer">
      <i class="fas fa-lock" style="margin-right:4px"></i>
      Acesso restrito · SixTech Brasil
    </div>
  </div>
</div>

<!-- HEADER -->
<header>
  <div class="hdr-left">
    <button class="btn-sidebar-toggle" onclick="toggleSidebar()" title="Menu">
      <i class="fas fa-bars"></i>
    </button>
    <div class="hdr-logo">🤖</div>
    <div>
      <div class="hdr-title">SixTech MAS <span class="hdr-badge">v3.0</span></div>
      <div class="hdr-sub">Multi-Agent System · Cloudflare Workers AI</div>
    </div>
  </div>
  <div class="hdr-right">
    <div class="status-pill">
      <span class="pulse"></span>
      <span id="status-text">Online</span>
    </div>
    <div id="hdr-user" style="display:none;align-items:center;gap:6px;font-size:12px;color:var(--muted);padding:5px 10px;background:var(--card);border:1px solid var(--border);border-radius:8px">
      <i class="fas fa-user-circle" style="color:var(--primary)"></i>
      <span id="hdr-username">—</span>
    </div>
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank" class="btn-gh">
      <i class="fab fa-github"></i> GitHub
    </a>
    <button class="btn-gh" id="logout-btn" style="display:none" onclick="doLogout()" title="Sair">
      <i class="fas fa-sign-out-alt"></i> Sair
    </button>
  </div>
</header>

<!-- OVERLAY mobile -->
<div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>

<!-- BODY -->
<div class="app-body">

  <!-- SIDEBAR -->
  <aside id="sidebar">

    <!-- Plataforma -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Plataforma</div>
      <div class="nav-item active" id="nav-home" onclick="showHome(this)">
        <i class="fas fa-home"></i> Início
      </div>
      <div class="nav-item" onclick="showTab('chat',this)">
        <i class="fas fa-comments"></i> Chat IA
      </div>
    </div>

    <!-- Categorias de Agentes -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Categorias</div>
      <div id="sidebar-categories"></div>
    </div>

    <!-- Sistema -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Sistema</div>
      <div class="nav-item" onclick="showTab('status',this)">
        <i class="fas fa-chart-line"></i> Status
      </div>
    </div>

    <!-- Dashboard -->
    <div class="sidebar-stat">
      <div class="sidebar-stat-title">Dashboard</div>
      <div class="sstat"><span>Agentes</span><span class="sstat-val" id="sb-agents">—</span></div>
      <div class="sstat"><span>Categorias</span><span class="sstat-val">22</span></div>
      <div class="sstat"><span>Uptime</span><span class="sstat-val" style="color:#34D399">99.9%</span></div>
    </div>
  </aside>

  <!-- MAIN -->
  <main>

    <!-- ══ TELA: HOME (categorias) ══════════════════════════ -->
    <div id="tab-home" class="tab-panel active">
      <div class="home-hdr">
        <h2>Selecione uma Categoria</h2>
        <p>Escolha um setor para visualizar e conversar com os agentes especializados</p>
      </div>
      <div id="cats-grid" class="cats-grid"></div>
    </div>

    <!-- ══ TELA: AGENTES (por categoria) ════════════════════ -->
    <div id="tab-agents" class="tab-panel">
      <div class="agents-screen-hdr">
        <div class="agents-screen-icon" id="agents-screen-icon"></div>
        <div>
          <div class="agents-screen-title" id="agents-screen-title">Agentes</div>
          <div class="agents-screen-sub" id="agents-screen-sub"></div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-left:auto">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar agente..." id="agent-search" oninput="filterAgents(this.value)">
          </div>
          <button class="agents-back-btn" onclick="showHome(null)">
            <i class="fas fa-arrow-left"></i> Voltar
          </button>
        </div>
      </div>
      <div id="agents-grid" class="agents-grid"></div>
    </div>

    <!-- ══ TAB: CHAT ══════════════════════════════════════════ -->
    <div id="tab-chat" class="tab-panel">
      <div class="chat-box" style="height:calc(100vh - var(--header-h) - 40px)">
        <div class="chat-hdr">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:16px">💬</span>
            <span style="font-weight:600;font-size:14px;color:#fff">Chat Livre com IA</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <select id="chat-model" style="background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:4px 10px;font-size:11px;outline:none"></select>
            <button class="btn btn-ghost" style="padding:5px 10px;font-size:11px" onclick="clearChat()">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
          </div>
        </div>
        <div id="chat-messages" class="chat-msgs">
          <div class="msg msg-ai">
            <div class="msg-name ai">🤖 Assistente SixTech</div>
            <div>Olá! Sou o assistente da <strong>SixTech Brasil</strong>, powered by Cloudflare Workers AI. Como posso ajudar você hoje?</div>
          </div>
        </div>
        <div id="typing-indicator"><span class="typing-dot"></span>IA digitando...</div>
        <div class="chat-input-row">
          <textarea id="chat-input" placeholder="Digite sua mensagem... (Enter para enviar)"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}"></textarea>
            <button class="btn btn-primary btn-icon" onclick="sendChat()" id="chat-send-btn" style="height:60px;padding:0 16px">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
    </div>

    <!-- ══ TAB: STATUS ═════════════════════════════════════════ -->
    <div id="tab-status" class="tab-panel">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-val gtext" id="stat-agents">—</div><div class="stat-label">Agentes Ativos</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#22D3EE" id="stat-models">8</div><div class="stat-label">Modelos de IA</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#34D399">4</div><div class="stat-label">Repos Integrados</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#F59E0B">v3.0</div><div class="stat-label">Versão</div></div>
      </div>
      <div id="status-details" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px"></div>
    </div>

    <!-- ══ TELA: AGENTE FULL-SCREEN CHAT ════════════════════════ -->
    <div id="tab-agent-chat" class="tab-panel">
      <div class="fc-wrap">

        <!-- Cabeçalho do agente -->
        <div class="fc-hdr">
          <div id="fc-agent-icon" class="fc-agent-icon-el">🤖</div>
          <div class="fc-hdr-info">
            <div id="fc-agent-name" class="fc-hdr-name">Agente</div>
            <div id="fc-agent-sub" class="fc-hdr-sub">Categoria · Modelo</div>
            <div id="fc-agent-caps" class="fc-hdr-caps"></div>
          </div>
          <div class="fc-hdr-actions">
            <button class="fc-clear-btn" id="fc-clear-btn" onclick="fcClear()" title="Limpar">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
            <button class="fc-back-btn" onclick="showHome(null)" title="Voltar ao início">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>

        <!-- Abas: Chat | Gerar Documento | Analisar Arquivo -->
        <div class="fc-tabs" id="fc-tabs">
          <div class="fc-tab active" data-tab="chat" onclick="switchFcTab('chat',this)">
            <i class="fas fa-comments"></i> Chat
          </div>
          <div class="fc-tab" data-tab="doc" onclick="switchFcTab('doc',this)">
            <i class="fas fa-file-alt"></i> Gerar Documento
          </div>
          <div class="fc-tab" data-tab="analyze" onclick="switchFcTab('analyze',this)">
            <i class="fas fa-search"></i> Analisar Arquivo
          </div>
        </div>

        <!-- ── ABA: CHAT ─────────────────────────────────────── -->
        <div id="fc-panel-chat" class="fc-tab-panel active">
          <div class="fc-body">
            <div id="fc-msgs" class="fc-msgs"></div>
            <div id="fc-typing" class="fc-typing">
              <span class="typing-dot"></span>
              <span>Agente digitando...</span>
            </div>
            <div id="fc-quick" class="fc-quick"></div>
            <div class="fc-input-row">
              <textarea id="fc-input"
                placeholder="Digite sua mensagem... (Enter para enviar)"
                onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();fcSend()}"></textarea>
              <button id="fc-send-btn" onclick="fcSend()" title="Enviar">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ── ABA: GERAR DOCUMENTO ──────────────────────────── -->
        <div id="fc-panel-doc" class="fc-tab-panel">
          <div class="doc-gen-wrap">

            <!-- Formulário de geração -->
            <div class="doc-gen-form">
              <div>
                <div class="doc-field" style="margin-bottom:8px">
                  <label>Tipo de Documento</label>
                  <div class="doc-types-grid" id="doc-types-grid"></div>
                </div>
                <div class="doc-gen-row">
                  <div class="doc-field">
                    <label>Ou descreva o tipo</label>
                    <input type="text" id="doc-type-input" placeholder="Ex: Contrato de Prestação de Serviços">
                  </div>
                  <div class="doc-field">
                    <label>Partes envolvidas</label>
                    <input type="text" id="doc-parties" placeholder="Ex: Empresa A e Empresa B">
                  </div>
                </div>
                <div class="doc-field">
                  <label>Instruções específicas</label>
                  <textarea id="doc-instructions" rows="2"
                    placeholder="Descreva detalhes, cláusulas especiais, valores, prazos, condições..."></textarea>
                </div>
              </div>
              <div class="doc-gen-actions">
                <button class="btn-gen-doc" id="btn-gen-doc" onclick="generateDocument()">
                  <i class="fas fa-magic"></i> Gerar Documento com IA
                </button>
                <span id="doc-gen-status" style="font-size:12px;color:var(--muted)"></span>
              </div>
            </div>

            <!-- Resultado + toolbar de download -->
            <div class="doc-result-wrap" id="doc-result-wrap">
              <div class="doc-result-toolbar" id="doc-result-toolbar" style="display:none">
                <span class="doc-result-title" id="doc-result-title">Documento Gerado</span>
                <button class="btn-dl btn-copy-doc" onclick="copyDocument()" title="Copiar">
                  <i class="fas fa-copy"></i> Copiar
                </button>
                <button class="btn-dl btn-dl-txt" onclick="downloadDoc('txt')" title="Baixar TXT">
                  <i class="fas fa-file-alt"></i> TXT
                </button>
                <button class="btn-dl btn-dl-word" onclick="downloadDoc('word')" title="Baixar Word">
                  <i class="fas fa-file-word"></i> Word
                </button>
                <button class="btn-dl btn-dl-pdf" onclick="downloadDoc('pdf')" title="Baixar PDF">
                  <i class="fas fa-file-pdf"></i> PDF
                </button>
              </div>
              <div id="doc-preview-area" class="doc-preview doc-empty">
                <div class="doc-empty-icon">📄</div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">Nenhum documento gerado</div>
                <div style="font-size:12px">Preencha o formulário acima e clique em <strong>Gerar Documento com IA</strong></div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── ABA: ANALISAR ARQUIVO ─────────────────────────── -->
        <div id="fc-panel-analyze" class="fc-tab-panel">
          <div class="analyze-wrap">

            <!-- Upload zone -->
            <div class="upload-zone" id="upload-zone"
              onclick="document.getElementById('file-input').click()"
              ondragover="event.preventDefault();this.classList.add('drag-over')"
              ondragleave="this.classList.remove('drag-over')"
              ondrop="handleFileDrop(event)">
              <div class="upload-zone-icon">📎</div>
              <div class="upload-zone-txt">Clique ou arraste seu arquivo aqui</div>
              <div class="upload-zone-sub">PDF · DOCX · TXT · até 5 MB</div>
            </div>
            <input type="file" id="file-input" accept=".pdf,.doc,.docx,.txt,.md"
              style="display:none" onchange="handleFileSelect(this)">

            <!-- Nome do arquivo carregado -->
            <div class="upload-file-name" id="upload-file-name">
              <i class="fas fa-file-check"></i>
              <span id="upload-file-label">arquivo.pdf</span>
              <button onclick="clearUpload()" style="margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px">✕</button>
            </div>

            <!-- Instrução para análise -->
            <div class="analyze-instruction">
              <div class="doc-field">
                <label>Instrução para análise (opcional)</label>
                <textarea id="analyze-instruction"
                  placeholder="Ex: Identifique cláusulas abusivas, verifique conformidade com a LGPD, sugira melhorias..."></textarea>
              </div>
            </div>

            <!-- Botão analisar -->
            <div class="analyze-actions">
              <button class="btn-analyze" id="btn-analyze" onclick="analyzeFile()">
                <i class="fas fa-microscope"></i> Analisar com IA
              </button>
              <div id="doc-result-toolbar-analyze" style="display:none;gap:8px;display:none;align-items:center">
                <button class="btn-dl btn-dl-txt" onclick="downloadAnalysis('txt')">
                  <i class="fas fa-file-alt"></i> TXT
                </button>
                <button class="btn-dl btn-dl-word" onclick="downloadAnalysis('word')">
                  <i class="fas fa-file-word"></i> Word
                </button>
                <button class="btn-dl btn-dl-pdf" onclick="downloadAnalysis('pdf')">
                  <i class="fas fa-file-pdf"></i> PDF
                </button>
              </div>
            </div>

            <!-- Resultado da análise -->
            <div id="analyze-result" class="analyze-result">
              <div class="doc-empty" style="padding:30px 0">
                <div class="doc-empty-icon">🔍</div>
                <div style="font-size:14px;font-weight:600;color:var(--text)">Nenhuma análise realizada</div>
                <div style="font-size:12px">Envie um arquivo acima e clique em <strong>Analisar com IA</strong></div>
              </div>
            </div>

          </div>
        </div>

      </div><!-- /.fc-wrap -->
    </div><!-- /#tab-agent-chat -->

  </main>
</div>

<script src="/static/app.js"><\/script>
<script>
function toggleSidebar(){
  const s = document.getElementById('sidebar')
  const o = document.getElementById('sidebar-overlay')
  s.classList.toggle('collapsed')
  o.style.display = s.classList.contains('collapsed') ? 'none' : ''
}
<\/script>
</body>
</html>`));const rt=new Ct,kr=Object.assign({"/src/index.tsx":E});let Rt=!1;for(const[,t]of Object.entries(kr))t&&(rt.route("/",t),rt.notFound(t.notFoundHandler),Rt=!0);if(!Rt)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{rt as default};
