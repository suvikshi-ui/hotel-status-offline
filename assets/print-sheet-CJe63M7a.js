import{L as e,z as t}from"./utils-BzFV9HHo.js";function n(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function r(e,t,n=!1){let r=document.createElement(`iframe`);r.title=e,r.setAttribute(`aria-hidden`,`true`),r.style.cssText=`position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0`,document.body.appendChild(r);let i=r.contentDocument,a=r.contentWindow;if(!i||!a){r.remove(),window.print();return}i.open(),i.write(t),i.close();let o=()=>{try{a.focus(),a.print()}catch{window.print()}setTimeout(()=>r.remove(),2e3)},s=()=>{n&&i.fonts?.ready?i.fonts.ready.then(()=>setTimeout(o,80)).catch(()=>setTimeout(o,80)):setTimeout(o,50)};i.readyState===`complete`?s():r.onload=s}function i({title:i,heading:a,sub:s,blessing:c,table:l}){r(i,`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${n(i)}</title>
  <link rel="stylesheet" href="${o}" />
  <style>
    @page { size: A4; margin: 12mm; }
    body { margin: 0; color: #1c1915; font: 13px/1.45 Georgia, "Times New Roman", serif; }
    ${e}
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 7px 8px; border-bottom: 1px solid #ddd4c2; text-align: left; }
    th { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #6f675c; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    tfoot td { font-weight: 700; border-top: 2px solid #1c1915; }
  </style>
</head>
<body>
  ${t({hotel:a,blessing:c,right:s})}
  ${l}
</body>
</html>`,!0)}var a={width:794,height:1123,marginMm:8},o=`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap`,s=`@page { size: A4 portrait; margin: 8mm; background: #fff; }
html, body {
  margin: 0;
  background: #fff !important;
  width: ${a.width}px;
  height: ${a.height}px;
}
* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
.a4-page {
  width: ${a.width}px;
  height: ${a.height}px;
  padding: 8mm;
  background: #fff;
  box-sizing: border-box;
}
.daily-a4 {
  background: #fff !important;
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  border-radius: 16px;
}
.daily-a4-head { background: #1b332a !important; color: #f4efe4 !important; }
.day-chart { background: #f7f1e6 !important; }`;function c(e,t){return`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${n(e)}</title>
  <link rel="stylesheet" href="${o}" />
  <style>${s}</style>
</head>
<body><div class="a4-page">${t}</div></body>
</html>`}function l(e,t){r(e,c(e,t),!0)}export{i as n,l as r,n as t};