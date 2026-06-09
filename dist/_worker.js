var Tt=Object.defineProperty;var Ve=e=>{throw TypeError(e)};var It=(e,t,r)=>t in e?Tt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var g=(e,t,r)=>It(e,typeof t!="symbol"?t+"":t,r),Be=(e,t,r)=>t.has(e)||Ve("Cannot "+r);var o=(e,t,r)=>(Be(e,t,"read from private field"),r?r.call(e):t.get(e)),f=(e,t,r)=>t.has(e)?Ve("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),m=(e,t,r,a)=>(Be(e,t,"write to private field"),a?a.call(e,r):t.set(e,r),r),b=(e,t,r)=>(Be(e,t,"access private method"),r);var We=(e,t,r,a)=>({set _(s){m(e,t,s,r)},get _(){return o(e,t,a)}});var Je=(e,t,r)=>(a,s)=>{let n=-1;return l(0);async function l(i){if(i<=n)throw new Error("next() called multiple times");n=i;let d,c=!1,p;if(e[i]?(p=e[i][0][0],a.req.routeIndex=i):p=i===e.length&&s||void 0,p)try{d=await p(a,()=>l(i+1))}catch(u){if(u instanceof Error&&t)a.error=u,d=await t(u,a),c=!0;else throw u}else a.finalized===!1&&r&&(d=await r(a));return d&&(a.finalized===!1||c)&&(a.res=d),a}},Ct=Symbol(),Rt=async(e,t=Object.create(null))=>{const{all:r=!1,dot:a=!1}=t,n=(e instanceof ut?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?Ot(e,{all:r,dot:a}):{}};async function Ot(e,t){const r=await e.formData();return r?Pt(r,t):{}}function Pt(e,t){const r=Object.create(null);return e.forEach((a,s)=>{t.all||s.endsWith("[]")?Lt(r,s,a):r[s]=a}),t.dot&&Object.entries(r).forEach(([a,s])=>{a.includes(".")&&($t(r,a,s),delete r[a])}),r}var Lt=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},$t=(e,t,r)=>{if(/(?:^|\.)__proto__\./.test(t))return;let a=e;const s=t.split(".");s.forEach((n,l)=>{l===s.length-1?a[n]=r:((!a[n]||typeof a[n]!="object"||Array.isArray(a[n])||a[n]instanceof File)&&(a[n]=Object.create(null)),a=a[n])})},ot=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Mt=e=>{const{groups:t,path:r}=Nt(e),a=ot(r);return zt(a,t)},Nt=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,a)=>{const s=`@${a}`;return t.push([s,r]),s}),{groups:t,path:e}},zt=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[a]=t[r];for(let s=e.length-1;s>=0;s--)if(e[s].includes(a)){e[s]=e[s].replace(a,t[r][1]);break}}return e},Ce={},Bt=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const a=`${e}#${t}`;return Ce[a]||(r[2]?Ce[a]=t&&t[0]!==":"&&t[0]!=="*"?[a,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:Ce[a]=[e,r[1],!0]),Ce[a]}return null},qe=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},it=e=>qe(e,decodeURI),lt=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let a=r;for(;a<t.length;a++){const s=t.charCodeAt(a);if(s===37){const n=t.indexOf("?",a),l=t.indexOf("#",a),i=n===-1?l===-1?void 0:l:l===-1?n:Math.min(n,l),d=t.slice(r,i);return it(d.includes("%25")?d.replace(/%25/g,"%2525"):d)}else if(s===63||s===35)break}return t.slice(r,a)},Ht=e=>{const t=lt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},J=(e,t,...r)=>(r.length&&(t=J(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),dt=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let a="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))a+="/"+s;else if(/\:/.test(s))if(/\?/.test(s)){r.length===0&&a===""?r.push("/"):r.push(a);const n=s.replace("?","");a+="/"+n,r.push(a)}else a+="/"+s}),r.filter((s,n,l)=>l.indexOf(s)===n)},He=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?qe(e,pt):e):e,ct=(e,t,r)=>{let a;if(!r&&t&&!/[%+]/.test(t)){let l=e.indexOf("?",8);if(l===-1)return;for(e.startsWith(t,l+1)||(l=e.indexOf(`&${t}`,l+1));l!==-1;){const i=e.charCodeAt(l+t.length+1);if(i===61){const d=l+t.length+2,c=e.indexOf("&",d);return He(e.slice(d,c===-1?void 0:c))}else if(i==38||isNaN(i))return"";l=e.indexOf(`&${t}`,l+1)}if(a=/[%+]/.test(e),!a)return}const s={};a??(a=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const l=e.indexOf("&",n+1);let i=e.indexOf("=",n);i>l&&l!==-1&&(i=-1);let d=e.slice(n+1,i===-1?l===-1?void 0:l:i);if(a&&(d=He(d)),n=l,d==="")continue;let c;i===-1?c="":(c=e.slice(i+1,l===-1?void 0:l),a&&(c=He(c))),r?(s[d]&&Array.isArray(s[d])||(s[d]=[]),s[d].push(c)):s[d]??(s[d]=c)}return t?s[t]:s},Dt=ct,_t=(e,t)=>ct(e,t,!0),pt=decodeURIComponent,Ye=e=>qe(e,pt),de,I,D,mt,gt,_e,M,et,ut=(et=class{constructor(e,t="/",r=[[]]){f(this,D);g(this,"raw");f(this,de);f(this,I);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});f(this,M,e=>{const{bodyCache:t,raw:r}=this,a=t[e];if(a)return a;const s=Object.keys(t)[0];return s?t[s].then(n=>(s==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,m(this,I,r),m(this,de,{})}param(e){return e?b(this,D,mt).call(this,e):b(this,D,gt).call(this)}query(e){return Dt(this.url,e)}queries(e){return _t(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,a)=>{t[a]=r}),t}async parseBody(e){return Rt(this,e)}json(){return o(this,M).call(this,"text").then(e=>JSON.parse(e))}text(){return o(this,M).call(this,"text")}arrayBuffer(){return o(this,M).call(this,"arrayBuffer")}bytes(){return o(this,M).call(this,"arrayBuffer").then(e=>new Uint8Array(e))}blob(){return o(this,M).call(this,"blob")}formData(){return o(this,M).call(this,"formData")}addValidatedData(e,t){o(this,de)[e]=t}valid(e){return o(this,de)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ct](){return o(this,I)}get matchedRoutes(){return o(this,I)[0].map(([[,e]])=>e)}get routePath(){return o(this,I)[0].map(([[,e]])=>e)[this.routeIndex].path}},de=new WeakMap,I=new WeakMap,D=new WeakSet,mt=function(e){const t=o(this,I)[0][this.routeIndex][1][e],r=b(this,D,_e).call(this,t);return r&&/\%/.test(r)?Ye(r):r},gt=function(){const e={},t=Object.keys(o(this,I)[0][this.routeIndex][1]);for(const r of t){const a=b(this,D,_e).call(this,o(this,I)[0][this.routeIndex][1][r]);a!==void 0&&(e[r]=/\%/.test(a)?Ye(a):a)}return e},_e=function(e){return o(this,I)[1]?o(this,I)[1][e]:e},M=new WeakMap,et),qt={Stringify:1},ft=async(e,t,r,a,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(s?s[0]+=e:s=[e],Promise.all(n.map(i=>i({phase:t,buffer:s,context:a}))).then(i=>Promise.all(i.filter(Boolean).map(d=>ft(d,t,!1,a,s))).then(()=>s[0]))):Promise.resolve(e)},Ft="text/plain; charset=UTF-8",De=(e,t)=>({"Content-Type":e,...t}),ye=(e,t)=>new Response(e,t),Ae,ke,N,ce,z,j,Se,pe,ue,Q,je,Te,U,ie,tt,Ut=(tt=class{constructor(e,t){f(this,U);f(this,Ae);f(this,ke);g(this,"env",{});f(this,N);g(this,"finalized",!1);g(this,"error");f(this,ce);f(this,z);f(this,j);f(this,Se);f(this,pe);f(this,ue);f(this,Q);f(this,je);f(this,Te);g(this,"render",(...e)=>(o(this,pe)??m(this,pe,t=>this.html(t)),o(this,pe).call(this,...e)));g(this,"setLayout",e=>m(this,Se,e));g(this,"getLayout",()=>o(this,Se));g(this,"setRenderer",e=>{m(this,pe,e)});g(this,"header",(e,t,r)=>{this.finalized&&m(this,j,ye(o(this,j).body,o(this,j)));const a=o(this,j)?o(this,j).headers:o(this,Q)??m(this,Q,new Headers);t===void 0?a.delete(e):r!=null&&r.append?a.append(e,t):a.set(e,t)});g(this,"status",e=>{m(this,ce,e)});g(this,"set",(e,t)=>{o(this,N)??m(this,N,new Map),o(this,N).set(e,t)});g(this,"get",e=>o(this,N)?o(this,N).get(e):void 0);g(this,"newResponse",(...e)=>b(this,U,ie).call(this,...e));g(this,"body",(e,t,r)=>b(this,U,ie).call(this,e,t,r));g(this,"text",(e,t,r)=>!o(this,Q)&&!o(this,ce)&&!t&&!r&&!this.finalized?new Response(e):b(this,U,ie).call(this,e,t,De(Ft,r)));g(this,"json",(e,t,r)=>b(this,U,ie).call(this,JSON.stringify(e),t,De("application/json",r)));g(this,"html",(e,t,r)=>{const a=s=>b(this,U,ie).call(this,s,t,De("text/html; charset=UTF-8",r));return typeof e=="object"?ft(e,qt.Stringify,!1,{}).then(a):a(e)});g(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});g(this,"notFound",()=>(o(this,ue)??m(this,ue,()=>ye()),o(this,ue).call(this,this)));m(this,Ae,e),t&&(m(this,z,t.executionCtx),this.env=t.env,m(this,ue,t.notFoundHandler),m(this,Te,t.path),m(this,je,t.matchResult))}get req(){return o(this,ke)??m(this,ke,new ut(o(this,Ae),o(this,Te),o(this,je))),o(this,ke)}get event(){if(o(this,z)&&"respondWith"in o(this,z))return o(this,z);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,z))return o(this,z);throw Error("This context has no ExecutionContext")}get res(){return o(this,j)||m(this,j,ye(null,{headers:o(this,Q)??m(this,Q,new Headers)}))}set res(e){if(o(this,j)&&e){e=ye(e.body,e);for(const[t,r]of o(this,j).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const a=o(this,j).headers.getSetCookie();e.headers.delete("set-cookie");for(const s of a)e.headers.append("set-cookie",s)}else e.headers.set(t,r)}m(this,j,e),this.finalized=!0}get var(){return o(this,N)?Object.fromEntries(o(this,N)):{}}},Ae=new WeakMap,ke=new WeakMap,N=new WeakMap,ce=new WeakMap,z=new WeakMap,j=new WeakMap,Se=new WeakMap,pe=new WeakMap,ue=new WeakMap,Q=new WeakMap,je=new WeakMap,Te=new WeakMap,U=new WeakSet,ie=function(e,t,r){const a=o(this,j)?new Headers(o(this,j).headers):o(this,Q)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[l,i]of n)l.toLowerCase()==="set-cookie"?a.append(l,i):a.set(l,i)}if(r)for(const[n,l]of Object.entries(r))if(typeof l=="string")a.set(n,l);else{a.delete(n);for(const i of l)a.append(n,i)}const s=typeof t=="number"?t:(t==null?void 0:t.status)??o(this,ce);return ye(e,{status:s,headers:a})},tt),w="ALL",Gt="all",Kt=["get","post","put","delete","options","patch"],ht="Can not add a route since the matcher is already built.",bt=class extends Error{},Vt="__COMPOSED_HANDLER",Wt=e=>e.text("404 Not Found",404),Xe=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},R,E,vt,O,Y,Re,Oe,me,Jt=(me=class{constructor(t={}){f(this,E);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");f(this,R,"/");g(this,"routes",[]);f(this,O,Wt);g(this,"errorHandler",Xe);g(this,"onError",t=>(this.errorHandler=t,this));g(this,"notFound",t=>(m(this,O,t),this));g(this,"fetch",(t,...r)=>b(this,E,Oe).call(this,t,r[1],r[0],t.method));g(this,"request",(t,r,a,s)=>t instanceof Request?this.fetch(r?new Request(t,r):t,a,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${J("/",t)}`,r),a,s)));g(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(b(this,E,Oe).call(this,t.request,t,void 0,t.request.method))})});[...Kt,Gt].forEach(n=>{this[n]=(l,...i)=>(typeof l=="string"?m(this,R,l):b(this,E,Y).call(this,n,o(this,R),l),i.forEach(d=>{b(this,E,Y).call(this,n,o(this,R),d)}),this)}),this.on=(n,l,...i)=>{for(const d of[l].flat()){m(this,R,d);for(const c of[n].flat())i.map(p=>{b(this,E,Y).call(this,c.toUpperCase(),o(this,R),p)})}return this},this.use=(n,...l)=>(typeof n=="string"?m(this,R,n):(m(this,R,"*"),l.unshift(n)),l.forEach(i=>{b(this,E,Y).call(this,w,o(this,R),i)}),this);const{strict:a,...s}=t;Object.assign(this,s),this.getPath=a??!0?t.getPath??lt:Ht}route(t,r){const a=this.basePath(t);return r.routes.map(s=>{var l;let n;r.errorHandler===Xe?n=s.handler:(n=async(i,d)=>(await Je([],r.errorHandler)(i,()=>s.handler(i,d))).res,n[Vt]=s.handler),b(l=a,E,Y).call(l,s.method,s.path,n,s.basePath)}),this}basePath(t){const r=b(this,E,vt).call(this);return r._basePath=J(this._basePath,t),r}mount(t,r,a){let s,n;a&&(typeof a=="function"?n=a:(n=a.optionHandler,a.replaceRequest===!1?s=d=>d:s=a.replaceRequest));const l=n?d=>{const c=n(d);return Array.isArray(c)?c:[c]}:d=>{let c;try{c=d.executionCtx}catch{}return[d.env,c]};s||(s=(()=>{const d=J(this._basePath,t),c=d==="/"?0:d.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(c)||"/",new Request(u,p)}})());const i=async(d,c)=>{const p=await r(s(d.req.raw),...l(d));if(p)return p;await c()};return b(this,E,Y).call(this,w,J(t,"*"),i),this}},R=new WeakMap,E=new WeakSet,vt=function(){const t=new me({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,m(t,O,o(this,O)),t.routes=this.routes,t},O=new WeakMap,Y=function(t,r,a,s){t=t.toUpperCase(),r=J(this._basePath,r);const n={basePath:s!==void 0?J(this._basePath,s):this._basePath,path:r,method:t,handler:a};this.router.add(t,r,[a,n]),this.routes.push(n)},Re=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},Oe=function(t,r,a,s){if(s==="HEAD")return(async()=>new Response(null,await b(this,E,Oe).call(this,t,r,a,"GET")))();const n=this.getPath(t,{env:a}),l=this.router.match(s,n),i=new Ut(t,{path:n,matchResult:l,env:a,executionCtx:r,notFoundHandler:o(this,O)});if(l[0].length===1){let c;try{c=l[0][0][0][0](i,async()=>{i.res=await o(this,O).call(this,i)})}catch(p){return b(this,E,Re).call(this,p,i)}return c instanceof Promise?c.then(p=>p||(i.finalized?i.res:o(this,O).call(this,i))).catch(p=>b(this,E,Re).call(this,p,i)):c??o(this,O).call(this,i)}const d=Je(l[0],this.errorHandler,o(this,O));return(async()=>{try{const c=await d(i);if(!c.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return b(this,E,Re).call(this,c,i)}})()},me),yt=[];function Yt(e,t){const r=this.buildAllMatchers(),a=(s,n)=>{const l=r[s]||r[w],i=l[2][n];if(i)return i;const d=n.match(l[0]);if(!d)return[[],yt];const c=d.indexOf("",1);return[l[1][c],d]};return this.match=a,a(e,t)}var Le="[^/]+",we=".*",Ee="(?:|/.*)",le=Symbol(),Xt=new Set(".\\+*[^]$()");function Qt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===we||e===Ee?1:t===we||t===Ee?-1:e===Le?1:t===Le?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Z,ee,P,ae,Zt=(ae=class{constructor(){f(this,Z);f(this,ee);f(this,P,Object.create(null))}insert(t,r,a,s,n){if(t.length===0){if(o(this,Z)!==void 0)throw le;if(n)return;m(this,Z,r);return}const[l,...i]=t,d=l==="*"?i.length===0?["","",we]:["","",Le]:l==="/*"?["","",Ee]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let c;if(d){const p=d[1];let u=d[2]||Le;if(p&&d[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw le;if(c=o(this,P)[u],!c){if(Object.keys(o(this,P)).some(h=>h!==we&&h!==Ee))throw le;if(n)return;c=o(this,P)[u]=new ae,p!==""&&m(c,ee,s.varIndex++)}!n&&p!==""&&a.push([p,o(c,ee)])}else if(c=o(this,P)[l],!c){if(Object.keys(o(this,P)).some(p=>p.length>1&&p!==we&&p!==Ee))throw le;if(n)return;c=o(this,P)[l]=new ae}c.insert(i,r,a,s,n)}buildRegExpStr(){const r=Object.keys(o(this,P)).sort(Qt).map(a=>{const s=o(this,P)[a];return(typeof o(s,ee)=="number"?`(${a})@${o(s,ee)}`:Xt.has(a)?`\\${a}`:a)+s.buildRegExpStr()});return typeof o(this,Z)=="number"&&r.unshift(`#${o(this,Z)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Z=new WeakMap,ee=new WeakMap,P=new WeakMap,ae),$e,Ie,rt,er=(rt=class{constructor(){f(this,$e,{varIndex:0});f(this,Ie,new Zt)}insert(e,t,r){const a=[],s=[];for(let l=0;;){let i=!1;if(e=e.replace(/\{[^}]+\}/g,d=>{const c=`@\\${l}`;return s[l]=[c,d],l++,i=!0,c}),!i)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let l=s.length-1;l>=0;l--){const[i]=s[l];for(let d=n.length-1;d>=0;d--)if(n[d].indexOf(i)!==-1){n[d]=n[d].replace(i,s[l][1]);break}}return o(this,Ie).insert(n,t,a,o(this,$e),r),a}buildRegExp(){let e=o(this,Ie).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],a=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,n,l)=>n!==void 0?(r[++t]=Number(n),"$()"):(l!==void 0&&(a[Number(l)]=++t),"")),[new RegExp(`^${e}`),r,a]}},$e=new WeakMap,Ie=new WeakMap,rt),tr=[/^$/,[],Object.create(null)],Pe=Object.create(null);function xt(e){return Pe[e]??(Pe[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function rr(){Pe=Object.create(null)}function ar(e){var c;const t=new er,r=[];if(e.length===0)return tr;const a=e.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[h,y])=>p?1:h?-1:u.length-y.length),s=Object.create(null);for(let p=0,u=-1,h=a.length;p<h;p++){const[y,v,C]=a[p];y?s[v]=[C.map(([T])=>[T,Object.create(null)]),yt]:u++;let A;try{A=t.insert(v,u,y)}catch(T){throw T===le?new bt(v):T}y||(r[u]=C.map(([T,x])=>{const L=Object.create(null);for(x-=1;x>=0;x--){const[he,Ne]=A[x];L[he]=Ne}return[T,L]}))}const[n,l,i]=t.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let h=0,y=r[p].length;h<y;h++){const v=(c=r[p][h])==null?void 0:c[1];if(!v)continue;const C=Object.keys(v);for(let A=0,T=C.length;A<T;A++)v[C[A]]=i[v[C[A]]]}const d=[];for(const p in l)d[p]=r[l[p]];return[n,d,s]}function oe(e,t){if(e){for(const r of Object.keys(e).sort((a,s)=>s.length-a.length))if(xt(r).test(t))return[...e[r]]}}var G,K,Me,wt,at,sr=(at=class{constructor(){f(this,Me);g(this,"name","RegExpRouter");f(this,G);f(this,K);g(this,"match",Yt);m(this,G,{[w]:Object.create(null)}),m(this,K,{[w]:Object.create(null)})}add(e,t,r){var i;const a=o(this,G),s=o(this,K);if(!a||!s)throw new Error(ht);a[e]||[a,s].forEach(d=>{d[e]=Object.create(null),Object.keys(d[w]).forEach(c=>{d[e][c]=[...d[w][c]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const d=xt(t);e===w?Object.keys(a).forEach(c=>{var p;(p=a[c])[t]||(p[t]=oe(a[c],t)||oe(a[w],t)||[])}):(i=a[e])[t]||(i[t]=oe(a[e],t)||oe(a[w],t)||[]),Object.keys(a).forEach(c=>{(e===w||e===c)&&Object.keys(a[c]).forEach(p=>{d.test(p)&&a[c][p].push([r,n])})}),Object.keys(s).forEach(c=>{(e===w||e===c)&&Object.keys(s[c]).forEach(p=>d.test(p)&&s[c][p].push([r,n]))});return}const l=dt(t)||[t];for(let d=0,c=l.length;d<c;d++){const p=l[d];Object.keys(s).forEach(u=>{var h;(e===w||e===u)&&((h=s[u])[p]||(h[p]=[...oe(a[u],p)||oe(a[w],p)||[]]),s[u][p].push([r,n-c+d+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(o(this,K)).concat(Object.keys(o(this,G))).forEach(t=>{e[t]||(e[t]=b(this,Me,wt).call(this,t))}),m(this,G,m(this,K,void 0)),rr(),e}},G=new WeakMap,K=new WeakMap,Me=new WeakSet,wt=function(e){const t=[];let r=e===w;return[o(this,G),o(this,K)].forEach(a=>{const s=a[e]?Object.keys(a[e]).map(n=>[n,a[e][n]]):[];s.length!==0?(r||(r=!0),t.push(...s)):e!==w&&t.push(...Object.keys(a[w]).map(n=>[n,a[w][n]]))}),r?ar(t):null},at),V,B,st,nr=(st=class{constructor(e){g(this,"name","SmartRouter");f(this,V,[]);f(this,B,[]);m(this,V,e.routers)}add(e,t,r){if(!o(this,B))throw new Error(ht);o(this,B).push([e,t,r])}match(e,t){if(!o(this,B))throw new Error("Fatal error");const r=o(this,V),a=o(this,B),s=r.length;let n=0,l;for(;n<s;n++){const i=r[n];try{for(let d=0,c=a.length;d<c;d++)i.add(...a[d]);l=i.match(e,t)}catch(d){if(d instanceof bt)continue;throw d}this.match=i.match.bind(i),m(this,V,[i]),m(this,B,void 0);break}if(n===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,l}get activeRouter(){if(o(this,B)||o(this,V).length!==1)throw new Error("No active router has been determined yet.");return o(this,V)[0]}},V=new WeakMap,B=new WeakMap,st),xe=Object.create(null),or=e=>{for(const t in e)return!0;return!1},W,S,te,ge,k,H,X,fe,ir=(fe=class{constructor(t,r,a){f(this,H);f(this,W);f(this,S);f(this,te);f(this,ge,0);f(this,k,xe);if(m(this,S,a||Object.create(null)),m(this,W,[]),t&&r){const s=Object.create(null);s[t]={handler:r,possibleKeys:[],score:0},m(this,W,[s])}m(this,te,[])}insert(t,r,a){m(this,ge,++We(this,ge)._);let s=this;const n=Mt(r),l=[];for(let i=0,d=n.length;i<d;i++){const c=n[i],p=n[i+1],u=Bt(c,p),h=Array.isArray(u)?u[0]:c;if(h in o(s,S)){s=o(s,S)[h],u&&l.push(u[1]);continue}o(s,S)[h]=new fe,u&&(o(s,te).push(u),l.push(u[1])),s=o(s,S)[h]}return o(s,W).push({[t]:{handler:a,possibleKeys:l.filter((i,d,c)=>c.indexOf(i)===d),score:o(this,ge)}}),s}search(t,r){var p;const a=[];m(this,k,xe);let n=[this];const l=ot(r),i=[],d=l.length;let c=null;for(let u=0;u<d;u++){const h=l[u],y=u===d-1,v=[];for(let A=0,T=n.length;A<T;A++){const x=n[A],L=o(x,S)[h];L&&(m(L,k,o(x,k)),y?(o(L,S)["*"]&&b(this,H,X).call(this,a,o(L,S)["*"],t,o(x,k)),b(this,H,X).call(this,a,L,t,o(x,k))):v.push(L));for(let he=0,Ne=o(x,te).length;he<Ne;he++){const Ge=o(x,te)[he],q=o(x,k)===xe?{}:{...o(x,k)};if(Ge==="*"){const se=o(x,S)["*"];se&&(b(this,H,X).call(this,a,se,t,o(x,k)),m(se,k,q),v.push(se));continue}const[jt,Ke,be]=Ge;if(!h&&!(be instanceof RegExp))continue;const $=o(x,S)[jt];if(be instanceof RegExp){if(c===null){c=new Array(d);let ne=r[0]==="/"?1:0;for(let ve=0;ve<d;ve++)c[ve]=ne,ne+=l[ve].length+1}const se=r.substring(c[u]),ze=be.exec(se);if(ze){if(q[Ke]=ze[0],b(this,H,X).call(this,a,$,t,o(x,k),q),or(o($,S))){m($,k,q);const ne=((p=ze[0].match(/\//))==null?void 0:p.length)??0;(i[ne]||(i[ne]=[])).push($)}continue}}(be===!0||be.test(h))&&(q[Ke]=h,y?(b(this,H,X).call(this,a,$,t,q,o(x,k)),o($,S)["*"]&&b(this,H,X).call(this,a,o($,S)["*"],t,q,o(x,k))):(m($,k,q),v.push($)))}}const C=i.shift();n=C?v.concat(C):v}return a.length>1&&a.sort((u,h)=>u.score-h.score),[a.map(({handler:u,params:h})=>[u,h])]}},W=new WeakMap,S=new WeakMap,te=new WeakMap,ge=new WeakMap,k=new WeakMap,H=new WeakSet,X=function(t,r,a,s,n){for(let l=0,i=o(r,W).length;l<i;l++){const d=o(r,W)[l],c=d[a]||d[w],p={};if(c!==void 0&&(c.params=Object.create(null),t.push(c),s!==xe||n&&n!==xe))for(let u=0,h=c.possibleKeys.length;u<h;u++){const y=c.possibleKeys[u],v=p[c.score];c.params[y]=n!=null&&n[y]&&!v?n[y]:s[y]??(n==null?void 0:n[y]),p[c.score]=!0}}},fe),re,nt,lr=(nt=class{constructor(){g(this,"name","TrieRouter");f(this,re);m(this,re,new ir)}add(e,t,r){const a=dt(t);if(a){for(let s=0,n=a.length;s<n;s++)o(this,re).insert(e,a[s],r);return}o(this,re).insert(e,t,r)}match(e,t){return o(this,re).search(e,t)}},re=new WeakMap,nt),Et=class extends Jt{constructor(e={}){super(e),this.router=e.router??new nr({routers:[new sr,new lr]})}},dr=e=>{const t={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...e},r=(s=>typeof s=="string"?s==="*"?()=>s:n=>s===n?n:null:typeof s=="function"?s:n=>s.includes(n)?n:null)(t.origin),a=(s=>typeof s=="function"?s:Array.isArray(s)?()=>s:()=>[])(t.allowMethods);return async function(n,l){var c;function i(p,u){n.res.headers.set(p,u)}const d=await r(n.req.header("origin")||"",n);if(d&&i("Access-Control-Allow-Origin",d),t.credentials&&i("Access-Control-Allow-Credentials","true"),(c=t.exposeHeaders)!=null&&c.length&&i("Access-Control-Expose-Headers",t.exposeHeaders.join(",")),n.req.method==="OPTIONS"){t.origin!=="*"&&i("Vary","Origin"),t.maxAge!=null&&i("Access-Control-Max-Age",t.maxAge.toString());const p=await a(n.req.header("origin")||"",n);p.length&&i("Access-Control-Allow-Methods",p.join(","));let u=t.allowHeaders;if(!(u!=null&&u.length)){const h=n.req.header("Access-Control-Request-Headers");h&&(u=h.split(/\s*,\s*/))}return u!=null&&u.length&&(i("Access-Control-Allow-Headers",u.join(",")),n.res.headers.append("Vary","Access-Control-Request-Headers")),n.res.headers.delete("Content-Length"),n.res.headers.delete("Content-Type"),new Response(null,{headers:n.res.headers,status:204,statusText:"No Content"})}await l(),t.origin!=="*"&&n.header("Vary","Origin",{append:!0})}},cr=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|msgpack|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|vnd\.msgpack|wasm|x-httpd-php|x-javascript|x-msgpack|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml|msgpack))(?:[;\s]|$)/i,Qe=(e,t=ur)=>{const r=/\.([a-zA-Z0-9]+?)$/,a=e.match(r);if(a)return t[a[1].toLowerCase()]},pr={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css; charset=utf-8",csv:"text/csv; charset=utf-8",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html; charset=utf-8",html:"text/html; charset=utf-8",ico:"image/x-icon",ics:"text/calendar; charset=utf-8",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript; charset=utf-8",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript; charset=utf-8",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml; charset=utf-8",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain; charset=utf-8",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml; charset=utf-8",xml:"application/xml; charset=utf-8",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},ur=pr,mr=(...e)=>{let t=e.filter(s=>s!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const r=t.split("/"),a=[];for(const s of r)s===".."&&a.length>0&&a.at(-1)!==".."?a.pop():s!=="."&&a.push(s);return a.join("/")||"."},At={br:".br",zstd:".zst",gzip:".gz"},gr=Object.keys(At),fr="index.html",hr=e=>{const t=e.root??"./",r=e.path,a=e.join??mr;return async(s,n)=>{var p,u,h,y;if(s.finalized)return n();let l;if(e.path)l=e.path;else try{if(l=it(s.req.path),/(?:^|[\/\\])\.{1,2}(?:$|[\/\\])|[\/\\]{2,}|\\/.test(l))throw new Error}catch{return await((p=e.onNotFound)==null?void 0:p.call(e,s.req.path,s)),n()}let i=a(t,!r&&e.rewriteRequestPath?e.rewriteRequestPath(l):l);e.isDir&&await e.isDir(i)&&(i=a(i,fr));const d=e.getContent;let c=await d(i,s);if(c instanceof Response)return s.newResponse(c.body,c);if(c){const v=e.mimes&&Qe(i,e.mimes)||Qe(i);if(s.header("Content-Type",v||"application/octet-stream"),e.precompressed&&(!v||cr.test(v))){const C=new Set((u=s.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(A=>A.trim()));for(const A of gr){if(!C.has(A))continue;const T=await d(i+At[A],s);if(T){c=T,s.header("Content-Encoding",A),s.header("Vary","Accept-Encoding",{append:!0});break}}}return await((h=e.onFound)==null?void 0:h.call(e,i,s)),s.body(c)}await((y=e.onNotFound)==null?void 0:y.call(e,i,s)),await n()}},br=async(e,t)=>{let r;t&&t.manifest?typeof t.manifest=="string"?r=JSON.parse(t.manifest):r=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?r=JSON.parse(__STATIC_CONTENT_MANIFEST):r=__STATIC_CONTENT_MANIFEST;let a;t&&t.namespace?a=t.namespace:a=__STATIC_CONTENT;const s=r[e];if(!s)return null;const n=await a.get(s,{type:"stream"});return n||null},vr=(e={})=>async function(r,a){return hr({...e,getContent:async n=>br(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:r.env?r.env.__STATIC_CONTENT:void 0})})(r,a)},yr=e=>vr(e);const _=new Et;_.use("/api/*",dr());_.use("/static/*",yr({root:"./public"}));const F={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6"};async function Fe(e,t,r,a){return(await e.run(t,{messages:[{role:"system",content:r},{role:"user",content:a}],max_tokens:1024})).response??"(sem resposta)"}const Ue={researcher:{name:"Pesquisador",emoji:"🔍",color:"#6C63FF",model:F.balanced,desc:"Pesquisa e estrutura informações relevantes sobre o tema",system:`Você é um agente pesquisador especialista. Sua função é analisar o tema fornecido e:
1. Identificar os pontos-chave mais relevantes
2. Estruturar as informações de forma clara
3. Listar fatos, dados e contexto importante
4. Preparar o material para os outros agentes

Responda em português brasileiro. Seja detalhado e preciso. Formate com markdown.`},writer:{name:"Redator",emoji:"✍️",color:"#06B6D4",model:F.powerful,desc:"Cria conteúdo textual persuasivo e bem estruturado",system:`Você é um agente redator especialista em conteúdo de alta qualidade. Sua função é:
1. Criar texto persuasivo, claro e envolvente
2. Adaptar o tom ao contexto (profissional, criativo, técnico)
3. Estruturar o conteúdo com introdução, desenvolvimento e conclusão
4. Usar linguagem natural e fluente

Responda em português brasileiro. Use markdown para formatação. Seja criativo e preciso.`},analyst:{name:"Analista",emoji:"📊",color:"#F59E0B",model:F.reason,desc:"Analisa dados, identifica padrões e gera insights",system:`Você é um agente analista de dados e negócios. Sua função é:
1. Analisar profundamente o problema ou dados fornecidos
2. Identificar padrões, tendências e anomalias
3. Gerar insights acionáveis e recomendações
4. Apresentar análise SWOT quando relevante
5. Propor métricas e KPIs

Responda em português brasileiro. Use estrutura analítica clara com bullet points e números.`},coder:{name:"Desenvolvedor",emoji:"💻",color:"#EF4444",model:F.coder,desc:"Escreve código limpo e funcional em qualquer linguagem",system:`Você é um agente desenvolvedor sênior especialista. Sua função é:
1. Escrever código limpo, eficiente e bem comentado
2. Seguir boas práticas e padrões do mercado
3. Criar soluções escaláveis e maintíveis
4. Documentar o código adequadamente
5. Identificar possíveis bugs e sugerir melhorias

Responda em português brasileiro. Sempre inclua blocos de código formatados com a linguagem correta.`},reviewer:{name:"Revisor",emoji:"🛡️",color:"#10B981",model:F.balanced,desc:"Revisa, critica e melhora o trabalho dos outros agentes",system:`Você é um agente revisor crítico e criterioso. Sua função é:
1. Revisar o conteúdo recebido com olhar crítico
2. Identificar erros, inconsistências e pontos de melhoria
3. Sugerir correções específicas e construtivas
4. Avaliar qualidade, clareza e precisão
5. Dar uma nota de 0-10 para o trabalho revisado

Responda em português brasileiro. Seja honesto, construtivo e específico nas sugestões.`},orchestrator:{name:"Orquestrador",emoji:"🎯",color:"#8B5CF6",model:F.kimi,desc:"Coordena todos os agentes e entrega o resultado final consolidado",system:`Você é o agente orquestrador principal de um sistema multiagente. Sua função é:
1. Analisar as saídas de todos os agentes anteriores
2. Identificar os melhores pontos de cada contribuição
3. Eliminar redundâncias e conflitos
4. Criar uma síntese coesa, completa e de alta qualidade
5. Entregar o resultado final consolidado e polido

Responda em português brasileiro. O resultado deve ser o melhor possível, integrando todas as perspectivas. Use markdown rico.`}};_.get("/api/agents",e=>{const t=Object.entries(Ue).map(([r,a])=>({id:r,name:a.name,emoji:a.emoji,color:a.color,desc:a.desc,model:a.model}));return e.json({agents:t})});_.post("/api/agent/:id",async e=>{const t=e.req.param("id"),r=Ue[t];if(!r)return e.json({error:"Agente não encontrado"},404);const{prompt:a,context:s}=await e.req.json();if(!a)return e.json({error:"Prompt obrigatório"},400);const n=s?`CONTEXTO DOS AGENTES ANTERIORES:
${s}

---
TAREFA ATUAL: ${a}`:a;try{const l=await Fe(e.env.AI,r.model,r.system,n);return e.json({agent:{id:t,name:r.name,emoji:r.emoji,color:r.color},model:r.model,response:l,timestamp:new Date().toISOString()})}catch(l){return e.json({error:l.message??"Erro interno"},500)}});_.post("/api/pipeline",async e=>{const{prompt:t,agents:r}=await e.req.json();if(!t)return e.json({error:"Prompt obrigatório"},400);const a=r&&r.length>0?r:["researcher","writer","analyst","reviewer","orchestrator"],s=[];let n="";for(const l of a){const i=Ue[l];if(!i)continue;const d=Date.now(),c=n?`CONTEXTO ACUMULADO:
${n}

---
TAREFA: ${t}`:t;try{const p=await Fe(e.env.AI,i.model,i.system,c),u=Date.now()-d;s.push({agentId:l,name:i.name,emoji:i.emoji,color:i.color,model:i.model,response:p,duration:u}),n+=`

=== ${i.emoji} ${i.name.toUpperCase()} ===
${p}`}catch(p){s.push({agentId:l,name:i.name,emoji:i.emoji,color:i.color,model:i.model,response:`❌ Erro: ${p.message??"falha desconhecida"}`,duration:Date.now()-d})}}return e.json({prompt:t,pipeline:a,results:s,totalAgents:s.length,timestamp:new Date().toISOString()})});_.post("/api/chat",async e=>{const{message:t,model:r}=await e.req.json();if(!t)return e.json({error:"Mensagem obrigatória"},400);const a=F[r??"balanced"]??F.balanced;try{const s=await Fe(e.env.AI,a,"Você é um assistente de IA útil e amigável. Responda em português brasileiro de forma clara e útil.",t);return e.json({response:s,model:a,timestamp:new Date().toISOString()})}catch(s){return e.json({error:s.message??"Erro interno"},500)}});_.get("/",e=>e.html(kt()));_.get("*",e=>e.html(kt()));function kt(){return`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>SixTech MAS — Sistema Multiagente IA</title>
  <meta name="description" content="Plataforma de IA Multiagentes powered by Cloudflare Workers AI"/>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"><\/script>
  <style>
    :root{
      --bg:#060912;--bg2:#0d1117;--bg3:#161b22;--bg4:#1c2333;
      --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
      --text:#e6edf3;--muted:#7d8590;--muted2:#6e7681;
      --primary:#6C63FF;--primary2:#4F46E5;
      --cyan:#22d3ee;--amber:#f59e0b;--red:#f87171;--green:#34d399;--purple:#a78bfa;
      --grad:linear-gradient(135deg,#6C63FF 0%,#22d3ee 100%);
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}

    /* ── LAYOUT ── */
    .app{display:grid;grid-template-columns:280px 1fr;grid-template-rows:64px 1fr;min-height:100vh;}
    @media(max-width:900px){.app{grid-template-columns:1fr;}}

    /* ── TOPBAR ── */
    header{
      grid-column:1/-1;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 1.5rem;
      background:rgba(6,9,18,0.95);
      backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
      position:sticky;top:0;z-index:50;
    }
    .logo{
      font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:800;
      background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      display:flex;align-items:center;gap:.5rem;
    }
    .logo i{-webkit-text-fill-color:initial!important;background:none!important;color:var(--primary);}
    .header-right{display:flex;align-items:center;gap:.75rem;}
    .badge-cf{
      display:flex;align-items:center;gap:.4rem;
      background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);
      color:var(--amber);padding:.3rem .75rem;border-radius:999px;font-size:.75rem;font-weight:600;
    }
    .status-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);}}

    /* ── SIDEBAR ── */
    aside{
      background:var(--bg2);border-right:1px solid var(--border);
      padding:1.5rem 1rem;overflow-y:auto;
    }
    @media(max-width:900px){aside{display:none;}}

    .sidebar-section{margin-bottom:1.5rem;}
    .sidebar-label{
      font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      color:var(--muted);margin-bottom:.6rem;padding:0 .5rem;
    }

    /* Nav items */
    .nav-item{
      display:flex;align-items:center;gap:.6rem;
      padding:.6rem .75rem;border-radius:8px;
      cursor:pointer;transition:all .2s;
      font-size:.875rem;font-weight:500;color:var(--muted);
      border:1px solid transparent;
    }
    .nav-item:hover{background:var(--bg3);color:var(--text);}
    .nav-item.active{background:rgba(108,99,255,.12);color:var(--primary);border-color:rgba(108,99,255,.25);}
    .nav-item i{width:16px;text-align:center;}

    /* Agent list in sidebar */
    .agent-pill{
      display:flex;align-items:center;gap:.6rem;
      padding:.5rem .75rem;border-radius:8px;
      font-size:.8rem;font-weight:500;color:var(--muted);
      cursor:pointer;transition:all .2s;
      border:1px solid transparent;
    }
    .agent-pill:hover{background:var(--bg3);color:var(--text);}
    .agent-pill .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
    .agent-pill.selected{border-color:var(--border2);background:var(--bg3);}
    .agent-pill input[type=checkbox]{accent-color:var(--primary);}

    /* ── MAIN ── */
    main{display:flex;flex-direction:column;overflow:hidden;height:calc(100vh - 64px);}

    /* Tabs */
    .tabs{
      display:flex;gap:.25rem;padding:.75rem 1.5rem .5rem;
      border-bottom:1px solid var(--border);background:var(--bg2);flex-shrink:0;
    }
    .tab-btn{
      display:flex;align-items:center;gap:.4rem;
      padding:.45rem 1rem;border-radius:8px;
      font-size:.8rem;font-weight:600;cursor:pointer;
      border:1px solid transparent;color:var(--muted);background:none;
      transition:all .2s;
    }
    .tab-btn:hover{color:var(--text);background:var(--bg3);}
    .tab-btn.active{background:rgba(108,99,255,.15);color:var(--primary);border-color:rgba(108,99,255,.3);}

    /* Content panels */
    .panel{display:none;flex:1;overflow:hidden;flex-direction:column;}
    .panel.active{display:flex;}

    /* ── PIPELINE PANEL ── */
    .pipeline-layout{display:grid;grid-template-columns:1fr 1.4fr;gap:0;flex:1;overflow:hidden;}
    @media(max-width:1100px){.pipeline-layout{grid-template-columns:1fr;}}

    .pipeline-left{
      padding:1.5rem;border-right:1px solid var(--border);
      overflow-y:auto;display:flex;flex-direction:column;gap:1rem;
    }
    .pipeline-right{padding:1.5rem;overflow-y:auto;}

    /* Input area */
    .input-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1.25rem;
    }
    .input-card label{display:block;font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.06em;}
    textarea{
      width:100%;background:var(--bg4);border:1px solid var(--border2);
      border-radius:10px;color:var(--text);font-family:'Inter',sans-serif;font-size:.9rem;
      padding:.75rem 1rem;resize:vertical;min-height:120px;outline:none;transition:border-color .2s;
    }
    textarea:focus{border-color:var(--primary);}
    textarea::placeholder{color:var(--muted2);}

    .run-btn{
      width:100%;padding:.85rem;border-radius:10px;border:none;cursor:pointer;
      background:var(--grad);color:white;font-size:.95rem;font-weight:700;
      display:flex;align-items:center;justify-content:center;gap:.5rem;
      transition:opacity .2s,transform .2s;box-shadow:0 0 24px rgba(108,99,255,.35);
      font-family:'Inter',sans-serif;
    }
    .run-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 36px rgba(108,99,255,.5);}
    .run-btn:disabled{opacity:.5;cursor:not-allowed;}

    /* Agent checkboxes */
    .agents-select{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1rem;}
    .agents-select-title{font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.06em;display:flex;justify-content:space-between;align-items:center;}
    .agents-grid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;}
    .agent-check{
      display:flex;align-items:center;gap:.5rem;
      padding:.45rem .6rem;border-radius:8px;cursor:pointer;
      font-size:.78rem;font-weight:500;color:var(--muted);border:1px solid transparent;transition:all .2s;
    }
    .agent-check:hover{background:var(--bg4);}
    .agent-check.checked{border-color:rgba(108,99,255,.3);background:rgba(108,99,255,.08);color:var(--text);}
    .agent-check input{accent-color:var(--primary);width:13px;height:13px;}
    .agent-emoji{font-size:1rem;}

    /* Results */
    .results-empty{
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      height:100%;gap:1rem;color:var(--muted);text-align:center;
    }
    .results-empty .icon{font-size:3rem;opacity:.3;}

    .result-stream{display:flex;flex-direction:column;gap:1rem;}

    .result-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;overflow:hidden;
      animation:slideIn .4s ease;
    }
    @keyframes slideIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

    .result-header{
      display:flex;align-items:center;justify-content:space-between;
      padding:.85rem 1.1rem;border-bottom:1px solid var(--border);
    }
    .result-agent{display:flex;align-items:center;gap:.6rem;}
    .agent-avatar{
      width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;
      font-size:1rem;flex-shrink:0;
    }
    .result-agent-name{font-weight:700;font-size:.9rem;}
    .result-model{font-size:.7rem;color:var(--muted);font-family:'JetBrains Mono',monospace;}
    .result-meta{display:flex;align-items:center;gap:.5rem;}
    .duration-badge{
      background:var(--bg4);border:1px solid var(--border);
      color:var(--muted);padding:.2rem .5rem;border-radius:6px;font-size:.7rem;font-family:'JetBrains Mono',monospace;
    }
    .copy-btn{
      background:none;border:1px solid var(--border);color:var(--muted);
      padding:.25rem .55rem;border-radius:6px;cursor:pointer;font-size:.75rem;transition:all .2s;
    }
    .copy-btn:hover{border-color:var(--primary);color:var(--primary);}

    .result-body{padding:1.1rem;font-size:.875rem;line-height:1.7;}
    .result-body.loading{color:var(--muted);font-style:italic;display:flex;align-items:center;gap:.5rem;}

    /* Markdown styles */
    .result-body h1,.result-body h2,.result-body h3{font-family:'Space Grotesk',sans-serif;margin:1rem 0 .5rem;color:var(--text);}
    .result-body h1{font-size:1.2rem;}
    .result-body h2{font-size:1.05rem;}
    .result-body h3{font-size:.95rem;}
    .result-body p{margin:.5rem 0;color:#c9d1d9;}
    .result-body ul,.result-body ol{padding-left:1.25rem;margin:.5rem 0;}
    .result-body li{margin:.2rem 0;color:#c9d1d9;}
    .result-body code{
      background:var(--bg4);border:1px solid var(--border2);
      padding:.1rem .35rem;border-radius:4px;font-family:'JetBrains Mono',monospace;
      font-size:.8rem;color:var(--cyan);
    }
    .result-body pre{
      background:var(--bg4);border:1px solid var(--border2);
      border-radius:10px;padding:1rem;overflow-x:auto;margin:.75rem 0;
    }
    .result-body pre code{background:none;border:none;padding:0;color:#e6edf3;font-size:.82rem;}
    .result-body strong{color:var(--text);font-weight:700;}
    .result-body em{color:#a8b4c3;}
    .result-body blockquote{
      border-left:3px solid var(--primary);padding-left:.75rem;margin:.5rem 0;color:var(--muted);font-style:italic;
    }
    .result-body hr{border:none;border-top:1px solid var(--border);margin:1rem 0;}
    .result-body table{width:100%;border-collapse:collapse;margin:.75rem 0;font-size:.82rem;}
    .result-body th{background:var(--bg4);padding:.5rem .75rem;text-align:left;border:1px solid var(--border2);}
    .result-body td{padding:.5rem .75rem;border:1px solid var(--border);}

    /* Pipeline progress */
    .pipeline-progress{
      background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:1rem;
    }
    .progress-title{font-size:.75rem;font-weight:700;color:var(--muted);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.06em;}
    .progress-steps{display:flex;flex-direction:column;gap:.4rem;}
    .progress-step{
      display:flex;align-items:center;gap:.6rem;
      padding:.4rem .5rem;border-radius:8px;font-size:.8rem;font-weight:500;
      color:var(--muted);transition:all .3s;
    }
    .progress-step.active{color:var(--primary);background:rgba(108,99,255,.08);}
    .progress-step.done{color:var(--green);}
    .progress-step.error{color:var(--red);}
    .step-icon{width:20px;text-align:center;font-size:.85rem;}
    .spinner{width:14px;height:14px;border:2px solid rgba(108,99,255,.3);border-top-color:var(--primary);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
    @keyframes spin{to{transform:rotate(360deg);}}

    /* ── CHAT PANEL ── */
    .chat-layout{display:flex;flex-direction:column;flex:1;overflow:hidden;}
    .chat-messages{flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;}
    .chat-input-area{
      padding:1rem 1.5rem;border-top:1px solid var(--border);background:var(--bg2);
      display:flex;gap:.75rem;align-items:flex-end;flex-shrink:0;
    }
    .chat-input-wrap{flex:1;}
    .chat-input{
      width:100%;background:var(--bg3);border:1px solid var(--border2);
      border-radius:12px;color:var(--text);font-family:'Inter',sans-serif;font-size:.9rem;
      padding:.75rem 1rem;resize:none;outline:none;min-height:44px;max-height:140px;
      transition:border-color .2s;
    }
    .chat-input:focus{border-color:var(--primary);}
    .chat-send{
      background:var(--grad);border:none;color:white;padding:.65rem 1.1rem;
      border-radius:12px;cursor:pointer;font-size:1rem;transition:all .2s;flex-shrink:0;
      box-shadow:0 0 16px rgba(108,99,255,.3);
    }
    .chat-send:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(108,99,255,.5);}
    .chat-send:disabled{opacity:.5;cursor:not-allowed;}

    .msg{display:flex;gap:.75rem;max-width:780px;}
    .msg.user{flex-direction:row-reverse;align-self:flex-end;}
    .msg-avatar{
      width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;
      font-size:1rem;flex-shrink:0;font-weight:700;font-size:.85rem;
    }
    .msg-content{
      background:var(--bg3);border:1px solid var(--border);border-radius:12px;
      padding:.75rem 1rem;font-size:.875rem;line-height:1.65;max-width:600px;
    }
    .msg.user .msg-content{
      background:rgba(108,99,255,.12);border-color:rgba(108,99,255,.25);
    }
    .msg-model{font-size:.7rem;color:var(--muted);margin-top:.3rem;font-family:'JetBrains Mono',monospace;}
    .model-select{
      background:var(--bg3);border:1px solid var(--border2);color:var(--text);
      padding:.4rem .75rem;border-radius:8px;font-size:.8rem;outline:none;cursor:pointer;
    }

    /* ── AGENTS PANEL ── */
    .agents-panel{padding:1.5rem;overflow-y:auto;flex:1;}
    .agents-panel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;}
    .agent-detail-card{
      background:var(--bg3);border:1px solid var(--border);border-radius:16px;
      padding:1.5rem;transition:all .3s;
    }
    .agent-detail-card:hover{border-color:var(--border2);transform:translateY(-2px);}
    .agent-card-top{display:flex;align-items:flex-start;gap:.9rem;margin-bottom:1rem;}
    .agent-card-icon{
      width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;
      font-size:1.5rem;flex-shrink:0;
    }
    .agent-card-info h3{font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;margin-bottom:.2rem;}
    .agent-card-info p{color:var(--muted);font-size:.82rem;line-height:1.5;}
    .agent-model-tag{
      display:inline-flex;align-items:center;gap:.3rem;
      background:var(--bg4);border:1px solid var(--border2);
      padding:.25rem .6rem;border-radius:6px;font-family:'JetBrains Mono',monospace;
      font-size:.68rem;color:var(--cyan);margin-top:.75rem;
    }
    .test-agent-btn{
      width:100%;margin-top:.85rem;padding:.55rem;border-radius:8px;border:1px solid var(--border2);
      background:var(--bg4);color:var(--text);cursor:pointer;font-size:.82rem;font-weight:600;
      transition:all .2s;font-family:'Inter',sans-serif;
    }
    .test-agent-btn:hover{border-color:var(--primary);color:var(--primary);}

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:var(--bg);}
    ::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:99px;}

    /* ── TOAST ── */
    .toast{
      position:fixed;bottom:1.5rem;right:1.5rem;
      background:var(--bg3);border:1px solid var(--border2);
      color:var(--text);padding:.75rem 1.25rem;border-radius:10px;
      font-size:.85rem;font-weight:500;z-index:999;
      animation:toastIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);
    }
    @keyframes toastIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

    /* Loading bar */
    .loading-bar{
      height:3px;background:var(--grad);border-radius:99px;
      animation:loadBar 1.2s ease-in-out infinite alternate;
    }
    @keyframes loadBar{from{opacity:.4;width:30%;}to{opacity:1;width:100%;}}
  </style>
