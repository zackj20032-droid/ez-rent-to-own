import React,{useEffect,useState} from 'react';
import {CheckCircle2, ArrowLeft, Phone, ClipboardCheck, UploadCloud, ShieldCheck} from 'lucide-react';
import {supabase} from './supabase.js';
export const serviceNotice='Rentals are available in select service areas. Please allow 24–72 business hours for an application update. Submission does not guarantee approval or service availability.';
export default function RentalApplications({user,cart=[],onSubmitted=()=>{},onReturnHome=()=>{window.location.assign('/')},lang='en'}){
 const [rows,setRows]=useState([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState(''),[idFile,setIdFile]=useState(null),[preview,setPreview]=useState('');
 async function refresh(){if(!user)return;const {data,error}=await supabase.from('rental_applications').select('id,status,denial_reason,created_at,requested_products,id_storage_path').eq('customer_id',user.id).order('created_at',{ascending:false});if(error)setError(error.message);else setRows(data||[])}
 useEffect(()=>{refresh()},[user?.id]);
 async function uploadID(applicationId,file){
  const session=await supabase.auth.getSession();if(!session.data.session)throw new Error('Please sign in again.');
  const body=new FormData();body.append('action','upload');body.append('application_id',applicationId);body.append('file',file);
  const response=await fetch(`${import.meta.env.VITE_SUPABASE_URL || supabase.supabaseUrl}/functions/v1/rental-id-secure`,{method:'POST',headers:{Authorization:`Bearer ${session.data.session.access_token}`,apikey:import.meta.env.VITE_SUPABASE_ANON_KEY || supabase.supabaseKey},body});
  const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||'ID upload failed');return result;
 }
 function chooseFile(file){setError('');setIdFile(null);setPreview('');if(!file)return;
  if(file.size>8*1024*1024){setError('Photo must be 8 MB or smaller.');return}
  if(!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type)){setError('Use JPG, PNG, WEBP or HEIC.');return}
  setIdFile(file);if(['image/jpeg','image/png','image/webp'].includes(file.type)){const reader=new FileReader();reader.onload=()=>setPreview(String(reader.result||''));reader.readAsDataURL(file)}
 }
 async function retryUpload(id){if(!idFile){setError('Choose your ID photo first.');return}setBusy(true);setError('');try{await uploadID(id,idFile);setSuccess('Your ID photo was uploaded securely. Your application is ready for review.');setIdFile(null);setPreview('');await refresh()}catch(e){setError(e.message)}finally{setBusy(false)}}
 async function submit(e){e.preventDefault();setBusy(true);setError('');setSuccess('');if(!idFile){setError('Please upload a photo of your ID.');setBusy(false);return}const form=e.currentTarget;const f=new FormData(form);
  const payload={customer_id:user.id,full_name:String(f.get('full_name')).trim(),street_address:String(f.get('street_address')).trim(),county:String(f.get('county')).trim(),state:String(f.get('state')).trim(),pay_frequency:String(f.get('pay_frequency')),reference_contacts:[1,2,3].map(i=>({name:String(f.get(`reference_${i}_name`)||'').trim(),phone:String(f.get(`reference_${i}_phone`)||'').trim()})),requested_products:cart.map(p=>({id:p.id,title:p.title,weekly_price:p.weekly,quantity:1}))};
  const {data,error}=await supabase.from('rental_applications').insert(payload).select('id').single();
  if(error){setError(error.message)}else{try{await uploadID(data.id,idFile);setSuccess('Application received. Check here for updates in 24–72 business hours.');form.reset();setIdFile(null);setPreview('');onSubmitted()}catch(uploadError){setError('Your application was saved, but your ID upload failed: '+uploadError.message+' Select your ID and use Retry upload below.')}await refresh()}setBusy(false)
 }
 return (
  <div className="ez-application">
   {success ? (
    <section className="ez-application-confirmation" role="status" aria-live="polite">
     <div className="ez-confirmation-icon"><CheckCircle2 size={42}/></div>
     <div className="ez-confirmation-eyebrow"><ClipboardCheck size={16}/> APPLICATION SUBMITTED</div>
     <h2>Application Received!</h2>
     <p className="ez-confirmation-thanks">Thank you for applying with E-Z Rent To Own!</p>
     <p>Your rental application has been successfully submitted to our team for review. We appreciate your interest and look forward to assisting you.</p>
     <div className="ez-confirmation-review"><strong>What happens next?</strong><span>Please allow <b>24–72 business hours</b> for an update on your application. You can check your application status in your account.</span></div>
     <div className="ez-confirmation-contact"><h3>Have questions? Contact our stores</h3><div className="ez-confirmation-phones"><a href="tel:8599851800"><span>Berea</span><strong><Phone size={16}/> 859-985-1800</strong></a><a href="tel:6067238400"><span>Irvine</span><strong><Phone size={16}/> 606-723-8400</strong></a></div></div>
     <button type="button" className="ez-confirmation-return" onClick={onReturnHome}><ArrowLeft size={19}/> Return to Homepage</button>
    </section>
   ) : (
    <>
     <p className="ez-service-notice">{serviceNotice}</p>
     <h2>Rental Application</h2>
     <p className="muted">Upload a clear photo of your government-issued photo ID. Your ID is stored privately and can be viewed only by authorized application reviewers.</p>
     <form onSubmit={submit} className="ez-application-form">
      <label>Full name<input name="full_name" required minLength={2} maxLength={160}/></label>
      <label>Street address<input name="street_address" required maxLength={250}/></label>
      <label>County<input name="county" required maxLength={120}/></label>
      <label>State<input name="state" required maxLength={120}/></label>
      <label>How often are you paid?<select name="pay_frequency" required><option value="weekly">Weekly</option><option value="biweekly">Every two weeks</option><option value="twice_monthly">Twice a month</option><option value="monthly">Monthly</option></select></label>
      <fieldset className="ez-reference-fieldset"><legend>Three references</legend><p className="muted">Provide the name and phone number of three people we may contact as references.</p>{[1,2,3].map(i=><div className="ez-reference-row" key={i}><strong>Reference {i}</strong><label>Full name<input name={`reference_${i}_name`} required minLength={2} maxLength={160} autoComplete="off"/></label><label>Phone number<input name={`reference_${i}_phone`} type="tel" required minLength={7} maxLength={30} pattern="[+0-9() .-]{7,30}" title="Enter a valid phone number" autoComplete="off"/></label></div>)}</fieldset>
      <div className="ez-id-upload"><label htmlFor="ez-id-file"><UploadCloud size={22}/> <strong>Photo ID (required)</strong><span>Tap to take a photo or select an image · JPG, PNG, WEBP or HEIC · Maximum 8 MB</span></label><input id="ez-id-file" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={e=>chooseFile(e.target.files?.[0])} required/>{idFile&&<p><ShieldCheck size={16}/> Selected: {idFile.name}</p>}{preview&&<img className="ez-id-preview" src={preview} alt="Preview of selected ID"/>}</div>
      <button className="primary" type="submit" disabled={busy}>{busy?'Submitting…':'Submit application for review'}</button>
     </form>
     {error&&<p role="alert" style={{color:'#b42318'}}>{error}</p>}
    </>
   )}
   <h2>My Applications</h2>
   {!rows.length&&<p>No applications submitted yet.</p>}
   {rows.map(r=><article className="infocard" key={r.id}><strong>Application {r.id.slice(0,8)}</strong><p>Status: <strong>{r.status.replace('_',' ')}</strong></p><p>Submitted: {new Date(r.created_at).toLocaleDateString()}</p>{r.status!=='denied'&&<p>ID verification: <strong>{r.id_storage_path?'Uploaded securely':'Upload needed'}</strong></p>}{r.status==='pending'&&!r.id_storage_path&&<button type="button" className="primary" disabled={busy||!idFile} onClick={()=>retryUpload(r.id)}>Retry ID upload</button>}{r.status==='denied'&&<p><strong>Reason:</strong> {r.denial_reason}</p>}</article>)}
  </div>
 );
}
