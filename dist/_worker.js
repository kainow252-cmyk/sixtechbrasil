var Ot=Object.defineProperty;var Ye=t=>{throw TypeError(t)};var Pt=(t,e,r)=>e in t?Ot(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var f=(t,e,r)=>Pt(t,typeof e!="symbol"?e+"":e,r),Ne=(t,e,r)=>e.has(t)||Ye("Cannot "+r);var i=(t,e,r)=>(Ne(t,e,"read from private field"),r?r.call(t):e.get(t)),m=(t,e,r)=>e.has(t)?Ye("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),g=(t,e,r,a)=>(Ne(t,e,"write to private field"),a?a.call(t,r):e.set(t,r),r),b=(t,e,r)=>(Ne(t,e,"access private method"),r);var Qe=(t,e,r,a)=>({set _(o){g(t,e,o,r)},get _(){return i(t,e,a)}});var Xe=(t,e,r)=>(a,o)=>{let s=-1;return n(0);async function n(l){if(l<=s)throw new Error("next() called multiple times");s=l;let c,d=!1,p;if(t[l]?(p=t[l][0][0],a.req.routeIndex=l):p=l===t.length&&o||void 0,p)try{c=await p(a,()=>n(l+1))}catch(u){if(u instanceof Error&&e)a.error=u,c=await e(u,a),d=!0;else throw u}else a.finalized===!1&&r&&(c=await r(a));return c&&(a.finalized===!1||d)&&(a.res=c),a}},zt=Symbol(),Dt=async(t,e=Object.create(null))=>{const{all:r=!1,dot:a=!1}=e,s=(t instanceof ht?t.raw.headers:t.headers).get("Content-Type");return s!=null&&s.startsWith("multipart/form-data")||s!=null&&s.startsWith("application/x-www-form-urlencoded")?It(t,{all:r,dot:a}):{}};async function It(t,e){const r=await t.formData();return r?Tt(r,e):{}}function Tt(t,e){const r=Object.create(null);return t.forEach((a,o)=>{e.all||o.endsWith("[]")?Lt(r,o,a):r[o]=a}),e.dot&&Object.entries(r).forEach(([a,o])=>{a.includes(".")&&(Ht(r,a,o),delete r[a])}),r}var Lt=(t,e,r)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(r):t[e]=[t[e],r]:e.endsWith("[]")?t[e]=[r]:t[e]=r},Ht=(t,e,r)=>{if(/(?:^|\.)__proto__\./.test(e))return;let a=t;const o=e.split(".");o.forEach((s,n)=>{n===o.length-1?a[s]=r:((!a[s]||typeof a[s]!="object"||Array.isArray(a[s])||a[s]instanceof File)&&(a[s]=Object.create(null)),a=a[s])})},dt=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Ft=t=>{const{groups:e,path:r}=Mt(t),a=dt(r);return Bt(a,e)},Mt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(r,a)=>{const o=`@${a}`;return e.push([o,r]),o}),{groups:e,path:t}},Bt=(t,e)=>{for(let r=e.length-1;r>=0;r--){const[a]=e[r];for(let o=t.length-1;o>=0;o--)if(t[o].includes(a)){t[o]=t[o].replace(a,e[r][1]);break}}return t},ze={},Vt=(t,e)=>{if(t==="*")return"*";const r=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const a=`${t}#${e}`;return ze[a]||(r[2]?ze[a]=e&&e[0]!==":"&&e[0]!=="*"?[a,r[1],new RegExp(`^${r[2]}(?=/${e})`)]:[t,r[1],new RegExp(`^${r[2]}$`)]:ze[a]=[t,r[1],!0]),ze[a]}return null},Ge=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return e(r)}catch{return r}})}},qt=t=>Ge(t,decodeURI),pt=t=>{const e=t.url,r=e.indexOf("/",e.indexOf(":")+4);let a=r;for(;a<e.length;a++){const o=e.charCodeAt(a);if(o===37){const s=e.indexOf("?",a),n=e.indexOf("#",a),l=s===-1?n===-1?void 0:n:n===-1?s:Math.min(s,n),c=e.slice(r,l);return qt(c.includes("%25")?c.replace(/%25/g,"%2525"):c)}else if(o===63||o===35)break}return e.slice(r,a)},Nt=t=>{const e=pt(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},J=(t,e,...r)=>(r.length&&(e=J(e,...r)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),ut=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),r=[];let a="";return e.forEach(o=>{if(o!==""&&!/\:/.test(o))a+="/"+o;else if(/\:/.test(o))if(/\?/.test(o)){r.length===0&&a===""?r.push("/"):r.push(a);const s=o.replace("?","");a+="/"+s,r.push(a)}else a+="/"+o}),r.filter((o,s,n)=>n.indexOf(o)===s)},$e=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?Ge(t,ft):t):t,gt=(t,e,r)=>{let a;if(!r&&e&&!/[%+]/.test(e)){let n=t.indexOf("?",8);if(n===-1)return;for(t.startsWith(e,n+1)||(n=t.indexOf(`&${e}`,n+1));n!==-1;){const l=t.charCodeAt(n+e.length+1);if(l===61){const c=n+e.length+2,d=t.indexOf("&",c);return $e(t.slice(c,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";n=t.indexOf(`&${e}`,n+1)}if(a=/[%+]/.test(t),!a)return}const o={};a??(a=/[%+]/.test(t));let s=t.indexOf("?",8);for(;s!==-1;){const n=t.indexOf("&",s+1);let l=t.indexOf("=",s);l>n&&n!==-1&&(l=-1);let c=t.slice(s+1,l===-1?n===-1?void 0:n:l);if(a&&(c=$e(c)),s=n,c==="")continue;let d;l===-1?d="":(d=t.slice(l+1,n===-1?void 0:n),a&&(d=$e(d))),r?(o[c]&&Array.isArray(o[c])||(o[c]=[]),o[c].push(d)):o[c]??(o[c]=d)}return e?o[e]:o},$t=gt,_t=(t,e)=>gt(t,e,!0),ft=decodeURIComponent,Ze=t=>Ge(t,ft),de,j,N,mt,xt,Ue,F,ot,ht=(ot=class{constructor(t,e="/",r=[[]]){m(this,N);f(this,"raw");m(this,de);m(this,j);f(this,"routeIndex",0);f(this,"path");f(this,"bodyCache",{});m(this,F,t=>{const{bodyCache:e,raw:r}=this,a=e[t];if(a)return a;const o=Object.keys(e)[0];return o?e[o].then(s=>(o==="json"&&(s=JSON.stringify(s)),new Response(s)[t]())):e[t]=r[t]()});this.raw=t,this.path=e,g(this,j,r),g(this,de,{})}param(t){return t?b(this,N,mt).call(this,t):b(this,N,xt).call(this)}query(t){return $t(this.url,t)}queries(t){return _t(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((r,a)=>{e[a]=r}),e}async parseBody(t){return Dt(this,t)}json(){return i(this,F).call(this,"text").then(t=>JSON.parse(t))}text(){return i(this,F).call(this,"text")}arrayBuffer(){return i(this,F).call(this,"arrayBuffer")}bytes(){return i(this,F).call(this,"arrayBuffer").then(t=>new Uint8Array(t))}blob(){return i(this,F).call(this,"blob")}formData(){return i(this,F).call(this,"formData")}addValidatedData(t,e){i(this,de)[t]=e}valid(t){return i(this,de)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[zt](){return i(this,j)}get matchedRoutes(){return i(this,j)[0].map(([[,t]])=>t)}get routePath(){return i(this,j)[0].map(([[,t]])=>t)[this.routeIndex].path}},de=new WeakMap,j=new WeakMap,N=new WeakSet,mt=function(t){const e=i(this,j)[0][this.routeIndex][1][t],r=b(this,N,Ue).call(this,e);return r&&/\%/.test(r)?Ze(r):r},xt=function(){const t={},e=Object.keys(i(this,j)[0][this.routeIndex][1]);for(const r of e){const a=b(this,N,Ue).call(this,i(this,j)[0][this.routeIndex][1][r]);a!==void 0&&(t[r]=/\%/.test(a)?Ze(a):a)}return t},Ue=function(t){return i(this,j)[1]?i(this,j)[1][t]:t},F=new WeakMap,ot),Ut={Stringify:1},bt=async(t,e,r,a,o)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const s=t.callbacks;return s!=null&&s.length?(o?o[0]+=t:o=[t],Promise.all(s.map(l=>l({phase:e,buffer:o,context:a}))).then(l=>Promise.all(l.filter(Boolean).map(c=>bt(c,e,!1,a,o))).then(()=>o[0]))):Promise.resolve(t)},Gt="text/plain; charset=UTF-8",_e=(t,e)=>({"Content-Type":t,...e}),we=(t,e)=>new Response(t,e),Ee,Re,M,pe,B,R,Se,ue,ge,Z,je,Oe,_,ce,st,Kt=(st=class{constructor(t,e){m(this,_);m(this,Ee);m(this,Re);f(this,"env",{});m(this,M);f(this,"finalized",!1);f(this,"error");m(this,pe);m(this,B);m(this,R);m(this,Se);m(this,ue);m(this,ge);m(this,Z);m(this,je);m(this,Oe);f(this,"render",(...t)=>(i(this,ue)??g(this,ue,e=>this.html(e)),i(this,ue).call(this,...t)));f(this,"setLayout",t=>g(this,Se,t));f(this,"getLayout",()=>i(this,Se));f(this,"setRenderer",t=>{g(this,ue,t)});f(this,"header",(t,e,r)=>{this.finalized&&g(this,R,we(i(this,R).body,i(this,R)));const a=i(this,R)?i(this,R).headers:i(this,Z)??g(this,Z,new Headers);e===void 0?a.delete(t):r!=null&&r.append?a.append(t,e):a.set(t,e)});f(this,"status",t=>{g(this,pe,t)});f(this,"set",(t,e)=>{i(this,M)??g(this,M,new Map),i(this,M).set(t,e)});f(this,"get",t=>i(this,M)?i(this,M).get(t):void 0);f(this,"newResponse",(...t)=>b(this,_,ce).call(this,...t));f(this,"body",(t,e,r)=>b(this,_,ce).call(this,t,e,r));f(this,"text",(t,e,r)=>!i(this,Z)&&!i(this,pe)&&!e&&!r&&!this.finalized?new Response(t):b(this,_,ce).call(this,t,e,_e(Gt,r)));f(this,"json",(t,e,r)=>b(this,_,ce).call(this,JSON.stringify(t),e,_e("application/json",r)));f(this,"html",(t,e,r)=>{const a=o=>b(this,_,ce).call(this,o,e,_e("text/html; charset=UTF-8",r));return typeof t=="object"?bt(t,Ut.Stringify,!1,{}).then(a):a(t)});f(this,"redirect",(t,e)=>{const r=String(t);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,e??302)});f(this,"notFound",()=>(i(this,ge)??g(this,ge,()=>we()),i(this,ge).call(this,this)));g(this,Ee,t),e&&(g(this,B,e.executionCtx),this.env=e.env,g(this,ge,e.notFoundHandler),g(this,Oe,e.path),g(this,je,e.matchResult))}get req(){return i(this,Re)??g(this,Re,new ht(i(this,Ee),i(this,Oe),i(this,je))),i(this,Re)}get event(){if(i(this,B)&&"respondWith"in i(this,B))return i(this,B);throw Error("This context has no FetchEvent")}get executionCtx(){if(i(this,B))return i(this,B);throw Error("This context has no ExecutionContext")}get res(){return i(this,R)||g(this,R,we(null,{headers:i(this,Z)??g(this,Z,new Headers)}))}set res(t){if(i(this,R)&&t){t=we(t.body,t);for(const[e,r]of i(this,R).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const a=i(this,R).headers.getSetCookie();t.headers.delete("set-cookie");for(const o of a)t.headers.append("set-cookie",o)}else t.headers.set(e,r)}g(this,R,t),this.finalized=!0}get var(){return i(this,M)?Object.fromEntries(i(this,M)):{}}},Ee=new WeakMap,Re=new WeakMap,M=new WeakMap,pe=new WeakMap,B=new WeakMap,R=new WeakMap,Se=new WeakMap,ue=new WeakMap,ge=new WeakMap,Z=new WeakMap,je=new WeakMap,Oe=new WeakMap,_=new WeakSet,ce=function(t,e,r){const a=i(this,R)?new Headers(i(this,R).headers):i(this,Z)??new Headers;if(typeof e=="object"&&"headers"in e){const s=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[n,l]of s)n.toLowerCase()==="set-cookie"?a.append(n,l):a.set(n,l)}if(r)for(const[s,n]of Object.entries(r))if(typeof n=="string")a.set(s,n);else{a.delete(s);for(const l of n)a.append(s,l)}const o=typeof e=="number"?e:(e==null?void 0:e.status)??i(this,pe);return we(t,{status:o,headers:a})},st),y="ALL",Wt="all",Jt=["get","post","put","delete","options","patch"],vt="Can not add a route since the matcher is already built.",yt=class extends Error{},Yt="__COMPOSED_HANDLER",Qt=t=>t.text("404 Not Found",404),et=(t,e)=>{if("getResponse"in t){const r=t.getResponse();return e.newResponse(r.body,r)}return console.error(t),e.text("Internal Server Error",500)},P,w,wt,z,Y,De,Ie,fe,Xt=(fe=class{constructor(e={}){m(this,w);f(this,"get");f(this,"post");f(this,"put");f(this,"delete");f(this,"options");f(this,"patch");f(this,"all");f(this,"on");f(this,"use");f(this,"router");f(this,"getPath");f(this,"_basePath","/");m(this,P,"/");f(this,"routes",[]);m(this,z,Qt);f(this,"errorHandler",et);f(this,"onError",e=>(this.errorHandler=e,this));f(this,"notFound",e=>(g(this,z,e),this));f(this,"fetch",(e,...r)=>b(this,w,Ie).call(this,e,r[1],r[0],e.method));f(this,"request",(e,r,a,o)=>e instanceof Request?this.fetch(r?new Request(e,r):e,a,o):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${J("/",e)}`,r),a,o)));f(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(b(this,w,Ie).call(this,e.request,e,void 0,e.request.method))})});[...Jt,Wt].forEach(s=>{this[s]=(n,...l)=>(typeof n=="string"?g(this,P,n):b(this,w,Y).call(this,s,i(this,P),n),l.forEach(c=>{b(this,w,Y).call(this,s,i(this,P),c)}),this)}),this.on=(s,n,...l)=>{for(const c of[n].flat()){g(this,P,c);for(const d of[s].flat())l.map(p=>{b(this,w,Y).call(this,d.toUpperCase(),i(this,P),p)})}return this},this.use=(s,...n)=>(typeof s=="string"?g(this,P,s):(g(this,P,"*"),n.unshift(s)),n.forEach(l=>{b(this,w,Y).call(this,y,i(this,P),l)}),this);const{strict:a,...o}=e;Object.assign(this,o),this.getPath=a??!0?e.getPath??pt:Nt}route(e,r){const a=this.basePath(e);return r.routes.map(o=>{var n;let s;r.errorHandler===et?s=o.handler:(s=async(l,c)=>(await Xe([],r.errorHandler)(l,()=>o.handler(l,c))).res,s[Yt]=o.handler),b(n=a,w,Y).call(n,o.method,o.path,s,o.basePath)}),this}basePath(e){const r=b(this,w,wt).call(this);return r._basePath=J(this._basePath,e),r}mount(e,r,a){let o,s;a&&(typeof a=="function"?s=a:(s=a.optionHandler,a.replaceRequest===!1?o=c=>c:o=a.replaceRequest));const n=s?c=>{const d=s(c);return Array.isArray(d)?d:[d]}:c=>{let d;try{d=c.executionCtx}catch{}return[c.env,d]};o||(o=(()=>{const c=J(this._basePath,e),d=c==="/"?0:c.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(d)||"/",new Request(u,p)}})());const l=async(c,d)=>{const p=await r(o(c.req.raw),...n(c));if(p)return p;await d()};return b(this,w,Y).call(this,y,J(e,"*"),l),this}},P=new WeakMap,w=new WeakSet,wt=function(){const e=new fe({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,g(e,z,i(this,z)),e.routes=this.routes,e},z=new WeakMap,Y=function(e,r,a,o){e=e.toUpperCase(),r=J(this._basePath,r);const s={basePath:o!==void 0?J(this._basePath,o):this._basePath,path:r,method:e,handler:a};this.router.add(e,r,[a,s]),this.routes.push(s)},De=function(e,r){if(e instanceof Error)return this.errorHandler(e,r);throw e},Ie=function(e,r,a,o){if(o==="HEAD")return(async()=>new Response(null,await b(this,w,Ie).call(this,e,r,a,"GET")))();const s=this.getPath(e,{env:a}),n=this.router.match(o,s),l=new Kt(e,{path:s,matchResult:n,env:a,executionCtx:r,notFoundHandler:i(this,z)});if(n[0].length===1){let d;try{d=n[0][0][0][0](l,async()=>{l.res=await i(this,z).call(this,l)})}catch(p){return b(this,w,De).call(this,p,l)}return d instanceof Promise?d.then(p=>p||(l.finalized?l.res:i(this,z).call(this,l))).catch(p=>b(this,w,De).call(this,p,l)):d??i(this,z).call(this,l)}const c=Xe(n[0],this.errorHandler,i(this,z));return(async()=>{try{const d=await c(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return b(this,w,De).call(this,d,l)}})()},fe),kt=[];function Zt(t,e){const r=this.buildAllMatchers(),a=(o,s)=>{const n=r[o]||r[y],l=n[2][s];if(l)return l;const c=s.match(n[0]);if(!c)return[[],kt];const d=c.indexOf("",1);return[n[1][d],c]};return this.match=a,a(t,e)}var Le="[^/]+",Ae=".*",Ce="(?:|/.*)",le=Symbol(),er=new Set(".\\+*[^]$()");function tr(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Ae||t===Ce?1:e===Ae||e===Ce?-1:t===Le?1:e===Le?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var ee,te,D,oe,rr=(oe=class{constructor(){m(this,ee);m(this,te);m(this,D,Object.create(null))}insert(e,r,a,o,s){if(e.length===0){if(i(this,ee)!==void 0)throw le;if(s)return;g(this,ee,r);return}const[n,...l]=e,c=n==="*"?l.length===0?["","",Ae]:["","",Le]:n==="/*"?["","",Ce]:n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(c){const p=c[1];let u=c[2]||Le;if(p&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw le;if(d=i(this,D)[u],!d){if(Object.keys(i(this,D)).some(x=>x!==Ae&&x!==Ce))throw le;if(s)return;d=i(this,D)[u]=new oe,p!==""&&g(d,te,o.varIndex++)}!s&&p!==""&&a.push([p,i(d,te)])}else if(d=i(this,D)[n],!d){if(Object.keys(i(this,D)).some(p=>p.length>1&&p!==Ae&&p!==Ce))throw le;if(s)return;d=i(this,D)[n]=new oe}d.insert(l,r,a,o,s)}buildRegExpStr(){const r=Object.keys(i(this,D)).sort(tr).map(a=>{const o=i(this,D)[a];return(typeof i(o,te)=="number"?`(${a})@${i(o,te)}`:er.has(a)?`\\${a}`:a)+o.buildRegExpStr()});return typeof i(this,ee)=="number"&&r.unshift(`#${i(this,ee)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},ee=new WeakMap,te=new WeakMap,D=new WeakMap,oe),Me,Pe,it,ar=(it=class{constructor(){m(this,Me,{varIndex:0});m(this,Pe,new rr)}insert(t,e,r){const a=[],o=[];for(let n=0;;){let l=!1;if(t=t.replace(/\{[^}]+\}/g,c=>{const d=`@\\${n}`;return o[n]=[d,c],n++,l=!0,d}),!l)break}const s=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let n=o.length-1;n>=0;n--){const[l]=o[n];for(let c=s.length-1;c>=0;c--)if(s[c].indexOf(l)!==-1){s[c]=s[c].replace(l,o[n][1]);break}}return i(this,Pe).insert(s,e,a,i(this,Me),r),a}buildRegExp(){let t=i(this,Pe).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const r=[],a=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(o,s,n)=>s!==void 0?(r[++e]=Number(s),"$()"):(n!==void 0&&(a[Number(n)]=++e),"")),[new RegExp(`^${t}`),r,a]}},Me=new WeakMap,Pe=new WeakMap,it),or=[/^$/,[],Object.create(null)],Te=Object.create(null);function At(t){return Te[t]??(Te[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function sr(){Te=Object.create(null)}function ir(t){var d;const e=new ar,r=[];if(t.length===0)return or;const a=t.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[x,A])=>p?1:x?-1:u.length-A.length),o=Object.create(null);for(let p=0,u=-1,x=a.length;p<x;p++){const[A,C,T]=a[p];A?o[C]=[T.map(([I])=>[I,Object.create(null)]),kt]:u++;let O;try{O=e.insert(C,u,A)}catch(I){throw I===le?new yt(C):I}A||(r[u]=T.map(([I,v])=>{const L=Object.create(null);for(v-=1;v>=0;v--){const[be,Ve]=O[v];L[be]=Ve}return[I,L]}))}const[s,n,l]=e.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let x=0,A=r[p].length;x<A;x++){const C=(d=r[p][x])==null?void 0:d[1];if(!C)continue;const T=Object.keys(C);for(let O=0,I=T.length;O<I;O++)C[T[O]]=l[C[T[O]]]}const c=[];for(const p in n)c[p]=r[n[p]];return[s,c,o]}function ne(t,e){if(t){for(const r of Object.keys(t).sort((a,o)=>o.length-a.length))if(At(r).test(e))return[...t[r]]}}var U,G,Be,Ct,nt,nr=(nt=class{constructor(){m(this,Be);f(this,"name","RegExpRouter");m(this,U);m(this,G);f(this,"match",Zt);g(this,U,{[y]:Object.create(null)}),g(this,G,{[y]:Object.create(null)})}add(t,e,r){var l;const a=i(this,U),o=i(this,G);if(!a||!o)throw new Error(vt);a[t]||[a,o].forEach(c=>{c[t]=Object.create(null),Object.keys(c[y]).forEach(d=>{c[t][d]=[...c[y][d]]})}),e==="/*"&&(e="*");const s=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const c=At(e);t===y?Object.keys(a).forEach(d=>{var p;(p=a[d])[e]||(p[e]=ne(a[d],e)||ne(a[y],e)||[])}):(l=a[t])[e]||(l[e]=ne(a[t],e)||ne(a[y],e)||[]),Object.keys(a).forEach(d=>{(t===y||t===d)&&Object.keys(a[d]).forEach(p=>{c.test(p)&&a[d][p].push([r,s])})}),Object.keys(o).forEach(d=>{(t===y||t===d)&&Object.keys(o[d]).forEach(p=>c.test(p)&&o[d][p].push([r,s]))});return}const n=ut(e)||[e];for(let c=0,d=n.length;c<d;c++){const p=n[c];Object.keys(o).forEach(u=>{var x;(t===y||t===u)&&((x=o[u])[p]||(x[p]=[...ne(a[u],p)||ne(a[y],p)||[]]),o[u][p].push([r,s-d+c+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(i(this,G)).concat(Object.keys(i(this,U))).forEach(e=>{t[e]||(t[e]=b(this,Be,Ct).call(this,e))}),g(this,U,g(this,G,void 0)),sr(),t}},U=new WeakMap,G=new WeakMap,Be=new WeakSet,Ct=function(t){const e=[];let r=t===y;return[i(this,U),i(this,G)].forEach(a=>{const o=a[t]?Object.keys(a[t]).map(s=>[s,a[t][s]]):[];o.length!==0?(r||(r=!0),e.push(...o)):t!==y&&e.push(...Object.keys(a[y]).map(s=>[s,a[y][s]]))}),r?ir(e):null},nt),K,V,ct,cr=(ct=class{constructor(t){f(this,"name","SmartRouter");m(this,K,[]);m(this,V,[]);g(this,K,t.routers)}add(t,e,r){if(!i(this,V))throw new Error(vt);i(this,V).push([t,e,r])}match(t,e){if(!i(this,V))throw new Error("Fatal error");const r=i(this,K),a=i(this,V),o=r.length;let s=0,n;for(;s<o;s++){const l=r[s];try{for(let c=0,d=a.length;c<d;c++)l.add(...a[c]);n=l.match(t,e)}catch(c){if(c instanceof yt)continue;throw c}this.match=l.match.bind(l),g(this,K,[l]),g(this,V,void 0);break}if(s===o)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,n}get activeRouter(){if(i(this,V)||i(this,K).length!==1)throw new Error("No active router has been determined yet.");return i(this,K)[0]}},K=new WeakMap,V=new WeakMap,ct),ke=Object.create(null),lr=t=>{for(const e in t)return!0;return!1},W,E,re,he,k,q,Q,me,dr=(me=class{constructor(e,r,a){m(this,q);m(this,W);m(this,E);m(this,re);m(this,he,0);m(this,k,ke);if(g(this,E,a||Object.create(null)),g(this,W,[]),e&&r){const o=Object.create(null);o[e]={handler:r,possibleKeys:[],score:0},g(this,W,[o])}g(this,re,[])}insert(e,r,a){g(this,he,++Qe(this,he)._);let o=this;const s=Ft(r),n=[];for(let l=0,c=s.length;l<c;l++){const d=s[l],p=s[l+1],u=Vt(d,p),x=Array.isArray(u)?u[0]:d;if(x in i(o,E)){o=i(o,E)[x],u&&n.push(u[1]);continue}i(o,E)[x]=new me,u&&(i(o,re).push(u),n.push(u[1])),o=i(o,E)[x]}return i(o,W).push({[e]:{handler:a,possibleKeys:n.filter((l,c,d)=>d.indexOf(l)===c),score:i(this,he)}}),o}search(e,r){var p;const a=[];g(this,k,ke);let s=[this];const n=dt(r),l=[],c=n.length;let d=null;for(let u=0;u<c;u++){const x=n[u],A=u===c-1,C=[];for(let O=0,I=s.length;O<I;O++){const v=s[O],L=i(v,E)[x];L&&(g(L,k,i(v,k)),A?(i(L,E)["*"]&&b(this,q,Q).call(this,a,i(L,E)["*"],e,i(v,k)),b(this,q,Q).call(this,a,L,e,i(v,k))):C.push(L));for(let be=0,Ve=i(v,re).length;be<Ve;be++){const We=i(v,re)[be],$=i(v,k)===ke?{}:{...i(v,k)};if(We==="*"){const se=i(v,E)["*"];se&&(b(this,q,Q).call(this,a,se,e,i(v,k)),g(se,k,$),C.push(se));continue}const[jt,Je,ve]=We;if(!x&&!(ve instanceof RegExp))continue;const H=i(v,E)[jt];if(ve instanceof RegExp){if(d===null){d=new Array(c);let ie=r[0]==="/"?1:0;for(let ye=0;ye<c;ye++)d[ye]=ie,ie+=n[ye].length+1}const se=r.substring(d[u]),qe=ve.exec(se);if(qe){if($[Je]=qe[0],b(this,q,Q).call(this,a,H,e,i(v,k),$),lr(i(H,E))){g(H,k,$);const ie=((p=qe[0].match(/\//))==null?void 0:p.length)??0;(l[ie]||(l[ie]=[])).push(H)}continue}}(ve===!0||ve.test(x))&&($[Je]=x,A?(b(this,q,Q).call(this,a,H,e,$,i(v,k)),i(H,E)["*"]&&b(this,q,Q).call(this,a,i(H,E)["*"],e,$,i(v,k))):(g(H,k,$),C.push(H)))}}const T=l.shift();s=T?C.concat(T):C}return a.length>1&&a.sort((u,x)=>u.score-x.score),[a.map(({handler:u,params:x})=>[u,x])]}},W=new WeakMap,E=new WeakMap,re=new WeakMap,he=new WeakMap,k=new WeakMap,q=new WeakSet,Q=function(e,r,a,o,s){for(let n=0,l=i(r,W).length;n<l;n++){const c=i(r,W)[n],d=c[a]||c[y],p={};if(d!==void 0&&(d.params=Object.create(null),e.push(d),o!==ke||s&&s!==ke))for(let u=0,x=d.possibleKeys.length;u<x;u++){const A=d.possibleKeys[u],C=p[d.score];d.params[A]=s!=null&&s[A]&&!C?s[A]:o[A]??(s==null?void 0:s[A]),p[d.score]=!0}}},me),ae,lt,pr=(lt=class{constructor(){f(this,"name","TrieRouter");m(this,ae);g(this,ae,new dr)}add(t,e,r){const a=ut(e);if(a){for(let o=0,s=a.length;o<s;o++)i(this,ae).insert(t,a[o],r);return}i(this,ae).insert(t,e,r)}match(t,e){return i(this,ae).search(t,e)}},ae=new WeakMap,lt),Et=class extends Xt{constructor(t={}){super(t),this.router=t.router??new cr({routers:[new nr,new pr]})}},ur=t=>{const e={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...t},r=(o=>typeof o=="string"?o==="*"?()=>o:s=>o===s?s:null:typeof o=="function"?o:s=>o.includes(s)?s:null)(e.origin),a=(o=>typeof o=="function"?o:Array.isArray(o)?()=>o:()=>[])(e.allowMethods);return async function(s,n){var d;function l(p,u){s.res.headers.set(p,u)}const c=await r(s.req.header("origin")||"",s);if(c&&l("Access-Control-Allow-Origin",c),e.credentials&&l("Access-Control-Allow-Credentials","true"),(d=e.exposeHeaders)!=null&&d.length&&l("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),s.req.method==="OPTIONS"){e.origin!=="*"&&l("Vary","Origin"),e.maxAge!=null&&l("Access-Control-Max-Age",e.maxAge.toString());const p=await a(s.req.header("origin")||"",s);p.length&&l("Access-Control-Allow-Methods",p.join(","));let u=e.allowHeaders;if(!(u!=null&&u.length)){const x=s.req.header("Access-Control-Request-Headers");x&&(u=x.split(/\s*,\s*/))}return u!=null&&u.length&&(l("Access-Control-Allow-Headers",u.join(",")),s.res.headers.append("Vary","Access-Control-Request-Headers")),s.res.headers.delete("Content-Length"),s.res.headers.delete("Content-Type"),new Response(null,{headers:s.res.headers,status:204,statusText:"No Content"})}await n(),e.origin!=="*"&&s.header("Vary","Origin",{append:!0})}};const h={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},X="https://api.sixtechbrasil.com.br",gr="https://sixtechworkspace.kainow252-cmyk.workers.dev",xe=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:h.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:h.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:h.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:h.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:h.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:h.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:h.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:h.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:h.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:h.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:h.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:h.coder,internalUrl:`${X}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:h.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:h.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:h.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:h.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:h.powerful,internalUrl:`${X}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:h.balanced,internalUrl:`${X}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function fr(t,e){try{const r=new AbortController,a=setTimeout(()=>r.abort(),8e3),o=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:e,message:e}),signal:r.signal});if(clearTimeout(a),!o.ok)return null;const s=await o.json();return s.result||s.response||s.output||null}catch{return null}}async function tt(t,e,r,a,o=1200){const s=[{role:"system",content:r},{role:"user",content:a}],n=await t.run(e,{messages:s,max_tokens:o});return n&&typeof n=="object"&&"response"in n?n.response||"":String(n||"")}async function Ke(t,e,r){const a=Date.now();let o="",s=!1,n=t.source;try{if(t.source==="hybrid"&&t.internalUrl){const l=await fr(t.internalUrl,e);l?(o=l,n="internal",s=!1):(o=await tt(r,t.model,t.system,e,1500),n="cloudflare",s=!0)}else o=await tt(r,t.model,t.system,e,1500),n="cloudflare",s=!1}catch(l){o=`❌ Erro: ${(l==null?void 0:l.message)||"falha inesperada"}`}return{agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:n,usedFallback:s,response:o,duration:Date.now()-a}}function hr(t){const e=t.toLowerCase(),r=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(e)&&r.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(e)&&r.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(e)&&r.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(e)&&r.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(e)&&r.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(e)&&r.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(e)&&r.push("reviewer"),r.length===0&&r.push("orchestrator"),r.length>1&&r.push("orchestrator"),[...new Set(r)]}const mr={sixtech:"sixtech@2025",admin:"Admin@SixTech1"},He="st_sess",rt=60*60*8;function xr(){const t=new Uint8Array(24);return crypto.getRandomValues(t),Array.from(t).map(e=>e.toString(16).padStart(2,"0")).join("")}const Fe=new Map;function Rt(t){const r=(t.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${He}=([^;]+)`));if(!r)return null;const a=r[1],o=Fe.get(a);return o?Date.now()/1e3>o.exp?(Fe.delete(a),null):{user:o.user}:null}const S=new Et;S.use("*",ur());S.get("/favicon.ico",t=>new Response(null,{status:204}));S.post("/api/login",async t=>{const{username:e,password:r}=await t.req.json(),a=mr[e==null?void 0:e.trim()];if(!a||a!==r)return t.json({ok:!1,error:"Usuário ou senha incorretos"},401);const o=xr();Fe.set(o,{user:e.trim(),exp:Math.floor(Date.now()/1e3)+rt});const s=`${He}=${o}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${rt}`;return new Response(JSON.stringify({ok:!0,user:e.trim()}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":s,"Access-Control-Allow-Origin":"*"}})});S.post("/api/logout",t=>{const r=(t.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${He}=([^;]+)`));return r&&Fe.delete(r[1]),new Response(JSON.stringify({ok:!0}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":`${He}=; Path=/; Max-Age=0`}})});S.get("/api/me",t=>{const e=Rt(t);return e?t.json({ok:!0,user:e.user}):t.json({ok:!1},401)});S.use("/api/*",async(t,e)=>{const r=new URL(t.req.url).pathname;return r==="/api/login"||r==="/api/me"||r==="/api/logout"||Rt(t)?e():t.json({error:"Não autorizado",code:401},401)});S.get("/api/agents",t=>t.json({total:xe.length,models:Object.keys(h).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:xe.map(e=>({id:e.id,name:e.name,emoji:e.emoji,color:e.color,desc:e.desc,source:e.source,model:e.model,category:e.category,capabilities:e.capabilities,basedOn:e.basedOn,internalUrl:e.internalUrl}))}));S.post("/api/agent/:id",async t=>{const e=xe.find(s=>s.id===t.req.param("id"));if(!e)return t.json({error:"Agente não encontrado"},404);const{message:r,task:a}=await t.req.json(),o=await Ke(e,r||a||"",t.env.AI);return t.json(o)});S.post("/api/orchestrate",async t=>{var l;const{task:e,message:r}=await t.req.json(),a=e||r||"";if(!a)return t.json({error:"task obrigatório"},400);const o=hr(a),s=o.map(c=>xe.find(d=>d.id===c)).filter(Boolean),n=[];for(const c of s){const d=c.id==="orchestrator"&&n.length>0?`Tarefa original: "${a}"

Resultados dos agentes especializados:
${n.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:a;n.push(await Ke(c,d,t.env.AI))}return t.json({task:a,agentsUsed:o,results:n,summary:((l=n[n.length-1])==null?void 0:l.response)||""})});S.post("/api/pipeline",async t=>{const{task:e,agentIds:r}=await t.req.json();if(!e||!(r!=null&&r.length))return t.json({error:"task e agentIds obrigatórios"},400);const a=r.map(c=>xe.find(d=>d.id===c)).filter(Boolean),o=[];let s=e;for(const c of a){a[a.length-1];const d=o.length===0?e:c.id==="orchestrator"&&o.length>0?`Tarefa original: "${e}"

${o.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${e}

[Contexto do ${o[o.length-1].name}]:
${o[o.length-1].response.slice(0,800)}`,p=await Ke(c,d,t.env.AI);o.push(p),s=p.response}const n=o.filter(c=>c.source==="cloudflare").length,l=o.filter(c=>c.source==="internal").length;return t.json({task:e,steps:o.length,cloudflareSteps:n,internalSteps:l,results:o,final:s})});S.post("/api/chat",async t=>{const{messages:e,model:r}=await t.req.json(),a=r||h.balanced;e.some(s=>s.role==="system")||e.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const o=await t.env.AI.run(a,{messages:e,max_tokens:2048,stream:!0});return new Response(o,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});S.get("/api/models",t=>t.json({models:Object.entries(h).map(([e,r])=>({key:e,id:r,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[e]||e}))}));S.get("/api/status",t=>t.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:X},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:gr},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:xe.length,models:Object.keys(h).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));S.get("/",t=>t.html(`<!DOCTYPE html>
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
</html>`));const at=new Et,br=Object.assign({"/src/index.tsx":S});let St=!1;for(const[,t]of Object.entries(br))t&&(at.route("/",t),at.notFound(t.notFoundHandler),St=!0);if(!St)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{at as default};
