<script lang="ts">
  import { slide } from 'svelte/transition';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import Phone from 'lucide-svelte/icons/phone';
  import MapPin from 'lucide-svelte/icons/map-pin';

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

  interface AgendaLink {
    label: string;
    href: string;
  }

  interface DirectionsLink {
    label: string;
    href: string;
  }

  let {
    poles,
    agendaLink,
    directionsLink,
    ctaLabel,
    ctaHref,
    ctaColor,
    ctaIcon = false,
    languages,
    currentLang,
    langPaths,
    labelClose = 'Fermer',
    labelCloseMenu = 'Fermer le menu',
    labelSubmenu = 'Sous-menu',
  }: {
    poles: PoleNav[];
    agendaLink: AgendaLink;
    directionsLink: DirectionsLink;
    ctaLabel: string;
    ctaHref: string;
    ctaColor: string;
    ctaIcon?: boolean;
    languages: Record<string, string>;
    currentLang: string;
    langPaths: Record<string, string>;
    labelClose?: string;
    labelCloseMenu?: string;
    labelSubmenu?: string;
  } = $props();

  function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  }
  let ctaTextColor = $derived(isLightColor(ctaColor) ? 'var(--color-brun-terre)' : 'white');

  let isOpen = $state(false);
  let expandedPole = $state<string | null>(null);
  let portalEl = $state<HTMLDivElement | null>(null);
  let panelEl = $state<HTMLDivElement | null>(null);
  let hamburgerBtn = $state<HTMLButtonElement | null>(null);
  let closeBtn = $state<HTMLButtonElement | null>(null);

  // Portal: move overlay + panel to document.body
  // to escape header's backdrop-blur containing block
  $effect(() => {
    if (portalEl && typeof document !== 'undefined') {
      document.body.appendChild(portalEl);
      return () => { portalEl?.remove(); };
    }
  });

  // Body scroll lock (iOS-safe: position fixed + restore scrollY) with cleanup on unmount
  $effect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  });

  // Focus trap: keep Tab within panel, Escape closes
  $effect(() => {
    if (isOpen && panelEl) {
      closeBtn?.focus();

      function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
          return;
        }

        if (e.key === 'Tab' && panelEl) {
          const focusable = Array.from(
            panelEl.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  });

  function open() {
    isOpen = true;
  }

  function close() {
    isOpen = false;
    expandedPole = null;
    hamburgerBtn?.focus();
  }

  function togglePole(id: string) {
    expandedPole = expandedPole === id ? null : id;
  }
</script>

<!-- Burger button (stays in header) -->
<button
  bind:this={hamburgerBtn}
  onclick={open}
  class="lg:hidden min-w-11 min-h-11 flex items-center justify-center text-gray-600 hover:text-brun-terre transition-colors"
  aria-label="Menu"
  aria-expanded={isOpen}
  data-nav-trigger
>
  <Menu class="w-6 h-6" />
</button>

<!-- Portal container (moved to body on mount) -->
<div bind:this={portalEl} class="contents">
  <!-- Overlay -->
  {#if isOpen}
    <button
      class="fixed inset-0 bg-black/30 z-[9998] lg:hidden"
      onclick={close}
      aria-label={labelCloseMenu}
    ></button>
  {/if}

  <!-- Slide-out panel -->
  <div
    bind:this={panelEl}
    class="fixed top-0 right-0 h-full h-dvh w-80 max-w-[85vw] bg-white z-[9999] shadow-2xl overflow-y-auto lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
    class:translate-x-full={!isOpen}
    class:translate-x-0={isOpen}
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <span class="font-heading text-lg font-bold text-brun-terre">LA TERRASSE</span>
      <button
        bind:this={closeBtn}
        onclick={close}
        class="min-w-11 min-h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={labelClose}
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4">
      <!-- Poles with accordion -->
      {#each poles as pole}
        <div class="border-b border-gray-100">
          <div class="flex items-center justify-between">
            <a
              href={pole.href}
              onclick={close}
              class="flex-1 py-3 font-heading font-semibold text-[0.9375rem] text-brun-terre"
            >
              {pole.label}
            </a>
            <button
              onclick={() => togglePole(pole.id)}
              class="min-w-11 min-h-11 flex items-center justify-center text-gray-400"
              aria-label="{labelSubmenu} {pole.label}"
              aria-expanded={expandedPole === pole.id}
              aria-controls="submenu-{pole.id}"
            >
              <ChevronDown
                class="w-4 h-4 transition-transform duration-200 {expandedPole === pole.id ? 'rotate-180' : ''}"
                size={16}
              />
            </button>
          </div>

          {#if expandedPole === pole.id}
            <div
              id="submenu-{pole.id}"
              class="pl-4 pb-3 flex flex-col gap-0.5"
              transition:slide={{ duration: 200 }}
            >
              {#each pole.subLinks as link}
                <a href={link.href} onclick={close} class="block py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  {link.label}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}

      <!-- Agenda + Directions links -->
      <div class="mt-5 mb-2 border-b border-gray-100 pb-3">
        <a href={agendaLink.href} onclick={close} class="block py-3 font-heading font-semibold text-[0.9375rem] text-brun-terre hover:text-brun-terre/80 transition-colors">
          {agendaLink.label}
        </a>
        <a
          href={directionsLink.href}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 py-3 font-heading font-semibold text-[0.9375rem] text-brun-terre hover:text-brun-terre/80 transition-colors"
        >
          <MapPin class="w-4 h-4" strokeWidth={1.5} />
          {directionsLink.label}
        </a>
      </div>

      <!-- CTA -->
      <div class="mt-3">
        <a
          href={ctaHref}
          onclick={close}
          class="flex items-center justify-center gap-2 w-full text-center min-h-12 px-4 py-3.5 rounded-full font-heading font-semibold text-[0.9375rem] transition-all duration-200 hover:shadow-md hover:brightness-95"
          style="background-color: {ctaColor}; color: {ctaTextColor}"
        >
          {#if ctaIcon}<Phone class="w-4 h-4" strokeWidth={1.5} />{/if}
          {ctaLabel}
        </a>
      </div>

      <!-- Language -->
      <div class="mt-6 flex items-center justify-center gap-3 text-sm">
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
    </nav>
  </div>
</div>
