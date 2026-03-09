<script lang="ts">
  interface SubLink {
    label: string;
    href: string;
    description?: string;
    icon?: string;
  }

  interface Featured {
    title: string;
    description: string;
    href: string;
    cta: string;
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

  interface TransversalItem {
    label: string;
    href: string;
    description: string;
  }

  let {
    poles,
    transversalItems,
    contactHref,
    contactLabel,
    currentPole = null,
    languages,
    currentLang,
    langPaths,
  }: {
    poles: PoleNav[];
    transversalItems: TransversalItem[];
    contactHref: string;
    contactLabel: string;
    currentPole: string | null;
    languages: Record<string, string>;
    currentLang: string;
    langPaths: Record<string, string>;
  } = $props();

  let activeMenu = $state<string | null>(null);
  let closeTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

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

  const bgLight: Record<string, string> = {
    restaurant: '#f5f0e8',
    aventure: '#eef5ec',
    evenements: '#edf0f5',
  };

  const accent: Record<string, string> = {
    restaurant: '#2D2B1B',
    aventure: '#537b47',
    evenements: '#3d4969',
  };

  const iconPaths: Record<string, string> = {
    menu: 'M3 6h18M3 12h18M3 18h18',
    leaf: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 2-.15 2.9-.43C10.93 18.05 8 14.34 8 10c0-1.34.25-2.62.7-3.8L12 2z',
    users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2M9 7a4 4 0 108 0 4 4 0 00-8 0zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    boat: 'M2 21l.5-2.5c.3-1.5 1.8-2.5 3.3-2.5h12.4c1.5 0 3 1 3.3 2.5L22 21M4 16l2-8h12l2 8M12 4v4',
    waves: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
    flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
    compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z',
    building: 'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
    briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
    utensils: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7',
    trophy: 'M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0012 0V2z',
  };
</script>

<div class="hidden lg:flex items-center gap-1">
  {#each poles as pole}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="relative"
      onmouseenter={() => openMenu(pole.id)}
      onmouseleave={startClose}
    >
      <a
        href={pole.href}
        class="inline-flex items-center gap-1 px-3 py-5 text-sm font-medium transition-colors hover:text-brun-terre"
        style={currentPole === pole.id ? `color: ${accent[pole.accentColor]}` : 'color: #6b6b67'}
      >
        {pole.label}
        <svg
          class="w-3.5 h-3.5 transition-transform duration-200"
          class:rotate-180={activeMenu === pole.id}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </a>

      {#if activeMenu === pole.id}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
          onmouseenter={cancelClose}
          onmouseleave={startClose}
        >
          <div class="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-6 grid grid-cols-[1fr_16rem] grid-rows-[1fr_auto] gap-6 min-w-[32rem] animate-[megaFadeIn_0.15s_ease-out]">
            <!-- Left: Sub links -->
            <div>
              <p class="text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">Explorer</p>
              {#each pole.subLinks as link}
                <a href={link.href} class="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-offwhite transition-colors group">
                  <span
                    class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style="background-color: {bgLight[pole.accentColor]}; color: {accent[pole.accentColor]}"
                  >
                    <svg class="w-[1.125rem] h-[1.125rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d={iconPaths[link.icon ?? 'compass']} />
                    </svg>
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

            <!-- Right: Featured card -->
            {#if pole.featured}
              <div>
                <a
                  href={pole.featured.href}
                  class="flex flex-col rounded-xl overflow-hidden h-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style="background-color: {bgLight[pole.accentColor]}"
                >
                  <div
                    class="aspect-[16/10] flex items-center justify-center"
                    style="background-color: {accent[pole.accentColor]}20"
                  >
                    <span class="text-[0.6875rem] text-center px-2" style="color: {accent[pole.accentColor]}40">
                      {pole.id === 'restaurant' ? 'Photo restaurant' : pole.id === 'aventure' ? 'Photo activités' : 'Photo salle'}
                    </span>
                  </div>
                  <div class="p-3 flex flex-col gap-1 flex-1">
                    <span class="text-[0.8125rem] font-bold text-gray-800 leading-tight">{pole.featured.title}</span>
                    <span class="text-[0.6875rem] text-gray-600 leading-snug">{pole.featured.description}</span>
                    <span
                      class="inline-flex items-center gap-1 text-xs font-semibold mt-auto pt-1.5"
                      style="color: {accent[pole.accentColor]}"
                    >
                      {pole.featured.cta}
                      <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                      </svg>
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
                  class="inline-flex items-center gap-2 text-xs font-medium italic hover:underline transition-opacity hover:opacity-80"
                  style="color: {accent[pole.crossSell.targetPole]}"
                >
                  <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z" clip-rule="evenodd" />
                  </svg>
                  {pole.crossSell.text}
                </a>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/each}

  <!-- Transversal "Expériences" -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="relative"
    onmouseenter={() => openMenu('transversal')}
    onmouseleave={startClose}
  >
    <button class="inline-flex items-center gap-1 px-3 py-5 text-sm font-medium text-gray-400 hover:text-brun-terre transition-colors">
      Expériences
      <svg
        class="w-3.5 h-3.5 transition-transform duration-200"
        class:rotate-180={activeMenu === 'transversal'}
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    {#if activeMenu === 'transversal'}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="absolute right-0 top-full pt-2 z-50"
        onmouseenter={cancelClose}
        onmouseleave={startClose}
      >
        <div class="bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-6 min-w-72 animate-[megaFadeIn_0.15s_ease-out]">
          <p class="text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">Composez votre journée</p>
          {#each transversalItems as item}
            <a href={item.href} class="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-offwhite transition-colors group">
              <span class="flex flex-col min-w-0 flex-1">
                <span class="text-sm font-semibold text-gray-800 leading-tight">{item.label}</span>
                <span class="text-xs text-gray-400 mt-0.5 leading-tight">{item.description}</span>
              </span>
              <svg class="w-4 h-4 text-gray-200 shrink-0 transition-all group-hover:text-gray-400 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
              </svg>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Contact -->
  <a href={contactHref} class="ml-2 bg-brun-terre text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
    {contactLabel}
  </a>

  <!-- Language switcher -->
  <div class="flex items-center gap-1.5 text-xs ml-1">
    {#each Object.entries(languages) as [code, _name]}
      <a
        href={langPaths[code] ?? '/'}
        class="uppercase transition-colors"
        class:text-brun-terre={currentLang === code}
        class:font-bold={currentLang === code}
        class:text-gray-400={currentLang !== code}
        class:hover:text-brun-terre={currentLang !== code}
      >
        {code}
      </a>
    {/each}
  </div>
</div>
