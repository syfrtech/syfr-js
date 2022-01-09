var Syfr;(()=>{"use strict";var e={32:(e,t,r)=>{r.d(t,{SyfrClass:()=>G});const a=new TextEncoder,n=new TextDecoder,i=2**32;function s(...e){const t=e.reduce(((e,{length:t})=>e+t),0),r=new Uint8Array(t);let a=0;return e.forEach((e=>{r.set(e,a),a+=e.length})),r}function o(e,t,r){if(t<0||t>=i)throw new RangeError(`value must be >= 0 and <= 4294967295. Received ${t}`);e.set([t>>>24,t>>>16,t>>>8,255&t],r)}function c(e){const t=new Uint8Array(4);return o(t,e),t}function d(e){return s(c(e.length),e)}const l=e=>(e=>{let t=e;"string"==typeof t&&(t=a.encode(t));const r=[];for(let e=0;e<t.length;e+=32768)r.push(String.fromCharCode.apply(null,t.subarray(e,e+32768)));return btoa(r.join(""))})(e).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_"),h=e=>{let t=e;t instanceof Uint8Array&&(t=n.decode(t)),t=t.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"");try{return(e=>new Uint8Array(atob(e).split("").map((e=>e.charCodeAt(0)))))(t)}catch(e){throw new TypeError("The input to be decoded is not correctly encoded.")}};class u extends Error{constructor(e){var t;super(e),this.code="ERR_JOSE_GENERIC",this.name=this.constructor.name,null===(t=Error.captureStackTrace)||void 0===t||t.call(Error,this,this.constructor)}static get code(){return"ERR_JOSE_GENERIC"}}class p extends u{constructor(){super(...arguments),this.code="ERR_JOSE_NOT_SUPPORTED"}static get code(){return"ERR_JOSE_NOT_SUPPORTED"}}class y extends u{constructor(){super(...arguments),this.code="ERR_JWE_INVALID"}static get code(){return"ERR_JWE_INVALID"}}const w=crypto;function f(e){try{return null!=e&&"boolean"==typeof e.extractable&&"string"==typeof e.algorithm.name&&"string"==typeof e.type}catch(e){return!1}}const g=w.getRandomValues.bind(w);function m(e){switch(e){case"A128GCM":case"A128GCMKW":case"A192GCM":case"A192GCMKW":case"A256GCM":case"A256GCMKW":return 96;case"A128CBC-HS256":case"A192CBC-HS384":case"A256CBC-HS512":return 128;default:throw new p(`Unsupported JWE Algorithm: ${e}`)}}const A=e=>g(new Uint8Array(m(e)>>3)),E=(e,t)=>{if(e.length<<3!==t)throw new y("Invalid Content Encryption Key length")},b=e=>f(e),S=["CryptoKey"],v=async()=>{throw new p('JWE "zip" (Compression Algorithm) Header Parameter is not supported by your javascript runtime. You need to use the `deflateRaw` encrypt option to provide Deflate Raw implementation.')},C=[{hash:"SHA-256",name:"HMAC"},!0,["sign"]];function K(e,t="algorithm.name"){return new TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`)}function H(e,t){return e.name===t}function P(e,t,...r){switch(t){case"A128GCM":case"A192GCM":case"A256GCM":{if(!H(e.algorithm,"AES-GCM"))throw K("AES-GCM");const r=parseInt(t.substr(1,3),10);if(e.algorithm.length!==r)throw K(r,"algorithm.length");break}case"A128KW":case"A192KW":case"A256KW":{if(!H(e.algorithm,"AES-KW"))throw K("AES-KW");const r=parseInt(t.substr(1,3),10);if(e.algorithm.length!==r)throw K(r,"algorithm.length");break}case"ECDH-ES":if(!H(e.algorithm,"ECDH"))throw K("ECDH");break;case"PBES2-HS256+A128KW":case"PBES2-HS384+A192KW":case"PBES2-HS512+A256KW":if(!H(e.algorithm,"PBKDF2"))throw K("PBKDF2");break;case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":{if(!H(e.algorithm,"RSA-OAEP"))throw K("RSA-OAEP");const r=parseInt(t.substr(9),10)||1;if(a=e.algorithm.hash,parseInt(a.name.substr(4),10)!==r)throw K(`SHA-${r}`,"algorithm.hash");break}default:throw new TypeError("CryptoKey does not support this operation")}var a;!function(e,t){if(t.length&&!t.some((t=>e.usages.includes(t)))){let e="CryptoKey does not support this operation, its usages must include ";if(t.length>2){const r=t.pop();e+=`one of ${t.join(", ")}, or ${r}.`}else 2===t.length?e+=`one of ${t[0]} or ${t[1]}.`:e+=`${t[0]}.`;throw new TypeError(e)}}(e,r)}const k=(e,...t)=>{let r="Key must be ";if(t.length>2){const e=t.pop();r+=`one of type ${t.join(", ")}, or ${e}.`}else 2===t.length?r+=`one of type ${t[0]} or ${t[1]}.`:r+=`of type ${t[0]}.`;return null==e?r+=` Received ${e}`:"function"==typeof e&&e.name?r+=` Received function ${e.name}`:"object"==typeof e&&null!=e&&e.constructor&&e.constructor.name&&(r+=` Received an instance of ${e.constructor.name}`),r};const _=async(e,t,r)=>{const a=await function(e,t,r){if(f(e))return P(e,t,r),e;if(e instanceof Uint8Array)return w.subtle.importKey("raw",e,"AES-KW",!0,[r]);throw new TypeError(k(e,...S,"Uint8Array"))}(t,e,"wrapKey");!function(e,t){if(e.algorithm.length!==parseInt(t.substr(1,3),10))throw new TypeError(`Invalid key size for alg: ${t}`)}(a,e);const n=await w.subtle.importKey("raw",r,...C);return new Uint8Array(await w.subtle.wrapKey("raw",n,a,"AES-KW"))},W=async(e,t)=>{const r=`SHA-${e.substr(-3)}`;return new Uint8Array(await w.subtle.digest(r,t))};function T(e){switch(e){case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":return"RSA-OAEP";default:throw new p(`alg ${e} is not supported either by JOSE or your javascript runtime`)}}function O(e){switch(e){case"A128GCM":return 128;case"A192GCM":return 192;case"A256GCM":case"A128CBC-HS256":return 256;case"A192CBC-HS384":return 384;case"A256CBC-HS512":return 512;default:throw new p(`Unsupported JWE Algorithm: ${e}`)}}const U=e=>g(new Uint8Array(O(e)>>3));function j(){try{return void 0!==process.versions.node}catch(e){return!1}}const M=async e=>{var t,r;const{algorithm:a,keyUsages:n}=function(e){let t,r;switch(e.kty){case"oct":switch(e.alg){case"HS256":case"HS384":case"HS512":t={name:"HMAC",hash:`SHA-${e.alg.substr(-3)}`},r=["sign","verify"];break;case"A128CBC-HS256":case"A192CBC-HS384":case"A256CBC-HS512":throw new p(`${e.alg} keys cannot be imported as CryptoKey instances`);case"A128GCM":case"A192GCM":case"A256GCM":case"A128GCMKW":case"A192GCMKW":case"A256GCMKW":t={name:"AES-GCM"},r=["encrypt","decrypt"];break;case"A128KW":case"A192KW":case"A256KW":t={name:"AES-KW"},r=["wrapKey","unwrapKey"];break;case"PBES2-HS256+A128KW":case"PBES2-HS384+A192KW":case"PBES2-HS512+A256KW":t={name:"PBKDF2"},r=["deriveBits"];break;default:throw new p('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break;case"RSA":switch(e.alg){case"PS256":case"PS384":case"PS512":t={name:"RSA-PSS",hash:`SHA-${e.alg.substr(-3)}`},r=e.d?["sign"]:["verify"];break;case"RS256":case"RS384":case"RS512":t={name:"RSASSA-PKCS1-v1_5",hash:`SHA-${e.alg.substr(-3)}`},r=e.d?["sign"]:["verify"];break;case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":t={name:"RSA-OAEP",hash:`SHA-${parseInt(e.alg.substr(-3),10)||1}`},r=e.d?["decrypt","unwrapKey"]:["encrypt","wrapKey"];break;default:throw new p('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break;case"EC":switch(e.alg){case"ES256":t={name:"ECDSA",namedCurve:"P-256"},r=e.d?["sign"]:["verify"];break;case"ES384":t={name:"ECDSA",namedCurve:"P-384"},r=e.d?["sign"]:["verify"];break;case"ES512":t={name:"ECDSA",namedCurve:"P-521"},r=e.d?["sign"]:["verify"];break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":t={name:"ECDH",namedCurve:e.crv},r=e.d?["deriveBits"]:[];break;default:throw new p('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break;case("function"==typeof WebSocketPair||j())&&"OKP":if("EdDSA"!==e.alg)throw new p('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');switch(e.crv){case"Ed25519":t={name:"NODE-ED25519",namedCurve:"NODE-ED25519"},r=e.d?["sign"]:["verify"];break;case j()&&"Ed448":t={name:"NODE-ED448",namedCurve:"NODE-ED448"},r=e.d?["sign"]:["verify"];break;default:throw new p('Invalid or unsupported JWK "crv" (Subtype of Key Pair) Parameter value')}break;default:throw new p('Invalid or unsupported JWK "kty" (Key Type) Parameter value')}return{algorithm:t,keyUsages:r}}(e),i=[a,null!==(t=e.ext)&&void 0!==t&&t,null!==(r=e.key_ops)&&void 0!==r?r:n];if("PBKDF2"===a.name)return w.subtle.importKey("raw",h(e.k),...i);const s={...e};return delete s.alg,w.subtle.importKey("jwk",s,...i)};const R=async(e,t,r,a,n)=>{if(!(f(r)||r instanceof Uint8Array))throw new TypeError(k(r,...S,"Uint8Array"));switch(((e,t)=>{if(t.length<<3!==m(e))throw new y("Invalid Initialization Vector length")})(e,a),e){case"A128CBC-HS256":case"A192CBC-HS384":case"A256CBC-HS512":return r instanceof Uint8Array&&E(r,parseInt(e.substr(-3),10)),async function(e,t,r,a,n){if(!(r instanceof Uint8Array))throw new TypeError(k(r,"Uint8Array"));const c=parseInt(e.substr(1,3),10),d=await w.subtle.importKey("raw",r.subarray(c>>3),"AES-CBC",!1,["encrypt"]),l=await w.subtle.importKey("raw",r.subarray(0,c>>3),{hash:"SHA-"+(c<<1),name:"HMAC"},!1,["sign"]),h=new Uint8Array(await w.subtle.encrypt({iv:a,name:"AES-CBC"},d,t)),u=s(n,a,h,function(e){const t=Math.floor(e/i),r=e%i,a=new Uint8Array(8);return o(a,t,0),o(a,r,4),a}(n.length<<3));return{ciphertext:h,tag:new Uint8Array((await w.subtle.sign("HMAC",l,u)).slice(0,c>>3))}}(e,t,r,a,n);case"A128GCM":case"A192GCM":case"A256GCM":return r instanceof Uint8Array&&E(r,parseInt(e.substr(1,3),10)),async function(e,t,r,a,n){let i;r instanceof Uint8Array?i=await w.subtle.importKey("raw",r,"AES-GCM",!1,["encrypt"]):(P(r,e,"encrypt"),i=r);const s=new Uint8Array(await w.subtle.encrypt({additionalData:n,iv:a,name:"AES-GCM",tagLength:128},i,t)),o=s.slice(-16);return{ciphertext:s.slice(0,-16),tag:o}}(e,t,r,a,n);default:throw new p("Unsupported JWE Content Encryption Algorithm")}},D=async function(e,t,r,n,i={}){let o,h,u;switch(((e,t,r)=>{e.startsWith("HS")||"dir"===e||e.startsWith("PBES2")||/^A\d{3}(?:GCM)?KW$/.test(e)?(e=>{if(!(e instanceof Uint8Array)){if(!b(e))throw new TypeError(k(e,...S,"Uint8Array"));if("secret"!==e.type)throw new TypeError(`${S.join(" or ")} instances for symmetric algorithms must be of type "secret"`)}})(t):((e,t)=>{if(!b(e))throw new TypeError(k(e,...S));if("secret"===e.type)throw new TypeError(`${S.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);if("sign"===t&&"public"===e.type)throw new TypeError(`${S.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);if("decrypt"===t&&"public"===e.type)throw new TypeError(`${S.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);if(e.algorithm&&"verify"===t&&"private"===e.type)throw new TypeError(`${S.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);if(e.algorithm&&"encrypt"===t&&"private"===e.type)throw new TypeError(`${S.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`)})(t,r)})(e,r,"encrypt"),e){case"dir":u=r;break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":{if(!(e=>{if(!f(e))throw new TypeError(k(e,...S));return["P-256","P-384","P-521"].includes(e.algorithm.namedCurve)})(r))throw new p("ECDH-ES with the provided key is not allowed or not supported by your javascript runtime");const{apu:y,apv:g}=i;let{epk:m}=i;m||(m=await(async e=>{if(!f(e))throw new TypeError(k(e,...S));return(await w.subtle.generateKey({name:"ECDH",namedCurve:e.algorithm.namedCurve},!0,["deriveBits"])).privateKey})(r));const{x:A,y:E,crv:b,kty:v}=await async function(e){return(async e=>{if(e instanceof Uint8Array)return{kty:"oct",k:l(e)};if(!f(e))throw new TypeError(k(e,...S,"Uint8Array"));if(!e.extractable)throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");const{ext:t,key_ops:r,alg:a,use:n,...i}=await w.subtle.exportKey("jwk",e);return i})(e)}(m),C=await(async(e,t,r,n,i=new Uint8Array(0),o=new Uint8Array(0))=>{if(!f(e))throw new TypeError(k(e,...S));if(P(e,"ECDH-ES"),!f(t))throw new TypeError(k(t,...S));P(t,"ECDH-ES","deriveBits","deriveKey");const l=s(d(a.encode(r)),d(i),d(o),c(n));if(!t.usages.includes("deriveBits"))throw new TypeError('ECDH-ES private key "usages" must include "deriveBits"');const h=new Uint8Array(await w.subtle.deriveBits({name:"ECDH",public:e},t,Math.ceil(parseInt(t.algorithm.namedCurve.substr(-3),10)/8)<<3));return async function(e,t,r,a){const n=Math.ceil((r>>3)/32);let i;for(let r=1;r<=n;r++){const n=new Uint8Array(4+t.length+a.length);n.set(c(r)),n.set(t,4),n.set(a,4+t.length),i=i?s(i,await e("sha256",n)):await e("sha256",n)}return i=i.slice(0,r>>3),i}(W,h,n,l)})(r,m,"ECDH-ES"===e?t:e,"ECDH-ES"===e?O(t):parseInt(e.substr(-5,3),10),y,g);if(h={epk:{x:A,y:E,crv:b,kty:v}},y&&(h.apu=l(y)),g&&(h.apv=l(g)),"ECDH-ES"===e){u=C;break}u=n||U(t);const K=e.substr(-6);o=await _(K,C,u);break}case"RSA1_5":case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":u=n||U(t),o=await(async(e,t,r)=>{if(!f(t))throw new TypeError(k(t,...S));if(P(t,e,"encrypt","wrapKey"),((e,t)=>{if(e.startsWith("RS")||e.startsWith("PS")){const{modulusLength:r}=t.algorithm;if("number"!=typeof r||r<2048)throw new TypeError(`${e} requires key modulusLength to be 2048 bits or larger`)}})(e,t),t.usages.includes("encrypt"))return new Uint8Array(await w.subtle.encrypt(T(e),t,r));if(t.usages.includes("wrapKey")){const a=await w.subtle.importKey("raw",r,...C);return new Uint8Array(await w.subtle.wrapKey("raw",a,t,T(e)))}throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation')})(e,r,u);break;case"PBES2-HS256+A128KW":case"PBES2-HS384+A192KW":case"PBES2-HS512+A256KW":{u=n||U(t);const{p2c:c,p2s:d}=i;({encryptedKey:o,...h}=await(async(e,t,r,n=Math.floor(2049*Math.random())+2048,i=g(new Uint8Array(16)))=>{const o=await async function(e,t,r,n){!function(e){if(!(e instanceof Uint8Array)||e.length<8)throw new y("PBES2 Salt Input must be 8 or more octets")}(e);const i=function(e,t){return s(a.encode(e),new Uint8Array([0]),t)}(t,e),o=parseInt(t.substr(13,3),10),c={hash:`SHA-${t.substr(8,3)}`,iterations:r,name:"PBKDF2",salt:i},d={length:o,name:"AES-KW"},l=await function(e,t){if(e instanceof Uint8Array)return w.subtle.importKey("raw",e,"PBKDF2",!1,["deriveBits"]);if(f(e))return P(e,t,"deriveBits","deriveKey"),e;throw new TypeError(k(e,...S,"Uint8Array"))}(n,t);if(l.usages.includes("deriveBits"))return new Uint8Array(await w.subtle.deriveBits(c,l,o));if(l.usages.includes("deriveKey"))return w.subtle.deriveKey(c,l,d,!1,["wrapKey","unwrapKey"]);throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')}(i,e,n,t);return{encryptedKey:await _(e.substr(-6),o,r),p2c:n,p2s:l(i)}})(e,r,u,c,d));break}case"A128KW":case"A192KW":case"A256KW":u=n||U(t),o=await _(e,r,u);break;case"A128GCMKW":case"A192GCMKW":case"A256GCMKW":{u=n||U(t);const{iv:a}=i;({encryptedKey:o,...h}=await async function(e,t,r,a){const n=e.substr(0,7);a||(a=A(n));const{ciphertext:i,tag:s}=await R(n,r,t,a,new Uint8Array(0));return{encryptedKey:i,iv:l(a),tag:l(s)}}(e,r,u,a));break}default:throw new p('Invalid or unsupported "alg" (JWE Algorithm) header value')}return{cek:u,encryptedKey:o,parameters:h}},B=Symbol();class I{constructor(e){if(!(e instanceof Uint8Array))throw new TypeError("plaintext must be an instance of Uint8Array");this._plaintext=e}setKeyManagementParameters(e){if(this._keyManagementParameters)throw new TypeError("setKeyManagementParameters can only be called once");return this._keyManagementParameters=e,this}setProtectedHeader(e){if(this._protectedHeader)throw new TypeError("setProtectedHeader can only be called once");return this._protectedHeader=e,this}setSharedUnprotectedHeader(e){if(this._sharedUnprotectedHeader)throw new TypeError("setSharedUnprotectedHeader can only be called once");return this._sharedUnprotectedHeader=e,this}setUnprotectedHeader(e){if(this._unprotectedHeader)throw new TypeError("setUnprotectedHeader can only be called once");return this._unprotectedHeader=e,this}setAdditionalAuthenticatedData(e){return this._aad=e,this}setContentEncryptionKey(e){if(this._cek)throw new TypeError("setContentEncryptionKey can only be called once");return this._cek=e,this}setInitializationVector(e){if(this._iv)throw new TypeError("setInitializationVector can only be called once");return this._iv=e,this}async encrypt(e,t){if(!this._protectedHeader&&!this._unprotectedHeader&&!this._sharedUnprotectedHeader)throw new y("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");if(!((...e)=>{const t=e.filter(Boolean);if(0===t.length||1===t.length)return!0;let r;for(const e of t){const t=Object.keys(e);if(r&&0!==r.size)for(const e of t){if(r.has(e))return!1;r.add(e)}else r=new Set(t)}return!0})(this._protectedHeader,this._unprotectedHeader,this._sharedUnprotectedHeader))throw new y("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");const r={...this._protectedHeader,...this._unprotectedHeader,...this._sharedUnprotectedHeader};if(function(e,t,r,a,n){if(void 0!==n.crit&&void 0===a.crit)throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');if(!a||void 0===a.crit)return new Set;if(!Array.isArray(a.crit)||0===a.crit.length||a.crit.some((e=>"string"!=typeof e||0===e.length)))throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');let i;i=void 0!==r?new Map([...Object.entries(r),...t.entries()]):t;for(const t of a.crit){if(!i.has(t))throw new p(`Extension Header Parameter "${t}" is not recognized`);if(void 0===n[t])throw new e(`Extension Header Parameter "${t}" is missing`);if(i.get(t)&&void 0===a[t])throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`)}new Set(a.crit)}(y,new Map,null==t?void 0:t.crit,this._protectedHeader,r),void 0!==r.zip){if(!this._protectedHeader||!this._protectedHeader.zip)throw new y('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');if("DEF"!==r.zip)throw new p('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value')}const{alg:i,enc:o}=r;if("string"!=typeof i||!i)throw new y('JWE "alg" (Algorithm) Header Parameter missing or invalid');if("string"!=typeof o||!o)throw new y('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');let c,d,h,u,w,f,g;if("dir"===i){if(this._cek)throw new TypeError("setContentEncryptionKey cannot be called when using Direct Encryption")}else if("ECDH-ES"===i&&this._cek)throw new TypeError("setContentEncryptionKey cannot be called when using Direct Key Agreement");{let r;({cek:d,encryptedKey:c,parameters:r}=await D(i,o,e,this._cek,this._keyManagementParameters)),r&&(t&&B in t?this._unprotectedHeader?this._unprotectedHeader={...this._unprotectedHeader,...r}:this.setUnprotectedHeader(r):this._protectedHeader?this._protectedHeader={...this._protectedHeader,...r}:this.setProtectedHeader(r))}if(this._iv||(this._iv=A(o)),u=this._protectedHeader?a.encode(l(JSON.stringify(this._protectedHeader))):a.encode(""),this._aad?(w=l(this._aad),h=s(u,a.encode("."),a.encode(w))):h=u,"DEF"===r.zip){const e=await((null==t?void 0:t.deflateRaw)||v)(this._plaintext);({ciphertext:f,tag:g}=await R(o,e,d,this._iv,h))}else({ciphertext:f,tag:g}=await R(o,this._plaintext,d,this._iv,h));const m={ciphertext:l(f),iv:l(this._iv),tag:l(g)};return c&&(m.encrypted_key=l(c)),w&&(m.aad=w),this._protectedHeader&&(m.protected=n.decode(u)),this._sharedUnprotectedHeader&&(m.unprotected=this._sharedUnprotectedHeader),this._unprotectedHeader&&(m.header=this._unprotectedHeader),m}}class ${constructor(e){this._flattened=new I(e)}setContentEncryptionKey(e){return this._flattened.setContentEncryptionKey(e),this}setInitializationVector(e){return this._flattened.setInitializationVector(e),this}setProtectedHeader(e){return this._flattened.setProtectedHeader(e),this}setKeyManagementParameters(e){return this._flattened.setKeyManagementParameters(e),this}async encrypt(e,t){const r=await this._flattened.encrypt(e,t);return[r.protected,r.encrypted_key,r.iv,r.ciphertext,r.tag].join(".")}}async function J(e,t,r,a,n){let i={alg:e.alg,enc:"A256GCM",kid:e.kid,cty:r,cids:n};return null!=n||delete i.cids,await new $(a).setProtectedHeader(i).encrypt(t)}class x{static debug(e,t){e.dispatchEvent(new CustomEvent("debug",{detail:t}))}static valid(e,t){e.dispatchEvent(new CustomEvent("valid",{detail:t}))}static transmit(e,t){e.dispatchEvent(new CustomEvent("transmit",{detail:t}))}static request(e,t){e.dispatchEvent(new CustomEvent("request",{detail:t}))}}class G{constructor(e,t,r){var a;this.jwes={},this.loading=!1,this.form=e,this.id=null!==(a=null!=t?t:e.dataset.syfrId)&&void 0!==a?a:"",this.idCheck()&&this.linkCheck(r)&&this.autoSubmit()}idCheck(){return void 0!==this.id||(x.debug(this.form,{form:this.form,message:"Ignoring; no data-syfr-id attribute"}),!1)}linkCheck(e){let t=`https://syfr.app/validate/${this.id}`,r=null!=e?e:this.form.querySelector("[data-syfr-validate]"),a=Object.assign(Object.assign(Object.assign(Object.assign({},!r&&{linkMissing:{got:r,want:"<a data-syfr-validate ..."}}),!(r instanceof HTMLAnchorElement)&&{linkHref:{got:r,want:`<a href='${t}' ...`}}),!this.form.contains(r)&&{linkWithinForm:{got:!1,want:!0}}),!this.id.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)&&{syfrId:{got:this.id,want:"a valid uuid from Syfr"}});if(Object.keys(a).length<1&&r instanceof HTMLAnchorElement){let e=getComputedStyle(r),n=parseFloat,i=n(e.paddingLeft)+n(e.paddingRight),s=n(e.paddingTop)+n(e.paddingBottom),o=n(e.borderLeftWidth)+n(e.borderRightWidth),c=n(e.borderTopWidth)+n(e.borderBottomWidth),d=(r.offsetHeight-i-o)*(r.offsetWidth-s-c),l=n(e.fontSize);a=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},a),null===r.offsetParent&&{validationLinkIsHidden:{got:!0,want:!1}}),r.href!=t&&{validationLinkHref:{got_:r.href,want:t}}),r.relList.contains("nofollow")&&{validationLinkIsNofollow:{got:!0,want:!1}}),r.relList.contains("noreferrer")&&{validationLinkIsNoreferrer:{got:!0,want:!1}}),d<1536&&{validationLinkArea:{got:d,want:1536}}),l<8&&{validationLinkFontSizePx:{got:l,want:"8px+"}})}if(Object.keys(a).length>0)throw{form:this.form,link:r,issues:a,error:"We can't protect your form because of the issues listed",seeDocs:"https://syfr.app/docs/validation"};return!0}async getJwk(){if(this.pubJwk)return this.pubJwk;try{return await async function(e){let t=await fetch("https://develop-api.syfr.app/rest/pub/form/"+e,{method:"GET",mode:"no-cors"});return(await t.json()).publicJwk}(this.id)}catch(e){throw{syfrId:this.id,error:"Bad data-syfr-id or couldn't get pubKey"}}}async getKey(){if(this.pubKey)return this.pubKey;let e=await this.getJwk();return this.pubKey=await async function(e){return await async function(e,t,r){if(!function(e){if("object"!=typeof(t=e)||null===t||"[object Object]"!==Object.prototype.toString.call(e))return!1;var t;if(null===Object.getPrototypeOf(e))return!0;let r=e;for(;null!==Object.getPrototypeOf(r);)r=Object.getPrototypeOf(r);return Object.getPrototypeOf(e)===r}(e))throw new TypeError("JWK must be an object");if(t||(t=e.alg),"string"!=typeof t||!t)throw new TypeError('"alg" argument is required when "jwk.alg" is not present');switch(e.kty){case"oct":if("string"!=typeof e.k||!e.k)throw new TypeError('missing "k" (Key Value) Parameter value');return null!=r||(r=!0!==e.ext),r?M({...e,alg:t,ext:!1}):h(e.k);case"RSA":if(void 0!==e.oth)throw new p('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');case"EC":case"OKP":return M({...e,alg:t});default:throw new p('Unsupported "kty" (Key Type) Parameter value')}}(e,e.alg)}(e),x.valid(this.form,{id:this.id,validateUrl:`https://syfr.app/validate/${this.id}`}),x.debug(this.form,{id:this.id,formPubKey:this.pubKey,message:"use addEventListener('protected',(event)=>{...} to notify your users of the protection"}),this.pubKey}autoSubmit(){x.debug(this.form,{message:"Initializing SyfrClass",syfrId:this.id,form:this.form}),this.getKey(),this.form.addEventListener("submit",(async e=>{e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),this.loading?x.debug(this.form,"Ignored duplicate submission."):(this.loading=!0,await this.submit(),this.form.reset(),this.jwes={},this.loading=!1)}))}async submit(){this.pubKey||await this.getKey(),await this.buildEntry(),await this.sendToSyfr()}async buildEntry(){let e=this.getCode(),t=await this.getData();await this.buildRootJwe({code:e,data:t})}getCode(){return(new XMLSerializer).serializeToString(this.form).replace(/\s{2,}/g," ")}async getData(){let e=new FormData(this.form),t={};for(let r of e.keys()){if(r in t)continue;let a=e.getAll(r),n=await this.getParsedFieldArr(a);t[r]=a.length>1?n:n[0]}return t}async buildRootJwe(e){const t=await this.getJwk(),r=await this.getKey(),a=(new TextEncoder).encode(JSON.stringify(e)),n=await J(t,r,"application/json",a,Object.keys(this.jwes));this.jwes[this.jweToCid(n)]=n}async getParsedFieldArr(e){let t=[];for(let r of e)t.push(await this.getParsedField(r));return t}async getParsedField(e){return e instanceof File?await this.processFile(e):e}async processFile(e){const t=await this.getJwk(),r=await this.getKey();if(e.size>0){let a=await J(t,r,e.type,await this.fileToUint8(e));return this.jwes[this.jweToCid(a)]=a,this.fileToMeta(e,a)}}async fileToUint8(e){let t=await e.arrayBuffer();return new Uint8Array(t)}fileToMeta(e,t){let{name:r,lastModified:a,type:n}=e;return{name:r,lastModified:a,type:n,cids:[this.jweToCid(t)]}}jweToCid(e){let t=e.split(".")[4];if(!t)throw"Provided JWE was invalid";return t}async sendToSyfr(){let e=new FormData;Object.values(this.jwes).forEach((t=>{e.append("compactJwe",t)})),x.transmit(this.form,{jwes:this.jwes,payload:e}),x.debug(this.form,{message:"Sending to Syfr:",jwes:this.jwes,payload:e}),await async function(e,t){let r=new XMLHttpRequest;t.dispatchEvent(new CustomEvent("request",{detail:r})),r.open("POST","https://develop-api.syfr.app/rest/pub/entry"),r.send(e)}(e,this.form)}}},769:(e,t,r)=>{r.d(t,{SyfrForm:()=>n});var a=r(32);function n({id:e,Form:t}){return new a.SyfrClass(t,e),t}}},t={};function r(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,r),i.exports}r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};(()=>{r.r(a),r.d(a,{SyfrClass:()=>e.SyfrClass,SyfrForm:()=>t.SyfrForm});var e=r(32),t=r(769)})(),Syfr=a})();
//# sourceMappingURL=main.js.map