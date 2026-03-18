<script lang="ts">
  /**
   * SeminarConfigurator — Interactive seminar pricing configurator
   * Step 1: Toggle Journée (600€) / Soirée (500€)
   * Step 2 (Journée): Options — Restauration (with meal format sub-toggle),
   *   Team Building (with optional coaching sub-option)
   * Step 2 (Soirée): Extra hours stepper
   * + Prominent callout for custom/unusual requests
   */
  import { untrack } from 'svelte';
  import Sun from 'lucide-svelte/icons/sun';
  import UtensilsCrossed from 'lucide-svelte/icons/utensils-crossed';
  import Wine from 'lucide-svelte/icons/wine';
  import Trees from 'lucide-svelte/icons/trees';
  import Trophy from 'lucide-svelte/icons/trophy';
  import Users from 'lucide-svelte/icons/users';
  import Check from 'lucide-svelte/icons/check';
  import Plus from 'lucide-svelte/icons/plus';
  import Minus from 'lucide-svelte/icons/minus';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
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

  // ── Light tints ──────────────────────────────────────────────────────────
  const accentLight = `${accentColor}12`;
  const accentMedium = `${accentColor}20`;
  const accentBorder = `${accentColor}30`;

  // ── Time slots ──────────────────────────────────────────────────────────
  type TimeSlot = 'journee' | 'soiree';
  type MealFormat = 'repas-complet' | 'apero-dinatoire';

  const TIME_SLOTS: { id: TimeSlot; icon: any; label: string; hours: string; basePrice: number }[] = [
    { id: 'journee', icon: Sun,  label: 'Journée',  hours: '8h – 18h',  basePrice: 600 },
    { id: 'soiree',  icon: Moon, label: 'Soirée',   hours: '17h – 23h', basePrice: 500 },
  ];

  const MEAL_FORMATS: { id: MealFormat; label: string; price: number }[] = [
    { id: 'repas-complet',    label: 'Repas complet',    price: 45 },
    { id: 'apero-dinatoire',  label: 'Apéro dînatoire',  price: 35 },
  ];

  const TEAM_BUILDING_PRICE = 60;
  const COACHING_PRICE = 35; // indicative

  // ── State ─────────────────────────────────────────────────────────────────
  let timeSlot = $state<TimeSlot>('journee');
  let participants = $state(20);
  let extraHours = $state(0);

  let hasRestauration = $state(false);
  let mealFormat = $state<MealFormat>('repas-complet');
  let hasTeamBuilding = $state(false);
  let hasCoaching = $state(false);

  let displayedTotal = $state(0);
  let animationFrame: number | null = null;

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentSlot = $derived(TIME_SLOTS.find(s => s.id === timeSlot)!);
  const isJournee = $derived(timeSlot === 'journee');
  const currentMeal = $derived(MEAL_FORMATS.find(m => m.id === mealFormat)!);

  const minParticipants = $derived.by(() => {
    if (hasRestauration && mealFormat === 'apero-dinatoire') return 15;
    if (hasRestauration) return 12;
    return 8;
  });

  // Clear journée-only options when switching to soirée (restauration stays)
  $effect(() => {
    if (!isJournee) {
      hasTeamBuilding = false;
      hasCoaching = false;
    }
  });

  $effect(() => {
    if (isJournee) extraHours = 0;
  });

  // Clear coaching when team building is deselected
  $effect(() => {
    if (!hasTeamBuilding) hasCoaching = false;
  });

  $effect(() => {
    if (participants < minParticipants) participants = minParticipants;
  });

  const restaurationSubtotal = $derived(
    hasRestauration ? currentMeal.price * participants : 0
  );

  const teamBuildingSubtotal = $derived(
    isJournee && hasTeamBuilding ? TEAM_BUILDING_PRICE * participants : 0
  );

  const coachingSubtotal = $derived(
    isJournee && hasTeamBuilding && hasCoaching ? COACHING_PRICE * participants : 0
  );

  const extraHoursSubtotal = $derived(!isJournee ? extraHours * 50 : 0);

  const total = $derived(
    currentSlot.basePrice + restaurationSubtotal + teamBuildingSubtotal + coachingSubtotal + extraHoursSubtotal
  );

  // ── Counting animation ────────────────────────────────────────────────────
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

  // ── Mailto ────────────────────────────────────────────────────────────────
  const mailtoHref = $derived.by(() => {
    const slotLabel = isJournee ? 'Salle journée (8h-18h)' : 'Salle soirée (17h-23h)';
    const lines = [
      'Bonjour,',
      '',
      'Je souhaite obtenir un devis pour :',
      '',
      `Créneau : ${slotLabel} — ${currentSlot.basePrice} € HT`,
    ];
    if (isJournee) {
      lines.push(`Participants : ${participants}`);
      if (hasRestauration) {
        lines.push(`Restauration : ${currentMeal.label} (${currentMeal.price} € HT/pers.)`);
      }
      if (hasTeamBuilding) {
        lines.push(`Team Building (${TEAM_BUILDING_PRICE} € HT/pers.)`);
        if (hasCoaching) lines.push(`+ Coaching professionnel (~${COACHING_PRICE} € HT/pers.)`);
      }
    } else if (extraHours > 0) {
      lines.push(`Heures supplémentaires : ${extraHours}h (+${extraHours * 50} € HT)`);
    }
    lines.push('', `Estimation : ${total} € HT`, '', 'Merci de me recontacter.');
    const body = lines.join('\n');
    const base = quoteMailto.replace(/^mailto:/, '');
    return `mailto:${base}?subject=${encodeURIComponent(`Devis séminaire — ${slotLabel}`)}&body=${encodeURIComponent(body)}`;
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
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

<!-- ───────────────────────────────────────────────────────────────────────── -->

<div class="configurator-root w-full">
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

    <!-- ── LEFT COLUMN ──────────────────────────────────────────────────── -->
    <div class="space-y-6">

      <!-- ═══ TIME SLOT TOGGLE ════════════════════════════════════════════ -->
      <div
        class="p-1.5 rounded-2xl"
        style="background-color: {accentLight}; border: 1.5px solid {accentBorder};"
      >
        <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Créneau horaire">
          {#each TIME_SLOTS as slot (slot.id)}
            {@const isActive = timeSlot === slot.id}

            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              onclick={() => (timeSlot = slot.id)}
              class="slot-toggle relative flex items-center justify-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl"
              style="
                background-color: {isActive ? accentColor : 'transparent'};
                color: {isActive ? 'white' : '#6b7280'};
                outline-color: {accentColor};
                box-shadow: {isActive ? '0 4px 15px ' + accentColor + '40' : 'none'};
              "
            >
              <svelte:component this={slot.icon} class="w-5 h-5" strokeWidth={1.5} />
              <div class="text-left">
                <p class="font-heading font-bold text-sm leading-tight">{slot.label}</p>
                <p class="text-xs mt-0.5" style="opacity: {isActive ? 0.7 : 0.5};">{slot.hours}</p>
              </div>
              <div class="ml-auto text-right">
                <p class="font-heading font-bold text-lg leading-tight">{slot.basePrice}&nbsp;€</p>
                <p class="text-[10px] mt-0.5" style="opacity: {isActive ? 0.6 : 0.4};">HT</p>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- ═══ JOURNÉE ═════════════════════════════════════════════════════ -->
      {#if isJournee}

        <!-- Participants stepper -->
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border"
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

        <!-- Options header -->
        <h3 class="font-heading font-bold text-sm uppercase tracking-wider" style="color: {accentColor}; opacity: 0.7;">
          Options à la carte
        </h3>

        <!-- ─── OPTION: Restauration ──────────────────────────────────── -->
        <button
          type="button"
          onclick={() => (hasRestauration = !hasRestauration)}
          class="option-card w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
          style="
            border-color: {hasRestauration ? accentColor : accentBorder};
            background-color: {hasRestauration ? accentLight : 'white'};
            outline-color: {accentColor};
            box-shadow: {hasRestauration ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
          "
          aria-pressed={hasRestauration}
        >
          <div class="flex items-start gap-3">
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
              style="background-color: {hasRestauration ? accentMedium : accentLight}; color: {accentColor};"
            >
              <UtensilsCrossed class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-800 leading-tight">Restauration</p>
              <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Accueil petit déjeuner, repas, pause café
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="font-heading font-bold text-sm" style="color: {accentColor};">
                dès 35&nbsp;€
                <span class="font-normal text-gray-400 text-xs">HT /pers.</span>
              </span>
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                style="background-color: {hasRestauration ? accentColor : accentLight}; color: {hasRestauration ? 'white' : accentColor};"
              >
                {#if hasRestauration}
                  <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                {:else}
                  <Plus class="w-3.5 h-3.5" strokeWidth={2} />
                {/if}
              </span>
            </div>
          </div>
        </button>

        <!-- Sub-toggle: meal format (only when restauration is active) -->
        {#if hasRestauration}
          <div
            class="meal-format-row -mt-3 ml-6 p-3 rounded-xl border transition-all duration-300"
            style="border-color: {accentBorder}; background-color: white;"
          >
            <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Format du repas</p>
            <div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Format du repas">
              {#each MEAL_FORMATS as format (format.id)}
                {@const isActive = mealFormat === format.id}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onclick={(e) => { e.stopPropagation(); mealFormat = format.id; }}
                  class="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left"
                  style="
                    border-color: {isActive ? accentColor : accentBorder};
                    background-color: {isActive ? accentLight : 'white'};
                  "
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <svelte:component this={format.id === 'repas-complet' ? UtensilsCrossed : Wine} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                    <span class="text-xs font-medium text-gray-700 truncate">{format.label}</span>
                  </div>
                  <span class="font-heading font-bold text-xs flex-shrink-0" style="color: {accentColor};">{format.price}&nbsp;€</span>
                </button>
              {/each}
            </div>
            <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 pl-0.5">
              <span class="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Check class="w-2.5 h-2.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                Accueil petit déjeuner
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Check class="w-2.5 h-2.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                {mealFormat === 'repas-complet' ? 'Repas midi complet' : 'Apéro dînatoire'}
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Check class="w-2.5 h-2.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                Pause café
              </span>
            </div>
            {#if mealFormat === 'repas-complet'}
              <p class="text-[10px] text-gray-400 mt-1.5 pl-0.5">12 personnes minimum</p>
            {:else}
              <p class="text-[10px] text-gray-400 mt-1.5 pl-0.5">15 personnes minimum</p>
            {/if}
          </div>
        {/if}

        <!-- ─── OPTION: Team Building ─────────────────────────────────── -->
        <button
          type="button"
          onclick={() => (hasTeamBuilding = !hasTeamBuilding)}
          class="option-card w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
          style="
            border-color: {hasTeamBuilding ? accentColor : accentBorder};
            background-color: {hasTeamBuilding ? accentLight : 'white'};
            outline-color: {accentColor};
            box-shadow: {hasTeamBuilding ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
          "
          aria-pressed={hasTeamBuilding}
        >
          <div class="flex items-start gap-3">
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
              style="background-color: {hasTeamBuilding ? accentMedium : accentLight}; color: {accentColor};"
            >
              <Trees class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-800 leading-tight">Demi-journée Team Building</p>
              <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Activités de cohésion encadrées sur le site
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="font-heading font-bold text-sm" style="color: {accentColor};">
                {TEAM_BUILDING_PRICE}&nbsp;€
                <span class="font-normal text-gray-400 text-xs">HT /pers.</span>
              </span>
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                style="background-color: {hasTeamBuilding ? accentColor : accentLight}; color: {hasTeamBuilding ? 'white' : accentColor};"
              >
                {#if hasTeamBuilding}
                  <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                {:else}
                  <Plus class="w-3.5 h-3.5" strokeWidth={2} />
                {/if}
              </span>
            </div>
          </div>
        </button>

        <!-- Sub-option: Coaching (only when team building is active) -->
        {#if hasTeamBuilding}
          <button
            type="button"
            onclick={() => (hasCoaching = !hasCoaching)}
            class="coaching-sub -mt-3 ml-6 w-[calc(100%-1.5rem)] text-left p-3 rounded-xl border-2 transition-all duration-300"
            style="
              border-color: {hasCoaching ? accentColor : accentBorder};
              background-color: {hasCoaching ? accentLight : 'white'};
              box-shadow: {hasCoaching ? `0 0 0 1px ${accentColor}20` : 'none'};
            "
            aria-pressed={hasCoaching}
          >
            <div class="flex items-center gap-3">
              <span
                class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                style="background-color: {hasCoaching ? accentMedium : accentLight}; color: {accentColor};"
              >
                <Trophy class="w-3.5 h-3.5" strokeWidth={1.5} />
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-xs text-gray-800 leading-tight">Coaching professionnel</p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  Koh-Lanta, cohésion d'équipe, défis — coach dédié
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-xs" style="color: {accentColor};">
                  <span class="font-heading font-bold">~{COACHING_PRICE}&nbsp;€</span>
                  <span class="text-gray-400">/pers.</span>
                </span>
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                  style="background-color: {hasCoaching ? accentColor : accentLight}; color: {hasCoaching ? 'white' : accentColor};"
                >
                  {#if hasCoaching}
                    <Check class="w-3 h-3" strokeWidth={2.5} />
                  {:else}
                    <Plus class="w-3 h-3" strokeWidth={2} />
                  {/if}
                </span>
              </div>
            </div>
            <p class="text-[9px] uppercase tracking-wide font-semibold mt-1.5 ml-11" style="color: {accentColor}; opacity: 0.5;">Prix indicatif</p>
          </button>
        {/if}

      <!-- ═══ SOIRÉE ══════════════════════════════════════════════════════ -->
      {:else}

        <!-- Participants stepper (for restauration pricing) -->
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border"
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

        <h3 class="font-heading font-bold text-sm uppercase tracking-wider" style="color: {accentColor}; opacity: 0.7;">
          Options
        </h3>

        <!-- Extra hours stepper -->
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-white border"
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
          {:else}
            <p class="text-xs text-gray-400">Inclus : 17h – 23h (6 heures)</p>
          {/if}
        </div>

        <!-- Restauration option (soirée) -->
        <button
          type="button"
          onclick={() => (hasRestauration = !hasRestauration)}
          class="option-card w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
          style="
            border-color: {hasRestauration ? accentColor : accentBorder};
            background-color: {hasRestauration ? accentLight : 'white'};
            outline-color: {accentColor};
            box-shadow: {hasRestauration ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
          "
          aria-pressed={hasRestauration}
        >
          <div class="flex items-start gap-3">
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
              style="background-color: {hasRestauration ? accentMedium : accentLight}; color: {accentColor};"
            >
              <UtensilsCrossed class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-800 leading-tight">Restauration</p>
              <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Repas complet ou apéro dînatoire
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="font-heading font-bold text-sm" style="color: {accentColor};">
                dès 35&nbsp;€
                <span class="font-normal text-gray-400 text-xs">HT /pers.</span>
              </span>
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                style="background-color: {hasRestauration ? accentColor : accentLight}; color: {hasRestauration ? 'white' : accentColor};"
              >
                {#if hasRestauration}
                  <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                {:else}
                  <Plus class="w-3.5 h-3.5" strokeWidth={2} />
                {/if}
              </span>
            </div>
          </div>
        </button>

        <!-- Meal format sub-toggle (soirée) -->
        {#if hasRestauration}
          <div
            class="meal-format-row -mt-3 ml-6 p-3 rounded-xl border transition-all duration-300"
            style="border-color: {accentBorder}; background-color: white;"
          >
            <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Format du repas</p>
            <div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Format du repas">
              {#each MEAL_FORMATS as format (format.id)}
                {@const isActive = mealFormat === format.id}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onclick={(e) => { e.stopPropagation(); mealFormat = format.id; }}
                  class="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left"
                  style="
                    border-color: {isActive ? accentColor : accentBorder};
                    background-color: {isActive ? accentLight : 'white'};
                  "
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <svelte:component this={format.id === 'repas-complet' ? UtensilsCrossed : Wine} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                    <span class="text-xs font-medium text-gray-700 truncate">{format.label}</span>
                  </div>
                  <span class="font-heading font-bold text-xs flex-shrink-0" style="color: {accentColor};">{format.price}&nbsp;€</span>
                </button>
              {/each}
            </div>
            {#if mealFormat === 'repas-complet'}
              <p class="text-[10px] text-gray-400 mt-1.5 pl-0.5">12 personnes minimum</p>
            {:else}
              <p class="text-[10px] text-gray-400 mt-1.5 pl-0.5">15 personnes minimum</p>
            {/if}
          </div>
        {/if}

      {/if}

    </div>

    <!-- ── RIGHT COLUMN: Sticky Summary ─────────────────────────────────── -->
    <div class="lg:sticky lg:top-24">
      <div
        class="summary-card rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
        style="border: 1.5px solid {accentBorder};"
      >
        <!-- Summary header -->
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
          {#if isJournee || hasRestauration}
            <p class="text-white/50 text-xs mt-1">pour {participants} participant{participants > 1 ? 's' : ''}</p>
          {/if}
        </div>

        <!-- Summary body -->
        <div class="bg-white px-6 py-5 space-y-3">

          <!-- Base row -->
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 flex items-center gap-2">
              <svelte:component this={currentSlot.icon} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
              Salle {currentSlot.label.toLowerCase()}
              <span class="text-gray-400 text-xs">({currentSlot.hours})</span>
            </span>
            <span class="font-semibold text-gray-800 tabular-nums">{currentSlot.basePrice}&nbsp;€</span>
          </div>

          <!-- Restauration row -->
          {#if hasRestauration}
            <div class="pt-1" style="border-top: 1px solid {accentBorder};">
              <div class="flex items-center justify-between text-sm option-row-enter">
                <span class="text-gray-500 flex items-center gap-2 min-w-0">
                  {#if mealFormat === 'repas-complet'}
                    <UtensilsCrossed class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {:else}
                    <Wine class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {/if}
                  <span class="truncate">{currentMeal.label}</span>
                  <span class="text-gray-400 flex-shrink-0">× {participants}</span>
                </span>
                <span class="font-medium text-gray-700 flex-shrink-0 ml-2 tabular-nums">
                  {formatPrice(restaurationSubtotal)}
                </span>
              </div>
            </div>
          {/if}

          <!-- Team building row -->
          {#if isJournee && hasTeamBuilding}
            <div class="pt-1" style="border-top: 1px solid {accentBorder};">
              <div class="flex items-center justify-between text-sm option-row-enter">
                <span class="text-gray-500 flex items-center gap-2 min-w-0">
                  <Trees class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  <span class="truncate">Team Building</span>
                  <span class="text-gray-400 flex-shrink-0">× {participants}</span>
                </span>
                <span class="font-medium text-gray-700 flex-shrink-0 ml-2 tabular-nums">
                  {formatPrice(teamBuildingSubtotal)}
                </span>
              </div>
              {#if hasCoaching}
                <div class="flex items-center justify-between text-sm mt-1.5 option-row-enter">
                  <span class="text-gray-500 flex items-center gap-2 min-w-0 pl-5">
                    <Trophy class="w-3 h-3 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                    <span class="truncate">Coaching pro</span>
                    <span class="text-gray-400 flex-shrink-0">× {participants}</span>
                  </span>
                  <span class="font-medium text-gray-700 flex-shrink-0 ml-2 tabular-nums">
                    ~{formatPrice(coachingSubtotal)}
                  </span>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Extra hours row (soirée) -->
          {#if !isJournee && extraHours > 0}
            <div class="pt-1 option-row-enter" style="border-top: 1px solid {accentBorder};">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {extraHours}h supp.
                </span>
                <span class="font-medium text-gray-700 tabular-nums">{formatPrice(extraHoursSubtotal)}</span>
              </div>
            </div>
          {/if}

          <!-- Divider + Total -->
          <div class="pt-3 mt-1" style="border-top: 2px solid {accentBorder};">
            <div class="flex items-center justify-between">
              <span class="font-heading font-bold text-sm text-gray-800">Total estimé HT</span>
              <span class="font-heading font-bold text-xl tabular-nums" style="color: {accentColor};">
                {formatPrice(total)}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              {#if hasRestauration || hasTeamBuilding}
                Soit {formatPrice(Math.round((total / participants) * 10) / 10)} HT /pers.
              {:else if isJournee}
                Hors options — ajoutez vos souhaits ci-contre
              {:else}
                Ajoutez des options ci-contre
              {/if}
            </p>
          </div>

          <!-- Note -->
          <div
            class="mt-2 rounded-xl px-4 py-3 text-xs text-center leading-relaxed"
            style="background-color: {accentLight}; color: {accentColor};"
          >
            Estimation indicative HT. Le tarif exact est confirmé par devis personnalisé.
          </div>

          <!-- CTA -->
          <a
            href={mailtoHref}
            class="cta-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-heading font-bold text-sm text-white transition-all duration-200 hover:shadow-md hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-full mt-2"
            style="background: linear-gradient(135deg, {accentColor} 0%, var(--color-brun-terre) 100%); outline-color: {accentColor};"
          >
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

      <p class="lg:hidden text-xs text-center text-gray-400 mt-3">
        Sélectionnez vos options ci-dessus pour affiner l'estimation.
      </p>
    </div>

  </div>
</div>

<!-- ─────────────────────────────────────────────────────────────────────────── -->
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

  .slot-toggle:not([aria-checked='true']):hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .option-card:not([aria-pressed='true']):hover {
    transform: translateY(-1px);
  }
  .option-card[aria-pressed='true'] {
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
    .option-card,
    .slot-toggle,
    .option-row-enter,
    .cta-shimmer,
    .coaching-sub,
    .meal-format-row {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
