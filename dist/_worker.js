var jt=Object.defineProperty;var Xe=e=>{throw TypeError(e)};var Tt=(e,t,r)=>t in e?jt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var m=(e,t,r)=>Tt(e,typeof t!="symbol"?t+"":t,r),$e=(e,t,r)=>t.has(e)||Xe("Cannot "+r);var l=(e,t,r)=>($e(e,t,"read from private field"),r?r.call(e):t.get(e)),x=(e,t,r)=>t.has(e)?Xe("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),h=(e,t,r,o)=>($e(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),v=(e,t,r)=>($e(e,t,"access private method"),r);var Qe=(e,t,r,o)=>({set _(a){h(e,t,a,r)},get _(){return l(e,t,o)}});var Ze=(e,t,r)=>(o,a)=>{let s=-1;return i(0);async function i(c){if(c<=s)throw new Error("next() called multiple times");s=c;let n,d=!1,p;if(e[c]?(p=e[c][0][0],o.req.routeIndex=c):p=c===e.length&&a||void 0,p)try{n=await p(o,()=>i(c+1))}catch(u){if(u instanceof Error&&t)o.error=u,n=await t(u,o),d=!0;else throw u}else o.finalized===!1&&r&&(n=await r(o));return n&&(o.finalized===!1||d)&&(o.res=n),o}},zt=Symbol(),It=async(e,t=Object.create(null))=>{const{all:r=!1,dot:o=!1}=t,s=(e instanceof ft?e.raw.headers:e.headers).get("Content-Type");return s!=null&&s.startsWith("multipart/form-data")||s!=null&&s.startsWith("application/x-www-form-urlencoded")?_t(e,{all:r,dot:o}):{}};async function _t(e,t){const r=await e.formData();return r?Pt(r,t):{}}function Pt(e,t){const r=Object.create(null);return e.forEach((o,a)=>{t.all||a.endsWith("[]")?Lt(r,a,o):r[a]=o}),t.dot&&Object.entries(r).forEach(([o,a])=>{o.includes(".")&&(qt(r,o,a),delete r[o])}),r}var Lt=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},qt=(e,t,r)=>{if(/(?:^|\.)__proto__\./.test(t))return;let o=e;const a=t.split(".");a.forEach((s,i)=>{i===a.length-1?o[s]=r:((!o[s]||typeof o[s]!="object"||Array.isArray(o[s])||o[s]instanceof File)&&(o[s]=Object.create(null)),o=o[s])})},dt=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Mt=e=>{const{groups:t,path:r}=Nt(e),o=dt(r);return Bt(o,t)},Nt=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,o)=>{const a=`@${o}`;return t.push([a,r]),a}),{groups:t,path:e}},Bt=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[o]=t[r];for(let a=e.length-1;a>=0;a--)if(e[a].includes(o)){e[a]=e[a].replace(o,t[r][1]);break}}return e},ze={},Ft=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const o=`${e}#${t}`;return ze[o]||(r[2]?ze[o]=t&&t[0]!==":"&&t[0]!=="*"?[o,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:ze[o]=[e,r[1],!0]),ze[o]}return null},We=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},Ht=e=>We(e,decodeURI),lt=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let o=r;for(;o<t.length;o++){const a=t.charCodeAt(o);if(a===37){const s=t.indexOf("?",o),i=t.indexOf("#",o),c=s===-1?i===-1?void 0:i:i===-1?s:Math.min(s,i),n=t.slice(r,c);return Ht(n.includes("%25")?n.replace(/%25/g,"%2525"):n)}else if(a===63||a===35)break}return t.slice(r,o)},$t=e=>{const t=lt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},Q=(e,t,...r)=>(r.length&&(t=Q(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),pt=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let o="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))o+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){r.length===0&&o===""?r.push("/"):r.push(o);const s=a.replace("?","");o+="/"+s,r.push(o)}else o+="/"+a}),r.filter((a,s,i)=>i.indexOf(a)===s)},Ue=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?We(e,gt):e):e,ut=(e,t,r)=>{let o;if(!r&&t&&!/[%+]/.test(t)){let i=e.indexOf("?",8);if(i===-1)return;for(e.startsWith(t,i+1)||(i=e.indexOf(`&${t}`,i+1));i!==-1;){const c=e.charCodeAt(i+t.length+1);if(c===61){const n=i+t.length+2,d=e.indexOf("&",n);return Ue(e.slice(n,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";i=e.indexOf(`&${t}`,i+1)}if(o=/[%+]/.test(e),!o)return}const a={};o??(o=/[%+]/.test(e));let s=e.indexOf("?",8);for(;s!==-1;){const i=e.indexOf("&",s+1);let c=e.indexOf("=",s);c>i&&i!==-1&&(c=-1);let n=e.slice(s+1,c===-1?i===-1?void 0:i:c);if(o&&(n=Ue(n)),s=i,n==="")continue;let d;c===-1?d="":(d=e.slice(c+1,i===-1?void 0:i),o&&(d=Ue(d))),r?(a[n]&&Array.isArray(a[n])||(a[n]=[]),a[n].push(d)):a[n]??(a[n]=d)}return t?a[t]:a},Ut=ut,Vt=(e,t)=>ut(e,t,!0),gt=decodeURIComponent,et=e=>We(e,gt),ge,I,U,ht,mt,Ge,N,ot,ft=(ot=class{constructor(e,t="/",r=[[]]){x(this,U);m(this,"raw");x(this,ge);x(this,I);m(this,"routeIndex",0);m(this,"path");m(this,"bodyCache",{});x(this,N,e=>{const{bodyCache:t,raw:r}=this,o=t[e];if(o)return o;const a=Object.keys(t)[0];return a?t[a].then(s=>(a==="json"&&(s=JSON.stringify(s)),new Response(s)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,h(this,I,r),h(this,ge,{})}param(e){return e?v(this,U,ht).call(this,e):v(this,U,mt).call(this)}query(e){return Ut(this.url,e)}queries(e){return Vt(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,o)=>{t[o]=r}),t}async parseBody(e){return It(this,e)}json(){return l(this,N).call(this,"text").then(e=>JSON.parse(e))}text(){return l(this,N).call(this,"text")}arrayBuffer(){return l(this,N).call(this,"arrayBuffer")}bytes(){return l(this,N).call(this,"arrayBuffer").then(e=>new Uint8Array(e))}blob(){return l(this,N).call(this,"blob")}formData(){return l(this,N).call(this,"formData")}addValidatedData(e,t){l(this,ge)[e]=t}valid(e){return l(this,ge)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[zt](){return l(this,I)}get matchedRoutes(){return l(this,I)[0].map(([[,e]])=>e)}get routePath(){return l(this,I)[0].map(([[,e]])=>e)[this.routeIndex].path}},ge=new WeakMap,I=new WeakMap,U=new WeakSet,ht=function(e){const t=l(this,I)[0][this.routeIndex][1][e],r=v(this,U,Ge).call(this,t);return r&&/\%/.test(r)?et(r):r},mt=function(){const e={},t=Object.keys(l(this,I)[0][this.routeIndex][1]);for(const r of t){const o=v(this,U,Ge).call(this,l(this,I)[0][this.routeIndex][1][r]);o!==void 0&&(e[r]=/\%/.test(o)?et(o):o)}return e},Ge=function(e){return l(this,I)[1]?l(this,I)[1][e]:e},N=new WeakMap,ot),Gt={Stringify:1},bt=async(e,t,r,o,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const s=e.callbacks;return s!=null&&s.length?(a?a[0]+=e:a=[e],Promise.all(s.map(c=>c({phase:t,buffer:a,context:o}))).then(c=>Promise.all(c.filter(Boolean).map(n=>bt(n,t,!1,o,a))).then(()=>a[0]))):Promise.resolve(e)},Wt="text/plain; charset=UTF-8",Ve=(e,t)=>({"Content-Type":e,...t}),ke=(e,t)=>new Response(e,t),Re,Ce,B,fe,F,O,Oe,he,me,re,De,je,W,pe,at,Kt=(at=class{constructor(e,t){x(this,W);x(this,Re);x(this,Ce);m(this,"env",{});x(this,B);m(this,"finalized",!1);m(this,"error");x(this,fe);x(this,F);x(this,O);x(this,Oe);x(this,he);x(this,me);x(this,re);x(this,De);x(this,je);m(this,"render",(...e)=>(l(this,he)??h(this,he,t=>this.html(t)),l(this,he).call(this,...e)));m(this,"setLayout",e=>h(this,Oe,e));m(this,"getLayout",()=>l(this,Oe));m(this,"setRenderer",e=>{h(this,he,e)});m(this,"header",(e,t,r)=>{this.finalized&&h(this,O,ke(l(this,O).body,l(this,O)));const o=l(this,O)?l(this,O).headers:l(this,re)??h(this,re,new Headers);t===void 0?o.delete(e):r!=null&&r.append?o.append(e,t):o.set(e,t)});m(this,"status",e=>{h(this,fe,e)});m(this,"set",(e,t)=>{l(this,B)??h(this,B,new Map),l(this,B).set(e,t)});m(this,"get",e=>l(this,B)?l(this,B).get(e):void 0);m(this,"newResponse",(...e)=>v(this,W,pe).call(this,...e));m(this,"body",(e,t,r)=>v(this,W,pe).call(this,e,t,r));m(this,"text",(e,t,r)=>!l(this,re)&&!l(this,fe)&&!t&&!r&&!this.finalized?new Response(e):v(this,W,pe).call(this,e,t,Ve(Wt,r)));m(this,"json",(e,t,r)=>v(this,W,pe).call(this,JSON.stringify(e),t,Ve("application/json",r)));m(this,"html",(e,t,r)=>{const o=a=>v(this,W,pe).call(this,a,t,Ve("text/html; charset=UTF-8",r));return typeof e=="object"?bt(e,Gt.Stringify,!1,{}).then(o):o(e)});m(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});m(this,"notFound",()=>(l(this,me)??h(this,me,()=>ke()),l(this,me).call(this,this)));h(this,Re,e),t&&(h(this,F,t.executionCtx),this.env=t.env,h(this,me,t.notFoundHandler),h(this,je,t.path),h(this,De,t.matchResult))}get req(){return l(this,Ce)??h(this,Ce,new ft(l(this,Re),l(this,je),l(this,De))),l(this,Ce)}get event(){if(l(this,F)&&"respondWith"in l(this,F))return l(this,F);throw Error("This context has no FetchEvent")}get executionCtx(){if(l(this,F))return l(this,F);throw Error("This context has no ExecutionContext")}get res(){return l(this,O)||h(this,O,ke(null,{headers:l(this,re)??h(this,re,new Headers)}))}set res(e){if(l(this,O)&&e){e=ke(e.body,e);for(const[t,r]of l(this,O).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const o=l(this,O).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of o)e.headers.append("set-cookie",a)}else e.headers.set(t,r)}h(this,O,e),this.finalized=!0}get var(){return l(this,B)?Object.fromEntries(l(this,B)):{}}},Re=new WeakMap,Ce=new WeakMap,B=new WeakMap,fe=new WeakMap,F=new WeakMap,O=new WeakMap,Oe=new WeakMap,he=new WeakMap,me=new WeakMap,re=new WeakMap,De=new WeakMap,je=new WeakMap,W=new WeakSet,pe=function(e,t,r){const o=l(this,O)?new Headers(l(this,O).headers):l(this,re)??new Headers;if(typeof t=="object"&&"headers"in t){const s=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[i,c]of s)i.toLowerCase()==="set-cookie"?o.append(i,c):o.set(i,c)}if(r)for(const[s,i]of Object.entries(r))if(typeof i=="string")o.set(s,i);else{o.delete(s);for(const c of i)o.append(s,c)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??l(this,fe);return ke(e,{status:a,headers:o})},at),A="ALL",Yt="all",Jt=["get","post","put","delete","options","patch"],xt="Can not add a route since the matcher is already built.",vt=class extends Error{},Xt="__COMPOSED_HANDLER",Qt=e=>e.text("404 Not Found",404),tt=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},P,S,yt,L,Z,Ie,_e,be,Zt=(be=class{constructor(t={}){x(this,S);m(this,"get");m(this,"post");m(this,"put");m(this,"delete");m(this,"options");m(this,"patch");m(this,"all");m(this,"on");m(this,"use");m(this,"router");m(this,"getPath");m(this,"_basePath","/");x(this,P,"/");m(this,"routes",[]);x(this,L,Qt);m(this,"errorHandler",tt);m(this,"onError",t=>(this.errorHandler=t,this));m(this,"notFound",t=>(h(this,L,t),this));m(this,"fetch",(t,...r)=>v(this,S,_e).call(this,t,r[1],r[0],t.method));m(this,"request",(t,r,o,a)=>t instanceof Request?this.fetch(r?new Request(t,r):t,o,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${Q("/",t)}`,r),o,a)));m(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(v(this,S,_e).call(this,t.request,t,void 0,t.request.method))})});[...Jt,Yt].forEach(s=>{this[s]=(i,...c)=>(typeof i=="string"?h(this,P,i):v(this,S,Z).call(this,s,l(this,P),i),c.forEach(n=>{v(this,S,Z).call(this,s,l(this,P),n)}),this)}),this.on=(s,i,...c)=>{for(const n of[i].flat()){h(this,P,n);for(const d of[s].flat())c.map(p=>{v(this,S,Z).call(this,d.toUpperCase(),l(this,P),p)})}return this},this.use=(s,...i)=>(typeof s=="string"?h(this,P,s):(h(this,P,"*"),i.unshift(s)),i.forEach(c=>{v(this,S,Z).call(this,A,l(this,P),c)}),this);const{strict:o,...a}=t;Object.assign(this,a),this.getPath=o??!0?t.getPath??lt:$t}route(t,r){const o=this.basePath(t);return r.routes.map(a=>{var i;let s;r.errorHandler===tt?s=a.handler:(s=async(c,n)=>(await Ze([],r.errorHandler)(c,()=>a.handler(c,n))).res,s[Xt]=a.handler),v(i=o,S,Z).call(i,a.method,a.path,s,a.basePath)}),this}basePath(t){const r=v(this,S,yt).call(this);return r._basePath=Q(this._basePath,t),r}mount(t,r,o){let a,s;o&&(typeof o=="function"?s=o:(s=o.optionHandler,o.replaceRequest===!1?a=n=>n:a=o.replaceRequest));const i=s?n=>{const d=s(n);return Array.isArray(d)?d:[d]}:n=>{let d;try{d=n.executionCtx}catch{}return[n.env,d]};a||(a=(()=>{const n=Q(this._basePath,t),d=n==="/"?0:n.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(d)||"/",new Request(u,p)}})());const c=async(n,d)=>{const p=await r(a(n.req.raw),...i(n));if(p)return p;await d()};return v(this,S,Z).call(this,A,Q(t,"*"),c),this}},P=new WeakMap,S=new WeakSet,yt=function(){const t=new be({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,h(t,L,l(this,L)),t.routes=this.routes,t},L=new WeakMap,Z=function(t,r,o,a){t=t.toUpperCase(),r=Q(this._basePath,r);const s={basePath:a!==void 0?Q(this._basePath,a):this._basePath,path:r,method:t,handler:o};this.router.add(t,r,[o,s]),this.routes.push(s)},Ie=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},_e=function(t,r,o,a){if(a==="HEAD")return(async()=>new Response(null,await v(this,S,_e).call(this,t,r,o,"GET")))();const s=this.getPath(t,{env:o}),i=this.router.match(a,s),c=new Kt(t,{path:s,matchResult:i,env:o,executionCtx:r,notFoundHandler:l(this,L)});if(i[0].length===1){let d;try{d=i[0][0][0][0](c,async()=>{c.res=await l(this,L).call(this,c)})}catch(p){return v(this,S,Ie).call(this,p,c)}return d instanceof Promise?d.then(p=>p||(c.finalized?c.res:l(this,L).call(this,c))).catch(p=>v(this,S,Ie).call(this,p,c)):d??l(this,L).call(this,c)}const n=Ze(i[0],this.errorHandler,l(this,L));return(async()=>{try{const d=await n(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return v(this,S,Ie).call(this,d,c)}})()},be),wt=[];function er(e,t){const r=this.buildAllMatchers(),o=(a,s)=>{const i=r[a]||r[A],c=i[2][s];if(c)return c;const n=s.match(i[0]);if(!n)return[[],wt];const d=n.indexOf("",1);return[i[1][d],n]};return this.match=o,o(e,t)}var Le="[^/]+",Ae=".*",Se="(?:|/.*)",ue=Symbol(),tr=new Set(".\\+*[^]$()");function rr(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Ae||e===Se?1:t===Ae||t===Se?-1:e===Le?1:t===Le?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var oe,ae,q,ne,or=(ne=class{constructor(){x(this,oe);x(this,ae);x(this,q,Object.create(null))}insert(t,r,o,a,s){if(t.length===0){if(l(this,oe)!==void 0)throw ue;if(s)return;h(this,oe,r);return}const[i,...c]=t,n=i==="*"?c.length===0?["","",Ae]:["","",Le]:i==="/*"?["","",Se]:i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(n){const p=n[1];let u=n[2]||Le;if(p&&n[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ue;if(d=l(this,q)[u],!d){if(Object.keys(l(this,q)).some(g=>g!==Ae&&g!==Se))throw ue;if(s)return;d=l(this,q)[u]=new ne,p!==""&&h(d,ae,a.varIndex++)}!s&&p!==""&&o.push([p,l(d,ae)])}else if(d=l(this,q)[i],!d){if(Object.keys(l(this,q)).some(p=>p.length>1&&p!==Ae&&p!==Se))throw ue;if(s)return;d=l(this,q)[i]=new ne}d.insert(c,r,o,a,s)}buildRegExpStr(){const r=Object.keys(l(this,q)).sort(rr).map(o=>{const a=l(this,q)[o];return(typeof l(a,ae)=="number"?`(${o})@${l(a,ae)}`:tr.has(o)?`\\${o}`:o)+a.buildRegExpStr()});return typeof l(this,oe)=="number"&&r.unshift(`#${l(this,oe)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},oe=new WeakMap,ae=new WeakMap,q=new WeakMap,ne),Ne,Te,st,ar=(st=class{constructor(){x(this,Ne,{varIndex:0});x(this,Te,new or)}insert(e,t,r){const o=[],a=[];for(let i=0;;){let c=!1;if(e=e.replace(/\{[^}]+\}/g,n=>{const d=`@\\${i}`;return a[i]=[d,n],i++,c=!0,d}),!c)break}const s=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=a.length-1;i>=0;i--){const[c]=a[i];for(let n=s.length-1;n>=0;n--)if(s[n].indexOf(c)!==-1){s[n]=s[n].replace(c,a[i][1]);break}}return l(this,Te).insert(s,t,o,l(this,Ne),r),o}buildRegExp(){let e=l(this,Te).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],o=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,s,i)=>s!==void 0?(r[++t]=Number(s),"$()"):(i!==void 0&&(o[Number(i)]=++t),"")),[new RegExp(`^${e}`),r,o]}},Ne=new WeakMap,Te=new WeakMap,st),sr=[/^$/,[],Object.create(null)],Pe=Object.create(null);function kt(e){return Pe[e]??(Pe[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function ir(){Pe=Object.create(null)}function nr(e){var d;const t=new ar,r=[];if(e.length===0)return sr;const o=e.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[g,f])=>p?1:g?-1:u.length-f.length),a=Object.create(null);for(let p=0,u=-1,g=o.length;p<g;p++){const[f,w,E]=o[p];f?a[w]=[E.map(([T])=>[T,Object.create(null)]),wt]:u++;let D;try{D=t.insert(w,u,f)}catch(T){throw T===ue?new vt(w):T}f||(r[u]=E.map(([T,k])=>{const z=Object.create(null);for(k-=1;k>=0;k--){const[V,j]=D[k];z[V]=j}return[T,z]}))}const[s,i,c]=t.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let g=0,f=r[p].length;g<f;g++){const w=(d=r[p][g])==null?void 0:d[1];if(!w)continue;const E=Object.keys(w);for(let D=0,T=E.length;D<T;D++)w[E[D]]=c[w[E[D]]]}const n=[];for(const p in i)n[p]=r[i[p]];return[s,n,a]}function le(e,t){if(e){for(const r of Object.keys(e).sort((o,a)=>a.length-o.length))if(kt(r).test(t))return[...e[r]]}}var K,Y,Be,Et,it,cr=(it=class{constructor(){x(this,Be);m(this,"name","RegExpRouter");x(this,K);x(this,Y);m(this,"match",er);h(this,K,{[A]:Object.create(null)}),h(this,Y,{[A]:Object.create(null)})}add(e,t,r){var c;const o=l(this,K),a=l(this,Y);if(!o||!a)throw new Error(xt);o[e]||[o,a].forEach(n=>{n[e]=Object.create(null),Object.keys(n[A]).forEach(d=>{n[e][d]=[...n[A][d]]})}),t==="/*"&&(t="*");const s=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const n=kt(t);e===A?Object.keys(o).forEach(d=>{var p;(p=o[d])[t]||(p[t]=le(o[d],t)||le(o[A],t)||[])}):(c=o[e])[t]||(c[t]=le(o[e],t)||le(o[A],t)||[]),Object.keys(o).forEach(d=>{(e===A||e===d)&&Object.keys(o[d]).forEach(p=>{n.test(p)&&o[d][p].push([r,s])})}),Object.keys(a).forEach(d=>{(e===A||e===d)&&Object.keys(a[d]).forEach(p=>n.test(p)&&a[d][p].push([r,s]))});return}const i=pt(t)||[t];for(let n=0,d=i.length;n<d;n++){const p=i[n];Object.keys(a).forEach(u=>{var g;(e===A||e===u)&&((g=a[u])[p]||(g[p]=[...le(o[u],p)||le(o[A],p)||[]]),a[u][p].push([r,s-d+n+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(l(this,Y)).concat(Object.keys(l(this,K))).forEach(t=>{e[t]||(e[t]=v(this,Be,Et).call(this,t))}),h(this,K,h(this,Y,void 0)),ir(),e}},K=new WeakMap,Y=new WeakMap,Be=new WeakSet,Et=function(e){const t=[];let r=e===A;return[l(this,K),l(this,Y)].forEach(o=>{const a=o[e]?Object.keys(o[e]).map(s=>[s,o[e][s]]):[];a.length!==0?(r||(r=!0),t.push(...a)):e!==A&&t.push(...Object.keys(o[A]).map(s=>[s,o[A][s]]))}),r?nr(t):null},it),J,H,nt,dr=(nt=class{constructor(e){m(this,"name","SmartRouter");x(this,J,[]);x(this,H,[]);h(this,J,e.routers)}add(e,t,r){if(!l(this,H))throw new Error(xt);l(this,H).push([e,t,r])}match(e,t){if(!l(this,H))throw new Error("Fatal error");const r=l(this,J),o=l(this,H),a=r.length;let s=0,i;for(;s<a;s++){const c=r[s];try{for(let n=0,d=o.length;n<d;n++)c.add(...o[n]);i=c.match(e,t)}catch(n){if(n instanceof vt)continue;throw n}this.match=c.match.bind(c),h(this,J,[c]),h(this,H,void 0);break}if(s===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(l(this,H)||l(this,J).length!==1)throw new Error("No active router has been determined yet.");return l(this,J)[0]}},J=new WeakMap,H=new WeakMap,nt),Ee=Object.create(null),lr=e=>{for(const t in e)return!0;return!1},X,C,se,xe,R,$,ee,ve,pr=(ve=class{constructor(t,r,o){x(this,$);x(this,X);x(this,C);x(this,se);x(this,xe,0);x(this,R,Ee);if(h(this,C,o||Object.create(null)),h(this,X,[]),t&&r){const a=Object.create(null);a[t]={handler:r,possibleKeys:[],score:0},h(this,X,[a])}h(this,se,[])}insert(t,r,o){h(this,xe,++Qe(this,xe)._);let a=this;const s=Mt(r),i=[];for(let c=0,n=s.length;c<n;c++){const d=s[c],p=s[c+1],u=Ft(d,p),g=Array.isArray(u)?u[0]:d;if(g in l(a,C)){a=l(a,C)[g],u&&i.push(u[1]);continue}l(a,C)[g]=new ve,u&&(l(a,se).push(u),i.push(u[1])),a=l(a,C)[g]}return l(a,X).push({[t]:{handler:o,possibleKeys:i.filter((c,n,d)=>d.indexOf(c)===n),score:l(this,xe)}}),a}search(t,r){var p;const o=[];h(this,R,Ee);let s=[this];const i=dt(r),c=[],n=i.length;let d=null;for(let u=0;u<n;u++){const g=i[u],f=u===n-1,w=[];for(let D=0,T=s.length;D<T;D++){const k=s[D],z=l(k,C)[g];z&&(h(z,R,l(k,R)),f?(l(z,C)["*"]&&v(this,$,ee).call(this,o,l(z,C)["*"],t,l(k,R)),v(this,$,ee).call(this,o,z,t,l(k,R))):w.push(z));for(let V=0,j=l(k,se).length;V<j;V++){const Ye=l(k,se)[V],G=l(k,R)===Ee?{}:{...l(k,R)};if(Ye==="*"){const ce=l(k,C)["*"];ce&&(v(this,$,ee).call(this,o,ce,t,l(k,R)),h(ce,R,G),w.push(ce));continue}const[Dt,Je,ye]=Ye;if(!g&&!(ye instanceof RegExp))continue;const M=l(k,C)[Dt];if(ye instanceof RegExp){if(d===null){d=new Array(n);let de=r[0]==="/"?1:0;for(let we=0;we<n;we++)d[we]=de,de+=i[we].length+1}const ce=r.substring(d[u]),He=ye.exec(ce);if(He){if(G[Je]=He[0],v(this,$,ee).call(this,o,M,t,l(k,R),G),lr(l(M,C))){h(M,R,G);const de=((p=He[0].match(/\//))==null?void 0:p.length)??0;(c[de]||(c[de]=[])).push(M)}continue}}(ye===!0||ye.test(g))&&(G[Je]=g,f?(v(this,$,ee).call(this,o,M,t,G,l(k,R)),l(M,C)["*"]&&v(this,$,ee).call(this,o,l(M,C)["*"],t,G,l(k,R))):(h(M,R,G),w.push(M)))}}const E=c.shift();s=E?w.concat(E):w}return o.length>1&&o.sort((u,g)=>u.score-g.score),[o.map(({handler:u,params:g})=>[u,g])]}},X=new WeakMap,C=new WeakMap,se=new WeakMap,xe=new WeakMap,R=new WeakMap,$=new WeakSet,ee=function(t,r,o,a,s){for(let i=0,c=l(r,X).length;i<c;i++){const n=l(r,X)[i],d=n[o]||n[A],p={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),a!==Ee||s&&s!==Ee))for(let u=0,g=d.possibleKeys.length;u<g;u++){const f=d.possibleKeys[u],w=p[d.score];d.params[f]=s!=null&&s[f]&&!w?s[f]:a[f]??(s==null?void 0:s[f]),p[d.score]=!0}}},ve),ie,ct,ur=(ct=class{constructor(){m(this,"name","TrieRouter");x(this,ie);h(this,ie,new pr)}add(e,t,r){const o=pt(t);if(o){for(let a=0,s=o.length;a<s;a++)l(this,ie).insert(e,o[a],r);return}l(this,ie).insert(e,t,r)}match(e,t){return l(this,ie).search(e,t)}},ie=new WeakMap,ct),At=class extends Zt{constructor(e={}){super(e),this.router=e.router??new dr({routers:[new cr,new ur]})}},gr=e=>{const t={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...e},r=(a=>typeof a=="string"?a==="*"?()=>a:s=>a===s?s:null:typeof a=="function"?a:s=>a.includes(s)?s:null)(t.origin),o=(a=>typeof a=="function"?a:Array.isArray(a)?()=>a:()=>[])(t.allowMethods);return async function(s,i){var d;function c(p,u){s.res.headers.set(p,u)}const n=await r(s.req.header("origin")||"",s);if(n&&c("Access-Control-Allow-Origin",n),t.credentials&&c("Access-Control-Allow-Credentials","true"),(d=t.exposeHeaders)!=null&&d.length&&c("Access-Control-Expose-Headers",t.exposeHeaders.join(",")),s.req.method==="OPTIONS"){t.origin!=="*"&&c("Vary","Origin"),t.maxAge!=null&&c("Access-Control-Max-Age",t.maxAge.toString());const p=await o(s.req.header("origin")||"",s);p.length&&c("Access-Control-Allow-Methods",p.join(","));let u=t.allowHeaders;if(!(u!=null&&u.length)){const g=s.req.header("Access-Control-Request-Headers");g&&(u=g.split(/\s*,\s*/))}return u!=null&&u.length&&(c("Access-Control-Allow-Headers",u.join(",")),s.res.headers.append("Vary","Access-Control-Request-Headers")),s.res.headers.delete("Content-Length"),s.res.headers.delete("Content-Type"),new Response(null,{headers:s.res.headers,status:204,statusText:"No Content"})}await i(),t.origin!=="*"&&s.header("Vary","Origin",{append:!0})}};const b={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},te="https://api.sixtechbrasil.com.br",fr="https://sixtechworkspace.kainow252-cmyk.workers.dev",_=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:b.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:b.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:b.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:b.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:b.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:b.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:b.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:b.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:b.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:b.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:b.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:b.powerful,internalUrl:`${te}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:b.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:b.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:b.powerful,internalUrl:`${te}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:b.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:b.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:b.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:b.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:b.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:b.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:b.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:b.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:b.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:b.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:b.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:b.coder,internalUrl:`${te}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:b.powerful,internalUrl:`${te}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:b.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:b.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:b.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:b.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:b.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:b.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:b.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:b.powerful,internalUrl:`${te}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:b.balanced,internalUrl:`${te}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function hr(e,t){try{const r=new AbortController,o=setTimeout(()=>r.abort(),8e3),a=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:t,message:t}),signal:r.signal});if(clearTimeout(o),!a.ok)return null;const s=await a.json();return s.result||s.response||s.output||null}catch{return null}}async function qe(e,t,r,o,a=1200){var c,n,d,p,u;const s=[{role:"system",content:r},{role:"user",content:o}],i=await e.run(t,{messages:s,max_tokens:a,stream:!1});if(i&&typeof i=="object"){const g=i;if("getReader"in g||"pipeTo"in g){const f=g.getReader(),w=new TextDecoder;let E="";for(;;){const{done:D,value:T}=await f.read();if(D)break;const k=w.decode(T,{stream:!0});for(const z of k.split(`
`)){if(!z.startsWith("data:"))continue;const V=z.slice(5).trim();if(V!=="[DONE]")try{const j=JSON.parse(V);E+=(j==null?void 0:j.response)??((d=(n=(c=j==null?void 0:j.choices)==null?void 0:c[0])==null?void 0:n.delta)==null?void 0:d.content)??(j==null?void 0:j.token)??""}catch{}}}return E}if("response"in g&&typeof g.response=="string")return g.response||"";if(Array.isArray(g.choices)&&g.choices.length>0){const f=g.choices[0];if((p=f==null?void 0:f.message)!=null&&p.content)return String(f.message.content);if((u=f==null?void 0:f.delta)!=null&&u.content)return String(f.delta.content);if(f!=null&&f.text)return String(f.text)}if(g.result&&typeof g.result=="object"&&"response"in g.result)return String(g.result.response||"")}return String(i||"")}async function Me(e,t,r){const o=Date.now();let a="",s=!1,i=e.source;try{if(e.source==="hybrid"&&e.internalUrl){const c=await hr(e.internalUrl,t);c?(a=c,i="internal",s=!1):(a=await qe(r,e.model,e.system,t,1500),i="cloudflare",s=!0)}else a=await qe(r,e.model,e.system,t,1500),i="cloudflare",s=!1}catch(c){a=`❌ Erro: ${(c==null?void 0:c.message)||"falha inesperada"}`}return{agentId:e.id,name:e.name,emoji:e.emoji,color:e.color,model:e.model,source:i,usedFallback:s,response:a,duration:Date.now()-o}}function mr(e){const t=e.toLowerCase(),r=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(t)&&r.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(t)&&r.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(t)&&r.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(t)&&r.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(t)&&r.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(t)&&r.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(t)&&r.push("reviewer"),r.length===0&&r.push("orchestrator"),r.length>1&&r.push("orchestrator"),[...new Set(r)]}const br={sixtech:"sixtech@2025",admin:"Admin@SixTech1"},Ke="st_sess",St=60*60*8,xr="SixTechMAS_JWT_S3cr3t_2025_x9kLmP";async function Rt(e){const t=new TextEncoder,r=await crypto.subtle.importKey("raw",t.encode(xr),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),o=await crypto.subtle.sign("HMAC",r,t.encode(e));return btoa(String.fromCharCode(...new Uint8Array(o))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}async function vr(e,t){return await Rt(e)===t}async function yr(e){const t=btoa(JSON.stringify({u:e,exp:Math.floor(Date.now()/1e3)+St})).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,""),r=await Rt(t);return`${t}.${r}`}async function wr(e){try{const[t,r]=e.split(".");if(!t||!r||!await vr(t,r))return null;const a=t.replace(/-/g,"+").replace(/_/g,"/"),s=JSON.parse(atob(a+"===".slice(a.length%4||4)));return Math.floor(Date.now()/1e3)>s.exp?null:{user:s.u}}catch{return null}}async function Fe(e){const r=(e.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${Ke}=([^;]+)`));return r?wr(r[1]):null}const y=new At;y.use("*",gr());y.get("/favicon.ico",e=>new Response(null,{status:204}));y.post("/api/login",async e=>{const{username:t,password:r}=await e.req.json(),o=br[t==null?void 0:t.trim()];if(!o||o!==r)return e.json({ok:!1,error:"Usuário ou senha incorretos"},401);const a=await yr(t.trim()),s=`${Ke}=${a}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${St}`;return new Response(JSON.stringify({ok:!0,user:t.trim()}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":s,"Access-Control-Allow-Origin":"*"}})});y.post("/api/logout",e=>new Response(JSON.stringify({ok:!0}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":`${Ke}=; Path=/; Max-Age=0`}}));y.get("/api/me",async e=>{const t=await Fe(e);return t?e.json({ok:!0,user:t.user}):e.json({ok:!1},401)});const kr=["/api/login","/api/me","/api/logout","/api/status","/api/models"];y.use("/api/*",async(e,t)=>{const r=new URL(e.req.url).pathname;return kr.includes(r)||await Fe(e)?t():e.json({error:"Não autorizado",code:401},401)});y.get("/api/agents",e=>e.json({total:_.length,models:Object.keys(b).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:_.map(t=>({id:t.id,name:t.name,emoji:t.emoji,color:t.color,desc:t.desc,source:t.source,model:t.model,category:t.category,capabilities:t.capabilities,basedOn:t.basedOn,internalUrl:t.internalUrl}))}));y.post("/api/agent/:id",async e=>{const t=_.find(n=>n.id===e.req.param("id"));if(!t)return e.json({error:"Agente não encontrado"},404);const{message:r,task:o,use_cache:a}=await e.req.json(),s=r||o||"",i=e.env.DB;if(i&&a!==!1&&s.length>10){const n=await Ct(`${t.id}:${s}`),d=new Date().toISOString(),p=await i.prepare("SELECT * FROM query_cache WHERE query_hash=? AND (expires_at IS NULL OR expires_at > ?)").bind(n,d).first();if(p)return await i.prepare("UPDATE query_cache SET hit_count=hit_count+1 WHERE id=?").bind(p.id).run(),e.json({agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:t.source,response:p.response,duration:0,fromCache:!0,cacheHits:(p.hit_count??0)+1,tokensSaved:p.tokens_saved??0});const u=await Me(t,s,e.env.AI),g=Math.ceil(s.length/4)+Math.ceil(u.response.length/4),f=new Date(Date.now()+24*3600*1e3).toISOString();return await i.prepare(`INSERT OR REPLACE INTO query_cache (query_hash,query_text,response,source,agent_id,tokens_saved,expires_at)
       VALUES (?,?,?,?,?,?,?)`).bind(n,s,u.response,"cloudflare-ai",t.id,g,f).run(),e.json({...u,fromCache:!1})}const c=await Me(t,s,e.env.AI);return e.json(c)});y.post("/api/orchestrate",async e=>{var c;const{task:t,message:r}=await e.req.json(),o=t||r||"";if(!o)return e.json({error:"task obrigatório"},400);const a=mr(o),s=a.map(n=>_.find(d=>d.id===n)).filter(Boolean),i=[];for(const n of s){const d=n.id==="orchestrator"&&i.length>0?`Tarefa original: "${o}"

Resultados dos agentes especializados:
${i.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:o;i.push(await Me(n,d,e.env.AI))}return e.json({task:o,agentsUsed:a,results:i,summary:((c=i[i.length-1])==null?void 0:c.response)||""})});y.post("/api/pipeline",async e=>{const{task:t,agentIds:r}=await e.req.json();if(!t||!(r!=null&&r.length))return e.json({error:"task e agentIds obrigatórios"},400);const o=r.map(n=>_.find(d=>d.id===n)).filter(Boolean),a=[];let s=t;for(const n of o){o[o.length-1];const d=a.length===0?t:n.id==="orchestrator"&&a.length>0?`Tarefa original: "${t}"

${a.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${t}

[Contexto do ${a[a.length-1].name}]:
${a[a.length-1].response.slice(0,800)}`,p=await Me(n,d,e.env.AI);a.push(p),s=p.response}const i=a.filter(n=>n.source==="cloudflare").length,c=a.filter(n=>n.source==="internal").length;return e.json({task:t,steps:a.length,cloudflareSteps:i,internalSteps:c,results:a,final:s})});y.post("/api/document/generate",async e=>{if(!await Fe(e))return e.json({error:"Não autorizado"},401);const{agentId:r,docType:o,instructions:a,context:s}=await e.req.json(),i=_.find(p=>p.id===r);if(!i)return e.json({error:"Agente não encontrado"},404);const n=[{role:"system",content:`${i.system}

MODO: GERADOR DE DOCUMENTOS PROFISSIONAIS
Você irá gerar um documento completo e profissional do tipo: ${o}
Instruções específicas: ${a}
${s?`Contexto adicional: ${s}`:""}

REGRAS OBRIGATÓRIAS:
1. Gere o documento COMPLETO, não resumido
2. Use formatação Markdown rica (## títulos, **negrito**, tabelas, listas)
3. Inclua TODAS as seções necessárias para um documento profissional
4. No início, coloque o título do documento em # TÍTULO
5. Separe seções com --- quando necessário
6. Para contratos/NDAs: inclua cláusulas numeradas, partes, objeto, vigência, assinaturas
7. Responda APENAS com o documento, sem explicações antes ou depois`},{role:"user",content:`Gere agora o documento: ${o}

Instruções: ${a}`}],d=await e.env.AI.run(i.model,{messages:n,max_tokens:4096,stream:!0});return new Response(d,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});y.post("/api/document/analyze",async e=>{if(!await Fe(e))return e.json({error:"Não autorizado"},401);const{agentId:r,fileContent:o,fileName:a,instruction:s}=await e.req.json(),i=_.find(p=>p.id===r);if(!i)return e.json({error:"Agente não encontrado"},404);const c=`${i.system}

MODO: ANÁLISE DE DOCUMENTO
Analise criticamente o documento fornecido pelo usuário.
${s?`Instrução específica: ${s}`:""}

ESTRUTURA DA ANÁLISE (use Markdown):
## 📋 Resumo Executivo
## ✅ Pontos Positivos
## ⚠️ Pontos de Atenção / Riscos
## 🔧 Sugestões de Melhoria
## 📝 Versão Corrigida (se aplicável — reescreva trechos problemáticos)
## ✔️ Conclusão e Score (0-10)`,n=`Arquivo: ${a}

--- CONTEÚDO DO DOCUMENTO ---
${o.slice(0,12e3)}
--- FIM DO DOCUMENTO ---

${s||"Analise este documento e aponte melhorias, erros e ajustes necessários."}`,d=await e.env.AI.run(i.model,{messages:[{role:"system",content:c},{role:"user",content:n}],max_tokens:4096,stream:!0});return new Response(d,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});y.post("/api/chat",async e=>{const{messages:t,model:r}=await e.req.json(),o=r||b.balanced;t.some(s=>s.role==="system")||t.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const a=await e.env.AI.run(o,{messages:t,max_tokens:2048,stream:!0});return new Response(a,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});y.get("/api/models",e=>e.json({models:Object.entries(b).map(([t,r])=>({key:t,id:r,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[t]||t}))}));y.get("/api/status",e=>e.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:te},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:fr},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:_.length,models:Object.keys(b).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));async function Ct(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e.toLowerCase().trim()));return Array.from(new Uint8Array(t)).map(r=>r.toString(16).padStart(2,"0")).join("")}y.get("/api/public-apis",async e=>{var d,p;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const r=e.req.query("category")||"",o=e.req.query("q")||"",a=Math.min(parseInt(e.req.query("limit")||"50"),200);let s="SELECT * FROM public_apis WHERE 1=1";const i=[];r&&(s+=" AND category = ?",i.push(r)),o&&(s+=" AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)",i.push(`%${o}%`,`%${o}%`,`%${o}%`)),s+=" ORDER BY quality DESC, name ASC LIMIT ?",i.push(a);const c=await t.prepare(s).bind(...i).all(),n=await t.prepare("SELECT DISTINCT category FROM public_apis ORDER BY category").all();return e.json({total:((d=c.results)==null?void 0:d.length)??0,categories:((p=n.results)==null?void 0:p.map(u=>u.category))??[],apis:c.results??[]})});y.post("/api/public-apis",async e=>{var g;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const{name:r,category:o,description:a,base_url:s,docs_url:i,auth_type:c,example:n,tags:d,quality:p}=await e.req.json();if(!r||!o)return e.json({error:"name e category são obrigatórios"},400);const u=await t.prepare(`INSERT INTO public_apis (name,category,description,base_url,docs_url,auth_type,example,tags,quality)
     VALUES (?,?,?,?,?,?,?,?,?)`).bind(r,o,a??"",s??"",i??"",c??"none",n??"",d??"",p??8).run();return e.json({success:!0,id:(g=u.meta)==null?void 0:g.last_row_id})});y.post("/api/cache-query",async e=>{const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const{query:r,agent_id:o,model:a,ttl_hours:s}=await e.req.json();if(!r)return e.json({error:"query é obrigatória"},400);const i=await Ct(r),c=new Date().toISOString(),n=await t.prepare("SELECT * FROM query_cache WHERE query_hash=? AND (expires_at IS NULL OR expires_at > ?)").bind(i,c).first();if(n)return await t.prepare("UPDATE query_cache SET hit_count=hit_count+1 WHERE id=?").bind(n.id).run(),e.json({source:"cache",hit_count:(n.hit_count??0)+1,tokens_saved:n.tokens_saved??0,agent_id:n.agent_id??null,response:n.response,cached_at:n.created_at});const d=o?_.find(E=>E.id===o):null,p=a??(d==null?void 0:d.model)??b.llama,u=(d==null?void 0:d.system)??"Você é um assistente útil e preciso.";let g="";try{g=await qe(e.env.AI,p,u,r,1500)}catch(E){return e.json({error:`Erro ao chamar IA: ${(E==null?void 0:E.message)??E}`},500)}const f=Math.ceil(r.length/4)+Math.ceil(g.length/4),w=s?new Date(Date.now()+s*3600*1e3).toISOString():null;return await t.prepare(`INSERT INTO query_cache (query_hash,query_text,response,source,agent_id,tokens_saved,expires_at)
     VALUES (?,?,?,?,?,?,?)`).bind(i,r,g,"cloudflare-ai",o??null,f,w).run(),e.json({source:"ai",hit_count:0,tokens_saved:0,agent_id:o??null,response:g,model:p})});y.get("/api/cache/stats",async e=>{const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const r=await t.prepare("SELECT COUNT(*) as n FROM query_cache").first(),o=await t.prepare("SELECT SUM(hit_count) as n FROM query_cache").first(),a=await t.prepare("SELECT SUM(tokens_saved) as n FROM query_cache").first(),s=await t.prepare(`SELECT agent_id, COUNT(*) as entries, SUM(hit_count) as hits
     FROM query_cache WHERE agent_id IS NOT NULL GROUP BY agent_id ORDER BY hits DESC`).all();return e.json({total_entries:(r==null?void 0:r.n)??0,total_hits:(o==null?void 0:o.n)??0,tokens_saved:(a==null?void 0:a.n)??0,by_agent:s.results??[]})});y.delete("/api/cache",async e=>{var s,i;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);if(e.req.query("all")==="1"){const c=await t.prepare("DELETE FROM query_cache").run();return e.json({deleted:((s=c.meta)==null?void 0:s.changes)??0,scope:"all"})}const o=new Date().toISOString(),a=await t.prepare("DELETE FROM query_cache WHERE expires_at IS NOT NULL AND expires_at < ?").bind(o).run();return e.json({deleted:((i=a.meta)==null?void 0:i.changes)??0,scope:"expired"})});y.get("/api/knowledge",async e=>{var p;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const r=e.req.query("agent_id")||"",o=e.req.query("category")||"",a=e.req.query("q")||"",s=Math.min(parseInt(e.req.query("limit")||"50"),500);let i="SELECT * FROM knowledge WHERE 1=1";const c=[];r&&(i+=" AND agent_id = ?",c.push(r)),o&&(i+=" AND category = ?",c.push(o)),a&&(i+=" AND (topic LIKE ? OR content LIKE ? OR keywords LIKE ?)",c.push(`%${a}%`,`%${a}%`,`%${a}%`)),i+=" ORDER BY confidence DESC, used_count DESC, created_at DESC LIMIT ?",c.push(s);const n=await t.prepare(i).bind(...c).all(),d=await t.prepare("SELECT COUNT(*) as n FROM knowledge").first();return e.json({total:(d==null?void 0:d.n)??0,returned:((p=n.results)==null?void 0:p.length)??0,knowledge:n.results??[]})});y.post("/api/knowledge/add",async e=>{var g;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const{agent_id:r,topic:o,category:a,content:s,source_url:i,source_type:c,confidence:n,keywords:d}=await e.req.json();if(!r||!o||!a||!s)return e.json({error:"agent_id, topic, category e content são obrigatórios"},400);if(!_.find(f=>f.id===r))return e.json({error:"Agente não encontrado"},404);const u=await t.prepare(`INSERT INTO knowledge (agent_id,topic,category,content,source_url,source_type,confidence,keywords)
     VALUES (?,?,?,?,?,?,?,?)`).bind(r,o,a,s,i??"",c??"manual",n??.9,d??"").run();return e.json({success:!0,id:(g=u.meta)==null?void 0:g.last_row_id,agent_id:r,topic:o})});y.post("/api/knowledge/learn",async e=>{var g;const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const{agent_id:r,topic:o,category:a}=await e.req.json();if(!r||!o)return e.json({error:"agent_id e topic são obrigatórios"},400);const s=_.find(f=>f.id===r);if(!s)return e.json({error:"Agente não encontrado"},404);const i=`Você é ${s.emoji} ${s.name}. Aprenda sobre o tópico "${o}" e explique de forma clara e objetiva em português, com foco prático. Máximo 300 palavras.`;let c="";try{c=await qe(e.env.AI,s.model,s.system,i,800)}catch(f){return e.json({error:`Erro ao chamar IA: ${(f==null?void 0:f.message)??f}`},500)}const n=c.match(/\b\w{5,}\b/g)??[],d={};for(const f of n){const w=f.toLowerCase();d[w]=(d[w]||0)+1}const p=Object.entries(d).sort((f,w)=>w[1]-f[1]).slice(0,10).map(f=>f[0]).join(","),u=await t.prepare(`INSERT INTO knowledge (agent_id,topic,category,content,source_type,confidence,keywords)
     VALUES (?,?,?,?,?,?,?)`).bind(r,o,a??s.category,c,"ai",.85,p).run();return e.json({success:!0,id:(g=u.meta)==null?void 0:g.last_row_id,agent_id:r,topic:o,content:c,keywords:p})});y.post("/api/knowledge/clone",async e=>{const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const{from_agent_id:r,to_agent_id:o,category:a,limit:s}=await e.req.json();if(!r||!o)return e.json({error:"from_agent_id e to_agent_id são obrigatórios"},400);if(!_.find(g=>g.id===o))return e.json({error:"Agente destino não encontrado"},404);let c="SELECT * FROM knowledge WHERE agent_id=?";const n=[r];a&&(c+=" AND category=?",n.push(a)),c+=" ORDER BY confidence DESC, used_count DESC LIMIT ?",n.push(Math.min(s??20,100));const p=(await t.prepare(c).bind(...n).all()).results??[];if(p.length===0)return e.json({cloned:0,message:"Nenhum conhecimento encontrado para clonar"});let u=0;for(const g of p)try{await t.prepare(`INSERT OR IGNORE INTO knowledge (agent_id,topic,category,content,source_url,source_type,confidence,keywords)
         SELECT ?,topic,category,content,source_url,'cloned',confidence*0.95,keywords FROM knowledge WHERE id=?`).bind(o,g.id).run(),u++}catch{}return e.json({success:!0,from_agent_id:r,to_agent_id:o,cloned:u,total_available:p.length})});y.get("/api/knowledge/stats",async e=>{const t=e.env.DB;if(!t)return e.json({error:"DB não disponível"},503);const r=await t.prepare("SELECT COUNT(*) as n FROM knowledge").first(),o=await t.prepare(`SELECT agent_id, COUNT(*) as entries, AVG(confidence) as avg_confidence, SUM(used_count) as total_uses
     FROM knowledge GROUP BY agent_id ORDER BY entries DESC`).all(),a=await t.prepare("SELECT source_type, COUNT(*) as n FROM knowledge GROUP BY source_type").all();return e.json({total:(r==null?void 0:r.n)??0,by_agent:o.results??[],by_source:a.results??[]})});y.get("/",e=>e.html(`<!DOCTYPE html>
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
</html>`));const rt=new At,Er=Object.assign({"/src/index.tsx":y});let Ot=!1;for(const[,e]of Object.entries(Er))e&&(rt.route("/",e),rt.notFound(e.notFoundHandler),Ot=!0);if(!Ot)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{rt as default};
