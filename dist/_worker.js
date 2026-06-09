var St=Object.defineProperty;var Ke=t=>{throw TypeError(t)};var Ct=(t,e,s)=>e in t?St(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var h=(t,e,s)=>Ct(t,typeof e!="symbol"?e+"":e,s),Fe=(t,e,s)=>e.has(t)||Ke("Cannot "+s);var n=(t,e,s)=>(Fe(t,e,"read from private field"),s?s.call(t):e.get(t)),f=(t,e,s)=>e.has(t)?Ke("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),m=(t,e,s,a)=>(Fe(t,e,"write to private field"),a?a.call(t,s):e.set(t,s),s),v=(t,e,s)=>(Fe(t,e,"access private method"),s);var Je=(t,e,s,a)=>({set _(r){m(t,e,r,s)},get _(){return n(t,e,a)}});var Qe=(t,e,s)=>(a,r)=>{let o=-1;return i(0);async function i(c){if(c<=o)throw new Error("next() called multiple times");o=c;let l,d=!1,u;if(t[c]?(u=t[c][0][0],a.req.routeIndex=c):u=c===t.length&&r||void 0,u)try{l=await u(a,()=>i(c+1))}catch(p){if(p instanceof Error&&e)a.error=p,l=await e(p,a),d=!0;else throw p}else a.finalized===!1&&s&&(l=await s(a));return l&&(a.finalized===!1||d)&&(a.res=l),a}},Rt=Symbol(),Tt=async(t,e=Object.create(null))=>{const{all:s=!1,dot:a=!1}=e,o=(t instanceof pt?t.raw.headers:t.headers).get("Content-Type");return o!=null&&o.startsWith("multipart/form-data")||o!=null&&o.startsWith("application/x-www-form-urlencoded")?jt(t,{all:s,dot:a}):{}};async function jt(t,e){const s=await t.formData();return s?It(s,e):{}}function It(t,e){const s=Object.create(null);return t.forEach((a,r)=>{e.all||r.endsWith("[]")?Pt(s,r,a):s[r]=a}),e.dot&&Object.entries(s).forEach(([a,r])=>{a.includes(".")&&(Ot(s,a,r),delete s[a])}),s}var Pt=(t,e,s)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(s):t[e]=[t[e],s]:e.endsWith("[]")?t[e]=[s]:t[e]=s},Ot=(t,e,s)=>{if(/(?:^|\.)__proto__\./.test(e))return;let a=t;const r=e.split(".");r.forEach((o,i)=>{i===r.length-1?a[o]=s:((!a[o]||typeof a[o]!="object"||Array.isArray(a[o])||a[o]instanceof File)&&(a[o]=Object.create(null)),a=a[o])})},it=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},$t=t=>{const{groups:e,path:s}=Bt(t),a=it(s);return Dt(a,e)},Bt=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(s,a)=>{const r=`@${a}`;return e.push([r,s]),r}),{groups:e,path:t}},Dt=(t,e)=>{for(let s=e.length-1;s>=0;s--){const[a]=e[s];for(let r=t.length-1;r>=0;r--)if(t[r].includes(a)){t[r]=t[r].replace(a,e[s][1]);break}}return t},Pe={},Lt=(t,e)=>{if(t==="*")return"*";const s=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const a=`${t}#${e}`;return Pe[a]||(s[2]?Pe[a]=e&&e[0]!==":"&&e[0]!=="*"?[a,s[1],new RegExp(`^${s[2]}(?=/${e})`)]:[t,s[1],new RegExp(`^${s[2]}$`)]:Pe[a]=[t,s[1],!0]),Pe[a]}return null},Ve=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return e(s)}catch{return s}})}},Ht=t=>Ve(t,decodeURI),lt=t=>{const e=t.url,s=e.indexOf("/",e.indexOf(":")+4);let a=s;for(;a<e.length;a++){const r=e.charCodeAt(a);if(r===37){const o=e.indexOf("?",a),i=e.indexOf("#",a),c=o===-1?i===-1?void 0:i:i===-1?o:Math.min(o,i),l=e.slice(s,c);return Ht(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(r===63||r===35)break}return e.slice(s,a)},Mt=t=>{const e=lt(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},J=(t,e,...s)=>(s.length&&(e=J(e,...s)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),ct=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),s=[];let a="";return e.forEach(r=>{if(r!==""&&!/\:/.test(r))a+="/"+r;else if(/\:/.test(r))if(/\?/.test(r)){s.length===0&&a===""?s.push("/"):s.push(a);const o=r.replace("?","");a+="/"+o,s.push(a)}else a+="/"+r}),s.filter((r,o,i)=>i.indexOf(r)===o)},Ne=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?Ve(t,ut):t):t,dt=(t,e,s)=>{let a;if(!s&&e&&!/[%+]/.test(e)){let i=t.indexOf("?",8);if(i===-1)return;for(t.startsWith(e,i+1)||(i=t.indexOf(`&${e}`,i+1));i!==-1;){const c=t.charCodeAt(i+e.length+1);if(c===61){const l=i+e.length+2,d=t.indexOf("&",l);return Ne(t.slice(l,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";i=t.indexOf(`&${e}`,i+1)}if(a=/[%+]/.test(t),!a)return}const r={};a??(a=/[%+]/.test(t));let o=t.indexOf("?",8);for(;o!==-1;){const i=t.indexOf("&",o+1);let c=t.indexOf("=",o);c>i&&i!==-1&&(c=-1);let l=t.slice(o+1,c===-1?i===-1?void 0:i:c);if(a&&(l=Ne(l)),o=i,l==="")continue;let d;c===-1?d="":(d=t.slice(c+1,i===-1?void 0:i),a&&(d=Ne(d))),s?(r[l]&&Array.isArray(r[l])||(r[l]=[]),r[l].push(d)):r[l]??(r[l]=d)}return e?r[e]:r},qt=dt,Ft=(t,e)=>dt(t,e,!0),ut=decodeURIComponent,Xe=t=>Ve(t,ut),de,R,_,mt,ht,Ue,H,tt,pt=(tt=class{constructor(t,e="/",s=[[]]){f(this,_);h(this,"raw");f(this,de);f(this,R);h(this,"routeIndex",0);h(this,"path");h(this,"bodyCache",{});f(this,H,t=>{const{bodyCache:e,raw:s}=this,a=e[t];if(a)return a;const r=Object.keys(e)[0];return r?e[r].then(o=>(r==="json"&&(o=JSON.stringify(o)),new Response(o)[t]())):e[t]=s[t]()});this.raw=t,this.path=e,m(this,R,s),m(this,de,{})}param(t){return t?v(this,_,mt).call(this,t):v(this,_,ht).call(this)}query(t){return qt(this.url,t)}queries(t){return Ft(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((s,a)=>{e[a]=s}),e}async parseBody(t){return Tt(this,t)}json(){return n(this,H).call(this,"text").then(t=>JSON.parse(t))}text(){return n(this,H).call(this,"text")}arrayBuffer(){return n(this,H).call(this,"arrayBuffer")}bytes(){return n(this,H).call(this,"arrayBuffer").then(t=>new Uint8Array(t))}blob(){return n(this,H).call(this,"blob")}formData(){return n(this,H).call(this,"formData")}addValidatedData(t,e){n(this,de)[t]=e}valid(t){return n(this,de)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[Rt](){return n(this,R)}get matchedRoutes(){return n(this,R)[0].map(([[,t]])=>t)}get routePath(){return n(this,R)[0].map(([[,t]])=>t)[this.routeIndex].path}},de=new WeakMap,R=new WeakMap,_=new WeakSet,mt=function(t){const e=n(this,R)[0][this.routeIndex][1][t],s=v(this,_,Ue).call(this,e);return s&&/\%/.test(s)?Xe(s):s},ht=function(){const t={},e=Object.keys(n(this,R)[0][this.routeIndex][1]);for(const s of e){const a=v(this,_,Ue).call(this,n(this,R)[0][this.routeIndex][1][s]);a!==void 0&&(t[s]=/\%/.test(a)?Xe(a):a)}return t},Ue=function(t){return n(this,R)[1]?n(this,R)[1][t]:t},H=new WeakMap,tt),Nt={Stringify:1},ft=async(t,e,s,a,r)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const o=t.callbacks;return o!=null&&o.length?(r?r[0]+=t:r=[t],Promise.all(o.map(c=>c({phase:e,buffer:r,context:a}))).then(c=>Promise.all(c.filter(Boolean).map(l=>ft(l,e,!1,a,r))).then(()=>r[0]))):Promise.resolve(t)},_t="text/plain; charset=UTF-8",_e=(t,e)=>({"Content-Type":t,...e}),we=(t,e)=>new Response(t,e),Se,Ce,M,ue,q,S,Re,pe,me,Y,Te,je,V,ie,st,Ut=(st=class{constructor(t,e){f(this,V);f(this,Se);f(this,Ce);h(this,"env",{});f(this,M);h(this,"finalized",!1);h(this,"error");f(this,ue);f(this,q);f(this,S);f(this,Re);f(this,pe);f(this,me);f(this,Y);f(this,Te);f(this,je);h(this,"render",(...t)=>(n(this,pe)??m(this,pe,e=>this.html(e)),n(this,pe).call(this,...t)));h(this,"setLayout",t=>m(this,Re,t));h(this,"getLayout",()=>n(this,Re));h(this,"setRenderer",t=>{m(this,pe,t)});h(this,"header",(t,e,s)=>{this.finalized&&m(this,S,we(n(this,S).body,n(this,S)));const a=n(this,S)?n(this,S).headers:n(this,Y)??m(this,Y,new Headers);e===void 0?a.delete(t):s!=null&&s.append?a.append(t,e):a.set(t,e)});h(this,"status",t=>{m(this,ue,t)});h(this,"set",(t,e)=>{n(this,M)??m(this,M,new Map),n(this,M).set(t,e)});h(this,"get",t=>n(this,M)?n(this,M).get(t):void 0);h(this,"newResponse",(...t)=>v(this,V,ie).call(this,...t));h(this,"body",(t,e,s)=>v(this,V,ie).call(this,t,e,s));h(this,"text",(t,e,s)=>!n(this,Y)&&!n(this,ue)&&!e&&!s&&!this.finalized?new Response(t):v(this,V,ie).call(this,t,e,_e(_t,s)));h(this,"json",(t,e,s)=>v(this,V,ie).call(this,JSON.stringify(t),e,_e("application/json",s)));h(this,"html",(t,e,s)=>{const a=r=>v(this,V,ie).call(this,r,e,_e("text/html; charset=UTF-8",s));return typeof t=="object"?ft(t,Nt.Stringify,!1,{}).then(a):a(t)});h(this,"redirect",(t,e)=>{const s=String(t);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,e??302)});h(this,"notFound",()=>(n(this,me)??m(this,me,()=>we()),n(this,me).call(this,this)));m(this,Se,t),e&&(m(this,q,e.executionCtx),this.env=e.env,m(this,me,e.notFoundHandler),m(this,je,e.path),m(this,Te,e.matchResult))}get req(){return n(this,Ce)??m(this,Ce,new pt(n(this,Se),n(this,je),n(this,Te))),n(this,Ce)}get event(){if(n(this,q)&&"respondWith"in n(this,q))return n(this,q);throw Error("This context has no FetchEvent")}get executionCtx(){if(n(this,q))return n(this,q);throw Error("This context has no ExecutionContext")}get res(){return n(this,S)||m(this,S,we(null,{headers:n(this,Y)??m(this,Y,new Headers)}))}set res(t){if(n(this,S)&&t){t=we(t.body,t);for(const[e,s]of n(this,S).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const a=n(this,S).headers.getSetCookie();t.headers.delete("set-cookie");for(const r of a)t.headers.append("set-cookie",r)}else t.headers.set(e,s)}m(this,S,t),this.finalized=!0}get var(){return n(this,M)?Object.fromEntries(n(this,M)):{}}},Se=new WeakMap,Ce=new WeakMap,M=new WeakMap,ue=new WeakMap,q=new WeakMap,S=new WeakMap,Re=new WeakMap,pe=new WeakMap,me=new WeakMap,Y=new WeakMap,Te=new WeakMap,je=new WeakMap,V=new WeakSet,ie=function(t,e,s){const a=n(this,S)?new Headers(n(this,S).headers):n(this,Y)??new Headers;if(typeof e=="object"&&"headers"in e){const o=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[i,c]of o)i.toLowerCase()==="set-cookie"?a.append(i,c):a.set(i,c)}if(s)for(const[o,i]of Object.entries(s))if(typeof i=="string")a.set(o,i);else{a.delete(o);for(const c of i)a.append(o,c)}const r=typeof e=="number"?e:(e==null?void 0:e.status)??n(this,ue);return we(t,{status:r,headers:a})},st),x="ALL",Vt="all",zt=["get","post","put","delete","options","patch"],gt="Can not add a route since the matcher is already built.",vt=class extends Error{},Gt="__COMPOSED_HANDLER",Wt=t=>t.text("404 Not Found",404),Ye=(t,e)=>{if("getResponse"in t){const s=t.getResponse();return e.newResponse(s.body,s)}return console.error(t),e.text("Internal Server Error",500)},j,y,bt,I,Q,Oe,$e,he,Kt=(he=class{constructor(e={}){f(this,y);h(this,"get");h(this,"post");h(this,"put");h(this,"delete");h(this,"options");h(this,"patch");h(this,"all");h(this,"on");h(this,"use");h(this,"router");h(this,"getPath");h(this,"_basePath","/");f(this,j,"/");h(this,"routes",[]);f(this,I,Wt);h(this,"errorHandler",Ye);h(this,"onError",e=>(this.errorHandler=e,this));h(this,"notFound",e=>(m(this,I,e),this));h(this,"fetch",(e,...s)=>v(this,y,$e).call(this,e,s[1],s[0],e.method));h(this,"request",(e,s,a,r)=>e instanceof Request?this.fetch(s?new Request(e,s):e,a,r):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${J("/",e)}`,s),a,r)));h(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(v(this,y,$e).call(this,e.request,e,void 0,e.request.method))})});[...zt,Vt].forEach(o=>{this[o]=(i,...c)=>(typeof i=="string"?m(this,j,i):v(this,y,Q).call(this,o,n(this,j),i),c.forEach(l=>{v(this,y,Q).call(this,o,n(this,j),l)}),this)}),this.on=(o,i,...c)=>{for(const l of[i].flat()){m(this,j,l);for(const d of[o].flat())c.map(u=>{v(this,y,Q).call(this,d.toUpperCase(),n(this,j),u)})}return this},this.use=(o,...i)=>(typeof o=="string"?m(this,j,o):(m(this,j,"*"),i.unshift(o)),i.forEach(c=>{v(this,y,Q).call(this,x,n(this,j),c)}),this);const{strict:a,...r}=e;Object.assign(this,r),this.getPath=a??!0?e.getPath??lt:Mt}route(e,s){const a=this.basePath(e);return s.routes.map(r=>{var i;let o;s.errorHandler===Ye?o=r.handler:(o=async(c,l)=>(await Qe([],s.errorHandler)(c,()=>r.handler(c,l))).res,o[Gt]=r.handler),v(i=a,y,Q).call(i,r.method,r.path,o,r.basePath)}),this}basePath(e){const s=v(this,y,bt).call(this);return s._basePath=J(this._basePath,e),s}mount(e,s,a){let r,o;a&&(typeof a=="function"?o=a:(o=a.optionHandler,a.replaceRequest===!1?r=l=>l:r=a.replaceRequest));const i=o?l=>{const d=o(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};r||(r=(()=>{const l=J(this._basePath,e),d=l==="/"?0:l.length;return u=>{const p=new URL(u.url);return p.pathname=this.getPath(u).slice(d)||"/",new Request(p,u)}})());const c=async(l,d)=>{const u=await s(r(l.req.raw),...i(l));if(u)return u;await d()};return v(this,y,Q).call(this,x,J(e,"*"),c),this}},j=new WeakMap,y=new WeakSet,bt=function(){const e=new he({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,m(e,I,n(this,I)),e.routes=this.routes,e},I=new WeakMap,Q=function(e,s,a,r){e=e.toUpperCase(),s=J(this._basePath,s);const o={basePath:r!==void 0?J(this._basePath,r):this._basePath,path:s,method:e,handler:a};this.router.add(e,s,[a,o]),this.routes.push(o)},Oe=function(e,s){if(e instanceof Error)return this.errorHandler(e,s);throw e},$e=function(e,s,a,r){if(r==="HEAD")return(async()=>new Response(null,await v(this,y,$e).call(this,e,s,a,"GET")))();const o=this.getPath(e,{env:a}),i=this.router.match(r,o),c=new Ut(e,{path:o,matchResult:i,env:a,executionCtx:s,notFoundHandler:n(this,I)});if(i[0].length===1){let d;try{d=i[0][0][0][0](c,async()=>{c.res=await n(this,I).call(this,c)})}catch(u){return v(this,y,Oe).call(this,u,c)}return d instanceof Promise?d.then(u=>u||(c.finalized?c.res:n(this,I).call(this,c))).catch(u=>v(this,y,Oe).call(this,u,c)):d??n(this,I).call(this,c)}const l=Qe(i[0],this.errorHandler,n(this,I));return(async()=>{try{const d=await l(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return v(this,y,Oe).call(this,d,c)}})()},he),xt=[];function Jt(t,e){const s=this.buildAllMatchers(),a=(r,o)=>{const i=s[r]||s[x],c=i[2][o];if(c)return c;const l=o.match(i[0]);if(!l)return[[],xt];const d=l.indexOf("",1);return[i[1][d],l]};return this.match=a,a(t,e)}var De="[^/]+",Ae=".*",ke="(?:|/.*)",le=Symbol(),Qt=new Set(".\\+*[^]$()");function Xt(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Ae||t===ke?1:e===Ae||e===ke?-1:t===De?1:e===De?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var Z,ee,P,ae,Yt=(ae=class{constructor(){f(this,Z);f(this,ee);f(this,P,Object.create(null))}insert(e,s,a,r,o){if(e.length===0){if(n(this,Z)!==void 0)throw le;if(o)return;m(this,Z,s);return}const[i,...c]=e,l=i==="*"?c.length===0?["","",Ae]:["","",De]:i==="/*"?["","",ke]:i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(l){const u=l[1];let p=l[2]||De;if(u&&l[2]&&(p===".*"||(p=p.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(p))))throw le;if(d=n(this,P)[p],!d){if(Object.keys(n(this,P)).some(g=>g!==Ae&&g!==ke))throw le;if(o)return;d=n(this,P)[p]=new ae,u!==""&&m(d,ee,r.varIndex++)}!o&&u!==""&&a.push([u,n(d,ee)])}else if(d=n(this,P)[i],!d){if(Object.keys(n(this,P)).some(u=>u.length>1&&u!==Ae&&u!==ke))throw le;if(o)return;d=n(this,P)[i]=new ae}d.insert(c,s,a,r,o)}buildRegExpStr(){const s=Object.keys(n(this,P)).sort(Xt).map(a=>{const r=n(this,P)[a];return(typeof n(r,ee)=="number"?`(${a})@${n(r,ee)}`:Qt.has(a)?`\\${a}`:a)+r.buildRegExpStr()});return typeof n(this,Z)=="number"&&s.unshift(`#${n(this,Z)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},Z=new WeakMap,ee=new WeakMap,P=new WeakMap,ae),Le,Ie,at,Zt=(at=class{constructor(){f(this,Le,{varIndex:0});f(this,Ie,new Yt)}insert(t,e,s){const a=[],r=[];for(let i=0;;){let c=!1;if(t=t.replace(/\{[^}]+\}/g,l=>{const d=`@\\${i}`;return r[i]=[d,l],i++,c=!0,d}),!c)break}const o=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=r.length-1;i>=0;i--){const[c]=r[i];for(let l=o.length-1;l>=0;l--)if(o[l].indexOf(c)!==-1){o[l]=o[l].replace(c,r[i][1]);break}}return n(this,Ie).insert(o,e,a,n(this,Le),s),a}buildRegExp(){let t=n(this,Ie).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const s=[],a=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(r,o,i)=>o!==void 0?(s[++e]=Number(o),"$()"):(i!==void 0&&(a[Number(i)]=++e),"")),[new RegExp(`^${t}`),s,a]}},Le=new WeakMap,Ie=new WeakMap,at),es=[/^$/,[],Object.create(null)],Be=Object.create(null);function yt(t){return Be[t]??(Be[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function ts(){Be=Object.create(null)}function ss(t){var d;const e=new Zt,s=[];if(t.length===0)return es;const a=t.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,p],[g,E])=>u?1:g?-1:p.length-E.length),r=Object.create(null);for(let u=0,p=-1,g=a.length;u<g;u++){const[E,A,B]=a[u];E?r[A]=[B.map(([O])=>[O,Object.create(null)]),xt]:p++;let T;try{T=e.insert(A,p,E)}catch(O){throw O===le?new vt(A):O}E||(s[p]=B.map(([O,b])=>{const D=Object.create(null);for(b-=1;b>=0;b--){const[be,Me]=T[b];D[be]=Me}return[O,D]}))}const[o,i,c]=e.buildRegExp();for(let u=0,p=s.length;u<p;u++)for(let g=0,E=s[u].length;g<E;g++){const A=(d=s[u][g])==null?void 0:d[1];if(!A)continue;const B=Object.keys(A);for(let T=0,O=B.length;T<O;T++)A[B[T]]=c[A[B[T]]]}const l=[];for(const u in i)l[u]=s[i[u]];return[o,l,r]}function ne(t,e){if(t){for(const s of Object.keys(t).sort((a,r)=>r.length-a.length))if(yt(s).test(e))return[...t[s]]}}var z,G,He,wt,rt,as=(rt=class{constructor(){f(this,He);h(this,"name","RegExpRouter");f(this,z);f(this,G);h(this,"match",Jt);m(this,z,{[x]:Object.create(null)}),m(this,G,{[x]:Object.create(null)})}add(t,e,s){var c;const a=n(this,z),r=n(this,G);if(!a||!r)throw new Error(gt);a[t]||[a,r].forEach(l=>{l[t]=Object.create(null),Object.keys(l[x]).forEach(d=>{l[t][d]=[...l[x][d]]})}),e==="/*"&&(e="*");const o=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const l=yt(e);t===x?Object.keys(a).forEach(d=>{var u;(u=a[d])[e]||(u[e]=ne(a[d],e)||ne(a[x],e)||[])}):(c=a[t])[e]||(c[e]=ne(a[t],e)||ne(a[x],e)||[]),Object.keys(a).forEach(d=>{(t===x||t===d)&&Object.keys(a[d]).forEach(u=>{l.test(u)&&a[d][u].push([s,o])})}),Object.keys(r).forEach(d=>{(t===x||t===d)&&Object.keys(r[d]).forEach(u=>l.test(u)&&r[d][u].push([s,o]))});return}const i=ct(e)||[e];for(let l=0,d=i.length;l<d;l++){const u=i[l];Object.keys(r).forEach(p=>{var g;(t===x||t===p)&&((g=r[p])[u]||(g[u]=[...ne(a[p],u)||ne(a[x],u)||[]]),r[p][u].push([s,o-d+l+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(n(this,G)).concat(Object.keys(n(this,z))).forEach(e=>{t[e]||(t[e]=v(this,He,wt).call(this,e))}),m(this,z,m(this,G,void 0)),ts(),t}},z=new WeakMap,G=new WeakMap,He=new WeakSet,wt=function(t){const e=[];let s=t===x;return[n(this,z),n(this,G)].forEach(a=>{const r=a[t]?Object.keys(a[t]).map(o=>[o,a[t][o]]):[];r.length!==0?(s||(s=!0),e.push(...r)):t!==x&&e.push(...Object.keys(a[x]).map(o=>[o,a[x][o]]))}),s?ss(e):null},rt),W,F,ot,rs=(ot=class{constructor(t){h(this,"name","SmartRouter");f(this,W,[]);f(this,F,[]);m(this,W,t.routers)}add(t,e,s){if(!n(this,F))throw new Error(gt);n(this,F).push([t,e,s])}match(t,e){if(!n(this,F))throw new Error("Fatal error");const s=n(this,W),a=n(this,F),r=s.length;let o=0,i;for(;o<r;o++){const c=s[o];try{for(let l=0,d=a.length;l<d;l++)c.add(...a[l]);i=c.match(t,e)}catch(l){if(l instanceof vt)continue;throw l}this.match=c.match.bind(c),m(this,W,[c]),m(this,F,void 0);break}if(o===r)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(n(this,F)||n(this,W).length!==1)throw new Error("No active router has been determined yet.");return n(this,W)[0]}},W=new WeakMap,F=new WeakMap,ot),Ee=Object.create(null),os=t=>{for(const e in t)return!0;return!1},K,k,te,fe,w,N,X,ge,ns=(ge=class{constructor(e,s,a){f(this,N);f(this,K);f(this,k);f(this,te);f(this,fe,0);f(this,w,Ee);if(m(this,k,a||Object.create(null)),m(this,K,[]),e&&s){const r=Object.create(null);r[e]={handler:s,possibleKeys:[],score:0},m(this,K,[r])}m(this,te,[])}insert(e,s,a){m(this,fe,++Je(this,fe)._);let r=this;const o=$t(s),i=[];for(let c=0,l=o.length;c<l;c++){const d=o[c],u=o[c+1],p=Lt(d,u),g=Array.isArray(p)?p[0]:d;if(g in n(r,k)){r=n(r,k)[g],p&&i.push(p[1]);continue}n(r,k)[g]=new ge,p&&(n(r,te).push(p),i.push(p[1])),r=n(r,k)[g]}return n(r,K).push({[e]:{handler:a,possibleKeys:i.filter((c,l,d)=>d.indexOf(c)===l),score:n(this,fe)}}),r}search(e,s){var u;const a=[];m(this,w,Ee);let o=[this];const i=it(s),c=[],l=i.length;let d=null;for(let p=0;p<l;p++){const g=i[p],E=p===l-1,A=[];for(let T=0,O=o.length;T<O;T++){const b=o[T],D=n(b,k)[g];D&&(m(D,w,n(b,w)),E?(n(D,k)["*"]&&v(this,N,X).call(this,a,n(D,k)["*"],e,n(b,w)),v(this,N,X).call(this,a,D,e,n(b,w))):A.push(D));for(let be=0,Me=n(b,te).length;be<Me;be++){const Ge=n(b,te)[be],U=n(b,w)===Ee?{}:{...n(b,w)};if(Ge==="*"){const re=n(b,k)["*"];re&&(v(this,N,X).call(this,a,re,e,n(b,w)),m(re,w,U),A.push(re));continue}const[kt,We,xe]=Ge;if(!g&&!(xe instanceof RegExp))continue;const L=n(b,k)[kt];if(xe instanceof RegExp){if(d===null){d=new Array(l);let oe=s[0]==="/"?1:0;for(let ye=0;ye<l;ye++)d[ye]=oe,oe+=i[ye].length+1}const re=s.substring(d[p]),qe=xe.exec(re);if(qe){if(U[We]=qe[0],v(this,N,X).call(this,a,L,e,n(b,w),U),os(n(L,k))){m(L,w,U);const oe=((u=qe[0].match(/\//))==null?void 0:u.length)??0;(c[oe]||(c[oe]=[])).push(L)}continue}}(xe===!0||xe.test(g))&&(U[We]=g,E?(v(this,N,X).call(this,a,L,e,U,n(b,w)),n(L,k)["*"]&&v(this,N,X).call(this,a,n(L,k)["*"],e,U,n(b,w))):(m(L,w,U),A.push(L)))}}const B=c.shift();o=B?A.concat(B):A}return a.length>1&&a.sort((p,g)=>p.score-g.score),[a.map(({handler:p,params:g})=>[p,g])]}},K=new WeakMap,k=new WeakMap,te=new WeakMap,fe=new WeakMap,w=new WeakMap,N=new WeakSet,X=function(e,s,a,r,o){for(let i=0,c=n(s,K).length;i<c;i++){const l=n(s,K)[i],d=l[a]||l[x],u={};if(d!==void 0&&(d.params=Object.create(null),e.push(d),r!==Ee||o&&o!==Ee))for(let p=0,g=d.possibleKeys.length;p<g;p++){const E=d.possibleKeys[p],A=u[d.score];d.params[E]=o!=null&&o[E]&&!A?o[E]:r[E]??(o==null?void 0:o[E]),u[d.score]=!0}}},ge),se,nt,is=(nt=class{constructor(){h(this,"name","TrieRouter");f(this,se);m(this,se,new ns)}add(t,e,s){const a=ct(e);if(a){for(let r=0,o=a.length;r<o;r++)n(this,se).insert(t,a[r],s);return}n(this,se).insert(t,e,s)}match(t,e){return n(this,se).search(t,e)}},se=new WeakMap,nt),Et=class extends Kt{constructor(t={}){super(t),this.router=t.router??new rs({routers:[new as,new is]})}},ls=t=>{const e={origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[],...t},s=(r=>typeof r=="string"?r==="*"?()=>r:o=>r===o?o:null:typeof r=="function"?r:o=>r.includes(o)?o:null)(e.origin),a=(r=>typeof r=="function"?r:Array.isArray(r)?()=>r:()=>[])(e.allowMethods);return async function(o,i){var d;function c(u,p){o.res.headers.set(u,p)}const l=await s(o.req.header("origin")||"",o);if(l&&c("Access-Control-Allow-Origin",l),e.credentials&&c("Access-Control-Allow-Credentials","true"),(d=e.exposeHeaders)!=null&&d.length&&c("Access-Control-Expose-Headers",e.exposeHeaders.join(",")),o.req.method==="OPTIONS"){e.origin!=="*"&&c("Vary","Origin"),e.maxAge!=null&&c("Access-Control-Max-Age",e.maxAge.toString());const u=await a(o.req.header("origin")||"",o);u.length&&c("Access-Control-Allow-Methods",u.join(","));let p=e.allowHeaders;if(!(p!=null&&p.length)){const g=o.req.header("Access-Control-Request-Headers");g&&(p=g.split(/\s*,\s*/))}return p!=null&&p.length&&(c("Access-Control-Allow-Headers",p.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await i(),e.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};const C={fast:"@cf/meta/llama-3.2-3b-instruct",balanced:"@cf/meta/llama-3.1-8b-instruct-fp8",powerful:"@cf/meta/llama-3.3-70b-instruct-fp8-fast",coder:"@cf/qwen/qwen2.5-coder-32b-instruct",reason:"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",kimi:"@cf/moonshotai/kimi-k2.6",gpt:"@cf/openai/gpt-oss-120b",gemma:"@cf/google/gemma-3-12b-it"},ce="https://api.sixtechbrasil.com.br",cs="https://sixtechworkspace.kainow252-cmyk.workers.dev",ve=[{id:"developer",name:"Developer",emoji:"💻",color:"#F87171",category:"SixTech Workspace",source:"hybrid",model:C.coder,internalUrl:`${ce}/agents/developer`,basedOn:"sixtech-workspace + OpenHands",capabilities:["Código production-ready","APIs REST/GraphQL","Docker & DevOps","Banco de dados","Integrações"],desc:"Arquiteto de software sênior — Qwen2.5 Coder 32B + backend interno OpenHands",system:`Você é um arquiteto de software sênior da SixTech Brasil (baseado em OpenHands).
Seu objetivo: gerar código production-ready, limpo, documentado e testável.
Para cada solução:
1. Explique a arquitetura escolhida
2. Forneça o código completo com comentários
3. Inclua exemplos de uso
4. Liste dependências e requisitos
5. Adicione casos de teste básicos
Tecnologias dominadas: Python, TypeScript, Go, Rust, React, Next.js, FastAPI, Docker, Kubernetes, PostgreSQL, Redis.
Responda SEMPRE em português brasileiro. Use markdown com blocos de código bem formatados.`},{id:"research",name:"Pesquisador",emoji:"🔍",color:"#6C63FF",category:"SixTech Workspace",source:"hybrid",model:C.powerful,internalUrl:`${ce}/agents/research`,basedOn:"sixtech-workspace",capabilities:["Pesquisa de mercado","Análise competitiva","Inteligência técnica","Verificação de fatos","Tendências"],desc:"Pesquisa profunda — Llama 3.3 70B + backend interno de inteligência",system:`Você é um agente especialista em pesquisa e inteligência de mercado da SixTech Brasil.
Processo de pesquisa:
1. Identifique o tema central e subtemas relevantes
2. Apresente dados e fatos verificáveis
3. Analise tendências e padrões
4. Compare players e soluções do mercado
5. Conclua com insights acionáveis
Estruture sempre: Resumo Executivo → Análise Detalhada → Dados & Métricas → Tendências → Conclusões.
Cite quando possível: "Segundo [fonte], ..." — diferencie fatos de inferências.
Responda SEMPRE em português brasileiro.`},{id:"legal",name:"Jurídico",emoji:"⚖️",color:"#F59E0B",category:"SixTech Workspace",source:"hybrid",model:C.powerful,internalUrl:`${ce}/agents/legal`,basedOn:"sixtech-workspace",capabilities:["Contratos & NDAs","LGPD & Compliance","Propriedade intelectual","Termos de uso","Due diligence"],desc:"Especialista jurídico — direito digital, contratos e compliance brasileiro",system:`Você é um especialista jurídico da SixTech Brasil focado em direito digital e tech.
Áreas de atuação:
- Contratos de software, SaaS e licenças
- NDAs e acordos de confidencialidade
- LGPD, GDPR e compliance de dados
- Propriedade intelectual e direitos autorais
- Termos de uso e políticas de privacidade
Sempre inclua: ⚠️ DISCLAIMER: Esta análise é informativa e educacional. Para situações reais, consulte um advogado habilitado.
Responda SEMPRE em português brasileiro com linguagem técnica-jurídica acessível.`},{id:"designer",name:"Designer",emoji:"🎨",color:"#EC4899",category:"SixTech Workspace",source:"hybrid",model:C.powerful,internalUrl:`${ce}/agents/designer`,basedOn:"sixtech-workspace",capabilities:["UI/UX Design","Branding & identidade","Sistemas de design","HTML/CSS","Acessibilidade"],desc:"Designer criativo sênior — UI/UX, branding e especificações visuais",system:`Você é um designer criativo sênior da SixTech Brasil especializado em UI/UX e branding digital.
Processo criativo:
1. Entenda o contexto, público-alvo e objetivos
2. Proponha direção visual com justificativa
3. Defina paleta de cores (hex), tipografia e espaçamentos
4. Descreva componentes e layouts em detalhes
5. Forneça HTML/CSS quando solicitado
6. Inclua considerações de acessibilidade (WCAG)
Estilos dominados: Minimalista, Material Design, Glassmorphism, Neumorphism, Dark mode.
Responda SEMPRE em português brasileiro com linguagem criativa e técnica.`},{id:"documents",name:"Documentos",emoji:"📄",color:"#14B8A6",category:"SixTech Workspace",source:"hybrid",model:C.balanced,internalUrl:`${ce}/agents/documents`,basedOn:"sixtech-workspace",capabilities:["Relatórios técnicos","Propostas comerciais","Documentação de API","Apresentações","Specs técnicas"],desc:"Especialista em documentação — relatórios, specs técnicas e propostas",system:`Você é um especialista em documentação técnica e criação de documentos da SixTech Brasil.
Tipos de documentos que cria:
- Relatórios técnicos e executivos
- Especificações de produto (PRD)
- Documentação de API (OpenAPI/Swagger style)
- Propostas comerciais e pitches
- Planos de projeto e roadmaps
- Manuais e guias de usuário
Estrutura padrão: Sumário Executivo → Contexto → Desenvolvimento → Resultados/Especificações → Conclusão → Próximos Passos.
Responda SEMPRE em português brasileiro com linguagem formal, clara e precisa.`},{id:"analyst",name:"Analista",emoji:"📊",color:"#8B5CF6",category:"Cloudflare AI",source:"cloudflare",model:C.reason,basedOn:"DeepSeek R1 Distill Qwen 32B",capabilities:["Análise SWOT","KPIs & métricas","Modelagem financeira","Raciocínio lógico","Business intelligence"],desc:"Analista de elite com raciocínio avançado — DeepSeek R1 32B chain-of-thought",system:`Você é um analista de dados e negócios de elite da SixTech Brasil, powered by DeepSeek R1 (raciocínio chain-of-thought).
Metodologia analítica:
<think>
- Decompor o problema em componentes
- Identificar variáveis-chave e relações causais
- Testar hipóteses alternativas
- Validar com dados quando disponíveis
</think>
Entregáveis: Análise SWOT, KPIs sugeridos, modelos de decisão, cenários (otimista/realista/pessimista), recomendações priorizadas.
Seja rigoroso, baseado em evidências. Mostre seu raciocínio passo a passo.
Responda SEMPRE em português brasileiro com estrutura analítica densa e precisa.`},{id:"reviewer",name:"Revisor QA",emoji:"🛡️",color:"#10B981",category:"Cloudflare AI",source:"cloudflare",model:C.balanced,basedOn:"Llama 3.1 8B",capabilities:["Code review","Quality assurance","Security audit","Scoring 0-10","Melhorias específicas"],desc:"Revisor crítico de qualidade — análise rigorosa com scoring e melhorias",system:`Você é o revisor de qualidade (QA Lead) da SixTech Brasil. Analise criticamente qualquer conteúdo recebido.
Framework de revisão:
📋 ANÁLISE GERAL: Objetivo, completude, clareza
⚠️ PROBLEMAS ENCONTRADOS: Liste todos com severidade (crítico/alto/médio/baixo)
✅ PONTOS POSITIVOS: O que está bem feito
🔧 MELHORIAS ESPECÍFICAS: Sugestões concretas com exemplos
🔒 SEGURANÇA (se código): Vulnerabilidades, boas práticas
📊 SCORE FINAL: X/10 com justificativa clara
Seja honesto, direto e construtivo. Não suavize problemas sérios.
Responda SEMPRE em português brasileiro.`},{id:"chat-assistant",name:"Assistente",emoji:"💬",color:"#06B6D4",category:"Cloudflare AI",source:"cloudflare",model:C.balanced,basedOn:"Llama 3.1 8B + SSE Streaming",capabilities:["Chat geral","Streaming em tempo real","Contexto de conversa","Múltiplos idiomas","Respostas rápidas"],desc:"Assistente conversacional com streaming em tempo real — baseado no sixtechworkspace",system:`Você é o assistente inteligente da SixTech Brasil, empresa líder em soluções de IA no Brasil.
Seja útil, amigável e direto. Responda em português brasileiro por padrão.
Se o usuário falar em inglês, responda em inglês.
Para perguntas técnicas: seja preciso e detalhado.
Para perguntas gerais: seja conciso e claro.
Você representa os valores da SixTech: inovação, excelência técnica e foco no cliente.`},{id:"orchestrator",name:"Super Orquestrador",emoji:"🎯",color:"#22D3EE",category:"Cloudflare AI",source:"cloudflare",model:C.kimi,basedOn:"Kimi K2.6 (1T parâmetros) + SuperAgentOrchestrator",capabilities:["Roteamento inteligente","Síntese de múltiplos agentes","Planejamento complexo","Delegação de tarefas","Consolidação final"],desc:"Super Agente Orquestrador — Kimi K2.6 1T params, CEO da equipe de agentes",system:`Você é o Super Agente Orquestrador da SixTech Brasil, powered by Kimi K2.6 (1 trilhão de parâmetros).
Baseado no SuperAgentOrchestrator do sixtech-workspace com capacidades expandidas.

Missão de orquestração:
1. ANALISAR a solicitação e identificar domínios necessários
2. PLANEJAR quais agentes devem atuar e em qual ordem
3. SINTETIZAR as saídas dos agentes em resposta coesa
4. DECIDIR como CEO: prioridades, trade-offs e recomendação final

Roteamento inteligente:
- "código/api/sistema" → Developer Agent
- "contrato/nda/legal" → Jurídico Agent  
- "logo/design/ui/ux" → Designer Agent
- "pesquisa/mercado/análise" → Pesquisador + Analista
- "relatório/documento" → Documentos Agent
- "revisar/qualidade" → Revisor QA

Ao sintetizar: elimine redundâncias, resolva conflitos, construa narrativa coesa.
Responda SEMPRE em português brasileiro. Use markdown rico e estruturado.`}];async function ds(t,e){try{const s=new AbortController,a=setTimeout(()=>s.abort(),8e3),r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:e,message:e}),signal:s.signal});if(clearTimeout(a),!r.ok)return null;const o=await r.json();return o.result||o.response||o.output||null}catch{return null}}async function Ze(t,e,s,a,r=1200){const o=[{role:"system",content:s},{role:"user",content:a}],i=await t.run(e,{messages:o,max_tokens:r});return i&&typeof i=="object"&&"response"in i?i.response||"":String(i||"")}async function ze(t,e,s){const a=Date.now();let r="",o=!1,i=t.source;try{if(t.source==="hybrid"&&t.internalUrl){const c=await ds(t.internalUrl,e);c?(r=c,i="internal",o=!1):(r=await Ze(s,t.model,t.system,e,1500),i="cloudflare",o=!0)}else r=await Ze(s,t.model,t.system,e,1500),i="cloudflare",o=!1}catch(c){r=`❌ Erro: ${(c==null?void 0:c.message)||"falha inesperada"}`}return{agentId:t.id,name:t.name,emoji:t.emoji,color:t.color,model:t.model,source:i,usedFallback:o,response:r,duration:Date.now()-a}}function us(t){const e=t.toLowerCase(),s=[];return/código|code|api|sistema|função|script|bug|deploy|docker|sql|banco|database|programar|desenvolver|criar.*app/.test(e)&&s.push("developer"),/contrato|nda|legal|jurídico|lgpd|compliance|cláusula|acordo|lei|direito|privacy/.test(e)&&s.push("legal"),/design|logo|ui|ux|interface|layout|cor|paleta|branding|wireframe|figma|css|visual/.test(e)&&s.push("designer"),/pesquis|research|mercado|concorrent|trend|análise|dados|market|investigar|buscar/.test(e)&&s.push("research"),/relatório|documento|report|proposta|spec|documentaç|apresent|manual|readme|word|pdf/.test(e)&&s.push("documents"),/analise|analisa|kpi|métrica|swot|negócio|estratégia|financeiro|projeção|cenário/.test(e)&&s.push("analyst"),/revisar|review|qualidade|verificar|corrigir|melhorar|audit|checar|validar/.test(e)&&s.push("reviewer"),s.length===0&&s.push("orchestrator"),s.length>1&&s.push("orchestrator"),[...new Set(s)]}const $=new Et;$.use("*",ls());$.get("/api/agents",t=>t.json({total:ve.length,models:Object.keys(C).length,repos:["sixtech-workspace","sixtechworkspace","kndev-IA","sixtechbrasil"],agents:ve.map(e=>({id:e.id,name:e.name,emoji:e.emoji,color:e.color,desc:e.desc,source:e.source,model:e.model,category:e.category,capabilities:e.capabilities,basedOn:e.basedOn,internalUrl:e.internalUrl}))}));$.post("/api/agent/:id",async t=>{const e=ve.find(o=>o.id===t.req.param("id"));if(!e)return t.json({error:"Agente não encontrado"},404);const{message:s,task:a}=await t.req.json(),r=await ze(e,s||a||"",t.env.AI);return t.json(r)});$.post("/api/orchestrate",async t=>{var c;const{task:e,message:s}=await t.req.json(),a=e||s||"";if(!a)return t.json({error:"task obrigatório"},400);const r=us(a),o=r.map(l=>ve.find(d=>d.id===l)).filter(Boolean),i=[];for(const l of o){const d=l.id==="orchestrator"&&i.length>0?`Tarefa original: "${a}"

Resultados dos agentes especializados:
${i.map(u=>`## ${u.emoji} ${u.name}
${u.response}`).join(`

`)}

Sintetize e entregue o resultado final consolidado.`:a;i.push(await ze(l,d,t.env.AI))}return t.json({task:a,agentsUsed:r,results:i,summary:((c=i[i.length-1])==null?void 0:c.response)||""})});$.post("/api/pipeline",async t=>{const{task:e,agentIds:s}=await t.req.json();if(!e||!(s!=null&&s.length))return t.json({error:"task e agentIds obrigatórios"},400);const a=s.map(l=>ve.find(d=>d.id===l)).filter(Boolean),r=[];let o=e;for(const l of a){a[a.length-1];const d=r.length===0?e:l.id==="orchestrator"&&r.length>0?`Tarefa original: "${e}"

${r.map(p=>`## ${p.emoji} ${p.name}
${p.response}`).join(`

`)}

Sintetize o resultado final.`:`${e}

[Contexto do ${r[r.length-1].name}]:
${r[r.length-1].response.slice(0,800)}`,u=await ze(l,d,t.env.AI);r.push(u),o=u.response}const i=r.filter(l=>l.source==="cloudflare").length,c=r.filter(l=>l.source==="internal").length;return t.json({task:e,steps:r.length,cloudflareSteps:i,internalSteps:c,results:r,final:o})});$.post("/api/chat",async t=>{const{messages:e,model:s}=await t.req.json(),a=s||C.balanced;e.some(o=>o.role==="system")||e.unshift({role:"system",content:`Você é o assistente inteligente da SixTech Brasil — plataforma multiagente de IA.
Seja útil, preciso e responda em português brasileiro por padrão.
Se o usuário falar inglês, responda em inglês.`});const r=await t.env.AI.run(a,{messages:e,max_tokens:2048,stream:!0});return new Response(r,{headers:{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache",Connection:"keep-alive","Access-Control-Allow-Origin":"*"}})});$.get("/api/models",t=>t.json({models:Object.entries(C).map(([e,s])=>({key:e,id:s,label:{fast:"⚡ Llama 3.2 3B — Rápido",balanced:"⚖️ Llama 3.1 8B — Balanceado",powerful:"💪 Llama 3.3 70B — Poderoso",coder:"💻 Qwen2.5 Coder 32B — Código",reason:"🧠 DeepSeek R1 32B — Raciocínio",kimi:"🎯 Kimi K2.6 1T — Orquestrador",gpt:"🤖 GPT-OSS 120B — Avançado",gemma:"💎 Gemma 3 12B — Google"}[e]||e}))}));$.get("/api/status",t=>t.json({status:"online",version:"3.0.0",platform:"SixTech MAS — Multi-Agent System",repos:{"sixtech-workspace":{agents:5,type:"Python FastAPI + Ollama",url:ce},sixtechworkspace:{type:"Cloudflare Workers AI + SSE",url:cs},"kndev-IA":{type:"OpenHands + opencode (RAR)",note:"Integrado ao developer agent"},sixtechbrasil:{type:"CF Pages — plataforma principal",url:"https://sixtechbrasil.pages.dev"}},agents:ve.length,models:Object.keys(C).length,features:["hybrid routing","SSE streaming","smart orchestration","pipeline mode","fallback chain"],timestamp:new Date().toISOString()}));$.get("/",t=>t.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SixTech MAS — Multi-Agent System v3.0</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
  :root {
    --primary: #6C63FF; --secondary: #22D3EE; --accent: #EC4899;
    --bg: #0B0D17; --surface: #141622; --card: #1B1E2E;
    --border: #2A2D40; --text: #E8E9F3; --muted: #6B7280;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glass { background: rgba(27,30,46,0.8); backdrop-filter: blur(12px); border: 1px solid var(--border); }
  .agent-card { transition: all .2s; }
  .agent-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,.2); }
  .tab-btn { transition: all .2s; border-bottom: 2px solid transparent; }
  .tab-btn.active { border-bottom-color: var(--primary); color: white; }
  .tab-panel { display: none; } .tab-panel.active { display: block; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .badge-cf { background: #1e3a5f; color: #60A5FA; }
  .badge-hybrid { background: #1e2d1e; color: #34D399; }
  .badge-int { background: #2d1e1e; color: #F87171; }
  .progress-step { transition: all .3s; }
  .progress-step.done { opacity: 1; } .progress-step.pending { opacity: .4; }
  .msg-user { background: linear-gradient(135deg, #1e1b4b, #312e81); border-left: 3px solid var(--primary); }
  .msg-ai { background: var(--card); border-left: 3px solid var(--secondary); }
  .result-card { animation: slideIn .3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .pulse-dot { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  pre code { font-family: 'Fira Code', monospace; font-size: 13px; }
  .cap-pill { background: rgba(108,99,255,.15); color: #a5b4fc; border: 1px solid rgba(108,99,255,.3); border-radius: 999px; padding: 2px 8px; font-size: 11px; }
  textarea:focus, input:focus, select:focus { outline: none; border-color: var(--primary) !important; box-shadow: 0 0 0 2px rgba(108,99,255,.2); }
  .model-opt { padding: 6px 10px; background: var(--card); color: var(--text); border: none; }
  .typing-cursor { display: inline-block; width: 2px; height: 1em; background: var(--secondary); animation: blink .7s infinite; vertical-align: text-bottom; margin-left: 2px; }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
</style>
</head>
<body>

<!-- HEADER -->
<header class="glass sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style="background:linear-gradient(135deg,#6C63FF,#22D3EE)">🤖</div>
    <div>
      <div class="font-bold text-white">SixTech MAS <span class="text-xs px-1.5 py-0.5 rounded-full ml-1" style="background:#1e3a5f;color:#60A5FA">v3.0</span></div>
      <div class="text-xs" style="color:var(--muted)">Multi-Agent System — Cloudflare Workers AI</div>
    </div>
  </div>
  <div class="flex items-center gap-3">
    <div id="status-dot" class="flex items-center gap-2 text-xs" style="color:#34D399">
      <span class="pulse-dot w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
      <span id="status-text">Online</span>
    </div>
    <a href="https://github.com/kainow252-cmyk/sixtechbrasil" target="_blank"
       class="text-sm px-3 py-1.5 rounded-lg flex items-center gap-2"
       style="background:var(--card);border:1px solid var(--border);color:var(--text)">
      <i class="fab fa-github"></i> GitHub
    </a>
  </div>
</header>

<!-- MAIN -->
<div class="max-w-7xl mx-auto px-4 py-6">

  <!-- TABS -->
  <nav class="flex gap-1 mb-6 p-1 rounded-xl" style="background:var(--surface);border:1px solid var(--border);width:fit-content">
    <button class="tab-btn active px-5 py-2.5 rounded-lg text-sm font-medium" onclick="showTab('pipeline')" style="background:var(--card)">
      <i class="fas fa-project-diagram mr-2"></i>Pipeline
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('chat')">
      <i class="fas fa-comments mr-2"></i>Chat IA
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('agents')">
      <i class="fas fa-robot mr-2"></i>Agentes
    </button>
    <button class="tab-btn px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400" onclick="showTab('status')">
      <i class="fas fa-chart-line mr-2"></i>Status
    </button>
  </nav>

  <!-- ═══ TAB: PIPELINE ═══════════════════════════════════════════════════ -->
  <div id="tab-pipeline" class="tab-panel active">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Coluna Esquerda: Configuração -->
      <div class="space-y-4">
        <!-- Tarefa -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-pen-to-square mr-2" style="color:var(--primary)"></i>Tarefa</h3>
          <textarea id="pipeline-task" rows="5" placeholder="Descreva o que você precisa...&#10;&#10;Ex: Crie uma API REST em Python com FastAPI para gerenciar usuários com autenticação JWT"
            class="w-full text-sm rounded-xl p-3 resize-none"
            style="background:var(--bg);border:1px solid var(--border);color:var(--text)"></textarea>
          <div class="flex gap-2 mt-3">
            <button onclick="autoRoute()" class="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style="background:linear-gradient(135deg,var(--primary),#4f46e5);color:white">
              <i class="fas fa-wand-magic-sparkles mr-2"></i>Auto Roteamento
            </button>
            <button onclick="clearAll()" class="px-3 py-2.5 rounded-xl text-sm"
              style="background:var(--card);border:1px solid var(--border);color:var(--muted)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Seleção de Agentes -->
        <div class="glass rounded-2xl p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-white"><i class="fas fa-robot mr-2" style="color:var(--secondary)"></i>Agentes</h3>
            <span id="agent-count" class="text-xs" style="color:var(--muted)">0 selecionados</span>
          </div>
          <div id="agent-checklist" class="space-y-2 max-h-64 overflow-y-auto pr-1"></div>
          <button onclick="runPipeline()" id="run-btn"
            class="w-full mt-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style="background:linear-gradient(135deg,#059669,#10b981);color:white">
            <i class="fas fa-play"></i>Executar Pipeline
          </button>
        </div>

        <!-- Modo de Execução -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-sliders mr-2" style="color:var(--accent)"></i>Modo</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" value="pipeline" checked class="accent-purple-500">
              <div>
                <div class="text-sm font-medium text-white">Pipeline Sequencial</div>
                <div class="text-xs" style="color:var(--muted)">Agentes passam contexto entre si</div>
              </div>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" value="orchestrate" class="accent-purple-500">
              <div>
                <div class="text-sm font-medium text-white">Roteamento Inteligente</div>
                <div class="text-xs" style="color:var(--muted)">Auto-seleção por análise de contexto</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Resultados -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Progress Bar -->
        <div id="progress-bar" class="glass rounded-2xl p-4 hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-white">Executando Pipeline</span>
            <span id="progress-info" class="text-xs" style="color:var(--muted)"></span>
          </div>
          <div id="progress-steps" class="flex gap-2 flex-wrap"></div>
        </div>

        <!-- Resultados -->
        <div id="results-container" class="space-y-4">
          <!-- placeholder -->
          <div id="results-placeholder" class="glass rounded-2xl p-12 text-center">
            <div class="text-5xl mb-4">🤖</div>
            <div class="text-white font-medium mb-2">Pronto para executar</div>
            <div class="text-sm" style="color:var(--muted)">Configure a tarefa, selecione os agentes e clique em Executar</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ TAB: CHAT ════════════════════════════════════════════════════════ -->
  <div id="tab-chat" class="tab-panel">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">

      <!-- Sidebar Chat -->
      <div class="space-y-4">
        <div class="glass rounded-2xl p-4">
          <h3 class="font-semibold text-white mb-3"><i class="fas fa-microchip mr-2" style="color:var(--primary)"></i>Modelo</h3>
          <select id="chat-model" class="w-full text-sm rounded-xl p-2.5"
            style="background:var(--bg);border:1px solid var(--border);color:var(--text)">
          </select>
          <div class="mt-3">
            <div class="text-xs font-medium mb-2" style="color:var(--muted)">Agente Especialista</div>
            <select id="chat-agent" class="w-full text-sm rounded-xl p-2.5"
              style="background:var(--bg);border:1px solid var(--border);color:var(--text)">
              <option value="">Nenhum (chat livre)</option>
            </select>
          </div>
        </div>
        <div class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-white text-sm"><i class="fas fa-clock-rotate-left mr-2" style="color:var(--secondary)"></i>Histórico</h3>
            <button onclick="clearChat()" class="text-xs px-2 py-1 rounded-lg"
              style="background:var(--card);color:var(--muted)">Limpar</button>
          </div>
          <div id="chat-history-list" class="space-y-1 text-xs" style="color:var(--muted)">
            <div class="text-center py-4">Nenhuma conversa</div>
          </div>
        </div>
      </div>

      <!-- Chat Principal -->
      <div class="lg:col-span-3 glass rounded-2xl flex flex-col" style="height:600px">
        <div class="p-4 border-b flex items-center justify-between" style="border-color:var(--border)">
          <div class="flex items-center gap-2">
            <span class="text-lg">💬</span>
            <span class="font-medium text-white">Chat com IA</span>
          </div>
          <span id="chat-model-badge" class="badge badge-cf">Llama 3.1 8B</span>
        </div>
        <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div class="msg-ai rounded-xl p-4 text-sm">
            <div class="font-medium text-cyan-400 mb-1">🤖 Assistente SixTech</div>
            <div>Olá! Sou o assistente da <strong>SixTech Brasil</strong>, powered by Cloudflare Workers AI. Como posso ajudar você hoje?</div>
          </div>
        </div>
        <div id="typing-indicator" class="px-4 py-2 text-xs hidden" style="color:var(--muted)">
          <span class="pulse-dot w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-2"></span>IA digitando...
        </div>
        <div class="p-4 border-t" style="border-color:var(--border)">
          <div class="flex gap-2">
            <textarea id="chat-input" rows="2" placeholder="Digite sua mensagem... (Enter para enviar)"
              class="flex-1 text-sm rounded-xl p-3 resize-none"
              style="background:var(--bg);border:1px solid var(--border);color:var(--text)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat()}"></textarea>
            <button onclick="sendChat()" id="chat-send-btn"
              class="px-4 rounded-xl font-semibold self-end py-3"
              style="background:linear-gradient(135deg,var(--primary),#4f46e5);color:white">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ TAB: AGENTES ═════════════════════════════════════════════════════ -->
  <div id="tab-agents" class="tab-panel">
    <div class="mb-4 flex items-center gap-3">
      <input id="agent-search" type="text" placeholder="Buscar agente..."
        class="text-sm rounded-xl px-4 py-2.5 w-64"
        style="background:var(--surface);border:1px solid var(--border);color:var(--text)"
        oninput="filterAgents(this.value)">
      <div class="flex gap-2">
        <button onclick="filterBySource('all')" class="filter-btn active px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--primary);color:white">Todos</button>
        <button onclick="filterBySource('hybrid')" class="filter-btn px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--card);color:var(--muted)">Hybrid</button>
        <button onclick="filterBySource('cloudflare')" class="filter-btn px-3 py-2 rounded-lg text-xs font-medium" style="background:var(--card);color:var(--muted)">Cloudflare</button>
      </div>
    </div>
    <div id="agents-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div>
  </div>

  <!-- ═══ TAB: STATUS ══════════════════════════════════════════════════════ -->
  <div id="tab-status" class="tab-panel">
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold gradient-text" id="stat-agents">9</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Agentes Ativos</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#22D3EE" id="stat-models">8</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Modelos de IA</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#34D399" id="stat-repos">4</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Repos Integrados</div>
      </div>
      <div class="glass rounded-2xl p-5">
        <div class="text-3xl font-bold" style="color:#F59E0B" id="stat-ver">v3.0</div>
        <div class="text-sm mt-1" style="color:var(--muted)">Versão</div>
      </div>
    </div>
    <div id="status-details" class="grid grid-cols-1 lg:grid-cols-2 gap-4"></div>
  </div>

</div>

<script>
// ── Estado global
let agents = [], models = {}, chatHistory = [], allAgents = []

// ── Inicialização
async function init() {
  try {
    const [agentsRes, modelsRes] = await Promise.all([
      fetch('/api/agents'), fetch('/api/models')
    ])
    const agentsData = await agentsRes.json()
    const modelsData = await modelsRes.json()
    agents = agentsData.agents
    allAgents = [...agents]
    models = modelsData.models

    renderAgentChecklist()
    renderAgentsGrid()
    renderChatModels()
    loadStatus()
  } catch(e) {
    console.error('Init error:', e)
  }
}

// ── Tabs
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active')
    b.style.background = 'transparent'
    b.style.color = '#6B7280'
  })
  document.getElementById('tab-' + name).classList.add('active')
  const btn = event.currentTarget
  btn.classList.add('active')
  btn.style.background = 'var(--card)'
  btn.style.color = 'white'
}

// ── Agent Checklist
function renderAgentChecklist() {
  const container = document.getElementById('agent-checklist')
  container.innerHTML = agents.map(a => \`
    <label class="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors agent-check-item" data-source="\${a.source}">
      <input type="checkbox" value="\${a.id}" class="accent-purple-500 agent-checkbox"
        onchange="updateAgentCount()">
      <span class="text-lg">\${a.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white truncate">\${a.name}</div>
        <div class="text-xs truncate" style="color:#6B7280">\${a.category}</div>
      </div>
      <span class="badge \${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'} shrink-0">
        \${a.source === 'hybrid' ? 'hybrid' : 'cf'}
      </span>
    </label>
  \`).join('')
  updateAgentCount()
}

function updateAgentCount() {
  const count = document.querySelectorAll('.agent-checkbox:checked').length
  document.getElementById('agent-count').textContent = count + ' selecionados'
}

// ── Auto Routing
async function autoRoute() {
  const task = document.getElementById('pipeline-task').value.trim()
  if (!task) return

  document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = false)
  const res = await fetch('/api/orchestrate', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({task})
  })
  if (!res.ok) return
  const data = await res.json()
  data.agentsUsed.forEach(id => {
    const cb = document.querySelector(\`.agent-checkbox[value="\${id}"]\`)
    if (cb) cb.checked = true
  })
  updateAgentCount()
  document.querySelector('input[name="mode"][value="orchestrate"]').checked = true
}

// ── Run Pipeline
async function runPipeline() {
  const task = document.getElementById('pipeline-task').value.trim()
  if (!task) return alert('Digite uma tarefa!')

  const selectedIds = [...document.querySelectorAll('.agent-checkbox:checked')].map(cb => cb.value)
  if (!selectedIds.length) return alert('Selecione ao menos um agente!')

  const mode = document.querySelector('input[name="mode"]:checked').value
  const btn = document.getElementById('run-btn')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner spin mr-2"></i>Executando...'

  // Progress bar
  const pb = document.getElementById('progress-bar')
  pb.classList.remove('hidden')
  const steps = document.getElementById('progress-steps')
  steps.innerHTML = selectedIds.map((id, i) => {
    const a = agents.find(x => x.id === id)
    return \`<div class="progress-step pending flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" id="step-\${id}"
      style="background:var(--card);border:1px solid var(--border)">
      <span>\${a?.emoji || '🤖'}</span><span>\${a?.name || id}</span>
    </div>\`
  }).join('')

  // Clear results
  const container = document.getElementById('results-container')
  document.getElementById('results-placeholder')?.remove()
  container.innerHTML = ''

  try {
    if (mode === 'orchestrate') {
      document.getElementById('progress-info').textContent = 'Roteamento inteligente...'
      selectedIds.forEach(id => document.getElementById('step-' + id)?.classList.add('done'))

      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({task})
      })
      const data = await res.json()
      data.results.forEach(r => renderResult(r, container))
    } else {
      for (let i = 0; i < selectedIds.length; i++) {
        const id = selectedIds[i]
        const stepEl = document.getElementById('step-' + id)
        if (stepEl) {
          stepEl.style.background = 'rgba(108,99,255,.2)'
          stepEl.style.borderColor = '#6C63FF'
          stepEl.innerHTML = stepEl.innerHTML.replace('</div>', '') + ' <i class="fas fa-spinner spin"></i></div>'
        }
        document.getElementById('progress-info').textContent = \`\${i+1}/\${selectedIds.length}\`

        const res = await fetch('/api/agent/' + id, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({task, message: task})
        })
        const result = await res.json()
        renderResult(result, container)

        if (stepEl) {
          stepEl.style.background = 'rgba(52,211,153,.1)'
          stepEl.style.borderColor = '#34D399'
          stepEl.classList.remove('pending')
          stepEl.classList.add('done')
          stepEl.innerHTML = stepEl.innerHTML.replace(/<i class.*</i>/, '✓')
        }
      }
    }
  } catch(e) {
    container.innerHTML += \`<div class="glass rounded-2xl p-5 border border-red-800/50">
      <div class="text-red-400">❌ Erro: \${e.message}</div></div>\`
  }

  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-play mr-2"></i>Executar Pipeline'
}

function renderResult(r, container) {
  const sourceLabel = r.usedFallback ? '☁️ CF Fallback' : r.source === 'internal' ? '🖥️ Interno' : '☁️ Cloudflare'
  const sourceBadge = r.usedFallback ? 'badge-hybrid' : r.source === 'internal' ? 'badge-int' : 'badge-cf'
  const formatted = mdToHtml(r.response || r.error || 'Sem resposta')

  const el = document.createElement('div')
  el.className = 'result-card glass rounded-2xl overflow-hidden'
  el.innerHTML = \`
    <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid var(--border);background:linear-gradient(90deg,\${r.color}15,transparent)">
      <span class="text-2xl">\${r.emoji}</span>
      <div class="flex-1">
        <div class="font-semibold text-white">\${r.name}</div>
        <div class="text-xs" style="color:#6B7280">\${r.model?.split('/').pop()}</div>
      </div>
      <span class="badge \${sourceBadge}">\${sourceLabel}</span>
      <span class="text-xs" style="color:#6B7280">\${(r.duration/1000).toFixed(1)}s</span>
    </div>
    <div class="p-5 text-sm leading-relaxed prose-sm" style="color:#D1D5DB">\${formatted}</div>
  \`
  container.appendChild(el)
  el.scrollIntoView({behavior:'smooth', block:'nearest'})
}

// ── Chat
function renderChatModels() {
  const sel = document.getElementById('chat-model')
  sel.innerHTML = models.map(m => \`<option class="model-opt" value="\${m.id}">\${m.label}</option>\`).join('')
  sel.addEventListener('change', () => {
    document.getElementById('chat-model-badge').textContent = models.find(m => m.id === sel.value)?.label || sel.value
  })

  const agentSel = document.getElementById('chat-agent')
  agentSel.innerHTML = '<option value="">Nenhum (chat livre)</option>' +
    agents.map(a => \`<option value="\${a.id}">\${a.emoji} \${a.name}</option>\`).join('')
}

async function sendChat() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg) return

  const agentId = document.getElementById('chat-agent').value
  input.value = ''
  input.style.height = 'auto'

  // Se agente selecionado, usa /api/agent/:id
  if (agentId) {
    appendChatMsg('user', msg)
    document.getElementById('typing-indicator').classList.remove('hidden')
    try {
      const res = await fetch('/api/agent/' + agentId, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({message: msg})
      })
      const data = await res.json()
      document.getElementById('typing-indicator').classList.add('hidden')
      const agent = agents.find(a => a.id === agentId)
      appendChatMsg('assistant', data.response || 'Sem resposta', agent?.name, agent?.emoji)
    } catch(e) {
      document.getElementById('typing-indicator').classList.add('hidden')
      appendChatMsg('assistant', '❌ Erro: ' + e.message)
    }
    return
  }

  // Chat livre com streaming SSE
  const model = document.getElementById('chat-model').value
  chatHistory.push({role: 'user', content: msg})
  appendChatMsg('user', msg)
  document.getElementById('typing-indicator').classList.remove('hidden')
  document.getElementById('chat-send-btn').disabled = true

  // Container para resposta streaming
  const aiEl = document.createElement('div')
  aiEl.className = 'msg-ai rounded-xl p-4 text-sm'
  aiEl.innerHTML = '<div class="font-medium mb-1" style="color:#22D3EE">🤖 Assistente</div><div class="streaming-text"></div>'
  document.getElementById('chat-messages').appendChild(aiEl)
  const textEl = aiEl.querySelector('.streaming-text')
  document.getElementById('chat-messages').scrollTop = 9999

  let fullText = ''
  try {
    const res = await fetch('/api/chat', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({messages: [...chatHistory], model})
    })
    if (!res.body) throw new Error('Stream não disponível')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const {done, value} = await reader.read()
      if (done) break
      buffer += decoder.decode(value, {stream: true})
      const parts = buffer.split('\\n\\n')
      buffer = parts.pop() || ''
      for (const part of parts) {
        for (const line of part.split('\\n')) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const chunk = json.response || json.choices?.[0]?.delta?.content || ''
            if (chunk) {
              fullText += chunk
              textEl.innerHTML = mdToHtml(fullText) + '<span class="typing-cursor"></span>'
              document.getElementById('chat-messages').scrollTop = 9999
            }
          } catch {}
        }
      }
    }
    textEl.innerHTML = mdToHtml(fullText)
    chatHistory.push({role: 'assistant', content: fullText})
    updateChatHistory()
  } catch(e) {
    textEl.textContent = '❌ Erro: ' + e.message
  }

  document.getElementById('typing-indicator').classList.add('hidden')
  document.getElementById('chat-send-btn').disabled = false
}

function appendChatMsg(role, text, name='Assistente', emoji='🤖') {
  const el = document.createElement('div')
  el.className = role === 'user' ? 'msg-user rounded-xl p-4 text-sm ml-8' : 'msg-ai rounded-xl p-4 text-sm'
  if (role === 'user') {
    el.innerHTML = \`<div class="font-medium mb-1" style="color:#a5b4fc">👤 Você</div><div>\${escHtml(text)}</div>\`
  } else {
    el.innerHTML = \`<div class="font-medium mb-1" style="color:#22D3EE">\${emoji} \${name}</div><div>\${mdToHtml(text)}</div>\`
  }
  document.getElementById('chat-messages').appendChild(el)
  document.getElementById('chat-messages').scrollTop = 9999
}

function updateChatHistory() {
  const list = document.getElementById('chat-history-list')
  const userMsgs = chatHistory.filter(m => m.role === 'user')
  if (!userMsgs.length) return
  list.innerHTML = userMsgs.slice(-5).reverse().map(m =>
    \`<div class="px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer truncate">\${m.content.slice(0,35)}...</div>\`
  ).join('')
}

function clearChat() {
  chatHistory = []
  document.getElementById('chat-messages').innerHTML = \`
    <div class="msg-ai rounded-xl p-4 text-sm">
      <div class="font-medium text-cyan-400 mb-1">🤖 Assistente SixTech</div>
      <div>Olá! Como posso ajudar?</div>
    </div>\`
  document.getElementById('chat-history-list').innerHTML = '<div class="text-center py-4">Nenhuma conversa</div>'
}

// ── Agents Grid
function renderAgentsGrid(filtered = null) {
  const list = filtered || allAgents
  document.getElementById('agents-grid').innerHTML = list.map(a => \`
    <div class="agent-card glass rounded-2xl overflow-hidden">
      <div class="p-5" style="border-bottom:1px solid var(--border);background:linear-gradient(135deg,\${a.color}20,transparent)">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">\${a.emoji}</span>
            <div>
              <div class="font-bold text-white">\${a.name}</div>
              <div class="text-xs" style="color:#6B7280">\${a.category}</div>
            </div>
          </div>
          <span class="badge \${a.source === 'hybrid' ? 'badge-hybrid' : 'badge-cf'}">\${a.source}</span>
        </div>
        <p class="text-xs leading-relaxed" style="color:#9CA3AF">\${a.desc}</p>
      </div>
      <div class="p-4">
        <div class="mb-3">
          <div class="text-xs font-medium mb-2" style="color:#6B7280">CAPACIDADES</div>
          <div class="flex flex-wrap gap-1">
            \${(a.capabilities||[]).map(c => \`<span class="cap-pill">\${c}</span>\`).join('')}
          </div>
        </div>
        \${a.basedOn ? \`<div class="text-xs mb-3" style="color:#6B7280">📦 Baseado em: <span style="color:#a5b4fc">\${a.basedOn}</span></div>\` : ''}
        <div class="text-xs mb-3" style="color:#6B7280">🤖 Modelo: <span style="color:#22D3EE">\${a.model?.split('/').pop()}</span></div>
        <button onclick="testAgent('\${a.id}')"
          class="w-full py-2 rounded-xl text-xs font-semibold"
          style="background:rgba(108,99,255,.2);border:1px solid rgba(108,99,255,.4);color:#a5b4fc">
          <i class="fas fa-flask mr-1"></i>Testar Agente
        </button>
      </div>
    </div>
  \`).join('')
}

function filterAgents(q) {
  const filtered = allAgents.filter(a =>
    a.name.toLowerCase().includes(q.toLowerCase()) ||
    a.desc.toLowerCase().includes(q.toLowerCase()) ||
    a.category.toLowerCase().includes(q.toLowerCase())
  )
  renderAgentsGrid(filtered)
}

function filterBySource(src) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.style.background = 'var(--card)'; b.style.color = 'var(--muted)'
  })
  event.currentTarget.style.background = 'var(--primary)'
  event.currentTarget.style.color = 'white'
  renderAgentsGrid(src === 'all' ? allAgents : allAgents.filter(a => a.source === src))
}

async function testAgent(id) {
  const task = prompt('Teste o agente — digite uma tarefa:')
  if (!task) return
  showTab('pipeline')
  setTimeout(() => {
    document.getElementById('pipeline-task').value = task
    document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = cb.value === id)
    updateAgentCount()
    runPipeline()
  }, 100)
}

// ── Status
async function loadStatus() {
  try {
    const res = await fetch('/api/status')
    const data = await res.json()
    const container = document.getElementById('status-details')
    container.innerHTML = \`
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4"><i class="fas fa-code-branch mr-2" style="color:var(--primary)"></i>Repositórios Integrados</h3>
        <div class="space-y-3">
          \${Object.entries(data.repos).map(([name, info]) => \`
            <div class="flex items-start gap-3 p-3 rounded-xl" style="background:var(--bg);border:1px solid var(--border)">
              <span class="text-green-400 mt-0.5">●</span>
              <div>
                <div class="font-medium text-white text-sm">\${name}</div>
                <div class="text-xs mt-1" style="color:#6B7280">\${info.type}</div>
                \${info.url ? \`<a href="\${info.url}" target="_blank" class="text-xs" style="color:#6C63FF">\${info.url}</a>\` : ''}
                \${info.note ? \`<div class="text-xs mt-1" style="color:#F59E0B">\${info.note}</div>\` : ''}
              </div>
            </div>
          \`).join('')}
        </div>
      </div>
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-white mb-4"><i class="fas fa-server mr-2" style="color:var(--secondary)"></i>Funcionalidades</h3>
        <div class="space-y-2">
          \${data.features.map(f => \`
            <div class="flex items-center gap-3 p-2.5 rounded-xl" style="background:var(--bg)">
              <i class="fas fa-check-circle text-emerald-400"></i>
              <span class="text-sm text-white">\${f}</span>
            </div>
          \`).join('')}
        </div>
        <div class="mt-4 p-3 rounded-xl text-xs" style="background:rgba(108,99,255,.1);border:1px solid rgba(108,99,255,.3);color:#a5b4fc">
          <i class="fas fa-info-circle mr-2"></i>
          Plataforma hospedada no Cloudflare Pages Edge — latência global < 50ms
        </div>
      </div>
    \`
    document.getElementById('stat-agents').textContent = data.agents
    document.getElementById('stat-models').textContent = data.models
  } catch(e) {
    document.getElementById('status-text').textContent = 'Verificando...'
  }
}

// ── Utils
function clearAll() {
  document.getElementById('pipeline-task').value = ''
  document.querySelectorAll('.agent-checkbox').forEach(cb => cb.checked = false)
  updateAgentCount()
  document.getElementById('results-container').innerHTML = \`
    <div id="results-placeholder" class="glass rounded-2xl p-12 text-center">
      <div class="text-5xl mb-4">🤖</div>
      <div class="text-white font-medium mb-2">Pronto para executar</div>
      <div class="text-sm" style="color:var(--muted)">Configure a tarefa, selecione os agentes e clique em Executar</div>
    </div>\`
  document.getElementById('progress-bar').classList.add('hidden')
}

function escHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

function mdToHtml(md) {
  if (!md) return ''
  return md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\`\`\`(\\w*)?\\n?([\\s\\S]*?)\`\`\`/g, (_,lang,code) =>
      \`<pre style="background:#0d0d1a;border:1px solid #2A2D40;border-radius:8px;padding:12px;overflow-x:auto;margin:8px 0"><code class="language-\${lang||'text'}" style="color:#e2e8f0;font-family:monospace">\${code.trim()}</code></pre>\`)
    .replace(/\`([^\`]+)\`/g, '<code style="background:#1e2030;padding:2px 6px;border-radius:4px;color:#f472b6;font-family:monospace">$1</code>')
    .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong style="color:white">$1</strong>')
    .replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#22D3EE;font-size:1rem;font-weight:600;margin:12px 0 6px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#a5b4fc;font-size:1.1rem;font-weight:700;margin:16px 0 8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:white;font-size:1.25rem;font-weight:800;margin:16px 0 8px">$1</h1>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">• $1</li>')
    .replace(/^(\\d+)\\. (.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1. $2</li>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #6C63FF;padding-left:12px;color:#9CA3AF;margin:8px 0">$1</blockquote>')
    .replace(/\\n/g, '<br>')
}

// Inicializar
init()
<\/script>
</body>
</html>`));const et=new Et,ps=Object.assign({"/src/index.tsx":$});let At=!1;for(const[,t]of Object.entries(ps))t&&(et.route("/",t),et.notFound(t.notFoundHandler),At=!0);if(!At)throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");export{et as default};
