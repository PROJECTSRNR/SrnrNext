'use strict';
(() => {
  async function prepare(file) {
    if (!file || !['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('เลือกรูป PNG, JPG หรือ WebP เท่านั้น');
    if (!file.size || file.size > 5*1024*1024) throw new Error('เลือกรูปขนาดไม่เกิน 5 MB');
    const source=URL.createObjectURL(file), image=new Image();
    try {
      await new Promise((resolve,reject) => {
        const timer=setTimeout(()=>reject(new Error('อ่านรูปใช้เวลานาน กรุณาลองเลือกรูปใหม่')),15000);
        image.onload=()=>{clearTimeout(timer);resolve();}; image.onerror=()=>{clearTimeout(timer);reject(new Error('อ่านรูปไม่ได้ กรุณาเลือกรูป PNG, JPG หรือ WebP ที่เปิดได้ตามปกติ'));}; image.src=source;
      });
      if(!image.naturalWidth || !image.naturalHeight || image.naturalWidth*image.naturalHeight>16000000) throw new Error('รูปมีความละเอียดสูงเกินไป กรุณาลดขนาดก่อนอัปโหลด');
      const canvas=document.createElement('canvas'), context=canvas.getContext('2d');
      if(!context) throw new Error('เบราว์เซอร์นี้ไม่สามารถเตรียมรูปได้ กรุณาใช้ลิงก์รูปแทน');
      let scale=Math.min(1,512/image.naturalWidth,512/image.naturalHeight);
      for(let attempt=0;attempt<6;attempt++) {
        canvas.width=Math.max(1,Math.round(image.naturalWidth*scale)); canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
        context.drawImage(image,0,0,canvas.width,canvas.height);
        const dataUrl=canvas.toDataURL('image/png'), base64=dataUrl.split(',')[1];
        const size=base64.length*3/4-(base64.endsWith('==')?2:base64.endsWith('=')?1:0);
        if(size<=262144) return {mimeType:'image/png',base64,dataUrl,width:canvas.width,height:canvas.height,size};
        scale*=.75;
      }
      throw new Error('รูปยังมีขนาดใหญ่เกินไป กรุณาเลือกรูปอื่น');
    } finally { image.onload=null; image.onerror=null; URL.revokeObjectURL(source); }
  }
  window.SRNR_LOGO_UPLOAD=Object.freeze({prepare});
})();
