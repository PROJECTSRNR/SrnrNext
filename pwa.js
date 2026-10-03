'use strict';
(() => {
  const panel = document.getElementById('installPanel');
  const button = document.getElementById('installButton');
  const dialog = document.getElementById('installDialog');
  const status = document.getElementById('installStatus');
  const headerButton = document.getElementById('headerInstallButton');
  const nativeButton = document.getElementById('nativeInstallButton');
  const retryButton = document.getElementById('retryInstallCheck');
  if (!panel || !button || !dialog) return;
  const local = ['localhost','127.0.0.1'].includes(location.hostname);
  if (window.top !== window.self || !(location.protocol === 'https:' || local && location.protocol === 'http:') || window.SRNR_CONFIG?.preview) return;
  const mode = window.matchMedia('(display-mode: standalone)');
  const installed = () => mode.matches || navigator.standalone === true;
  let promptEvent = null;
  let confirmed = false, prompting = false, workerMessage = '', guideMessage = '', registrationTask = null;
  const apple = /iPhone|iPad|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const sync = () => {
    const hidden = installed() || confirmed;
    panel.hidden = hidden;
    if (headerButton) headerButton.hidden = hidden;
    if (nativeButton) { nativeButton.hidden = hidden || !promptEvent; nativeButton.disabled = prompting; }
    button.disabled = prompting;
    if (headerButton) headerButton.disabled = prompting;
    button.textContent = apple ? 'เพิ่มบนหน้าจอโฮม' : promptEvent ? 'ติดตั้งแอป' : 'ติดตั้ง / ดูวิธีติดตั้ง';
    status.textContent = promptEvent ? 'พร้อมติดตั้งบนเครื่องนี้ กดปุ่มติดตั้งเพื่อเปิดหน้าต่างของเบราว์เซอร์' : guideMessage || workerMessage || (apple ? 'บน iPhone และ iPad ให้ใช้ Safari แล้วเลือกแชร์ → เพิ่มไปยังหน้าจอโฮม' : 'เลือกวิธีสำหรับอุปกรณ์ของคุณ หากเบราว์เซอร์พร้อมติดตั้ง จะมีปุ่มติดตั้งบนเครื่องนี้ด้านบน');
    if (retryButton) retryButton.hidden = !workerMessage;
  };
  sync();
  if (mode.addEventListener) mode.addEventListener('change',sync);
  document.getElementById(apple ? 'installApple' : /Android/.test(navigator.userAgent) ? 'installAndroid' : 'installDesktop').open = true;
  const showGuide = message => {
    guideMessage = message || '';
    sync();
    if (!dialog.open) dialog.showModal();
  };
  document.getElementById('closeInstallDialog').onclick = () => dialog.close();
  window.addEventListener('beforeinstallprompt',event => {
    event.preventDefault();
    promptEvent = event;
    guideMessage = '';
    sync();
  });
  window.addEventListener('appinstalled',() => {
    promptEvent = null;
    confirmed = true;
    sync();
    if (dialog.open) dialog.close();
  });
  const install = async () => {
    if (prompting) return;
    if (!promptEvent) { showGuide(); return; }
    const event = promptEvent;
    promptEvent = null;
    prompting = true;
    sync();
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome !== 'accepted') showGuide('ยังไม่ได้ติดตั้ง คุณสามารถกลับมาติดตั้งผ่านเมนูเบราว์เซอร์ได้ภายหลัง');
      else { guideMessage = 'ยืนยันคำขอติดตั้งแล้ว เมื่อเบราว์เซอร์ติดตั้งเสร็จให้เปิดจากไอคอน SRNR NEXT'; sync(); }
    } catch { showGuide('กรุณาติดตั้งผ่านเมนูเบราว์เซอร์ตามขั้นตอนด้านบน'); }
    finally { prompting = false; sync(); }
  };
  button.onclick = install;
  if (headerButton) headerButton.onclick = install;
  if (nativeButton) nativeButton.onclick = install;
  if ('serviceWorker' in navigator) {
    const register = () => {
      if (registrationTask) return registrationTask;
      const failed = () => { workerMessage = 'ยังเตรียมไฟล์ติดตั้งบางส่วนไม่ได้ กรุณากดตรวจอีกครั้ง หากยังไม่พร้อมให้แจ้งผู้ดูแล'; sync(); };
      registrationTask = navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(registration => {
        const watch = worker => {
          if (!worker) return;
          const changed = () => {
            if (worker.state === 'activated') { workerMessage = ''; sync(); }
            if (worker.state === 'redundant') failed();
          };
          worker.addEventListener('statechange',changed);
          changed();
        };
        if (registration.active) { workerMessage = ''; sync(); }
        watch(registration.installing || registration.waiting);
        if (registration.addEventListener) registration.addEventListener('updatefound',() => watch(registration.installing));
      }).catch(failed).finally(() => { registrationTask = null; });
      return registrationTask;
    };
    if (retryButton) retryButton.onclick = async () => {
      retryButton.disabled = true;
      guideMessage = '';
      workerMessage = '';
      status.textContent = 'กำลังตรวจความพร้อม กรุณารอสักครู่';
      try { await register(); } finally { retryButton.disabled = false; sync(); }
    };
    // Register before the Google data iframe finishes loading.
    register();
  }
})();
