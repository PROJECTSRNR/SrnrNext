'use strict';
// Only the public Hub listing belongs here. Admin sessions and reports never enter this cache.
(() => {
  const MAX_AGE = 24 * 60 * 60 * 1000, MAX_CHARS = 1000000;
  function publicData(input) {
    if (!input || !Array.isArray(input.programs) || input.programs.length > 1000 || !input.settings) return null;
    const text = (value, max) => typeof value === 'string' && value.length <= max;
    const url = (value, http = false) => {
      if (value === '') return true;
      try { const u = new URL(value); return text(value,2000) && !u.username && !u.password && (u.protocol === 'https:' || http && u.protocol === 'http:'); }
      catch { return false; }
    };
    if (!text(input.settings.collegeName,200) || !url(input.settings.collegeLogo)) return null;
    const programs = [], ids = new Set();
    for (const p of input.programs) {
      if (!p || p.visible !== true) continue;
      if (!text(p.id,100) || !p.id || ids.has(p.id) || !text(p.name,100) || !p.name ||
          !text(p.description,500) || !['teacher','student','all'].includes(p.category) ||
          !url(p.url,true) || !url(p.logo) || !['blue','indigo','teal','orange','purple'].includes(p.color) ||
          !Number.isInteger(p.order) || p.order < 0 || p.order > 9999 ||
          p.recommended !== undefined && typeof p.recommended !== 'boolean' ||
          !['ready','maintenance'].includes(p.serviceStatus || 'ready')) return null;
      const item = {id:p.id,name:p.name,description:p.description,category:p.category,url:p.url,logo:p.logo,color:p.color,order:p.order,visible:true,recommended:!!p.recommended,serviceStatus:p.serviceStatus || 'ready'};
      for (const [key,max] of [['statusNote',200],['subcategory',60],['howTo',2000],['requirements',1000],['contact',500]]) {
        const value = p[key] === undefined ? '' : p[key];
        if (!text(value,max)) return null;
        item[key] = value;
      }
      const tags = p.tags === undefined ? [] : p.tags;
      if (!Array.isArray(tags) || tags.length > 12 || tags.some(tag => !text(tag,30))) return null;
      item.tags = [...tags]; item.contactUrl = p.contactUrl === undefined ? '' : p.contactUrl;
      if (!url(item.contactUrl)) return null;
      ids.add(p.id); programs.push(item);
    }
    return {programs,settings:{collegeName:input.settings.collegeName,collegeLogo:input.settings.collegeLogo}};
  }
  function create({storage,key,now = () => Date.now()}) {
    const clear = () => { try { storage.removeItem(key); } catch {} };
    return {
      clear,
      read() {
        try {
          const raw = storage.getItem(key); if (!raw) return null;
          if (raw.length > MAX_CHARS) { clear(); return null; }
          const record = JSON.parse(raw), age = now() - record.savedAt;
          if (record.version !== 1 || !Number.isFinite(record.savedAt) || record.savedAt <= 0 || age < 0 || age > MAX_AGE) { clear(); return null; }
          const data = publicData(record.data);
          if (!data) { clear(); return null; }
          return {data,savedAt:record.savedAt};
        } catch { clear(); return null; }
      },
      write(input) {
        const data = publicData(input); if (!data) { clear(); return false; }
        const raw = JSON.stringify({version:1,savedAt:now(),data});
        if (raw.length > MAX_CHARS) { clear(); return false; }
        try { storage.setItem(key,raw); return true; } catch { clear(); return false; }
      }
    };
  }
  window.SRNR_PUBLIC_CACHE = Object.freeze({create});
})();
