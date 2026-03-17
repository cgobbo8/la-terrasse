<script>
  import { onMount } from 'svelte';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';

  /**
   * @typedef {{ time: string, title: string, description: string, image: string, href: string, poleAccent: string }} TimeBlock
   */

  /** @type {{ timeBlocks: TimeBlock[], lang: string, sectionTitle: string, ctaLabel: string }} */
  let { timeBlocks, lang, sectionTitle, ctaLabel } = $props();

  let sectionEl = $state(null);
  let trackEl = $state(null);
  let introEl = $state(null);
  let useAnimation = $state(false);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 768;

    // ── Intro animation (title block) — all devices, respects reduced-motion ──
    if (!prefersReducedMotion && introEl) {
      import('gsap').then(({ gsap }) => {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 28, filter: 'blur(8px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'power3.out' }
            );
          });
        }, { threshold: 0.2 });
        obs.observe(introEl);
      });
    } else if (introEl) {
      introEl.style.opacity = '1';
    }

    if (prefersReducedMotion || !isDesktop) {
      useAnimation = false;
      return;
    }

    useAnimation = true;

    // Dynamic import to keep GSAP out of initial bundle
    let scrollTween;

    import('gsap').then(({ gsap }) => {
      return import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionEl || !trackEl) return;

        const cards = trackEl.querySelectorAll('.timeline-card');
        const RADIUS = 4000; // Virtual circle radius (px) — increase for subtler curve

        // Curved arc transforms: cards sit on a large virtual wheel
        function updateCurve() {
          const vCenter = window.innerWidth / 2;
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const d = rect.left + rect.width / 2 - vCenter;

            // Parabolic arc (≈ circle for small angles) — edges rise
            const y = -(d * d) / (2 * RADIUS);
            // Tangent tilt — halved for subtlety
            const rot = ((d / RADIUS) * (180 / Math.PI)) * 0.5;
            // Depth: slight scale + opacity falloff at edges
            const norm = Math.min(Math.abs(d) / (window.innerWidth * 0.8), 1);
            const sc = 1 - norm * 0.05;
            const op = 1 - norm * 0.3;

            card.style.transform = `translateY(${y}px) rotate(${rot}deg) scale(${sc})`;
            card.style.opacity = `${op}`;
          });
        }

        // Main horizontal scroll with curve update
        scrollTween = gsap.to(trackEl, {
          x: () => -(trackEl.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            pin: true,
            scrub: 1,
            end: () => `+=${trackEl.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            onUpdate: updateCurve,
          },
        });

        // Apply initial curve state + recalculate positions for sections below
        updateCurve();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
    };
  });
</script>

<section
  bind:this={sectionEl}
  class="journee-section relative pt-16 lg:pt-20 bg-offwhite overflow-hidden"
  role="region"
  aria-label={sectionTitle}
>
  <!-- Sunburst decoration — left center, variant 4 -->
  <div class="absolute top-[10%] -left-[6%] w-[clamp(180px,22vw,320px)] aspect-square pointer-events-none sunburst-journee" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="#FFFF80" class="w-full h-full">
      <path d="M 85.0 74.0 C 77.3 55.4 81.0 29.0 110.2 2.5 C 124.2 25.4 121.5 60.5 115.0 74.0 C 127.2 58.1 152.0 48.0 189.5 60.1 C 176.7 83.7 145.0 98.8 130.0 100.0 C 149.9 102.6 171.0 119.0 179.3 157.6 C 152.5 158.3 123.5 138.4 115.0 126.0 C 122.7 144.6 119.0 171.0 89.8 197.5 C 75.8 174.6 78.5 139.5 85.0 126.0 C 72.8 141.9 48.0 152.0 10.5 139.9 C 23.3 116.3 55.0 101.2 70.0 100.0 C 50.1 97.4 29.0 81.0 20.7 42.4 C 47.5 41.7 76.5 61.6 85.0 74.0 Z" />
    </svg>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-8 lg:mb-10" bind:this={introEl} style="opacity: 0;">
      <p class="section-eyebrow text-brun-terre/40 mb-4" style="display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Votre journée</p>
      <h2 class="font-heading text-3xl lg:text-5xl font-bold text-brun-terre">
        {sectionTitle}
      </h2>
    </div>
  </div>

  {#if useAnimation}
    <!-- Desktop animated horizontal scroll -->
    <div
      bind:this={trackEl}
      class="journee-track flex flex-nowrap items-center gap-6 pl-[10vw]"
    >
      {#each timeBlocks as block, i}
        <article
          class="timeline-card min-w-[80vw] md:min-w-[50vw] lg:min-w-[33vw] max-w-md flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200/60 bg-white"
          style="will-change: transform, opacity;"
        >
          <div class="aspect-[16/9] overflow-hidden relative">
            <img
              src={block.image}
              alt={block.title}
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <!-- Time badge overlay -->
            <div class="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-bold backdrop-blur-sm" style="background-color: {block.poleAccent}cc;">
              {block.time}
            </div>
          </div>
          <div class="p-6">
            <h3 class="font-heading font-bold text-xl text-brun-terre mb-2">
              {block.title}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">
              {block.description}
            </p>
            {#if block.href !== '#'}
              <a
                href={block.href}
                class="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                style="color: {block.poleAccent}"
              >
                {ctaLabel}
                <ArrowRight class="w-4 h-4" size={16} />
              </a>
            {/if}
          </div>
        </article>
      {/each}
      <!-- Spacer so last card can fully enter viewport -->
      <div class="min-w-[10vw] flex-shrink-0" aria-hidden="true"></div>
    </div>
  {:else}
    <!-- Static fallback: mobile + reduced motion -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each timeBlocks as block}
          <article class="rounded-2xl overflow-hidden border border-gray-200/60 bg-white">
            <div class="aspect-[16/9] overflow-hidden relative">
              <img
                src={block.image}
                alt={block.title}
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-bold backdrop-blur-sm" style="background-color: {block.poleAccent}cc;">
                {block.time}
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-heading font-bold text-xl text-brun-terre mb-2">
                {block.title}
              </h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {block.description}
              </p>
              {#if block.href !== '#'}
                <a
                  href={block.href}
                  class="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                  style="color: {block.poleAccent}"
                >
                  {ctaLabel}
                  <ArrowRight class="w-4 h-4" size={16} />
                </a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  @keyframes sunburst-slow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .sunburst-journee {
    animation: sunburst-slow-spin 35s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .sunburst-journee {
      animation: none;
    }
  }
</style>
