<script>
  import { onMount } from 'svelte';

  /**
   * @typedef {{ time: string, title: string, description: string, image: string, href: string, poleAccent: string }} TimeBlock
   */

  /** @type {{ timeBlocks: TimeBlock[], lang: string, sectionTitle: string, ctaLabel: string }} */
  let { timeBlocks, lang, sectionTitle, ctaLabel } = $props();

  let sectionEl = $state(null);
  let trackEl = $state(null);
  let useAnimation = $state(false);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 768;

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

        // Card entrance animations
        const cards = trackEl.querySelectorAll('.timeline-card');
        cards.forEach((card) => {
          const tween = gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 80%',
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
  class="journee-section py-(--spacing-section-mobile) lg:py-(--spacing-section) bg-offwhite overflow-hidden"
  role="region"
  aria-label={sectionTitle}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="font-heading text-3xl lg:text-4xl font-bold text-brun-terre text-center mb-12">
      {sectionTitle}
    </h2>
  </div>

  {#if useAnimation}
    <!-- Desktop animated horizontal scroll -->
    <div
      bind:this={trackEl}
      class="journee-track flex flex-nowrap gap-6 pl-[10vw]"
    >
      {#each timeBlocks as block, i}
        <article
          class="timeline-card min-w-[80vw] md:min-w-[50vw] lg:min-w-[33vw] max-w-md flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div class="aspect-[16/9] overflow-hidden">
            <img
              src={block.image}
              alt={block.title}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-3">
              <span
                class="timeline-dot w-3 h-3 rounded-full flex-shrink-0"
                style="background-color: {block.poleAccent}"
              ></span>
              <span
                class="font-heading font-bold text-lg"
                style="color: {block.poleAccent}"
              >{block.time}</span>
            </div>
            <h3 class="font-heading font-bold text-xl text-brun-terre mb-2">
              {block.title}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              {block.description}
            </p>
            {#if block.href !== '#'}
              <a
                href={block.href}
                class="inline-flex items-center text-sm font-medium transition-colors hover:opacity-80"
                style="color: {block.poleAccent}"
              >
                {ctaLabel} <span class="ml-1" aria-hidden="true">&rarr;</span>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each timeBlocks as block}
          <article class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="aspect-[16/9] overflow-hidden">
              <img
                src={block.image}
                alt={block.title}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class="w-3 h-3 rounded-full flex-shrink-0"
                  style="background-color: {block.poleAccent}"
                ></span>
                <span
                  class="font-heading font-bold text-lg"
                  style="color: {block.poleAccent}"
                >{block.time}</span>
              </div>
              <h3 class="font-heading font-bold text-xl text-brun-terre mb-2">
                {block.title}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                {block.description}
              </p>
              {#if block.href !== '#'}
                <a
                  href={block.href}
                  class="inline-flex items-center text-sm font-medium transition-colors hover:opacity-80"
                  style="color: {block.poleAccent}"
                >
                  {ctaLabel} <span class="ml-1" aria-hidden="true">&rarr;</span>
                </a>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  {/if}
</section>
