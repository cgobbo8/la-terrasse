<script lang="ts">
  /**
   * SeminarConfigurator — Interactive seminar pricing configurator
   *
   * Journée flow:
   *   Fork → Salle sèche (600€ flat) OR Journée d'étude (per-person)
   *   If Journée d'étude → compose formula:
   *     Repas: Repas complet (45€) / Apéro dînatoire (35€)
   *     Activité: En salle / Team Building (+25€/pers)
   *     → Participants → (if TB) Coaching option
   *
   * Soirée flow:
   *   Meal: none (500€ flat) / apéro (+35€/pers) / repas complet (+45€/pers)
   *   → (if meal) Participants → Extra hours
   */
  import { untrack } from 'svelte';
  import { translations, defaultLang } from '@/i18n/translations';
  import type { Lang } from '@/i18n/translations';
  import Sun from 'lucide-svelte/icons/sun';
  import Moon from 'lucide-svelte/icons/moon';
  import UtensilsCrossed from 'lucide-svelte/icons/utensils-crossed';
  import Wine from 'lucide-svelte/icons/wine';
  import Trees from 'lucide-svelte/icons/trees';
  import Building from 'lucide-svelte/icons/building';
  import Users from 'lucide-svelte/icons/users';
  import Check from 'lucide-svelte/icons/check';
  import Plus from 'lucide-svelte/icons/plus';
  import Minus from 'lucide-svelte/icons/minus';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import Clock from 'lucide-svelte/icons/clock';
  import Sparkles from 'lucide-svelte/icons/sparkles';

  interface Props {
    accentColor?: string;
    quoteMailto?: string;
    lang?: Lang;
  }

  let {
    accentColor = '',
    quoteMailto = 'mailto:',
    lang = defaultLang,
  }: Props = $props();

  type TKey = keyof typeof translations[typeof defaultLang];

  function t(key: TKey): string {
    return translations[lang]?.[key] ?? translations[defaultLang][key] ?? key;
  }

  // ── Color tints ──────────────────────────────────────────────────────
  const accentLight = `${accentColor}12`;
  const accentMedium = `${accentColor}20`;
  const accentBorder = `${accentColor}30`;

  // ── Types ────────────────────────────────────────────────────────────
  type TimeSlot = 'journee' | 'soiree';
  type JourneeMode = 'salle-seche' | 'journee-etude';
  type MealFormat = 'repas-complet' | 'apero';
  type SoireeMeal = 'none' | 'apero' | 'repas-complet';

  // ── Constants ────────────────────────────────────────────────────────
  const FLAT_JOURNEE = 600;
  const FLAT_SOIREE = 500;
  const PRICE_MEAL_FULL = 45;
  const PRICE_MEAL_APERO = 35;
  const PRICE_TB = 25;
  const PRICE_EXTRA_HOUR = 50;

  const TIME_SLOTS = [
    {
      id: 'journee' as TimeSlot,
      icon: Sun,
      labelKey: 'salle.seminaires.cfg.journee' as TKey,
      hoursKey: 'salle.seminaires.cfg.journeeHours' as TKey,
      flatPrice: FLAT_JOURNEE,
    },
    {
      id: 'soiree' as TimeSlot,
      icon: Moon,
      labelKey: 'salle.seminaires.cfg.soiree' as TKey,
      hoursKey: 'salle.seminaires.cfg.soireeHours' as TKey,
      flatPrice: FLAT_SOIREE,
    },
  ];

  const MEAL_DEFS: Record<string, { icon: typeof Building; labelKey: TKey; includeKeys: TKey[] }> = {
    'repas-complet': {
      icon: UtensilsCrossed,
      labelKey: 'salle.seminaires.cfg.mealFull' as TKey,
      includeKeys: [
        'salle.seminaires.cfg.breakfast' as TKey,
        'salle.seminaires.cfg.lunchFull' as TKey,
        'salle.seminaires.cfg.coffeeBreak' as TKey,
      ],
    },
    'apero': {
      icon: Wine,
      labelKey: 'salle.seminaires.cfg.mealAperitif' as TKey,
      includeKeys: [
        'salle.seminaires.cfg.breakfast' as TKey,
        'salle.seminaires.cfg.mealAperitif' as TKey,
        'salle.seminaires.cfg.coffeeBreak' as TKey,
      ],
    },
  };

  interface SoireeMealDef {
    id: SoireeMeal;
    icon: typeof Building;
    labelKey: TKey;
    descKey: TKey;
    pricePerPerson?: number;
    min?: number;
  }

  const SOIREE_MEALS: SoireeMealDef[] = [
    {
      id: 'none',
      icon: Building,
      labelKey: 'salle.seminaires.cfg.noMeal' as TKey,
      descKey: 'salle.seminaires.cfg.noMeal.desc' as TKey,
    },
    {
      id: 'apero',
      icon: Wine,
      labelKey: 'salle.seminaires.cfg.mealAperitif' as TKey,
      descKey: 'salle.seminaires.cfg.mealApero.cardDesc' as TKey,
      pricePerPerson: PRICE_MEAL_APERO,
      min: 15,
    },
    {
      id: 'repas-complet',
      icon: UtensilsCrossed,
      labelKey: 'salle.seminaires.cfg.mealFull' as TKey,
      descKey: 'salle.seminaires.cfg.mealFull.cardDesc' as TKey,
      pricePerPerson: PRICE_MEAL_FULL,
      min: 12,
    },
  ];

  // ── State ────────────────────────────────────────────────────────────
  let timeSlot = $state<TimeSlot>('journee');
  let journeeMode = $state<JourneeMode>('journee-etude');
  let journeeMeal = $state<MealFormat>('repas-complet');
  let soireeMeal = $state<SoireeMeal>('repas-complet');
  let hasTeamBuilding = $state(false);
  let hasCoaching = $state(false);
  let participants = $state(20);
  let extraHours = $state(0);
  let displayedTotal = $state(0);
  let animationFrame: number | null = null;

  // ── Derived ──────────────────────────────────────────────────────────
  const isJournee = $derived(timeSlot === 'journee');
  const isSoiree = $derived(timeSlot === 'soiree');
  const isJourneeEtude = $derived(isJournee && journeeMode === 'journee-etude');
  const isSalleSeche = $derived(isJournee && journeeMode === 'salle-seche');
  const hasSoireeMeal = $derived(isSoiree && soireeMeal !== 'none');
  const currentSlot = $derived(TIME_SLOTS.find(s => s.id === timeSlot)!);
  const needsParticipants = $derived(isJourneeEtude || hasSoireeMeal);

  const mealPrice = $derived.by(() => {
    if (isJourneeEtude) return journeeMeal === 'repas-complet' ? PRICE_MEAL_FULL : PRICE_MEAL_APERO;
    if (hasSoireeMeal) return soireeMeal === 'repas-complet' ? PRICE_MEAL_FULL : PRICE_MEAL_APERO;
    return 0;
  });

  const perPersonPrice = $derived.by(() => {
    let pp = mealPrice;
    if (isJourneeEtude && hasTeamBuilding) pp += PRICE_TB;
    return pp;
  });

  const minParticipants = $derived.by(() => {
    if (isJourneeEtude) return journeeMeal === 'repas-complet' ? 12 : 15;
    if (hasSoireeMeal) return soireeMeal === 'repas-complet' ? 12 : 15;
    return 8;
  });

  const activeMealDef = $derived.by(() => {
    if (isJourneeEtude) return MEAL_DEFS[journeeMeal] ?? null;
    if (hasSoireeMeal && soireeMeal !== 'none') return MEAL_DEFS[soireeMeal] ?? null;
    return null;
  });

  // ── Effects ──────────────────────────────────────────────────────────
  $effect(() => {
    if (!isJourneeEtude) {
      hasTeamBuilding = false;
      hasCoaching = false;
    }
  });

  $effect(() => {
    if (!hasTeamBuilding) {
      hasCoaching = false;
    }
  });

  $effect(() => {
    if (!isSoiree) {
      extraHours = 0;
    }
  });

  $effect(() => {
    if (needsParticipants && participants < minParticipants) {
      participants = minParticipants;
    }
  });

  // ── Total ────────────────────────────────────────────────────────────
  const total = $derived.by(() => {
    if (isSalleSeche) return FLAT_JOURNEE;
    if (isJourneeEtude) return perPersonPrice * participants;
    let base = FLAT_SOIREE + extraHours * PRICE_EXTRA_HOUR;
    if (hasSoireeMeal) base += mealPrice * participants;
    return base;
  });

  // ── Price animation ──────────────────────────────────────────────────
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

  // ── Mailto ───────────────────────────────────────────────────────────
  const mailtoHref = $derived.by(() => {
    const lines = [
      t('salle.seminaires.cfg.mailto.greeting'),
      '',
      t('salle.seminaires.cfg.mailto.intro'),
      '',
    ];

    const slotLabel = isJournee
      ? t('salle.seminaires.cfg.mailto.slotJournee')
      : t('salle.seminaires.cfg.mailto.slotSoiree');
    lines.push(`${t('salle.seminaires.cfg.mailto.slot')} : ${slotLabel}`);

    if (isSalleSeche) {
      lines.push(`${t('salle.seminaires.cfg.mailto.formula')} : ${t('salle.seminaires.cfg.mailto.pathDryHire')}`);
      lines.push(`${t('salle.seminaires.cfg.mailto.flatPrice')} : ${FLAT_JOURNEE} € HT`);
    } else if (isJourneeEtude) {
      const mealLabel = activeMealDef ? t(activeMealDef.labelKey) : '';
      lines.push(`${t('salle.seminaires.cfg.mailto.formula')} : ${t('salle.seminaires.cfg.mailto.pathStudyDay')} — ${mealLabel} (${mealPrice} € HT/pers.)`);
      lines.push(`${t('salle.seminaires.cfg.mailto.participants')} : ${participants}`);
      if (hasTeamBuilding) {
        lines.push(`${t('salle.seminaires.cfg.mailto.teamBuilding')} : +${PRICE_TB} € HT/pers.`);
        if (hasCoaching) lines.push(t('salle.seminaires.cfg.mailto.coaching'));
      }
    } else {
      if (hasSoireeMeal && activeMealDef) {
        lines.push(`${t('salle.seminaires.cfg.mailto.restauration')} : ${t(activeMealDef.labelKey)} (${mealPrice} € HT/pers.)`);
        lines.push(`${t('salle.seminaires.cfg.mailto.participants')} : ${participants}`);
      } else {
        lines.push(`${t('salle.seminaires.cfg.mailto.restauration')} : ${t('salle.seminaires.cfg.noMeal')}`);
      }
      if (extraHours > 0) {
        lines.push(`${t('salle.seminaires.cfg.mailto.extraHours')} : ${extraHours}h (+${extraHours * PRICE_EXTRA_HOUR} € HT)`);
      }
    }

    lines.push('', `${t('salle.seminaires.cfg.mailto.estimate')} : ${total} € HT`, '', t('salle.seminaires.cfg.mailto.closing'));

    const body = lines.join('\n');
    const base = quoteMailto.replace(/^mailto:/, '');
    let subject: string;
    if (isSalleSeche) {
      subject = `${t('salle.seminaires.cfg.mailto.subject')} — ${t('salle.seminaires.cfg.pathDryHire')}`;
    } else if (isJourneeEtude) {
      subject = `${t('salle.seminaires.cfg.mailto.subject')} — ${activeMealDef ? t(activeMealDef.labelKey) : ''} (${participants} pers.)`;
    } else {
      subject = `${t('salle.seminaires.cfg.mailto.subject')} — ${t('salle.seminaires.cfg.soiree')}`;
    }
    return `mailto:${base}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // ── Helpers ──────────────────────────────────────────────────────────
  const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES' };

  function clampParticipants(val: number) {
    participants = Math.max(minParticipants, Math.min(80, val));
  }

  function clampExtraHours(val: number) {
    extraHours = Math.max(0, Math.min(6, val));
  }

  function formatPrice(n: number) {
    return n.toLocaleString(localeMap[lang] ?? 'fr-FR') + '\u202f€';
  }
</script>

<!-- ───────────────────────────────────────────────────────────────────── -->

<div class="configurator-root w-full space-y-8">

  <!-- ═══ STEP 1: TIME SLOT ════════════════════════════════════════════ -->
  <div
    class="p-1.5 rounded-2xl"
    style="background-color: {accentLight}; border: 1.5px solid {accentBorder};"
  >
    <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('salle.seminaires.cfg.chooseSlot')}>
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
            <p class="font-heading font-bold text-sm leading-tight">{t(slot.labelKey)}</p>
            <p class="text-xs mt-0.5" style="opacity: {isActive ? 0.7 : 0.5};">{t(slot.hoursKey)}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- ═══ 2-COLUMN LAYOUT ═════════════════════════════════════════════ -->
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

    <!-- ── LEFT COLUMN ────────────────────────────────────────────── -->
    <div class="space-y-6">

      {#if isJournee}

        <!-- ═══ JOURNÉE: Fork — Salle sèche vs Journée d'étude ═══ -->
        <div
          class="flex flex-col sm:flex-row gap-3 items-stretch relative"
          role="radiogroup"
          aria-label={t('salle.seminaires.cfg.pathDryHire') + ' / ' + t('salle.seminaires.cfg.pathStudyDay')}
        >
          <!-- "OU" badge desktop -->
          <div
            class="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-sm items-center justify-center"
            style="border: 1.5px solid {accentBorder};"
          >
            <span class="text-[10px] font-heading font-bold uppercase tracking-wide text-gray-400">
              {t('salle.seminaires.cfg.orLabel')}
            </span>
          </div>

          <!-- Salle sèche card -->
          <button
            type="button"
            role="radio"
            aria-checked={isSalleSeche}
            onclick={() => (journeeMode = 'salle-seche')}
            class="path-card flex-1 text-left p-5 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
            style="
              border-color: {isSalleSeche ? accentColor : accentBorder};
              background-color: {isSalleSeche ? accentLight : 'white'};
              outline-color: {accentColor};
              box-shadow: {isSalleSeche ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
            "
          >
            <div class="flex items-center gap-3 sm:gap-4">
              <span
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style="border-color: {isSalleSeche ? accentColor : '#d1d5db'};"
              >
                {#if isSalleSeche}
                  <span class="w-2.5 h-2.5 rounded-full" style="background-color: {accentColor};"></span>
                {/if}
              </span>
              <span
                class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                style="background-color: {isSalleSeche ? accentMedium : accentLight}; color: {accentColor};"
              >
                <Building class="w-5 h-5" strokeWidth={1.5} />
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-heading font-bold text-sm text-gray-800 leading-tight">{t('salle.seminaires.cfg.pathDryHire')}</p>
                <p class="text-xs text-gray-400 mt-0.5">{t('salle.seminaires.cfg.pathDryHire.desc')}</p>
              </div>
              <div class="text-right flex-shrink-0 hidden xs:block">
                <p class="font-heading font-bold text-base" style="color: {isSalleSeche ? accentColor : '#9ca3af'};">
                  {FLAT_JOURNEE}&nbsp;€
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">{t('salle.seminaires.cfg.flatRate')}</p>
              </div>
            </div>
          </button>

          <!-- "OU" badge mobile -->
          <div class="sm:hidden flex items-center justify-center -my-0.5">
            <span
              class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center"
              style="border: 1.5px solid {accentBorder};"
            >
              <span class="text-[10px] font-heading font-bold uppercase tracking-wide text-gray-400">
                {t('salle.seminaires.cfg.orLabel')}
              </span>
            </span>
          </div>

          <!-- Journée d'étude card -->
          <button
            type="button"
            role="radio"
            aria-checked={isJourneeEtude}
            onclick={() => (journeeMode = 'journee-etude')}
            class="path-card flex-1 text-left p-5 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
            style="
              border-color: {isJourneeEtude ? accentColor : accentBorder};
              background-color: {isJourneeEtude ? accentLight : 'white'};
              outline-color: {accentColor};
              box-shadow: {isJourneeEtude ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
            "
          >
            <div class="flex items-center gap-3 sm:gap-4">
              <span
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style="border-color: {isJourneeEtude ? accentColor : '#d1d5db'};"
              >
                {#if isJourneeEtude}
                  <span class="w-2.5 h-2.5 rounded-full" style="background-color: {accentColor};"></span>
                {/if}
              </span>
              <span
                class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                style="background-color: {isJourneeEtude ? accentMedium : accentLight}; color: {accentColor};"
              >
                <UtensilsCrossed class="w-5 h-5" strokeWidth={1.5} />
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-heading font-bold text-sm text-gray-800 leading-tight">{t('salle.seminaires.cfg.pathStudyDay')}</p>
                <p class="text-xs text-gray-400 mt-0.5">{t('salle.seminaires.cfg.pathStudyDay.desc')}</p>
              </div>
              <div class="text-right flex-shrink-0 hidden xs:block">
                <p class="font-heading font-bold text-base" style="color: {isJourneeEtude ? accentColor : '#9ca3af'};">
                  {t('salle.seminaires.cfg.from')} 35&nbsp;€
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">{t('salle.seminaires.cfg.perPers')}</p>
              </div>
            </div>
          </button>
        </div>

        <!-- ═══ JOURNÉE D'ÉTUDE: Composition ═════════════════════ -->
        {#if isJourneeEtude}

          <!-- Participants (first in journée d'étude) -->
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
                <p class="text-sm font-semibold text-gray-800">{t('salle.seminaires.cfg.participants')}</p>
                <p class="text-xs text-gray-400">{t('salle.seminaires.cfg.participantsRange').replace('{min}', String(minParticipants))}</p>
              </div>
            </div>

            <div class="flex items-center gap-0">
              <button
                type="button"
                onclick={() => clampParticipants(participants - 1)}
                class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
                style="border-color: {accentBorder}; color: {accentColor};"
                aria-label="-1"
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
                aria-label={t('salle.seminaires.cfg.participants')}
              />
              <button
                type="button"
                onclick={() => clampParticipants(participants + 1)}
                class="stepper-btn w-10 h-10 rounded-r-xl flex items-center justify-center border border-l-0 transition-colors"
                style="border-color: {accentBorder}; color: {accentColor};"
                aria-label="+1"
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
                aria-label={t('salle.seminaires.cfg.participants')}
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>{minParticipants}</span>
                <span>80</span>
              </div>
            </div>
          </div>

          <!-- Two stacked selectors: Repas + Activité -->
          <div class="space-y-6">

            <!-- Repas selector -->
            <div class="space-y-2">
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider" style="color: {accentColor}; opacity: 0.6;">
                {t('salle.seminaires.cfg.mealFormat')}
              </h4>
              <div
                class="p-1.5 rounded-2xl"
                style="background-color: {accentLight}; border: 1.5px solid {accentBorder};"
              >
                <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('salle.seminaires.cfg.mealFormat')}>
                  <!-- Repas complet -->
                  <button
                    type="button"
                    role="radio"
                    aria-checked={journeeMeal === 'repas-complet'}
                    onclick={() => (journeeMeal = 'repas-complet')}
                    class="slot-toggle relative flex items-center gap-2.5 px-4 py-3.5 rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl"
                    style="
                      background-color: {journeeMeal === 'repas-complet' ? accentColor : 'transparent'};
                      color: {journeeMeal === 'repas-complet' ? 'white' : '#6b7280'};
                      outline-color: {accentColor};
                      box-shadow: {journeeMeal === 'repas-complet' ? '0 4px 15px ' + accentColor + '40' : 'none'};
                    "
                  >
                    <UtensilsCrossed class="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <div class="text-left min-w-0">
                      <p class="font-heading font-bold text-xs leading-tight truncate">{t('salle.seminaires.cfg.mealFull')}</p>
                      <p class="text-[11px] mt-0.5" style="opacity: {journeeMeal === 'repas-complet' ? 0.7 : 0.5};">{PRICE_MEAL_FULL}&nbsp;€ {t('salle.seminaires.cfg.perPers')}</p>
                    </div>
                  </button>

                  <!-- Apéro dînatoire -->
                  <button
                    type="button"
                    role="radio"
                    aria-checked={journeeMeal === 'apero'}
                    onclick={() => (journeeMeal = 'apero')}
                    class="slot-toggle relative flex items-center gap-2.5 px-4 py-3.5 rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl"
                    style="
                      background-color: {journeeMeal === 'apero' ? accentColor : 'transparent'};
                      color: {journeeMeal === 'apero' ? 'white' : '#6b7280'};
                      outline-color: {accentColor};
                      box-shadow: {journeeMeal === 'apero' ? '0 4px 15px ' + accentColor + '40' : 'none'};
                    "
                  >
                    <Wine class="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <div class="text-left min-w-0">
                      <p class="font-heading font-bold text-xs leading-tight truncate">{t('salle.seminaires.cfg.mealAperitif')}</p>
                      <p class="text-[11px] mt-0.5" style="opacity: {journeeMeal === 'apero' ? 0.7 : 0.5};">{PRICE_MEAL_APERO}&nbsp;€ {t('salle.seminaires.cfg.perPers')}</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Activité selector -->
            <div class="space-y-2">
              <h4 class="font-heading font-bold text-xs uppercase tracking-wider" style="color: {accentColor}; opacity: 0.6;">
                {t('salle.seminaires.cfg.activityChoice')}
              </h4>
              <div
                class="p-1.5 rounded-2xl"
                style="background-color: {accentLight}; border: 1.5px solid {accentBorder};"
              >
                <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('salle.seminaires.cfg.activityChoice')}>
                  <!-- En salle -->
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!hasTeamBuilding}
                    onclick={() => (hasTeamBuilding = false)}
                    class="slot-toggle relative flex items-center gap-2.5 px-4 py-3.5 rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl"
                    style="
                      background-color: {!hasTeamBuilding ? accentColor : 'transparent'};
                      color: {!hasTeamBuilding ? 'white' : '#6b7280'};
                      outline-color: {accentColor};
                      box-shadow: {!hasTeamBuilding ? '0 4px 15px ' + accentColor + '40' : 'none'};
                    "
                  >
                    <Building class="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <div class="text-left min-w-0">
                      <p class="font-heading font-bold text-xs leading-tight truncate">{t('salle.seminaires.cfg.noActivity')}</p>
                      <p class="text-[11px] mt-0.5" style="opacity: {!hasTeamBuilding ? 0.7 : 0.5};">{t('salle.seminaires.cfg.noActivity.sub')}</p>
                    </div>
                  </button>

                  <!-- Team Building -->
                  <button
                    type="button"
                    role="radio"
                    aria-checked={hasTeamBuilding}
                    onclick={() => (hasTeamBuilding = true)}
                    class="slot-toggle relative flex items-center gap-2.5 px-4 py-3.5 rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-xl"
                    style="
                      background-color: {hasTeamBuilding ? accentColor : 'transparent'};
                      color: {hasTeamBuilding ? 'white' : '#6b7280'};
                      outline-color: {accentColor};
                      box-shadow: {hasTeamBuilding ? '0 4px 15px ' + accentColor + '40' : 'none'};
                    "
                  >
                    <Trees class="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <div class="text-left min-w-0">
                      <p class="font-heading font-bold text-xs leading-tight truncate">{t('salle.seminaires.cfg.withTB')}</p>
                      <p class="text-[11px] mt-0.5" style="opacity: {hasTeamBuilding ? 0.7 : 0.5};">{t('salle.seminaires.cfg.withTB.sub')} · +{PRICE_TB}&nbsp;€ {t('salle.seminaires.cfg.perPers')}</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Coaching option (only when TB is selected) -->
          {#if hasTeamBuilding}
            <h4 class="font-heading font-bold text-xs uppercase tracking-wider" style="color: {accentColor}; opacity: 0.6;">
              {t('salle.seminaires.cfg.optionsShort')}
            </h4>
            <button
              type="button"
              onclick={() => (hasCoaching = !hasCoaching)}
              class="option-card w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
              style="
                border-color: {hasCoaching ? accentColor : accentBorder};
                background-color: {hasCoaching ? accentLight : 'white'};
                outline-color: {accentColor};
                box-shadow: {hasCoaching ? `0 0 0 1px ${accentColor}25, 0 4px 20px ${accentColor}15` : '0 1px 3px rgba(0,0,0,0.04)'};
              "
              aria-pressed={hasCoaching}
            >
              <div class="flex items-start gap-3">
                <span
                  class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style="background-color: {hasCoaching ? accentMedium : accentLight}; color: {accentColor};"
                >
                  <Sparkles class="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} />
                </span>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-gray-800 leading-tight">{t('salle.seminaires.cfg.coachingOption')}</p>
                  <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">{t('salle.seminaires.cfg.coachingOption.desc')}</p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span class="text-xs text-gray-400 italic">{t('salle.seminaires.cfg.onQuote')}</span>
                  <span
                    class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    style="background-color: {hasCoaching ? accentColor : accentLight}; color: {hasCoaching ? 'white' : accentColor};"
                  >
                    {#if hasCoaching}
                      <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                    {:else}
                      <Plus class="w-3.5 h-3.5" strokeWidth={2} />
                    {/if}
                  </span>
                </div>
              </div>
            </button>
          {/if}

        {/if}

      {:else}

        <!-- ═══ SOIRÉE: Meal selection (3 cards) ═══════════════════ -->
        <h3 class="font-heading font-bold text-sm uppercase tracking-wider" style="color: {accentColor}; opacity: 0.7;">
          {t('salle.seminaires.cfg.chooseMeal')}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label={t('salle.seminaires.cfg.chooseMeal')}>
          {#each SOIREE_MEALS as opt (opt.id)}
            {@const isSelected = soireeMeal === opt.id}
            {@const isNone = opt.id === 'none'}
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onclick={() => (soireeMeal = opt.id)}
              class="meal-card relative flex flex-col items-center text-center p-5 pt-6 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-2xl"
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
                <svelte:component this={opt.icon} class="w-5 h-5" strokeWidth={1.5} />
              </span>

              <p class="font-heading font-bold text-sm text-gray-800 leading-tight mb-1">{t(opt.labelKey)}</p>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">{t(opt.descKey)}</p>

              <div class="mb-3">
                {#if isNone}
                  <span class="font-heading font-bold text-2xl" style="color: {accentColor};">{FLAT_SOIREE}&nbsp;€</span>
                  <span class="block text-xs text-gray-400 mt-0.5">{t('salle.seminaires.cfg.flatSoiree')}</span>
                {:else}
                  <span class="font-heading font-bold text-2xl" style="color: {accentColor};">{opt.pricePerPerson}&nbsp;€</span>
                  <span class="block text-xs text-gray-400 mt-0.5">{t('salle.seminaires.cfg.perPers')}</span>
                {/if}
              </div>

              {#if !isNone && opt.min}
                <p class="text-[10px] text-gray-400 mb-3">
                  {t('salle.seminaires.cfg.minPersons').replace('{n}', String(opt.min))}
                </p>
              {/if}

              <div class="mt-auto w-full">
                {#if isSelected}
                  <span
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white w-full justify-center"
                    style="background-color: {accentColor};"
                  >
                    <Check class="w-3.5 h-3.5" strokeWidth={2.5} />
                    {t('salle.seminaires.cfg.selected')}
                  </span>
                {:else}
                  <span
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium w-full justify-center border transition-colors"
                    style="border-color: {accentBorder}; color: {accentColor};"
                  >
                    {t('salle.seminaires.cfg.choose')}
                  </span>
                {/if}
              </div>
            </button>
          {/each}
        </div>

        <!-- Participants (soirée with meal) -->
        {#if hasSoireeMeal}
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
                <p class="text-sm font-semibold text-gray-800">{t('salle.seminaires.cfg.participants')}</p>
                <p class="text-xs text-gray-400">{t('salle.seminaires.cfg.participantsRange').replace('{min}', String(minParticipants))}</p>
              </div>
            </div>

            <div class="flex items-center gap-0">
              <button
                type="button"
                onclick={() => clampParticipants(participants - 1)}
                class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
                style="border-color: {accentBorder}; color: {accentColor};"
                aria-label="-1"
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
                aria-label={t('salle.seminaires.cfg.participants')}
              />
              <button
                type="button"
                onclick={() => clampParticipants(participants + 1)}
                class="stepper-btn w-10 h-10 rounded-r-xl flex items-center justify-center border border-l-0 transition-colors"
                style="border-color: {accentBorder}; color: {accentColor};"
                aria-label="+1"
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
                aria-label={t('salle.seminaires.cfg.participants')}
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>{minParticipants}</span>
                <span>80</span>
              </div>
            </div>
          </div>
        {/if}

        <!-- Extra hours -->
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
              <p class="text-sm font-semibold text-gray-800">{t('salle.seminaires.cfg.extraHours')}</p>
              <p class="text-xs text-gray-400">{t('salle.seminaires.cfg.extraHours.desc')}</p>
            </div>
          </div>

          <div class="flex items-center gap-0">
            <button
              type="button"
              onclick={() => clampExtraHours(extraHours - 1)}
              class="stepper-btn w-10 h-10 rounded-l-xl flex items-center justify-center border border-r-0 transition-colors"
              style="border-color: {accentBorder}; color: {accentColor};"
              aria-label="-1h"
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
              aria-label="+1h"
              disabled={extraHours >= 6}
            >
              <Plus class="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {#if extraHours > 0}
            <p class="text-xs text-gray-400">
              {t('salle.seminaires.cfg.endAt')} <strong class="text-gray-600">{(23 + extraHours) % 24}h</strong> · +{formatPrice(extraHours * PRICE_EXTRA_HOUR)} HT
            </p>
          {:else}
            <p class="text-xs text-gray-400">{t('salle.seminaires.cfg.includedHours')}</p>
          {/if}
        </div>

      {/if}

    </div>

    <!-- ── RIGHT COLUMN: Sticky Summary ───────────────────────────── -->
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
          <p class="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">{t('salle.seminaires.cfg.estimate')}</p>
          <div class="flex items-baseline gap-2">
            <span class="font-heading font-bold text-3xl text-white tabular-nums" aria-live="polite">
              {displayedTotal.toLocaleString(localeMap[lang] ?? 'fr-FR')}
            </span>
            <span class="text-white/70 text-lg font-medium">&nbsp;€ <span class="text-sm">HT</span></span>
          </div>
          {#if needsParticipants}
            <p class="text-white/50 text-xs mt-1">{t('salle.seminaires.cfg.forParticipants').replace('{n}', String(participants))}</p>
          {/if}
        </div>

        <!-- Summary body -->
        <div class="bg-white px-6 py-5 space-y-3">

          {#if isSalleSeche}
            <!-- Flat journée -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-2">
                <Sun class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                {t('salle.seminaires.cfg.pathDryHire')} — {t('salle.seminaires.cfg.journee').toLowerCase()}
                <span class="text-gray-400 text-xs">({t('salle.seminaires.cfg.journeeHours')})</span>
              </span>
              <span class="font-semibold text-gray-800 tabular-nums">{FLAT_JOURNEE}&nbsp;€</span>
            </div>

          {:else if isSoiree && !hasSoireeMeal}
            <!-- Flat soirée -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-2">
                <Moon class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                {t('salle.seminaires.cfg.noMeal')} — {t('salle.seminaires.cfg.soiree').toLowerCase()}
                <span class="text-gray-400 text-xs">({t('salle.seminaires.cfg.soireeHours')})</span>
              </span>
              <span class="font-semibold text-gray-800 tabular-nums">{FLAT_SOIREE}&nbsp;€</span>
            </div>

          {:else}
            <!-- Per-person breakdown -->

            <!-- Soirée base rate -->
            {#if isSoiree}
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 flex items-center gap-2">
                  <Moon class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {t('salle.seminaires.cfg.roomLabel')} — {t('salle.seminaires.cfg.soiree').toLowerCase()}
                  <span class="text-gray-400 text-xs">({t('salle.seminaires.cfg.soireeHours')})</span>
                </span>
                <span class="font-semibold text-gray-800 tabular-nums">{FLAT_SOIREE}&nbsp;€</span>
              </div>
            {/if}

            <!-- Meal line -->
            {#if activeMealDef}
              <div
                class="flex items-center justify-between text-sm"
                style={isSoiree ? `padding-top: 0.25rem; border-top: 1px solid ${accentBorder}` : ''}
              >
                <span class="text-gray-600 flex items-center gap-2 min-w-0">
                  <svelte:component this={activeMealDef.icon} class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  <span class="truncate">{t(activeMealDef.labelKey)}</span>
                  <span class="text-gray-400 flex-shrink-0">× {participants}</span>
                </span>
                <span class="font-medium text-gray-700 flex-shrink-0 ml-2 tabular-nums">
                  {formatPrice(mealPrice * participants)}
                </span>
              </div>
            {/if}

            <!-- TB line -->
            {#if hasTeamBuilding}
              <div class="pt-1 option-row-enter" style="border-top: 1px solid {accentBorder};">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 flex items-center gap-2">
                    <Trees class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                    {t('salle.seminaires.cfg.tbLine')}
                    <span class="text-gray-400">× {participants}</span>
                  </span>
                  <span class="font-medium text-gray-700 tabular-nums">{formatPrice(PRICE_TB * participants)}</span>
                </div>
              </div>
            {/if}

            <!-- Coaching line -->
            {#if hasCoaching}
              <div class="flex items-center justify-between text-sm option-row-enter">
                <span class="text-gray-500 flex items-center gap-2">
                  <Sparkles class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {t('salle.seminaires.cfg.coachingLine')}
                </span>
                <span class="text-xs text-gray-400 italic">{t('salle.seminaires.cfg.onQuote')}</span>
              </div>
            {/if}

            <!-- Includes (journée d'étude) -->
            {#if isJourneeEtude && activeMealDef?.includeKeys}
              <div class="pt-2" style="border-top: 1px solid {accentBorder};">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{t('salle.seminaires.cfg.included')}</p>
                {#each activeMealDef.includeKeys as key}
                  <p class="flex items-center gap-1.5 text-xs text-gray-500 leading-relaxed">
                    <Check class="w-3 h-3 flex-shrink-0" style="color: {accentColor};" strokeWidth={2.5} />
                    {t(key)}
                  </p>
                {/each}
              </div>
            {/if}
          {/if}

          <!-- Extra hours (soirée) -->
          {#if isSoiree && extraHours > 0}
            <div class="pt-1 option-row-enter" style="border-top: 1px solid {accentBorder};">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5 flex-shrink-0" style="color: {accentColor};" strokeWidth={1.5} />
                  {extraHours}{t('salle.seminaires.cfg.extraHoursLine')}
                </span>
                <span class="font-medium text-gray-700 tabular-nums">{formatPrice(extraHours * PRICE_EXTRA_HOUR)}</span>
              </div>
            </div>
          {/if}

          <!-- Total -->
          <div class="pt-3 mt-1" style="border-top: 2px solid {accentBorder};">
            <div class="flex items-center justify-between">
              <span class="font-heading font-bold text-sm text-gray-800">{t('salle.seminaires.cfg.totalHT')}</span>
              <span class="font-heading font-bold text-xl tabular-nums" style="color: {accentColor};">
                {formatPrice(total)}
              </span>
            </div>
            {#if isJourneeEtude && perPersonPrice > 0}
              <p class="text-xs text-gray-400 mt-1">
                {t('salle.seminaires.cfg.perPerson').replace('{price}', formatPrice(perPersonPrice))}
              </p>
            {/if}
          </div>

          <!-- Disclaimer -->
          <div
            class="mt-2 rounded-xl px-4 py-3 text-xs text-center leading-relaxed"
            style="background-color: {accentLight}; color: {accentColor};"
          >
            {t('salle.seminaires.cfg.disclaimer')}
          </div>

          <!-- CTA -->
          <a
            href={mailtoHref}
            class="cta-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-heading font-bold text-sm text-white transition-all duration-200 hover:shadow-md hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded-full mt-2"
            style="background: linear-gradient(135deg, {accentColor} 0%, var(--color-brun-terre) 100%); outline-color: {accentColor};"
          >
            <span class="cta-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);"></span>
            {t('salle.seminaires.cfg.ctaLabel')}
            <ArrowRight class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </a>

          <!-- Reassurance -->
          <div class="flex items-center justify-center gap-4 pt-1">
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Check class="w-3 h-3" style="color: {accentColor};" strokeWidth={2.5} />
              {t('salle.seminaires.cfg.response24h')}
            </span>
            <span class="flex items-center gap-1 text-xs text-gray-400">
              <Check class="w-3 h-3" style="color: {accentColor};" strokeWidth={2.5} />
              {t('salle.seminaires.cfg.freeQuote')}
            </span>
          </div>
        </div>
      </div>

      <p class="lg:hidden text-xs text-center text-gray-400 mt-3">
        {t('salle.seminaires.cfg.mobileHint')}
      </p>
    </div>

  </div>
</div>

<!-- ─────────────────────────────────────────────────────────────────────── -->
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

  .path-card:not([aria-checked='true']):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  }
  .path-card[aria-checked='true'] {
    transform: translateY(-1px);
  }

  .meal-card:not([aria-checked='true']):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  }
  .meal-card[aria-checked='true'] {
    transform: translateY(-2px);
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

  .option-card:not([aria-pressed='true']):hover {
    transform: translateY(-1px);
  }
  .option-card[aria-pressed='true'] {
    transform: translateY(-1px);
  }

  @media (prefers-reduced-motion: reduce) {
    .path-card,
    .meal-card,
    .slot-toggle,
    .option-card,
    .option-row-enter,
    .cta-shimmer {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
