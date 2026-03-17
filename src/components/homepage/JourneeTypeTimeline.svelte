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
    let cardTweens = [];

    import('gsap').then(({ gsap }) => {
      return import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionEl || !trackEl) return;

        // Main horizontal scroll
        scrollTween = gsap.to(trackEl, {
          x: () => -(trackEl.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            pin: true,
            scrub: 1,
            end: () => `+=${trackEl.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          },
        });

        // The pin spacer is now in the DOM — recalculate all ScrollTrigger positions
        // so sections below (e.g. SoireesSection) have correct trigger offsets
        ScrollTrigger.refresh();

        // Card entrance animations — skip cards already visible at start
        const cards = trackEl.querySelectorAll('.timeline-card');
        const viewportWidth = window.innerWidth;
        cards.forEach((card) => {
          // Cards already in viewport at start: no entrance animation
          if (card.offsetLeft + card.offsetWidth < viewportWidth) return;

          const tween = gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 100%',
              toggleActions: 'play none none reverse',
            },
          });
          cardTweens.push(tween);
        });
      });
    });

    return () => {
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
      cardTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  });
</script>

<section
  bind:this={sectionEl}
  class="journee-section py-16 lg:py-28 bg-offwhite overflow-hidden"
  role="region"
  aria-label={sectionTitle}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-14 lg:mb-20" bind:this={introEl} style="opacity: 0;">
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
      class="journee-track flex flex-nowrap gap-6 pl-[10vw]"
    >
      {#each timeBlocks as block, i}
        <article
          class="timeline-card min-w-[80vw] md:min-w-[50vw] lg:min-w-[33vw] max-w-md flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200/60 bg-white"
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
