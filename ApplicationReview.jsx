import React, {useEffect, useState} from 'react';
import {supabase} from './supabase.js';
import {ClipboardList, Clock3, CheckCircle2, XCircle, Search, MapPin, CalendarDays, Wallet, Phone, Users, Package, ChevronDown, ChevronUp, RefreshCw, AlertCircle, ShieldCheck} from 'lucide-react';

const labels={pending:'Pending',under_review:'Under review',approved:'Approved',denied:'Denied'};
const readable=(v)=>({weekly:'Weekly',biweekly:'Every two weeks',twice_monthly:'Twice monthly',monthly:'Monthly'}[v]||v||'Not provided');
const dateText=(v)=>v?new Date(v).toLocaleString():'—';
const digits=(v)=>String(v||'').replace(/[^+0-9]/g,'');
export default function ApplicationReview(){
 const [rows,setRows]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[expanded,setExpanded]=useState({});
 const [denying,setDenying]=useState(null),[reason,setReason]=useState(''),[idBusy,setIdBusy]=useState(null);
 async function load(){setLoading(true);setError('');const {data,error}=await supabase.from('rental_applications').select('id,customer_id,full_name,street_address,county,state,pay_frequency,status,denial_reason,requested_products,reference_contacts,id_storage_path,created_at').order('created_at',{ascending:false});if(error)setError(error.message);else setRows(data||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function secureAction(action,applicationId,extra={}){
  const {data:{session}}=await supabase.auth.getSession();if(!session)throw new Error('Please sign in again.');
  const {data,error}=await supabase.functions.invoke('ez-employees',{body:{action:action==='view'?'view_application_id':'decide_application',application_id:applicationId,...extra}});
  if(error){let msg=error.message;try{const j=await error.context?.json();msg=j?.error||msg}catch{}throw new Error(msg)}return data;
 }
 async function viewID(r){setIdBusy(r.id);setError('');try{const result=await secureAction('view',r.id);if(!result.url)throw new Error('No photo found');window.open(result.url,'_blank','noopener,noreferrer')}catch(e){setError(e.message)}finally{setIdBusy(null)}}
 async function decide(r,status,denialReason=''){
  if(status==='denied'&&!denialReason.trim())return;
  if(!window.confirm(`Change this application to ${labels[status]}?`))return;
  setBusy(true);setError('');
  try{await secureAction('decide',r.id,{status,reason:status==='denied'?denialReason.trim():null});setDenying(null);setReason('');await load()}catch(e){setError(e.message)}
  setBusy(false);
 }
 const filtered=rows.filter(r=>{
  if(filter!=='all'&&r.status!==filter)return false;
  const haystack=[r.full_name,r.street_address,r.county,r.state,r.id,...(Array.isArray(r.requested_products)?r.requested_products.map(p=>p.title):[])].join(' ').toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
 });
 const count=(status)=>rows.filter(r=>r.status===status).length;
 return <div className="ez-review-dashboard">
  <div className="ez-review-heading"><div><span className="ez-review-kicker"><ClipboardList size={15}/> APPLICATION MANAGEMENT</span><h3>Rental applications</h3><p>Review customer requests, verify references, and manage decisions.</p></div><button className="ez-review-refresh" disabled={loading||busy} onClick={load}><RefreshCw size={16}/> Refresh</button></div>
  <div className="ez-review-stats"><div><span>Total applications</span><strong>{rows.length}</strong><ClipboardList size={19}/></div><div><span>Awaiting review</span><strong>{count('pending')}</strong><Clock3 size={19}/></div><div><span>Under review</span><strong>{count('under_review')}</strong><Search size={19}/></div><div><span>Approved</span><strong>{count('approved')}</strong><CheckCircle2 size={19}/></div></div>
  <div className="ez-review-toolbar"><label><Search size={17}/><input aria-label="Search applications" placeholder="Search applications..." value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="Filter applications" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option>{Object.entries(labels).map(([v,label])=><option value={v} key={v}>{label}</option>)}</select></div>
  {error&&<div className="ez-review-error" role="alert"><AlertCircle size={18}/>{error}</div>}
  {loading?<div className="ez-review-empty">Loading applications...</div>:!filtered.length?<div className="ez-review-empty">No applications match your search.</div>:<div className="ez-review-list">{filtered.map(r=>{
   const isOpen=expanded[r.id]!==false;
   const products=Array.isArray(r.requested_products)?r.requested_products:[];
   const refs=Array.isArray(r.reference_contacts)?r.reference_contacts:[];
   return <article className="ez-review-application" key={r.id}>
    <div className="ez-review-apphead"><div className="ez-review-avatar"><Users size={21}/></div><div className="ez-review-person"><span className="ez-review-overline">RENTAL APPLICATION</span><h4>{r.full_name||'Applicant details removed'}</h4><span className="ez-review-date"><CalendarDays size={13}/>{dateText(r.created_at)}</span></div><span className={`ez-review-status ez-status-${r.status||'pending'}`}>{labels[r.status]||r.status}</span></div>
    <button className="ez-review-expand" onClick={()=>setExpanded(s=>({...s,[r.id]:!isOpen}))}>{isOpen?'Hide application details':'View application details'} {isOpen?<ChevronUp size={17}/>:<ChevronDown size={17}/>}</button>
    {isOpen&&<div className="ez-review-content">
     <div className="ez-review-info-grid"><section><div className="ez-review-section-title"><MapPin size={17}/> Applicant address</div><p>{r.street_address||'Details removed'}</p><small>{[r.county,r.state].filter(Boolean).join(', ')||'—'}</small></section><section><div className="ez-review-section-title"><Wallet size={17}/> Pay frequency</div><p>{readable(r.pay_frequency)}</p><small>Reported by applicant</small></section></div>
     <section className="ez-review-block"><div className="ez-review-section-title"><ShieldCheck size={17}/> Government-issued photo ID</div>{r.id_storage_path?<button type="button" className="ez-review-view-id" disabled={!!idBusy} onClick={()=>viewID(r)}>{idBusy===r.id?'Opening secure photo…':'View ID securely (60-second access)'}</button>:<p className="ez-review-muted">{'ID not available'}</p>}</section>
     <section className="ez-review-block"><div className="ez-review-section-title"><Package size={17}/> Requested products <span className="ez-review-count">{products.length}</span></div>{products.length?<div className="ez-review-product-list">{products.map((p,i)=><div key={i}><span className="ez-review-product-dot"/>{p.title||p.title_en||'Product'}{p.quantity>1&&<small> × {p.quantity}</small>}</div>)}</div>:<p className="ez-review-muted">No products available</p>}</section>
     <section className="ez-review-block"><div className="ez-review-section-title"><Users size={17}/> Personal references <span className="ez-review-count">{refs.length}</span></div>{refs.length?<div className="ez-review-reference-grid">{refs.map((ref,i)=><div className="ez-review-reference" key={i}><small>REFERENCE {i+1}</small><strong>{ref.name||'Not provided'}</strong>{ref.phone?<a href={`tel:${digits(ref.phone)}`}><Phone size={14}/>{ref.phone}</a>:<span>Phone not provided</span>}</div>)}</div>:<p className="ez-review-muted">Reference details removed or unavailable</p>}</section>
     {r.denial_reason&&<div className="ez-review-denial"><XCircle size={18}/><div><strong>Reason for denial</strong><p>{r.denial_reason}</p></div></div>}
     {r.status!=='denied'&&<div className="ez-review-footer"><div className="ez-review-footer-note"><ShieldCheck size={16}/> Only authorized staff can review applications</div><div className="ez-review-buttons">{r.status!=='under_review'&&<button className="ez-review-under" disabled={busy} onClick={()=>decide(r,'under_review')}><Clock3 size={16}/> Under review</button>}{r.status!=='approved'&&<button className="ez-review-approve" disabled={busy} onClick={()=>decide(r,'approved')}><CheckCircle2 size={16}/> Approve</button>}<button className="ez-review-deny" disabled={busy} onClick={()=>{setDenying(r.id);setReason('')}}><XCircle size={16}/> Deny</button></div></div>}
    </div>}
   </article>
  })}</div>}
  {denying&&<div className="ez-review-modal-backdrop" role="presentation" onClick={()=>!busy&&setDenying(null)}><div className="ez-review-modal" role="dialog" aria-modal="true" aria-labelledby="ez-denial-title" onClick={e=>e.stopPropagation()}><div className="ez-review-modal-icon"><AlertCircle size={24}/></div><h3 id="ez-denial-title">Deny rental application?</h3><p>Enter a reason the customer will see. Sensitive details will be cleared from the active database record.</p><label htmlFor="ez-denial-reason">Reason for denial <span>*</span></label><textarea id="ez-denial-reason" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain the decision clearly..." rows={4}/><div className="ez-review-modal-actions"><button disabled={busy} onClick={()=>setDenying(null)}>Cancel</button><button disabled={busy||!reason.trim()} onClick={()=>{const r=rows.find(x=>x.id===denying);if(r)decide(r,'denied',reason)}}>Confirm denial</button></div></div></div>}
 </div>
}
