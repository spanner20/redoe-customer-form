import { useState, useEffect, useCallback } from "react";

// ─── Data Constants ───────────────────────────────────────────────────────────
const STEEL_TYPES = [
  "Aluminum M1","Aluminum 5080R","Aluminum 6061-T6","AMPCO-18","CRS",
  "CPM-V 46-48 Rc","DME 1040 STEEL","DME#1 STEEL","DME#2 STEEL",
  "H-13 VAR 46-48 Rc","H-13 46-48 Rc","H-13 46-48 Rc ION NIT","H-13 44 Rc",
  "H-13 50-52 Rc","H-13 VAR 50-52 Rc","H-13 52-54 Rc","H-13 51-53 Rc ION NIT",
  "MOLDSTAR-90","MOLDMAX XL","P-20 28-32 Rc ION NIT","P-20 HH 34-38 Rc",
  "P-20 HH 34-38 Rc ION NIT","P-20 MLQ 34-38 Rc","P-20 MLQ 34-38 Rc ION NIT",
  "P-20 MLQ-Xtra 38-40 Rc","P-20 MLQ-Xtra 38-40 Rc ION NIT",
  "P-20 MLQ-Xtra 40 39-43 Rc","P-20 MLQ-Xtra 40 39-43 Rc ION NIT",
  "P-20 LONG RUN 38-42 Rc","15-5 PH Mar-X 38-42 Rc",
  "15-5 PH Mar-X 38-42 Rc ION NIT","420 SS 48-52 RC","420 SS 50-52 RC",
  "420 SS RAMAX HH 36RC","1020","4140 28-32 Rc",
];
const FINISH_OPTIONS = [
  "A1 Finish","A2 Finish","320 Emery","400 Emery",
  "1000 Emery","Diamond Buff","Cutter Marks",
];
const TEAM_CONTACTS = [
  {name:"Allredoe",email:"allredoe@redoemold.com"},
  {name:"B. Schipper",email:"BSchipper@redoemold.com"},
  {name:"B. Stead",email:"BStead@redoemold.com"},
  {name:"C. Nadeau",email:"CNadeau@redoemold.com"},
  {name:"D. Martino",email:"DMARTINO@redoemold.com"},
  {name:"D. Light",email:"DLight@redoemold.com"},
  {name:"D. Patterson",email:"dpatterson@redoemold.com"},
  {name:"G. Wood",email:"GWOOD@redoemold.com"},
  {name:"J. Depatie",email:"JDepatie@redoemold.com"},
  {name:"J. Hotts",email:"JHotts@redoemold.com"},
  {name:"J. Laidlaw",email:"jlaidlaw@redoemold.com"},
  {name:"J. Renaud",email:"Jrenaud@redoemold.com"},
  {name:"K. Cameron",email:"KCameron@redoemold.com"},
  {name:"M. Burns",email:"MBurns@redoemold.com"},
  {name:"M. Ricciotti",email:"MRicciotti@redoemold.com"},
  {name:"N. Dicredico",email:"NDicredico@redoemold.com"},
  {name:"P. Crumb",email:"PCrumb@redoemold.com"},
  {name:"P. Reaume",email:"PReaume@redoemold.com"},
  {name:"P. Stratil",email:"PStratil@redoemold.com"},
  {name:"R. Hotts",email:"RHotts@redoemold.com"},
  {name:"S. Wu",email:"swu@redoemold.com"},
  {name:"T. Maslovich",email:"TMaslovich@redoemold.com"},
  {name:"T. Rodrigues",email:"TRodrigues@redoemold.com"},
];
const APPROVAL_ITEMS = [
  "Tool Design Layout","Core Steel Type & Size","Cavity Steel Type & Size",
  "Holder Block","Slides / Lifters","Runner System & Gate Location",
  "Ejection Method","Cooling Layout","Hot Runner Specification",
  "Mold Finish / Grain","Moldflow Analysis",
];
const INFO_PROVIDED_ITEMS = [
  "3D Part Data","2D Drawing / GD&T","Material Specification",
  "Colour Chip / Standard","Grain / Texture Specification",
  "Shrinkage Rate Confirmed","Runner / Gate Preference",
  "Press Information","QMC / Plate Requirements",
  "Standards Book / Revision","Customer Mold Standards",
  "Hot Runner Preference","Moldflow Results",
  "Assembly / Adjacency Data","Insert / Over-mold Details",
];
const INITIAL_FORM = {
  jobId:"",pm:"",revNum:"",programPart:"",customerName:"",contact:"",
  quoteNum:"",standardsRevLevel:"",partNum:"",modelYear:"",
  startDate:"",weeksToT1:"",numCavities:"",toolBuildUnits:"",
  productionQty:"",cavitySteelSize:"",coreSteelSize:"",
  lifters:"",slides:"",hookSlides:"",retractors:"",inserts:"",
  machineTypeTonnage:"",pressPlantLocation:"",qmcPlateDesign:"",
  tryoutPressLocationSize:"",runnerRoundTrapezoid:"",manifoldSupplierSpares:"",
  sphericalRadiusOrifice:"",gateSizeLocation:"",ejectionType:"",
  hydraulics:"No",hydraulicsNote:"",materialColour:"",materialType:"",
  materialShrink:"",specialMoldNum:"",toolToRun:"Automatic",toolRunNote:"",
  moldFinishGrain:"",moldflowReqd:"No",moldflowCoolingWarp:"No",
  moldflowSource:"",gmE8Standards:"No",coreFinish:"",cavityFinish:"",
  coreGrain:"",cavityGrain:"",maxRadiusAllowed:"",opticSurfaceFinish:"",
  approvedCoreSteel:"",approvedCoreSteelSize:"",approvedCavitySteel:"",
  approvedCavitySteelSize:"",approvedHolderBlock:"",approvedHolderBlockSize:"",
  mainInserts:"",mainInsertsNum:"",constSlides:"",constSlidesNum:"",
  constInserts:"",constInsertsNum:"",constRetractors:"",constRetractorsNum:"",
  travellingLifters:"",travellingLiftersNum:"",straightLifters:"",straightLiftersNum:"",
  constShrink:"",constNotes:"",
};

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#0B0E13",surface:"#12161D",surfaceAlt:"#181D26",
  surfaceRaised:"#1E2430",border:"#252C3A",borderHover:"#374052",
  accent:"#F0881E",accentDim:"rgba(240,136,30,0.10)",accentGlow:"rgba(240,136,30,0.20)",
  green:"#34D399",greenDim:"rgba(52,211,153,0.10)",
  red:"#F87171",redDim:"rgba(248,113,113,0.10)",
  blue:"#60A5FA",blueDim:"rgba(96,165,250,0.10)",
  yellow:"#FBBF24",yellowDim:"rgba(251,191,36,0.10)",
  txt:"#E8ECF2",txt2:"#8B95A8",txt3:"#5A6478",
};
const FONT = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = () => new Date();
const fmtDate = (d) => d.toISOString().split("T")[0];
const fmtTime = (d) => d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const fmtDateTime = (d) => `${fmtDate(d)} ${fmtTime(d)}`;
const uid = () => Math.random().toString(36).slice(2,9);

