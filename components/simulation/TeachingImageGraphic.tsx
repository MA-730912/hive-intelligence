"use client";
import type {PocusCase} from "@/lib/simulation/pocus-library";
import type {ImagingTeachingCase} from "@/lib/simulation/imaging-library";

export function PocusGraphic({caseItem}:{caseItem:PocusCase}){
  const id=caseItem.id;
  return <svg viewBox="0 0 420 260" style={{width:"100%",background:"#020504",borderRadius:14,border:"1px solid #1f3b33"}}>
    <rect x="0" y="0" width="420" height="260" fill="#020504"/>
    <path d="M25 24 Q210 -10 395 24 L350 235 Q210 270 70 235 Z" fill="#09110f" stroke="#334740" strokeWidth="2"/>
    {id==="fast-positive"&&<>
      <ellipse cx="205" cy="128" rx="96" ry="52" fill="#444"/>
      <ellipse cx="295" cy="136" rx="56" ry="42" fill="#777"/>
      <path d="M255 128 Q285 143 316 124 Q292 161 254 153 Z" fill="#050505" stroke="#8ce0c0"/>
    </>}
    {id==="tamponade"&&<>
      <ellipse cx="210" cy="132" rx="100" ry="72" fill="#050505" stroke="#9cf2c0" strokeWidth="8"/>
      <ellipse cx="210" cy="132" rx="72" ry="48" fill="#5b5b5b"/>
      <ellipse cx="185" cy="128" rx="25" ry="31" fill="#777"/>
      <ellipse cx="240" cy="126" rx="20" ry="25" fill="#777"/>
      <path d="M236 112 Q254 126 238 146" stroke="#f0c987" strokeWidth="4" fill="none"/>
    </>}
    {id==="cholecystitis"&&<>
      <ellipse cx="215" cy="135" rx="72" ry="42" fill="#050505" stroke="#c8d2ce" strokeWidth="8"/>
      <circle cx="245" cy="138" r="17" fill="#d7d7d7"/>
      <path d="M245 155 L270 205 L220 205 Z" fill="#151515"/>
      <path d="M140 188 Q210 205 286 187" stroke="#52b98b" strokeWidth="4" fill="none"/>
    </>}
    {id==="pneumothorax"&&<>
      <line x1="95" y1="72" x2="330" y2="72" stroke="#aaa" strokeWidth="6"/>
      <line x1="110" y1="92" x2="315" y2="92" stroke="#777" strokeWidth="3"/>
      <line x1="110" y1="110" x2="315" y2="110" stroke="#777" strokeWidth="3"/>
      <text x="155" y="170" fill="#f0c987" fontSize="18">No lung sliding</text>
    </>}
    {id==="pulmonary-oedema"&&Array.from({length:7}).map((_,i)=><line key={i} x1={90+i*38} y1="74" x2={60+i*48} y2="230" stroke="#9cf2c0" strokeWidth="4" opacity=".7"/>)}
    {id==="rv-strain"&&<>
      <ellipse cx="165" cy="135" rx="62" ry="52" fill="#666"/>
      <ellipse cx="255" cy="135" rx="40" ry="48" fill="#777"/>
      <line x1="214" y1="86" x2="214" y2="184" stroke="#f0c987" strokeWidth="4"/>
      <text x="128" y="215" fill="#9cf2c0" fontSize="17">Dilated RV</text>
    </>}
    {id==="aaa"&&<>
      <ellipse cx="210" cy="138" rx="76" ry="62" fill="#111" stroke="#aaa" strokeWidth="7"/>
      <ellipse cx="210" cy="138" rx="46" ry="34" fill="#060606"/>
      <text x="170" y="218" fill="#f0c987" fontSize="18">&gt;5 cm</text>
    </>}
    {id==="hydronephrosis"&&<>
      <ellipse cx="210" cy="135" rx="92" ry="58" fill="#666"/>
      <path d="M210 95 C188 112 188 126 210 135 C188 145 188 160 210 177 C232 158 232 145 210 135 C232 124 232 110 210 95Z" fill="#050505" stroke="#9cf2c0" strokeWidth="3"/>
    </>}
    <text x="18" y="245" fill="#9cf2c0" fontSize="13">{caseItem.view}</text>
  </svg>
}

