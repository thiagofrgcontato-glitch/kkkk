# CircularCarousel (React Bits)

Componente original: https://reactbits.dev/components/circular-carousel (variante JS-CSS).
Usado na seção "Resultados Comprovados no WhatsApp".

O site é HTML puro (sem React instalado), então o componente foi "empacotado" junto com o React 18
num único arquivo: `assets/js/circular-carousel.js` (+ `assets/css/circular-carousel.css`).

Os prints exibidos vêm do bloco `<script type="application/json" id="proofsData">` no index.html —
para trocar/adicionar prints, edite esse bloco (src, alt, title, subtitle, caption).

Para alterar a configuração (preset, velocidade, tamanho) edite `entry.jsx` e gere o pacote de novo:

    npm install react@18.3.1 react-dom@18.3.1 esbuild
    npx esbuild entry.jsx --bundle --minify --format=iife --jsx=automatic --loader:.jsx=jsx \
      --define:process.env.NODE_ENV=\"production\" --target=es2018 --outfile=out/circular-carousel.js