</head>
<body>
<div class="app">

  <!-- TOPBAR -->
  <header>
    <div class="logo">
      <i class="fas fa-robot"></i> SixTech MAS
    </div>
    <div class="header-right">
      <div class="badge-cf">
        <i class="fas fa-cloud" style="font-size:.7rem;"></i>
        Cloudflare Workers AI
      </div>
      <div class="badge-cf" style="background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25);color:var(--green);">
        <span class="status-dot"></span> Online
      </div>
    </div>
  </header>

  <!-- SIDEBAR -->
  <aside>
    <div class="sidebar-section">
      <div class="sidebar-label">Navegação</div>
      <div class="nav-item active" onclick="showTab('pipeline')">
        <i class="fas fa-project-diagram"></i> Pipeline Multiagente
      </div>
      <div class="nav-item" onclick="showTab('chat')">
        <i class="fas fa-comments"></i> Chat Direto
      </div>
      <div class="nav-item" onclick="showTab('agents')">
        <i class="fas fa-users-cog"></i> Gerenciar Agentes
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-label">Agentes Disponíveis</div>
      <div id="sidebar-agents"></div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-label">Modelos CF Workers AI</div>
      <div style="font-size:.72rem;color:var(--muted);display:flex;flex-direction:column;gap:.3rem;padding:0 .25rem;">
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.3 70B</span><span>Powerful</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.1 8B</span><span>Balanced</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Qwen 2.5 Coder</span><span>Code</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">DeepSeek R1</span><span>Reasoning</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Kimi K2.6</span><span>Orchestrator</span></div>
        <div style="display:flex;justify-content:space-between;"><span style="color:var(--cyan)">Llama 3.2 3B</span><span>Fast</span></div>
      </div>
    </div>
  </aside>

  <!-- MAIN CONTENT -->
  <main>
    <!-- TABS -->
    <div class="tabs">
      <button class="tab-btn active" id="tab-pipeline" onclick="showTab('pipeline')">
        <i class="fas fa-project-diagram"></i> Pipeline
      </button>
      <button class="tab-btn" id="tab-chat" onclick="showTab('chat')">
        <i class="fas fa-comments"></i> Chat
      </button>
      <button class="tab-btn" id="tab-agents" onclick="showTab('agents')">
        <i class="fas fa-users-cog"></i> Agentes
      </button>
    </div>

    <!-- ═══ PIPELINE PANEL ═══ -->
    <div class="panel active" id="panel-pipeline">
      <div class="pipeline-layout">
        <!-- Left: input + config -->
        <div class="pipeline-left">
          <div class="input-card">
            <label><i class="fas fa-pen" style="margin-right:.4rem;color:var(--primary);"></i>Tarefa para os Agentes</label>
            <textarea id="pipeline-prompt" placeholder="Ex: Crie uma estratégia completa de marketing digital para uma startup de IA em 2025, incluindo análise de mercado, conteúdo e código de landing page..."></textarea>
          </div>

          <div class="agents-select">
            <div class="agents-select-title">
              <span><i class="fas fa-users" style="margin-right:.4rem;color:var(--primary);"></i>Selecionar Agentes</span>
              <span id="sel-count" style="font-size:.7rem;color:var(--primary);">5 selecionados</span>
            </div>
            <div class="agents-grid" id="agents-checkboxes"></div>
          </div>

          <div class="pipeline-progress" id="pipeline-progress" style="display:none;">
            <div class="progress-title"><i class="fas fa-cogs" style="margin-right:.4rem;"></i>Progresso</div>
            <div class="progress-steps" id="progress-steps"></div>
          </div>

          <button class="run-btn" id="run-btn" onclick="runPipeline()">
            <i class="fas fa-play-circle"></i> Executar Pipeline
          </button>
        </div>

        <!-- Right: results -->
        <div class="pipeline-right" id="pipeline-right">
          <div class="results-empty" id="results-empty">
            <div class="icon">🤖</div>
            <div style="font-size:1rem;font-weight:600;color:var(--text);">Pronto para executar</div>
            <div style="font-size:.85rem;">Configure a tarefa e selecione os agentes.<br/>O pipeline executará cada agente em sequência.</div>
          </div>
          <div class="result-stream" id="result-stream" style="display:none;"></div>
        </div>
      </div>
    </div>

    <!-- ═══ CHAT PANEL ═══ -->
    <div class="panel" id="panel-chat">
      <div class="chat-layout">
        <div style="padding:.75rem 1.5rem;border-bottom:1px solid var(--border);background:var(--bg2);display:flex;align-items:center;gap:.75rem;flex-shrink:0;">
          <label style="font-size:.78rem;font-weight:700;color:var(--muted);">MODELO:</label>
          <select class="model-select" id="chat-model">
            <option value="fast">⚡ Llama 3.2 3B — Rápido</option>
            <option value="balanced" selected>⚖️ Llama 3.1 8B — Balanceado</option>
            <option value="powerful">💪 Llama 3.3 70B — Poderoso</option>
            <option value="coder">💻 Qwen 2.5 Coder — Código</option>
            <option value="reason">🧠 DeepSeek R1 — Raciocínio</option>
            <option value="kimi">🌙 Kimi K2.6 — Frontier</option>
          </select>
          <button onclick="clearChat()" style="margin-left:auto;background:none;border:1px solid var(--border);color:var(--muted);padding:.3rem .75rem;border-radius:7px;cursor:pointer;font-size:.78rem;font-family:'Inter',sans-serif;">
            <i class="fas fa-trash-alt"></i> Limpar
          </button>
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="msg">
            <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
            <div>
              <div class="msg-content">
                Olá! Sou o assistente SixTech MAS. Posso responder perguntas, escrever código, analisar dados e muito mais.<br/><br/>
                Para tarefas complexas, use a aba <strong>Pipeline</strong> onde múltiplos agentes especializados colaboram automaticamente. 🚀
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrap">
            <textarea class="chat-input" id="chat-input" rows="1" placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"></textarea>
          </div>
          <button class="chat-send" id="chat-send" onclick="sendChat()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ AGENTS PANEL ═══ -->
    <div class="panel" id="panel-agents">
      <div class="agents-panel">
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;margin-bottom:.4rem;">
            Agentes Disponíveis
          </h2>
          <p style="color:var(--muted);font-size:.875rem;">
            Cada agente é um especialista autônomo rodando em Cloudflare Workers AI.
            Clique em "Testar" para ver o agente em ação.
          </p>
        </div>
        <div class="agents-panel-grid" id="agents-panel-grid"></div>
      </div>
    </div>

  </main>
