import type {
  ClinicianCalendarEvent,
  ClinicianProfessionalProfile,
  ClinicianReminder,
} from "./types";

function daysUntil(date:string,now:Date){
  const target=new Date(date).getTime();
  return Math.ceil((target-now.getTime())/86_400_000);
}

export function buildClinicianReminders(
  profile:ClinicianProfessionalProfile,
  events:ClinicianCalendarEvent[],
  now=new Date()
):ClinicianReminder[]{
  const reminders:ClinicianReminder[]=[];

  for(const credential of profile.credentials){
    if(!credential.expiry) continue;
    const days=daysUntil(credential.expiry,now);
    if(days<=90){
      reminders.push({
        id:`credential-${credential.id}`,
        kind:"credential",
        title:`${credential.title} ${days<0?"expired":"renewal"}`,
        detail:days<0?`Expired ${Math.abs(days)} day(s) ago.`:`Expires in ${days} day(s).`,
        dueAt:credential.expiry,
        severity:days<0||days<=14?"urgent":days<=45?"warning":"info",
        actionLabel:"Open credentials",
        actionHref:"/clinician/credentials",
      });
    }
  }

  for(const expense of profile.expenses){
    if(!expense.dueDate||expense.status==="paid") continue;
    const days=daysUntil(expense.dueDate,now);
    if(days<=60){
      reminders.push({
        id:`payment-${expense.id}`,
        kind:"payment",
        title:`${expense.provider}: ${expense.description}`,
        detail:`AUD ${expense.amount.toLocaleString()} · ${days<0?`overdue by ${Math.abs(days)} day(s)`:`due in ${days} day(s)`}`,
        dueAt:expense.dueDate,
        severity:days<0||days<=7?"urgent":days<=21?"warning":"info",
        actionLabel:"Open Professional Wallet",
        actionHref:"/clinician/wallet",
      });
    }
  }

  for(const competency of profile.competencies){
    if(!competency.nextReview) continue;
    const days=daysUntil(competency.nextReview,now);
    if(days<=60){
      reminders.push({
        id:`competency-${competency.id}`,
        kind:"competency",
        title:`${competency.title} review`,
        detail:days<0?`Review overdue by ${Math.abs(days)} day(s).`:`Review due in ${days} day(s).`,
        dueAt:competency.nextReview,
        severity:days<0||days<=14?"urgent":"warning",
        actionLabel:"Open competency passport",
        actionHref:"/clinician/competencies",
      });
    }
  }

  for(const event of events){
    const ms=new Date(event.startsAt).getTime()-now.getTime();
    if(ms<0||ms>24*60*60*1000) continue;
    const minutes=Math.round(ms/60_000);
    reminders.push({
      id:`meeting-${event.id}`,
      kind:"meeting",
      title:event.title,
      detail:minutes<=60?`Starts in ${Math.max(0,minutes)} minute(s).`:"Later today.",
      dueAt:event.startsAt,
      severity:minutes<=15?"urgent":minutes<=60?"warning":"info",
      actionLabel:event.joinUrl?"Join meeting":"View event",
      actionHref:event.joinUrl,
    });
  }

  return reminders.sort((a,b)=>new Date(a.dueAt).getTime()-new Date(b.dueAt).getTime());
}

export function buildDailyBrief(
  profile:ClinicianProfessionalProfile,
  reminders:ClinicianReminder[],
  events:ClinicianCalendarEvent[]
){
  const urgent=reminders.filter(r=>r.severity==="urgent");
  const meetings=events.filter(e=>{
    const d=new Date(e.startsAt);
    const today=new Date();
    return d.toDateString()===today.toDateString();
  });

  if(urgent.length){
    return `You have ${urgent.length} urgent professional item${urgent.length===1?"":"s"} requiring attention and ${meetings.length} meeting${meetings.length===1?"":"s"} on today’s calendar.`;
  }

  return `Your professional account is broadly up to date. You have ${meetings.length} meeting${meetings.length===1?"":"s"} today and ${reminders.length} upcoming reminder${reminders.length===1?"":"s"}.`;
}
