'use strict';
(() => {
  const LIMIT = 2000;
  const validId = id => typeof id === 'string' && id.length > 0 && id.length <= 100;
  function read(raw) {
    try {
      if (!raw || raw.length > 450000) return {order:[],pinned:[]};
      const data = JSON.parse(raw);
      if (data.version !== 1 || !Array.isArray(data.order) || !Array.isArray(data.pinned)) return {order:[],pinned:[]};
      const ids = values => [...new Set(values.filter(validId))].slice(0,LIMIT);
      return {order:ids(data.order),pinned:ids(data.pinned)};
    } catch { return {order:[],pinned:[]}; }
  }
  const defaultOrder = (a,b) => Number(!!b.recommended)-Number(!!a.recommended) || a.order-b.order || a.name.localeCompare(b.name,'th') || a.id.localeCompare(b.id);
  function create({storage,key}) {
    let prefs;
    try { prefs = read(storage.getItem(key)); } catch { prefs = read(null); }
    let pins = new Set(prefs.pinned);
    const persist = () => { try { storage.setItem(key,JSON.stringify({version:1,...prefs})); return true; } catch { return false; } };
    const isPinned = id => pins.has(id);
    function ordered(programs) {
      const positions = new Map(prefs.order.map((id,i) => [id,i]));
      return programs.filter(p => p.visible).slice().sort((a,b) => Number(pins.has(b.id))-Number(pins.has(a.id)) ||
        (positions.get(a.id) ?? Infinity)-(positions.get(b.id) ?? Infinity) || defaultOrder(a,b));
    }
    function move(id,targetId,placement,programs) {
      const list = ordered(programs), source = list.find(p => p.id === id), target = list.find(p => p.id === targetId);
      if (!source || !target || id === targetId || !['before','after'].includes(placement)) return {changed:false,reason:'missing'};
      if (isPinned(id) !== isPinned(targetId)) return {changed:false,reason:'group'};
      if (list.length > LIMIT) return {changed:false,reason:'limit'};
      const next = list.filter(p => p.id !== id).map(p => p.id), index = next.indexOf(targetId)+(placement === 'after' ? 1 : 0);
      next.splice(index,0,id);
      if (next.every((value,i) => value === list[i].id)) return {changed:false,reason:'same'};
      // Retain ids absent from this public snapshot; cached/filtered data must not erase personal choices.
      const visible = new Set(next);
      prefs.order = [...next,...prefs.order.filter(value => !visible.has(value))].slice(0,LIMIT);
      return {changed:true,stored:persist()};
    }
    return {
      ordered,isPinned,move,
      snapshot:() => ({order:[...prefs.order],pinned:[...prefs.pinned]}),
      reload(raw) { prefs = read(raw); pins = new Set(prefs.pinned); },
      togglePin(id) {
        if (!validId(id)) return {changed:false,reason:'missing'};
        if (isPinned(id)) prefs.pinned = prefs.pinned.filter(value => value !== id);
        else { if(prefs.pinned.length >= LIMIT) return {changed:false,reason:'limit'}; prefs.pinned.push(id); }
        pins = new Set(prefs.pinned);
        return {changed:true,stored:persist()};
      },
      moveBy(id,direction,programs) {
        const group = ordered(programs).filter(p => isPinned(p.id) === isPinned(id)), index = group.findIndex(p => p.id === id);
        if (index < 0 || ![-1,1].includes(direction) || !group[index+direction]) return {changed:false,reason:'edge'};
        return move(id,group[index+direction].id,direction < 0 ? 'before' : 'after',programs);
      },
      reset() {
        prefs = {order:[],pinned:[]};
        pins = new Set();
        try { storage.removeItem(key); return {changed:true,stored:true}; } catch { return {changed:true,stored:false}; }
      }
    };
  }
  window.SRNR_PERSONAL_LAYOUT = Object.freeze({create});
})();
