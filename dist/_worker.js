var Ot=Object.defineProperty;var Ye=e=>{throw TypeError(e)};var jt=(e,t,r)=>t in e?Ot(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var g=(e,t,r)=>jt(e,typeof t!="symbol"?t+"":t,r),Ve=(e,t,r)=>t.has(e)||Ye("Cannot "+r);var n=(e,t,r)=>(Ve(e,t,"read from private field"),r?r.call(e):t.get(e)),m=(e,t,r)=>t.has(e)?Ye("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),f=(e,t,r,o)=>(Ve(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),b=(e,t,r)=>(Ve(e,t,"access private method"),r);var Qe=(e,t,r,o)=>({set _(a){f(e,t,a,r)},get _(){return n(e,t,o)}});var Ze=(e,t,r)=>(o,a)=>{let i=-1;return s(0);async function s(l){if(l<=i)throw new Error("next() called multiple times");i=l;let d,c=!1,p;if(e[l]?(p=e[l][0][0],o.req.routeIndex=l):p=l===e.length&&a||void 0,p)try{d=await p(o,()=>s(l+1))}catch(u){if(u instanceof Error&&t)o.error=u,d=await t(u,o),c=!0;else throw u}else o.finalized===!1&&r&&(d=await r(o));return d&&(o.finalized===!1||c)&&(o.res=d),o}},Dt=Symbol(),Pt=async(e,t=Object.create(null))=>{const{all:r=!1,dot:o=!1}=t,i=(e instanceof mt?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?Tt(e,{all:r,dot:o}):{}};async function Tt(e,t){const r=await e.formData();return r?It(r,t):{}}function It(e,t){const r=Object.create(null);return e.forEach((o,a)=>{t.all||a.endsWith("[]")?Lt(r,a,o):r[a]=o}),t.dot&&Object.entries(r).forEach(([o,a])=>{o.includes(".")&&(Ft(r,o,a),delete r[o])}),r}var Lt=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Ft=(e,t,r)=>{if(/(?:^|\.)__proto__\./.test(t))return;let o=e;const a=t.split(".");a.forEach((i,s)=>{s===a.length-1?o[i]=r:((!o[i]||typeof o[i]!="object"||Array.isArray(o[i])||o[i]instanceof File)&&(o[i]=Object.create(null)),o=o[i])})},pt=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Mt=e=>{const{groups:t,path:r}=qt(e),o=pt(r);return Bt(o,t)},qt=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,o)=>{const a=`@${o}`;return t.push([a,r]),a}),{groups:t,path:e}},Bt=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[o]=t[r];for(let a=e.length-1;a>=0;a--)if(e[a].includes(o)){e[a]=e[a].replace(o,t[r][1]);break}}return e},De={},Nt=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const o=`${e}#${t}`;return De[o]||(r[2]?De[o]=t&&t[0]!==":"&&t[0]!=="*"?[o,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:De[o]=[e,r[1],!0]),De[o]}return null},Ke=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},Ht=e=>Ke(e,decodeURI),ut=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let o=r;for(;o<t.length;o++){const a=t.charCodeAt(o);if(a===37){const i=t.indexOf("?",o),s=t.indexOf("#",o),l=i===-1?s===-1?void 0:s:s===-1?i:Math.min(i,s),d=t.slice(r,l);return Ht(d.includes("%25")?d.replace(/%25/g,"%2525"):d)}else if(a===63||a===35)break}return t.slice(r,o)},$t=e=>{const t=ut(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},X=(e,t,...r)=>(r.length&&(t=X(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),ft=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let o="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))o+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){r.length===0&&o===""?r.push("/"):r.push(o);const i=a.replace("?","");o+="/"+i,r.push(o)}else o+="/"+a}),r.filter((a,i,s)=>s.indexOf(a)===i)},Ue=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?Ke(e,ht):e):e,gt=(e,t,r)=>{let o;if(!r&&t&&!/[%+]/.test(t)){let s=e.indexOf("?",8);if(s===-1)return;for(e.startsWith(t,s+1)||(s=e.indexOf(`&${t}`,s+1));s!==-1;){const l=e.charCodeAt(s+t.length+1);if(l===61){const d=s+t.length+2,c=e.indexOf("&",d);return Ue(e.slice(d,c===-1?void 0:c))}else if(l==38||isNaN(l))return"";s=e.indexOf(`&${t}`,s+1)}if(o=/[%+]/.test(e),!o)return}const a={};o??(o=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const s=e.indexOf("&",i+1);let l=e.indexOf("=",i);l>s&&s!==-1&&(l=-1);let d=e.slice(i+1,l===-1?s===-1?void 0:s:l);if(o&&(d=Ue(d)),i=s,d==="")continue;let c;l===-1?c="":(c=e.slice(l+1,s===-1?void 0:s),o&&(c=Ue(c))),r?(a[d]&&Array.isArray(a[d])||(a[d]=[]),a[d].push(c)):a[d]??(a[d]=c)}return t?a[t]:a},Vt=gt,Ut=(e,t)=>gt(e,t,!0),ht=decodeURIComponent,et=e=>Ke(e,ht),pe,z,$,xt,bt,Ge,M,it,mt=(it=class{constructor(e,t="/",r=[[]]){m(this,$);g(this,"raw");m(this,pe);m(this,z);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});m(this,M,e=>{const{bodyCache:t,raw:r}=this,o=t[e];if(o)return o;const a=Object.keys(t)[0];return a?t[a].then(i=>(a==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,f(this,z,r),f(this,pe,{})}param(e){return e?b(this,$,xt).call(this,e):b(this,$,bt).call(this)}query(e){return Vt(this.url,e)}queries(e){return Ut(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,o)=>{t[o]=r}),t}async parseBody(e){return Pt(this,e)}json(){return n(this,M).call(this,"text").then(e=>JSON.parse(e))}text(){return n(this,M).call(this,"text")}arrayBuffer(){return n(this,M).call(this,"arrayBuffer")}bytes(){return n(this,M).call(this,"arrayBuffer").then(e=>new Uint8Array(e))}blob(){return n(this,M).call(this,"blob")}formData(){return n(this,M).call(this,"formData")}addValidatedData(e,t){n(this,pe)[e]=t}valid(e){return n(this,pe)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Dt](){return n(this,z)}get matchedRoutes(){return n(this,z)[0].map(([[,e]])=>e)}get routePath(){return n(this,z)[0].map(([[,e]])=>e)[this.routeIndex].path}},pe=new WeakMap,z=new WeakMap,$=new WeakSet,xt=function(e){const t=n(this,z)[0][this.routeIndex][1][e],r=b(this,$,Ge).call(this,t);return r&&/\%/.test(r)?et(r):r},bt=function(){const e={},t=Object.keys(n(this,z)[0][this.routeIndex][1]);for(const r of t){const o=b(this,$,Ge).call(this,n(this,z)[0][this.routeIndex][1][r]);o!==void 0&&(e[r]=/\%/.test(o)?et(o):o)}return e},Ge=function(e){return n(this,z)[1]?n(this,z)[1][e]:e},M=new WeakMap,it),_t={Stringify:1},vt=async(e,t,r,o,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(a?a[0]+=e:a=[e],Promise.all(i.map(l=>l({phase:t,buffer:a,context:o}))).then(l=>Promise.all(l.filter(Boolean).map(d=>vt(d,t,!1,o,a))).then(()=>a[0]))):Promise.resolve(e)},Gt="text/plain; charset=UTF-8",_e=(e,t)=>({"Content-Type":e,...t}),we=(e,t)=>new Response(e,t),Ee,Re,q,ue,B,S,Se,fe,ge,ee,ze,Oe,U,le,st,Kt=(st=class{constructor(e,t){m(this,U);m(this,Ee);m(this,Re);g(this,"env",{});m(this,q);g(this,"finalized",!1);g(this,"error");m(this,ue);m(this,B);m(this,S);m(this,Se);m(this,fe);m(this,ge);m(this,ee);m(this,ze);m(this,Oe);g(this,"render",(...e)=>(n(this,fe)??f(this,fe,t=>this.html(t)),n(this,fe).call(this,...e)));g(this,"setLayout",e=>f(this,Se,e));g(this,"getLayout",()=>n(this,Se));g(this,"setRenderer",e=>{f(this,fe,e)});g(this,"header",(e,t,r)=>{this.finalized&&f(this,S,we(n(this,S).body,n(this,S)));const o=n(this,S)?n(this,S).headers:n(this,ee)??f(this,ee,new Headers);t===void 0?o.delete(e):r!=null&&r.append?o.append(e,t):o.set(e,t)});g(this,"status",e=>{f(this,ue,e)});g(this,"set",(e,t)=>{n(this,q)??f(this,q,new Map),n(this,q).set(e,t)});g(this,"get",e=>n(this,q)?n(this,q).get(e):void 0);g(this,"newResponse",(...e)=>b(this,U,le).call(this,...e));g(this,"body",(e,t,r)=>b(this,U,le).call(this,e,t,r));g(this,"text",(e,t,r)=>!n(this,ee)&&!n(this,ue)&&!t&&!r&&!this.finalized?new Response(e):b(this,U,le).call(this,e,t,_e(Gt,r)));g(this,"json",(e,t,r)=>b(this,U,le).call(this,JSON.stringify(e),t,_e("application/json",r)));g(this,"html",(e,t,r)=>{const o=a=>b(this,U,le).call(this,a,t,_e("text/html; charset=UTF-8",r));return typeof e=="object"?vt(e,_t.Stringify,!1,{}).then(o):o(e)});g(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});g(this,"notFound",()=>(n(this,ge)??f(this,ge,()=>we()),n(this,ge).call(this,this)));f(this,Ee,e),t&&(f(this,B,t.executionCtx),this.env=t.env,f(this,ge,t.notFoundHandler),f(this,Oe,t.path),f(this,ze,t.matchResult))}get req(){return n(this,Re)??f(this,Re,new mt(n(this,Ee),n(this,Oe),n(this,ze))),n(this,Re)}get event(){if(n(this,B)&&"respondWith"in n(this,B))return n(this,B);throw Error("This context has no FetchEvent")}get executionCtx(){if(n(this,B))return n(this,B);throw Error("This context has no ExecutionContext")}get res(){return n(this,S)||f(this,S,we(null,{headers:n(this,ee)??f(this,ee,new Headers)}))}set res(e){if(n(this,S)&&e){e=we(e.body,e);for(const[t,r]of n(this,S).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const o=n(this,S).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of o)e.headers.append("set-cookie",a)}else e.headers.set(t,r)}f(this,S,e),this.finalized=!0}get var(){return n(this,q)?Object.fromEntries(n(this,q)):{}}},Ee=new WeakMap,Re=new WeakMap,q=new WeakMap,ue=new WeakMap,B=new WeakMap,S=new WeakMap,Se=new WeakMap,fe=new WeakMap,ge=new WeakMap,ee=new WeakMap,ze=new WeakMap,Oe=new WeakMap,U=new WeakSet,le=function(e,t,r){const o=n(this,S)?new Headers(n(this,S).headers):n(this,ee)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[s,l]of i)s.toLowerCase()==="set-cookie"?o.append(s,l):o.set(s,l)}if(r)for(const[i,s]of Object.entries(r))if(typeof s=="string")o.set(i,s);else{o.delete(i);for(const l of s)o.append(i,l)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??n(this,ue);return we(e,{status:a,headers:o})},st),y="ALL",Wt="all",Jt=["get","post","put","delete","options","patch"],yt="Can not add a route since the matcher is already built.",wt=class extends Error{},Xt="__COMPOSED_HANDLER",Yt=e=>e.text("404 Not Found",404),tt=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},j,w,kt,D,Y,Pe,Te,he,Qt=(he=class{constructor(t={}){m(this,w);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");m(this,j,"/");g(this,"routes",[]);m(this,D,Yt);g(this,"errorHandler",tt);g(this,"onError",t=>(this.errorHandler=t,this));g(this,"notFound",t=>(f(this,D,t),this));g(this,"fetch",(t,...r)=>b(this,w,Te).call(this,t,r[1],r[0],t.method));g(this,"request",(t,r,o,a)=>t instanceof Request?this.fetch(r?new Request(t,r):t,o,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${X("/",t)}`,r),o,a)));g(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(b(this,w,Te).call(this,t.request,t,void 0,t.request.method))})});[...Jt,Wt].forEach(i=>{this[i]=(s,...l)=>(typeof s=="string"?f(this,j,s):b(this,w,Y).call(this,i,n(this,j),s),l.forEach(d=>{b(this,w,Y).call(this,i,n(this,j),d)}),this)}),this.on=(i,s,...l)=>{for(const d of[s].flat()){f(this,j,d);for(const c of[i].flat())l.map(p=>{b(this,w,Y).call(this,c.toUpperCase(),n(this,j),p)})}return this},this.use=(i,...s)=>(typeof i=="string"?f(this,j,i):(f(this,j,"*"),s.unshift(i)),s.forEach(l=>{b(this,w,Y).call(this,y,n(this,j),l)}),this);const{strict:o,...a}=t;Object.assign(this,a),this.getPath=o??!0?t.getPath??ut:$t}route(t,r){const o=this.basePath(t);return r.routes.map(a=>{var s;let i;r.errorHandler===tt?i=a.handler:(i=async(l,d)=>(await Ze([],r.errorHandler)(l,()=>a.handler(l,d))).res,i[Xt]=a.handler),b(s=o,w,Y).call(s,a.method,a.path,i,a.basePath)}),this}basePath(t){const r=b(this,w,kt).call(this);return r._basePath=X(this._basePath,t),r}mount(t,r,o){let a,i;o&&(typeof o=="function"?i=o:(i=o.optionHandler,o.replaceRequest===!1?a=d=>d:a=o.replaceRequest));const s=i?d=>{const c=i(d);return Array.isArray(c)?c:[c]}:d=>{let c;try{c=d.executionCtx}catch{}return[d.env,c]};a||(a=(()=>{const d=X(this._basePath,t),c=d==="/"?0:d.length;return p=>{const u=new URL(p.url);return u.pathname=this.getPath(p).slice(c)||"/",new Request(u,p)}})());const l=async(d,c)=>{const p=await r(a(d.req.raw),...s(d));if(p)return p;await c()};return b(this,w,Y).call(this,y,X(t,"*"),l),this}},j=new WeakMap,w=new WeakSet,kt=function(){const t=new he({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,f(t,D,n(this,D)),t.routes=this.routes,t},D=new WeakMap,Y=function(t,r,o,a){t=t.toUpperCase(),r=X(this._basePath,r);const i={basePath:a!==void 0?X(this._basePath,a):this._basePath,path:r,method:t,handler:o};this.router.add(t,r,[o,i]),this.routes.push(i)},Pe=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},Te=function(t,r,o,a){if(a==="HEAD")return(async()=>new Response(null,await b(this,w,Te).call(this,t,r,o,"GET")))();const i=this.getPath(t,{env:o}),s=this.router.match(a,i),l=new Kt(t,{path:i,matchResult:s,env:o,executionCtx:r,notFoundHandler:n(this,D)});if(s[0].length===1){let c;try{c=s[0][0][0][0](l,async()=>{l.res=await n(this,D).call(this,l)})}catch(p){return b(this,w,Pe).call(this,p,l)}return c instanceof Promise?c.then(p=>p||(l.finalized?l.res:n(this,D).call(this,l))).catch(p=>b(this,w,Pe).call(this,p,l)):c??n(this,D).call(this,l)}const d=Ze(s[0],this.errorHandler,n(this,D));return(async()=>{try{const c=await d(l);if(!c.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return b(this,w,Pe).call(this,c,l)}})()},he),At=[];function Zt(e,t){const r=this.buildAllMatchers(),o=(a,i)=>{const s=r[a]||r[y],l=s[2][i];if(l)return l;const d=i.match(s[0]);if(!d)return[[],At];const c=d.indexOf("",1);return[s[1][c],d]};return this.match=o,o(e,t)}var Le="[^/]+",Ae=".*",Ce="(?:|/.*)",ce=Symbol(),er=new Set(".\\+*[^]$()");function tr(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Ae||e===Ce?1:t===Ae||t===Ce?-1:e===Le?1:t===Le?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var te,re,P,ie,rr=(ie=class{constructor(){m(this,te);m(this,re);m(this,P,Object.create(null))}insert(t,r,o,a,i){if(t.length===0){if(n(this,te)!==void 0)throw ce;if(i)return;f(this,te,r);return}const[s,...l]=t,d=s==="*"?l.length===0?["","",Ae]:["","",Le]:s==="/*"?["","",Ce]:s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let c;if(d){const p=d[1];let u=d[2]||Le;if(p&&d[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw ce;if(c=n(this,P)[u],!c){if(Object.keys(n(this,P)).some(x=>x!==Ae&&x!==Ce))throw ce;if(i)return;c=n(this,P)[u]=new ie,p!==""&&f(c,re,a.varIndex++)}!i&&p!==""&&o.push([p,n(c,re)])}else if(c=n(this,P)[s],!c){if(Object.keys(n(this,P)).some(p=>p.length>1&&p!==Ae&&p!==Ce))throw ce;if(i)return;c=n(this,P)[s]=new ie}c.insert(l,r,o,a,i)}buildRegExpStr(){const r=Object.keys(n(this,P)).sort(tr).map(o=>{const a=n(this,P)[o];return(typeof n(a,re)=="number"?`(${o})@${n(a,re)}`:er.has(o)?`\\${o}`:o)+a.buildRegExpStr()});return typeof n(this,te)=="number"&&r.unshift(`#${n(this,te)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},te=new WeakMap,re=new WeakMap,P=new WeakMap,ie),qe,je,nt,or=(nt=class{constructor(){m(this,qe,{varIndex:0});m(this,je,new rr)}insert(e,t,r){const o=[],a=[];for(let s=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,d=>{const c=`@\\${s}`;return a[s]=[c,d],s++,l=!0,c}),!l)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let s=a.length-1;s>=0;s--){const[l]=a[s];for(let d=i.length-1;d>=0;d--)if(i[d].indexOf(l)!==-1){i[d]=i[d].replace(l,a[s][1]);break}}return n(this,je).insert(i,t,o,n(this,qe),r),o}buildRegExp(){let e=n(this,je).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],o=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,i,s)=>i!==void 0?(r[++t]=Number(i),"$()"):(s!==void 0&&(o[Number(s)]=++t),"")),[new RegExp(`^${e}`),r,o]}},qe=new WeakMap,je=new WeakMap,nt),ar=[/^$/,[],Object.create(null)],Ie=Object.create(null);function Ct(e){return Ie[e]??(Ie[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function ir(){Ie=Object.create(null)}function sr(e){var c;const t=new or,r=[];if(e.length===0)return ar;const o=e.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[x,C])=>p?1:x?-1:u.length-C.length),a=Object.create(null);for(let p=0,u=-1,x=o.length;p<x;p++){const[C,E,I]=o[p];C?a[E]=[I.map(([T])=>[T,Object.create(null)]),At]:u++;let O;try{O=t.insert(E,u,C)}catch(T){throw T===ce?new wt(E):T}C||(r[u]=I.map(([T,v])=>{const L=Object.create(null);for(v-=1;v>=0;v--){const[be,He]=O[v];L[be]=He}return[T,L]}))}const[i,s,l]=t.buildRegExp();for(let p=0,u=r.length;p<u;p++)for(let x=0,C=r[p].length;x<C;x++){const E=(c=r[p][x])==null?void 0:c[1];if(!E)continue;const I=Object.keys(E);for(let O=0,T=I.length;O<T;O++)E[I[O]]=l[E[I[O]]]}const d=[];for(const p in s)d[p]=r[s[p]];return[i,d,a]}function de(e,t){if(e){for(const r of Object.keys(e).sort((o,a)=>a.length-o.length))if(Ct(r).test(t))return[...e[r]]}}var _,G,Be,Et,dt,nr=(dt=class{constructor(){m(this,Be);g(this,"name","RegExpRouter");m(this,_);m(this,G);g(this,"match",Zt);f(this,_,{[y]:Object.create(null)}),f(this,G,{[y]:Object.create(null)})}add(e,t,r){var l;const o=n(this,_),a=n(this,G);if(!o||!a)throw new Error(yt);o[e]||[o,a].forEach(d=>{d[e]=Object.create(null),Object.keys(d[y]).forEach(c=>{d[e][c]=[...d[y][c]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const d=Ct(t);e===y?Object.keys(o).forEach(c=>{var p;(p=o[c])[t]||(p[t]=de(o[c],t)||de(o[y],t)||[])}):(l=o[e])[t]||(l[t]=de(o[e],t)||de(o[y],t)||[]),Object.keys(o).forEach(c=>{(e===y||e===c)&&Object.keys(o[c]).forEach(p=>{d.test(p)&&o[c][p].push([r,i])})}),Object.keys(a).forEach(c=>{(e===y||e===c)&&Object.keys(a[c]).forEach(p=>d.test(p)&&a[c][p].push([r,i]))});return}const s=ft(t)||[t];for(let d=0,c=s.length;d<c;d++){const p=s[d];Object.keys(a).forEach(u=>{var x;(e===y||e===u)&&((x=a[u])[p]||(x[p]=[...de(o[u],p)||de(o[y],p)||[]]),a[u][p].push([r,i-c+d+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(n(this,G)).concat(Object.keys(n(this,_))).forEach(t=>{e[t]||(e[t]=b(this,Be,Et).call(this,t))}),f(this,_,f(this,G,void 0)),ir(),e}},_=new WeakMap,G=new WeakMap,Be=new WeakSet,Et=function(e){const t=[];let r=e===y;return[n(this,_),n(this,G)].forEach(o=>{const a=o[e]?Object.keys(o[e]).map(i=>[i,o[e][i]]):[];a.length!==0?(r||(r=!0),t.push(...a)):e!==y&&t.push(...Object.keys(o[y]).map(i=>[i,o[y][i]]))}),r?sr(t):null},dt),K,N,lt,dr=(lt=class{constructor(e){g(this,"name","SmartRouter");m(this,K,[]);m(this,N,[]);f(this,K,e.routers)}add(e,t,r){if(!n(this,N))throw new Error(yt);n(this,N).push([e,t,r])}match(e,t){if(!n(this,N))throw new Error("Fatal error");const r=n(this,K),o=n(this,N),a=r.length;let i=0,s;for(;i<a;i++){const l=r[i];try{for(let d=0,c=o.length;d<c;d++)l.add(...o[d]);s=l.match(e,t)}catch(d){if(d instanceof wt)continue;throw d}this.match=l.match.bind(l),f(this,K,[l]),f(this,N,void 0);break}if(i===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,s}get activeRouter(){if(n(this,N)||n(this,K).length!==1)throw new Error("No active router has been determined yet.");return n(this,K)[0]}},K=new WeakMap,N=new WeakMap,lt),ke=Object.create(null),lr=e=>{for(const t in e)return!0;return!1},W,R,oe,me,k,H,Q,xe,cr=(xe=class{constructor(t,r,o){m(this,H);m(this,W);m(this,R);m(this,oe);m(this,me,0);m(this,k,ke);if(f(this,R,o||Object.create(null)),f(this,W,[]),t&&r){const a=Object.create(null);a[t]={handler:r,possibleKeys:[],score:0},f(this,W,[a])}f(this,oe,[])}insert(t,r,o){f(this,me,++Qe(this,me)._);let a=this;const i=Mt(r),s=[];for(let l=0,d=i.length;l<d;l++){const c=i[l],p=i[l+1],u=Nt(c,p),x=Array.isArray(u)?u[0]:c;if(x in n(a,R)){a=n(a,R)[x],u&&s.push(u[1]);continue}n(a,R)[x]=new xe,u&&(n(a,oe).push(u),s.push(u[1])),a=n(a,R)[x]}return n(a,W).push({[t]:{handler:o,possibleKeys:s.filter((l,d,c)=>c.indexOf(l)===d),score:n(this,me)}}),a}search(t,r){var p;const o=[];f(this,k,ke);let i=[this];const s=pt(r),l=[],d=s.length;let c=null;for(let u=0;u<d;u++){const x=s[u],C=u===d-1,E=[];for(let O=0,T=i.length;O<T;O++){const v=i[O],L=n(v,R)[x];L&&(f(L,k,n(v,k)),C?(n(L,R)["*"]&&b(this,H,Q).call(this,o,n(L,R)["*"],t,n(v,k)),b(this,H,Q).call(this,o,L,t,n(v,k))):E.push(L));for(let be=0,He=n(v,oe).length;be<He;be++){const Je=n(v,oe)[be],V=n(v,k)===ke?{}:{...n(v,k)};if(Je==="*"){const se=n(v,R)["*"];se&&(b(this,H,Q).call(this,o,se,t,n(v,k)),f(se,k,V),E.push(se));continue}const[zt,Xe,ve]=Je;if(!x&&!(ve instanceof RegExp))continue;const F=n(v,R)[zt];if(ve instanceof RegExp){if(c===null){c=new Array(d);let ne=r[0]==="/"?1:0;for(let ye=0;ye<d;ye++)c[ye]=ne,ne+=s[ye].length+1}const se=r.substring(c[u]),$e=ve.exec(se);if($e){if(V[Xe]=$e[0],b(this,H,Q).call(this,o,F,t,n(v,k),V),lr(n(F,R))){f(F,k,V);const ne=((p=$e[0].match(/\//))==null?void 0:p.length)??0;(l[ne]||(l[ne]=[])).push(F)}continue}}(ve===!0||ve.test(x))&&(V[Xe]=x,C?(b(this,H,Q).call(this,o,F,t,V,n(v,k)),n(F,R)["*"]&&b(this,H,Q).call(this,o,n(F,R)["*"],t,V,n(v,k))):(f(F,k,V),E.push(F)))}}const I=l.shift();i=I?E.concat(I):E}return o.length>1&&o.sort((u,x)=>u.score-x.score),[o.map(({handler:u,params:x})=>[u,x])]}},W=new WeakMap,R=new WeakMap,oe=new WeakMap,me=new WeakMap,k=new WeakMap,H=new WeakSet,Q=function(t,r,o,a,i){for(let s=0,l=n(r,W).length;s<l;s++){const d=n(r,W)[s],c=d[o]||d[y],p={};if(c!==void 0&&(c.params=Object.create(null),t.push(c),a!==ke||i&&i!==ke))for(let u=0,x=c.possibleKeys.length;u<x;u++){const C=c.possibleKeys[u],E=p[c.score];c.params[C]=i!=null&&i[C]&&!E?i[C]:a[C]??(i==null?void 0:i[C]),p[c.score]=!0}}},xe),ae,ct,pr=(ct=class{constructor(){g(this,"name","TrieRouter");m(this,ae);f(this,ae,new cr)}add(e,t,r){const o=ft(t);if(o){for(let a=0,i=o.length;a<i;a++)n(this,ae).insert(e,o[a],r);return}n(this,ae).insert(e,t,r)}match(e,t){return n(this,ae).search(e,t)}},ae=new WeakMap,ct),Rt=class extends Qt{constructor(e={}){super(e),this.router=e.router??new dr({routers:[new nr,new pr]})}},ur=e=>{const t={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...e},r=(a=>typeof a=="string"?a==="*"?()=>a:i=>a===i?i:null:typeof a=="function"?a:i=>a.includes(i)?i:null)(t.origin),o=(a=>typeof a=="function"?a:Array.isArray(a)?()=>a:()=>[])(t.allowMethods);return async function(i,s){var c;function l(p,u){i.res.headers.set(p,u)}const d=await r(i.req.header("origin")||"",i);if(d&&l("Access-Control-Allow-Origin",d),t.credentials&&l("Access-Control-Allow-Credentials","true"),(c=t.exposeHeaders)!=null&&c.length&&l("Access-Control-Expose-Headers",t.exposeHeaders.join(",")),i.req.method==="OPTIONS"){t.origin!=="*"&&l("Vary","Origin"),t.maxAge!=null&&l("Access-Control-Max-Age",t.maxAge.toString());const p=await o(i.req.header("origin")||"",i);p.length&&l("Access-Control-Allow-Methods",p.join(","));let u=t.allowHeaders;if(!(u!=null&&u.length)){const x=i.req.header("Access-Control-Request-Headers");x&&(u=x.split(/\s*,\s*/))}return u!=null&&u.length&&(l("Access-Control-Allow-Headers",u.join(",")),i.res.headers.append("Vary","Access-Control-Request-Headers")),i.res.headers.delete("Content-Length"),i.res.headers.delete("Content-Type"),new Response(null,{headers:i.res.headers,status:204,statusText:"No Content"})}await s(),t.origin!=="*"&&i.header("Vary","Origin",{append:!0})}};const h={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},Z="https://api.sixtechbrasil.com.br",fr="https://sixtechworkspace.kainow252-cmyk.workers.dev",J=[{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Orquestração",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Roteamento inteligente","Síntese multi-agente","Planejamento","Delegação","Consolidação"],desc:"CEO da equipe — analisa, delega e sintetiza resultados de todos os agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6.
Missão: ANALISAR → PLANEJAR → SINTETIZAR → DECIDIR. Seja o CEO da equipe.
Responda SEMPRE em português brasileiro com markdown rico.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Orquestração",source:"cloudflare",model:h.reason,basedOn:"DeepSeek R1 32B",capabilities:["SWOT","KPIs","Chain-of-thought","BI","Cenários"],desc:"Raciocínio analítico avançado — DeepSeek R1 chain-of-thought, análise SWOT e KPIs",system:"Você é analista de elite da SixTech Brasil. Use chain-of-thought para analisar dados, KPIs, SWOT e cenários. Responda em português."},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","QA","Security audit","Scoring 0-10","Melhorias"],desc:"Revisor crítico — analisa qualidade com scoring rigoroso e sugestões concretas",system:"Você é QA Lead da SixTech. Analise com framework: Problemas, Positivos, Melhorias, Score 0-10. Seja direto e honesto. Responda em português."},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Orquestração",source:"cloudflare",model:h.balanced,basedOn:"Llama 3.1 8B + SSE",capabilities:["Chat geral","Streaming","Multi-idioma","Contexto","Rápido"],desc:"Assistente conversacional com streaming SSE em tempo real",system:"Você é o assistente da SixTech Brasil. Seja útil, amigável e direto. Responda em português por padrão."},{id:"admin-secretary",name:"Secretária Executiva",emoji:"📅",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["Agendamentos","E-mails","Atas de reunião","Organização","Follow-up"],desc:"Organiza agenda, redige e-mails profissionais e gerencia comunicações executivas",system:"Você é secretária executiva sênior. Organize agendas, redija e-mails formais e atas de reunião com clareza e profissionalismo. Responda em português."},{id:"admin-processes",name:"Gestor de Processos",emoji:"⚙️",color:"#6C63FF",category:"Administrativo",source:"cloudflare",model:h.balanced,capabilities:["BPM","Fluxogramas","SOP","Automação","Indicadores"],desc:"Mapeia, documenta e otimiza processos administrativos e operacionais",system:"Você é especialista em BPM e gestão de processos. Mapeie fluxos, crie SOPs e identifique gargalos. Responda em português."},{id:"fin-controller",name:"Controller",emoji:"💰",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["DRE","Fluxo de caixa","Budget","Variance","Relatórios"],desc:"Controller financeiro — DRE, fluxo de caixa, orçamento e análise de variações",system:"Você é controller financeiro sênior. Analise demonstrativos, cash flow, budget vs realizado. Use raciocínio estruturado. Responda em português."},{id:"fin-invest",name:"Analista de Investimentos",emoji:"📈",color:"#F59E0B",category:"Financeiro",source:"cloudflare",model:h.reason,capabilities:["Valuation","ROI","VPL/TIR","Carteira","Risco"],desc:"Análise de investimentos, valuation de empresas e gestão de portfólio",system:"Você é analista de investimentos. Calcule ROI, VPL, TIR, faça valuation e análise de risco. Responda em português com rigor quantitativo."},{id:"credit-analyst",name:"Analista de Crédito",emoji:"🏦",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.reason,capabilities:["Score","Rating","Risco PF/PJ","Política de crédito","Cobrança"],desc:"Analisa perfil de crédito, score, rating e política de concessão PF e PJ",system:"Você é analista de crédito sênior. Avalie risco de crédito, score, rating e recomende política de concessão. Responda em português."},{id:"credit-recovery",name:"Gestor de Cobrança",emoji:"🔔",color:"#3B82F6",category:"Crédito",source:"cloudflare",model:h.balanced,capabilities:["Régua de cobrança","Negativação","Renegociação","Scripts","KPIs"],desc:"Estratégias de cobrança, réguas, scripts de negociação e renegociação de dívidas",system:"Você é gestor de recuperação de crédito. Crie réguas de cobrança, scripts de negociação e estratégias de renegociação. Responda em português."},{id:"insurance-broker",name:"Corretor de Seguros",emoji:"🛡️",color:"#0EA5E9",category:"Seguros",source:"cloudflare",model:h.balanced,capabilities:["Cotação","Coberturas","Sinistro","Vida/Auto/Patrimonial","Comparativo"],desc:"Especialista em seguros — cotações, coberturas, análise de apólices e sinistros",system:"Você é corretor de seguros especialista. Explique coberturas, compare apólices e oriente sobre sinistros. Responda em português."},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#D97706",category:"Jurídico",source:"hybrid",model:h.powerful,internalUrl:`${Z}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos","LGPD","NDAs","Compliance","Due diligence"],desc:"Especialista jurídico — contratos, LGPD, direito digital e compliance",system:"Você é especialista jurídico da SixTech. Analise contratos, LGPD, NDAs. DISCLAIMER: consulte advogado para casos reais. Responda em português."},{id:"legal-labor",name:"Trabalhista",emoji:"👷",color:"#D97706",category:"Jurídico",source:"cloudflare",model:h.powerful,capabilities:["CLT","eSocial","Rescisão","Folha","Convenção coletiva"],desc:"Direito trabalhista — CLT, eSocial, rescisões, folha e convenções coletivas",system:"Você é especialista em direito trabalhista brasileiro. Oriente sobre CLT, eSocial, rescisões e folha. DISCLAIMER: consulte advogado. Responda em português."},{id:"affiliate-manager",name:"Gestor de Afiliados",emoji:"🤝",color:"#7C3AED",category:"Afiliados",source:"cloudflare",model:h.balanced,capabilities:["Programa de afiliados","Comissões","Recrutamento","Métricas","Materiais"],desc:"Gerencia programas de afiliados, estrutura comissões e recruta parceiros",system:"Você é gestor de programas de afiliados. Estruture comissões, estratégias de recrutamento e métricas de performance. Responda em português."},{id:"marketing-content",name:"Criador de Conteúdo",emoji:"📢",color:"#EC4899",category:"Marketing",source:"hybrid",model:h.powerful,internalUrl:`${Z}/agents/marketing`,capabilities:["Posts redes sociais","Blog SEO","Roteiros","E-mail marketing","Headlines"],desc:"Cria conteúdo persuasivo para redes sociais, blog, e-mail e campanhas",system:"Você é criador de conteúdo de marketing. Crie posts virais, artigos SEO e e-mails persuasivos. Tom: engajante e autêntico. Responda em português."},{id:"marketing-growth",name:"Growth Hacker",emoji:"🚀",color:"#EC4899",category:"Marketing",source:"cloudflare",model:h.powerful,capabilities:["Funil","A/B Testing","CAC/LTV","Paid ads","Automação"],desc:"Estratégias de crescimento acelerado — funil, paid ads, A/B test e automação",system:"Você é growth hacker sênior. Proponha experimentos de crescimento, otimize funil, CAC/LTV e estratégias paid. Responda em português."},{id:"sales-hunter",name:"Vendedor Hunter",emoji:"📞",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Prospecção","Cold call","Pitch","Objeções","CRM"],desc:"Especialista em prospecção ativa — scripts de vendas, pitch e gestão de objeções",system:"Você é vendedor hunter sênior. Crie scripts de prospecção, pitches matadores e respostas a objeções. Responda em português com energia."},{id:"sales-closer",name:"Closer",emoji:"🏆",color:"#059669",category:"Comercial",source:"cloudflare",model:h.balanced,capabilities:["Fechamento","Proposta comercial","Negociação","Up-sell","Contrato"],desc:"Especialista em fechamento de vendas — propostas, negociação e contratos",system:"Você é closer de vendas. Ajude a fechar negócios com propostas irresistíveis, técnicas de negociação e contratos. Responda em português."},{id:"realestate-agent",name:"Corretor Imobiliário",emoji:"🏠",color:"#0891B2",category:"Imobiliário",source:"cloudflare",model:h.balanced,capabilities:["Avaliação","Captação","Financiamento","Documentação","Negociação"],desc:"Corretor especializado — avaliação, captação, financiamento e documentação",system:"Você é corretor imobiliário experiente. Oriente sobre avaliação, financiamento e documentação de imóveis. Responda em português."},{id:"hr-recruiter",name:"Recrutador",emoji:"👥",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["Job description","Triagem","Entrevista","Assessment","Onboarding"],desc:"Recrutamento e seleção — job descriptions, entrevistas e onboarding",system:"Você é recrutador sênior. Crie JDs atrativas, roteiros de entrevista e processos de onboarding. Responda em português."},{id:"hr-training",name:"T&D",emoji:"🎓",color:"#7C3AED",category:"RH",source:"cloudflare",model:h.balanced,capabilities:["LNT","Trilhas","Treinamentos","Avaliação de desempenho","PDI"],desc:"Treinamento e Desenvolvimento — LNT, trilhas de aprendizado e PDI",system:"Você é especialista em T&D. Crie LNT, trilhas de aprendizado e PDI para desenvolvimento de pessoas. Responda em português."},{id:"health-manager",name:"Gestor de Saúde",emoji:"🏥",color:"#EF4444",category:"Saúde",source:"cloudflare",model:h.powerful,capabilities:["Gestão hospitalar","Protocolos","ANVISA","Qualidade","Indicadores"],desc:"Gestão de saúde — protocolos, indicadores, ANVISA e qualidade assistencial",system:"Você é gestor de saúde. Oriente sobre gestão hospitalar, protocolos e indicadores. DISCLAIMER: não substitui médico. Responda em português."},{id:"auto-consultant",name:"Consultor Automotivo",emoji:"🚗",color:"#6366F1",category:"Automotivo",source:"cloudflare",model:h.balanced,capabilities:["Precificação","Financiamento","Estoque","Revisão","Consórcio"],desc:"Especialista automotivo — precificação, financiamento, consórcio e estoque",system:"Você é consultor automotivo. Oriente sobre compra, venda, financiamento e manutenção de veículos. Responda em português."},{id:"logistics-manager",name:"Gestor Logístico",emoji:"🚚",color:"#78350F",category:"Logística",source:"cloudflare",model:h.balanced,capabilities:["Supply chain","Rotas","Estoque","WMS","KPIs logísticos"],desc:"Supply chain e logística — rotas, estoque, WMS e indicadores de performance",system:"Você é gestor logístico. Otimize rotas, supply chain, WMS e indicadores logísticos. Responda em português."},{id:"tourism-agent",name:"Agente de Viagens",emoji:"🌍",color:"#0284C7",category:"Turismo",source:"cloudflare",model:h.balanced,capabilities:["Roteiros","Pacotes","Documentos","Passagens","Hospedagem"],desc:"Especialista em viagens — roteiros, pacotes, documentação e hospedagem",system:"Você é agente de viagens experiente. Crie roteiros, recomende pacotes e oriente sobre documentação. Responda em português."},{id:"edu-planner",name:"Planejador Educacional",emoji:"📚",color:"#16A34A",category:"Educação",source:"cloudflare",model:h.powerful,capabilities:["Plano de aula","Currículo","EAD","Avaliação","BNCC"],desc:"Planejamento educacional — planos de aula, currículo, EAD e alinhamento BNCC",system:"Você é especialista em educação. Crie planos de aula, currículos e materiais didáticos alinhados à BNCC. Responda em português."},{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"Tecnologia",source:"hybrid",model:h.coder,internalUrl:`${Z}/agents/developer`,basedOn:"OpenHands + Qwen2.5 Coder 32B",capabilities:["Código","APIs","Docker","Banco de dados","DevOps"],desc:"Arquiteto de software sênior — código production-ready com Qwen2.5 Coder 32B",system:"Você é arquiteto de software sênior da SixTech. Gere código limpo, documentado e testável. Responda em português com blocos de código."},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"Tecnologia",source:"hybrid",model:h.powerful,internalUrl:`${Z}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX","Branding","HTML/CSS","Figma","Acessibilidade"],desc:"Designer sênior — UI/UX, branding, sistemas de design e HTML/CSS",system:"Você é designer criativo sênior. Proponha soluções visuais com paleta, tipografia e componentes. Responda em português."},{id:"tech-infra",name:"Infraestrutura",emoji:"🖥️",color:"#475569",category:"Tecnologia",source:"cloudflare",model:h.coder,capabilities:["Cloud AWS/GCP","Kubernetes","CI/CD","Segurança","Monitoramento"],desc:"Especialista em infra — Cloud, Kubernetes, CI/CD e segurança de sistemas",system:"Você é especialista em infraestrutura cloud. Oriente sobre AWS/GCP, K8s, CI/CD e segurança. Responda em português com exemplos técnicos."},{id:"industry-engineer",name:"Engenheiro Industrial",emoji:"🏭",color:"#92400E",category:"Indústria",source:"cloudflare",model:h.balanced,capabilities:["Lean","Six Sigma","PCP","Manutenção","ISO"],desc:"Engenharia industrial — Lean, Six Sigma, PCP e gestão de qualidade ISO",system:"Você é engenheiro industrial. Aplique Lean, Six Sigma e PCP para otimizar processos produtivos. Responda em português."},{id:"agro-consultant",name:"Consultor Agro",emoji:"🌾",color:"#65A30D",category:"Agronegócio",source:"cloudflare",model:h.balanced,capabilities:["Gestão rural","Crédito rural","Comercialização","Pragas","Rastreabilidade"],desc:"Agronegócio — gestão rural, crédito, comercialização e rastreabilidade",system:"Você é consultor agronegócio. Oriente sobre gestão rural, crédito e comercialização de commodities. Responda em português."},{id:"gov-analyst",name:"Analista de Governo",emoji:"🏛️",color:"#1D4ED8",category:"Governo",source:"cloudflare",model:h.powerful,capabilities:["Licitações","Lei 8.666","Nova Lei Licitações","Editais","Pregão"],desc:"Especialista em governo — licitações, editais, pregão e Lei 14.133/2021",system:"Você é analista de contratos públicos. Oriente sobre licitações, editais e Lei 14.133. DISCLAIMER: consulte advogado. Responda em português."},{id:"creative-writer",name:"Redator Criativo",emoji:"✍️",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Copywriting","Storytelling","Roteiros","Naming","Slogans"],desc:"Redator criativo — copy, storytelling, roteiros, naming e slogans impactantes",system:"Você é redator criativo sênior. Crie copy persuasivo, histórias envolventes e slogans memoráveis. Responda em português com criatividade."},{id:"creative-video",name:"Roteirista de Vídeo",emoji:"🎬",color:"#BE185D",category:"Criativo",source:"cloudflare",model:h.powerful,capabilities:["Roteiro","Script","YouTube","Reels","Storytelling visual"],desc:"Roteiros para YouTube, Reels, TikTok e vídeos corporativos",system:"Você é roteirista audiovisual. Crie roteiros para YouTube, Reels e vídeos corporativos com estrutura narrativa forte. Responda em português."},{id:"ceo-advisor",name:"Conselheiro CEO",emoji:"👑",color:"#92400E",category:"Diretoria",source:"cloudflare",model:h.kimi,basedOn:"Kimi K2.6 (1T params)",capabilities:["Estratégia","M&A","Board","Visão 10 anos","Liderança"],desc:"Conselheiro estratégico de alto nível — decisões de CEO, M&A e visão de longo prazo",system:"Você é conselheiro sênior de CEO. Oriente sobre estratégia corporativa, M&A, liderança e visão de longo prazo. Responda em português com autoridade."},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"Diretoria",source:"hybrid",model:h.powerful,internalUrl:`${Z}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Competitivo","Tendências","Inteligência","Relatórios"],desc:"Inteligência de mercado — pesquisa profunda, análise competitiva e tendências",system:"Você é pesquisador de inteligência de mercado. Estruture: Resumo → Análise → Dados → Tendências → Conclusões. Responda em português."},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"Diretoria",source:"hybrid",model:h.balanced,internalUrl:`${Z}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios executivos","Propostas","Specs","Apresentações","PRD"],desc:"Documentação executiva — relatórios, PRD, propostas e apresentações",system:"Você é especialista em documentação executiva. Crie relatórios, PRDs e propostas com clareza e precisão. Responda em português."}];async function gr(e,t){try{const r=new AbortController,o=setTimeout(()=>r.abort(),8e3),a=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:t,message:t}),signal:r.signal});if(clearTimeout(o),!a.ok)return null;const i=await a.json();return i.result||i.response||i.output||null}catch{return null}}async function rt(e,t,r,o,a=1200){const i=[{role:"system",content:r},{role:"user",content:o}],s=await e.run(t,{messages:i,max_tokens:a});return s&&typeof s=="object"&&"response"in s?s.response||"":String(s||"")}async function We(e,t,r){const o=Date.now();let a="",i=!1,s=e.source;try{if(e.source==="hybrid"&&e.internalUrl){const l=await gr(e.internalUrl,t);l?(a=l,s="internal",i=!1):(a=await rt(r,e.model,e.system,t,1500),s="cloudflare",i=!0)}else a=await rt(r,e.model,e.system,t,1500),s="cloudflare",i=!1}catch(l){a=`❌ Erro: ${(l==null?void 0:l.message)||"falha inesperada"}`}return{agentId:e.id,name:e.name,emoji:e.emoji,color:e.color,model:e.model,source:s,usedFallback:i,response:a,duration:Date.now()-o}}function hr(e){const t=e.toLowerCase(),r=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(t)&&r.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(t)&&r.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(t)&&r.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(t)&&r.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(t)&&r.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(t)&&r.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(t)&&r.push("reviewer"),r.length===0&&r.push("orchestrator"),r.length>1&&r.push("orchestrator"),[...new Set(r)]}const mr={sixtech:"sixtech@2025",admin:"Admin@SixTech1"},Fe="st_sess",ot=60*60*8;function xr(){const e=new Uint8Array(24);return crypto.getRandomValues(e),Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")}const Me=new Map;function Ne(e){const r=(e.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${Fe}=([^;]+)`));if(!r)return null;const o=r[1],a=Me.get(o);return a?Date.now()/1e3>a.exp?(Me.delete(o),null):{user:a.user}:null}const A=new Rt;A.use("*",ur());A.get("/favicon.ico",e=>new Response(null,{status:204}));A.post("/api/login",async e=>{const{username:t,password:r}=await e.req.json(),o=mr[t==null?void 0:t.trim()];if(!o||o!==r)return e.json({ok:!1,error:"Usuário ou senha incorretos"},401);const a=xr();Me.set(a,{user:t.trim(),exp:Math.floor(Date.now()/1e3)+ot});const i=`${Fe}=${a}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ot}`;return new Response(JSON.stringify({ok:!0,user:t.trim()}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":i,"Access-Control-Allow-Origin":"*"}})});A.post("/api/logout",e=>{const r=(e.req.header("cookie")||"").match(new RegExp(`(?:^|;\\s*)${Fe}=([^;]+)`));return r&&Me.delete(r[1]),new Response(JSON.stringify({ok:!0}),{status:200,headers:{"Content-Type":"application/json","Set-Cookie":`${Fe}=; Path=/; Max-Age=0`}})});A.get("/api/me",e=>{const t=Ne(e);return t?e.json({ok:!0,user:t.user}):e.json({ok:!1},401)});A.use("/api/*",async(e,t)=>{const r=new URL(e.req.url).pathname;return r==="/api/login"||r==="/api/me"||r==="/api/logout"||Ne(e)?t():e.json({error:"Não autorizado",code:401},401)});A.get("/api/agents",e=>e.json({total:J.length,models:Object.keys(h).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:J.map(t=>({id:t.id,name:t.name,emoji:t.emoji,color:t.color,desc:t.desc,source:t.source,model:t.model,category:t.category,capabilities:t.capabilities,basedOn:t.basedOn,internalUrl:t.internalUrl}))}));A.post("/api/agent/:id",async e=>{const t=J.find(i=>i.id===e.req.param("id"));if(!t)return e.json({error:"Agente não encontrado"},404);const{message:r,task:o}=await e.req.json(),a=await We(t,r||o||"",e.env.AI);return e.json(a)});A.post("/api/orchestrate",async e=>{var l;const{task:t,message:r}=await e.req.json(),o=t||r||"";if(!o)return e.json({error:"task obrigatório"},400);const a=hr(o),i=a.map(d=>J.find(c=>c.id===d)).filter(Boolean),s=[];for(const d of i){const c=d.id==="orchestrator"&&s.length>0?`Tarefa original: "${o}"

