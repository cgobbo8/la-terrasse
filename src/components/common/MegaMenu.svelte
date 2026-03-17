<script lang="ts">
  import { tick } from 'svelte';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import CornerUpRight from 'lucide-svelte/icons/corner-up-right';
  import Leaf from 'lucide-svelte/icons/leaf';
  import Users from 'lucide-svelte/icons/users';
  import Sailboat from 'lucide-svelte/icons/sailboat';
  import Waves from 'lucide-svelte/icons/waves';
  import Flag from 'lucide-svelte/icons/flag';
  import Compass from 'lucide-svelte/icons/compass';
  import Building from 'lucide-svelte/icons/building';
  import Briefcase from 'lucide-svelte/icons/briefcase';
  import UtensilsCrossed from 'lucide-svelte/icons/utensils-crossed';
  import Trophy from 'lucide-svelte/icons/trophy';
  import Menu from 'lucide-svelte/icons/menu';
  import Music from 'lucide-svelte/icons/music';
  import Store from 'lucide-svelte/icons/store';
  import Sparkles from 'lucide-svelte/icons/sparkles';
  import ShoppingBag from 'lucide-svelte/icons/shopping-bag';
  import Presentation from 'lucide-svelte/icons/presentation';
  import GraduationCap from 'lucide-svelte/icons/graduation-cap';
  import Sun from 'lucide-svelte/icons/sun';
  import Phone from 'lucide-svelte/icons/phone';
  import type { Component } from 'svelte';

  const iconMap: Record<string, Component> = {
    menu: Menu,
    leaf: Leaf,
    users: Users,
    boat: Sailboat,
    waves: Waves,
    flag: Flag,
    compass: Compass,
    building: Building,
    briefcase: Briefcase,
    utensils: UtensilsCrossed,
    trophy: Trophy,
    music: Music,
    store: Store,
    sparkles: Sparkles,
    'shopping-bag': ShoppingBag,
    presentation: Presentation,
    'graduation-cap': GraduationCap,
    'sun': Sun,
  };

  interface SubLink {
    label: string;
    href: string;
    description?: string;
    icon?: string;
    category?: string;
  }

  interface Featured {
    title: string;
    description: string;
    href: string;
    cta: string;
    image?: string;
  }

  interface PoleNav {
    id: string;
    label: string;
    href: string;
    color: string;
    accentColor: string;
    subLinks: SubLink[];
    featured?: Featured;
    crossSell?: { text: string; href: string; targetPole: string };
  }

  interface AgendaLink {
    label: string;
    href: string;
  }

  let {
    poles,
    agendaLink,
    ctaLabel,
    ctaHref,
    ctaColor,
    ctaIcon = false,
    currentPole = null,
    languages,
    currentLang,
    langPaths,
    labelExplore = 'Explorer',
  }: {
    poles: PoleNav[];
    agendaLink: AgendaLink;
    ctaLabel: string;
    ctaHref: string;
    ctaColor: string;
    ctaIcon?: boolean;
    currentPole: string | null;
    languages: Record<string, string>;
    currentLang: string;
    langPaths: Record<string, string>;
    labelExplore?: string;
  } = $props();

  // Determine if CTA needs dark text (for light accent colors like soleil)
  function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  }
  const ctaTextColor = isLightColor(ctaColor) ? 'var(--color-brun-terre)' : 'white';

  let activeMenu = $state<string | null>(null);
  let closeTimeout = $state<ReturnType<typeof setTimeout> | null>(null);
  let triggerElements: Record<string, HTMLElement | null> = {};

  function openMenu(id: string) {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
    activeMenu = id;
  }

  function startClose() {
    closeTimeout = setTimeout(() => { activeMenu = null; }, 200);
  }

  function cancelClose() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
  }

  async function handleTriggerKeydown(e: KeyboardEvent, menuId: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeMenu === menuId) {
        activeMenu = null;
      } else {
        openMenu(menuId);
        await tick();
        const panel = document.querySelector(`[data-menu="${menuId}"]`);
        const firstItem = panel?.querySelector('[role="menuitem"]') as HTMLElement | null;
        firstItem?.focus();
      }
    } else if (e.key === 'Escape') {
      if (activeMenu === menuId) {
        activeMenu = null;
      }
    }
  }

  function handleMenuItemKeydown(e: KeyboardEvent, menuId: string) {
    const panel = document.querySelector(`[data-menu="${menuId}"]`);
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
    const currentIndex = items.indexOf(e.target as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      activeMenu = null;
      triggerElements[menuId]?.focus();
    }
  }

  function handleFocusOut(e: FocusEvent) {
    const container = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !container.contains(related)) {
      activeMenu = null;
    }
  }

  /** CSS variable helpers — reference global @theme variables by pole id */
  function poleVar(poleId: string): string {
    return `var(--color-${poleId})`;
  }
  function poleLightVar(poleId: string): string {
    return `var(--color-${poleId}-light)`;
  }

  /** Group subLinks by category when categories are present */
  function groupByCategory(links: SubLink[]): Map<string, SubLink[]> {
    const groups = new Map<string, SubLink[]>();
    for (const link of links) {
      const cat = link.category ?? '';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(link);
    }
    return groups;
  }

