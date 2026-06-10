var Rt=Object.defineProperty;var We=t=>{throw TypeError(t)};var Et=(t,e,a)=>e in t?Rt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var f=(t,e,a)=>Et(t,typeof e!="symbol"?e+"":e,a),Ve=(t,e,a)=>e.has(t)||We("Cannot "+a);var i=(t,e,a)=>(Ve(t,e,"read from private field"),a?a.call(t):e.get(t)),h=(t,e,a)=>e.has(t)?We("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a),g=(t,e,a,r)=>(Ve(t,e,"write to private field"),r?r.call(t,a):e.set(t,a),a),b=(t,e,a)=>(Ve(t,e,"access private method"),a);var Je=(t,e,a,r)=>({set _(s){g(t,e,s,a)},get _(){return i(t,e,r)}});var Ye=(t,e,a)=>(r,s)=>{let o=-1;return n(0);async function n(c){if(c<=o)throw new Error("next() called multiple times");o=c;let l,d=!1,p;if(t[c]?(p=t[c][0][0],r.req.routeIndex=c):p=c===t.length&&s||void 0,p)try{l=await p(r,()=>n(c+1))}catch(u){if(u instanceof Error&&e)r.error=u,l=await e(u,r),d=!0;else throw u}else r.finalized===!1&&a&&(l=await a(r));return l&&(r.finalized===!1||d)&&(r.res=l),r}},St=Symbol(),jt=async(t,e=Object.create(null))=>{const{all:a=!1,dot:r=!1}=e,o=(t instanceof ut?t.raw.headers:t.headers).get("Content-Type");return o!=null&&o.startsWith("multipart/form-data")||o!=null&&o.startsWith("application/x-www-form-urlencoded")?Pt(t,{all:a,dot:r}):{}};async function Pt(t,e){const a=await t.formData();return a?Ot(a,e):{}}function Ot(t,e){const a=Object.create(null);return t.forEach((r,s)=>{e.all||s.endsWith("[]")?Dt(a,s,r):a[s]=r}),e.dot&&Object.entries(a).forEach(([r,s])=>{r.includes(".")&&(It(a,r,s),delete a[r])}),a}var Dt=(t,e,a)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(a):t[e]=[t[e],a]:e.endsWith("[]")?t[e]=[a]:t[e]=a},It=(t,e,a)=>{if(/(?:^|\.)__proto__\./.test(e))return;let r=t;const s=e.split(".");s.forEach((o,n)=>{n===s.length-1?r[o]=a:((!r[o]||typeof r[o]!="object"||Array.isArray(r[o])||r[o]instanceof File)&&(r[o]=Object.create(null)),r=r[o])})},nt=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Tt=t=>{const{groups:e,path:a}=zt(t),r=nt(a);return Lt(r,e)},zt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(a,r)=>{const s=`@${r}`;return e.push([s,a]),s}),{groups:e,path:t}},Lt=(t,e)=>{for(let a=e.length-1;a>=0;a--){const[r]=e[a];for(let s=t.length-1;s>=0;s--)if(t[s].includes(r)){t[s]=t[s].replace(r,e[a][1]);break}}return t},De={},Bt=(t,e)=>{if(t==="*")return"*";const a=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(a){const r=`${t}#${e}`;return De[r]||(a[2]?De[r]=e&&e[0]!==":"&&e[0]!=="*"?[r,a[1],new RegExp(`^${a[2]}(?=/${e})`)]:[t,a[1],new RegExp(`^${a[2]}$`)]:De[r]=[t,a[1],!0]),De[r]}return null},_e=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,a=>{try{return e(a)}catch{return a}})}},Ft=t=>_e(t,decodeURI),lt=t=>{const e=t.url,a=e.indexOf("/",e.indexOf(":")+4);let r=a;for(;r<e.length;r++){const s=e.charCodeAt(r);if(s===37){const o=e.indexOf("?",r),n=e.indexOf("#",r),c=o===-1?n===-1?void 0:n:n===-1?o:Math.min(o,n),l=e.slice(a,c);return Ft(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(s===63||s===35)break}return e.slice(a,r)},Mt=t=>{const e=lt(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},J=(t,e,...a)=>(a.length&&(e=J(e,...a)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),ct=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),a=[];let r="";return e.forEach(s=>{if(s!==""&&!/\:/.test(s))r+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){a.length===0&&r===""?a.push("/"):a.push(r);const o=s.replace("?","");r+="/"+o,a.push(r)}else r+="/"+s}),a.filter((s,o,n)=>n.indexOf(s)===o)},qe=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?_e(t,pt):t):t,dt=(t,e,a)=>{let r;if(!a&&e&&!/[%+]/.test(e)){let n=t.indexOf("?",8);if(n===-1)return;for(t.startsWith(e,n+1)||(n=t.indexOf(`&${e}`,n+1));n!==-1;){const c=t.charCodeAt(n+e.length+1);if(c===61){const l=n+e.length+2,d=t.indexOf("&",l);return qe(t.slice(l,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";n=t.indexOf(`&${e}`,n+1)}if(r=/[%+]/.test(t),!r)return}const s={};r??(r=/[%+]/.test(t));let o=t.indexOf("?",8);for(;o!==-1;){const n=t.indexOf("&",o+1);let c=t.indexOf("=",o);c>n&&n!==-1&&(c=-1);let l=t.slice(o+1,c===-1?n===-1?void 0:n:c);if(r&&(l=qe(l)),o=n,l==="")continue;let d;c===-1?d="":(d=t.slice(c+1,n===-1?void 0:n),r&&(d=qe(d))),a?(s[l]&&Array.isArray(s[l])||(s[l]=[]),s[l].push(d)):s[l]??(s[l]=d)}return e?s[e]:s},Ht=dt,Vt=(t,e)=>dt(t,e,!0),pt=decodeURIComponent,Qe=t=>_e(t,pt),de,S,$,gt,ft,Ne,F,tt,ut=(tt=class{constructor(t,e="/",a=[[]]){h(this,$);f(this,"raw");h(this,de);h(this,S);f(this,"routeIndex",0);f(this,"path");f(this,"bodyCache",{});h(this,F,t=>{const{bodyCache:e,raw:a}=this,r=e[t];if(r)return r;const s=Object.keys(e)[0];return s?e[s].then(o=>(s==="json"&&(o=JSON.stringify(o)),new Response(o)[t]())):e[t]=a[t]()});this.raw=t,this.path=e,g(this,S,a),g(this,de,{})}param(t){return t?b(this,$,gt).call(this,t):b(this,$,ft).call(this)}query(t){return Ht(this.url,t)}queries(t){return Vt(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((a,r)=>{e[r]=a}),e}async parseBody(t){return jt(this,t)}json(){return i(this,F).call(this,"text").then(t=>JSON.parse(t))}text(){return i(this,F).call(this,"text")}arrayBuffer(){return i(this,F).call(this,"arrayBuffer")}bytes(){return i(this,F).call(this,"arrayBuffer").then(t=>new Uint8Array(t))}blob(){return i(this,F).call(this,"blob")}formData(){return i(this,F).call(this,"formData")}addValidatedData(t,e){i(this,de)[t]=e}valid(t){return i(this,de)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[St](){return i(this,S)}get matchedRoutes(){return i(this,S)[0].map(([[,t]])=>t)}get routePath(){return i(this,S)[0].map(([[,t]])=>t)[this.routeIndex].path}},de=new WeakMap,S=new WeakMap,$=new WeakSet,gt=function(t){const e=i(this,S)[0][this.routeIndex][1][t],a=b(this,$,Ne).call(this,e);return a&&/\%/.test(a)?Qe(a):a},ft=function(){const t={},e=Object.keys(i(this,S)[0][this.routeIndex][1]);for(const a of e){const r=b(this,$,Ne).call(this,i(this,S)[0][this.routeIndex][1][a]);r!==void 0&&(t[a]=/\%/.test(r)?Qe(r):r)}return t},Ne=function(t){return i(this,S)[1]?i(this,S)[1][t]:t},F=new WeakMap,tt),qt={Stringify:1},mt=async(t,e,a,r,s)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const o=t.callbacks;return o!=null&&o.length?(s?s[0]+=t:s=[t],Promise.all(o.map(c=>c({phase:e,buffer:s,context:r}))).then(c=>Promise.all(c.filter(Boolean).map(l=>mt(l,e,!1,r,s))).then(()=>s[0]))):Promise.resolve(t)},$t="text/plain; charset=UTF-8",$e=(t,e)=>({"Content-Type":t,...e}),we=(t,e)=>new Response(t,e),Re,Ee,M,pe,H,E,Se,ue,ge,Z,je,Pe,_,le,at,Nt=(at=class{constructor(t,e){h(this,_);h(this,Re);h(this,Ee);f(this,"env",{});h(this,M);f(this,"finalized",!1);f(this,"error");h(this,pe);h(this,H);h(this,E);h(this,Se);h(this,ue);h(this,ge);h(this,Z);h(this,je);h(this,Pe);f(this,"render",(...t)=>(i(this,ue)??g(this,ue,e=>this.html(e)),i(this,ue).call(this,...t)));f(this,"setLayout",t=>g(this,Se,t));f(this,"getLayout",()=>i(this,Se));f(this,"setRenderer",t=>{g(this,ue,t)});f(this,"header",(t,e,a)=>{this.finalized&&g(this,E,we(i(this,E).body,i(this,E)));const r=i(this,E)?i(this,E).headers:i(this,Z)??g(this,Z,new Headers);e===void 0?r.delete(t):a!=null&&a.append?r.append(t,e):r.set(t,e)});f(this,"status",t=>{g(this,pe,t)});f(this,"set",(t,e)=>{i(this,M)??g(this,M,new Map),i(this,M).set(t,e)});f(this,"get",t=>i(this,M)?i(this,M).get(t):void 0);f(this,"newResponse",(...t)=>b(this,_,le).call(this,...t));f(this,"body",(t,e,a)=>b(this,_,le).call(this,t,e,a));f(this,"text",(t,e,a)=>!i(this,Z)&&!i(this,pe)&&!e&&!a&&!this.finalized?new Response(t):b(this,_,le).call(this,t,e,$e($t,a)));f(this,"json",(t,e,a)=>b(this,_,le).call(this,JSON.stringify(t),e,$e("application/json",a)));f(this,"html",(t,e,a)=>{const r=s=>b(this,_,le).call(this,s,e,$e("text/html; charset=UTF-8",a));return typeof t=="object"?mt(t,qt.Stringify,!1,{}).then(r):r(t)});f(this,"redirect",(t,e)=>{const a=String(t);return this.header("Location",/[^\x00-\xFF]/.test(a)?encodeURI(a):a),this.newResponse(null,e??302)});f(this,"notFound",()=>(i(this,ge)??g(this,ge,()=>we()),i(this,ge).call(this,this)));g(this,Re,t),e&&(g(this,H,e.executionCtx),this.env=e.env,g(this,ge,e.notFoundHandler),g(this,Pe,e.path),g(this,je,e.matchResult))}get req(){return i(this,Ee)??g(this,Ee,new ut(i(this,Re),i(this,Pe),i(this,je))),i(this,Ee)}get event(){if(i(this,H)&&"respondWith"in i(this,H))return i(this,H);throw Error("This context has no FetchEvent")}get executionCtx(){if(i(this,H))return i(this,H);throw Error("This context has no ExecutionContext")}get res(){return i(this,E)||g(this,E,we(null,{headers:i(this,Z)??g(this,Z,new Headers)}))}set res(t){if(i(this,E)&&t){t=we(t.body,t);for(const[e,a]of i(this,E).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const r=i(this,E).headers.getSetCookie();t.headers.delete("set-cookie");for(const s of r)t.headers.append("set-cookie",s)}else t.headers.set(e,a)}g(this,E,t),this.finalized=!0}get var(){return i(this,M)?Object.fromEntries(i(this,M)):{}}},Re=new WeakMap,Ee=new WeakMap,M=new WeakMap,pe=new WeakMap,H=new WeakMap,E=new WeakMap,Se=new WeakMap,ue=new WeakMap,ge=new WeakMap,Z=new WeakMap,je=new WeakMap,Pe=new WeakMap,_=new WeakSet,le=function(t,e,a){const r=i(this,E)?new Headers(i(this,E).headers):i(this,Z)??new Headers;if(typeof e=="object"&&"headers"in e){const o=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[n,c]of o)n.toLowerCase()==="set-cookie"?r.append(n,c):r.set(n,c)}if(a)for(const[o,n]of Object.entries(a))if(typeof n=="string")r.set(o,n);else{r.delete(o);for(const c of n)r.append(o,c)}const s=typeof e=="number"?e:(e==null?void 0:e.status)??i(this,pe);return we(t,{status:s,headers:r})},at),y="ALL",_t="all",Ut=["get","post","put","delete","options","patch"],ht="Can not add a route since the matcher is already built.",vt=class extends Error{},Gt="__COMPOSED_HANDLER",Kt=t=>t.text("404 Not Found",404),Xe=(t,e)=>{if("getResponse"in t){const a=t.getResponse();return e.newResponse(a.body,a)}return console.error(t),e.text("Internal Server Error",500)},P,w,bt,O,Y,Ie,Te,fe,Wt=(fe=class{constructor(e={}){h(this,w);f(this,"get");f(this,"post");f(this,"put");f(this,"delete");f(this,"options");f(this,"patch");f(this,"all");f(this,"on");f(this,"use");f(this,"router");f(this,"getPath");f(this,"_basePath","/");h(this,P,"/");f(this,"routes",[]);h(this,O,Kt);f(this,"errorHandler",Xe);f(this,"onError",e=>(this.errorHandler=e,this));f(this,"notFound",e=>(g(this,O,e),this));f(this,"fetch",(e,...a)=>b(this,w,Te).call(this,e,a[1],a[0],e.method));f(this,"request",(e,a,r,s)=>e instanceof Request?this.fetch(a?new Request(e,a):e,r,s):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${J("/",e)}`,a),r,s)));f(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(b(this,w,Te).call(this,e.request,e,void 0,e.request.method))})});[...Ut,_t].forEach(o=>{this[o]=(n,...c)=>(typeof n=="string"?g(this,P,n):b(this,w,Y).call(this,o,i(this,P),n),c.forEach(l=>{b(this,w,Y).call(this,o,i(this,P),l)}),this)}),this.on=(o,n,...c)=>{for(const l of[n].flat()){g(this,P,l);for(const d of[o].flat())c.map(p=>{b(this,w,Y).call(this,d.toUpperCase(),i(this,P),p)})}return this},this.use=(o,...n)=>(typeof o=="string"?g(this,P,o):(g(this,P,"*"),n.unshift(o)),n.forEach(c=>{b(this,w,Y).call(this,y,i(this,P),c)}),this);const{strict:r,...s}=e;Object.assign(this,s),this.getPath=r??!0?e.getPath??lt:Mt}route(e,a){const r=this.basePath(e);return a.routes.map(s=>{var n;let o;a.errorHandler===Xe?o=s.handler:(o=async(c,l)=>(await Ye([],a.errorHandler)(c,()=>s.handler(c,l))).res,o[Gt]=s.handler),b(n=r,w,Y).call(n,s.method,s.path,o,s.basePath)}),this}basePath(e){const a=b(this,w,bt).call(this);return a._basePath=J(this._basePath,e),a}mount(e,a,r){let s,o;r&&(typeof r=="function"?o=r:(o=r.optionHandler,r.replaceRequest===!1?s=l=>l:s=r.replaceRequest));const n=o?l=>{const d=o(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};s||(s=(()=>{const l=J(this._basePath,e),d=l==="/"?0:l.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(d)||"/",new Request(u,p)}})());const c=async(l,d)=>{const p=await a(s(l.req.raw),...n(l));if(p)return p;await d()};return b(this,w,Y).call(this,y,J(e,"*"),c),this}},P=new WeakMap,w=new WeakSet,bt=function(){const e=new fe({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,g(e,O,i(this,O)),e.routes=this.routes,e},O=new WeakMap,Y=function(e,a,r,s){e=e.toUpperCase(),a=J(this._basePath,a);const o={basePath:s!==void 0?J(this._basePath,s):this._basePath,path:a,method:e,handler:r};this.router.add(e,a,[r,o]),this.routes.push(o)},Ie=function(e,a){if(e instanceof Error)return this.errorHandler(e,a);throw e},Te=function(e,a,r,s){if(s==="HEAD")return(async()=>new Response(null,await b(this,w,Te).call(this,e,a,r,"GET")))();const o=this.getPath(e,{env:r}),n=this.router.match(s,o),c=new Nt(e,{path:o,matchResult:n,env:r,executionCtx:a,notFoundHandler:i(this,O)});if(n[0].length===1){let d;try{d=n[0][0][0][0](c,async()=>{c.res=await i(this,O).call(this,c)})}catch(p){return b(this,w,Ie).call(this,p,c)}return d instanceof Promise?d.then(p=>p||(c.finalized?c.res:i(this,O).call(this,c))).catch(p=>b(this,w,Ie).call(this,p,c)):d??i(this,O).call(this,c)}const l=Ye(n[0],this.errorHandler,i(this,O));return(async()=>{try{const d=await l(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return b(this,w,Ie).call(this,d,c)}})()},fe),xt=[];function Jt(t,e){const a=this.buildAllMatchers(),r=(s,o)=>{const n=a[s]||a[y],c=n[2][o];if(c)return c;const l=o.match(n[0]);if(!l)return[[],xt];const d=l.indexOf("",1);return[n[1][d],l]};return this.match=r,r(t,e)}var Le="[^/]+",Ae=".*",Ce="(?:|/.*)",ce=Symbol(),Yt=new Set(".\\+*[^]$()");function Qt(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Ae||t===Ce?1:e===Ae||e===Ce?-1:t===Le?1:e===Le?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var ee,te,D,se,Xt=(se=class{constructor(){h(this,ee);h(this,te);h(this,D,Object.create(null))}insert(e,a,r,s,o){if(e.length===0){if(i(this,ee)!==void 0)throw ce;if(o)return;g(this,ee,a);return}const[n,...c]=e,l=n==="*"?c.length===0?["","",Ae]:["","",Le]:n==="/*"?["","",Ce]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(l){const p=l[1];let u=l[2]||Le;if(p&&l[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ce;if(d=i(this,D)[u],!d){if(Object.keys(i(this,D)).some(v=>v!==Ae&&v!==Ce))throw ce;if(o)return;d=i(this,D)[u]=new se,p!==""&&g(d,te,s.varIndex++)}!o&&p!==""&&r.push([p,i(d,te)])}else if(d=i(this,D)[n],!d){if(Object.keys(i(this,D)).some(p=>p.length>1&&p!==Ae&&p!==Ce))throw ce;if(o)return;d=i(this,D)[n]=new se}d.insert(c,a,r,s,o)}buildRegExpStr(){const a=Object.keys(i(this,D)).sort(Qt).map(r=>{const s=i(this,D)[r];return(typeof i(s,te)=="number"?`(${r})@${i(s,te)}`:Yt.has(r)?`\\${r}`:r)+s.buildRegExpStr()});return typeof i(this,ee)=="number"&&a.unshift(`#${i(this,ee)}`),a.length===0?"":a.length===1?a[0]:"(?:"+a.join("|")+")"}},ee=new WeakMap,te=new WeakMap,D=new WeakMap,se),Be,Oe,rt,Zt=(rt=class{constructor(){h(this,Be,{varIndex:0});h(this,Oe,new Xt)}insert(t,e,a){const r=[],s=[];for(let n=0;;){let c=!1;if(t=t.replace(/\{[^}]+\}/g,l=>{const d=`@\\${n}`;return s[n]=[d,l],n++,c=!0,d}),!c)break}const o=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=s.length-1;n>=0;n--){const[c]=s[n];for(let l=o.length-1;l>=0;l--)if(o[l].indexOf(c)!==-1){o[l]=o[l].replace(c,s[n][1]);break}}return i(this,Oe).insert(o,e,r,i(this,Be),a),r}buildRegExp(){let t=i(this,Oe).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const a=[],r=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,o,n)=>o!==void 0?(a[++e]=Number(o),"$()"):(n!==void 0&&(r[Number(n)]=++e),"")),[new RegExp(`^${t}`),a,r]}},Be=new WeakMap,Oe=new WeakMap,rt),ea=[/^$/,[],Object.create(null)],ze=Object.create(null);function yt(t){return ze[t]??(ze[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,a)=>a?`\\${a}`:"(?:|/.*)")}$`))}function ta(){ze=Object.create(null)}function aa(t){var d;const e=new Zt,a=[];if(t.length===0)return ea;const r=t.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[v,A])=>p?1:v?-1:u.length-A.length),s=Object.create(null);for(let p=0,u=-1,v=r.length;p<v;p++){const[A,C,z]=r[p];A?s[C]=[z.map(([T])=>[T,Object.create(null)]),xt]:u++;let j;try{j=e.insert(C,u,A)}catch(T){throw T===ce?new vt(C):T}A||(a[u]=z.map(([T,x])=>{const L=Object.create(null);for(x-=1;x>=0;x--){const[be,Me]=j[x];L[be]=Me}return[T,L]}))}const[o,n,c]=e.buildRegExp();for(let p=0,u=a.length;p<u;p++)for(let v=0,A=a[p].length;v<A;v++){const C=(d=a[p][v])==null?void 0:d[1];if(!C)continue;const z=Object.keys(C);for(let j=0,T=z.length;j<T;j++)C[z[j]]=c[C[z[j]]]}const l=[];for(const p in n)l[p]=a[n[p]];return[o,l,s]}function ne(t,e){if(t){for(const a of Object.keys(t).sort((r,s)=>s.length-r.length))if(yt(a).test(e))return[...t[a]]}}var U,G,Fe,wt,st,ra=(st=class{constructor(){h(this,Fe);f(this,"name","RegExpRouter");h(this,U);h(this,G);f(this,"match",Jt);g(this,U,{[y]:Object.create(null)}),g(this,G,{[y]:Object.create(null)})}add(t,e,a){var c;const r=i(this,U),s=i(this,G);if(!r||!s)throw new Error(ht);r[t]||[r,s].forEach(l=>{l[t]=Object.create(null),Object.keys(l[y]).forEach(d=>{l[t][d]=[...l[y][d]]})}),e==="/*"&&(e="*");const o=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const l=yt(e);t===y?Object.keys(r).forEach(d=>{var p;(p=r[d])[e]||(p[e]=ne(r[d],e)||ne(r[y],e)||[])}):(c=r[t])[e]||(c[e]=ne(r[t],e)||ne(r[y],e)||[]),Object.keys(r).forEach(d=>{(t===y||t===d)&&Object.keys(r[d]).forEach(p=>{l.test(p)&&r[d][p].push([a,o])})}),Object.keys(s).forEach(d=>{(t===y||t===d)&&Object.keys(s[d]).forEach(p=>l.test(p)&&s[d][p].push([a,o]))});return}const n=ct(e)||[e];for(let l=0,d=n.length;l<d;l++){const p=n[l];Object.keys(s).forEach(u=>{var v;(t===y||t===u)&&((v=s[u])[p]||(v[p]=[...ne(r[u],p)||ne(r[y],p)||[]]),s[u][p].push([a,o-d+l+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(i(this,G)).concat(Object.keys(i(this,U))).forEach(e=>{t[e]||(t[e]=b(this,Fe,wt).call(this,e))}),g(this,U,g(this,G,void 0)),ta(),t}},U=new WeakMap,G=new WeakMap,Fe=new WeakSet,wt=function(t){const e=[];let a=t===y;return[i(this,U),i(this,G)].forEach(r=>{const s=r[t]?Object.keys(r[t]).map(o=>[o,r[t][o]]):[];s.length!==0?(a||(a=!0),e.push(...s)):t!==y&&e.push(...Object.keys(r[y]).map(o=>[o,r[y][o]]))}),a?aa(e):null},st),K,V,ot,sa=(ot=class{constructor(t){f(this,"name","SmartRouter");h(this,K,[]);h(this,V,[]);g(this,K,t.routers)}add(t,e,a){if(!i(this,V))throw new Error(ht);i(this,V).push([t,e,a])}match(t,e){if(!i(this,V))throw new Error("Fatal error");const a=i(this,K),r=i(this,V),s=a.length;let o=0,n;for(;o<s;o++){const c=a[o];try{for(let l=0,d=r.length;l<d;l++)c.add(...r[l]);n=c.match(t,e)}catch(l){if(l instanceof vt)continue;throw l}this.match=c.match.bind(c),g(this,K,[c]),g(this,V,void 0);break}if(o===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(i(this,V)||i(this,K).length!==1)throw new Error("No active router has been determined yet.");return i(this,K)[0]}},K=new WeakMap,V=new WeakMap,ot),ke=Object.create(null),oa=t=>{for(const e in t)return!0;return!1},W,R,ae,me,k,q,Q,he,ia=(he=class{constructor(e,a,r){h(this,q);h(this,W);h(this,R);h(this,ae);h(this,me,0);h(this,k,ke);if(g(this,R,r||Object.create(null)),g(this,W,[]),e&&a){const s=Object.create(null);s[e]={handler:a,possibleKeys:[],score:0},g(this,W,[s])}g(this,ae,[])}insert(e,a,r){g(this,me,++Je(this,me)._);let s=this;const o=Tt(a),n=[];for(let c=0,l=o.length;c<l;c++){const d=o[c],p=o[c+1],u=Bt(d,p),v=Array.isArray(u)?u[0]:d;if(v in i(s,R)){s=i(s,R)[v],u&&n.push(u[1]);continue}i(s,R)[v]=new he,u&&(i(s,ae).push(u),n.push(u[1])),s=i(s,R)[v]}return i(s,W).push({[e]:{handler:r,possibleKeys:n.filter((c,l,d)=>d.indexOf(c)===l),score:i(this,me)}}),s}search(e,a){var p;const r=[];g(this,k,ke);let o=[this];const n=nt(a),c=[],l=n.length;let d=null;for(let u=0;u<l;u++){const v=n[u],A=u===l-1,C=[];for(let j=0,T=o.length;j<T;j++){const x=o[j],L=i(x,R)[v];L&&(g(L,k,i(x,k)),A?(i(L,R)["*"]&&b(this,q,Q).call(this,r,i(L,R)["*"],e,i(x,k)),b(this,q,Q).call(this,r,L,e,i(x,k))):C.push(L));for(let be=0,Me=i(x,ae).length;be<Me;be++){const Ge=i(x,ae)[be],N=i(x,k)===ke?{}:{...i(x,k)};if(Ge==="*"){const oe=i(x,R)["*"];oe&&(b(this,q,Q).call(this,r,oe,e,i(x,k)),g(oe,k,N),C.push(oe));continue}const[Ct,Ke,xe]=Ge;if(!v&&!(xe instanceof RegExp))continue;const B=i(x,R)[Ct];if(xe instanceof RegExp){if(d===null){d=new Array(l);let ie=a[0]==="/"?1:0;for(let ye=0;ye<l;ye++)d[ye]=ie,ie+=n[ye].length+1}const oe=a.substring(d[u]),He=xe.exec(oe);if(He){if(N[Ke]=He[0],b(this,q,Q).call(this,r,B,e,i(x,k),N),oa(i(B,R))){g(B,k,N);const ie=((p=He[0].match(/\//))==null?void 0:p.length)??0;(c[ie]||(c[ie]=[])).push(B)}continue}}(xe===!0||xe.test(v))&&(N[Ke]=v,A?(b(this,q,Q).call(this,r,B,e,N,i(x,k)),i(B,R)["*"]&&b(this,q,Q).call(this,r,i(B,R)["*"],e,N,i(x,k))):(g(B,k,N),C.push(B)))}}const z=c.shift();o=z?C.concat(z):C}return r.length>1&&r.sort((u,v)=>u.score-v.score),[r.map(({handler:u,params:v})=>[u,v])]}},W=new WeakMap,R=new WeakMap,ae=new WeakMap,me=new WeakMap,k=new WeakMap,q=new WeakSet,Q=function(e,a,r,s,o){for(let n=0,c=i(a,W).length;n<c;n++){const l=i(a,W)[n],d=l[r]||l[y],p={};if(d!==void 0&&(d.params=Object.create(null),e.push(d),s!==ke||o&&o!==ke))for(let u=0,v=d.possibleKeys.length;u<v;u++){const A=d.possibleKeys[u],C=p[d.score];d.params[A]=o!=null&&o[A]&&!C?o[A]:s[A]??(o==null?void 0:o[A]),p[d.score]=!0}}},he),re,it,na=(it=class{constructor(){f(this,"name","TrieRouter");h(this,re);g(this,re,new ia)}add(t,e,a){const r=ct(e);if(r){for(let s=0,o=r.length;s<o;s++)i(this,re).insert(t,r[s],a);return}i(this,re).insert(t,e,a)}match(t,e){return i(this,re).search(t,e)}},re=new WeakMap,it),kt=class extends Wt{constructor(t={}){super(t),this.router=t.router??new sa({routers:[new ra,new na]})}},la=t=>{const e={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...t},a=(s=>typeof s=="string"?s==="*"?()=>s:o=>s===o?o:null:typeof s=="function"?s:o=>s.includes(o)?o:null)(e.origin),r=(s=>typeof s=="function"?s:Array.isArray(s)?()=>s:()=>[])(e.allowMethods);return async function(o,n){var d;function c(p,u){o.res.headers.set(p,u)}const l=await a(o.req.header("origin")||"",o);if(l&&c("Access-Control-Allow-Origin",l),e.credentials&&c("Access-Control-Allow-Credentials","true"),(d=e.exposeHeaders)!=null&&d.length&&c("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),o.req.method==="OPTIONS"){e.origin!=="*"&&c("Vary","Origin"),e.maxAge!=null&&c("Access-Control-Max-Age",e.maxAge.toString());const p=await r(o.req.header("origin")||"",o);p.length&&c("Access-Control-Allow-Methods",p.join(","));let u=e.allowHeaders;if(!(u!=null&&u.length)){const v=o.req.header("Access-Control-Request-Headers");v&&(u=v.split(/\s*,\s*/))}return u!=null&&u.length&&(c("Access-Control-Allow-Headers",u.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await n(),e.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};const m={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},X="https://api.sixtechbrasil.com.br",ca="https://sixtechworkspace.kainow252-cmyk.workers.dev",ve=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:m.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:m.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:m.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:m.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:m.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:m.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:m.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:m.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:m.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:m.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:m.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:m.powerful,internalUrl:`${X}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:m.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:m.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:m.powerful,internalUrl:`${X}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:m.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:m.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:m.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:m.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:m.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:m.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:m.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:m.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:m.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:m.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:m.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:m.coder,internalUrl:`${X}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:m.powerful,internalUrl:`${X}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:m.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:m.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:m.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:m.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:m.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:m.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:m.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:m.powerful,internalUrl:`${X}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:m.balanced,internalUrl:`${X}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function da(t,e){try{const a=new AbortController,r=setTimeout(()=>a.abort(),8e3),s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:e,message:e}),signal:a.signal});if(clearTimeout(r),!s.ok)return null;const o=await s.json();return o.result||o.response||o.output||null}catch{return null}}async function Ze(t,e,a,r,s=1200){const o=[{role:"system",content:a},{role:"user",content:r}],n=await t.run(e,{messages:o,max_tokens:s});return n&&typeof n=="object"&&"response"in n?n.response||"":String(n||"")}async function Ue(t,e,a){const r=Date.now();let s="",o=!1,n=t.source;try{if(t.source==="hybrid"&&t.internalUrl){const c=await da(t.internalUrl,e);c?(s=c,n="internal",o=!1):(s=await Ze(a,t.model,t.system,e,1500),n="cloudflare",o=!0)}else s=await Ze(a,t.model,t.system,e,1500),n="cloudflare",o=!1}catch(c){s=`❌ Erro: ${(c==null?void 0:c.message)||"falha inesperada"}`}return{agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:n,usedFallback:o,response:s,duration:Date.now()-r}}function pa(t){const e=t.toLowerCase(),a=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(e)&&a.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(e)&&a.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(e)&&a.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(e)&&a.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(e)&&a.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(e)&&a.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(e)&&a.push("reviewer"),a.length===0&&a.push("orchestrator"),a.length>1&&a.push("orchestrator"),[...new Set(a)]}const I=new kt;I.use("*",la());I.get("/favicon.ico",t=>new Response(null,{status:204}));I.get("/api/agents",t=>t.json({total:ve.length,models:Object.keys(m).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:ve.map(e=>({id:e.id,name:e.name,emoji:e.emoji,color:e.color,desc:e.desc,source:e.source,model:e.model,category:e.category,capabilities:e.capabilities,basedOn:e.basedOn,internalUrl:e.internalUrl}))}));I.post("/api/agent/:id",async t=>{const e=ve.find(o=>o.id===t.req.param("id"));if(!e)return t.json({error:"Agente não encontrado"},404);const{message:a,task:r}=await t.req.json(),s=await Ue(e,a||r||"",t.env.AI);return t.json(s)});I.post("/api/orchestrate",async t=>{var c;const{task:e,message:a}=await t.req.json(),r=e||a||"";if(!r)return t.json({error:"task obrigatório"},400);const s=pa(r),o=s.map(l=>ve.find(d=>d.id===l)).filter(Boolean),n=[];for(const l of o){const d=l.id==="orchestrator"&&n.length>0?`Tarefa original: "${r}"

Resultados dos agentes especializados:
${n.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:r;n.push(await Ue(l,d,t.env.AI))}return t.json({task:r,agentsUsed:s,results:n,summary:((c=n[n.length-1])==null?void 0:c.response)||""})});I.post("/api/pipeline",async t=>{const{task:e,agentIds:a}=await t.req.json();if(!e||!(a!=null&&a.length))return t.json({error:"task e agentIds obrigatórios"},400);const r=a.map(l=>ve.find(d=>d.id===l)).filter(Boolean),s=[];let o=e;for(const l of r){r[r.length-1];const d=s.length===0?e:l.id==="orchestrator"&&s.length>0?`Tarefa original: "${e}"

${s.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${e}

[Contexto do ${s[s.length-1].name}]:
${s[s.length-1].response.slice(0,800)}`,p=await Ue(l,d,t.env.AI);s.push(p),o=p.response}const n=s.filter(l=>l.source==="cloudflare").length,c=s.filter(l=>l.source==="internal").length;return t.json({task:e,steps:s.length,cloudflareSteps:n,internalSteps:c,results:s,final:o})});I.post("/api/chat",async t=>{const{messages:e,model:a}=await t.req.json(),r=a||m.balanced;e.some(o=>o.role==="system")||e.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const s=await t.env.AI.run(r,{messages:e,max_tokens:2048,stream:!0});return new Response(s,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});I.get("/api/models",t=>t.json({models:Object.entries(m).map(([e,a])=>({key:e,id:a,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[e]||e}))}));I.get("/api/status",t=>t.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:X},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:ca},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:ve.length,models:Object.keys(m).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));I.get("/",t=>t.html(`<!DOCTYPE html>
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
  --sidebar-w:240px;--header-h:54px;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

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

/* ── Cards ────────────────────────────────────────────────── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:7px}
.card-title i{font-size:12px}

/* ── Grid helpers ─────────────────────────────────────────── */
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.grid-2{display:grid;grid-template-columns:1fr 2fr;gap:14px}
.grid-chat{display:grid;grid-template-columns:220px 1fr;gap:14px}
.col-span-2{grid-column:span 2}
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

/* ── Pipeline ─────────────────────────────────────────────── */
.agent-check-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer;transition:background .12s}
.agent-check-item:hover{background:rgba(255,255,255,.04)}
.agent-check-item input{accent-color:var(--primary);flex-shrink:0}
.checklist-scroll{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
.mode-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:6px 0}
.mode-label input{margin-top:3px;accent-color:var(--primary)}
.mode-title{font-size:13px;font-weight:500;color:#fff}
.mode-sub{font-size:11px;color:var(--muted)}
#progress-bar{display:none}
.progress-steps{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.progress-step{padding:4px 10px;border-radius:6px;font-size:11px;background:var(--surface);border:1px solid var(--border);color:var(--muted);transition:all .3s}
.progress-step.done{background:rgba(52,211,153,.1);border-color:#34D399;color:#34D399}
.progress-step.active-step{background:rgba(108,99,255,.15);border-color:var(--primary);color:#fff}
#results-container{display:flex;flex-direction:column;gap:12px}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;animation:slideIn .28s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.result-header{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.result-emoji{font-size:20px}
.result-name{font-size:13px;font-weight:600;color:#fff}
.result-model{font-size:10px;color:var(--muted)}
.result-body{font-size:13px;color:var(--text);line-height:1.6}
.result-footer{display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--muted)}
#results-placeholder{text-align:center;padding:60px 20px}
#results-placeholder .ph-emoji{font-size:48px;margin-bottom:12px}
#results-placeholder .ph-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:6px}
#results-placeholder .ph-sub{font-size:12px;color:var(--muted)}

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

/* ── Agents grid ──────────────────────────────────────────── */
.agents-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.agent-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;transition:transform .18s,box-shadow .18s;cursor:default}
.agent-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(108,99,255,.18)}
.agent-card-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.agent-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.agent-card-name{font-size:13px;font-weight:600;color:#fff}
.agent-card-model{font-size:10px;color:var(--muted);margin-top:1px}
.agent-card-desc{font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:10px}
.caps{display:flex;flex-wrap:wrap;gap:4px}
.cap-pill{font-size:10px;padding:2px 7px;border-radius:999px;background:rgba(108,99,255,.12);color:#a5b4fc;border:1px solid rgba(108,99,255,.25)}

/* ── Stats ────────────────────────────────────────────────── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px}
.stat-val{font-size:28px;font-weight:800;line-height:1}
.stat-label{font-size:11px;color:var(--muted);margin-top:5px}
.gtext{background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* ── Filters ──────────────────────────────────────────────── */
.filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.filter-btn{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:var(--card);color:var(--muted);transition:all .15s}
.filter-btn.active{background:var(--primary);color:#fff}
.filter-btn:hover:not(.active){background:var(--border);color:var(--text)}

/* ── Responsive ───────────────────────────────────────────── */
@media(max-width:860px){
  .grid-2,.grid-chat{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr 1fr}
  .grid-3{grid-template-columns:1fr}
  .col-span-2{grid-column:span 1}
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

/* ── Modal Agente ─────────────────────────────────────────── */
.modal-backdrop{
  display:none;position:fixed;inset:0;z-index:500;
  background:rgba(0,0,0,.72);backdrop-filter:blur(4px);
  align-items:center;justify-content:center;
}
.modal-backdrop.open{display:flex}
.modal-box{
  width:min(680px,96vw);max-height:90vh;
  background:var(--surface);border:1px solid var(--border);
  border-radius:18px;display:flex;flex-direction:column;
  overflow:hidden;animation:modalIn .22s ease;
}
@keyframes modalIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.modal-hdr{
  display:flex;align-items:center;gap:12px;
  padding:16px 20px;border-bottom:1px solid var(--border);
  flex-shrink:0;
}
.modal-agent-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.modal-agent-name{font-size:16px;font-weight:700;color:#fff}
.modal-agent-sub{font-size:11px;color:var(--muted);margin-top:2px}
.modal-close{
  margin-left:auto;background:none;border:none;color:var(--muted);
  font-size:20px;cursor:pointer;padding:4px 8px;border-radius:6px;
  line-height:1;transition:color .15s;
}
.modal-close:hover{color:#fff}
.modal-caps{display:flex;flex-wrap:wrap;gap:4px;padding:10px 20px;border-bottom:1px solid var(--border);flex-shrink:0}
.modal-msgs{
  flex:1;overflow-y:auto;
  padding:16px 20px;display:flex;flex-direction:column;gap:10px;
  min-height:200px;max-height:420px;
}
.modal-msg{border-radius:10px;padding:10px 14px;font-size:13px;line-height:1.6}
.modal-msg.ai{background:var(--card);border-left:3px solid var(--secondary)}
.modal-msg.user{background:rgba(108,99,255,.12);border-left:3px solid var(--primary)}
.modal-msg .mn{font-size:11px;font-weight:600;margin-bottom:4px}
.modal-msg .mn.ai{color:var(--secondary)}
.modal-msg .mn.user{color:var(--primary)}
.modal-typing{display:none;padding:4px 20px;font-size:11px;color:var(--muted);flex-shrink:0}
.modal-input-row{
  display:flex;gap:8px;padding:12px 20px;
  border-top:1px solid var(--border);flex-shrink:0;
}
.modal-input-row textarea{
  flex:1;height:52px;resize:none;font-size:13px;
}
.modal-send{
  height:52px;padding:0 18px;border-radius:10px;
  background:linear-gradient(135deg,var(--primary),#4f46e5);
  color:#fff;border:none;cursor:pointer;font-size:14px;
  transition:opacity .15s;
}
.modal-send:hover{opacity:.85}
.modal-send:disabled{opacity:.4;cursor:not-allowed}
.modal-quick{
  display:flex;gap:6px;padding:0 20px 10px;flex-wrap:wrap;flex-shrink:0;
}
.qbtn{
  font-size:11px;padding:4px 10px;border-radius:6px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);cursor:pointer;transition:all .15s;
}
.qbtn:hover{background:rgba(108,99,255,.15);color:#fff;border-color:var(--primary)}

/* ── Sidebar Categorias Colapsáveis ───────────────────────── */
.cat-header{
  display:flex;align-items:center;gap:9px;
  padding:9px 14px;cursor:pointer;
  font-size:12px;font-weight:600;color:var(--text);
  border-left:3px solid transparent;
  transition:all .15s;user-select:none;
}
.cat-header:hover{background:rgba(108,99,255,.08)}
.cat-header.open{color:#fff;background:rgba(108,99,255,.1);border-left-color:var(--primary)}
.cat-header .cat-icon{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.cat-header .cat-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cat-header .cat-count{font-size:9px;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:1px 5px;color:var(--muted)}
.cat-header .cat-arrow{font-size:9px;color:var(--muted);transition:transform .2s;flex-shrink:0}
.cat-header.open .cat-arrow{transform:rotate(90deg)}
.cat-agents{
  overflow:hidden;
  max-height:0;
  transition:max-height .28s ease;
}
.cat-agents.open{max-height:600px}
.cat-agent-item{
  display:flex;align-items:center;gap:7px;
  padding:7px 14px 7px 28px;
  cursor:pointer;font-size:12px;color:var(--muted);
  transition:all .12s;
  border-left:2px solid transparent;
  margin-left:3px;
}
.cat-agent-item:hover{background:rgba(255,255,255,.04);color:var(--text)}
.cat-agent-item.active{background:rgba(108,99,255,.1);color:#fff;border-left-color:var(--primary)}
.cat-agent-item .ag-emoji{font-size:14px;flex-shrink:0;width:18px;text-align:center}
.cat-agent-item .ag-name{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cat-agent-item .ag-badge{font-size:9px;padding:1px 5px;border-radius:999px}

/* ── Tab Agentes por Categoria ───────────────────────────── */
#agents-panel-header{
  display:flex;align-items:center;gap:10px;margin-bottom:16px;
}
.agents-cat-title{
  font-size:16px;font-weight:700;color:#fff;
}
.agents-cat-back{
  display:flex;align-items:center;gap:6px;
  padding:5px 10px;border-radius:8px;
  background:var(--card);border:1px solid var(--border);
  color:var(--muted);font-size:12px;cursor:pointer;
  transition:all .15s;
}
.agents-cat-back:hover{color:#fff;background:var(--border)}
</style>
</head>
<body>

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
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank" class="btn-gh">
      <i class="fab fa-github"></i> GitHub
    </a>
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
      <div class="nav-item active" onclick="showTab('pipeline',this)">
        <i class="fas fa-project-diagram"></i> Pipeline
      </div>
      <div class="nav-item" onclick="showTab('chat',this)">
        <i class="fas fa-comments"></i> Chat IA
      </div>
    </div>

    <!-- Categorias de Agentes -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">Categorias de Agentes</div>
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
      <div class="sstat"><span>Categorias</span><span class="sstat-val" id="sb-cats">24</span></div>
      <div class="sstat"><span>Uptime</span><span class="sstat-val" style="color:#34D399">99.9%</span></div>
    </div>
  </aside>

  <!-- MAIN -->
  <main>

    <!-- ══ TAB: PIPELINE ══════════════════════════════════════ -->
    <div id="tab-pipeline" class="tab-panel active">
      <div class="grid-2">

        <!-- Coluna Esquerda -->
        <div class="col-left">
          <div class="card">
            <div class="card-title"><i class="fas fa-pen-to-square" style="color:var(--primary)"></i> Tarefa</div>
            <textarea id="pipeline-task" rows="5" placeholder="Descreva o que você precisa...

Ex: Crie uma API REST em Python com FastAPI para gerenciar usuários com autenticação JWT"></textarea>
            <div style="display:flex;gap:8px;margin-top:10px">
              <button class="btn btn-primary" style="flex:1" onclick="autoRoute()">
                <i class="fas fa-wand-magic-sparkles"></i> Auto Roteamento
              </button>
              <button class="btn btn-ghost btn-icon" onclick="clearAll()"><i class="fas fa-trash"></i></button>
            </div>
          </div>

          <div class="card">
            <div class="card-title" style="justify-content:space-between">
              <span><i class="fas fa-robot" style="color:var(--secondary)"></i> Agentes</span>
              <span id="agent-count" style="font-size:11px;color:var(--muted);font-weight:400">0 selecionados</span>
            </div>
            <div id="agent-checklist" class="checklist-scroll"></div>
            <button class="btn btn-success btn-full" onclick="runPipeline()" id="run-btn">
              <i class="fas fa-play"></i> Executar Pipeline
            </button>
          </div>

          <div class="card">
            <div class="card-title"><i class="fas fa-sliders" style="color:var(--accent)"></i> Modo</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <label class="mode-label">
                <input type="radio" name="mode" value="pipeline" checked>
                <div><div class="mode-title">Pipeline Sequencial</div><div class="mode-sub">Agentes passam contexto entre si</div></div>
              </label>
              <label class="mode-label">
                <input type="radio" name="mode" value="orchestrate">
                <div><div class="mode-title">Roteamento Inteligente</div><div class="mode-sub">Auto-seleção por análise de contexto</div></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Coluna Direita -->
        <div>
          <div id="progress-bar" class="card" style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:13px;font-weight:600;color:#fff"><i class="fas fa-spin fa-circle-notch spin" style="color:var(--primary);margin-right:6px"></i>Executando...</span>
              <span id="progress-info" style="font-size:11px;color:var(--muted)"></span>
            </div>
            <div id="progress-steps" class="progress-steps"></div>
          </div>

          <div id="results-container">
            <div id="results-placeholder">
              <div class="ph-emoji">🤖</div>
              <div class="ph-title">Pronto para executar</div>
              <div class="ph-sub">Configure a tarefa, selecione agentes e clique em Executar</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ TAB: CHAT ══════════════════════════════════════════ -->
    <div id="tab-chat" class="tab-panel">
      <div class="grid-chat">

        <!-- Sidebar Chat -->
        <div class="col-left">
          <div class="card">
            <div class="card-title"><i class="fas fa-microchip" style="color:var(--primary)"></i> Modelo</div>
            <select id="chat-model"></select>
            <div style="margin-top:10px">
              <div style="font-size:11px;color:var(--muted);margin-bottom:5px">Agente Especialista</div>
              <select id="chat-agent"><option value="">Nenhum (chat livre)</option></select>
            </div>
          </div>
          <div class="card">
            <div class="card-title" style="justify-content:space-between">
              <span><i class="fas fa-clock-rotate-left" style="color:var(--secondary)"></i> Histórico</span>
              <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px" onclick="clearChat()">Limpar</button>
            </div>
            <div id="chat-history-list" style="font-size:11px;color:var(--muted);text-align:center;padding:12px 0">Nenhuma conversa</div>
          </div>
        </div>

        <!-- Chat Box -->
        <div class="chat-box">
          <div class="chat-hdr">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:16px">💬</span>
              <span style="font-weight:600;font-size:14px;color:#fff">Chat com IA</span>
            </div>
            <span id="chat-model-badge" class="badge badge-cf">Llama 3.1 8B</span>
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
    </div>

    <!-- ══ TAB: AGENTES ════════════════════════════════════════ -->
    <div id="tab-agents" class="tab-panel">
      <div id="agents-panel-header">
        <button class="agents-cat-back" onclick="showAllAgents()">
          <i class="fas fa-arrow-left"></i> Todas
        </button>
        <div>
          <div class="agents-cat-title" id="agents-cat-title">Todos os Agentes</div>
          <div style="font-size:11px;color:var(--muted)" id="agents-cat-sub">Selecione uma categoria na sidebar</div>
        </div>
        <div style="margin-left:auto">
          <input type="text" id="agent-search" placeholder="Buscar..." style="width:160px;padding:6px 10px;font-size:12px" oninput="filterAgents(this.value)">
        </div>
      </div>
      <div id="agents-grid" class="agents-grid"></div>
    </div>

    <!-- ══ TAB: STATUS ═════════════════════════════════════════ -->
    <div id="tab-status" class="tab-panel">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-val gtext" id="stat-agents">9</div><div class="stat-label">Agentes Ativos</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#22D3EE" id="stat-models">8</div><div class="stat-label">Modelos de IA</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#34D399" id="stat-repos">4</div><div class="stat-label">Repos Integrados</div></div>
        <div class="stat-card"><div class="stat-val" style="color:#F59E0B">v3.0</div><div class="stat-label">Versão</div></div>
      </div>
      <div id="status-details" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px"></div>
    </div>

  </main>
</div>

<!-- MODAL AGENTE -->
<div class="modal-backdrop" id="agent-modal" onclick="_modalBgClick(event)">
  <div class="modal-box">
    <div class="modal-hdr">
      <div class="modal-agent-icon" id="modal-icon"></div>
      <div>
        <div class="modal-agent-name" id="modal-name"></div>
        <div class="modal-agent-sub" id="modal-sub"></div>
      </div>
      <button class="modal-close" onclick="closeAgentModal()">&#x2715;</button>
    </div>
    <div class="modal-caps" id="modal-caps"></div>
    <div class="modal-msgs" id="modal-msgs"></div>
    <div class="modal-typing" id="modal-typing">
      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--secondary);animation:pulse 1s infinite;margin-right:5px"></span>
      digitando...
    </div>
    <div class="modal-quick" id="modal-quick"></div>
    <div class="modal-input-row">
      <textarea id="modal-input" placeholder="Digite sua mensagem... (Enter para enviar)"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();modalSend()}"></textarea>
      <button class="modal-send" id="modal-send-btn" onclick="modalSend()">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</div>

<script src="/static/app.js"><\/script>
<script>
const _v = '3.0'
function toggleSidebar(){
  const s = document.getElementById('sidebar')
  const o = document.getElementById('sidebar-overlay')
  s.classList.toggle('collapsed')
  o.style.display = s.classList.contains('collapsed') ? 'none' : ''
}
<\/script>
</body>
</html>`));const et=new kt,ua=Object.assign({"/src/index.tsx":I});let At=!1;for(const[,t]of Object.entries(ua))t&&(et.route("/",t),et.notFound(t.notFoundHandler),At=!0);if(!At)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{et as default};
