const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/jspdf.es.min-pTAM_Wjg.js","assets/rolldown-runtime-hePW80VL.js","assets/preload-helper-DodQ6xAU.js"])))=>i.map(i=>d[i]);
import{R as e,et as t,st as n}from"./utils-BzFV9HHo.js";import{t as r}from"./preload-helper-DodQ6xAU.js";import{n as i,t as a}from"./print-sheet-CJe63M7a.js";var o=[{id:`all`,label:`All`},{id:`open`,label:`Open`},{id:`solved`,label:`Solved`}];function s(e){return t.find(t=>t.id===e)?.label??e}function c(e,t){let r=e.filter(e=>!n(e));return t===`open`?r.filter(e=>e.level!==`green`):t===`solved`?r.filter(e=>e.level===`green`):r}function l(e,t){return[...e].sort((e,t)=>{let n=Number(e.roomNo),r=Number(t.roomNo);return Number.isFinite(n)&&Number.isFinite(r)&&n!==r?n-r:e.roomNo===t.roomNo?(e.createdAt||``).localeCompare(t.createdAt||``):e.roomNo.localeCompare(t.roomNo,void 0,{numeric:!0})})}function u(e){return e===`open`?`Open complaints`:e===`solved`?`Solved complaints`:`Complaint list`}function d(e,t){let n=l(e,t);return`<table>
    <thead><tr>
      <th>Room</th><th>Problem</th><th>Status</th><th>By</th><th>Date</th>
    </tr></thead>
    <tbody>
      ${n.length?n.map(e=>`<tr>
        <td>${a(e.roomNo)}</td>
        <td>${a(e.note||`—`)}</td>
        <td>${a(s(e.level))}</td>
        <td>${a(e.by||`—`)}</td>
        <td>${a(e.createdAt||``)}</td>
      </tr>`).join(``):`<tr><td colspan="5">No complaints</td></tr>`}
    </tbody>
    <tfoot><tr>
      <td colspan="4">Total</td>
      <td class="num">${n.length}</td>
    </tr></tfoot>
  </table>`}function f(e){let t=u(e.kind);i({title:t,heading:e.hotel,blessing:`Shree Kateel Shree Durga Parameshwari Amma`,sub:t,table:d(e.rows,e.rooms)})}async function p(t){let{jsPDF:n}=await r(async()=>{let{jsPDF:e}=await import(`./jspdf.es.min-pTAM_Wjg.js`);return{jsPDF:e}},__vite__mapDeps([0,1,2])),i=new n({unit:`mm`,format:`a4`,orientation:`portrait`}),a=l(t.rows,t.rooms),o=u(t.kind),c=await e(i,{x:12,y:8,w:186,h:18,hotel:t.hotel,blessing:`Shree Kateel Shree Durga Parameshwari Amma`,right:o}),d=[{x:12,w:18,key:`room`},{x:30,w:78,key:`note`},{x:108,w:28,key:`status`},{x:136,w:32,key:`by`},{x:168,w:26,key:`date`}],f=c+6;function p(){i.setFont(`times`,`bold`),i.setFontSize(9),i.setDrawColor(180),i.line(12,f,198,f),f+=5,i.text(`Room`,d[0].x,f),i.text(`Problem`,d[1].x,f),i.text(`Status`,d[2].x,f),i.text(`By`,d[3].x,f),i.text(`Date`,d[4].x,f),f+=2,i.line(12,f,198,f),f+=5,i.setFont(`times`,`normal`),i.setFontSize(10)}p(),a.length||i.text(`No complaints`,12,f);for(let e of a){let t=i.splitTextToSize(e.note||`—`,d[1].w-2),n=Math.max(6,t.length*5);f+n>287&&(i.addPage(),f=18,p()),i.text(e.roomNo,d[0].x,f),i.text(t,d[1].x,f),i.text(s(e.level),d[2].x,f),i.text(e.by||`—`,d[3].x,f),i.text(e.createdAt||``,d[4].x,f),f+=n}return f+=2,f>287&&(i.addPage(),f=18),i.setFont(`times`,`bold`),i.line(12,f,198,f),f+=6,i.text(`Total  ${a.length}`,12,f),i.output(`blob`)}function m(e,t){let n=document.createElement(`a`);n.href=URL.createObjectURL(e),n.download=`${u(t).toLowerCase().replace(/\s+/g,`-`)}.pdf`,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),2e3)}export{c as a,m as i,p as n,f as o,s as r,l as s,o as t};