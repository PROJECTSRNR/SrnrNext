'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    book:'<path d="M12 5v15M3 4h4a7 7 0 0 1 5 2 7 7 0 0 1 5-2h4v15h-4a7 7 0 0 0-5 2 7 7 0 0 0-5-2H3Z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2m-8 3h2"/>',
    chart:'<path d="M4 3v17h17M8 16v-5m5 5V7m5 9V4"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12a22 22 0 0 0 18 0m-9 0v4"/>',
    graduation:'<path d="m2 9 10-5 10 5-10 5Z M6 11v6a10 10 0 0 0 12 0v-6m4-2v8"/>',
    layers:'<path d="m3 7 9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    external:'<path d="M14 3h7v7m0-7L11 13M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
    edit:'<path d="m15 5 4 4M4 20l5-1L20 8a3 3 0 0 0-4-4L5 15Zm0 0h16"/>',
    trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    cloud:'<path d="M7 18H6a4 4 0 0 1-.5-8 7 7 0 0 1 13-1 4.5 4.5 0 0 1-.5 9h-1m-5-7v4m0 3v.1"/>',
    document:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h5"/>',
    monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2"/>',
    star:'<path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17.3l-5.6 2.9 1-6.2L3 9.6l6.2-.9Z"/>',
    flag:'<path d="M5 21V3m0 1c5-3 9 3 14 0v10c-5 3-9-3-14 0"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.layers) + '</svg>'; }
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const nativeApi = !!(window.google && google.script && google.script.run);
  const hostedApi = window.SRNR_API && typeof window.SRNR_API.call === 'function';
  const preview = !(nativeApi || hostedApi);
  const demo = [
    {id:'demo1',name:'ระบบทะเบียนนักเรียน',description:'ตรวจสอบข้อมูลนักเรียนและผลการเรียน',category:'student',color:'blue',icon:'graduation',subcategory:'ทะเบียนและผลการเรียน',tags:['เกรด','ผลการเรียน','ลงทะเบียน'],howTo:'1. เปิดโปรแกรมจากลิงก์ของวิทยาลัย\n2. เข้าสู่ระบบด้วยบัญชีที่หน่วยงานกำหนด\n3. เลือกภาคเรียนเพื่อดูผลการเรียน',requirements:'บัญชีผู้ใช้งานระบบทะเบียนของวิทยาลัย',contact:'ตัวอย่างหน่วยงาน: งานทะเบียน — ผู้ดูแลต้องใส่ช่องทางติดต่อจริงก่อนเผยแพร่'},
    {id:'demo2',name:'ระบบงานวิชาการ',description:'จัดการรายวิชาและข้อมูลการสอน',category:'teacher',color:'indigo',icon:'book',subcategory:'งานวิชาการ',tags:['รายวิชา','บันทึกคะแนน','การสอน']},
    {id:'demo3',name:'ตารางเรียน · ตารางสอน',description:'ค้นหาตารางเรียนและตารางสอนประจำภาคเรียน',category:'all',color:'teal',icon:'calendar',subcategory:'งานวิชาการ',tags:['ตารางเรียน','ตารางสอน','ห้องเรียน']},
    {id:'demo4',name:'ระบบดูแลช่วยเหลือนักเรียน',description:'ติดตามและดูแลนักเรียนในที่ปรึกษา',category:'teacher',color:'orange',icon:'users',subcategory:'ดูแลนักเรียน',tags:['ที่ปรึกษา','เช็กชื่อ','กิจกรรม']},
    {id:'demo5',name:'ห้องเรียนออนไลน์',description:'เข้าถึงบทเรียนและกิจกรรมการเรียนรู้',category:'student',color:'purple',icon:'monitor',subcategory:'การเรียนออนไลน์',tags:['บทเรียน','งานส่ง','ออนไลน์']},
    {id:'demo6',name:'ระบบเอกสารออนไลน์',description:'รวมแบบฟอร์มและเอกสารสำหรับครู',category:'teacher',color:'blue',icon:'document',subcategory:'เอกสารและแบบฟอร์ม',tags:['เอกสาร','แบบฟอร์ม','ดาวน์โหลด']}
  ].map((p,i) => ({...p,order:i,visible:true,recommended:i === 0 || i === 2,serviceStatus:i === 3 ? 'maintenance' : 'ready',statusNote:i === 3 ? 'กำลังอัปเดตระบบ กรุณากลับมาใช้งานภายหลัง' : '',url:'',logo:''}));
  const favoritesKey = 'srnr-favorites-v1'+(preview ? ':preview' : ':live');
  function readFavorites(value) {
    try { const parsed = JSON.parse(value || '[]'); return new Set(Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string' && id.length > 0 && id.length <= 100).slice(0,500) : []); }
    catch { return new Set(); }
  }
  let favorites = new Set();
  try { favorites = readFavorites(localStorage.getItem(favoritesKey)); } catch {}
  const state = {programs:[],settings:{collegeName:'วิทยาลัยเทคนิคสุรนารี',collegeLogo:''},filter:'all',subcategory:'',favoritesOnly:false,token:'',adminPrograms:[],revision:'',deleteId:'',loaded:false};
  const defaultLogo = $('collegeLogo').getAttribute('src');
  let toastTimer, loadGeneration = 0;
  let reportGeneration = 0, reportContext = null;
  let deviceId = '';
  try { deviceId = localStorage.getItem('srnr-report-device-v1') || ''; } catch {}
  if(!/^[a-z0-9-]{16,80}$/i.test(deviceId)) {
    deviceId = window.crypto && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
    try { localStorage.setItem('srnr-report-device-v1',deviceId); } catch {}
  }
  function safeUrl(value, allowHttp = false) { try { const u = new URL(value); return (u.protocol === 'https:' || allowHttp && u.protocol === 'http:') && !u.username && !u.password ? u.href : ''; } catch { return ''; } }
  function logoUrl(value) {
    const safe = safeUrl(value); if (!safe) return '';
    const u = new URL(safe);
    if (u.hostname === 'drive.google.com') {
      const id = (u.pathname.match(/\/d\/([\w-]+)/) || [])[1] || u.searchParams.get('id');
      return id && /^[\w-]{10,200}$/.test(id) ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w256' : '';
    }
    return safe;
  }
  function call(method, ...args) {
    if (preview) return Promise.reject(new Error('หน้าตัวอย่างยังไม่เชื่อม Google Apps Script กรุณาติดตั้งตามคู่มือเพื่อจัดการข้อมูลจริง'));
    const request = nativeApi ? new Promise((resolve,reject) => { google.script.run.withSuccessHandler(resolve).withFailureHandler(reject)[method](...args); }) : window.SRNR_API.call(method,...args);
    return request.catch(err => {
      const message = err && err.message ? err.message.replace(/^Exception:\s*/, '') : 'เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง';
      if (message.includes('SESSION_EXPIRED')) { state.token = ''; state.adminPrograms = []; $('adminList').replaceChildren(); clearReports(); $('adminDialog').close(); throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'); }
      throw new Error(message);
    });
  }
  function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000); }
  function create(tag, cls, text) { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; }
  const categoryLabel = category => ({teacher:'สำหรับครู',student:'สำหรับนักเรียน',all:'ทุกคน'})[category] || 'ทุกคน';
  const normalizeSearch = text => String(text || '').normalize('NFKC').toLocaleLowerCase('th');
  function renderSubcategories() {
    const values = [...new Set(state.programs.filter(p => p.visible && p.subcategory).map(p => p.subcategory))].sort((a,b) => a.localeCompare(b,'th'));
    if(state.subcategory && !values.includes(state.subcategory)) state.subcategory = '';
    const select = $('subcategoryFilter');
    if(JSON.stringify([...select.options].slice(1).map(o => o.value)) !== JSON.stringify(values)) {
      const all = create('option','','ทุกหมวดย่อย'); all.value = '';
      select.replaceChildren(all,...values.map(value => { const option = create('option','',value); option.value = value; return option; }));
    }
    select.value = state.subcategory; select.disabled = !values.length;
  }
  function launchControl(p) {
    const maintenance = p.serviceStatus === 'maintenance', url = safeUrl(p.url, true);
    if(url && !preview && !maintenance) {
      const link = create('a','launch','เปิดใช้งาน'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label','เปิดใช้งาน '+p.name+' ในแท็บใหม่');
      const symbol = create('span'); symbol.innerHTML = icon('external'); link.append(symbol); return link;
    }
    const button = create('button','launch',maintenance ? 'ปิดปรับปรุง' : preview ? 'ตัวอย่างโปรแกรม' : 'ยังไม่มีลิงก์'); button.type = 'button'; button.disabled = true; return button;
  }
  function openDetails(p) {
    $('detailsTitle').textContent = p.name;
    $('detailsIcon').replaceChildren(programIcon(p));
    const badges = [create('span','category-badge',categoryLabel(p.category))];
    if(p.subcategory) badges.push(create('span','subcategory-badge',p.subcategory));
    $('detailsBadges').replaceChildren(...badges);
    $('detailsDescription').textContent = p.description || 'เครื่องมือสำหรับชาวเทคนิคสุรนารี';
    const body = document.createDocumentFragment(), maintenance = p.serviceStatus === 'maintenance';
    body.append(create('div','program-health'+(maintenance ? ' maintenance' : ''),maintenance ? 'ปิดปรับปรุง' : 'พร้อมใช้งาน'));
    if(p.statusNote) body.append(create('p','detail-note',p.statusNote));
    if(p.tags && p.tags.length) { const tags = create('div','detail-tags'); p.tags.forEach(tag => tags.append(create('span','tag-chip',tag))); body.append(tags); }
    [['สำหรับใคร',categoryLabel(p.category)],['วิธีใช้งาน',p.howTo || 'ผู้ดูแลยังไม่ได้ระบุวิธีใช้งาน'],['สิ่งที่ต้องเตรียม',p.requirements || 'ผู้ดูแลยังไม่ได้ระบุสิ่งที่ต้องเตรียม'],['หน่วยงานและช่องทางติดต่อ',p.contact || 'ผู้ดูแลยังไม่ได้ระบุช่องทางติดต่อ']].forEach(([title,value]) => {
      const section = create('section','detail-section'); section.append(create('h3','',title),create('p','',value)); body.append(section);
    });
    const contactUrl = safeUrl(p.contactUrl);
    if(contactUrl) { const contact = create('a','detail-contact-link','เปิดช่องทางติดต่อ'); contact.href = contactUrl; contact.target = '_blank'; contact.rel = 'noopener noreferrer'; body.append(contact); }
    if(preview) body.append(create('p','field-hint','ข้อมูลตัวอย่างสำหรับแสดงรูปแบบ ผู้ดูแลต้องใส่ข้อมูลจริงก่อนเผยแพร่'));
    $('detailsBody').replaceChildren(body);
    const report = create('button','secondary-button','แจ้งปัญหาลิงก์'); report.type = 'button'; report.onclick = () => { $('detailsDialog').close(); openReport(p); };
    $('detailsActions').replaceChildren(report,launchControl(p));
    $('detailsDialog').showModal(); $('detailsDialog').scrollTop = 0;
  }
  function toggleFavorite(program) {
    const added = !favorites.has(program.id);
    if(added && favorites.size >= 500) { toast('เก็บรายการโปรดได้สูงสุด 500 รายการ กรุณานำบางรายการออกก่อน'); return; }
    if(added) favorites.add(program.id); else favorites.delete(program.id);
    let stored = true;
    try { localStorage.setItem(favoritesKey,JSON.stringify([...favorites])); } catch { stored = false; }
    render();
    const button = [...document.querySelectorAll('.favorite-star')].find(el => el.dataset.programId === program.id);
    (button || $('favoritesButton')).focus({preventScroll:true});
    toast(stored ? (added ? 'เพิ่มในรายการโปรดของเครื่องนี้แล้ว' : 'นำออกจากรายการโปรดแล้ว') : 'จำรายการโปรดชั่วคราวในแท็บนี้ เครื่องนี้ไม่อนุญาตให้เก็บข้อมูล');
  }
  function programIcon(program) {
    const el = create('div','program-icon ' + (['blue','indigo','teal','orange','purple'].includes(program.color) ? program.color : 'blue'));
    el.innerHTML = icon(program.icon || (program.category === 'teacher' ? 'briefcase' : program.category === 'student' ? 'graduation' : 'layers'));
    const url = logoUrl(program.logo);
    if (url) { const img = create('img'); img.src = url; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.onerror = () => { el.innerHTML = icon('layers'); }; el.replaceChildren(img); }
    return el;
  }
  function render() {
    renderSubcategories();
    const query = normalizeSearch($('searchInput').value.trim()), terms = query.split(/\s+/).filter(Boolean);
    const selected = state.programs.filter(p => p.visible && (!state.favoritesOnly || favorites.has(p.id)) && (state.filter === 'all' || p.category === state.filter || p.category === 'all') && (!state.subcategory || p.subcategory === state.subcategory));
    const programs = selected.filter(p => { const searchable = normalizeSearch([p.name,p.description,categoryLabel(p.category),p.subcategory,...(p.tags || [])].join(' ')); return terms.every(term => searchable.includes(term)); }).sort((a,b) => Number(!!b.recommended)-Number(!!a.recommended) || a.order-b.order || a.name.localeCompare(b.name,'th'));
    $('totalCount').textContent = selected.length;
    $('sectionTitle').firstChild.textContent = state.favoritesOnly ? 'รายการโปรดของฉัน ' : state.filter === 'teacher' ? 'โปรแกรมสำหรับครู ' : state.filter === 'student' ? 'โปรแกรมสำหรับนักเรียน ' : location.hash === '#search' ? 'ค้นหาโปรแกรม ' : 'โปรแกรมทั้งหมด ';
    const fragment = document.createDocumentFragment();
    programs.forEach(p => {
      const card = create('article','program-card'+(p.recommended ? ' recommended-card' : ''));
      const top = create('div','card-top'), controls = create('div','card-controls');
      const favorite = create('button','favorite-star'+(favorites.has(p.id) ? ' saved' : ''));
      favorite.type = 'button'; favorite.dataset.programId = p.id; favorite.innerHTML = icon('star');
      favorite.setAttribute('aria-pressed',String(favorites.has(p.id)));
      favorite.setAttribute('aria-label',(favorites.has(p.id) ? 'นำออกจากรายการโปรด: ' : 'เพิ่มในรายการโปรด: ')+p.name);
      favorite.title = favorites.has(p.id) ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด';
      favorite.onclick = () => toggleFavorite(p);
      controls.append(create('span','category-badge',categoryLabel(p.category)),favorite);
      top.append(programIcon(p),controls);
      const maintenance = p.serviceStatus === 'maintenance';
      const bottom = create('div','card-bottom');
      const actions = create('div','card-actions');
      const detail = create('button','details-link','รายละเอียด'); detail.type = 'button'; detail.setAttribute('aria-label','รายละเอียด: '+p.name); detail.onclick = () => openDetails(p);
      const report = create('button','report-link','แจ้งปัญหาลิงก์'); report.type='button'; report.setAttribute('aria-label','แจ้งปัญหาลิงก์: '+p.name); report.onclick = () => openReport(p);
      const launch = launchControl(p);
      if (launch.tagName === 'A') card.classList.add('launchable-card');
      actions.append(detail,report); bottom.append(actions,launch);
      card.append(top);
      if(p.recommended) { const badge = create('span','recommended-badge'); badge.innerHTML = icon('star'); badge.append(document.createTextNode('แนะนำ')); card.append(badge); }
      card.append(create('h3','',p.name),create('p','',p.description || 'เครื่องมือสำหรับชาวเทคนิคสุรนารี'));
      if(p.subcategory) card.append(create('span','subcategory-badge card-subcategory',p.subcategory));
      const health = create('div','program-health'+(maintenance ? ' maintenance' : ''),maintenance ? 'ปิดปรับปรุง' : 'พร้อมใช้งาน');
      card.append(health);
      if(p.statusNote) card.append(create('p','service-note'+(maintenance ? ' maintenance-note' : ''),p.statusNote));
      card.append(bottom); fragment.append(card);
    });
    $('programGrid').replaceChildren(fragment);
    $('emptyState').hidden = programs.length > 0 || !state.loaded;
    const hasVisibleFavorites = state.programs.some(p => p.visible && favorites.has(p.id));
    $('emptyTitle').textContent = state.favoritesOnly ? (hasVisibleFavorites ? 'ไม่พบรายการโปรดที่ตรงกับตัวกรอง' : 'ยังไม่มีรายการโปรด') : query ? 'ไม่พบโปรแกรมที่ค้นหา' : state.subcategory || state.filter !== 'all' ? 'ไม่พบโปรแกรมที่ตรงกับตัวกรอง' : 'ยังไม่มีโปรแกรม';
    $('emptyMessage').textContent = state.favoritesOnly ? (hasVisibleFavorites ? 'ลองล้างคำค้นหรือเลือกหมวดและหมวดย่อยทั้งหมด' : 'เลือกดูโปรแกรมทั้งหมด แล้วกดดาวบนโปรแกรมที่ใช้บ่อย') : query || state.subcategory || state.filter !== 'all' ? 'ลองใช้คำอื่น หรือเลือกดูโปรแกรมทั้งหมด' : 'ผู้ดูแลสามารถเพิ่มโปรแกรมจากเมนูผู้ดูแลระบบ';
    $('clearSearch').hidden = !state.favoritesOnly && !query && state.filter === 'all' && !state.subcategory;
    $('clearSearch').textContent = state.favoritesOnly ? 'ดูโปรแกรมทั้งหมด' : 'ล้างการค้นหา';
    $('favoritesCount').textContent = state.programs.filter(p => p.visible && favorites.has(p.id)).length;
    $('favoritesButton').setAttribute('aria-pressed',String(state.favoritesOnly));
    $('favoritesButton').classList.toggle('active',state.favoritesOnly);
    $('resultsCount').textContent = state.loaded ? 'แสดง '+programs.length+' โปรแกรม' : '';
    document.querySelectorAll('[data-filter]').forEach(el => { const active = el.dataset.filter === state.filter; el.classList.toggle('active',active); el.setAttribute('aria-pressed',String(active)); });
  }
  function applySettings() {
    const settings = state.settings; document.querySelector('.brand small').textContent = settings.collegeName;
    document.querySelector('.footer-inner>span:nth-child(2)').textContent = '© '+new Date().getFullYear()+' SRNR NEXT · '+settings.collegeName;
    document.title = 'SRNR NEXT · '+settings.collegeName;
    const url = logoUrl(settings.collegeLogo) || defaultLogo;
    $('collegeLogo').src = url; $('collegeLogo').onerror = () => { $('collegeLogo').onerror = null; $('collegeLogo').src = defaultLogo; };
    $('collegeLogo').alt = 'ตรา'+settings.collegeName;
  }
  async function load() {
    const generation = ++loadGeneration; state.loaded = false; $('loadingState').hidden = false; $('errorState').hidden = true; $('emptyState').hidden = true; $('programGrid').replaceChildren(); $('connectionStatus').textContent = 'กำลังโหลดข้อมูล'; $('connectionStatus').classList.remove('connected');
    try {
      const data = preview ? {programs:demo,settings:state.settings} : await call('getPublicData');
      if (generation !== loadGeneration) return;
      state.programs = data.programs; state.settings = data.settings; state.loaded = true; applySettings(); render();
      $('previewNotice').hidden = !preview; $('connectionStatus').textContent = preview ? 'โหมดตัวอย่าง' : 'พร้อมใช้งาน'; $('connectionStatus').classList.toggle('connected',!preview);
    } catch(err) { if (generation !== loadGeneration) return; $('errorState').hidden = false; $('errorMessage').textContent = err.message; $('connectionStatus').textContent = 'เชื่อมต่อไม่สำเร็จ'; $('resultsCount').textContent = ''; }
    finally { if (generation === loadGeneration) $('loadingState').hidden = true; }
  }
  function route() {
    const key = location.hash.slice(1); const page = ['home','search','teachers','students','favorites'].includes(key) ? key : 'home';
    if(key === 'main') return;
    state.filter = page === 'teachers' ? 'teacher' : page === 'students' ? 'student' : 'all';
    state.favoritesOnly = page === 'favorites';
    state.subcategory = '';
    if (page !== 'search') $('searchInput').value = '';
    document.querySelectorAll('[data-nav]').forEach(el => { const active = el.dataset.nav === page; el.classList.toggle('active',active); if(active) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current'); });
    $('breadcrumbPage').textContent = ({home:'หน้าแรก',search:'ค้นหาโปรแกรม',teachers:'สำหรับครู',students:'สำหรับนักเรียน',favorites:'รายการโปรด'})[page];
    $('sectionTitle').firstChild.textContent = ({home:'โปรแกรมทั้งหมด ',search:'ค้นหาโปรแกรม ',teachers:'โปรแกรมสำหรับครู ',students:'โปรแกรมสำหรับนักเรียน ',favorites:'รายการโปรดของฉัน '})[page];
    if(page === 'search') setTimeout(() => { $('searchInput').focus(); $('searchInput').scrollIntoView({block:'center',behavior:'smooth'}); },0);
    else if(page === 'home') window.scrollTo({top:0,behavior:'smooth'});
    else $('sectionTitle').scrollIntoView({block:'start',behavior:'smooth'});
    render();
  }
  function setTheme(theme) { document.documentElement.dataset.theme = theme; try { localStorage.setItem('srnr-theme',theme); } catch {} $('themeButton').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon'); $('themeButton').setAttribute('aria-label',theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'); }
  let initialTheme; try { initialTheme = localStorage.getItem('srnr-theme'); } catch {} setTheme(['light','dark'].includes(initialTheme) ? initialTheme : 'dark');
  $('themeButton').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  $('year').textContent = new Date().getFullYear();
  $('searchInput').oninput = render;
  document.querySelectorAll('[data-filter]').forEach(el => { el.onclick = () => { state.filter = el.dataset.filter; render(); }; });
  $('subcategoryFilter').onchange = () => { state.subcategory = $('subcategoryFilter').value; render(); };
  $('clearSearch').onclick = () => { $('searchInput').value = ''; state.filter = 'all'; state.subcategory = ''; if(location.hash === '#favorites') location.hash = 'home'; else { state.favoritesOnly = false; render(); } };
  $('favoritesButton').onclick = () => { location.hash = state.favoritesOnly ? 'home' : 'favorites'; };
  window.addEventListener('storage',event => { if(event.key === favoritesKey || event.key === null) { favorites = readFavorites(event.key === null ? null : event.newValue); render(); } });
  $('retryButton').onclick = load;
  window.addEventListener('hashchange',route);
  document.querySelectorAll('[data-nav],.brand').forEach(link => { link.addEventListener('click',() => { if(link.getAttribute('href') === location.hash) route(); }); });
  document.addEventListener('keydown',event => { if(event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) && !document.querySelector('dialog[open]')) { event.preventDefault(); location.hash = 'search'; $('searchInput').focus(); } });
  document.querySelectorAll('[data-close]').forEach(el => { el.onclick = () => $(el.dataset.close).close(); });
  $('loginDialog').addEventListener('close',() => { $('adminPassword').value = ''; });
  $('reportDialog').addEventListener('close',() => { reportGeneration++; reportContext = null; $('reportForm').reset(); });
  $('adminDialog').addEventListener('close',() => { ['currentPassword','newPassword','confirmPassword'].forEach(id => { $(id).value = ''; }); });
  function clearEditor() { $('programForm').reset(); $('programInfoFields').open = false; $('programId').value = ''; $('programError').textContent = ''; $('editorTitle').textContent = 'เพิ่มโปรแกรมใหม่'; }
  function fillEditor(p) { $('programId').value = p.id; $('programName').value = p.name; $('programDescription').value = p.description; $('programCategory').value = p.category; $('programUrl').value = p.url; $('programLogo').value = p.logo; $('programColor').value = p.color; $('programOrder').value = p.order; $('programVisible').checked = p.visible; $('programRecommended').checked = !!p.recommended; $('programServiceStatus').value = p.serviceStatus || 'ready'; $('programStatusNote').value = p.statusNote || ''; $('programSubcategory').value = p.subcategory || ''; $('programTags').value = (p.tags || []).join(', '); $('programHowTo').value = p.howTo || ''; $('programRequirements').value = p.requirements || ''; $('programContact').value = p.contact || ''; $('programContactUrl').value = p.contactUrl || ''; $('programInfoFields').open = !!(p.howTo || p.requirements || p.contact || p.contactUrl); $('editorTitle').textContent = 'แก้ไขโปรแกรม'; $('programError').textContent = ''; $('programName').focus(); }
  function renderAdmin() {
    const suggestions = [...new Set(state.adminPrograms.map(p => p.subcategory).filter(Boolean))].sort((a,b) => a.localeCompare(b,'th'));
    $('subcategorySuggestions').replaceChildren(...suggestions.map(value => { const option = create('option'); option.value = value; return option; }));
    const fragment = document.createDocumentFragment();
    state.adminPrograms.sort((a,b) => a.order-b.order).forEach(p => {
      const row = create('div','admin-item'), copy = create('div','item-copy'); copy.append(create('strong','',p.name),create('small','',categoryLabel(p.category)+' · '+(p.visible ? 'แสดง' : 'ซ่อน')+(p.recommended ? ' · แนะนำ' : '')));
      const edit = create('button','icon-button'); edit.type = 'button'; edit.innerHTML = icon('edit'); edit.setAttribute('aria-label','แก้ไข '+p.name); edit.onclick = () => fillEditor(p);
      const remove = create('button','icon-button delete-button'); remove.type = 'button'; remove.innerHTML = icon('trash'); remove.setAttribute('aria-label','ลบ '+p.name); remove.onclick = () => { state.deleteId = p.id; $('deleteDescription').textContent = p.name; $('deleteError').textContent = ''; $('deleteDialog').showModal(); };
      row.append(programIcon(p),copy,edit,remove); fragment.append(row);
    });
    if (!state.adminPrograms.length) fragment.append(create('p','field-hint','ยังไม่มีโปรแกรม เริ่มเพิ่มรายการแรกได้เลย'));
    $('adminList').replaceChildren(fragment); $('settingCollege').value = state.settings.collegeName; $('settingLogo').value = state.settings.collegeLogo;
  }
  async function refreshAdmin() { const data = await call('getAdminData',state.token); state.adminPrograms = data.programs; state.settings = data.settings; state.revision = data.revision; renderAdmin(); }
  async function busy(form,fn) {
    if (form.dataset.busy) return; form.dataset.busy = 'true';
    const controls = [...document.querySelectorAll('dialog[open] button, dialog[open] input, dialog[open] select, dialog[open] textarea')].filter(el => !el.disabled);
    controls.forEach(el => { el.disabled = true; });
    const blockCancel = event => event.preventDefault(); const dialogs = [...document.querySelectorAll('dialog[open]')]; dialogs.forEach(d => d.addEventListener('cancel',blockCancel));
    try { await fn(); } finally { controls.forEach(el => { el.disabled = false; }); dialogs.forEach(d => d.removeEventListener('cancel',blockCancel)); delete form.dataset.busy; }
  }
  $('adminEntry').onclick = async () => {
    if (state.token) { try { await refreshAdmin(); $('adminDialog').showModal(); } catch(err) { toast(err.message); } }
    else { $('loginError').textContent = preview ? 'หน้าตัวอย่าง: กรุณาติดตั้ง Google Apps Script เพื่อเปิดระบบผู้ดูแล' : ''; $('loginDialog').showModal(); }
  };
  $('loginForm').onsubmit = event => { event.preventDefault(); const password = $('adminPassword').value; $('adminPassword').value = ''; busy($('loginForm'),async () => {
    $('loginError').textContent = '';
    try { const result = await call('loginAdmin',password); state.token = result.token; await refreshAdmin(); clearEditor(); activateTab($('programsTab')); $('loginDialog').close(); $('adminDialog').showModal(); }
    catch(err) { state.token = ''; $('loginError').textContent = err.message; }
  }); };
  function clearReports() { reportsGeneration++; $('reportsList').replaceChildren(); $('reportsSummary').textContent = ''; $('reportsError').textContent = ''; $('reportsSheetLink').hidden = true; }
  $('logoutButton').onclick = async () => { const token = state.token; state.token = ''; state.adminPrograms = []; $('adminList').replaceChildren(); clearReports(); clearEditor(); $('adminDialog').close(); try { await call('logoutAdmin',token); } catch {} toast('ออกจากระบบแล้ว'); };
  $('newProgramButton').onclick = () => { clearEditor(); $('programName').focus(); };
  const tabButtons = [...document.querySelectorAll('[data-tab]')];
  function activateTab(el) { tabButtons.forEach(tab => { const active = tab === el; tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1; $(tab.dataset.tab).hidden = !active; }); if(el.dataset.tab === 'reportsPanel') refreshReports(); }
  tabButtons.forEach((el,i) => { el.onclick = () => activateTab(el); el.onkeydown = event => { if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); const target = event.key === 'Home' ? tabButtons[0] : event.key === 'End' ? tabButtons.at(-1) : tabButtons[(i+(event.key === 'ArrowRight' ? 1 : tabButtons.length-1))%tabButtons.length]; activateTab(target); target.focus(); } }; });
  $('programForm').onsubmit = event => { event.preventDefault(); const program = {id:$('programId').value,name:$('programName').value.trim(),description:$('programDescription').value.trim(),category:$('programCategory').value,url:$('programUrl').value.trim(),logo:$('programLogo').value.trim(),order:Number($('programOrder').value),color:$('programColor').value,visible:$('programVisible').checked,recommended:$('programRecommended').checked,serviceStatus:$('programServiceStatus').value,statusNote:$('programStatusNote').value.trim(),subcategory:$('programSubcategory').value.trim(),tags:$('programTags').value.split(/[,，\n]/).map(tag => tag.trim()).filter(Boolean),howTo:$('programHowTo').value.trim(),requirements:$('programRequirements').value.trim(),contact:$('programContact').value.trim(),contactUrl:$('programContactUrl').value.trim()}; busy($('programForm'),async () => {
    $('programError').textContent = '';
    try { const result = await call('saveProgram',state.token,program,state.revision); state.revision = result.revision; await refreshAdmin(); clearEditor(); await load(); toast(result.backupWarning || 'บันทึกโปรแกรมแล้ว'); }
    catch(err) { $('programError').textContent = err.message; if(err.message.includes('ข้อมูลมีการเปลี่ยนแปลง')) await refreshAdmin().catch(() => {}); }
  }); };
  $('confirmDelete').onclick = () => busy($('deleteDialog'),async () => {
    try { const result = await call('deleteProgram',state.token,state.deleteId,state.revision); state.revision = result.revision; $('deleteDialog').close(); clearEditor(); await refreshAdmin(); await load(); toast(result.backupWarning || 'ลบโปรแกรมแล้ว'); }
    catch(err) { $('deleteError').textContent = err.message; }
  });
  $('settingsForm').onsubmit = event => { event.preventDefault(); const settings = {collegeName:$('settingCollege').value.trim(),collegeLogo:$('settingLogo').value.trim()}; busy($('settingsForm'),async () => {
    $('settingsError').textContent = ''; try { const result = await call('saveSettings',state.token,settings,state.revision); state.revision = result.revision; await refreshAdmin(); await load(); toast(result.backupWarning || 'บันทึกการตั้งค่าแล้ว'); } catch(err) { $('settingsError').textContent = err.message; }
  }); };
  $('passwordForm').onsubmit = event => { event.preventDefault(); $('passwordError').textContent = ''; if($('newPassword').value !== $('confirmPassword').value) { $('passwordError').textContent = 'รหัสใหม่และรหัสยืนยันไม่ตรงกัน'; return; } const current = $('currentPassword').value, next = $('newPassword').value; $('passwordForm').reset(); busy($('passwordForm'),async () => {
    try { await call('changeAdminPassword',state.token,current,next); state.token = ''; clearReports(); $('adminDialog').close(); toast('เปลี่ยนรหัสแล้ว กรุณาเข้าสู่ระบบด้วยรหัสใหม่'); } catch(err) { $('passwordError').textContent = err.message; }
  }); };
  async function openReport(program) {
    const generation = ++reportGeneration;
    $('reportForm').reset(); $('reportProgram').textContent = program.name;
    $('reportError').textContent = preview ? 'โหมดตัวอย่าง: ทดลองเลือกประเภทปัญหาได้ ระบบส่งรายงานจะเปิดหลังติดตั้ง Google Apps Script' : 'กำลังเตรียมแบบฟอร์ม…';
    $('sendReport').disabled = true; reportContext = {programId:program.id,ticket:''};
    $('reportDialog').showModal();
    if(preview) return;
    try { const challenge = await call('getReportChallenge',program.id); if(generation !== reportGeneration || !$('reportDialog').open) return; reportContext.ticket = challenge.ticket; $('reportError').textContent = ''; $('sendReport').disabled = false; }
    catch(err) { if(generation === reportGeneration) $('reportError').textContent = err.message; }
  }
  $('reportForm').onsubmit = event => {
    event.preventDefault(); if(!reportContext || !reportContext.ticket || preview) return;
    const input = {...reportContext,deviceId:deviceId,reason:$('reportReason').value,details:$('reportDetails').value.trim()};
    busy($('reportForm'),async () => {
      $('reportError').textContent = '';
      try { const result = await call('submitLinkReport',input); $('reportDialog').close(); toast('รับแจ้งปัญหาแล้ว · หมายเลข '+result.id.slice(0,8)); }
      catch(err) { $('reportError').textContent = err.message; }
    });
  };
  let reportsGeneration = 0;
  async function refreshReports() {
    const generation = ++reportsGeneration;
    $('reportsError').textContent = ''; $('reportsSummary').textContent = 'กำลังโหลดรายงาน…';
    $('reportsList').replaceChildren(); $('reportsSheetLink').hidden = true;
    try {
      const data = await call('getAdminReports',state.token); if(generation !== reportsGeneration || !state.token) return;
      $('reportsSummary').textContent = 'รอตรวจ '+data.pending+' รายการ · แสดงล่าสุด '+data.reports.length+' จาก '+data.total+' รายการ';
      const fragment = document.createDocumentFragment();
      data.reports.forEach(report => {
        const row = create('article','report-item'); const heading = create('div','report-item-heading');
        heading.append(create('h4','',report.programName),create('span','report-state'+(report.status === 'closed' ? ' closed' : ''),report.status === 'closed' ? 'ปิดแล้ว' : 'รอตรวจ'));
        const date = new Date(report.createdAt); const metadata = ({unreachable:'เปิดโปรแกรมไม่ได้',wrong_link:'ลิงก์ไม่ถูกต้อง'})[report.reason] || 'ปัญหาลิงก์';
        row.append(heading,create('p','report-meta',metadata+' · '+(Number.isNaN(date.getTime()) ? '' : date.toLocaleString('th-TH',{timeZone:'Asia/Bangkok'}))));
        if(report.details) row.append(create('p','report-detail',report.details));
        const action = create('button','secondary-button',report.status === 'closed' ? 'เปิดรายงานอีกครั้ง' : 'ปิดรายงาน'); action.type='button';
        action.onclick = () => busy($('reportsPanel'),async () => {
          try { const result = await call('setReportStatus',state.token,report.id,report.status === 'closed' ? 'open' : 'closed',report.updatedAt); await refreshReports(); toast(result.backupWarning || 'บันทึกสถานะรายงานแล้ว'); }
          catch(err) { $('reportsError').textContent = err.message; }
        });
        row.append(action); fragment.append(row);
      });
      if(!data.reports.length) fragment.append(create('p','field-hint','ยังไม่มีรายงานปัญหา'));
      $('reportsList').replaceChildren(fragment); if(data.backupWarning) $('reportsError').textContent = data.backupWarning;
      const url = safeUrl(data.sheetUrl); if(url) { $('reportsSheetLink').href = url; $('reportsSheetLink').hidden = false; }
    } catch(err) { if(generation === reportsGeneration) { $('reportsError').textContent = err.message; $('reportsSummary').textContent = ''; } }
  }
  $('refreshReports').onclick = refreshReports;
  route(); load();
})();