// Demo job data for copy-from feature
const DEMO_JOBS = {
  "2448": {
    jobId:"2448",pm:"K. Cameron",revNum:"2",programPart:"GM T1XX - Rear Bumper Fascia",
    customerName:"General Motors",contact:"J. Smith",quoteNum:"Q-2448-A",
    standardsRevLevel:"Rev D",partNum:"84793241",modelYear:"2026",
    numCavities:"1",toolBuildUnits:"METRIC",productionQty:"500000",
    cavitySteelSize:"P-20 HH 34-38 Rc / 24x30x18",coreSteelSize:"H-13 46-48 Rc / 24x30x16",
    lifters:"4 straight lifters",slides:"2 slides - driver & passenger",
    hookSlides:"1 hook slide - lower tab",retractors:"None",inserts:"2 cavity inserts",
    machineTypeTonnage:"3000T Horizontal",pressPlantLocation:"Oshawa Assembly #2",
    hydraulics:"Yes",hydraulicsNote:"2 hydraulic cores for slide actuation",
    materialType:"PP+EPDM-T20",materialShrink:"0.008 in/in",materialColour:"Black",
    gmE8Standards:"Yes",coreFinish:"320 Emery",cavityFinish:"A2 Finish",
  },
  "2451": {
    jobId:"2451",pm:"B. Stead",revNum:"0",programPart:"Stellantis WL - Door Panel Insert",
    customerName:"Stellantis",contact:"M. Dupont",quoteNum:"Q-2451-B",
    standardsRevLevel:"Rev A",partNum:"68421930AA",modelYear:"2027",
    numCavities:"2",toolBuildUnits:"METRIC",productionQty:"250000",
    coreSteelSize:"P-20 MLQ 34-38 Rc / 18x22x14",cavitySteelSize:"P-20 MLQ 34-38 Rc / 18x22x12",
    lifters:"6 lifters",slides:"3 slides",materialType:"ABS+PC",materialShrink:"0.005",
    materialColour:"Interior Grey",toolToRun:"Automatic",
  }
};

// ─── Reusable Components ──────────────────────────────────────────────────────
function FieldInput({label,value,onChange,placeholder,width,type="text",disabled,error,mono}) {
  const [focused,setFocused] = useState(false);
  return (
    <div style={{flex:width||1,minWidth:0}}>
      {label&&<label style={{display:"block",fontSize:10.5,fontWeight:600,color:C.txt2,marginBottom:4,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:FONT}}>{label}</label>}
      <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} disabled={disabled}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:"100%",boxSizing:"border-box",padding:"8px 10px",
          background:disabled?C.bg:C.surfaceAlt,
          border:`1px solid ${error?C.red:focused?C.accent:C.border}`,
          borderRadius:6,color:C.txt,fontSize:13,
          fontFamily:mono?MONO:FONT,
          outline:"none",transition:"border-color 0.2s, box-shadow 0.2s",
          boxShadow:focused?`0 0 0 2px ${error?"rgba(248,113,113,0.15)":C.accentDim}`:"none",
        }}
      />
      {error&&<div style={{fontSize:10,color:C.red,marginTop:2,fontFamily:FONT}}>{error}</div>}
    </div>
  );
}

function FieldSelect({label,value,onChange,options,width,allowCustom}) {
  const [custom,setCustom] = useState(false);
  const [focused,setFocused] = useState(false);
  return (
    <div style={{flex:width||1,minWidth:0}}>
      {label&&<label style={{display:"block",fontSize:10.5,fontWeight:600,color:C.txt2,marginBottom:4,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:FONT}}>{label}</label>}
      {custom?(
        <div style={{display:"flex",gap:4}}>
          <input value={value||""} onChange={e=>onChange(e.target.value)}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={{flex:1,padding:"8px 10px",background:C.surfaceAlt,border:`1px solid ${focused?C.accent:C.border}`,borderRadius:6,color:C.txt,fontSize:13,fontFamily:FONT,outline:"none",boxShadow:focused?`0 0 0 2px ${C.accentDim}`:"none",transition:"all 0.2s"}}
          />
          <button onClick={()=>setCustom(false)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt2,cursor:"pointer",padding:"0 8px",fontSize:11}} title="Switch to dropdown">▼</button>
        </div>
      ):(
        <div style={{display:"flex",gap:4}}>
          <select value={value||""} onChange={e=>onChange(e.target.value)}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={{
              flex:1,padding:"8px 10px",background:C.surfaceAlt,
              border:`1px solid ${focused?C.accent:C.border}`,borderRadius:6,
              color:C.txt,fontSize:13,fontFamily:FONT,outline:"none",
              appearance:"none",transition:"all 0.2s",
              boxShadow:focused?`0 0 0 2px ${C.accentDim}`:"none",
              backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%238B95A8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",paddingRight:28,
            }}
          >
            <option value="">Select...</option>
            {options.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          {allowCustom&&<button onClick={()=>setCustom(true)} style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt2,cursor:"pointer",padding:"0 8px",fontSize:11}} title="Type custom value">✎</button>}
        </div>
      )}
    </div>
  );
}

function Section({icon,title,subtitle,badge,children,defaultOpen=true}) {
  const [open,setOpen] = useState(defaultOpen);
  return (
    <div style={{marginBottom:4}}>
      <div onClick={()=>setOpen(!open)} style={{
        display:"flex",alignItems:"center",gap:10,marginTop:24,marginBottom:open?14:8,
        paddingBottom:10,borderBottom:`1px solid ${C.border}`,cursor:"pointer",userSelect:"none",
      }}>
        <div style={{width:28,height:28,borderRadius:6,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:C.txt,fontFamily:FONT}}>{title}</div>
          {subtitle&&<div style={{fontSize:11,color:C.txt3,marginTop:1,fontFamily:FONT}}>{subtitle}</div>}
        </div>
        {badge&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:badge.bg,color:badge.color,fontFamily:FONT,letterSpacing:"0.05em",textTransform:"uppercase"}}>{badge.text}</span>}
        <div style={{fontSize:10,color:C.txt3,transform:open?"rotate(0)":"rotate(-90deg)",transition:"transform 0.2s"}}>▼</div>
      </div>
      {open&&children}
    </div>
  );
}

function Row({children,gap=12}) {
  return <div style={{display:"flex",gap,marginBottom:10,flexWrap:"wrap"}}>{children}</div>;
}

