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
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    activeMenu = id;
  }

  function startClose() {
    closeTimeout = setTimeout(() => {
      activeMenu = null;
    }, 200);
  }

  function cancelClose() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  // Color maps for dynamic classes
  const bgLightMap: Record<string, string> = {
    restaurant: '#f5f0e8',
    aventure: '#eef5ec',
    evenements: '#edf0f5',
  };

  const accentMap: Record<string, string> = {
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
    <div
      class="relative"
      role="navigation"
      onmouseenter={() => openMenu(pole.id)}
      onmouseleave={startClose}
    >
      <a
        href={pole.href}
        class="nav-trigger"
        class:nav-active={currentPole === pole.id}
        style={currentPole === pole.id ? `color: ${accentMap[pole.accentColor]}` : ''}
      >
        {pole.label}
        <svg class="chevron" class:chevron-open={activeMenu === pole.id} viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </a>

      <!-- Mega dropdown — full width panel -->
      {#if activeMenu === pole.id}
        <div
          class="mega-dropdown"
          role="menu"
          onmouseenter={cancelClose}
          onmouseleave={startClose}
        >
          <div class="mega-panel">
            <!-- Left: Sub links -->
            <div class="mega-links">
              <p class="mega-section-label">Explorer</p>
              {#each pole.subLinks as link}
                <a href={link.href} class="mega-link" role="menuitem">
                  <span
                    class="mega-link-icon"
                    style="background-color: {bgLightMap[pole.accentColor]}; color: {accentMap[pole.accentColor]}"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d={iconPaths[link.icon ?? 'compass']} />
                    </svg>
                  </span>
                  <span class="mega-link-text">
                    <span class="mega-link-label">{link.label}</span>
                    {#if link.description}
                      <span class="mega-link-desc">{link.description}</span>
                    {/if}
                  </span>
                </a>
              {/each}
            </div>

            <!-- Right: Featured card -->
            {#if pole.featured}
              <div class="mega-featured">
                <a href={pole.featured.href} class="mega-card" style="background-color: {bgLightMap[pole.accentColor]}">
                  <div class="mega-card-img" style="background-color: {accentMap[pole.accentColor]}20">
                    <span class="mega-card-img-placeholder" style="color: {accentMap[pole.accentColor]}40">
                      {pole.id === 'restaurant' ? 'Photo restaurant' : pole.id === 'aventure' ? 'Photo activités' : 'Photo salle'}
                    </span>
                  </div>
                  <div class="mega-card-body">
                    <span class="mega-card-title">{pole.featured.title}</span>
                    <span class="mega-card-desc">{pole.featured.description}</span>
                    <span class="mega-card-cta" style="color: {accentMap[pole.accentColor]}">
                      {pole.featured.cta}
                      <svg viewBox="0 0 20 20" fill="currentColor" class="mega-card-arrow">
                        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </a>
              </div>
            {/if}

            <!-- Bottom: Cross-sell -->
            {#if pole.crossSell}
              <div class="mega-crosssell">
                <a
                  href={pole.crossSell.href}
                  class="mega-crosssell-link"
                  style="color: {accentMap[pole.crossSell.targetPole]}"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" class="mega-crosssell-icon">
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
  <div
    class="relative"
    role="navigation"
    onmouseenter={() => openMenu('transversal')}
    onmouseleave={startClose}
  >
    <button class="nav-trigger nav-muted">
      Expériences
      <svg class="chevron" class:chevron-open={activeMenu === 'transversal'} viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    {#if activeMenu === 'transversal'}
      <div
        class="mega-dropdown mega-dropdown-right"
        role="menu"
        onmouseenter={cancelClose}
        onmouseleave={startClose}
      >
        <div class="transversal-panel">
          <p class="mega-section-label">Composez votre journée</p>
          {#each transversalItems as item}
            <a href={item.href} class="mega-link" role="menuitem">
              <span class="mega-link-text">
                <span class="mega-link-label">{item.label}</span>
                <span class="mega-link-desc">{item.description}</span>
              </span>
              <svg viewBox="0 0 20 20" fill="currentColor" class="mega-link-arrow">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
              </svg>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Contact -->
  <a href={contactHref} class="contact-btn">
    {contactLabel}
  </a>

  <!-- Language switcher -->
  <div class="lang-switcher">
    {#each Object.entries(languages) as [code, _name]}
      <a
        href={langPaths[code] ?? '/'}
        class="lang-link"
        class:lang-active={currentLang === code}
      >
        {code}
      </a>
    {/each}
  </div>
</div>

<style>
  /* Nav triggers */
  .nav-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 1.25rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b6b67;
    transition: color 0.15s;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
  }
  .nav-trigger:hover { color: #2D2B1B; }
  .nav-muted { color: #a8a8a4; }
  .nav-muted:hover { color: #2D2B1B; }

  .chevron {
    width: 0.875rem;
    height: 0.875rem;
    transition: transform 0.2s ease;
  }
  .chevron-open { transform: rotate(180deg); }

  /* Mega dropdown container */
  .mega-dropdown {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    padding-top: 0.5rem;
    z-index: 50;
  }
  .mega-dropdown-right {
    left: auto;
    right: 0;
    transform: none;
  }

  /* Main mega panel — two columns */
  .mega-panel {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 16rem;
    grid-template-rows: 1fr auto;
    gap: 1.5rem;
    min-width: 32rem;
    animation: megaFadeIn 0.15s ease-out;
  }

  /* Transversal panel — single column */
  .transversal-panel {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
    padding: 1.5rem;
    min-width: 18rem;
    animation: megaFadeIn 0.15s ease-out;
  }

  @keyframes megaFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mega-section-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #a8a8a4;
    margin-bottom: 0.75rem;
  }

  /* Sub links */
  .mega-links {
    grid-column: 1;
    grid-row: 1;
  }

  .mega-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background-color 0.15s;
  }
  .mega-link:hover {
    background-color: #fafaf8;
  }

  .mega-link-icon {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mega-link-icon svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  .mega-link-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .mega-link-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #3a3a38;
    line-height: 1.3;
  }
  .mega-link-desc {
    font-size: 0.75rem;
    color: #a8a8a4;
    margin-top: 0.125rem;
    line-height: 1.3;
  }
  .mega-link-arrow {
    width: 1rem;
    height: 1rem;
    color: #e5e5e3;
    margin-left: auto;
    flex-shrink: 0;
    transition: color 0.15s, transform 0.15s;
  }
  .mega-link:hover .mega-link-arrow {
    color: #a8a8a4;
    transform: translateX(2px);
  }

  /* Featured card */
  .mega-featured {
    grid-column: 2;
    grid-row: 1;
  }

  .mega-card {
    display: flex;
    flex-direction: column;
    border-radius: 0.75rem;
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
  }
  .mega-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.1);
  }

  .mega-card-img {
    aspect-ratio: 16/10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mega-card-img-placeholder {
    font-size: 0.6875rem;
    text-align: center;
    padding: 0.5rem;
  }

  .mega-card-body {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }
  .mega-card-title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #3a3a38;
    line-height: 1.3;
  }
  .mega-card-desc {
    font-size: 0.6875rem;
    color: #6b6b67;
    line-height: 1.4;
  }
  .mega-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: auto;
    padding-top: 0.375rem;
  }
  .mega-card-arrow {
    width: 0.875rem;
    height: 0.875rem;
    transition: transform 0.15s;
  }
  .mega-card:hover .mega-card-arrow {
    transform: translateX(3px);
  }

  /* Cross-sell */
  .mega-crosssell {
    grid-column: 1 / -1;
    grid-row: 2;
    border-top: 1px solid #f3f3f1;
    padding-top: 1rem;
  }
  .mega-crosssell-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    font-style: italic;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .mega-crosssell-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  .mega-crosssell-icon {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }

  /* Contact button */
  .contact-btn {
    display: inline-flex;
    align-items: center;
    background-color: #2D2B1B;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.15s;
    margin-left: 0.5rem;
  }
  .contact-btn:hover { background-color: #3a3a38; }

  /* Language switcher */
  .lang-switcher {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }
  .lang-link {
    text-transform: uppercase;
    color: #a8a8a4;
    text-decoration: none;
    transition: color 0.15s;
  }
  .lang-link:hover { color: #2D2B1B; }
  .lang-active {
    color: #2D2B1B;
    font-weight: 700;
  }
</style>