export function ImagingGraphic({caseItem}:{caseItem:ImagingTeachingCase}){
  const id=caseItem.id;
  const isCt=caseItem.modality==="CT";
  return <svg viewBox="0 0 420 260" style={{width:"100%",background:"#030403",borderRadius:14,border:"1px solid #1f3b33"}}>
    <rect width="420" height="260" fill="#030403"/>
    {isCt?<>
      <ellipse cx="210" cy="130" rx="115" ry="100" fill="#d7d7d7"/>
      <ellipse cx="210" cy="130" rx="97" ry="84" fill="#767676"/>
      <path d="M210 70 C190 90 190 112 210 127 C230 112 230 90 210 70Z" fill="#b9b9b9"/>
      {id==="ct-head-sah"&&<path d="M165 120 Q210 95 255 120 Q237 135 210 132 Q183 135 165 120Z" fill="#eee"/>}
      {id==="ct-head-subdural"&&<path d="M105 85 Q132 40 190 35 Q150 75 142 135 Q130 185 105 175 Q80 130 105 85Z" fill="#f4f4f4"/>}
      {id==="ct-head-ich"&&<ellipse cx="170" cy="132" rx="31" ry="24" fill="#f5f5f5"/>}
      {id==="ct-head-large-mca"&&<path d="M105 92 Q135 55 190 45 L190 210 Q135 200 105 165 Q85 125 105 92Z" fill="#555" opacity=".78"/>}
      {id==="ctpa-pe"&&<>
        <circle cx="180" cy="125" r="38" fill="#555"/><circle cx="240" cy="125" r="38" fill="#555"/>
        <path d="M210 90 L210 155 M210 110 L170 130 M210 110 L250 130" stroke="#eee" strokeWidth="12"/>
        <circle cx="185" cy="127" r="9" fill="#222"/>
      </>}
      {id==="ct-abdo-free-air"&&<>
        <ellipse cx="210" cy="135" rx="80" ry="62" fill="#555"/>
        <ellipse cx="160" cy="86" rx="30" ry="10" fill="#050505"/>
        <ellipse cx="265" cy="90" rx="24" ry="9" fill="#050505"/>
      </>}
    </>:<>
      <rect x="80" y="24" width="260" height="210" rx="55" fill="#d8d8d8"/>
      <ellipse cx="155" cy="132" rx="62" ry="90" fill="#151515"/>
      <ellipse cx="265" cy="132" rx="62" ry="90" fill="#151515"/>
      <rect x="202" y="40" width="16" height="158" fill="#b8b8b8"/>
      {id==="cxr-pneumothorax"&&<path d="M300 65 Q325 125 302 200" stroke="#efefef" strokeWidth="4" fill="none"/>}
      {id==="cxr-pulmonary-oedema"&&<>
        <ellipse cx="175" cy="135" rx="50" ry="45" fill="#aaa" opacity=".72"/>
        <ellipse cx="245" cy="135" rx="50" ry="45" fill="#aaa" opacity=".72"/>
      </>}
      {id==="cxr-lobar-pneumonia"&&<path d="M235 155 Q300 145 310 205 Q260 220 230 195 Z" fill="#aaa" opacity=".85"/>}
      {id==="pelvis-open-book"&&<>
        <path d="M120 95 Q170 70 195 118 L180 185 Q145 178 112 150Z" fill="none" stroke="#eee" strokeWidth="8"/>
        <path d="M300 95 Q250 70 225 118 L240 185 Q275 178 308 150Z" fill="none" stroke="#eee" strokeWidth="8"/>
        <line x1="192" y1="175" x2="228" y2="175" stroke="#f0c987" strokeWidth="8"/>
      </>}
    </>}
    <text x="15" y="244" fill="#9cf2c0" fontSize="13">{caseItem.modality} · {caseItem.bodyRegion}</text>
  </svg>
}
