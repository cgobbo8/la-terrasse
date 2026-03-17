<script lang="ts">
  /**
   * SeminarConfigurator — Interactive seminar pricing configurator
   * La Salle pole — bleu ardoise #3d4969
   * Svelte 5 runes, lucide-svelte icons, CSS transitions
   */
  import { untrack } from 'svelte';
  import {
    Coffee,
    UtensilsCrossed,
    Wine,
    Trees,
    Trophy,
    Users,
    Check,
    Plus,
    Minus,
    ArrowRight,
    Building,
    Sparkles,
  } from 'lucide-svelte';

  interface Props {
    accentColor?: string;
    quoteMailto?: string;
  }

  let {
    accentColor = '#3d4969',
    quoteMailto = 'mailto:contact@baseloisirs-saintferreol.fr',
  }: Props = $props();

  // ── Light tints derived from accent ──────────────────────────────────────
  const accentLight = `${accentColor}12`;    // ~7% opacity — card bg
  const accentMedium = `${accentColor}20`;   // ~12% opacity — hover bg
  const accentBorder = `${accentColor}30`;   // 19% — default card border
  const accentSelected = `${accentColor}`;   // full — selected border

  // ── Options catalog ───────────────────────────────────────────────────────
  interface Option {
    id: string;
    icon: any;
    title: string;
    description: string;
    pricePerPerson: number;
    badge?: string;
  }

  const OPTIONS: Option[] = [
    {
      id: 'pause-cafe',
      icon: Coffee,
      title: 'Pause café',
      description: 'Matin & après-midi — boissons chaudes, viennoiseries, fruits de saison',
      pricePerPerson: 8,
    },
    {
      id: 'dejeuner',
      icon: UtensilsCrossed,
      title: 'Déjeuner',
      description: 'Menu servi au restaurant ou en terrasse face au lac',
      pricePerPerson: 25,
    },
    {
      id: 'apero-soiree',
      icon: Wine,
      title: 'Apéro en soirée',
      description: 'Cocktail dinatoire sur la terrasse au coucher du soleil',
      pricePerPerson: 15,
    },
    {
      id: 'team-building',
      icon: Trees,
      title: 'Activités team building',
      description: 'Paddle, archery tag, VTT, course d\'orientation — plein air sur le site',
      pricePerPerson: 18,
    },
    {
      id: 'coaching',
      icon: Trophy,
      title: 'Coaching professionnel',
      description: 'Épreuves Koh-Lanta, cohésion d\'équipe, défis collectifs — coach dédié',
      pricePerPerson: 35,
      badge: 'Premium',
    },
  ];

  // ── State ─────────────────────────────────────────────────────────────────
  let participants = $state(20);
  let selected = $state<Set<string>>(new Set());
  let displayedTotal = $state(0);
  // Plain let — must NOT be $state to avoid reactive loop inside $effect
  let animationFrame: number | null = null;

  // ── Derived calculations ──────────────────────────────────────────────────
  const BASE_PRICE = 350;

  const optionsSubtotal = $derived(
    OPTIONS.filter((o) => selected.has(o.id))
      .reduce((sum, o) => sum + o.pricePerPerson * participants, 0)
  );

  const total = $derived(BASE_PRICE + optionsSubtotal);

  const selectedOptions = $derived(OPTIONS.filter((o) => selected.has(o.id)));

  const mailtoHref = $derived.by(() => {
    const parts = selectedOptions.map((o) => `- ${o.title} (${o.pricePerPerson}€/pers.)`).join('\n');
    const body = [
      `Bonjour,`,
      ``,
      `Je souhaite obtenir un devis pour un séminaire :`,
      ``,
      `Participants : ${participants}`,
      ``,
      `Options souhaitées :`,
      parts || '- Location de salle uniquement',
      ``,
      `Estimation : ${total}€`,
      ``,
      `Merci de me recontacter.`,
    ].join('\n');
    const base = quoteMailto.replace(/^mailto:/, '');
    return `mailto:${base}?subject=Devis séminaire — ${participants} participants&body=${encodeURIComponent(body)}`;
  });

  // ── Counting animation for total ──────────────────────────────────────────
  // Only `total` (derived) is tracked — displayedTotal is read via untrack
  // to avoid a reactive cycle. animationFrame is a plain let, not $state.
  $effect(() => {
    const target = total; // tracked — effect re-runs when total changes

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    // Read current displayed value without making it a tracked dependency
    const start = untrack(() => displayedTotal);
    const diff = target - start;

    if (diff === 0) return;

    const duration = Math.min(Math.abs(diff) * 2, 400);
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      displayedTotal = Math.round(start + diff * eased);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        displayedTotal = target;
        animationFrame = null;
      }
    }
    animationFrame = requestAnimationFrame(tick);

    // Cleanup: cancel any in-flight animation when effect re-runs
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  function toggleOption(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selected = next;
  }

  function clampParticipants(val: number) {
    participants = Math.max(8, Math.min(80, val));
  }

  function formatPrice(n: number) {
    return n.toLocaleString('fr-FR') + '\u202f€';
  }
