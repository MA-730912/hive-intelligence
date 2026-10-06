"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {demoCalendarEvents,demoClinicianProfile as profile} from "@/lib/clinician/demo-profile";
import {buildClinicianReminders,buildDailyBrief} from "@/lib/clinician/reminders";

function timeLabel(iso:string){
  return new Date(iso).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
function dateLabel(iso:string){
  return new Date(iso).toLocaleDateString([], {day:"numeric",month:"short"});
}
function providerLabel(provider:string){
  if(provider==="microsoft-teams") return "Microsoft Teams";
  if(provider==="google-meet") return "Google Meet";
  if(provider==="zoom") return "Zoom";
  return provider.replaceAll("-"," ");
}

export default function ClinicianLiveDashboard(){
  const [now]=useState(()=>new Date());
  const reminders=useMemo(()=>buildClinicianReminders(profile,demoCalendarEvents,now),[now]);
  const brief=useMemo(()=>buildDailyBrief(profile,reminders,demoCalendarEvents),[reminders]);

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE Clinician Hub</div>
        <h2>Today</h2>
        <p className="muted">Live credentialling, professional obligations and connected meetings in one clinician dashboard.</p>
      </div>
      <span className="chip">AI ASSISTED</span>
    </div>

    <div className="demo-banner"><strong>AI daily brief:</strong> {brief}</div>

    <div className="chat">
      <section>
        <div className="card">
          <div className="toolbar">
            <div><div className="eyebrow">Calendar assistant</div><h3 style={{margin:"4px 0"}}>Meetings & commitments</h3></div>
            <span className="chip">PROVIDER-NEUTRAL</span>
          </div>
          {demoCalendarEvents.map(event=><div className="message" key={event.id}>
            <div className="toolbar" style={{marginBottom:8}}>
              <div>
                <strong>{event.title}</strong>
                <div className="muted">{dateLabel(event.startsAt)} · {timeLabel(event.startsAt)}–{timeLabel(event.endsAt)} · {providerLabel(event.provider)}</div>
                {event.organiser&&<div className="muted">Organiser: {event.organiser}</div>}
              </div>
              {event.joinUrl&&<a className="btn primary" href={event.joinUrl} target="_blank" rel="noreferrer">Join meeting</a>}
            </div>
            {event.preparation&&event.preparation.length>0&&<div><div className="eyebrow">AI preparation checklist</div><ul>{event.preparation.map(item=><li key={item}>{item}</li>)}</ul></div>}
          </div>)}
        </div>

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Live credentialling</div>
          <h3>Professional readiness</h3>
          {profile.credentials.map(c=><div className="message" key={c.id}>
            <div className="toolbar" style={{marginBottom:4}}>
              <strong>{c.title}</strong>
              <span className="chip">{c.status.toUpperCase()}</span>
            </div>
            <div className="muted">{c.issuer}{c.expiry?" · expires "+dateLabel(c.expiry):""}</div>
          </div>)}
          <Link className="btn" href="/clinician/credentials">Manage credentials</Link>
        </div>
      </section>

      <aside>
        <div className="card">
          <div className="eyebrow">AI reminders</div>
          <h3>Needs your attention</h3>
          {reminders.length===0?<p className="muted">No near-term reminders.</p>:reminders.map(r=><div className="message" key={r.id}>
            <div className="toolbar" style={{marginBottom:4}}>
              <strong>{r.title}</strong>
              <span className="chip">{r.severity.toUpperCase()}</span>
            </div>
            <p className="muted">{r.detail}</p>
            {r.actionHref&&(r.actionHref.startsWith("http")?
              <a className="btn" href={r.actionHref} target="_blank" rel="noreferrer">{r.actionLabel}</a>:
              <Link className="btn" href={r.actionHref}>{r.actionLabel}</Link>)}
          </div>)}
        </div>

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Payment reminders</div>
          <h3>Professional obligations</h3>
          {profile.expenses.filter(e=>e.status!=="paid").map(e=><div className="message" key={e.id}>
            <div className="toolbar" style={{marginBottom:4}}>
              <strong>{e.provider}</strong>
              <strong>AUD {e.amount.toLocaleString()}</strong>
            </div>
            <div className="muted">{e.description}{e.dueDate?" · due "+dateLabel(e.dueDate):""}</div>
          </div>)}
          <Link className="btn" href="/clinician/wallet">Open Professional Wallet</Link>
        </div>
      </aside>
    </div>

    <div className="demo-banner" style={{marginTop:18}}><strong>Integration boundary:</strong> this MVP uses synthetic calendar data. Production should connect Microsoft Graph / Microsoft 365 for Outlook + Teams, with Google Calendar/Meet and other providers behind the same calendar adapter. HIVE should store the minimum event metadata needed for reminders and launch links.</div>
  </main>
}
