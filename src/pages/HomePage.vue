<script setup>
</script>

<template>
  <main class="h-full flex items-center justify-center">
    <div class="p-5 w-full max-w-xl">
      <p class="text-base text-[var(--text-dim)]">S.Giannakos — PERSONAL TERMINAL v2.1.4</p>
      <p class="text-base text-[var(--text-dim)]">────────────────────────────────────────────</p>

      <div class="mt-6 flex gap-2">
        <span class="text-lg text-[var(--text-prompt)]">$</span>
        <span class="text-lg text-[var(--text-accent)]">whoami</span>
      </div>
      <p class="ml-5 text-base text-[var(--text-secondary)]">&gt; S.Giannakos — Software Engineer</p>
      <p class="ml-5 text-sm text-[var(--text-dim)]">Backend Systems / Laravel / Architecture</p>

      <div class="mt-6 flex gap-2">
        <span class="text-lg text-[var(--text-prompt)]">$</span>
        <span class="text-lg text-[var(--text-accent)]">ls ./skills</span>
      </div>
      <p class="ml-5 text-base text-[var(--text-secondary)]">laravel/  architecture/  system-design/  api/</p>

      <div class="mt-6 flex gap-2">
        <span class="text-lg text-[var(--text-prompt)]">$</span>
        <span class="text-lg text-[var(--text-accent)]">rm -rf *</span>
      </div>
    </div>
  </main>
</template>