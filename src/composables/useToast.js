import { ref } from 'vue'

const toasts = ref([])

let nextId = 0

export const useToast = () => {
  const toast = (message, type = 'info', duration = 3500) => {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return { toasts, toast }
}