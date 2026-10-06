"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {demoWorkspaceContexts} from "@/lib/access/demo-contexts";
import {modulesForRole} from "@/lib/access/workspace";

function roleLabel(role:string){
  return role.split("-").map(part=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ");
}

export default function Dashboard(){
  const [contextId,setContextId]=useState("personal");
  const context=demoWorkspaceContexts.find(item=>item.id===contextId) ?? demoWorkspaceContexts[0];
  const modules=useMemo(()=>modulesForRole(context.role),[context.role]);

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE personalised workspace</div>
        <h2>{context.kind==="personal"?"Your dashboard":context.name}</h2>
        <p className="muted">{context.subtitle}</p>
      </div>
      <span className="chip">SYNTHETIC ROLE DEMO</span>
    </div>

    <section className="card workspace-switcher">
      <div>
        <div className="eyebrow">Workspace</div>
        <h3 style={{margin:"6px 0 4px"}}>One account. Different authorised views.</h3>
        <p className="muted" style={{margin:0}}>Switch context to preview how HIVE changes the dashboard according to membership and role.</p>
      </div>
      <label className="workspace-select-label">
        <span>Active workspace</span>
        <select className="workspace-select" value={contextId} onChange={e=>setContextId(e.target.value)}>
          {demoWorkspaceContexts.map(item=><option key={item.id} value={item.id}>{item.name} — {roleLabel(item.role)}</option>)}
        </select>
      </label>
    </section>

    <div className="workspace-summary">
      <div className="card">
        <div className="muted">Signed-in identity</div>
        <div className="kpi" style={{fontSize:28}}>Demo Emergency Physician</div>
        <p className="muted">One professional identity across personal and organisational workspaces.</p>
      </div>
      <div className="card">
        <div className="muted">Current role</div>
        <div className="kpi" style={{fontSize:28}}>{roleLabel(context.role)}</div>
        <p className="muted">{context.kind==="personal"?"Personal professional workspace":"Organisation-scoped permissions"}</p>
      </div>
      <div className="card">
        <div className="muted">Visible modules</div>
        <div className="kpi">{modules.length}</div>
        <p className="muted">Only modules relevant to this role are shown.</p>
      </div>
    </div>

    <div className="module-grid">
      {modules.map(module=><Link className="card module-card" key={module.id} href={module.href}>
        <div className="module-card-top">
          <div className="eyebrow">{context.kind==="personal"?"My workspace":"Organisation"}</div>
          {module.badge&&<span className="pill">{module.badge}</span>}
        </div>
        <h3>{module.title}</h3>
        <p className="muted">{module.description}</p>
        <strong className="module-link">Open →</strong>
      </Link>)}
    </div>

    <div className="chat" style={{marginTop:20}}>
      <section className="card">
        <div className="eyebrow">Access model</div>
        <h3>Personal identity stays with the clinician</h3>
        <p className="muted">Professional credentials, competencies, CPD and personal administration belong to the clinician. Organisations receive only the authorised view required for that clinician's role, membership and local workflow.</p>
        <div className="integration"><div><strong>Personal workspace</strong><div className="muted">Credentials, CPD, competencies, meetings, clinical tools and professional wallet.</div></div><span className="pill">OWNED BY CLINICIAN</span></div>
        <div className="integration"><div><strong>Organisation workspace</strong><div className="muted">Local knowledge, readiness, credentialling, simulation, governance or analytics according to role.</div></div><span className="pill planned">ROLE SCOPED</span></div>
      </section>

      <aside className="card">
        <div className="eyebrow">Security boundary</div>
        <h3>UI filtering is not authorisation</h3>
        <p className="muted">This MVP demonstrates the experience. Production authentication must verify the signed-in user, organisation membership and permissions on the server and in database policies before any protected data is returned.</p>
        <Link href="/architecture" className="btn" style={{marginTop:12}}>View governance architecture</Link>
      </aside>
    </div>
  </main>
}