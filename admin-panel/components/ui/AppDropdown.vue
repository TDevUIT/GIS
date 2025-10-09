<template>
  <div class="relative" ref="dropdownRef">
    <button @click="isOpen = !isOpen" class="flex items-center gap-2 rounded-md border border-gray-600 bg-gray-700/50 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700">
      <span>{{ selectedLabel }}</span>
      <ChevronDownIcon class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
        <div class="py-1">
          <a
            v-for="option in options"
            :key="option.value"
            href="#"
            @click.prevent="selectOption(option)"
            class="block px-4 py-2 text-sm"
            :class="option.value === modelValue ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
          >
            {{ option.label }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import { onClickOutside } from '@vueuse/core';

interface DropdownOption {
  label: string;
  value: string;
}

const props = defineProps<{
  options: DropdownOption[];
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const dropdownRef = ref(null);
const isOpen = ref(false);

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected?.label || props.placeholder || 'Select an option';
});

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option.value);
  isOpen.value = false;
};
</script>