Resultados dos agentes especializados:
${s.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:o;s.push(await We(d,c,e.env.AI))}return e.json({task:o,agentsUsed:a,results:s,summary:((l=s[s.length-1])==null?void 0:l.response)||""})});A.post("/api/pipeline",async e=>{const{task:t,agentIds:r}=await e.req.json();if(!t||!(r!=null&&r.length))return e.json({error:"task e agentIds obrigatórios"},400);const o=r.map(d=>J.find(c=>c.id===d)).filter(Boolean),a=[];let i=t;for(const d of o){o[o.length-1];const c=a.length===0?t:d.id==="orchestrator"&&a.length>0?`Tarefa original: "${t}"

${a.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize o resultado final.`:`${t}

[Contexto do ${a[a.length-1].name}]:
${a[a.length-1].response.slice(0,800)}`,p=await We(d,c,e.env.AI);a.push(p),i=p.response}const s=a.filter(d=>d.source==="cloudflare").length,l=a.filter(d=>d.source==="internal").length;return e.json({task:t,steps:a.length,cloudflareSteps:s,internalSteps:l,results:a,final:i})});A.post("/api/document/generate",async e=>{if(!Ne(e))return e.json({error:"Não autorizado"},401);const{agentId:r,docType:o,instructions:a,context:i}=await e.req.json(),s=J.find(p=>p.id===r);if(!s)return e.json({error:"Agente não encontrado"},404);const d=[{role:"system",content:`${s.system}

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

Instruções: ${a}`}],c=await e.env.AI.run(s.model,{messages:d,max_tokens:4096,stream:!0});return new Response(c,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});A.post("/api/document/analyze",async e=>{if(!Ne(e))return e.json({error:"Não autorizado"},401);const{agentId:r,fileContent:o,fileName:a,instruction:i}=await e.req.json(),s=J.find(p=>p.id===r);if(!s)return e.json({error:"Agente não encontrado"},404);const l=`${s.system}

MODO: ANÁLISE DE DOCUMENTO
Analise criticamente o documento fornecido pelo usuário.
${i?`Instrução específica: ${i}`:""}

ESTRUTURA DA ANÁLISE (use Markdown):
## 📋 Resumo Executivo
## ✅ Pontos Positivos
## ⚠️ Pontos de Atenção / Riscos
## 🔧 Sugestões de Melhoria
## 📝 Versão Corrigida (se aplicável — reescreva trechos problemáticos)
## ✔️ Conclusão e Score (0-10)`,d=`Arquivo: ${a}

--- CONTEÚDO DO DOCUMENTO ---
${o.slice(0,12e3)}
--- FIM DO DOCUMENTO ---

${i||"Analise este documento e aponte melhorias, erros e ajustes necessários."}`,c=await e.env.AI.run(s.model,{messages:[{role:"system",content:l},{role:"user",content:d}],max_tokens:4096,stream:!0});return new Response(c,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});A.post("/api/chat",async e=>{const{messages:t,model:r}=await e.req.json(),o=r||h.balanced;t.some(i=>i.role==="system")||t.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const a=await e.env.AI.run(o,{messages:t,max_tokens:2048,stream:!0});return new Response(a,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});A.get("/api/models",e=>e.json({models:Object.entries(h).map(([t,r])=>({key:t,id:r,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[t]||t}))}));A.get("/api/status",e=>e.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:Z},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:fr},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:J.length,models:Object.keys(h).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));A.get("/",e=>e.html(`<!DOCTYPE html>
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
</html>`));const at=new Rt,br=Object.assign({"/src/index.tsx":A});let St=!1;for(const[,e]of Object.entries(br))e&&(at.route("/",e),at.notFound(e.notFoundHandler),St=!0);if(!St)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{at as default};
