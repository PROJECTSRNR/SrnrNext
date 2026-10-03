'use strict';
(() => {
  const panel = document.getElementById('installPanel');
  const button = document.getElementById('installButton');
  const dialog = document.getElementById('installDialog');
  const status = document.getElementById('installStatus');
  if (!panel || !button || !dialog) return;
  const local = ['localhost','127.0.0.1'].includes(location.hostname);
  if (window.top !== window.self || !(location.protocol === 'https:' || local && location.protocol === 'http:') || window.SRNR_CONFIG?.preview) return;
  const mode = window.matchMedia('(display-mode: standalone)');
  const installed = () => mode.matches || navigator.standalone === true;
  let promptEvent = null;
  const sync = () => { panel.hidden = installed(); };
  sync();
  if (mode.addEventListener) mode.addEventListener('change',sync);
  const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  document.getElementById(apple ? 'installApple' : /Android/.test(navigator.userAgent) ? 'installAndroid' : 'installDesktop').open = true;
  const showGuide = message => {
    status.textContent = message || 'หากยังไม่มีหน้าต่างติดตั้ง ให้ใช้เมนูของเบราว์เซอร์ตามขั้นตอนด้านบน';
    if (!dialog.open) dialog.showModal();
  };
  document.getElementById('closeInstallDialog').onclick = () => dialog.close();
  window.addEventListener('beforeinstallprompt',event => {
    event.preventDefault();
    promptEvent = event;
    button.textContent = 'ติดตั้งแอป';
  });
  window.addEventListener('appinstalled',() => {
    promptEvent = null;
    panel.hidden = true;
    if (dialog.open) dialog.close();
  });
  button.onclick = async () => {
    if (!promptEvent) { showGuide(); return; }
    const event = promptEvent;
    promptEvent = null;
    button.disabled = true;
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome !== 'accepted') showGuide('ยังไม่ได้ติดตั้ง คุณสามารถกลับมาติดตั้งผ่านเมนูเบราว์เซอร์ได้ภายหลัง');
    } catch { showGuide('กรุณาติดตั้งผ่านเมนูเบราว์เซอร์ตามขั้นตอนด้านบน'); }
    finally { button.disabled = false; }
  };
  if ('serviceWorker' in navigator) {
    const register = () => navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(() => {
      // Manual installation remains available when a browser restricts workers.
    });
    if (document.readyState === 'complete') register();
    else window.addEventListener('load',register,{once:true});
  }
})();
