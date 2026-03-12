import { useRef } from 'react';

const processImage = (file, settings) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 1200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (size - w) / 2;
      const y = (size - h) / 2;
      ctx.fillStyle = '#f2f4f7';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, x, y, w, h);
      ctx.filter = 'none';
      if (settings.sharpness > 0) {
        ctx.globalAlpha = settings.sharpness / 100;
        ctx.drawImage(canvas, 0, 0);
        ctx.globalAlpha = 1;
      }
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = URL.createObjectURL(file);
  });

export default function ImageModule({ images, setImages, mainIndex, setMainIndex, settings, setSettings }) {
  const inputRef = useRef(null);

  const onFiles = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 10);
    const processed = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        originalUrl: URL.createObjectURL(file),
        enhancedUrl: await processImage(file, settings)
      }))
    );
    setImages(processed);
    setMainIndex(0);
  };

  const reorder = (index, direction) => {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  return (
    <section className="card">
      <div className="section-header">
        <h2>Module images</h2>
        <button className="button" onClick={() => inputRef.current?.click()}>Uploader 1-10 photos</button>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
      </div>

      <div className="slider-row">
        <label>Luminosité {settings.brightness}%<input type="range" min="90" max="120" value={settings.brightness} onChange={(e) => setSettings({ ...settings, brightness: Number(e.target.value) })} /></label>
        <label>Contraste {settings.contrast}%<input type="range" min="90" max="120" value={settings.contrast} onChange={(e) => setSettings({ ...settings, contrast: Number(e.target.value) })} /></label>
        <label>Netteté {settings.sharpness}%<input type="range" min="0" max="20" value={settings.sharpness} onChange={(e) => setSettings({ ...settings, sharpness: Number(e.target.value) })} /></label>
      </div>

      <div className="image-grid">
        {images.map((img, index) => (
          <article className={`image-card ${mainIndex === index ? 'main' : ''}`} key={img.name + index}>
            <div className="preview-row">
              <img src={img.originalUrl} alt="original" />
              <img src={img.enhancedUrl} alt="améliorée" />
            </div>
            <div className="image-actions">
              <button onClick={() => setMainIndex(index)}>Photo principale</button>
              <button onClick={() => reorder(index, -1)}>↑</button>
              <button onClick={() => reorder(index, 1)}>↓</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
