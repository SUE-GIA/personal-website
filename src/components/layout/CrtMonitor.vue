<script setup>
</script>

<template>
  <div class="crt-shell">
    <div class="crt-scanlines" />
    <div class="crt-rolling-line" />
    <div class="crt-vignette" />
    <div class="crt-glare" />
    <div class="crt-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.crt-shell {
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg-screen);
  padding: 2em;
}

.crt-shell::before {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background:
      linear-gradient(
          rgba(18, 16, 16, 0) 50%,
          rgba(0, 0, 0, 0.2) 50%
      ),
      linear-gradient(
          90deg,
          rgba(255, 0, 0, 0.03),
          rgba(0, 255, 0, 0.01),
          rgba(0, 0, 255, 0.03)
      );
  background-size: 100% 4px, 3px 100%;
  z-index: 2;
  pointer-events: none;
}

.crt-scanlines {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.18) 3px,
      rgba(0, 0, 0, 0.18) 4px
  );
  pointer-events: none;
  z-index: 100;
}

.crt-rolling-line {
  position: absolute;
  width: 100%;
  height: 100px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(255, 255, 255, 0.06) 10%,
      rgba(0, 0, 0, 0.05) 100%
  );
  opacity: 0.12;
  bottom: 100%;
  z-index: 8;
  pointer-events: none;
  animation: rolling-line 10s linear infinite;
}

.crt-vignette {
  position: fixed;
  inset: 0;
  background: radial-gradient(
      ellipse 100% 85% at 50% 50%,
      transparent 60%,
      rgba(0, 0, 0, 0.12) 72%,
      rgba(0, 0, 0, 0.38) 84%,
      rgba(0, 0, 0, 0.72) 100%
  );
  pointer-events: none;
  z-index: 101;
}

.crt-glare {
  position: fixed;
  top: 0;
  left: 0;
  width: 60%;
  height: 50%;
  background: radial-gradient(
      ellipse at 15% 15%,
      rgba(255, 220, 140, 0.025) 0%,
      transparent 60%
  );
  pointer-events: none;
  z-index: 102;
}

.crt-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
  animation: flicker 10s infinite;
}

@keyframes rolling-line {
  0%   { bottom: 100%; }
  80%  { bottom: 100%; }
  100% { bottom: -20%; }
}

@keyframes flicker {
  0%   { opacity: 1; }
  92%  { opacity: 1; }
  93%  { opacity: 0.94; }
  95%  { opacity: 1; }
  97%  { opacity: 0.96; }
  100% { opacity: 1; }
}
</style>