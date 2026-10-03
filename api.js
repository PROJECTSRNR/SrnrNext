'use strict';
(() => {
  if (location.protocol === 'file:' || (window.SRNR_CONFIG && window.SRNR_CONFIG.preview === true)) return;
  const protocol = 'srnr-hub-v1';
  const methods = Object.freeze({getPublicData:0,loginAdmin:1,logoutAdmin:1,getAdminData:1,saveProgram:3,deleteProgram:3,saveSettings:3,changeAdminPassword:3,getReportChallenge:1,submitLinkReport:1,getAdminReports:1,setReportStatus:4});
  const pending = new Map();
  let connection = null, connecting = null, serial = 0;
  const isLocal = url => ['localhost','127.0.0.1'].includes(url.hostname);
  function trustedBridgeOrigin(value) {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && (url.hostname === 'script.googleusercontent.com' || /^[a-z0-9-]+-script\.googleusercontent\.com$/.test(url.hostname))) return true;
      return isLocal(new URL(location.href)) && url.protocol === 'http:' && isLocal(url);
    } catch { return false; }
  }
  function createConnection() {
    return new Promise((resolve,reject) => {
      let url;
      try {
        url = new URL(window.SRNR_CONFIG && window.SRNR_CONFIG.apiUrl);
        const development = isLocal(new URL(location.href)) && url.protocol === 'http:' && isLocal(url);
        if ((!development && (url.protocol !== 'https:' || url.hostname !== 'script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname))) || url.username || url.password) throw new Error();
        if (location.origin === 'null') throw new Error();
      } catch { reject(new Error('กรุณาเปิดเว็บผ่าน GitHub Pages และตรวจลิงก์ /exec ใน config.js')); return; }
      if (!window.crypto || !crypto.getRandomValues || !window.MessageChannel) { reject(new Error('เบราว์เซอร์นี้ไม่รองรับการเชื่อมต่อ กรุณาใช้ Safari หรือ Chrome รุ่นปัจจุบัน')); return; }
      const channel = Array.from(crypto.getRandomValues(new Uint8Array(16)),value => value.toString(16).padStart(2,'0')).join('');
      const frame = document.createElement('iframe');
      frame.hidden = true; frame.tabIndex = -1; frame.setAttribute('aria-hidden','true'); frame.title = 'การเชื่อมข้อมูล SRNR NEXT'; frame.referrerPolicy = 'no-referrer';
      url.searchParams.set('bridge','1'); url.searchParams.set('parentOrigin',location.origin); url.searchParams.set('channel',channel); url.hash = ''; frame.src = url.href;
      let port = null, finished = false;
      const cleanup = () => { window.removeEventListener('message',ready); clearTimeout(timer); };
      const fail = message => { if (finished) return; finished = true; cleanup(); if (port) port.close(); frame.remove(); reject(new Error(message)); };
      const timer = setTimeout(() => fail('ยังเชื่อมข้อมูลไม่ได้ กรุณาตรวจว่าเพิ่ม Bridge และเผยแพร่ Apps Script เวอร์ชันใหม่แล้ว จากนั้นกดลองอีกครั้ง'),45000);
      function ready(event) {
        const message = event.data;
        if (port || !event.source || !trustedBridgeOrigin(event.origin) || !message || message.protocol !== protocol || message.type !== 'ready' || message.channel !== channel) return;
        const pair = new MessageChannel(); port = pair.port1;
        port.onmessage = event => {
          const reply = event.data;
          if (!reply || reply.protocol !== protocol || reply.channel !== channel) return;
          if (reply.type === 'connected' && !finished) { finished = true; cleanup(); resolve({port,channel,frame}); return; }
          if (!finished || reply.type !== 'response' || typeof reply.ok !== 'boolean') return;
          const request = pending.get(reply.id); if (!request) return;
          pending.delete(reply.id); clearTimeout(request.timer);
          if (reply.ok) request.resolve(reply.value); else request.reject(new Error(typeof reply.error === 'string' ? reply.error : 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ'));
        };
        port.start();
        try { event.source.postMessage({protocol,type:'connect',channel},event.origin,[pair.port2]); }
        catch { pair.port2.close(); fail('เชื่อมต่อไม่สำเร็จ กรุณารีเฟรชแล้วลองอีกครั้ง'); }
      }
      window.addEventListener('message',ready); document.body.append(frame);
    });
  }
  async function connect() {
    if (connection) return connection;
    if (!connecting) connecting = createConnection().then(value => { connection = value; connecting = null; return value; },error => { connecting = null; throw error; });
    return connecting;
  }
  async function call(method,...args) {
    if (!Object.hasOwn(methods,method) || args.length !== methods[method]) throw new Error('คำขอไม่ถูกต้อง');
    if (JSON.stringify(args).length > 32000) throw new Error('ข้อมูลคำขอมีขนาดใหญ่เกินไป');
    const remote = await connect();
    if (pending.size >= 8) throw new Error('มีคำขอพร้อมกันมากเกินไป กรุณารอสักครู่');
    return new Promise((resolve,reject) => {
      const id = 'request-'+(++serial);
      const timer = setTimeout(() => { pending.delete(id); reject(new Error('การตอบกลับใช้เวลานาน กรุณาตรวจข้อมูลล่าสุดก่อนบันทึกซ้ำ')); },60000);
      pending.set(id,{resolve,reject,timer});
      try { remote.port.postMessage({protocol,type:'request',channel:remote.channel,id,method,args}); }
      catch { clearTimeout(timer); pending.delete(id); reject(new Error('ส่งคำขอไม่สำเร็จ กรุณารีเฟรชแล้วลองอีกครั้ง')); }
    });
  }
  window.SRNR_API = Object.freeze({call});
})();
