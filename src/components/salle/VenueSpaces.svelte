<script lang="ts">
  import { ChevronDown, LayoutGrid, Bath, UtensilsCrossed } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  interface SpaceCard {
    icon: 'room' | 'sanitary' | 'catering';
    title: string;
    desc: string;
    details: string[];
  }

  interface Props {
    cards: SpaceCard[];
    detailsLabel: string;
    hideLabel: string;
    accent: string;
    light: string;
  }

  let { cards, detailsLabel, hideLabel, accent, light }: Props = $props();

  let openIndex = $state<number | null>(null);

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
  {#each cards as card, i}
    <div class="rounded-2xl border border-gray-200/60 bg-white overflow-hidden">
      <!-- Header with icon -->
      <div class="p-6 pb-0">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style="background-color: {light};"
        >
          {#if card.icon === 'room'}
            <LayoutGrid class="w-6 h-6" style="color: {accent};" />
          {:else if card.icon === 'sanitary'}
            <Bath class="w-6 h-6" style="color: {accent};" />
          {:else}
            <UtensilsCrossed class="w-6 h-6" style="color: {accent};" />
          {/if}
        </div>
        <h3 class="font-heading text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
        <p class="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
      </div>

      <!-- Details toggle -->
      {#if card.details.length > 0}
        <div class="px-6 pb-6 pt-4">
          <button
            onclick={() => toggle(i)}
            class="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer"
            style="color: {accent};"
          >
            {openIndex === i ? hideLabel : detailsLabel}
            <ChevronDown
              class="w-4 h-4 transition-transform duration-200"
              style="transform: rotate({openIndex === i ? 180 : 0}deg);"
            />
          </button>

          {#if openIndex === i}
            <ul
              class="mt-3 space-y-2"
              transition:slide={{ duration: 250 }}
            >
              {#each card.details as detail}
                <li class="flex items-start gap-2 text-sm text-gray-600">
                  <span
                    class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style="background-color: {accent};"
                  ></span>
                  {detail}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>
