import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingCart, Search, Menu, X, Plus, Trash2, Globe, MapPin, User, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { supabase } from './supabase.js';
import './style.css';

const cats = ['Bedrooms', 'Living Rooms', 'Dining Room', 'Appliances', 'Electronics', 'Pre-Rented Products', 'Deals'];
const info = ['About E-Z', 'Careers', 'Contact Us'];
const translations = {
  'Bedrooms':'Recámaras','Living Rooms':'Salas','Dining Room':'Comedores','Appliances':'Electrodomésticos','Electronics':'Electrónica','Pre-Rented Products':'Productos usados en alquiler','Deals':'Ofertas','About E-Z':'Sobre E-Z','Careers':'Empleos','Contact Us':'Contáctanos','Shop Now':'Comprar ahora','Shop Online. Rent In Store.':'Compra en línea. Renta en tienda.','Browse Categories':'Explorar categorías','Featured Products':'Productos destacados','Search products...':'Buscar productos...','Add Product':'Agregar producto','Add Information':'Agregar información','Cart':'Carrito','Buy Outright':'Comprar de contado','Rent In Store':'Rentar en tienda','Delivery Area':'Área de entrega','Contact our store to confirm delivery eligibility.':'Comunícate con nuestra tienda para confirmar la disponibilidad de entrega.','Products coming soon':'Próximamente habrá productos','Visit our store for rental agreements.':'Visita nuestra tienda para contratos de alquiler.','Make your house':'Haz que tu casa','feel like home.':'se sienta como un hogar.','Furniture, appliances & electronics for every room. Shop outright online or visit us in store to explore rent-to-own options.':'Muebles, electrodomésticos y electrónicos para cada habitación. Compra de contado en línea o visítanos para conocer las opciones de renta con opción a compra.','Explore Deals':'Explorar ofertas','Shop Your Favorites':'Compra tus favoritos','Discover products for every room':'Descubre productos para cada habitación','Buy Online':'Compra en línea','Outright purchases only':'Solo compras de contado','Ask about delivery availability':'Consulta la disponibilidad de entrega','FIND WHAT YOU LOVE':'ENCUENTRA LO QUE TE GUSTA','HANDPICKED FOR YOU':'SELECCIONADOS PARA TI','Explore collection →':'Explorar colección →','YOUR HOME.':'TU HOGAR.','YOUR WAY.':'A TU MANERA.','Home':'Inicio','Learn more about our store and how we can help.':'Conoce más sobre nuestra tienda y cómo podemos ayudarte.','Explore our selection. Purchase outright online or visit us to discuss rental options.':'Explora nuestros productos. Compra de contado en línea o visítanos para conocer las opciones de renta.',"We'd love to hear from you.":'Nos encantaría saber de ti.','Questions about products, delivery, or renting? Send us a message and our team will get back to you.':'¿Tienes preguntas sobre productos, entregas o rentas? Envíanos un mensaje y nuestro equipo te responderá.','Berea city only (excluding Richmond), Rockcastle County and Jackson County.':'Solo la ciudad de Berea (excepto Richmond), y los condados de Rockcastle y Jackson.','Estill County, Kentucky. Rental delivery eligibility must be confirmed by the store. Outright online purchases are shipped separately; shipping charges apply.':'Condado de Estill, Kentucky. Confirma con la tienda si calificas para entrega de renta. Las compras en línea se envían por separado y tienen cargos de envío.','Name':'Nombre','Your name':'Tu nombre','Email':'Correo electrónico','Phone':'Teléfono','Phone number':'Número de teléfono','Message':'Mensaje','How can we help?':'¿Cómo podemos ayudarte?','Send Message':'Enviar mensaje','Welcome to E-Z Rent To Own. Browse our products online and visit our store to learn about rental options.':'Bienvenido a E-Z Rent To Own. Explora nuestros productos en línea y visítanos para conocer las opciones de renta.','Interested in joining our team? Contact us to learn about opportunities.':'¿Te interesa trabajar con nosotros? Contáctanos para conocer las oportunidades.','Making home feel a little more like you.':'Hacemos que tu hogar refleje tu estilo.','Outright online purchases are shipped with shipping charges calculated at checkout once payment and shipping services are connected. Rentals are arranged in store only. Berea serves Berea city (not Richmond), Rockcastle and Jackson counties; Irvine serves Estill County. Confirm eligibility with the store.':'Las compras de contado en línea se enviarán con cargos calculados al pagar cuando se habiliten los servicios de pago y envío. Las rentas se hacen únicamente en tienda. Berea atiende la ciudad de Berea (no Richmond) y los condados de Rockcastle y Jackson; Irvine atiende el condado de Estill. Confirma con la tienda.','Shop':'Comprar','Company':'Empresa','Need Help?':'¿Necesitas ayuda?','Have a question about a product or delivery?':'¿Tienes preguntas sobre un producto o entrega?','Contact Our Team →':'Contacta a nuestro equipo →','All rights reserved.':'Todos los derechos reservados.','Admin sign in':'Acceso de administrador','Title *':'Título *','Product Image *':'Imagen del producto *','Outright Purchase Price ($) *':'Precio de compra de contado ($) *','Weekly Rental Price ($) — optional, in-store only':'Precio de renta semanal ($) — opcional, solo en tienda','Category':'Categoría','Description':'Descripción','Save':'Guardar','Your cart is empty.':'Tu carrito está vacío.','Total':'Total','Outright purchases only. Secure payment checkout must be connected before accepting orders.':'Solo compras de contado. Se debe conectar un sistema de pago seguro antes de aceptar pedidos.','Checkout — setup required':'Pagar — requiere configuración','outright':'de contado','Add to Cart':'Agregar al carrito','Delete product':'Eliminar producto','Remove':'Eliminar',"We're getting our selection ready. Check back soon or visit us in store.":'Estamos preparando nuestros productos. Vuelve pronto o visítanos en tienda.','Search Results':'Resultados de búsqueda','No products found':'No se encontraron productos','Try another search or browse our categories.':'Prueba otra búsqueda o explora nuestras categorías.','Search':'Buscar','This is a demo form. Connect a backend or email service before launch.':'Este es un formulario de demostración. Conecta un servicio de correo antes del lanzamiento.','Sign In':'Iniciar sesión','Sign Out':'Cerrar sesión','Password':'Contraseña','Saving...':'Guardando...','Loading products...':'Cargando productos...','Unable to load products. Please try again.':'No se pudieron cargar los productos. Inténtalo de nuevo.','Only authorized administrators can sign in.':'Solo los administradores autorizados pueden iniciar sesión.','Are you sure you want to delete this product?':'¿Seguro que quieres eliminar este producto?','Product saved successfully.':'Producto guardado correctamente.','Product deleted successfully.':'Producto eliminado correctamente.','English title *':'Título en inglés *','Spanish title *':'Título en español *','English description':'Descripción en inglés','Spanish description':'Descripción en español.','Retry':'Reintentar'
};
const mapProduct = p => ({ id:p.id, title:p.title_en, titleEs:p.title_es || p.title_en, description:p.description_en || '', descriptionEs:p.description_es || p.description_en || '', category:p.category, price:Number(p.price), weekly:p.weekly_price, image:p.image_url });

