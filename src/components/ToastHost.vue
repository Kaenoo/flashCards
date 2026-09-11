<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white px-5 py-3.5 shadow-lg transition dark:bg-neutral-800"
          :class="typeClasses[t.type]"
          role="status">
          <span class="mt-1 size-2 shrink-0 rounded-full" :class="dotClasses[t.type]"></span>
          <p class="flex-1 break-words text-sm font-medium" :class="textClasses[t.type]">{{ t.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts } = useToast()

const typeClasses = {
  success: 'border-emerald-200 dark:border-emerald-800',
  error: 'border-red-200 dark:border-red-800',
  info: 'border-neutral-200 dark:border-neutral-700'
}

const dotClasses = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-amber-400'
}

const textClasses = {
  success: 'text-emerald-700 dark:text-emerald-300',
  error: 'text-red-700 dark:text-red-300',
  info: 'text-neutral-700 dark:text-neutral-200'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>