</div>

<script>
// ──────────────────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────────────────
let agents = []
let selectedAgents = new Set(['researcher','writer','analyst','reviewer','orchestrator'])
let chatHistory = []
let isRunning = false

// ──────────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────────
async function init() {
  try {
    const r = await fetch('/api/agents')
    const d = await r.json()
    agents = d.agents
    renderSidebarAgents()
    renderAgentCheckboxes()
    renderAgentsPanel()
    updateSelCount()
  } catch(e) {
    showToast('⚠️ Erro ao carregar agentes')
  }
}

// ──────────────────────────────────────────────────────────────
// RENDER HELPERS
// ──────────────────────────────────────────────────────────────
function renderSidebarAgents() {
  const el = document.getElementById('sidebar-agents')
  el.innerHTML = agents.map(a => \`
    <div class="agent-pill">
      <span class="dot" style="background:\${a.color}"></span>
      <span>\${a.emoji} \${a.name}</span>
    </div>
  \`).join('')
}

function renderAgentCheckboxes() {
  const el = document.getElementById('agents-checkboxes')
  el.innerHTML = agents.map(a => \`
    <label class="agent-check \${selectedAgents.has(a.id) ? 'checked' : ''}" id="check-\${a.id}" onclick="toggleAgent('\${a.id}')">
      <input type="checkbox" \${selectedAgents.has(a.id) ? 'checked' : ''} onclick="event.stopPropagation()"/>
      <span class="agent-emoji">\${a.emoji}</span>
      <span>\${a.name}</span>
    </label>
  \`).join('')
}

function renderAgentsPanel() {
  const el = document.getElementById('agents-panel-grid')
  el.innerHTML = agents.map(a => \`
    <div class="agent-detail-card">
      <div class="agent-card-top">
        <div class="agent-card-icon" style="background:\${a.color}18;border:1px solid \${a.color}44;">
          \${a.emoji}
        </div>
        <div class="agent-card-info">
          <h3>\${a.name}</h3>
          <p>\${a.desc}</p>
        </div>
      </div>
      <div class="agent-model-tag">
        <i class="fas fa-microchip" style="font-size:.65rem;"></i>
        \${a.model}
      </div>
      <button class="test-agent-btn" onclick="testAgent('\${a.id}')">
        <i class="fas fa-flask"></i> Testar Agente
      </button>
    </div>
  \`).join('')
}

function updateSelCount() {
  document.getElementById('sel-count').textContent = selectedAgents.size + ' selecionados'
}

// ──────────────────────────────────────────────────────────────
// TABS
// ──────────────────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.getElementById('panel-' + name).classList.add('active')
  document.getElementById('tab-' + name).classList.add('active')
}

// ──────────────────────────────────────────────────────────────
// AGENT SELECTION
// ──────────────────────────────────────────────────────────────
function toggleAgent(id) {
  if (selectedAgents.has(id)) selectedAgents.delete(id)
  else selectedAgents.add(id)
  renderAgentCheckboxes()
  updateSelCount()
}

// ──────────────────────────────────────────────────────────────
// PIPELINE
// ──────────────────────────────────────────────────────────────
async function runPipeline() {
  const prompt = document.getElementById('pipeline-prompt').value.trim()
  if (!prompt) { showToast('⚠️ Digite uma tarefa primeiro!'); return }
  if (selectedAgents.size === 0) { showToast('⚠️ Selecione pelo menos um agente!'); return }
  if (isRunning) return

  isRunning = true
  const runBtn = document.getElementById('run-btn')
  runBtn.disabled = true
  runBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-color:rgba(255,255,255,.3);border-top-color:white;"></span> Executando...'

  // Clear results
  const empty = document.getElementById('results-empty')
  const stream = document.getElementById('result-stream')
  empty.style.display = 'none'
  stream.style.display = 'flex'
  stream.innerHTML = ''

  // Show progress
  const progressBox = document.getElementById('pipeline-progress')
  const progressSteps = document.getElementById('progress-steps')
  progressBox.style.display = 'block'

  const agentList = [...selectedAgents]
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]))

  // Init progress steps
  progressSteps.innerHTML = agentList.map(id => {
    const a = agentMap[id]
    if (!a) return ''
    return \`<div class="progress-step" id="step-\${id}">
      <span class="step-icon">\${a.emoji}</span>
      <span>\${a.name}</span>
      <span style="margin-left:auto;font-size:.7rem;opacity:.6;">\${a.model.split('/').pop()}</span>
    </div>\`
  }).join('')

  // Show loading cards
  agentList.forEach(id => {
    const a = agentMap[id]
    if (!a) return
    stream.innerHTML += \`
      <div class="result-card" id="card-\${id}">
        <div class="result-header">
          <div class="result-agent">
            <div class="agent-avatar" style="background:\${a.color}18;border:1px solid \${a.color}44;">\${a.emoji}</div>
            <div>
              <div class="result-agent-name">\${a.name}</div>
              <div class="result-model">\${a.model}</div>
            </div>
          </div>
          <div class="result-meta">
            <div class="duration-badge" id="dur-\${id}">—</div>
          </div>
        </div>
        <div class="result-body loading" id="body-\${id}">
          <div class="loading-bar" style="width:100%;"></div>
          Aguardando...
        </div>
      </div>
    \`
  })

  // Call API (full pipeline at once - server handles sequencing)
  try {
    // Mark first as active
    setStepStatus(agentList[0], 'active')
    document.getElementById('body-' + agentList[0]).innerHTML = '<div class="loading-bar" style="width:100%;"></div> Processando...'

    const res = await fetch('/api/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, agents: agentList })
    })

    if (!res.ok) throw new Error('Erro HTTP ' + res.status)
    const data = await res.json()

    // Update each card with results
    data.results.forEach((r, i) => {
      const card = document.getElementById('card-' + r.agentId)
      const body = document.getElementById('body-' + r.agentId)
      const dur  = document.getElementById('dur-' + r.agentId)

      if (body) {
        body.classList.remove('loading')
        body.innerHTML = typeof marked !== 'undefined'
          ? marked.parse(r.response)
          : r.response.replace(/\\n/g, '<br/>')
      }
      if (dur) dur.textContent = (r.duration / 1000).toFixed(1) + 's'
      if (card) {
        // Add copy button
        const meta = card.querySelector('.result-meta')
        if (meta) {
          meta.innerHTML = \`
            <div class="duration-badge">\${(r.duration/1000).toFixed(1)}s</div>
            <button class="copy-btn" onclick="copyResult('\${r.agentId}')"><i class="fas fa-copy"></i></button>
          \`
        }
        // Color border on done
        card.style.borderColor = r.agentId === 'orchestrator' ? 'rgba(167,139,250,.35)' : ''
      }

      setStepStatus(r.agentId, r.response.startsWith('❌') ? 'error' : 'done')
      if (i + 1 < agentList.length) setStepStatus(agentList[i+1], 'active')
    })

    showToast('✅ Pipeline concluído com sucesso!')
  } catch(e) {
    showToast('❌ Erro: ' + e.message)
    agentList.forEach(id => {
      const body = document.getElementById('body-' + id)
      if (body && body.classList.contains('loading')) {
        body.innerHTML = '❌ Erro ao executar'
        body.classList.remove('loading')
        setStepStatus(id, 'error')
      }
    })
  }

  isRunning = false
  runBtn.disabled = false
  runBtn.innerHTML = '<i class="fas fa-play-circle"></i> Executar Pipeline'
}

function setStepStatus(id, status) {
  const step = document.getElementById('step-' + id)
  if (!step) return
  step.className = 'progress-step ' + status
  const icon = step.querySelector('.step-icon')
  if (status === 'active' && icon) {
    icon.innerHTML = '<span class="spinner"></span>'
  }
  if (status === 'done' && icon) {
    const a = agents.find(x => x.id === id)
    if (a) icon.textContent = a.emoji
    step.querySelector('.step-icon').style.color = 'var(--green)'
  }
  if (status === 'error' && icon) icon.textContent = '❌'
}

// ──────────────────────────────────────────────────────────────
// COPY
// ──────────────────────────────────────────────────────────────
function copyResult(agentId) {
  const body = document.getElementById('body-' + agentId)
  if (!body) return
  navigator.clipboard.writeText(body.innerText)
  showToast('📋 Copiado!')
}

// ──────────────────────────────────────────────────────────────
// CHAT
// ──────────────────────────────────────────────────────────────
async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg || document.getElementById('chat-send').disabled) return

  const model = document.getElementById('chat-model').value
  input.value = ''
  autoResize(input)

  // Add user msg
  addChatMsg('user', msg, null)

  // Disable send
  document.getElementById('chat-send').disabled = true

  // Add AI loading msg
  const loadId = 'msg-' + Date.now()
  const msgs = document.getElementById('chat-messages')
  msgs.innerHTML += \`
    <div class="msg" id="\${loadId}">
      <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
      <div>
        <div class="msg-content"><div class="loading-bar" style="width:120px;"></div></div>
      </div>
    </div>
  \`
  msgs.scrollTop = msgs.scrollHeight

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: msg, model })
    })
    const data = await res.json()

    const loadEl = document.getElementById(loadId)
    if (loadEl) loadEl.remove()

    addChatMsg('ai', data.response || data.error || 'Sem resposta', data.model)
  } catch(e) {
    const loadEl = document.getElementById(loadId)
    if (loadEl) loadEl.remove()
    addChatMsg('ai', '❌ Erro de conexão: ' + e.message, null)
  }

  document.getElementById('chat-send').disabled = false
}

function addChatMsg(role, text, model) {
  const msgs = document.getElementById('chat-messages')
  const isUser = role === 'user'
  const parsed = typeof marked !== 'undefined' && !isUser ? marked.parse(text) : text.replace(/\\n/g,'<br/>')
  msgs.innerHTML += \`
    <div class="msg \${isUser ? 'user' : ''}">
      <div class="msg-avatar" style="\${isUser 
        ? 'background:rgba(34,211,238,.15);border:1px solid rgba(34,211,238,.3);color:var(--cyan);' 
        : 'background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);'}">\${isUser ? '👤' : '🤖'}</div>
      <div>
        <div class="msg-content result-body">\${parsed}</div>
        \${model ? \`<div class="msg-model">\${model}</div>\` : ''}
      </div>
    </div>
  \`
  msgs.scrollTop = msgs.scrollHeight
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = \`
    <div class="msg">
      <div class="msg-avatar" style="background:rgba(108,99,255,.15);border:1px solid rgba(108,99,255,.3);">🤖</div>
      <div><div class="msg-content">Chat limpo. Como posso ajudar? 🚀</div></div>
    </div>
  \`
}

// ──────────────────────────────────────────────────────────────
// TEST AGENT (from agents panel)
// ──────────────────────────────────────────────────────────────
async function testAgent(agentId) {
  const a = agents.find(x => x.id === agentId)
  if (!a) return
  const prompt = prompt_default_for(agentId)
  showTab('pipeline')
  document.getElementById('pipeline-prompt').value = prompt
  selectedAgents = new Set([agentId])
  renderAgentCheckboxes()
  updateSelCount()
  await runPipeline()
}

function prompt_default_for(id) {
  const map = {
    researcher: 'Pesquise sobre as tendências de IA generativa para 2025 e liste os principais modelos e frameworks.',
    writer: 'Escreva um artigo introdutório sobre Sistemas de IA Multiagentes para um blog de tecnologia.',
    analyst: 'Analise o mercado de ferramentas de IA para empresas em 2025 e identifique as principais oportunidades.',
    coder: 'Crie uma função JavaScript que faz chamadas a uma API REST com retry automático e tratamento de erros.',
    reviewer: 'Revise e melhore este texto: "IA é muito bom para empresas. Pode ajudar muito. Todo mundo devia usar mais IA nas suas coisas."',
    orchestrator: 'Crie um plano estratégico completo para implementar IA multiagente em uma empresa de médio porte.'
  }
  return map[id] || 'Olá! Apresente-se e explique sua especialidade.'
}

// ──────────────────────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div')
  t.className = 'toast'
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}

function autoResize(el) {
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

// Enter to send in chat
document.addEventListener('DOMContentLoaded', () => {
  const ci = document.getElementById('chat-input')
  if (ci) {
    ci.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() }
    })
    ci.addEventListener('input', () => autoResize(ci))
  }
  init()
})
<\/script>
</body>
</html>`}const Ze=new Et,xr=Object.assign({"/src/index.tsx":_});let St=!1;for(const[,e]of Object.entries(xr))e&&(Ze.route("/",e),Ze.notFound(e.notFoundHandler),St=!0);if(!St)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{Ze as default};
