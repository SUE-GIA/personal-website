<script setup>
import { STATUS, TIMELINE } from '../../data/siteInfo.js'
</script>

<template>
  <div class="grid grid-rows-[subgrid] row-span-3 border-l border-[var(--border-subtle)] gap-y-10 text-base" style="padding-left: 8px">

    <div>
      <p class="text-lg text-[var(--text-accent)]">> status</p>
      <p class="text-[var(--text-dim)] my-5">───────────────────</p>
      <p class="text-[var(--text-secondary)] leading-relaxed">{{ STATUS }}</p>
    </div>

    <div>
      <p class="text-[var(--text-dim)]">───────────────────</p>
      <p class="text-lg text-[var(--text-accent)] my-5">> timeline</p>
      <div class="space-y-3">
        <div v-for="item in TIMELINE" :key="item.year">
          <span class="text-[var(--text-accent)]">{{ item.year }}</span>
          <span class="text-[var(--text-dim)]">  ·  </span>
          <span class="text-[var(--text-secondary)]">{{ item.event }}</span>
        </div>
      </div>
    </div>

    <div></div>

  </div>
</template>
