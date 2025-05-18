import{r as l}from"./chunk-D4RADZKF-DAz_vGcL.js";import{L as u,l as i,j as p}from"./button-BHijcmC7.js";const S=(o,n)=>{const e=l.useContext(u),r=l.useMemo(()=>{var t;const s=n||i[o],d=(t=e==null?void 0:e[o])!==null&&t!==void 0?t:{};return Object.assign(Object.assign({},typeof s=="function"?s():s),d||{})},[o,n,e]),a=l.useMemo(()=>{const t=e==null?void 0:e.locale;return e!=null&&e.exist&&!t?i.locale:t},[e]);return[r,a]};var m=`accept acceptCharset accessKey action allowFullScreen allowTransparency
    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked classID className colSpan cols content contentEditable contextMenu
    controls coords crossOrigin data dateTime default defer dir disabled download draggable
    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload radioGroup readOnly rel required
    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
    summary tabIndex target title type useMap value width wmode wrap`,g=`onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown
    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick
    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown
    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel
    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough
    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata
    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError`,h="".concat(m," ").concat(g).split(/[\s\n]+/),f="aria-",v="data-";function c(o,n){return o.indexOf(n)===0}function M(o){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e;n===!1?e={aria:!0,data:!0,attr:!0}:n===!0?e={aria:!0}:e=p({},n);var r={};return Object.keys(o).forEach(function(a){(e.aria&&(a==="role"||c(a,f))||e.data&&c(a,v)||e.attr&&h.includes(a))&&(r[a]=o[a])}),r}export{M as p,S as u};
