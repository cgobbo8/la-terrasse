<script>
  import { onMount } from 'svelte';

  const SESSION_KEY = 'la-terrasse-intro-seen';

  // Logo SVG path data (from ressources/assets/la-terasse-logo.svg)
  const logoPath =
    'M110.781 93.39C102.241 94.15 94.6406 94.22 86.5506 92.61C85.9806 92.48 85.4506 92.31 84.9006 92.16C79.2206 90.7 74.1506 88.49 68.7306 85.46C63.3606 82.51 56.0206 78.12 48.8206 76.53C43.9206 75.38 39.3406 75.42 35.0306 76.33L56.6707 24.28L82.7506 86.99L86.0106 87.83C86.2706 87.9 86.5306 87.97 86.7906 88.05C87.0306 88.12 87.2706 88.19 87.5206 88.25C93.7506 89.48 100.251 89.73 108.841 89.06L68.8906 0H44.6106L4.55065 90.18L0.010645 100.4C0.010645 100.45 0.000645758 100.51 0.000645758 100.56C-0.0493542 103.82 2.81064 106.63 6.34064 106.17C10.7106 105.58 14.3506 103.02 17.5706 101.36C20.5806 99.68 23.5606 98.05 26.6006 96.65C27.9606 96.02 29.3306 95.43 30.7206 94.92C42.1306 90.15 50.4007 96.25 61.5606 100.82C70.3506 104.81 80.4906 105.98 89.9406 104.29C97.8506 102.87 105.271 99.44 111.011 93.91C111.221 93.71 111.441 93.53 111.641 93.33C111.351 93.36 111.071 93.38 110.781 93.4V93.39Z';

  // Data URI for the logo mask layer (white fill = opaque in mask)
  // Use double quotes in SVG so encodeURIComponent encodes them (%22),
  // avoiding conflict with single quotes in CSS url('...')
  const logoMaskUri = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 107"><path d="${logoPath}" fill="white"/></svg>`
  )}`;

  let overlayEl = $state(null);
  let visible = $state(true);

  function updateMaskSize(size) {
    if (!overlayEl) return;
    const val = `${size}px auto, 100% 100%`;
    overlayEl.style.webkitMaskSize = val;
    overlayEl.style.maskSize = val;
  }

  onMount(() => {
    // Return visitor — skip entirely
    if (sessionStorage.getItem(SESSION_KEY)) {
      visible = false;
      return;
    }

    // Reduced motion — static logo 1s, then fade out
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(() => {
        if (!overlayEl) return;
        overlayEl.style.transition = 'opacity 0.5s ease-out';
        overlayEl.style.opacity = '0';
        setTimeout(() => {
          visible = false;
          sessionStorage.setItem(SESSION_KEY, 'true');
        }, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Full GSAP animation
    let tl;
    import('gsap').then(({ gsap }) => {
      if (!overlayEl) return;

      const displayLogo = overlayEl.querySelector('.display-logo');
      const maskState = { size: 0 };

      tl = gsap.timeline({
        onComplete: () => {
          visible = false;
          sessionStorage.setItem(SESSION_KEY, 'true');
        },
      });

      // Phase 1 (0–0.5s): logo at rest on brun-terre
      // Phase 2 (0.5–1.0s): display logo fades + mask opens to ~200px
      // Phase 3 (0.5–2.5s): mask scales to 5000px (hero fully revealed)
      // Phase 4 (2.2–2.5s): overlay fades out
      tl.to(displayLogo, {
        opacity: 0,
        duration: 0.6,
        ease: 'power1.in',
      }, 0.5)
        .to(maskState, {
          size: 200,
          duration: 0.6,
          ease: 'power1.in',
          onUpdate: () => updateMaskSize(maskState.size),
        }, 0.5)
        .to(maskState, {
          size: 5000,
          duration: 1.5,
          ease: 'power2.in',
          onUpdate: () => updateMaskSize(maskState.size),
        })
        .to(overlayEl, {
          opacity: 0,
          duration: 0.3,
        }, '-=0.3');
    });

    return () => {
      tl?.kill();
    };
  });
</script>

{#if visible}
  <div
    bind:this={overlayEl}
    class="logo-reveal-overlay"
    style:--logo-mask="url('{logoMaskUri}')"
    aria-hidden="true"
  >
    <!-- Display logo — visible initially, fades to reveal the mask animation -->
    <div class="display-logo">
      <svg
        width="120"
        height="114"
        viewBox="0 0 112 107"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={logoPath} fill="white" />
      </svg>
    </div>
  </div>
{/if}

<style>
  .logo-reveal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #2D2B1B;

    /* Two mask layers: logo (hole) XOR full coverage */
    -webkit-mask-image: var(--logo-mask), linear-gradient(white, white);
    mask-image: var(--logo-mask), linear-gradient(white, white);
    -webkit-mask-size: 0px auto, 100% 100%;
    mask-size: 0px auto, 100% 100%;
    -webkit-mask-position: center, center;
    mask-position: center, center;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-repeat: no-repeat, no-repeat;
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .display-logo {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Hide overlay for return visitors (class set by inline script before hydration) */
  :global(.intro-seen) .logo-reveal-overlay {
    display: none !important;
  }
</style>
