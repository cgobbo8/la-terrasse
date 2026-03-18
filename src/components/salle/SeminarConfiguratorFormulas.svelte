<script lang="ts">
  /**
   * SeminarConfiguratorFormulas — Formula-based seminar pricing (test variant)
   * Two groups: "Location salle sèche" (flat-rate, shown first)
   *           + "Formules journée d'étude" (per-person pricing cards)
   * Svelte 5 runes, lucide-svelte icons, CSS transitions
   */
  import { untrack } from 'svelte';
  import UtensilsCrossed from 'lucide-svelte/icons/utensils-crossed';
  import Wine from 'lucide-svelte/icons/wine';
  import Trees from 'lucide-svelte/icons/trees';
  import Users from 'lucide-svelte/icons/users';
  import Check from 'lucide-svelte/icons/check';
  import Plus from 'lucide-svelte/icons/plus';
  import Minus from 'lucide-svelte/icons/minus';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import Building from 'lucide-svelte/icons/building';
  import Moon from 'lucide-svelte/icons/moon';
  import Clock from 'lucide-svelte/icons/clock';

  interface Props {
    accentColor?: string;
    quoteMailto?: string;
  }

  let {
    accentColor = '',
    quoteMailto = 'mailto:',
  }: Props = $props();

  const accentLight = `${accentColor}12`;
  const accentMedium = `${accentColor}20`;
  const accentBorder = `${accentColor}30`;

  interface Formula {
    id: string;
    icon: any;
    title: string;
    shortTitle: string;
    timeSlot?: string;
    description: string;
    includes: string[];
    pricingType: 'flat' | 'perPerson';
    flatPrice?: number;
    pricePerPerson?: number;
    minPersons?: number;
    extraHourRate?: number;
    priceDisplay: string;
    priceSublabel: string;
  }

  const FLAT_FORMULAS: Formula[] = [
    {
      id: 'salle-journee',
      icon: Building,
      title: 'Salle sèche — journée',
      shortTitle: 'Journée',
      timeSlot: '8h – 18h environ',
      description: 'Location de salle équipée, sans restauration',
      includes: [],
      pricingType: 'flat',
      flatPrice: 600,
      priceDisplay: '600 €',
      priceSublabel: 'HT · forfait',
    },
    {
      id: 'salle-soiree',
      icon: Moon,
      title: 'Salle sèche — soirée',
      shortTitle: 'Soirée',
      timeSlot: '17h – 23h',
      description: 'Location en soirée, prolongation possible',
      includes: [],
      pricingType: 'flat',
      flatPrice: 500,
      extraHourRate: 50,
      priceDisplay: '500 €',
      priceSublabel: 'HT + 50 € / h supp.',
    },
  ];

  const PER_PERSON_FORMULAS: Formula[] = [
    {
      id: 'journee-repas-complet',
      icon: UtensilsCrossed,
      title: 'Journée d\'étude — repas complet',
      shortTitle: 'Repas complet',
      description: 'Journée complète avec restauration assise',
      includes: ['Accueil petit déjeuner', 'Repas midi complet', 'Pause café'],
      pricingType: 'perPerson',
      pricePerPerson: 45,
      minPersons: 12,
      priceDisplay: '45 €',
      priceSublabel: 'HT / pers. · 12 pers. min.',
    },
    {
      id: 'journee-apero',
      icon: Wine,
      title: 'Journée d\'étude — apéro dînatoire',
      shortTitle: 'Apéro dînatoire',
      description: 'Journée complète avec formule cocktail',
      includes: ['Accueil petit déjeuner', 'Apéro dînatoire', 'Pause café'],
      pricingType: 'perPerson',
      pricePerPerson: 35,
      minPersons: 15,
      priceDisplay: '35 €',
      priceSublabel: 'HT / pers. · 15 pers. min.',
    },
    {
      id: 'demi-journee-team',
      icon: Trees,
      title: 'Demi-journée + Team Building',
      shortTitle: 'Team Building',
      description: 'Étude et activités de cohésion encadrées',
      includes: ['Demi-journée en salle', 'Activités team building'],
      pricingType: 'perPerson',
      pricePerPerson: 60,
      minPersons: 8,
      priceDisplay: '60 €',
      priceSublabel: 'HT / pers.',
    },
  ];

  const ALL_FORMULAS = [...FLAT_FORMULAS, ...PER_PERSON_FORMULAS];

  let selectedFormulaId = $state('salle-journee');
  let participants = $state(20);
  let extraHours = $state(0);
  let displayedTotal = $state(0);
  let animationFrame: number | null = null;

  const selectedFormula = $derived(ALL_FORMULAS.find(f => f.id === selectedFormulaId)!);
  const minParticipants = $derived(selectedFormula.minPersons ?? 8);
  const showParticipants = $derived(selectedFormula.pricingType === 'perPerson');
  const showExtraHours = $derived(!!selectedFormula.extraHourRate);

  $effect(() => {
    const min = selectedFormula.minPersons ?? 8;
    if (participants < min) participants = min;
  });

  $effect(() => {
    if (!selectedFormula.extraHourRate) extraHours = 0;
  });

  const total = $derived.by(() => {
    const f = selectedFormula;
    if (f.pricingType === 'flat') {
      return (f.flatPrice ?? 0) + (f.extraHourRate ? extraHours * f.extraHourRate : 0);
    }
    return (f.pricePerPerson ?? 0) * participants;
  });

  $effect(() => {
    const target = total;
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
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

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };
  });

  const mailtoHref = $derived.by(() => {
    const f = selectedFormula;
    const lines = [
      'Bonjour,',
      '',
      'Je souhaite obtenir un devis pour :',
      '',
      `Formule : ${f.title}`,
    ];
    if (f.pricingType === 'perPerson') {
      lines.push(`Participants : ${participants}`);
    }
    if (f.extraHourRate && extraHours > 0) {
      lines.push(`Heures supplémentaires : ${extraHours}`);
    }
    lines.push('', `Estimation : ${total} € HT`, '', 'Merci de me recontacter.');
    const body = lines.join('\n');
    const base = quoteMailto.replace(/^mailto:/, '');
    const subject = f.pricingType === 'perPerson'
      ? `Devis ${f.title} — ${participants} participants`
      : `Devis ${f.title}`;
    return `mailto:${base}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  function clampParticipants(val: number) {
    participants = Math.max(minParticipants, Math.min(80, val));
  }

  function clampExtraHours(val: number) {
    extraHours = Math.max(0, Math.min(6, val));
  }

  function formatPrice(n: number) {
    return n.toLocaleString('fr-FR') + '\u202f€';
  }
</script>

<div class="configurator-root w-full">
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

    <!-- ── LEFT COLUMN ──────────────────────────────────────────────────── -->
    <div role="radiogroup" aria-label="Formules séminaire" class="space-y-8">

      <!-- ═══ GROUP 1: Location salle sèche (flat-rate) — FIRST ══════════ -->
      <div>
        <h3 class="font-heading font-bold text-sm uppercase tracking-wider mb-4" style="color: {accentColor}; opacity: 0.7;">
          Location salle sèche
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each FLAT_FORMULAS as formula (formula.id)}
            {@const isSelected = selectedFormulaId === formula.id}

            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onclick={() => (selectedFormulaId = formula.id)}
              class="flat-card relative text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
              style="
                border-color: {isSelected ? accentColor : accentBorder};
                background-color: {isSelected ? accentLight : 'white'};
                outline-color: {accentColor};
                box-shadow: {isSelected ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
              "
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style="border-color: {isSelected ? accentColor : '#d1d5db'};"
                >
                  {#if isSelected}
                    <span class="w-2.5 h-2.5 rounded-full" style="background-color: {accentColor};"></span>
                  {/if}
                </span>

                <span
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style="background-color: {isSelected ? accentMedium : accentLight}; color: {accentColor};"
                >
                  <svelte:component this={formula.icon} class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
                </span>

                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-gray-800 leading-tight">{formula.shortTitle}</p>
                  <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock class="w-3 h-3 inline-block" strokeWidth={1.5} />
                    {formula.timeSlot}
                  </p>
                </div>

                <div class="text-right flex-shrink-0">
                  <p class="font-heading font-bold text-base" style="color: {accentColor};">{formula.priceDisplay}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">{formula.priceSublabel}</p>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- ── Extra hours stepper (soirée) ───────────────────────────────── -->
      {#if showExtraHours}
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border transition-all duration-300"
          style="border-color: {accentBorder};"
        >
          <div class="flex items-center gap-3 flex-1">
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style="background-color: {accentLight}; color: {accentColor};"
            >
              <Clock class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
            </span>
            <div>
              <p class="text-sm font-semibold text-gray-800">Heures supplémentaires</p>
              <p class="text-xs text-gray-400">Après 23h · 50 € HT / heure</p>
            </div>
          </div>

          <div class="flex items-center gap-0">
            <button
              type="button"
              onclick={() => clampExtraHours(extraHours - 1)}
              class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
              style="border-color: {accentBorder}; color: {accentColor};"
              aria-label="Moins une heure"
              disabled={extraHours <= 0}
            >
              <Minus class="w-4 h-4" strokeWidth={2} />
            </button>
            <span
              class="w-16 h-10 flex items-center justify-center font-heading font-bold text-base border border-x-0"
              style="border-color: {accentBorder}; color: {accentColor};"
            >{extraHours}h</span>
            <button
              type="button"
              onclick={() => clampExtraHours(extraHours + 1)}
              class="stepper-btn w-10 h-10 rounded-r-xl flex items-center justify-center border border-l-0 transition-colors"
              style="border-color: {accentBorder}; color: {accentColor};"
              aria-label="Plus une heure"
              disabled={extraHours >= 6}
            >
              <Plus class="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {#if extraHours > 0}
            <p class="text-xs text-gray-400">
              Fin à <strong class="text-gray-600">{(23 + extraHours) % 24}h</strong> · +{formatPrice(extraHours * 50)} HT
            </p>
          {/if}
        </div>
      {/if}

      <!-- ═══ DIVIDER — Transition to study day formulas ═════════════════ -->
      <div class="relative flex items-center gap-4 py-2">
        <div class="flex-1 h-px" style="background-color: {accentBorder};"></div>
        <p class="font-heading font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap" style="color: {accentColor}; opacity: 0.6;">
          Ou profitez de nos formules journée d'étude
        </p>
        <div class="flex-1 h-px" style="background-color: {accentBorder};"></div>
      </div>

      <!-- ═══ GROUP 2: Per-person pricing cards ══════════════════════════ -->
      <div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {#each PER_PERSON_FORMULAS as formula (formula.id)}
            {@const isSelected = selectedFormulaId === formula.id}

            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onclick={() => (selectedFormulaId = formula.id)}
              class="pricing-card relative flex flex-col items-center text-center p-5 pt-7 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
              style="
                border-color: {isSelected ? accentColor : accentBorder};
                background: {isSelected ? `linear-gradient(180deg, ${accentLight} 0%, white 50%)` : 'white'};
                outline-color: {accentColor};
                box-shadow: {isSelected ? `0 0 0 1px ${accentColor}25, 0 8px 30px ${accentColor}18` : '0 1px 3px rgba(0,0,0,0.04)'};
              "
            >
              <span
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300"
                style="background-color: {isSelected ? accentMedium : accentLight}; color: {accentColor};"
              >
                <svelte:component this={formula.icon} class="w-5 h-5" strokeWidth={1.5} />
              </span>

              <p class="font-heading font-bold text-sm text-gray-800 leading-tight mb-1">{formula.shortTitle}</p>
              <p class="text-xs text-gray-400 leading-relaxed mb-4">{formula.description}</p>

              <div class="mb-4">
                <span class="font-heading font-bold text-2xl" style="color: {accentColor};">{formula.priceDisplay}</span>
                <span class="block text-xs text-gray-400 mt-0.5">{formula.priceSublabel}</span>
                {#if formula.minPersons}
                  <span class="block text-[10px] text-gray-400 mt-0.5">{formula.minPersons} pers. minimum</span>
                {/if}
              </div>

              <div class="w-full h-px mb-3" style="background-color: {isSelected ? accentBorder : '#e5e7eb'};"></div>

              <div class="w-full space-y-1.5 mb-4">
                {#each formula.includes as item}
                  <p class="flex items-center gap-1.5 text-xs text-gray-500 text-left">
                    <Check class="w-3 h-3 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                    {item}
                  </p>
                {/each}
              </div>

              <div class="mt-auto w-full">
                {#if isSelected}
                  <span
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white w-full justify-center"
                    style="background-color: {accentColor};"
                  >
                    <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                    Sélectionné
                  </span>
                {:else}
                  <span
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium w-full justify-center border transition-colors"
                    style="border-color: {accentBorder}; color: {accentColor};"
                  >
                    Choisir
                  </span>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- ── Participants stepper (per-person formulas) ─────────────────── -->
      {#if showParticipants}
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border transition-all duration-300"
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
              <p class="text-xs text-gray-400">Entre {minParticipants} et 80 personnes</p>
            </div>
          </div>

          <div class="flex items-center gap-0">
            <button
              type="button"
              onclick={() => clampParticipants(participants - 1)}
              class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
              style="border-color: {accentBorder}; color: {accentColor};"
              aria-label="Moins un participant"
              disabled={participants <= minParticipants}
            >
              <Minus class="w-4 h-4" strokeWidth={2} />
            </button>
            <input
              type="number"
              min={minParticipants}
              max="80"
              value={participants}
              oninput={(e) => clampParticipants(parseInt((e.target as HTMLInputElement).value) || minParticipants)}
              class="stepper-input w-16 h-10 text-center font-heading font-bold text-base border border-x-0 focus:outline-none"
              style="border-color: {accentBorder}; color: {accentColor};"
              aria-label="Nombre de participants"
            />
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

          <div class="flex-1 sm:max-w-[180px]">
            <input
              type="range"
              min={minParticipants}
              max="80"
              bind:value={participants}
              class="participants-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style="
                --thumb-color: {accentColor};
                --track-color: {accentBorder};
                background: linear-gradient(to right, {accentColor} 0%, {accentColor} {((participants - minParticipants) / (80 - minParticipants)) * 100}%, {accentBorder} {((participants - minParticipants) / (80 - minParticipants)) * 100}%, {accentBorder} 100%);
              "
              aria-label="Curseur participants"
            />
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>{minParticipants}</span>
              <span>80</span>
            </div>
          </div>
        </div>
      {/if}

    </div>

    <!-- ── RIGHT COLUMN: Sticky Summary ─────────────────────────────────── -->
    <div class="lg:sticky lg:top-24">
      <div
        class="summary-card rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        style="border: 1.5px solid {accentBorder};"
      >
        <div
          class="px-6 py-5"
          style="background: linear-gradient(135deg, {accentColor} 0%, var(--color-brun-terre) 100%);"
        >
          <p class="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Votre estimation</p>
          <div class="flex items-baseline gap-2">
            <span class="font-heading font-bold text-3xl text-white tabular-nums" aria-live="polite">
              {displayedTotal.toLocaleString('fr-FR')}
            </span>
            <span class="text-white/70 text-lg font-medium">&nbsp;€ <span class="text-sm">HT</span></span>
          </div>
          {#if showParticipants}
            <p class="text-white/50 text-xs mt-1">pour {participants} participant{participants > 1 ? 's' : ''}</p>
          {/if}
        </div>

        <div class="bg-white px-6 py-5 space-y-3">
          <div class="summary-row flex items-start justify-between text-sm gap-2">
            <span class="text-gray-600 flex items-center gap-2 min-w-0">
              <svelte:component this={selectedFormula.icon} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
              <span class="leading-tight">{selectedFormula.title}</span>
            </span>
          </div>

          {#if selectedFormula.pricingType === 'perPerson'}
            <div class="flex items-center justify-between text-sm text-gray-500 pl-6">
              <span>{selectedFormula.pricePerPerson} € × {participants} pers.</span>
              <span class="font-semibold text-gray-800 tabular-nums">{formatPrice(total)}</span>
            </div>
          {:else}
            <div class="flex items-center justify-between text-sm text-gray-500 pl-6">
              <span>Forfait location</span>
              <span class="font-semibold text-gray-800 tabular-nums">{formatPrice(selectedFormula.flatPrice ?? 0)}</span>
            </div>
          {/if}

          {#if showExtraHours && extraHours > 0}
            <div class="pt-1 option-row-enter" style="border-top: 1px solid {accentBorder};">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {extraHours}h supp.
                </span>
                <span class="font-medium text-gray-700 tabular-nums">{formatPrice(extraHours * 50)}</span>
              </div>
            </div>
          {/if}

          {#if selectedFormula.includes.length > 0}
            <div class="pt-2" style="border-top: 1px solid {accentBorder};">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Inclus</p>
              {#each selectedFormula.includes as item}
                <p class="flex items-center gap-1.5 text-xs text-gray-500 leading-relaxed">
                  <Check class="w-3 h-3 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                  {item}
                </p>
              {/each}
            </div>
          {/if}

          <div class="pt-3 mt-1" style="border-top: 2px solid {accentBorder};">
            <div class="flex items-center justify-between">
              <span class="font-heading font-bold text-sm text-gray-800">Total estimé HT</span>
              <span class="font-heading font-bold text-xl tabular-nums" style="color: {accentColor};">
                {formatPrice(total)}
              </span>
            </div>
            {#if selectedFormula.pricingType === 'perPerson'}
              <p class="text-xs text-gray-400 mt-1">
                Soit {formatPrice(Math.round((total / participants) * 10) / 10)} HT / participant
              </p>
            {/if}
          </div>

          <div class="mt-2 rounded-xl px-4 py-3 text-xs text-center leading-relaxed" style="background-color: {accentLight}; color: {accentColor};">
            Estimation indicative HT. Le tarif exact est confirmé par devis personnalisé.
          </div>

          <a
            href={mailtoHref}
            class="cta-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-heading font-bold text-sm text-white transition-all duration-200 hover:shadow-md hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-full mt-2"
            style="background: linear-gradient(135deg, {accentColor} 0%, var(--color-brun-terre) 100%); outline-color: {accentColor};"
          >
            <span class="cta-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);"></span>
            Demander un devis
            <ArrowRight class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </a>

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
    </div>

  </div>
</div>

<style>
  .stepper-input[type='number']::-webkit-inner-spin-button,
  .stepper-input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .stepper-input[type='number'] {
    -moz-appearance: textfield;
  }
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
  .stepper-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .stepper-btn:not(:disabled):hover {
    background-color: color-mix(in srgb, var(--accent, var(--color-salle)) 8%, white);
  }
  .pricing-card:not([aria-checked='true']):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  }
  .pricing-card[aria-checked='true'] {
    transform: translateY(-2px);
  }
  .flat-card:not([aria-checked='true']):hover {
    transform: translateY(-1px);
  }
  .flat-card[aria-checked='true'] {
    transform: translateY(-1px);
  }
  @keyframes optionRowSlideIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .option-row-enter {
    animation: optionRowSlideIn 0.2s ease-out both;
  }
  .cta-shimmer {
    background-size: 200% 100%;
    transform: skewX(-15deg);
  }
  @media (prefers-reduced-motion: reduce) {
    .pricing-card,
    .flat-card,
    .option-row-enter,
    .cta-shimmer {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