function Tab({active,onClick,children,count}) {
  return (
    <button onClick={onClick} style={{
      padding:"8px 16px",fontSize:13,fontWeight:active?700:500,fontFamily:FONT,
      background:active?C.accentDim:"transparent",
      color:active?C.accent:C.txt2,
      border:`1px solid ${active?C.accent+"44":"transparent"}`,
      borderRadius:8,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6,
    }}>
      {children}
      {count!==undefined&&<span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10,background:active?C.accent:C.border,color:active?"#000":C.txt3}}>{count}</span>}
    </button>
  );
}

function Pill({status}) {
  const m={approved:{bg:C.greenDim,color:C.green,t:"Approved"},pending:{bg:C.blueDim,color:C.blue,t:"Pending"},rejected:{bg:C.redDim,color:C.red,t:"Rejected"},draft:{bg:`${C.txt3}22`,color:C.txt3,t:"Draft"},sent:{bg:C.greenDim,color:C.green,t:"Sent"}};
  const s=m[status]||m.draft;
  return <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:s.bg,color:s.color,fontFamily:FONT,letterSpacing:"0.03em",whiteSpace:"nowrap"}}>{s.t}</span>;
}

function Toast({message,type,onClose}) {
  const bg = type==="success"?C.green:type==="error"?C.red:C.blue;
  return (
    <div style={{
      position:"fixed",bottom:24,right:24,zIndex:9999,
      display:"flex",alignItems:"center",gap:10,
      padding:"12px 20px",borderRadius:10,
      background:C.surfaceRaised,border:`1px solid ${bg}44`,
      boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${bg}22`,
      animation:"toastIn 0.3s ease",fontFamily:FONT,maxWidth:400,
    }}>
      <div style={{width:8,height:8,borderRadius:"50%",background:bg,flexShrink:0}}/>
      <span style={{fontSize:13,color:C.txt,fontWeight:500}}>{message}</span>
      <button onClick={onClose} style={{background:"none",border:"none",color:C.txt3,cursor:"pointer",fontSize:16,padding:0,marginLeft:8}}>×</button>
    </div>
  );
}

function ConfirmDialog({message,onConfirm,onCancel}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,maxWidth:400,width:"100%",boxShadow:"0 24px 48px rgba(0,0,0,0.4)"}}>
        <div style={{fontSize:14,fontWeight:600,color:C.txt,marginBottom:16,fontFamily:FONT,lineHeight:1.5}}>{message}</div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onCancel} style={{padding:"8px 16px",borderRadius:6,background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.txt2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:FONT}}>Cancel</button>
          <button onClick={onConfirm} style={{padding:"8px 16px",borderRadius:6,background:C.accent,border:"none",color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Print View ───────────────────────────────────────────────────────────────
function PrintView({form,approvals,infoProvided,meetingNotes,onClose}) {
  const cellS = {padding:"4px 8px",border:"1px solid #ccc",fontSize:11};
  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"#fff",color:"#000",overflowY:"auto",fontFamily:"Georgia, serif"}}>
      <style>{`@media print{.noprint{display:none!important}}`}</style>
      <div className="noprint" style={{position:"sticky",top:0,background:"#fff",borderBottom:"2px solid #000",padding:"8px 24px",display:"flex",gap:8,zIndex:1}}>
        <button onClick={()=>window.print()} style={{padding:"6px 16px",background:"#000",color:"#fff",border:"none",borderRadius:4,fontSize:12,fontWeight:700,cursor:"pointer"}}>Print</button>
        <button onClick={onClose} style={{padding:"6px 16px",background:"#fff",color:"#000",border:"1px solid #000",borderRadius:4,fontSize:12,fontWeight:600,cursor:"pointer"}}>Close</button>
      </div>
      <div style={{maxWidth:760,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:10,color:"#666"}}>6115 Morton Industrial Drive, Windsor Ontario N9J 3W2 · Phone: (519) 734 6161 · Fax: (519) 734 1749</div>
          <div style={{fontSize:22,fontWeight:700,margin:"8px 0"}}>Customer Requirements & Approval Form</div>
          <div style={{fontSize:12,fontWeight:600}}>Form #: F738 &nbsp;&nbsp;&nbsp; Revision: Jul. 2024</div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:24,marginTop:8,fontSize:12}}>
            <span><b>Job#:</b> {form.jobId||"—"}</span>
            <span><b>PM:</b> {form.pm||"—"}</span>
            <span><b>Rev#:</b> {form.revNum||"—"}</span>
          </div>
        </div>
        <hr style={{border:"none",borderTop:"2px solid #000",marginBottom:20}}/>

        <h3 style={{fontSize:13,margin:"16px 0 8px"}}>Customer Requirements</h3>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <tbody>
            {[
              ["Program / Part",form.programPart],["Customer",form.customerName],["Contact",form.contact],
              ["Quote #",form.quoteNum],["Standards Rev",form.standardsRevLevel],["Part #",form.partNum],
              ["Model Year",form.modelYear],["Start Date",form.startDate],["Weeks to T1",form.weeksToT1],
              ["# Cavities",form.numCavities],["Build Units",form.toolBuildUnits],["Production Qty",form.productionQty],
              ["Cavity Steel/Size",form.cavitySteelSize],["Core Steel/Size",form.coreSteelSize],
              ["Lifters",form.lifters],["Slides",form.slides],["Hook Slides",form.hookSlides],
              ["Retractors",form.retractors],["Inserts",form.inserts],
              ["Machine Type/Tonnage",form.machineTypeTonnage],["Press Location",form.pressPlantLocation],
              ["QMC / Plate Design",form.qmcPlateDesign],["Tryout Press",form.tryoutPressLocationSize],
              ["Runner Type",form.runnerRoundTrapezoid],["Manifold Supplier",form.manifoldSupplierSpares],
              ["Spherical Radius",form.sphericalRadiusOrifice],["Gate Size/Location",form.gateSizeLocation],
              ["Ejection",form.ejectionType],["Hydraulics",`${form.hydraulics}${form.hydraulicsNote?" — "+form.hydraulicsNote:""}`],
              ["Material Colour",form.materialColour],["Material Type",form.materialType],["Shrink",form.materialShrink],
              ["Special Mold #",form.specialMoldNum],["Tool to Run",`${form.toolToRun}${form.toolRunNote?" — "+form.toolRunNote:""}`],
              ["Mold Finish/Grain",form.moldFinishGrain],["Moldflow Req'd",form.moldflowReqd],
              ["Cooling/Warp",form.moldflowCoolingWarp],["Moldflow Source",form.moldflowSource],
              ["GM E8",form.gmE8Standards],["Core Finish",form.coreFinish],["Cavity Finish",form.cavityFinish],
              ["Core Grain",form.coreGrain],["Cavity Grain",form.cavityGrain],
              ["Max Radius",form.maxRadiusAllowed],["Optic Surface",form.opticSurfaceFinish],
            ].map(([k,v],i)=>(
              <tr key={i} style={{borderBottom:"1px solid #eee"}}>
                <td style={{...cellS,fontWeight:700,width:170,borderRight:"1px solid #ccc"}}>{k}</td>
                <td style={cellS}>{v||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{fontSize:13,margin:"20px 0 8px"}}>Approved Construction</h3>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <thead><tr style={{background:"#f0f0f0"}}><th style={cellS}>Component</th><th style={cellS}>Material</th><th style={cellS}>Size</th></tr></thead>
          <tbody>
            {[["Core",form.approvedCoreSteel,form.approvedCoreSteelSize],["Cavity",form.approvedCavitySteel,form.approvedCavitySteelSize],["Holder",form.approvedHolderBlock,form.approvedHolderBlockSize]].map(([c,m,s],i)=>(
              <tr key={i}><td style={{...cellS,fontWeight:600}}>{c}</td><td style={cellS}>{m||"—"}</td><td style={cellS}>{s||"—"}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 style={{fontSize:13,margin:"20px 0 8px"}}>Information Provided</h3>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <thead><tr style={{background:"#f0f0f0"}}><th style={cellS}>Item</th><th style={cellS}>Status</th><th style={cellS}>Date</th></tr></thead>
          <tbody>
            {infoProvided.map((it,i)=>(
              <tr key={i}><td style={cellS}>{it.item}</td><td style={{...cellS,color:it.provided?"green":"#999"}}>{it.provided||"—"}</td><td style={cellS}>{it.date||"—"}</td></tr>
            ))}
          </tbody>
        </table>

        <h3 style={{fontSize:13,margin:"20px 0 8px"}}>Approval Status</h3>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <thead><tr style={{background:"#f0f0f0"}}><th style={cellS}>Item</th><th style={cellS}>Status</th><th style={cellS}>By</th><th style={cellS}>Date</th></tr></thead>
          <tbody>
            {approvals.map((a,i)=>(
              <tr key={i}><td style={cellS}>{a.item}</td><td style={{...cellS,fontWeight:600,color:a.status==="approved"?"green":"#666"}}>{a.status}</td><td style={cellS}>{a.approvedBy||"—"}</td><td style={cellS}>{a.date||"—"}</td></tr>
            ))}
          </tbody>
        </table>

        {meetingNotes.length>0&&(
          <>
            <h3 style={{fontSize:13,margin:"20px 0 8px"}}>Meeting Notes</h3>
            {meetingNotes.map((n,i)=>(
              <div key={i} style={{marginBottom:12,padding:8,border:"1px solid #ddd",borderRadius:4}}>
                <div style={{fontSize:10,color:"#666"}}><b>{n.date}</b> · {n.attendees} · Posted by {n.postedBy}</div>
                <div style={{fontSize:11,marginTop:4,whiteSpace:"pre-wrap"}}>{n.note}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ═══ MAIN APP ═════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
export default function CustomerRequirementsApp() {
  const [activeTab,setActiveTab] = useState("requirements");
  const [form,setForm] = useState({...INITIAL_FORM});
  const [savedForm,setSavedForm] = useState({...INITIAL_FORM});
  const [approvals,setApprovals] = useState(APPROVAL_ITEMS.map(item=>({item,status:"pending",approvedBy:"",date:""})));
  const [infoProvided,setInfoProvided] = useState(INFO_PROVIDED_ITEMS.map(item=>({item,provided:"",date:""})));
  const [meetingNotes,setMeetingNotes] = useState([]);
  const [meetingDate,setMeetingDate] = useState(fmtDate(now()));
  const [meetingAttendees,setMeetingAttendees] = useState("");
  const [meetingNoteText,setMeetingNoteText] = useState("");
  const [emailPanel,setEmailPanel] = useState(false);
  const [emailTo,setEmailTo] = useState([]);
  const [emailNote,setEmailNote] = useState("");
  const [emailSearch,setEmailSearch] = useState("");
  const [logPanel,setLogPanel] = useState(false);
  const [activityLog,setActivityLog] = useState([]);
  const [saving,setSaving] = useState(false);
  const [toast,setToast] = useState(null);
  const [confirmState,setConfirmState] = useState(null);
  const [copyJobId,setCopyJobId] = useState("");
  const [printView,setPrintView] = useState(false);
  const [mounted,setMounted] = useState(false);
  const [revisions,setRevisions] = useState([]);
  const [revIndex,setRevIndex] = useState(-1);
  const [validationErrors,setValidationErrors] = useState({});

  useEffect(()=>{setTimeout(()=>setMounted(true),50);},[]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  const showToast = useCallback((message,type="success")=>{
    setToast({message,type,id:uid()});
    setTimeout(()=>setToast(null),3500);
  },[]);

  const addLog = useCallback((action,details)=>{
    setActivityLog(prev=>[{id:uid(),action,details,timestamp:now(),user:"Current User"},...prev]);
  },[]);

  const set = (field)=>(val)=>{setForm(f=>({...f,[field]:val}));if(validationErrors[field])setValidationErrors(e=>{const n={...e};delete n[field];return n;});};

  const validate = ()=>{
    const errs = {};
    if(!form.jobId.trim()) errs.jobId="Required";
    if(!form.programPart.trim()) errs.programPart="Required";
    if(!form.customerName.trim()) errs.customerName="Required";
    setValidationErrors(errs);
    return Object.keys(errs).length===0;
  };

  const handleSave = ()=>{
    if(!validate()){showToast("Please fill required fields (Job#, Program/Part, Customer)","error");setActiveTab("requirements");return;}
    setSaving(true);
    setTimeout(()=>{
      setSaving(false);
      setSavedForm({...form});
      setRevisions(prev=>[...prev,{id:uid(),data:{...form},timestamp:now(),user:"Current User"}]);
      setRevIndex(-1);
      addLog("Form Saved",`Job #${form.jobId} Rev ${form.revNum||"0"}`);
      showToast(`Job #${form.jobId} saved successfully`);
    },600);
  };

  const handleCopy = ()=>{
    const src = DEMO_JOBS[copyJobId];
    if(src){
      setConfirmState({
        message:`Copy requirements from Job #${copyJobId} (${src.programPart})? This will overwrite current form data.`,
        onConfirm:()=>{setForm(f=>{const merged={...f};Object.entries(src).forEach(([k,v])=>{if(v)merged[k]=v;});return merged;});addLog("Copied From",`Job #${copyJobId}`);showToast(`Data copied from Job #${copyJobId}`);setConfirmState(null);},
        onCancel:()=>setConfirmState(null),
      });
    } else {showToast(`Job #${copyJobId} not found. Try demo jobs: 2448, 2451`,"error");}
  };

  const navRevision = (dir)=>{
    if(revisions.length===0) return;
    const next = revIndex===-1?(dir===1?revisions.length-1:revisions.length-2):revIndex+dir;
    if(next<0||next>=revisions.length) return;
    setRevIndex(next);
    setForm({...revisions[next].data});
  };

  const handleEmailSend = ()=>{
    if(emailTo.length===0) return;
    addLog("Email Sent",`To: ${emailTo.join(", ")}`);
    showToast(`Notification sent to ${emailTo.length} recipient${emailTo.length>1?"s":""}`);
    setEmailTo([]);setEmailNote("");setEmailPanel(false);
  };

  const handlePostNote = ()=>{
    if(!meetingNoteText.trim()){showToast("Please enter meeting notes","error");return;}
    const note={id:uid(),date:meetingDate,attendees:meetingAttendees,note:meetingNoteText,postedBy:"Current User",postedAt:fmtDateTime(now())};
    setMeetingNotes(prev=>[note,...prev]);
    setMeetingNoteText("");setMeetingAttendees("");
    addLog("Meeting Note Posted",`${meetingDate} — ${meetingAttendees||"No attendees listed"}`);
    showToast("Meeting note posted");
  };

  useEffect(()=>{
    const handler=(e)=>{
      if((e.ctrlKey||e.metaKey)&&e.key==="s"){e.preventDefault();handleSave();}
      if((e.ctrlKey||e.metaKey)&&e.key==="p"){e.preventDefault();setPrintView(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  });

  const filteredContacts = TEAM_CONTACTS.filter(c=>c.name.toLowerCase().includes(emailSearch.toLowerCase())||c.email.toLowerCase().includes(emailSearch.toLowerCase()));
  const completionCount = approvals.filter(a=>a.status==="approved").length;
  const infoCount = infoProvided.filter(a=>a.provided).length;

  if(printView) return <PrintView form={form} approvals={approvals} infoProvided={infoProvided} meetingNotes={meetingNotes} onClose={()=>setPrintView(false)}/>;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.txt,fontFamily:FONT,opacity:mounted?1:0,transition:"opacity 0.4s ease"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        *::-webkit-scrollbar{width:6px;height:6px}
        *::-webkit-scrollbar-track{background:${C.bg}}
        *::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        *::-webkit-scrollbar-thumb:hover{background:${C.borderHover}}
        select option{background:${C.surfaceAlt};color:${C.txt}}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}
      `}</style>

      {confirmState&&<ConfirmDialog message={confirmState.message} onConfirm={confirmState.onConfirm} onCancel={confirmState.onCancel}/>}
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ═══ HEADER ═══ */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(11,14,19,0.88)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"0 20px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",height:56,gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.accent},#D46A06)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#000"}}>R</div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.txt,lineHeight:1.1}}>Redoe Mold</div>
              <div style={{fontSize:10,color:C.txt3}}>Customer Requirements · F738</div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {form.jobId&&<div style={{padding:"4px 12px",borderRadius:6,background:C.accentDim,border:`1px solid ${C.accent}33`,fontSize:12,fontWeight:700,color:C.accent,fontFamily:MONO}}>JOB #{form.jobId}{form.revNum&&<span style={{color:C.txt3,fontWeight:500}}> · R{form.revNum}</span>}</div>}
          {isDirty&&<div style={{width:8,height:8,borderRadius:"50%",background:C.yellow,animation:"pulse 2s infinite"}} title="Unsaved changes"/>}
          {revisions.length>0&&(
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <button onClick={()=>navRevision(-1)} style={{width:26,height:26,borderRadius:5,background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.txt2,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>◀</button>
              <span style={{fontSize:10,color:C.txt3,fontFamily:MONO,minWidth:36,textAlign:"center"}}>{revIndex===-1?"Latest":`v${revIndex+1}`}</span>
              <button onClick={()=>navRevision(1)} style={{width:26,height:26,borderRadius:5,background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.txt2,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>▶</button>
            </div>
          )}
          <button onClick={()=>setPrintView(true)} title="Ctrl+P" style={{padding:"6px 10px",borderRadius:6,background:"transparent",border:"1px solid transparent",color:C.txt2,fontSize:12,cursor:"pointer",fontFamily:FONT,fontWeight:600}}>🖨</button>
          <button onClick={()=>setLogPanel(!logPanel)} style={{padding:"6px 10px",borderRadius:6,background:logPanel?C.surfaceAlt:"transparent",border:`1px solid ${logPanel?C.border:"transparent"}`,color:C.txt2,fontSize:12,cursor:"pointer",fontFamily:FONT,fontWeight:600}}>📋{activityLog.length>0?` ${activityLog.length}`:""}</button>
          <button onClick={()=>setEmailPanel(!emailPanel)} style={{padding:"6px 10px",borderRadius:6,background:emailPanel?C.surfaceAlt:"transparent",border:`1px solid ${emailPanel?C.border:"transparent"}`,color:C.txt2,fontSize:12,cursor:"pointer",fontFamily:FONT,fontWeight:600}}>✉</button>
          <button onClick={handleSave} disabled={saving} title="Ctrl+S" style={{padding:"6px 16px",borderRadius:6,border:"none",background:saving?C.txt3:`linear-gradient(135deg,${C.accent},#D46A06)`,color:"#000",fontSize:12,fontWeight:700,cursor:saving?"wait":"pointer",fontFamily:FONT,flexShrink:0}}>{saving?"Saving…":"Save"}</button>
        </div>
      </header>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"16px 20px 60px"}}>
        {/* ═══ PANELS ═══ */}
        {emailPanel&&(
          <div style={{marginBottom:16,padding:20,borderRadius:10,background:C.surface,border:`1px solid ${C.border}`,animation:"slideDown 0.25s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700}}>Email Notification</div>
              <button onClick={()=>setEmailPanel(false)} style={{background:"none",border:"none",color:C.txt3,cursor:"pointer",fontSize:16}}>×</button>
            </div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 260px",minWidth:0}}>
                <label style={{display:"block",fontSize:10.5,fontWeight:600,color:C.txt2,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>RECIPIENTS ({emailTo.length})</label>
                <input value={emailSearch} onChange={e=>setEmailSearch(e.target.value)} placeholder="Search team..." style={{width:"100%",boxSizing:"border-box",padding:"6px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontSize:12,marginBottom:8,outline:"none",fontFamily:FONT}}/>
                {emailTo.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                  {emailTo.map(e=><span key={e} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,background:C.accentDim,border:`1px solid ${C.accent}33`,fontSize:10,color:C.accent,fontWeight:600}}>{e.split("@")[0]}<button onClick={()=>setEmailTo(p=>p.filter(x=>x!==e))} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:10,padding:0}}>×</button></span>)}
                </div>}
                <div style={{maxHeight:140,overflowY:"auto",display:"flex",flexWrap:"wrap",gap:4}}>
                  {filteredContacts.map(c=><button key={c.email} onClick={()=>setEmailTo(p=>p.includes(c.email)?p.filter(e=>e!==c.email):[...p,c.email])} style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontFamily:FONT,fontWeight:600,cursor:"pointer",transition:"all 0.15s",background:emailTo.includes(c.email)?C.accentDim:C.bg,color:emailTo.includes(c.email)?C.accent:C.txt2,border:`1px solid ${emailTo.includes(c.email)?C.accent+"44":C.border}`}}>{c.name}</button>)}
                </div>
              </div>
              <div style={{flex:"1 1 260px",minWidth:0,display:"flex",flexDirection:"column"}}>
                <label style={{display:"block",fontSize:10.5,fontWeight:600,color:C.txt2,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>NOTE</label>
                <textarea value={emailNote} onChange={e=>setEmailNote(e.target.value)} rows={5} placeholder={`Update on Job #${form.jobId||"____"}...`} style={{flex:1,padding:10,background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontSize:12,resize:"vertical",fontFamily:FONT,outline:"none"}}/>
                <button onClick={handleEmailSend} disabled={emailTo.length===0} style={{marginTop:8,padding:"8px 20px",borderRadius:6,background:emailTo.length>0?C.accent:C.txt3,border:"none",color:"#000",fontSize:12,fontWeight:700,cursor:emailTo.length>0?"pointer":"not-allowed",fontFamily:FONT,alignSelf:"flex-end"}}>Send to {emailTo.length}</button>
              </div>
            </div>
          </div>
        )}

        {logPanel&&(
          <div style={{marginBottom:16,padding:20,borderRadius:10,background:C.surface,border:`1px solid ${C.border}`,animation:"slideDown 0.25s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700}}>Activity Log</div>
              <button onClick={()=>setLogPanel(false)} style={{background:"none",border:"none",color:C.txt3,cursor:"pointer",fontSize:16}}>×</button>
            </div>
            {activityLog.length===0?<div style={{fontSize:12,color:C.txt3,fontStyle:"italic",padding:16,textAlign:"center",background:C.bg,borderRadius:6}}>No activity yet. Save, send emails, or post notes to see entries here.</div>:(
              <div style={{maxHeight:240,overflowY:"auto"}}>{activityLog.map(l=>(
                <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.accent,marginTop:5,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.txt}}>{l.action}</div>
                    <div style={{fontSize:11,color:C.txt3}}>{l.details}</div>
                  </div>
                  <div style={{fontSize:10,color:C.txt3,fontFamily:MONO,flexShrink:0,whiteSpace:"nowrap"}}>{fmtDateTime(l.timestamp)}</div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {/* ═══ TABS ═══ */}
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          <Tab active={activeTab==="requirements"} onClick={()=>setActiveTab("requirements")}>Requirements</Tab>
          <Tab active={activeTab==="construction"} onClick={()=>setActiveTab("construction")}>Construction</Tab>
          <Tab active={activeTab==="info"} onClick={()=>setActiveTab("info")} count={`${infoCount}/${infoProvided.length}`}>Info Provided</Tab>
          <Tab active={activeTab==="approvals"} onClick={()=>setActiveTab("approvals")} count={`${completionCount}/${approvals.length}`}>Approvals</Tab>
        </div>

        {/* ═══ TAB: REQUIREMENTS ═══ */}
        {activeTab==="requirements"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,padding:"10px 14px",borderRadius:8,background:C.surface,border:`1px solid ${C.border}`}}>
              <span style={{fontSize:12,color:C.txt2,fontWeight:600,flexShrink:0}}>Copy from:</span>
              <input value={copyJobId} onChange={e=>setCopyJobId(e.target.value)} placeholder="Job # (try 2448)" onKeyDown={e=>{if(e.key==="Enter")handleCopy();}} style={{width:130,padding:"6px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontSize:12,fontFamily:MONO,outline:"none"}}/>
              <button onClick={handleCopy} disabled={copyJobId.length<4} style={{padding:"6px 14px",borderRadius:6,background:copyJobId.length>=4?C.accent:C.txt3,border:"none",color:"#000",fontSize:12,fontWeight:700,cursor:copyJobId.length>=4?"pointer":"not-allowed",fontFamily:FONT}}>Copy</button>
              <span style={{fontSize:10,color:C.txt3}}>Demo: 2448, 2451</span>
            </div>

            <Section icon="📋" title="Job Information" subtitle="Core identifiers and program details">
              <Row><FieldInput label="Job #" value={form.jobId} onChange={set("jobId")} placeholder="2450" mono error={validationErrors.jobId}/><FieldInput label="PM" value={form.pm} onChange={set("pm")}/><FieldInput label="Rev #" value={form.revNum} onChange={set("revNum")} placeholder="0" mono/></Row>
              <Row><FieldInput label="Program / Part" value={form.programPart} onChange={set("programPart")} width={2} error={validationErrors.programPart}/></Row>
              <Row><FieldInput label="Customer Name" value={form.customerName} onChange={set("customerName")} error={validationErrors.customerName}/><FieldInput label="Contact" value={form.contact} onChange={set("contact")}/></Row>
              <Row><FieldInput label="Quote #" value={form.quoteNum} onChange={set("quoteNum")} mono/><FieldInput label="Standards Rev Level" value={form.standardsRevLevel} onChange={set("standardsRevLevel")}/></Row>
              <Row><FieldInput label="Part #" value={form.partNum} onChange={set("partNum")} mono/><FieldInput label="Model Year" value={form.modelYear} onChange={set("modelYear")} placeholder="2026"/></Row>
              <Row><FieldInput label="Start Date" value={form.startDate} onChange={set("startDate")} type="date"/><FieldInput label="# Weeks to T1 (after steel)" value={form.weeksToT1} onChange={set("weeksToT1")}/></Row>
            </Section>

            <Section icon="⚙" title="Tool Specifications" subtitle="Cavities, build units, production">
              <Row><FieldInput label="# of Cavities" value={form.numCavities} onChange={set("numCavities")}/><FieldSelect label="Tool Build Units" value={form.toolBuildUnits} onChange={set("toolBuildUnits")} options={["METRIC","INCH"]}/><FieldInput label="Production Qty" value={form.productionQty} onChange={set("productionQty")}/></Row>
            </Section>

            <Section icon="🔩" title="Quoted Steel Requirements" subtitle="Steel types and sizes as quoted">
              <Row><FieldInput label="Cavity Steel / Size" value={form.cavitySteelSize} onChange={set("cavitySteelSize")}/><FieldInput label="Core Steel / Size" value={form.coreSteelSize} onChange={set("coreSteelSize")}/></Row>
            </Section>

            <Section icon="🔧" title="Quoted Mechanisms" subtitle="Lifters, slides, retractors, inserts">
              <Row><FieldInput label="Lifters" value={form.lifters} onChange={set("lifters")}/><FieldInput label="Slides" value={form.slides} onChange={set("slides")}/></Row>
              <Row><FieldInput label="Hook Slides" value={form.hookSlides} onChange={set("hookSlides")}/><FieldInput label="Retractors" value={form.retractors} onChange={set("retractors")}/></Row>
              <Row><FieldInput label="Inserts" value={form.inserts} onChange={set("inserts")}/></Row>
            </Section>

            <Section icon="🏭" title="Customer Press & Try-out" subtitle="Machine specification and press information">
              <Row><FieldInput label="Machine Type & Tonnage" value={form.machineTypeTonnage} onChange={set("machineTypeTonnage")}/><FieldInput label="Press # / Plant Location" value={form.pressPlantLocation} onChange={set("pressPlantLocation")}/></Row>
              <Row><FieldInput label="QMC / Plate Design" value={form.qmcPlateDesign} onChange={set("qmcPlateDesign")}/><FieldInput label="Tryout Press Location & Size" value={form.tryoutPressLocationSize} onChange={set("tryoutPressLocationSize")}/></Row>
            </Section>

            <Section icon="🔶" title="Runner System" subtitle="Runner type, manifold, gate configuration">
              <Row><FieldSelect label="Round / Trapezoid" value={form.runnerRoundTrapezoid} onChange={set("runnerRoundTrapezoid")} options={["Round","Trapezoid"]} allowCustom/><FieldInput label="Manifold Supplier & Spares" value={form.manifoldSupplierSpares} onChange={set("manifoldSupplierSpares")}/></Row>
              <Row><FieldInput label="Spherical Radius / Orifice" value={form.sphericalRadiusOrifice} onChange={set("sphericalRadiusOrifice")}/><FieldInput label="Gate Size & Location" value={form.gateSizeLocation} onChange={set("gateSizeLocation")}/></Row>
            </Section>

            <Section icon="⬆" title="Ejection & Hydraulics">
              <Row><FieldInput label="Ejection (Pins/Lifters/Blades/Air)" value={form.ejectionType} onChange={set("ejectionType")} width={2}/></Row>
              <Row><FieldSelect label="Hydraulics" value={form.hydraulics} onChange={set("hydraulics")} options={["Yes","No"]}/><FieldInput label="Hydraulics Note" value={form.hydraulicsNote} onChange={set("hydraulicsNote")} width={2}/></Row>
            </Section>

            <Section icon="🧪" title="Material" subtitle="Colour, type, shrink specifications">
              <Row><FieldInput label="Colour" value={form.materialColour} onChange={set("materialColour")}/><FieldInput label="Type" value={form.materialType} onChange={set("materialType")}/><FieldInput label="Shrink" value={form.materialShrink} onChange={set("materialShrink")}/></Row>
            </Section>

            <Section icon="🏷" title="Special Mold & Run Configuration">
              <Row><FieldInput label="Customer Mold # / etc." value={form.specialMoldNum} onChange={set("specialMoldNum")}/><FieldSelect label="Tool to Run" value={form.toolToRun} onChange={set("toolToRun")} options={["Manual","Automatic"]}/><FieldInput label="Tool Run Note" value={form.toolRunNote} onChange={set("toolRunNote")}/></Row>
            </Section>

            <Section icon="✨" title="Mold Finish, Grain & Analysis">
              <Row><FieldInput label="Mold Finish (Core/Ribs/Cavity)" value={form.moldFinishGrain} onChange={set("moldFinishGrain")} width={2}/></Row>
              <Row><FieldSelect label="Moldflow Req'd" value={form.moldflowReqd} onChange={set("moldflowReqd")} options={["Yes","No"]}/><FieldSelect label="Cooling/Warp Req'd" value={form.moldflowCoolingWarp} onChange={set("moldflowCoolingWarp")} options={["Yes","No"]}/><FieldInput label="Moldflow Source" value={form.moldflowSource} onChange={set("moldflowSource")}/></Row>
              <Row><FieldSelect label="GM E8 Standards" value={form.gmE8Standards} onChange={set("gmE8Standards")} options={["Yes","No"]}/><FieldSelect label="Core Finish" value={form.coreFinish} onChange={set("coreFinish")} options={FINISH_OPTIONS} allowCustom/><FieldSelect label="Cavity Finish" value={form.cavityFinish} onChange={set("cavityFinish")} options={FINISH_OPTIONS} allowCustom/></Row>
              <Row><FieldInput label="Core Grain" value={form.coreGrain} onChange={set("coreGrain")}/><FieldInput label="Cavity Grain" value={form.cavityGrain} onChange={set("cavityGrain")}/></Row>
              <Row><FieldInput label="Max. Radius Allowed" value={form.maxRadiusAllowed} onChange={set("maxRadiusAllowed")}/><FieldInput label="Optic Surface Finish" value={form.opticSurfaceFinish} onChange={set("opticSurfaceFinish")}/></Row>
            </Section>
          </div>
        )}

        {/* ═══ TAB: CONSTRUCTION ═══ */}
        {activeTab==="construction"&&(
          <div>
            <Section icon="✅" title="Approved Construction" subtitle="Customer-approved steel types and sizes" badge={{bg:C.greenDim,color:C.green,text:"Approval Required"}}>
              {[{label:"Core Steel",tf:"approvedCoreSteel",sf:"approvedCoreSteelSize"},{label:"Cavity Steel",tf:"approvedCavitySteel",sf:"approvedCavitySteelSize"},{label:"Holder Block",tf:"approvedHolderBlock",sf:"approvedHolderBlockSize"}].map(({label,tf,sf})=>(
                <div key={label} style={{padding:14,marginBottom:10,borderRadius:8,background:C.surfaceRaised,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:10}}>{label}</div>
                  <Row><FieldSelect label="Approved Material Type" value={form[tf]} onChange={set(tf)} options={STEEL_TYPES} allowCustom width={2}/><FieldInput label="Approved Size" value={form[sf]} onChange={set(sf)}/></Row>
                </div>
              ))}
            </Section>
            <Section icon="🔩" title="Component Details" subtitle="Mechanisms, quantities, construction notes">
              {[{l:"Main Inserts",f:["mainInserts","mainInsertsNum"]},{l:"Slides",f:["constSlides","constSlidesNum"]},{l:"Inserts",f:["constInserts","constInsertsNum"]},{l:"Retractors",f:["constRetractors","constRetractorsNum"]},{l:"Travelling Lifters",f:["travellingLifters","travellingLiftersNum"]},{l:"Straight Lifters",f:["straightLifters","straightLiftersNum"]}].map(({l,f})=>(
                <Row key={l}><FieldInput label={`${l} — Description`} value={form[f[0]]||""} onChange={set(f[0])} width={2}/><FieldInput label="Qty" value={form[f[1]]||""} onChange={set(f[1])}/></Row>
              ))}
              <Row><FieldInput label="Shrink" value={form.constShrink||""} onChange={set("constShrink")}/><FieldInput label="Additional Notes" value={form.constNotes||""} onChange={set("constNotes")} width={2}/></Row>
            </Section>
          </div>
        )}

        {/* ═══ TAB: INFO PROVIDED ═══ */}
        {activeTab==="info"&&(
          <div>
            <Section icon="📁" title="Information to be Provided" subtitle="Track receipt of required documentation from customer" badge={{bg:infoCount===infoProvided.length?C.greenDim:C.yellowDim,color:infoCount===infoProvided.length?C.green:C.yellow,text:`${infoCount} / ${infoProvided.length}`}}>
              <div style={{height:4,borderRadius:2,background:C.border,marginBottom:16,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${C.yellow},${C.green})`,width:`${(infoCount/infoProvided.length)*100}%`,transition:"width 0.4s ease"}}/></div>
              {infoProvided.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:4,borderRadius:8,background:C.surface,border:`1px solid ${item.provided?C.green+"22":C.border}`,transition:"all 0.2s"}}>
                  <div onClick={()=>{const next=[...infoProvided];next[i]={...next[i],provided:next[i].provided?"":"Received",date:next[i].provided?"":fmtDate(now())};setInfoProvided(next);}} style={{width:22,height:22,borderRadius:5,background:item.provided?C.greenDim:C.bg,border:`1.5px solid ${item.provided?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:C.green,flexShrink:0}}>{item.provided&&"✓"}</div>
                  <div style={{flex:"1 1 180px",fontSize:13,fontWeight:item.provided?600:500,color:item.provided?C.green:C.txt,minWidth:0}}>{item.item}</div>
                  <div style={{flex:"0 1 180px",minWidth:0}}><input placeholder="Notes / status" value={item.provided} onChange={e=>{const next=[...infoProvided];next[i]={...next[i],provided:e.target.value};setInfoProvided(next);}} style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:5,color:C.txt,fontSize:12,fontFamily:FONT,outline:"none"}}/></div>
                  <div style={{flex:"0 1 120px",minWidth:0}}><input type="date" value={item.date} onChange={e=>{const next=[...infoProvided];next[i]={...next[i],date:e.target.value};setInfoProvided(next);}} style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:5,color:C.txt,fontSize:12,fontFamily:FONT,outline:"none"}}/></div>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* ═══ TAB: APPROVALS ═══ */}
        {activeTab==="approvals"&&(
          <div>
            <Section icon="📝" title="Approval Checklist" subtitle="Track customer sign-off on each tool design element" badge={{bg:completionCount===approvals.length?C.greenDim:C.blueDim,color:completionCount===approvals.length?C.green:C.blue,text:`${completionCount} / ${approvals.length}`}}>
              <div style={{height:4,borderRadius:2,background:C.border,marginBottom:16,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${C.accent},${C.green})`,width:`${(completionCount/approvals.length)*100}%`,transition:"width 0.4s ease"}}/></div>
              {approvals.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:4,borderRadius:8,background:C.surface,border:`1px solid ${a.status==="approved"?C.green+"22":C.border}`,transition:"all 0.2s"}}>
                  <div onClick={()=>{const next=[...approvals];next[i]={...next[i],status:next[i].status==="approved"?"pending":"approved",date:next[i].status==="approved"?"":fmtDate(now())};setApprovals(next);}} style={{width:22,height:22,borderRadius:5,background:a.status==="approved"?C.greenDim:C.bg,border:`1.5px solid ${a.status==="approved"?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:C.green,flexShrink:0}}>{a.status==="approved"&&"✓"}</div>
                  <div style={{flex:"1 1 180px",fontSize:13,fontWeight:600,color:a.status==="approved"?C.green:C.txt,minWidth:0}}>{a.item}</div>
                  <div style={{flex:"0 1 150px",minWidth:0}}><input placeholder="Approved by" value={a.approvedBy} onChange={e=>{const next=[...approvals];next[i]={...next[i],approvedBy:e.target.value};setApprovals(next);}} style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:5,color:C.txt,fontSize:12,fontFamily:FONT,outline:"none"}}/></div>
                  <div style={{flex:"0 1 120px",minWidth:0}}><input type="date" value={a.date} onChange={e=>{const next=[...approvals];next[i]={...next[i],date:e.target.value};setApprovals(next);}} style={{width:"100%",boxSizing:"border-box",padding:"5px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:5,color:C.txt,fontSize:12,fontFamily:FONT,outline:"none"}}/></div>
                  <Pill status={a.status}/>
                </div>
              ))}
            </Section>

            <Section icon="📅" title="Meeting Notes" subtitle="Document approval meetings and attendees" badge={meetingNotes.length>0?{bg:C.blueDim,color:C.blue,text:`${meetingNotes.length}`}:undefined}>
              <div style={{padding:16,borderRadius:8,background:C.surface,border:`1px solid ${C.border}`,marginBottom:16}}>
                <Row><FieldInput label="Meeting Date" value={meetingDate} onChange={setMeetingDate} type="date"/><FieldInput label="Attendees" value={meetingAttendees} onChange={setMeetingAttendees} placeholder="Names separated by commas..." width={2}/></Row>
                <div style={{marginTop:4}}>
                  <label style={{display:"block",fontSize:10.5,fontWeight:600,color:C.txt2,marginBottom:4,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:FONT}}>NOTES</label>
                  <textarea rows={4} value={meetingNoteText} onChange={e=>setMeetingNoteText(e.target.value)} placeholder="Meeting discussion points, decisions, action items..." style={{width:"100%",boxSizing:"border-box",padding:10,background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:6,color:C.txt,fontSize:13,fontFamily:FONT,resize:"vertical",outline:"none"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
                  <button onClick={handlePostNote} style={{padding:"8px 20px",borderRadius:6,background:C.accent,border:"none",color:"#000",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Post Note</button>
                </div>
              </div>
              {meetingNotes.map(n=>(
                <div key={n.id} style={{padding:14,marginBottom:8,borderRadius:8,background:C.surfaceRaised,border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontWeight:700,color:C.txt}}>{n.date}</span>{n.attendees&&<span style={{fontSize:11,color:C.txt2}}>· {n.attendees}</span>}</div>
                    <div style={{fontSize:10,color:C.txt3,fontFamily:MONO}}>{n.postedBy} · {n.postedAt}</div>
                  </div>
                  <div style={{fontSize:13,color:C.txt,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{n.note}</div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                    <button onClick={()=>{setMeetingNotes(prev=>prev.filter(x=>x.id!==n.id));showToast("Note deleted");}} style={{padding:"4px 10px",borderRadius:4,background:C.redDim,border:`1px solid ${C.red}22`,color:C.red,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:FONT}}>Delete</button>
                  </div>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* ─── Footer ─── */}
        <div style={{marginTop:40,paddingTop:16,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{fontSize:11,color:C.txt3}}>Redoe Mold · 6115 Morton Industrial Drive, Windsor ON N9J 3W2 · (519) 734-6161</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:10,color:C.txt3}}>Ctrl+S save · Ctrl+P print</span>
            <span style={{fontSize:10,color:C.txt3,fontFamily:MONO}}>F738 · Rev. Jul 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}