function App() {
  const [lang,setLang] = useState(() => localStorage.getItem('ez_lang') === 'es' ? 'es' : 'en');
  const [page,setPage] = useState('Home');
  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [productError,setProductError] = useState('');
  const [content,setContent] = useState(() => { try { return JSON.parse(localStorage.getItem('ez_content') || '{}'); } catch { return {}; } });
  const [admin,setAdmin] = useState(false);
  const [login,setLogin] = useState(false);
  const [authLoading,setAuthLoading] = useState(true);
  const [loginBusy,setLoginBusy] = useState(false);
  const [loginError,setLoginError] = useState('');
  const [modal,setModal] = useState(false);
  const [saving,setSaving] = useState(false);
  const [formError,setFormError] = useState('');
  const [cart,setCart] = useState([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [mobile,setMobile] = useState(false);
  const [search,setSearch] = useState('');
  const [notice,setNotice] = useState('');
  const t = s => lang === 'es' ? (translations[s] || s) : s;
  useEffect(() => { document.documentElement.lang = lang; localStorage.setItem('ez_lang',lang); },[lang]);
  useEffect(() => { localStorage.setItem('ez_content',JSON.stringify(content)); },[content]);

  async function loadProducts() {
    setLoading(true); setProductError('');
    try {
      const {data,error} = await supabase.from('products').select('*').order('created_at',{ascending:false});
      if (error) throw error;
      setProducts((data || []).map(mapProduct));
    } catch (e) { setProductError(e.message || 'Unable to load products'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    loadProducts();
    let active = true;
    let sequence = 0;
    async function checkAdmin(session) {
      const current = ++sequence;
      if (!session?.user) { if(active && current === sequence) setAdmin(false); return; }
      try {
        const {data,error} = await supabase.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();
        if (active && current === sequence) setAdmin(!error && !!data);
      } catch { if(active && current === sequence) setAdmin(false); }
    }
    supabase.auth.getSession().then(async ({data}) => {
      if (active) await checkAdmin(data.session);
    }).catch(() => { if(active) setAdmin(false); }).finally(() => { if(active) setAuthLoading(false); });
    const {data:listener} = supabase.auth.onAuthStateChange((_event,session) => {
      // Defer Supabase queries outside the auth callback.
      setTimeout(() => { if(active) checkAdmin(session); },0);
    });
    return () => { active=false; listener.subscription.unsubscribe(); };
  },[]);

  async function signIn(e) {
    e.preventDefault(); if(loginBusy) return;
    setLoginBusy(true); setLoginError('');
    try {
      const f = new FormData(e.currentTarget);
      const {data,error} = await supabase.auth.signInWithPassword({email:String(f.get('email') || '').trim(),password:String(f.get('password') || '')});
      if(error) throw error;
      const {data:allowed,error:checkError} = await supabase.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle();
      if(checkError || !allowed) {
        await supabase.auth.signOut();
        setAdmin(false);
        throw new Error(t('Only authorized administrators can sign in.'));
      }
      setAdmin(true); setLogin(false);
    } catch(e) { setLoginError(e.message || 'Sign in failed'); }
    finally { setLoginBusy(false); }
  }
  async function signOut() {
    const {error} = await supabase.auth.signOut();
    if(error) { window.alert(error.message); return; }
    setAdmin(false); setModal(false);
  }

  async function addProduct(e) {
    e.preventDefault(); if(!admin || saving) return;
    setSaving(true); setFormError('');
    const f = new FormData(e.currentTarget);
    const file = f.get('image');
    let uploadedPath = null;
    try {
      if(!(file instanceof File) || !file.size || !file.type.startsWith('image/')) throw new Error('Select a product image.');
      if(file.size > 10*1024*1024) throw new Error('Image must be under 10 MB.');
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
      uploadedPath = `${crypto.randomUUID()}.${ext}`;
      const {error:uploadError} = await supabase.storage.from('product-images').upload(uploadedPath,file,{contentType:file.type,upsert:false});
      if(uploadError) throw uploadError;
      const {data:imageData} = supabase.storage.from('product-images').getPublicUrl(uploadedPath);
      const record = {
        title_en:String(f.get('title') || '').trim(), title_es:String(f.get('titleEs') || '').trim(),
        description_en:String(f.get('description') || '').trim(), description_es:String(f.get('descriptionEs') || '').trim(),
        category:cats.includes(page) ? page : String(f.get('category') || cats[0]),
        price:Number(f.get('price')), weekly_price:f.get('weekly') === '' ? null : Number(f.get('weekly')),
        image_url:imageData.publicUrl
      };
      const {error:insertError} = await supabase.from('products').insert(record);
      if(insertError) throw insertError;
      uploadedPath = null; // Image is now attached to a saved product.
      await loadProducts(); setModal(false); setNotice(t('Product saved successfully.'));
    } catch(e) {
      setFormError(e.message || 'Unable to save product.');
      if(uploadedPath) await supabase.storage.from('product-images').remove([uploadedPath]);
    } finally { setSaving(false); }
  }
  async function removeProduct(id) {
    if(!admin || !window.confirm(t('Are you sure you want to delete this product?'))) return;
    const {error} = await supabase.from('products').delete().eq('id',id);
    if(error) { window.alert(error.message); return; }
    setProducts(v => v.filter(p => p.id !== id));
    setCart(v => v.filter(p => p.id !== id));
    setNotice(t('Product deleted successfully.'));
  }
  function addInfo(e) {
    e.preventDefault(); if(!admin) return;
    const f = new FormData(e.currentTarget);
    setContent(v => ({...v,[page]:[...(v[page] || []),{id:Date.now(),title:f.get('title'),titleEs:f.get('titleEs') || f.get('title'),description:f.get('description'),descriptionEs:f.get('descriptionEs') || f.get('description')}]}));
    setModal(false);
  }
  const go = p => { setPage(p); setMobile(false); setSearch(''); setNotice(''); window.scrollTo(0,0); };
  const runSearch = () => { setPage('Search Results'); setMobile(false); window.scrollTo(0,0); };
  const filtered = products.filter(p => (page === 'Home' || page === 'Search Results' || p.category === page) && (`${p.title || ''} ${p.description || ''} ${p.titleEs || ''} ${p.descriptionEs || ''} ${p.category || ''} ${translations[p.category] || ''}`.toLowerCase().includes(search.toLowerCase())));
  const isInfo = info.includes(page);
  const grid = emptySearch => loading ? <div className="emptyproducts">{t('Loading products...')}</div> : productError ? <div className="emptyproducts"><p>{t('Unable to load products. Please try again.')}</p><button onClick={loadProducts}>{t('Retry')}</button></div> : <ProductGrid items={filtered} lang={lang} t={t} admin={admin} remove={removeProduct} add={p => setCart(v => [...v,p])} emptySearch={emptySearch}/>;
  const openModal = () => { setFormError(''); setModal(true); };

  return <>
    <div className="announcement">{t('Shop Online. Rent In Store.')} <span>•</span> {t('Visit our store for rental agreements.')}</div>
    <header><div className="head wrap">
      <button className="hamb" onClick={() => setMobile(!mobile)}><Menu/></button>
      <button className="logo" onClick={() => go('Home')}><img src="/logo.jpg" alt="E-Z Rent To Own"/></button>
      <form className="search" onSubmit={e => { e.preventDefault(); runSearch(); }}><Search size={20}/><input value={search} onChange={e => {setSearch(e.target.value);setPage('Search Results');}} placeholder={t('Search products...')} aria-label={t('Search products...')}/><button type="submit" aria-label={t('Search')} style={{background:'transparent',border:0,cursor:'pointer',padding:4}}><ArrowRight size={18}/></button></form>
      <button className="lang" onClick={() => setLang(lang === 'en' ? 'es' : 'en')}><Globe size={18}/> {lang === 'en' ? 'Español' : 'English'}</button>
      <button className="iconbtn" disabled={authLoading} onClick={() => admin ? signOut() : (setLoginError(''),setLogin(true))} title={admin ? t('Sign Out') : t('Admin sign in')}><User/></button>
      <button className="cartbtn" onClick={() => setCartOpen(true)}><ShoppingCart/><b>{cart.length}</b></button>
    </div><nav className={mobile ? 'open' : ''}><div className="wrap navinner">{cats.map(c => <button className={page === c ? 'active' : ''} onClick={() => go(c)} key={c}>{t(c)}</button>)}</div></nav></header>
    <main>{page === 'Home' ? <>
      <section className="hero"><div className="wrap hero-inner"><div className="hero-copy"><span className="eyebrow">E-Z RENT TO OWN</span><h1>{t('Make your house')}<br/><em>{t('feel like home.')}</em></h1><p>{t('Furniture, appliances & electronics for every room. Shop outright online or visit us in store to explore rent-to-own options.')}</p><button className="primary" onClick={() => go('Bedrooms')}>{t('Shop Now')} <ArrowRight size={18}/></button><button className="secondary" onClick={() => go('Deals')}>{t('Explore Deals')}</button></div><div className="hero-art"><div className="art-circle"/><div className="art-room"><div className="art-cushion"/><div className="art-cushion"/><div className="art-seat"/><div className="art-base"/><div className="art-leg l"/><div className="art-leg r"/></div><div className="art-tag">{t('YOUR HOME.')}<br/><strong>{t('YOUR WAY.')}</strong></div></div></div></section>
      <section className="benefits wrap"><div><Package/><span><b>{t('Shop Your Favorites')}</b><small>{t('Discover products for every room')}</small></span></div><div><ShieldCheck/><span><b>{t('Buy Online')}</b><small>{t('Outright purchases only')}</small></span></div><div><MapPin/><span><b>{t('Rent In Store')}</b><small>{t('Ask about delivery availability')}</small></span></div></section>
      <section className="wrap section"><div className="sectionhead"><div><span className="eyebrow">{t('FIND WHAT YOU LOVE')}</span><h2>{t('Browse Categories')}</h2></div></div><div className="category-grid">{cats.map((c,i) => <button className={'category cat'+i} onClick={() => go(c)} key={c}><span className="cat-icon">{['🛏️','🛋️','🪑','🧺','📺','🏷️','✨'][i]}</span><strong>{t(c)}</strong><span className="cat-link">{t('Explore collection →')}</span></button>)}</div></section>
      <section className="wrap section"><div className="sectionhead"><div><span className="eyebrow">{t('HANDPICKED FOR YOU')}</span><h2>{t('Featured Products')}</h2></div>{admin && <button className="adminadd" onClick={openModal}><Plus size={17}/>{t('Add Product')}</button>}</div>{grid(false)}</section>
    </> : <section className="wrap section page"><div className="breadcrumb"><button onClick={() => go('Home')}>{t('Home')}</button> / {t(page)}</div><div className="sectionhead"><div><span className="eyebrow">E-Z RENT TO OWN</span><h1>{t(page)}</h1><p className="muted">{t(isInfo ? 'Learn more about our store and how we can help.' : 'Explore our selection. Purchase outright online or visit us to discuss rental options.')}</p></div>{admin && page !== 'Contact Us' && page !== 'Search Results' && <button className="adminadd" onClick={openModal}><Plus size={17}/>{t(isInfo ? 'Add Information' : 'Add Product')}</button>}</div>
      {page === 'Search Results' ? grid(true) : page === 'Contact Us' ? <div className="contactgrid"><div className="contactcard"><h2>{t("We'd love to hear from you.")}</h2><p>{t('Questions about products, delivery, or renting? Send us a message and our team will get back to you.')}</p><p><MapPin size={18}/> {t('Delivery Area')}</p><small><strong>Berea:</strong> {t('Berea city only (excluding Richmond), Rockcastle County and Jackson County.')} <strong>Irvine:</strong> {t('Estill County, Kentucky. Rental delivery eligibility must be confirmed by the store. Outright online purchases are shipped separately; shipping charges apply.')}</small></div><form className="contactform" onSubmit={e => {e.preventDefault();setNotice(t('This is a demo form. Connect a backend or email service before launch.'));}}><label>{t('Name')}<input required placeholder={t('Your name')}/></label><label>{t('Email')}<input type="email" required placeholder="you@example.com"/></label><label>{t('Phone')}<input type="tel" placeholder={t('Phone number')}/></label><label>{t('Message')}<textarea required rows="5" placeholder={t('How can we help?')}/></label><button className="primary">{t('Send Message')} <ArrowRight size={16}/></button>{notice && <p className="muted">{notice}</p>}</form></div> : isInfo ? <div className="infoarea">{(content[page] || []).map(item => <article className="infocard" key={item.id}><h2>{lang === 'es' ? (item.titleEs || item.title) : item.title}</h2><p>{lang === 'es' ? (item.descriptionEs || item.description) : item.description}</p>{admin && <button className="delete" onClick={() => setContent(v => ({...v,[page]:v[page].filter(i => i.id !== item.id)}))}><Trash2 size={15}/> {t('Remove')}</button>}</article>)}{!(content[page] || []).length && <div className="empty">{t(page === 'About E-Z' ? 'Welcome to E-Z Rent To Own. Browse our products online and visit our store to learn about rental options.' : 'Interested in joining our team? Contact us to learn about opportunities.')}</div>}</div> : grid(false)}
    </section>}</main>
    <footer><div className="wrap footgrid"><div><img src="/logo.jpg" alt="E-Z Rent To Own"/><p>{t('Making home feel a little more like you.')}</p><small>{t('Outright online purchases are shipped with shipping charges calculated at checkout once payment and shipping services are connected. Rentals are arranged in store only. Berea serves Berea city (not Richmond), Rockcastle and Jackson counties; Irvine serves Estill County. Confirm eligibility with the store.')}</small></div><div><h4>{t('Shop')}</h4>{cats.map(c => <button onClick={() => go(c)} key={c}>{t(c)}</button>)}</div><div><h4>{t('Company')}</h4>{info.map(c => <button onClick={() => go(c)} key={c}>{t(c)}</button>)}</div><div><h4>{t('Need Help?')}</h4><p>{t('Have a question about a product or delivery?')}</p><button className="footercontact" onClick={() => go('Contact Us')}>{t('Contact Our Team →')}</button></div></div><div className="wrap copyright">© {new Date().getFullYear()} E-Z Rent To Own. {t('All rights reserved.')}</div></footer>
    {login && <div className="overlay" onClick={() => setLogin(false)}><div className="dialog" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setLogin(false)}><X/></button><h2>{t('Admin sign in')}</h2><form onSubmit={signIn}><label>{t('Email')}<input name="email" type="email" autoComplete="username" required/></label><label>{t('Password')}<input name="password" type="password" autoComplete="current-password" required/></label>{loginError && <p role="alert" style={{color:'#b42318'}}>{loginError}</p>}<button className="primary" disabled={loginBusy} type="submit">{loginBusy ? 'Signing in...' : t('Sign In')}</button></form></div></div>}
    {modal && admin && <div className="overlay" onClick={() => {if(!saving)setModal(false);}}><div className="dialog" onClick={e => e.stopPropagation()}><button className="close" disabled={saving} onClick={() => setModal(false)}><X/></button><h2>{t(isInfo ? 'Add Information' : 'Add Product')}</h2><form onSubmit={isInfo ? addInfo : addProduct}><label>{t('English title *')}<input name="title" required/></label><label>{t('Spanish title *')}<input name="titleEs" required/></label>{!isInfo && <><label>{t('Product Image *')}<input type="file" name="image" accept="image/*" required/></label><label>{t('Outright Purchase Price ($) *')}<input name="price" type="number" min="0" step="0.01" required/></label><label>{t('Weekly Rental Price ($) — optional, in-store only')}<input name="weekly" type="number" min="0" step="0.01"/></label>{!cats.includes(page) && <label>{t('Category')}<select name="category">{cats.map(c => <option key={c}>{c}</option>)}</select></label>}</>}<label>{t('English description')}<textarea name="description" rows="4"/></label><label>{t('Spanish description')}<textarea name="descriptionEs" rows="4"/></label>{formError && <p role="alert" style={{color:'#b42318'}}>{formError}</p>}<button className="primary" disabled={saving} type="submit">{saving ? t('Saving...') : t('Save')}</button></form></div></div>}
    {cartOpen && <div className="overlay drawerback" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={e => e.stopPropagation()}><div className="drawerhead"><h2>{t('Cart')} ({cart.length})</h2><button onClick={() => setCartOpen(false)}><X/></button></div>{cart.length ? cart.map((p,i) => <div className="cartitem" key={i}><img src={p.image} alt=""/><div><b>{lang === 'es' ? (p.titleEs || p.title) : p.title}</b><p>${Number(p.price).toFixed(2)}</p></div><button onClick={() => setCart(v => v.filter((_,j) => j !== i))}><Trash2 size={17}/></button></div>) : <p>{t('Your cart is empty.')}</p>}<div className="carttotal"><strong>{t('Total')}</strong><strong>${cart.reduce((a,p) => a + Number(p.price),0).toFixed(2)}</strong></div><p className="muted">{t('Outright purchases only. Secure payment checkout must be connected before accepting orders.')}</p><button className="primary" disabled style={{opacity:.55}}>{t('Checkout — setup required')}</button></aside></div>}
  </>;
}

function ProductGrid({items,t,lang,admin,remove,add,emptySearch=false}) {
  return items.length ? <div className="products">{items.map(p => <article className="product" key={p.id}><img src={p.image} alt={lang === 'es' ? (p.titleEs || p.title) : p.title}/><div className="productbody"><small>{t(p.category)}</small><h3>{lang === 'es' ? (p.titleEs || p.title) : p.title}</h3><p>{lang === 'es' ? (p.descriptionEs || p.description) : p.description}</p><div className="price">${Number(p.price).toFixed(2)} <span>{t('outright')}</span></div>{p.weekly != null && <div className="weekly">${Number(p.weekly).toFixed(2)}/{lang === 'es' ? 'semana' : 'week'} · {t('Rent In Store')}</div>}<button className="buy" onClick={() => add(p)}><ShoppingCart size={16}/> {t('Add to Cart')}</button>{admin && <button className="delete" onClick={() => remove(p.id)}><Trash2 size={14}/> {t('Delete product')}</button>}</div></article>)}</div> : <div className="emptyproducts"><div className="emptyicon"><Package size={32}/></div><h3>{t(emptySearch ? 'No products found' : 'Products coming soon')}</h3><p>{t(emptySearch ? 'Try another search or browse our categories.' : "We're getting our selection ready. Check back soon or visit us in store.")}</p></div>;
}
createRoot(document.getElementById('root')).render(<App/>);
