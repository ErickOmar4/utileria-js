
(function (global) {
  'use strict';

  var UIKit = {};


  UIKit.modal = function (options) {
    options = options || {};

    // 1. Crear el fondo oscuro (overlay)
    var overlay = document.createElement('div');
    overlay.className = 'uikit-modal-overlay';

    // 2. Crear la caja del modal
    var box = document.createElement('div');
    box.className = 'uikit-modal-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    // 3. Botón de cerrar
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'uikit-modal-close';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.innerHTML = '&times;';

    // 4. Título (opcional)
    if (options.title) {
      var titleEl = document.createElement('h3');
      titleEl.className = 'uikit-modal-title';
      titleEl.textContent = options.title;
      box.appendChild(titleEl);
    }

    // 5. Contenido (acepta HTML simple o texto plano)
    var contentEl = document.createElement('div');
    contentEl.className = 'uikit-modal-content';
    contentEl.innerHTML = options.content || '';
    box.appendChild(contentEl);

    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.body.classList.add('uikit-no-scroll');

    function close() {
      overlay.remove();
      document.body.classList.remove('uikit-no-scroll');
      document.removeEventListener('keydown', onKeyDown);
      if (typeof options.onClose === 'function') options.onClose();
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') close();
    }

    // Cerrar al hacer clic en la "X", fuera de la caja, o con la tecla Escape
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKeyDown);

    return { close: close, element: overlay };
  };

  /* =============== 2) TOOLTIP====================================== */

  /**
   * Agrega un tooltip (globo de ayuda) a un elemento.
   * @param {string|Element} target - Selector o elemento al que se le agrega el tooltip.
   * @param {Object} options
   * @param {string} options.text      - Texto que muestra el tooltip.
   * @param {string} [options.position] - "top" | "bottom" | "left" | "right" (por defecto "top").
   */
  UIKit.tooltip = function (target, options) {
    options = options || {};
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    var position = options.position || 'top';
    var text = options.text || '';
    var bubble = null;

    function showBubble() {
      bubble = document.createElement('div');
      bubble.className = 'uikit-tooltip uikit-tooltip--' + position;
      bubble.textContent = text;
      document.body.appendChild(bubble);

      var rect = el.getBoundingClientRect();
      var bubbleRect = bubble.getBoundingClientRect();
      var top, left;

      if (position === 'top') {
        top = rect.top - bubbleRect.height - 8;
        left = rect.left + rect.width / 2 - bubbleRect.width / 2;
      } else if (position === 'bottom') {
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - bubbleRect.width / 2;
      } else if (position === 'left') {
        top = rect.top + rect.height / 2 - bubbleRect.height / 2;
        left = rect.left - bubbleRect.width - 8;
      } else { // right
        top = rect.top + rect.height / 2 - bubbleRect.height / 2;
        left = rect.right + 8;
      }

      bubble.style.top = (top + window.scrollY) + 'px';
      bubble.style.left = (left + window.scrollX) + 'px';
    }

    function hideBubble() {
      if (bubble) {
        bubble.remove();
        bubble = null;
      }
    }

    el.addEventListener('mouseenter', showBubble);
    el.addEventListener('mouseleave', hideBubble);
    el.addEventListener('focus', showBubble);
    el.addEventListener('blur', hideBubble);
  };

  /* ========  3) CARRUSEL ======================================= */

  /**
   * Convierte un contenedor vacío en un carrusel de imágenes.
   * @param {string|Element} target - Selector o elemento contenedor.
   * @param {Object} options
   * @param {string[]} options.images  - Lista de URLs de imágenes.
   * @param {number} [options.interval] - Milisegundos entre cambios automáticos (0 = sin autoplay).
   */
  UIKit.carousel = function (target, options) {
    options = options || {};
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    var images = options.images || [];
    var interval = options.interval !== undefined ? Number(options.interval) : 4000;
    var current = 0;
    var timer = null;

    el.classList.add('uikit-carousel');
    el.innerHTML = '';

    // Contenedor de las imágenes (una detrás de otra, se desplaza con transform)
    var track = document.createElement('div');
    track.className = 'uikit-carousel-track';

    images.forEach(function (src) {
      var slide = document.createElement('div');
      slide.className = 'uikit-carousel-slide';
      var img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });
    el.appendChild(track);

    // Botones de navegación
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'uikit-carousel-btn uikit-carousel-btn--prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.innerHTML = '&#10094;';

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'uikit-carousel-btn uikit-carousel-btn--next';
    nextBtn.setAttribute('aria-label', 'Siguiente');
    nextBtn.innerHTML = '&#10095;';

    el.appendChild(prevBtn);
    el.appendChild(nextBtn);

    // Puntos indicadores
    var dots = document.createElement('div');
    dots.className = 'uikit-carousel-dots';
    images.forEach(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'uikit-carousel-dot';
      dot.addEventListener('click', function () { goTo(index); });
      dots.appendChild(dot);
    });
    el.appendChild(dots);

    function update() {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      var allDots = dots.querySelectorAll('.uikit-carousel-dot');
      allDots.forEach(function (dot, index) {
        dot.classList.toggle('uikit-carousel-dot--active', index === current);
      });
    }

    function goTo(index) {
      current = (index + images.length) % images.length;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
    nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

    function startAutoplay() {
      if (interval > 0 && images.length > 1) {
        timer = setInterval(next, interval);
      }
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Pausar el autoplay mientras el mouse está encima
    el.addEventListener('mouseenter', stopAutoplay);
    el.addEventListener('mouseleave', startAutoplay);

    update();
    startAutoplay();

    return { goTo: goTo, next: next, prev: prev, stop: stopAutoplay };
  };

  /* ======================================================================
   * 4) INICIALIZACIÓN AUTOMÁTICA DECLARATIVA (data-*)
   * Permite usar los componentes sin escribir NADA de JavaScript.===================== */

  function autoInit(root) {
    var scope = root || document;

    // Tooltips: <span data-ui-tooltip data-text="..." data-position="top">
    scope.querySelectorAll('[data-ui-tooltip]').forEach(function (el) {
      if (el.dataset.uikitInit) return;
      el.dataset.uikitInit = 'true';
      UIKit.tooltip(el, {
        text: el.dataset.text || '',
        position: el.dataset.position || 'top'
      });
    });

    // Carruseles: <div data-ui-carousel data-images="url1,url2" data-interval="4000">
    scope.querySelectorAll('[data-ui-carousel]').forEach(function (el) {
      if (el.dataset.uikitInit) return;
      el.dataset.uikitInit = 'true';
      var images = (el.dataset.images || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      UIKit.carousel(el, {
        images: images,
        interval: el.dataset.interval ? Number(el.dataset.interval) : 4000
      });
    });

    // Modales: <button data-ui-modal data-title="..." data-content="...">Abrir</button>
    scope.querySelectorAll('[data-ui-modal]').forEach(function (el) {
      if (el.dataset.uikitInit) return;
      el.dataset.uikitInit = 'true';
      el.addEventListener('click', function () {
        UIKit.modal({
          title: el.dataset.title || '',
          content: el.dataset.content || ''
        });
      });
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { autoInit(); });
    } else {
      autoInit();
    }
  }

  UIKit.autoInit = autoInit;

  // Exponer la librería como variable global `UIKit`
  global.UIKit = UIKit;
}(typeof window !== 'undefined' ? window : this));
