// Monta o CircularCarousel (React Bits) na seção "Resultados Comprovados no WhatsApp".
import { createRoot } from 'react-dom/client';
import CircularCarousel from './CircularCarousel.jsx';

function mount() {
  const el = document.getElementById('proofsCarousel');
  const data = document.getElementById('proofsData');
  if (!el || !data) return;
  const items = JSON.parse(data.textContent);
  let active = 0;

  const small = window.matchMedia('(max-width: 720px)').matches;

  createRoot(el).render(
    <CircularCarousel
      items={items}
      preset="cylinder"
      intro="rise"
      cardWidth={small ? 180 : 220}
      aspectRatio={9 / 16}
      speed={14}
      captions
      fadeColor="#0a0a0a"
      onChange={i => { active = i; }}
      onItemClick={(item, index) => {
        // 1º clique traz o print para a frente; clique no print da frente amplia
        if (index === active && window.openImageModal) window.openImageModal(item.src, item.caption || item.title);
      }}
    />
  );
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
