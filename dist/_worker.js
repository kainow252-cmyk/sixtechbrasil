var Rt=Object.defineProperty;var We=t=>{throw TypeError(t)};var Et=(t,e,r)=>e in t?Rt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var g=(t,e,r)=>Et(t,typeof e!="symbol"?e+"":e,r),Ve=(t,e,r)=>e.has(t)||We("Cannot "+r);var i=(t,e,r)=>(Ve(t,e,"read from private field"),r?r.call(t):e.get(t)),m=(t,e,r)=>e.has(t)?We("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),f=(t,e,r,a)=>(Ve(t,e,"write to private field"),a?a.call(t,r):e.set(t,r),r),x=(t,e,r)=>(Ve(t,e,"access private method"),r);var Je=(t,e,r,a)=>({set _(s){f(t,e,s,r)},get _(){return i(t,e,a)}});var Ye=(t,e,r)=>(a,s)=>{let o=-1;return n(0);async function n(d){if(d<=o)throw new Error("next() called multiple times");o=d;let c,l=!1,p;if(t[d]?(p=t[d][0][0],a.req.routeIndex=d):p=d===t.length&&s||void 0,p)try{c=await p(a,()=>n(d+1))}catch(u){if(u instanceof Error&&e)a.error=u,c=await e(u,a),l=!0;else throw u}else a.finalized===!1&&r&&(c=await r(a));return c&&(a.finalized===!1||l)&&(a.res=c),a}},St=Symbol(),jt=async(t,e=Object.create(null))=>{const{all:r=!1,dot:a=!1}=e,o=(t instanceof ut?t.raw.headers:t.headers).get("Content-Type");return o!=null&&o.startsWith("multipart/form-data")||o!=null&&o.startsWith("application/x-www-form-urlencoded")?Ot(t,{all:r,dot:a}):{}};async function Ot(t,e){const r=await t.formData();return r?Pt(r,e):{}}function Pt(t,e){const r=Object.create(null);return t.forEach((a,s)=>{e.all||s.endsWith("[]")?Dt(r,s,a):r[s]=a}),e.dot&&Object.entries(r).forEach(([a,s])=>{a.includes(".")&&(It(r,a,s),delete r[a])}),r}var Dt=(t,e,r)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(r):t[e]=[t[e],r]:e.endsWith("[]")?t[e]=[r]:t[e]=r},It=(t,e,r)=>{if(/(?:^|\.)__proto__\./.test(e))return;let a=t;const s=e.split(".");s.forEach((o,n)=>{n===s.length-1?a[o]=r:((!a[o]||typeof a[o]!="object"||Array.isArray(a[o])||a[o]instanceof File)&&(a[o]=Object.create(null)),a=a[o])})},nt=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},zt=t=>{const{groups:e,path:r}=Tt(t),a=nt(r);return Lt(a,e)},Tt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(r,a)=>{const s=`@${a}`;return e.push([s,r]),s}),{groups:e,path:t}},Lt=(t,e)=>{for(let r=e.length-1;r>=0;r--){const[a]=e[r];for(let s=t.length-1;s>=0;s--)if(t[s].includes(a)){t[s]=t[s].replace(a,e[r][1]);break}}return t},De={},Ft=(t,e)=>{if(t==="*")return"*";const r=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const a=`${t}#${e}`;return De[a]||(r[2]?De[a]=e&&e[0]!==":"&&e[0]!=="*"?[a,r[1],new RegExp(`^${r[2]}(?=/${e})`)]:[t,r[1],new RegExp(`^${r[2]}$`)]:De[a]=[t,r[1],!0]),De[a]}return null},_e=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return e(r)}catch{return r}})}},Ht=t=>_e(t,decodeURI),ct=t=>{const e=t.url,r=e.indexOf("/",e.indexOf(":")+4);let a=r;for(;a<e.length;a++){const s=e.charCodeAt(a);if(s===37){const o=e.indexOf("?",a),n=e.indexOf("#",a),d=o===-1?n===-1?void 0:n:n===-1?o:Math.min(o,n),c=e.slice(r,d);return Ht(c.includes("%25")?c.replace(/%25/g,"%2525"):c)}else if(s===63||s===35)break}return e.slice(r,a)},Bt=t=>{const e=ct(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},J=(t,e,...r)=>(r.length&&(e=J(e,...r)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),dt=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),r=[];let a="";return e.forEach(s=>{if(s!==""&&!/\:/.test(s))a+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&a===""?r.push("/"):r.push(a);const o=s.replace("?","");a+="/"+o,r.push(a)}else a+="/"+s}),r.filter((s,o,n)=>n.indexOf(s)===o)},qe=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?_e(t,pt):t):t,lt=(t,e,r)=>{let a;if(!r&&e&&!/[%+]/.test(e)){let n=t.indexOf("?",8);if(n===-1)return;for(t.startsWith(e,n+1)||(n=t.indexOf(`&${e}`,n+1));n!==-1;){const d=t.charCodeAt(n+e.length+1);if(d===61){const c=n+e.length+2,l=t.indexOf("&",c);return qe(t.slice(c,l===-1?void 0:l))}else if(d==38||isNaN(d))return"";n=t.indexOf(`&${e}`,n+1)}if(a=/[%+]/.test(t),!a)return}const s={};a??(a=/[%+]/.test(t));let o=t.indexOf("?",8);for(;o!==-1;){const n=t.indexOf("&",o+1);let d=t.indexOf("=",o);d>n&&n!==-1&&(d=-1);let c=t.slice(o+1,d===-1?n===-1?void 0:n:d);if(a&&(c=qe(c)),o=n,c==="")continue;let l;d===-1?l="":(l=t.slice(d+1,n===-1?void 0:n),a&&(l=qe(l))),r?(s[c]&&Array.isArray(s[c])||(s[c]=[]),s[c].push(l)):s[c]??(s[c]=l)}return e?s[e]:s},Mt=lt,Vt=(t,e)=>lt(t,e,!0),pt=decodeURIComponent,Qe=t=>_e(t,pt),le,S,$,ft,gt,Ne,H,tt,ut=(tt=class{constructor(t,e="/",r=[[]]){m(this,$);g(this,"raw");m(this,le);m(this,S);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});m(this,H,t=>{const{bodyCache:e,raw:r}=this,a=e[t];if(a)return a;const s=Object.keys(e)[0];return s?e[s].then(o=>(s==="json"&&(o=JSON.stringify(o)),new Response(o)[t]())):e[t]=r[t]()});this.raw=t,this.path=e,f(this,S,r),f(this,le,{})}param(t){return t?x(this,$,ft).call(this,t):x(this,$,gt).call(this)}query(t){return Mt(this.url,t)}queries(t){return Vt(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((r,a)=>{e[a]=r}),e}async parseBody(t){return jt(this,t)}json(){return i(this,H).call(this,"text").then(t=>JSON.parse(t))}text(){return i(this,H).call(this,"text")}arrayBuffer(){return i(this,H).call(this,"arrayBuffer")}bytes(){return i(this,H).call(this,"arrayBuffer").then(t=>new Uint8Array(t))}blob(){return i(this,H).call(this,"blob")}formData(){return i(this,H).call(this,"formData")}addValidatedData(t,e){i(this,le)[t]=e}valid(t){return i(this,le)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[St](){return i(this,S)}get matchedRoutes(){return i(this,S)[0].map(([[,t]])=>t)}get routePath(){return i(this,S)[0].map(([[,t]])=>t)[this.routeIndex].path}},le=new WeakMap,S=new WeakMap,$=new WeakSet,ft=function(t){const e=i(this,S)[0][this.routeIndex][1][t],r=x(this,$,Ne).call(this,e);return r&&/\%/.test(r)?Qe(r):r},gt=function(){const t={},e=Object.keys(i(this,S)[0][this.routeIndex][1]);for(const r of e){const a=x(this,$,Ne).call(this,i(this,S)[0][this.routeIndex][1][r]);a!==void 0&&(t[r]=/\%/.test(a)?Qe(a):a)}return t},Ne=function(t){return i(this,S)[1]?i(this,S)[1][t]:t},H=new WeakMap,tt),qt={Stringify:1},ht=async(t,e,r,a,s)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const o=t.callbacks;return o!=null&&o.length?(s?s[0]+=t:s=[t],Promise.all(o.map(d=>d({phase:e,buffer:s,context:a}))).then(d=>Promise.all(d.filter(Boolean).map(c=>ht(c,e,!1,a,s))).then(()=>s[0]))):Promise.resolve(t)},$t="text/plain; charset=UTF-8",$e=(t,e)=>({"Content-Type":t,...e}),we=(t,e)=>new Response(t,e),Re,Ee,B,pe,M,E,Se,ue,fe,Z,je,Oe,_,ce,rt,Nt=(rt=class{constructor(t,e){m(this,_);m(this,Re);m(this,Ee);g(this,"env",{});m(this,B);g(this,"finalized",!1);g(this,"error");m(this,pe);m(this,M);m(this,E);m(this,Se);m(this,ue);m(this,fe);m(this,Z);m(this,je);m(this,Oe);g(this,"render",(...t)=>(i(this,ue)??f(this,ue,e=>this.html(e)),i(this,ue).call(this,...t)));g(this,"setLayout",t=>f(this,Se,t));g(this,"getLayout",()=>i(this,Se));g(this,"setRenderer",t=>{f(this,ue,t)});g(this,"header",(t,e,r)=>{this.finalized&&f(this,E,we(i(this,E).body,i(this,E)));const a=i(this,E)?i(this,E).headers:i(this,Z)??f(this,Z,new Headers);e===void 0?a.delete(t):r!=null&&r.append?a.append(t,e):a.set(t,e)});g(this,"status",t=>{f(this,pe,t)});g(this,"set",(t,e)=>{i(this,B)??f(this,B,new Map),i(this,B).set(t,e)});g(this,"get",t=>i(this,B)?i(this,B).get(t):void 0);g(this,"newResponse",(...t)=>x(this,_,ce).call(this,...t));g(this,"body",(t,e,r)=>x(this,_,ce).call(this,t,e,r));g(this,"text",(t,e,r)=>!i(this,Z)&&!i(this,pe)&&!e&&!r&&!this.finalized?new Response(t):x(this,_,ce).call(this,t,e,$e($t,r)));g(this,"json",(t,e,r)=>x(this,_,ce).call(this,JSON.stringify(t),e,$e("application/json",r)));g(this,"html",(t,e,r)=>{const a=s=>x(this,_,ce).call(this,s,e,$e("text/html; charset=UTF-8",r));return typeof t=="object"?ht(t,qt.Stringify,!1,{}).then(a):a(t)});g(this,"redirect",(t,e)=>{const r=String(t);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,e??302)});g(this,"notFound",()=>(i(this,fe)??f(this,fe,()=>we()),i(this,fe).call(this,this)));f(this,Re,t),e&&(f(this,M,e.executionCtx),this.env=e.env,f(this,fe,e.notFoundHandler),f(this,Oe,e.path),f(this,je,e.matchResult))}get req(){return i(this,Ee)??f(this,Ee,new ut(i(this,Re),i(this,Oe),i(this,je))),i(this,Ee)}get event(){if(i(this,M)&&"respondWith"in i(this,M))return i(this,M);throw Error("This context has no FetchEvent")}get executionCtx(){if(i(this,M))return i(this,M);throw Error("This context has no ExecutionContext")}get res(){return i(this,E)||f(this,E,we(null,{headers:i(this,Z)??f(this,Z,new Headers)}))}set res(t){if(i(this,E)&&t){t=we(t.body,t);for(const[e,r]of i(this,E).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const a=i(this,E).headers.getSetCookie();t.headers.delete("set-cookie");for(const s of a)t.headers.append("set-cookie",s)}else t.headers.set(e,r)}f(this,E,t),this.finalized=!0}get var(){return i(this,B)?Object.fromEntries(i(this,B)):{}}},Re=new WeakMap,Ee=new WeakMap,B=new WeakMap,pe=new WeakMap,M=new WeakMap,E=new WeakMap,Se=new WeakMap,ue=new WeakMap,fe=new WeakMap,Z=new WeakMap,je=new WeakMap,Oe=new WeakMap,_=new WeakSet,ce=function(t,e,r){const a=i(this,E)?new Headers(i(this,E).headers):i(this,Z)??new Headers;if(typeof e=="object"&&"headers"in e){const o=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[n,d]of o)n.toLowerCase()==="set-cookie"?a.append(n,d):a.set(n,d)}if(r)for(const[o,n]of Object.entries(r))if(typeof n=="string")a.set(o,n);else{a.delete(o);for(const d of n)a.append(o,d)}const s=typeof e=="number"?e:(e==null?void 0:e.status)??i(this,pe);return we(t,{status:s,headers:a})},rt),y="ALL",_t="all",Ut=["get","post","put","delete","options","patch"],mt="Can not add a route since the matcher is already built.",bt=class extends Error{},Gt="__COMPOSED_HANDLER",Kt=t=>t.text("404 Not Found",404),Xe=(t,e)=>{if("getResponse"in t){const r=t.getResponse();return e.newResponse(r.body,r)}return console.error(t),e.text("Internal Server Error",500)},O,w,xt,P,Y,Ie,ze,ge,Wt=(ge=class{constructor(e={}){m(this,w);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");m(this,O,"/");g(this,"routes",[]);m(this,P,Kt);g(this,"errorHandler",Xe);g(this,"onError",e=>(this.errorHandler=e,this));g(this,"notFound",e=>(f(this,P,e),this));g(this,"fetch",(e,...r)=>x(this,w,ze).call(this,e,r[1],r[0],e.method));g(this,"request",(e,r,a,s)=>e instanceof Request?this.fetch(r?new Request(e,r):e,a,s):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${J("/",e)}`,r),a,s)));g(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(x(this,w,ze).call(this,e.request,e,void 0,e.request.method))})});[...Ut,_t].forEach(o=>{this[o]=(n,...d)=>(typeof n=="string"?f(this,O,n):x(this,w,Y).call(this,o,i(this,O),n),d.forEach(c=>{x(this,w,Y).call(this,o,i(this,O),c)}),this)}),this.on=(o,n,...d)=>{for(const c of[n].flat()){f(this,O,c);for(const l of[o].flat())d.map(p=>{x(this,w,Y).call(this,l.toUpperCase(),i(this,O),p)})}return this},this.use=(o,...n)=>(typeof o=="string"?f(this,O,o):(f(this,O,"*"),n.unshift(o)),n.forEach(d=>{x(this,w,Y).call(this,y,i(this,O),d)}),this);const{strict:a,...s}=e;Object.assign(this,s),this.getPath=a??!0?e.getPath??ct:Bt}route(e,r){const a=this.basePath(e);return r.routes.map(s=>{var n;let o;r.errorHandler===Xe?o=s.handler:(o=async(d,c)=>(await Ye([],r.errorHandler)(d,()=>s.handler(d,c))).res,o[Gt]=s.handler),x(n=a,w,Y).call(n,s.method,s.path,o,s.basePath)}),this}basePath(e){const r=x(this,w,xt).call(this);return r._basePath=J(this._basePath,e),r}mount(e,r,a){let s,o;a&&(typeof a=="function"?o=a:(o=a.optionHandler,a.replaceRequest===!1?s=c=>c:s=a.replaceRequest));const n=o?c=>{const l=o(c);return Array.isArray(l)?l:[l]}:c=>{let l;try{l=c.executionCtx}catch{}return[c.env,l]};s||(s=(()=>{const c=J(this._basePath,e),l=c==="/"?0:c.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(l)||"/",new Request(u,p)}})());const d=async(c,l)=>{const p=await r(s(c.req.raw),...n(c));if(p)return p;await l()};return x(this,w,Y).call(this,y,J(e,"*"),d),this}},O=new WeakMap,w=new WeakSet,xt=function(){const e=new ge({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,f(e,P,i(this,P)),e.routes=this.routes,e},P=new WeakMap,Y=function(e,r,a,s){e=e.toUpperCase(),r=J(this._basePath,r);const o={basePath:s!==void 0?J(this._basePath,s):this._basePath,path:r,method:e,handler:a};this.router.add(e,r,[a,o]),this.routes.push(o)},Ie=function(e,r){if(e instanceof Error)return this.errorHandler(e,r);throw e},ze=function(e,r,a,s){if(s==="HEAD")return(async()=>new Response(null,await x(this,w,ze).call(this,e,r,a,"GET")))();const o=this.getPath(e,{env:a}),n=this.router.match(s,o),d=new Nt(e,{path:o,matchResult:n,env:a,executionCtx:r,notFoundHandler:i(this,P)});if(n[0].length===1){let l;try{l=n[0][0][0][0](d,async()=>{d.res=await i(this,P).call(this,d)})}catch(p){return x(this,w,Ie).call(this,p,d)}return l instanceof Promise?l.then(p=>p||(d.finalized?d.res:i(this,P).call(this,d))).catch(p=>x(this,w,Ie).call(this,p,d)):l??i(this,P).call(this,d)}const c=Ye(n[0],this.errorHandler,i(this,P));return(async()=>{try{const l=await c(d);if(!l.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return x(this,w,Ie).call(this,l,d)}})()},ge),vt=[];function Jt(t,e){const r=this.buildAllMatchers(),a=(s,o)=>{const n=r[s]||r[y],d=n[2][o];if(d)return d;const c=o.match(n[0]);if(!c)return[[],vt];const l=c.indexOf("",1);return[n[1][l],c]};return this.match=a,a(t,e)}var Le="[^/]+",Ae=".*",Ce="(?:|/.*)",de=Symbol(),Yt=new Set(".\\+*[^]$()");function Qt(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Ae||t===Ce?1:e===Ae||e===Ce?-1:t===Le?1:e===Le?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var ee,te,D,se,Xt=(se=class{constructor(){m(this,ee);m(this,te);m(this,D,Object.create(null))}insert(e,r,a,s,o){if(e.length===0){if(i(this,ee)!==void 0)throw de;if(o)return;f(this,ee,r);return}const[n,...d]=e,c=n==="*"?d.length===0?["","",Ae]:["","",Le]:n==="/*"?["","",Ce]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let l;if(c){const p=c[1];let u=c[2]||Le;if(p&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw de;if(l=i(this,D)[u],!l){if(Object.keys(i(this,D)).some(b=>b!==Ae&&b!==Ce))throw de;if(o)return;l=i(this,D)[u]=new se,p!==""&&f(l,te,s.varIndex++)}!o&&p!==""&&a.push([p,i(l,te)])}else if(l=i(this,D)[n],!l){if(Object.keys(i(this,D)).some(p=>p.length>1&&p!==Ae&&p!==Ce))throw de;if(o)return;l=i(this,D)[n]=new se}l.insert(d,r,a,s,o)}buildRegExpStr(){const r=Object.keys(i(this,D)).sort(Qt).map(a=>{const s=i(this,D)[a];return(typeof i(s,te)=="number"?`(${a})@${i(s,te)}`:Yt.has(a)?`\\${a}`:a)+s.buildRegExpStr()});return typeof i(this,ee)=="number"&&r.unshift(`#${i(this,ee)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},ee=new WeakMap,te=new WeakMap,D=new WeakMap,se),Fe,Pe,at,Zt=(at=class{constructor(){m(this,Fe,{varIndex:0});m(this,Pe,new Xt)}insert(t,e,r){const a=[],s=[];for(let n=0;;){let d=!1;if(t=t.replace(/\{[^}]+\}/g,c=>{const l=`@\\${n}`;return s[n]=[l,c],n++,d=!0,l}),!d)break}const o=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=s.length-1;n>=0;n--){const[d]=s[n];for(let c=o.length-1;c>=0;c--)if(o[c].indexOf(d)!==-1){o[c]=o[c].replace(d,s[n][1]);break}}return i(this,Pe).insert(o,e,a,i(this,Fe),r),a}buildRegExp(){let t=i(this,Pe).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const r=[],a=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,o,n)=>o!==void 0?(r[++e]=Number(o),"$()"):(n!==void 0&&(a[Number(n)]=++e),"")),[new RegExp(`^${t}`),r,a]}},Fe=new WeakMap,Pe=new WeakMap,at),er=[/^$/,[],Object.create(null)],Te=Object.create(null);function yt(t){return Te[t]??(Te[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function tr(){Te=Object.create(null)}function rr(t){var l;const e=new Zt,r=[];if(t.length===0)return er;const a=t.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[b,A])=>p?1:b?-1:u.length-A.length),s=Object.create(null);for(let p=0,u=-1,b=a.length;p<b;p++){const[A,C,T]=a[p];A?s[C]=[T.map(([z])=>[z,Object.create(null)]),vt]:u++;let j;try{j=e.insert(C,u,A)}catch(z){throw z===de?new bt(C):z}A||(r[u]=T.map(([z,v])=>{const L=Object.create(null);for(v-=1;v>=0;v--){const[xe,Be]=j[v];L[xe]=Be}return[z,L]}))}const[o,n,d]=e.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let b=0,A=r[p].length;b<A;b++){const C=(l=r[p][b])==null?void 0:l[1];if(!C)continue;const T=Object.keys(C);for(let j=0,z=T.length;j<z;j++)C[T[j]]=d[C[T[j]]]}const c=[];for(const p in n)c[p]=r[n[p]];return[o,c,s]}function ne(t,e){if(t){for(const r of Object.keys(t).sort((a,s)=>s.length-a.length))if(yt(r).test(e))return[...t[r]]}}var U,G,He,wt,st,ar=(st=class{constructor(){m(this,He);g(this,"name","RegExpRouter");m(this,U);m(this,G);g(this,"match",Jt);f(this,U,{[y]:Object.create(null)}),f(this,G,{[y]:Object.create(null)})}add(t,e,r){var d;const a=i(this,U),s=i(this,G);if(!a||!s)throw new Error(mt);a[t]||[a,s].forEach(c=>{c[t]=Object.create(null),Object.keys(c[y]).forEach(l=>{c[t][l]=[...c[y][l]]})}),e==="/*"&&(e="*");const o=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const c=yt(e);t===y?Object.keys(a).forEach(l=>{var p;(p=a[l])[e]||(p[e]=ne(a[l],e)||ne(a[y],e)||[])}):(d=a[t])[e]||(d[e]=ne(a[t],e)||ne(a[y],e)||[]),Object.keys(a).forEach(l=>{(t===y||t===l)&&Object.keys(a[l]).forEach(p=>{c.test(p)&&a[l][p].push([r,o])})}),Object.keys(s).forEach(l=>{(t===y||t===l)&&Object.keys(s[l]).forEach(p=>c.test(p)&&s[l][p].push([r,o]))});return}const n=dt(e)||[e];for(let c=0,l=n.length;c<l;c++){const p=n[c];Object.keys(s).forEach(u=>{var b;(t===y||t===u)&&((b=s[u])[p]||(b[p]=[...ne(a[u],p)||ne(a[y],p)||[]]),s[u][p].push([r,o-l+c+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(i(this,G)).concat(Object.keys(i(this,U))).forEach(e=>{t[e]||(t[e]=x(this,He,wt).call(this,e))}),f(this,U,f(this,G,void 0)),tr(),t}},U=new WeakMap,G=new WeakMap,He=new WeakSet,wt=function(t){const e=[];let r=t===y;return[i(this,U),i(this,G)].forEach(a=>{const s=a[t]?Object.keys(a[t]).map(o=>[o,a[t][o]]):[];s.length!==0?(r||(r=!0),e.push(...s)):t!==y&&e.push(...Object.keys(a[y]).map(o=>[o,a[y][o]]))}),r?rr(e):null},st),K,V,ot,sr=(ot=class{constructor(t){g(this,"name","SmartRouter");m(this,K,[]);m(this,V,[]);f(this,K,t.routers)}add(t,e,r){if(!i(this,V))throw new Error(mt);i(this,V).push([t,e,r])}match(t,e){if(!i(this,V))throw new Error("Fatal error");const r=i(this,K),a=i(this,V),s=r.length;let o=0,n;for(;o<s;o++){const d=r[o];try{for(let c=0,l=a.length;c<l;c++)d.add(...a[c]);n=d.match(t,e)}catch(c){if(c instanceof bt)continue;throw c}this.match=d.match.bind(d),f(this,K,[d]),f(this,V,void 0);break}if(o===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(i(this,V)||i(this,K).length!==1)throw new Error("No active router has been determined yet.");return i(this,K)[0]}},K=new WeakMap,V=new WeakMap,ot),ke=Object.create(null),or=t=>{for(const e in t)return!0;return!1},W,R,re,he,k,q,Q,me,ir=(me=class{constructor(e,r,a){m(this,q);m(this,W);m(this,R);m(this,re);m(this,he,0);m(this,k,ke);if(f(this,R,a||Object.create(null)),f(this,W,[]),e&&r){const s=Object.create(null);s[e]={handler:r,possibleKeys:[],score:0},f(this,W,[s])}f(this,re,[])}insert(e,r,a){f(this,he,++Je(this,he)._);let s=this;const o=zt(r),n=[];for(let d=0,c=o.length;d<c;d++){const l=o[d],p=o[d+1],u=Ft(l,p),b=Array.isArray(u)?u[0]:l;if(b in i(s,R)){s=i(s,R)[b],u&&n.push(u[1]);continue}i(s,R)[b]=new me,u&&(i(s,re).push(u),n.push(u[1])),s=i(s,R)[b]}return i(s,W).push({[e]:{handler:a,possibleKeys:n.filter((d,c,l)=>l.indexOf(d)===c),score:i(this,he)}}),s}search(e,r){var p;const a=[];f(this,k,ke);let o=[this];const n=nt(r),d=[],c=n.length;let l=null;for(let u=0;u<c;u++){const b=n[u],A=u===c-1,C=[];for(let j=0,z=o.length;j<z;j++){const v=o[j],L=i(v,R)[b];L&&(f(L,k,i(v,k)),A?(i(L,R)["*"]&&x(this,q,Q).call(this,a,i(L,R)["*"],e,i(v,k)),x(this,q,Q).call(this,a,L,e,i(v,k))):C.push(L));for(let xe=0,Be=i(v,re).length;xe<Be;xe++){const Ge=i(v,re)[xe],N=i(v,k)===ke?{}:{...i(v,k)};if(Ge==="*"){const oe=i(v,R)["*"];oe&&(x(this,q,Q).call(this,a,oe,e,i(v,k)),f(oe,k,N),C.push(oe));continue}const[Ct,Ke,ve]=Ge;if(!b&&!(ve instanceof RegExp))continue;const F=i(v,R)[Ct];if(ve instanceof RegExp){if(l===null){l=new Array(c);let ie=r[0]==="/"?1:0;for(let ye=0;ye<c;ye++)l[ye]=ie,ie+=n[ye].length+1}const oe=r.substring(l[u]),Me=ve.exec(oe);if(Me){if(N[Ke]=Me[0],x(this,q,Q).call(this,a,F,e,i(v,k),N),or(i(F,R))){f(F,k,N);const ie=((p=Me[0].match(/\//))==null?void 0:p.length)??0;(d[ie]||(d[ie]=[])).push(F)}continue}}(ve===!0||ve.test(b))&&(N[Ke]=b,A?(x(this,q,Q).call(this,a,F,e,N,i(v,k)),i(F,R)["*"]&&x(this,q,Q).call(this,a,i(F,R)["*"],e,N,i(v,k))):(f(F,k,N),C.push(F)))}}const T=d.shift();o=T?C.concat(T):C}return a.length>1&&a.sort((u,b)=>u.score-b.score),[a.map(({handler:u,params:b})=>[u,b])]}},W=new WeakMap,R=new WeakMap,re=new WeakMap,he=new WeakMap,k=new WeakMap,q=new WeakSet,Q=function(e,r,a,s,o){for(let n=0,d=i(r,W).length;n<d;n++){const c=i(r,W)[n],l=c[a]||c[y],p={};if(l!==void 0&&(l.params=Object.create(null),e.push(l),s!==ke||o&&o!==ke))for(let u=0,b=l.possibleKeys.length;u<b;u++){const A=l.possibleKeys[u],C=p[l.score];l.params[A]=o!=null&&o[A]&&!C?o[A]:s[A]??(o==null?void 0:o[A]),p[l.score]=!0}}},me),ae,it,nr=(it=class{constructor(){g(this,"name","TrieRouter");m(this,ae);f(this,ae,new ir)}add(t,e,r){const a=dt(e);if(a){for(let s=0,o=a.length;s<o;s++)i(this,ae).insert(t,a[s],r);return}i(this,ae).insert(t,e,r)}match(t,e){return i(this,ae).search(t,e)}},ae=new WeakMap,it),kt=class extends Wt{constructor(t={}){super(t),this.router=t.router??new sr({routers:[new ar,new nr]})}},cr=t=>{const e={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...t},r=(s=>typeof s=="string"?s==="*"?()=>s:o=>s===o?o:null:typeof s=="function"?s:o=>s.includes(o)?o:null)(e.origin),a=(s=>typeof s=="function"?s:Array.isArray(s)?()=>s:()=>[])(e.allowMethods);return async function(o,n){var l;function d(p,u){o.res.headers.set(p,u)}const c=await r(o.req.header("origin")||"",o);if(c&&d("Access-Control-Allow-Origin",c),e.credentials&&d("Access-Control-Allow-Credentials","true"),(l=e.exposeHeaders)!=null&&l.length&&d("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),o.req.method==="OPTIONS"){e.origin!=="*"&&d("Vary","Origin"),e.maxAge!=null&&d("Access-Control-Max-Age",e.maxAge.toString());const p=await a(o.req.header("origin")||"",o);p.length&&d("Access-Control-Allow-Methods",p.join(","));let u=e.allowHeaders;if(!(u!=null&&u.length)){const b=o.req.header("Access-Control-Request-Headers");b&&(u=b.split(/\s*,\s*/))}return u!=null&&u.length&&(d("Access-Control-Allow-Headers",u.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await n(),e.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};const h={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},X="https://api.sixtechbrasil.com.br",dr="https://sixtechworkspace.kainow252-cmyk.workers.dev",be=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:h.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:h.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:h.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:h.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:h.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:h.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:h.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:h.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:h.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:h.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:h.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:h.coder,internalUrl:`${X}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:h.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:h.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:h.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:h.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:h.balanced,internalUrl:`${X}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function lr(t,e){try{const r=new AbortController,a=setTimeout(()=>r.abort(),8e3),s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:e,message:e}),signal:r.signal});if(clearTimeout(a),!s.ok)return null;const o=await s.json();return o.result||o.response||o.output||null}catch{return null}}async function Ze(t,e,r,a,s=1200){const o=[{role:"system",content:r},{role:"user",content:a}],n=await t.run(e,{messages:o,max_tokens:s});return n&&typeof n=="object"&&"response"in n?n.response||"":String(n||"")}async function Ue(t,e,r){const a=Date.now();let s="",o=!1,n=t.source;try{if(t.source==="hybrid"&&t.internalUrl){const d=await lr(t.internalUrl,e);d?(s=d,n="internal",o=!1):(s=await Ze(r,t.model,t.system,e,1500),n="cloudflare",o=!0)}else s=await Ze(r,t.model,t.system,e,1500),n="cloudflare",o=!1}catch(d){s=`❌ Erro: ${(d==null?void 0:d.message)||"falha inesperada"}`}return{agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:n,usedFallback:o,response:s,duration:Date.now()-a}}function pr(t){const e=t.toLowerCase(),r=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(e)&&r.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(e)&&r.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(e)&&r.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(e)&&r.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(e)&&r.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(e)&&r.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(e)&&r.push("reviewer"),r.length===0&&r.push("orchestrator"),r.length>1&&r.push("orchestrator"),[...new Set(r)]}const I=new kt;I.use("*",cr());I.get("/favicon.ico",t=>new Response(null,{status:204}));I.get("/api/agents",t=>t.json({total:be.length,models:Object.keys(h).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:be.map(e=>({id:e.id,name:e.name,emoji:e.emoji,color:e.color,desc:e.desc,source:e.source,model:e.model,category:e.category,capabilities:e.capabilities,basedOn:e.basedOn,internalUrl:e.internalUrl}))}));I.post("/api/agent/:id",async t=>{const e=be.find(o=>o.id===t.req.param("id"));if(!e)return t.json({error:"Agente não encontrado"},404);const{message:r,task:a}=await t.req.json(),s=await Ue(e,r||a||"",t.env.AI);return t.json(s)});I.post("/api/orchestrate",async t=>{var d;const{task:e,message:r}=await t.req.json(),a=e||r||"";if(!a)return t.json({error:"task obrigatório"},400);const s=pr(a),o=s.map(c=>be.find(l=>l.id===c)).filter(Boolean),n=[];for(const c of o){const l=c.id==="orchestrator"&&n.length>0?`Tarefa original: "${a}"

Resultados dos agentes especializados:
${n.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:a;n.push(await Ue(c,l,t.env.AI))}return t.json({task:a,agentsUsed:s,results:n,summary:((d=n[n.length-1])==null?void 0:d.response)||""})});I.post("/api/pipeline",async t=>{const{task:e,agentIds:r}=await t.req.json();if(!e||!(r!=null&&r.length))return t.json({error:"task e agentIds obrigatórios"},400);const a=r.map(c=>be.find(l=>l.id===c)).filter(Boolean),s=[];let o=e;for(const c of a){a[a.length-1];const l=s.length===0?e:c.id==="orchestrator"&&s.length>0?`Tarefa original: "${e}"

${s.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${e}

[Contexto do ${s[s.length-1].name}]:
${s[s.length-1].response.slice(0,800)}`,p=await Ue(c,l,t.env.AI);s.push(p),o=p.response}const n=s.filter(c=>c.source==="cloudflare").length,d=s.filter(c=>c.source==="internal").length;return t.json({task:e,steps:s.length,cloudflareSteps:n,internalSteps:d,results:s,final:o})});I.post("/api/chat",async t=>{const{messages:e,model:r}=await t.req.json(),a=r||h.balanced;e.some(o=>o.role==="system")||e.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const s=await t.env.AI.run(a,{messages:e,max_tokens:2048,stream:!0});return new Response(s,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});I.get("/api/models",t=>t.json({models:Object.entries(h).map(([e,r])=>({key:e,id:r,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[e]||e}))}));I.get("/api/status",t=>t.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:X},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:dr},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:be.length,models:Object.keys(h).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));I.get("/",t=>t.html(`<!DOCTYPE html>
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
      <div class="grid-chat">
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
            <button class="fc-clear-btn" onclick="fcClear()" title="Limpar conversa">
              <i class="fas fa-trash-alt"></i> Limpar
            </button>
            <button class="fc-back-btn" onclick="showHome(null)" title="Voltar ao início">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>

        <!-- Corpo do chat -->
        <div class="fc-body">

          <!-- Mensagens -->
          <div id="fc-msgs" class="fc-msgs"></div>

          <!-- Indicador de digitação -->
          <div id="fc-typing" class="fc-typing">
            <span class="typing-dot"></span>
            <span>Agente digitando...</span>
          </div>

          <!-- Perguntas rápidas -->
          <div id="fc-quick" class="fc-quick"></div>

          <!-- Input row -->
          <div class="fc-input-row">
            <textarea id="fc-input"
              placeholder="Digite sua mensagem... (Enter para enviar)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();fcSend()}"></textarea>
            <button id="fc-send-btn" onclick="fcSend()" title="Enviar">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>

        </div><!-- /.fc-body -->
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
</html>`));const et=new kt,ur=Object.assign({"/src/index.tsx":I});let At=!1;for(const[,t]of Object.entries(ur))t&&(et.route("/",t),et.notFound(t.notFoundHandler),At=!0);if(!At)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{et as default};
