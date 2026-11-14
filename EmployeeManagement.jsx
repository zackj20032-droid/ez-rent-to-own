import React,{useCallback,useEffect,useState} from 'react';
import {UserPlus,RefreshCw,ShieldCheck} from 'lucide-react';
import {supabase} from './supabase.js';

const ROLE_LABEL={owner:'Owner',manager:'Store Manager',assistant_manager:'Assistant Store Manager',account_manager:'Account Manager'};
const STORE_LABEL={berea:'Berea',irvine:'Irvine'};
const ALLOWED=['manager','assistant_manager','account_manager'];

export default function EmployeeManagement({role,user}){
 const [staff,setStaff]=useState([]),[myStores,setMyStores]=useState([]),[loading,setLoading]=useState(false),[working,setWorking]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[newRole,setNewRole]=useState(role==='manager'?'account_manager':'assistant_manager'),[stores,setStores]=useState(['berea']);
 const call=useCallback(async body=>{const {data,error}=await supabase.functions.invoke('ez-employees',{body});if(error)throw new Error(error.message||'Employee request failed');if(data?.error)throw new Error(data.error);return data},[]);
 const load=useCallback(async()=>{setLoading(true);setError('');try{const result=await call({action:'list'});setStaff(result.staff||[]);setMyStores(result.allowed_stores||[]);setStores(prev=>prev.some(x=>(result.allowed_stores||[]).includes(x))?prev.filter(x=>result.allowed_stores.includes(x)):(result.allowed_stores||[]).slice(0,1));}catch(e){setError(e.message)}finally{setLoading(false)}},[call]);
 useEffect(()=>{load()},[load]);
 const allowedRoles=role==='owner'?ALLOWED:ALLOWED.slice(1);
 useEffect(()=>{if(!allowedRoles.includes(newRole))setNewRole(allowedRoles[0])},[role]);
 async function invite(e){e.preventDefault();setWorking(true);setError('');setNotice('');try{const result=await call({action:'invite',display_name:name.trim(),email:email.trim(),role:newRole,assigned_stores:stores});setNotice(result.existing?'Existing account granted employee access. They can sign in with their current password.':'Invitation sent. The employee will set a password using the email link.');setName('');setEmail('');await load()}catch(e){setError(e.message)}finally{setWorking(false)}}
 async function change(row,patch){setError('');setNotice('');if(!window.confirm('Save employee access changes?'))return;setWorking(true);try{await call({action:'update',user_id:row.user_id,...patch});setNotice('Employee access updated.');await load()}catch(e){setError(e.message)}finally{setWorking(false)}}
 if(!['owner','manager'].includes(role))return <p>Access denied.</p>;
 return <div className="ez-employees">
  <section className="ez-admin-card ez-employee-card"><div className="ez-employee-heading"><div><h3><UserPlus size={20}/> Add Employee</h3><p>Send a secure invitation. Employees use their own accounts and passwords.</p></div><ShieldCheck size={25}/></div>
  {error&&<p className="ez-ticket-error" role="alert">{error}</p>}{notice&&<p className="ez-ticket-notice" role="status">{notice}</p>}
  <form className="ez-employee-form" onSubmit={invite}>
    <label>Full name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} placeholder="Employee name"/></label>
    <label>Email address<input required type="email" autoComplete="off" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></label>
    <label>Employee rank<select value={newRole} onChange={e=>setNewRole(e.target.value)}>{allowedRoles.map(r=><option value={r} key={r}>{ROLE_LABEL[r]}</option>)}</select></label>
    <fieldset><legend>Assigned store(s)</legend>{myStores.map(store=><label key={store} className="ez-employee-check"><input type="checkbox" checked={stores.includes(store)} onChange={e=>setStores(p=>e.target.checked?[...new Set([...p,store])]:p.filter(x=>x!==store))}/>{STORE_LABEL[store]}</label>)}</fieldset>
    <button className="primary" disabled={working||loading||stores.length===0} type="submit"><UserPlus size={16}/>{working?'Saving…':'Add / Invite Employee'}</button>
  </form></section>
  <section className="ez-admin-card"><div className="ez-employee-heading"><div><h3>Employee Directory</h3><p>Store Managers may manage only lower-ranked employees assigned to their store.</p></div><button className="ez-admin-refresh" onClick={load} disabled={loading||working}><RefreshCw size={16}/> Refresh</button></div>
    {loading?<p>Loading employees…</p>:staff.length===0?<p>No employees found.</p>:<div className="ez-employee-list">{staff.map(person=><div className="ez-employee-row" key={person.user_id}><div className="ez-employee-info"><strong>{person.display_name||'Unnamed employee'}</strong><span>{ROLE_LABEL[person.role]||person.role} · {(person.assigned_stores||[]).map(s=>STORE_LABEL[s]||s).join(', ')}</span></div>
       <div className="ez-employee-controls">{person.can_manage?<><label>Role<select aria-label={`Role for ${person.display_name}`} disabled={working} value={person.role} onChange={e=>change(person,{role:e.target.value})}>{allowedRoles.map(r=><option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></label><label>Status<select aria-label={`Status for ${person.display_name}`} disabled={working} value={person.is_active?'active':'inactive'} onChange={e=>change(person,{is_active:e.target.value==='active'})}><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label>Stores<select aria-label={`Stores for ${person.display_name}`} disabled={working} value={(person.assigned_stores||[]).join(',')} onChange={e=>change(person,{assigned_stores:e.target.value.split(',')})}>{myStores.map(s=><option key={s} value={s}>{STORE_LABEL[s]}</option>)}{myStores.length===2&&<option value="berea,irvine">Both stores</option>}</select></label></>:<span>{person.is_active?'Active':'Inactive'}</span>}</div></div>)}</div>}
  </section>
 </div>;
}
