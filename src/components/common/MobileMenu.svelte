<script lang="ts">
  interface SubLink {
    label: string;
    href: string;
  }

  interface PoleNav {
    id: string;
    label: string;
    href: string;
    colorClass: string;
    subLinks: SubLink[];
  }

  interface TransversalItem {
    label: string;
    href: string;
  }

  let {
    poles,
    transversalItems,
    contactHref,
    contactLabel,
    languages,
    currentLang,
    langPaths,
  }: {
    poles: PoleNav[];
    transversalItems: TransversalItem[];
    contactHref: string;
    contactLabel: string;
    languages: Record<string, string>;
    currentLang: string;
    langPaths: Record<string, string>;
  } = $props();

  let isOpen = $state(false);
  let expandedPole = $state<string | null>(null);

  // Portal refs: move overlay + panel to document.body to escape
  // the header's backdrop-blur containing block
  let portalEl = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (portalEl && typeof document !== 'undefined') {
      document.body.appendChild(portalEl);
      return () => {
        portalEl?.remove();
      };
    }
  });

  const poleColors: Record<string, string> = {
    restaurant: '#2D2B1B',
    aventure: '#537b47',
    evenements: '#3d4969',
  };

  function open() {
    isOpen = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  function close() {
    isOpen = false;
    expandedPole = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  function togglePole(id: string) {
    expandedPole = expandedPole === id ? null : id;
  }
</script>

<!-- Burger button (stays in the header) -->
<div class="burger-wrapper">
  <button
    onclick={open}
    class="burger-btn"
    aria-label="Menu"
    aria-expanded={isOpen}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>

<!-- Portal container: gets moved to document.body -->
<div bind:this={portalEl} style="display:contents">
  <!-- Overlay -->
  {#if isOpen}
    <div class="mobile-overlay">
      <button
        class="mobile-overlay-btn"
        onclick={close}
        aria-label="Fermer le menu"
      ></button>
    </div>
  {/if}

  <!-- Slide-out panel -->
  <div class="mobile-panel" class:mobile-panel-open={isOpen}>
    <div class="panel-header">
      <span class="panel-logo">LA TERRASSE</span>
      <button onclick={close} class="panel-close" aria-label="Fermer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="panel-nav">
      {#each poles as pole}
        <div class="pole-group">
          <div class="pole-row">
            <a
              href={pole.href}
              onclick={close}
              class="pole-link"
              style="color: {poleColors[pole.id] ?? '#3a3a38'}"
            >
              {pole.label}
            </a>
            <button
              onclick={() => togglePole(pole.id)}
              class="pole-toggle"
              aria-label="Sous-menu {pole.label}"
            >
              <svg
                width="16" height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="pole-chevron"
                class:pole-chevron-open={expandedPole === pole.id}
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          {#if expandedPole === pole.id}
            <div class="pole-sublinks">
              {#each pole.subLinks as link}
                <a href={link.href} onclick={close} class="pole-sublink">
                  {link.label}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}

      <div class="transversal">
        <p class="transversal-label">Experiences</p>
        {#each transversalItems as item}
          <a href={item.href} onclick={close} class="transversal-link">
            {item.label}
          </a>
        {/each}
      </div>

      <div class="contact-section">
        <a href={contactHref} onclick={close} class="contact-btn">
          {contactLabel}
        </a>
      </div>

      <div class="lang-section">
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
    </nav>
  </div>
</div>

<style>
  .burger-wrapper { display: block; }
  @media (min-width: 1024px) {
    .burger-wrapper { display: none; }
    .mobile-panel { display: none !important; }
    .mobile-overlay { display: none !important; }
  }

  .burger-btn {
    padding: 0.5rem;
    color: #6b6b67;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.15s;
  }
  .burger-btn:hover { color: #2D2B1B; }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    z-index: 9998;
  }
  .mobile-overlay-btn {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
  }

  .mobile-panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    height: 100dvh;
    width: 20rem;
    max-width: 85vw;
    background: white;
    z-index: 9999;
    box-shadow: -4px 0 24px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-panel-open { transform: translateX(0); }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e5e5e3;
  }
  .panel-logo {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: #2D2B1B;
  }
  .panel-close {
    padding: 0.5rem;
    color: #a8a8a4;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.15s;
  }
  .panel-close:hover { color: #6b6b67; }

  .panel-nav { padding: 1rem; }

  .pole-group { border-bottom: 1px solid #f3f3f1; }
  .pole-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pole-link {
    flex: 1;
    padding: 0.75rem 0;
    font-weight: 600;
    font-size: 0.9375rem;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .pole-link:hover { opacity: 0.8; }

  .pole-toggle {
    padding: 0.5rem;
    color: #a8a8a4;
    background: none;
    border: none;
    cursor: pointer;
  }
  .pole-chevron { transition: transform 0.2s ease; }
  .pole-chevron-open { transform: rotate(180deg); }

  .pole-sublinks {
    padding: 0 0 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  .pole-sublink {
    display: block;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: #6b6b67;
    text-decoration: none;
    transition: color 0.15s;
  }
  .pole-sublink:hover { color: #3a3a38; }

  .transversal { margin-top: 1.25rem; margin-bottom: 0.5rem; }
  .transversal-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #a8a8a4;
    margin-bottom: 0.5rem;
  }
  .transversal-link {
    display: block;
    padding: 0.625rem 0;
    font-size: 0.875rem;
    color: #6b6b67;
    text-decoration: none;
    transition: color 0.15s;
  }
  .transversal-link:hover { color: #2D2B1B; }

  .contact-section { margin-top: 1.5rem; }
  .contact-btn {
    display: block;
    width: 100%;
    text-align: center;
    background-color: #2D2B1B;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.9375rem;
    text-decoration: none;
    transition: background-color 0.15s;
  }
  .contact-btn:hover { background-color: #3a3a38; }

  .lang-section {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.875rem;
  }
  .lang-link {
    text-transform: uppercase;
    color: #a8a8a4;
    text-decoration: none;
    transition: color 0.15s;
  }
  .lang-link:hover { color: #2D2B1B; }
  .lang-active { color: #2D2B1B; font-weight: 700; }
</style>
