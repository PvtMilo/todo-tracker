export async function compressToWebP(file, maxSide=1600, targetKB=350) {
  const img = await readImage(file);
  const {canvas, ctx} = makeCanvas(img, maxSide);
  let quality = 0.85;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  // reduce quality if too big
  for(let i=0;i<5 && blob.size/1024 > targetKB;i++){
    quality = Math.max(0.5, quality - 0.1);
    blob = await canvasToBlob(canvas, "image/webp", quality);
  }
  return new File([blob], file.name.replace(/\.\w+$/,"") + ".webp", {type:"image/webp"});
}

function readImage(file){
  return new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = ()=>res(img);
      img.onerror = rej;
      img.src = fr.result;
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}
function makeCanvas(img, maxSide){
  const c = document.createElement("canvas");
  let {width:w, height:h} = img;
  const m = Math.max(w,h);
  if(m > maxSide){
    const s = maxSide / m;
    w = Math.round(w*s); h = Math.round(h*s);
  }
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  return {canvas:c, ctx};
}
function canvasToBlob(canvas, type, quality){
  return new Promise((res)=> canvas.toBlob(res, type, quality));
}
