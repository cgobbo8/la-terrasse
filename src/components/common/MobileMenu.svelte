<script lang="ts">
  import { slide } from 'svelte/transition';

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
    ctaLabel,
    ctaHref,
    ctaColor,
    phoneNumber,
    languages,
    currentLang,
    langPaths,
  }: {
    poles: PoleNav[];
    transversalItems: TransversalItem[];
    ctaLabel: string;
    ctaHref: string;
    ctaColor: string;
    phoneNumber: string;
    languages: Record<string, string>;
    currentLang: string;
    langPaths: Record<string, string>;
  } = $props();

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('33') && digits.length === 11) {
      const national = '0' + digits.slice(2);
      return national.replace(/(\d{2})(?=\d)/g, '$1 ');
    }
    return raw;
  }

  let isOpen = $state(false);
  let expandedPole = $state<string | null>(null);
  let portalEl = $state<HTMLDivElement | null>(null);
  let panelEl = $state<HTMLDivElement | null>(null);
  let hamburgerBtn = $state<HTMLButtonElement | null>(null);
  let closeBtn = $state<HTMLButtonElement | null>(null);

  const poleColors: Record<string, string> = {
    restaurant: '#2D2B1B',
    aventure: '#537b47',
    evenements: '#3d4969',
  };

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
>
  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<!-- Portal container (moved to body on mount) -->
<div bind:this={portalEl} class="contents">
  <!-- Overlay -->
  {#if isOpen}
    <button
      class="fixed inset-0 bg-black/30 z-[9998] lg:hidden"
      onclick={close}
      aria-label="Fermer le menu"
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
        aria-label="Fermer"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
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
              class="flex-1 py-3 font-semibold text-[0.9375rem]"
              style="color: {poleColors[pole.id] ?? '#3a3a38'}"
            >
              {pole.label}
            </a>
            <button
              onclick={() => togglePole(pole.id)}
              class="min-w-11 min-h-11 flex items-center justify-center text-gray-400"
              aria-label="Sous-menu {pole.label}"
              aria-expanded={expandedPole === pole.id}
              aria-controls="submenu-{pole.id}"
            >
              <svg
                class="w-4 h-4 transition-transform duration-200"
                class:rotate-180={expandedPole === pole.id}
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
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

      <!-- Transversal -->
      <div class="mt-5 mb-2">
        <p class="text-[0.6875rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">Experiences</p>
        {#each transversalItems as item}
          <a href={item.href} onclick={close} class="block py-3 text-sm text-gray-600 hover:text-brun-terre transition-colors">
            {item.label}
          </a>
        {/each}
      </div>

      <!-- Phone link -->
      <div class="mt-6">
        <a
          href={`tel:${phoneNumber}`}
          onclick={close}
          class="flex items-center justify-center gap-2 min-h-11 text-sm text-gray-600 hover:text-brun-terre transition-colors"
        >
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span>{formatPhone(phoneNumber)}</span>
        </a>
      </div>

      <!-- CTA -->
      <div class="mt-3">
        <a
          href={ctaHref}
          onclick={close}
          class="block w-full text-center text-white min-h-11 px-4 py-3 rounded-lg font-medium text-[0.9375rem] transition-[filter] duration-150 hover:brightness-90"
          style="background-color: {ctaColor}"
        >
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
