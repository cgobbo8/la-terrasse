<script lang="ts">
  import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-svelte';

  interface NearbyPlace {
    name: string;
    categories: string[];
    categoryLabels: string[];
    description: string;
    image: string;
    url: string;
  }

  interface Props {
    places: NearbyPlace[];
    eyebrow: string;
    title: string;
    visitLabel: string;
    allLabel: string;
    categoryMap: Record<string, string>;
  }

  let { places, eyebrow, title, visitLabel, allLabel, categoryMap }: Props = $props();

  let activeFilter = $state('all');
  let track: HTMLElement | undefined = $state();
  let showNav = $state(false);

  const filteredPlaces = $derived(
    activeFilter === 'all'
      ? places
      : places.filter((p) => p.categories.includes(activeFilter))
  );

  const availableFilters = $derived(() => {
    const counts = new Map<string, number>();
    for (const place of places) {
      for (const cat of place.categories) {
        counts.set(cat, (counts.get(cat) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, label: categoryMap[value] || value, count }))
      .sort((a, b) => b.count - a.count);
  });

  function checkOverflow() {
    if (track) {
      showNav = track.scrollWidth > track.clientWidth + 10;
    }
  }

  function scrollPrev() {
    track?.scrollBy({ left: -400, behavior: 'smooth' });
  }

  function scrollNext() {
    track?.scrollBy({ left: 400, behavior: 'smooth' });
  }

  $effect(() => {
    filteredPlaces;
    requestAnimationFrame(() => {
      checkOverflow();
    });
  });

  $effect(() => {
    if (track) {
      checkOverflow();
      const onResize = () => { checkOverflow(); };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  });

  $effect(() => {
    activeFilter;
    if (track) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  });
</script>

<section class="nearby-section">
  <div class="nearby-header">
    <div class="nearby-header-content">
      <p class="section-eyebrow" style="color: rgba(54, 52, 47, 0.3); margin-bottom: 1rem;">{eyebrow}</p>
      <h2 class="nearby-title">{title}</h2>
      <div class="nearby-filters">
        <button
          class="nearby-filter-btn"
          class:active={activeFilter === 'all'}
          onclick={() => (activeFilter = 'all')}
        >
          {allLabel}
        </button>
        {#each availableFilters() as filter}
          <button
            class="nearby-filter-btn"
            class:active={activeFilter === filter.value}
            onclick={() => (activeFilter = filter.value)}
          >
            {filter.label}
          </button>
        {/each}
      </div>
    </div>
    {#if showNav}
      <div class="nearby-nav">
        <button class="nearby-nav-btn" onclick={scrollPrev} aria-label="Précédent">
          <ArrowLeft size={16} />
        </button>
        <button class="nearby-nav-btn" onclick={scrollNext} aria-label="Suivant">
          <ArrowRight size={16} />
        </button>
      </div>
    {/if}
  </div>

  <div class="nearby-track" bind:this={track}>
    {#each filteredPlaces as place (place.name)}
      <a
        href={place.url}
        target="_blank"
        rel="noopener noreferrer"
        class="nearby-card"
      >
        <img
          src={place.image}
          alt={place.name}
          class="nearby-card-img"
          loading="lazy"
        />
        <div class="nearby-card-overlay"></div>
        <div class="nearby-card-content">
          <p class="nearby-card-category">{place.categoryLabels.join(' · ')}</p>
          <h3 class="nearby-card-name">{place.name}</h3>
          <p class="nearby-card-desc">{place.description}</p>
          <div class="nearby-card-link">
            <span>{visitLabel}</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  .nearby-section {
    padding: var(--spacing-section-mobile, 4rem) 0;
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .nearby-section {
      padding: var(--spacing-section, 6rem) 0;
    }
  }

  .nearby-header {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 640px) {
    .nearby-header {
      padding: 0 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .nearby-header {
      padding: 0 2rem;
      margin-bottom: 3.5rem;
    }
  }

  .nearby-title {
    font-family: var(--font-heading, 'Syne', sans-serif);
    font-size: 1.875rem;
    font-weight: 700;
    color: #36342F;
    line-height: 1.2;
    margin-bottom: 1.25rem;
  }

  @media (min-width: 1024px) {
    .nearby-title {
      font-size: 3rem;
    }
  }

  .nearby-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nearby-filter-btn {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-family: var(--font-heading, 'Syne', sans-serif);
    font-size: 0.8125rem;
    font-weight: 600;
    border: 1px solid rgba(54, 52, 47, 0.12);
    background: transparent;
    color: rgba(54, 52, 47, 0.5);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nearby-filter-btn:hover {
    border-color: rgba(54, 52, 47, 0.3);
    color: #36342F;
  }

  .nearby-filter-btn.active {
    background: #36342F;
    color: white;
    border-color: #36342F;
  }

  .nearby-nav {
    display: none;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    margin-left: 2rem;
  }

  @media (min-width: 1024px) {
    .nearby-nav {
      display: flex;
    }
  }

  .nearby-nav-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    border: 1px solid rgba(54, 52, 47, 0.15);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(54, 52, 47, 0.4);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nearby-nav-btn:hover {
    color: #36342F;
    border-color: rgba(54, 52, 47, 0.3);
  }

  .nearby-track {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding-left: 1rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .nearby-track::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    .nearby-track {
      gap: 1.5rem;
      padding-left: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .nearby-track {
      padding-left: 2rem;
    }
  }

  @media (min-width: 1280px) {
    .nearby-track {
      padding-left: calc((100vw - 80rem) / 2 + 2rem);
    }
  }

  /* Card */
  .nearby-card {
    position: relative;
    flex-shrink: 0;
    width: 280px;
    aspect-ratio: 3 / 4;
    border-radius: 1rem;
    overflow: hidden;
    text-decoration: none;
  }

  @media (min-width: 640px) {
    .nearby-card {
      width: 320px;
    }
  }

  @media (min-width: 1024px) {
    .nearby-card {
      width: 360px;
    }
  }

  .nearby-card-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .nearby-card:hover .nearby-card-img {
    transform: scale(1.06);
  }

  .nearby-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.18) 50%, transparent 100%);
    pointer-events: none;
  }

  .nearby-card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem;
  }

  .nearby-card-category {
    font-size: 0.6875rem;
    font-family: var(--font-heading, 'Syne', sans-serif);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #FFFF80;
    margin-bottom: 0.5rem;
  }

  .nearby-card-name {
    font-family: var(--font-heading, 'Syne', sans-serif);
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    line-height: 1.3;
    margin: 0;
  }

  @media (min-width: 1024px) {
    .nearby-card-name {
      font-size: 1.5rem;
    }
  }

  .nearby-card-desc {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .nearby-card-link {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .nearby-card:hover .nearby-card-link {
    color: rgba(255, 255, 255, 0.85);
  }
</style>
