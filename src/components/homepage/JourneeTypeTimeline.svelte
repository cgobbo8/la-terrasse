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

        const cards = Array.from(trackEl.querySelectorAll('.timeline-card'));
        const RADIUS = 4000; // Virtual circle radius (px) — increase for subtler curve

        // Curved arc transforms: cards sit on a large virtual wheel
        function updateCurve() {
          const vCenter = window.innerWidth / 2;
          // Batch reads (avoid layout thrashing)
          const centers = cards.map((card) => {
            const rect = card.getBoundingClientRect();
            return rect.left + rect.width / 2;
          });
          // Batch writes
          centers.forEach((center, i) => {
            const d = center - vCenter;
            const y = -(d * d) / (2 * RADIUS);
            const rot = ((d / RADIUS) * 57.2958) * 0.5;
            const norm = Math.min(Math.abs(d) / (window.innerWidth * 0.8), 1);
            const sc = 1 - norm * 0.05;
            const op = 1 - norm * 0.3;
            cards[i].style.transform = `translateY(${y}px) rotate(${rot}deg) scale(${sc})`;
            cards[i].style.opacity = `${op}`;
          });
        }

        // Extra scroll so last card reaches center before unpin
        const EXTRA_SCROLL = window.innerWidth * 0.5;

        // onUpdate on the TWEEN (not ScrollTrigger) — stays in sync with scrub
        scrollTween = gsap.to(trackEl, {
          x: () => -(trackEl.scrollWidth - window.innerWidth + EXTRA_SCROLL),
          ease: 'none',
          onUpdate: updateCurve,
          scrollTrigger: {
            trigger: sectionEl,
            pin: true,
            scrub: 1,
            end: () => `+=${trackEl.scrollWidth - window.innerWidth + EXTRA_SCROLL}`,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              // Style pin-spacer background to avoid white gap
              if (self.spacer) {
                self.spacer.style.backgroundColor = '#FFFBF5';
              }
            },
          },
        });

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
  class={`journee-section relative bg-offwhite overflow-hidden ${useAnimation ? 'min-h-screen flex flex-col justify-center' : 'pt-16 lg:pt-20'}`}
  role="region"
  aria-label={sectionTitle}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16 lg:mb-24" bind:this={introEl} style="opacity: 0;">
      <p class="section-eyebrow text-brun-terre/40 mb-4">Votre journée</p>
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
          class="timeline-card min-w-[80vw] md:min-w-[min(50vw,520px)] lg:min-w-[min(33vw,520px)] max-w-[520px] flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200/60 bg-white"
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