</script>

<!-- ───────────────────────────────────────────────────────────────────────── -->
<!--  SEMINAR CONFIGURATOR                                                     -->
<!-- ───────────────────────────────────────────────────────────────────────── -->

<div class="configurator-root w-full">
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

    <!-- ── LEFT COLUMN: Base + Options ──────────────────────────────────────── -->
    <div class="space-y-6">

      <!-- Base incluse -->
      <div
        class="base-card relative flex items-start gap-4 p-5 rounded-2xl border-2"
        style="border-color: {accentColor}; background: linear-gradient(135deg, {accentLight} 0%, #ffffff 60%);"
      >
        <!-- Included badge -->
        <span
          class="included-badge absolute -top-3 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style="background-color: {accentColor};"
        >
          <Check class="w-3 h-3" strokeWidth={2.5} />
          Inclus
        </span>

        <!-- Icon -->
        <span
          class="mt-1 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style="background-color: {accentMedium}; color: {accentColor};"
        >
          <Building class="w-5 h-5" strokeWidth={1.5} />
        </span>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <h3 class="font-heading font-bold text-base" style="color: {accentColor};">
            Location de salle séminaire
          </h3>
          <p class="text-sm text-gray-500 mt-0.5 leading-relaxed">
            Journée complète — vidéoprojecteur, sono, Wi-Fi, climatisation
          </p>
        </div>

        <!-- Price -->
        <div class="flex-shrink-0 text-right">
          <p class="font-heading font-bold text-lg" style="color: {accentColor};">350&nbsp;€</p>
          <p class="text-xs text-gray-400 mt-0.5">forfait journée</p>
        </div>
      </div>

      <!-- Participants stepper + label -->
      <div
        class="participants-row flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border"
        style="border-color: {accentBorder};"
      >
        <div class="flex items-center gap-3 flex-1">
          <span
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style="background-color: {accentLight}; color: {accentColor};"
          >
            <Users class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
          </span>
          <div>
            <p class="text-sm font-semibold text-gray-800">Nombre de participants</p>
            <p class="text-xs text-gray-400">Entre 8 et 80 personnes</p>
          </div>
        </div>

        <div class="flex items-center gap-0">
          <!-- Decrement -->
          <button
            type="button"
            onclick={() => clampParticipants(participants - 1)}
            class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
            style="border-color: {accentBorder}; color: {accentColor};"
            aria-label="Moins un participant"
            disabled={participants <= 8}
          >
            <Minus class="w-4 h-4" strokeWidth={2} />
          </button>

          <!-- Value input -->
          <input
            type="number"
            min="8"
            max="80"
            value={participants}
            oninput={(e) => clampParticipants(parseInt((e.target as HTMLInputElement).value) || 8)}
            class="stepper-input w-16 h-10 text-center font-heading font-bold text-base border border-x-0 focus:outline-none"
            style="border-color: {accentBorder}; color: {accentColor};"
            aria-label="Nombre de participants"
          />

          <!-- Increment -->
          <button
            type="button"
            onclick={() => clampParticipants(participants + 1)}
            class="stepper-btn w-10 h-10 rounded-r-xl flex items-center justify-center border border-l-0 transition-colors"
            style="border-color: {accentBorder}; color: {accentColor};"
            aria-label="Plus un participant"
            disabled={participants >= 80}
          >
            <Plus class="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <!-- Slider -->
        <div class="flex-1 sm:max-w-[180px]">
          <input
            type="range"
            min="8"
            max="80"
            bind:value={participants}
            class="participants-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style="
              --thumb-color: {accentColor};
              --track-color: {accentBorder};
              background: linear-gradient(to right, {accentColor} 0%, {accentColor} {((participants - 8) / 72) * 100}%, {accentBorder} {((participants - 8) / 72) * 100}%, {accentBorder} 100%);
            "
            aria-label="Curseur participants"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>8</span>
            <span>80</span>
          </div>
        </div>
      </div>

      <!-- Options section header -->
      <div>
        <h3 class="font-heading font-bold text-sm uppercase tracking-wider mb-4" style="color: {accentColor}; opacity: 0.7;">
          Options à la carte
        </h3>

        <div class="options-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each OPTIONS as option (option.id)}
            {@const isSelected = selected.has(option.id)}
            {@const lineTotal = option.pricePerPerson * participants}

            <button
              type="button"
              onclick={() => toggleOption(option.id)}
              class="option-card relative text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
              style="
                border-color: {isSelected ? accentSelected : accentBorder};
                background-color: {isSelected ? accentLight : '#ffffff'};
                outline-color: {accentColor};
                box-shadow: {isSelected ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
              "
              aria-pressed={isSelected}
              aria-label="{isSelected ? 'Retirer' : 'Ajouter'} : {option.title}"
            >
              <!-- Premium badge -->
              {#if option.badge}
                <span
                  class="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white"
                  style="background-color: {accentColor};"
                >
                  <Sparkles class="w-2.5 h-2.5" strokeWidth={2} />
                  {option.badge}
                </span>
              {/if}

              <div class="flex items-start gap-3">
                <!-- Icon -->
                <span
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style="background-color: {isSelected ? accentMedium : accentLight}; color: {accentColor};"
                >
                  <svelte:component this={option.icon} class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
                </span>

                <!-- Text -->
                <div class="flex-1 min-w-0 pr-2">
                  <p class="font-semibold text-sm text-gray-800 leading-tight">{option.title}</p>
                  <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">{option.description}</p>
                </div>
              </div>

              <!-- Price + toggle -->
              <div class="flex items-center justify-between mt-3 pt-3" style="border-top: 1px solid {isSelected ? accentBorder : '#f0f0ee'};">
                <div>
                  <span class="font-heading font-bold text-sm" style="color: {accentColor};">
                    {option.pricePerPerson}&nbsp;€
                    <span class="font-normal text-gray-400 text-xs">/pers.</span>
                  </span>
                  {#if isSelected}
                    <span class="ml-2 text-xs text-gray-400">
                      = {formatPrice(lineTotal)}
                    </span>
                  {/if}
                </div>

                <!-- Toggle indicator -->
                <span
                  class="toggle-indicator w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                  style="
                    background-color: {isSelected ? accentColor : accentLight};
                    color: {isSelected ? '#ffffff' : accentColor};
                  "
                >
                  {#if isSelected}
                    <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                  {:else}
                    <Plus class="w-3.5 h-3.5" strokeWidth={2} />
                  {/if}
                </span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- ── RIGHT COLUMN: Sticky Summary ─────────────────────────────────────── -->
    <div class="lg:sticky lg:top-24">
      <div
        class="summary-card rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        style="border: 1.5px solid {accentBorder};"
      >
        <!-- Summary header -->
        <div
          class="summary-header px-6 py-5"
          style="background: linear-gradient(135deg, {accentColor} 0%, #2a3450 100%);"
        >
          <p class="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Votre estimation</p>
          <div class="flex items-baseline gap-2">
            <span class="font-heading font-bold text-3xl text-white tabular-nums" aria-live="polite" aria-label="Total estimé : {displayedTotal} euros">
              {displayedTotal.toLocaleString('fr-FR')}
            </span>
            <span class="text-white/70 text-lg font-medium">&nbsp;€</span>
          </div>
          <p class="text-white/50 text-xs mt-1">pour {participants} participant{participants > 1 ? 's' : ''}</p>
        </div>

        <!-- Summary body -->
        <div class="bg-white px-6 py-5 space-y-3">

          <!-- Base row -->
          <div class="summary-row flex items-center justify-between text-sm">
            <span class="text-gray-600 flex items-center gap-2">
              <Building class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
              Location de salle
            </span>
            <span class="font-semibold text-gray-800">350&nbsp;€</span>
          </div>

          <!-- Option rows -->
          {#if selectedOptions.length > 0}
            <div class="pt-1 space-y-2" style="border-top: 1px solid {accentBorder};">
              {#each selectedOptions as opt (opt.id)}
                <div class="summary-row flex items-center justify-between text-sm option-row-enter">
                  <span class="text-gray-500 flex items-center gap-2 min-w-0">
                    <svelte:component this={opt.icon} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                    <span class="truncate">{opt.title}</span>
                    <span class="text-gray-400 flex-shrink-0">× {participants}</span>
                  </span>
                  <span class="font-medium text-gray-700 flex-shrink-0 ml-2">{formatPrice(opt.pricePerPerson * participants)}</span>
                </div>
              {/each}
            </div>
          {/if}

          <!-- Divider + Total -->
          <div class="pt-3 mt-1" style="border-top: 2px solid {accentBorder};">
            <div class="flex items-center justify-between">
              <span class="font-heading font-bold text-sm text-gray-800">Total estimé</span>
              <span class="font-heading font-bold text-xl tabular-nums" style="color: {accentColor};">
                {formatPrice(total)}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {#if selectedOptions.length > 0}
                Soit {formatPrice(Math.round((total / participants) * 10) / 10)}/pers. options incluses
              {:else}
                Hors options — ajoutez vos souhaits ci-contre
              {/if}
            </p>
          </div>

          <!-- Devis note -->
          <div
            class="devis-note mt-2 rounded-xl px-4 py-3 text-xs text-center leading-relaxed"
            style="background-color: {accentLight}; color: {accentColor};"
          >
            Estimation indicative. Le tarif exact est confirmé par devis.
          </div>

          <!-- CTA -->
          <a
            href={mailtoHref}
            class="cta-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-heading font-bold text-sm text-white transition-all duration-200 hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl mt-2"
            style="background: linear-gradient(135deg, {accentColor} 0%, #2a3450 100%); outline-color: {accentColor};"
          >
            <!-- Shimmer -->
            <span class="cta-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);"></span>
            Demander un devis
            <ArrowRight class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </a>

          <!-- Reassurance -->
          <div class="flex items-center justify-center gap-4 pt-1">
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Check class="w-3 h-3" style="color: {accentColor};" strokeWidth={2.5} />
              Réponse sous 24h
            </span>
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Check class="w-3 h-3" style="color: {accentColor};" strokeWidth={2.5} />
              Devis gratuit
            </span>
          </div>
        </div>
      </div>

      <!-- Helper text under summary on mobile -->
      <p class="lg:hidden text-xs text-center text-gray-400 mt-3">
        Sélectionnez vos options ci-dessus pour affiner l'estimation.
      </p>
    </div>

  </div>
</div>

<!-- ─────────────────────────────────────────────────────────────────────────── -->
<style>
  /* ── Number input — remove spinners ──────────────────────────────────────── */
  .stepper-input[type='number']::-webkit-inner-spin-button,
  .stepper-input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .stepper-input[type='number'] {
    -moz-appearance: textfield;
  }

  /* ── Range slider cross-browser ─────────────────────────────────────────── */
  .participants-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--thumb-color);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: box-shadow 0.15s ease;
  }
  .participants-slider::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--thumb-color) 20%, transparent);
  }
  .participants-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--thumb-color);
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
  .participants-slider::-webkit-slider-runnable-track {
    border-radius: 999px;
    height: 6px;
  }
  .participants-slider:focus-visible {
    outline: 2px solid var(--thumb-color);
    outline-offset: 4px;
    border-radius: 999px;
  }

  /* ── Stepper button disabled state ──────────────────────────────────────── */
  .stepper-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .stepper-btn:not(:disabled):hover {
    background-color: color-mix(in srgb, var(--accent, #3d4969) 8%, white);
  }

  /* ── Option card hover (non-selected) ───────────────────────────────────── */
  .option-card:not([aria-pressed='true']):hover {
    transform: translateY(-1px);
  }
  .option-card[aria-pressed='true'] {
    transform: translateY(-1px);
  }

  /* ── Option row enter animation ─────────────────────────────────────────── */
  @keyframes optionRowSlideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .option-row-enter {
    animation: optionRowSlideIn 0.2s ease-out both;
  }

  /* ── CTA shimmer ─────────────────────────────────────────────────────────── */
  .cta-shimmer {
    background-size: 200% 100%;
    transform: skewX(-15deg);
  }

  /* ── Reduce motion ───────────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .option-card,
    .option-row-enter,
    .cta-shimmer {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