</script>

<div class="hidden lg:flex items-center gap-1">
  {#each poles as pole}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="relative"
      onmouseenter={() => openMenu(pole.id)}
      onmouseleave={startClose}
      onfocusout={handleFocusOut}
    >
      <a
        bind:this={triggerElements[pole.id]}
        href={pole.href}
        class="inline-flex items-center gap-1 px-3 py-5 text-sm font-medium transition-colors hover:text-brun-terre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
        style="{currentPole === pole.id ? `color: ${poleVar(pole.accentColor)}` : 'color: var(--color-gray-600)'}; outline-color: {poleVar(pole.accentColor)}"
        aria-haspopup="true"
        aria-expanded={activeMenu === pole.id}
        onkeydown={(e) => handleTriggerKeydown(e, pole.id)}
        data-nav-trigger
      >
        {pole.label}
        <ChevronDown
          class="w-3.5 h-3.5 transition-transform duration-200 {activeMenu === pole.id ? 'rotate-180' : ''}"
          size={14}
        />
      </a>

      {#if activeMenu === pole.id}
        {@const hasCategories = pole.subLinks.some(l => l.category)}
        {@const grouped = hasCategories ? groupByCategory(pole.subLinks) : null}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
          onmouseenter={cancelClose}
          onmouseleave={startClose}
        >
          <div
            class="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-6 grid grid-rows-[1fr_auto] gap-6 animate-[megaFadeIn_0.15s_ease-out]"
            class:grid-cols-[1fr_16rem]={!hasCategories}
            class:grid-cols-[1fr_1fr_16rem]={hasCategories}
            class:min-w-[40rem]={!hasCategories}
            class:min-w-[48rem]={hasCategories}
            role="menu"
            data-menu={pole.id}
          >
            {#if grouped}
              <!-- Multi-column: grouped by category -->
              {#each [...grouped.entries()] as [category, links]}
                <div>
                  <p class="text-[0.8125rem] font-bold uppercase tracking-wider mb-3" style="color: {poleVar(pole.accentColor)}">{category}</p>
                  {#each links as link}
                    <a
                      href={link.href}
                      role="menuitem"
                      class="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-offwhite transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
                      style="outline-color: {poleVar(pole.accentColor)}"
                      onkeydown={(e) => handleMenuItemKeydown(e, pole.id)}
                    >
                      <span
                        class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                        style="background-color: {poleLightVar(pole.accentColor)}; color: {poleVar(pole.accentColor)}"
                      >
                        <svelte:component this={iconMap[link.icon ?? 'compass']} class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
                      </span>
                      <span class="flex flex-col min-w-0">
                        <span class="text-sm font-semibold text-gray-800 leading-tight">{link.label}</span>
                        {#if link.description}
                          <span class="text-xs text-gray-400 mt-0.5 leading-tight">{link.description}</span>
                        {/if}
                      </span>
                    </a>
                  {/each}
                </div>
              {/each}
            {:else}
              <!-- Single column: flat list -->
              <div>
                <p class="text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">{labelExplore}</p>
                {#each pole.subLinks as link}
                  <a
                    href={link.href}
                    role="menuitem"
                    class="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-offwhite transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
                    style="outline-color: {poleVar(pole.accentColor)}"
                    onkeydown={(e) => handleMenuItemKeydown(e, pole.id)}
                  >
                    <span
                      class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style="background-color: {poleLightVar(pole.accentColor)}; color: {poleVar(pole.accentColor)}"
                    >
                      <svelte:component this={iconMap[link.icon ?? 'compass']} class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
                    </span>
                    <span class="flex flex-col min-w-0">
                      <span class="text-sm font-semibold text-gray-800 leading-tight">{link.label}</span>
                      {#if link.description}
                        <span class="text-xs text-gray-400 mt-0.5 leading-tight">{link.description}</span>
                      {/if}
                    </span>
                  </a>
                {/each}
              </div>
            {/if}

            <!-- Right: Featured card -->
            {#if pole.featured}
              <div>
                <a
                  href={pole.featured.href}
                  role="menuitem"
                  class="group flex flex-col rounded-xl overflow-hidden h-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
                  style="background-color: {poleLightVar(pole.accentColor)}; outline-color: {poleVar(pole.accentColor)}"
                  onkeydown={(e) => handleMenuItemKeydown(e, pole.id)}
                >
                  <div class="aspect-[16/10] overflow-hidden">
                    {#if pole.featured.image}
                      <img
                        src={pole.featured.image}
                        alt=""
                        class="w-full h-full object-cover card-zoom-img"
                        loading="lazy"
                      />
                    {:else}
                      <div
                        class="w-full h-full flex items-center justify-center"
                        style="background-color: color-mix(in srgb, {poleVar(pole.accentColor)} 12%, transparent)"
                      >
                        <span class="text-[0.6875rem] text-center px-2" style="color: color-mix(in srgb, {poleVar(pole.accentColor)} 25%, transparent)">
                          {pole.id === 'restaurant' ? 'Photo restaurant' : pole.id === 'aventure' ? 'Photo activités' : 'Photo salle'}
                        </span>
                      </div>
                    {/if}
                  </div>
                  <div class="p-3 flex flex-col gap-1 flex-1">
                    <span class="text-[0.8125rem] font-bold text-gray-800 leading-tight">{pole.featured.title}</span>
                    <span class="text-[0.6875rem] text-gray-600 leading-snug">{pole.featured.description}</span>
                    <span
                      class="inline-flex items-center gap-1 text-xs font-semibold mt-auto pt-1.5"
                      style="color: {poleVar(pole.accentColor)}"
                    >
                      {pole.featured.cta}
                      <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" size={14} />
                    </span>
                  </div>
                </a>
              </div>
            {/if}

            <!-- Bottom: Cross-sell -->
            {#if pole.crossSell}
              <div class="col-span-full border-t border-gray-100 pt-4">
                <a
                  href={pole.crossSell.href}
                  role="menuitem"
                  class="inline-flex items-center gap-2 text-xs font-medium italic hover:underline transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
                  style="color: {poleVar(pole.crossSell.targetPole)}; outline-color: {poleVar(pole.crossSell.targetPole)}"
                  onkeydown={(e) => handleMenuItemKeydown(e, pole.id)}
                >
                  <CornerUpRight class="w-3.5 h-3.5 shrink-0" size={14} />
                  {pole.crossSell.text}
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/each}

  <!-- Agenda link -->
  <a
    href={agendaLink.href}
    class="inline-flex items-center px-3 py-5 text-sm font-medium text-gray-400 hover:text-brun-terre transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded"
    style="outline-color: var(--color-brun-terre)"
    data-nav-trigger
  >
    {agendaLink.label}
  </a>

  <!-- Language switcher (pill) -->
  <div class="flex items-center rounded-full p-0.5 text-xs ml-2" data-lang-pill>
    {#each Object.entries(languages) as [code, _name]}
      <a
        href={langPaths[code] ?? '/'}
        class="uppercase px-2 py-1 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
        class:bg-white={currentLang === code}
        class:shadow-sm={currentLang === code}
        style="outline-color: var(--color-brun-terre)"
      >
        {code}
      </a>
    {/each}
  </div>

  <!-- CTA -->
  <a
    href={ctaHref}
    class="ml-2 min-h-11 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-full inline-flex items-center gap-2"
    style="background-color: {ctaColor}; color: {ctaTextColor}; outline-color: {ctaColor}"
  >
    {#if ctaIcon}<Phone class="w-4 h-4" strokeWidth={1.5} />{/if}
    {ctaLabel}
  </a>
</div>
