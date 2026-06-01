<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ShieldCheck } from '@lucide/vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AddKeyForm from './components/AddKeyForm.vue'
import ControlBar from './components/ControlBar.vue'
import StatsBar from './components/StatsBar.vue'
import FilterBar from './components/FilterBar.vue'
import KeyTable from './components/KeyTable.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="border-b pb-6">
      <p class="mb-3 text-xs font-semibold uppercase text-primary">{{ t('keyTester.eyebrow') }}</p>
      <h1 class="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
        {{ t('keyTester.title') }}
      </h1>
      <p class="mt-3 max-w-3xl text-muted-foreground">
        {{ t('keyTester.description') }}
      </p>
    </header>

    <Alert>
      <ShieldCheck />
      <AlertDescription>{{ t('keyTester.privacy') }}</AlertDescription>
    </Alert>

    <section class="rounded-md border bg-card p-4 sm:p-6">
      <div class="flex flex-col gap-5">
        <AddKeyForm />
        <ControlBar />
        <StatsBar />
        <FilterBar />
        <KeyTable />
      </div>
    </section>
  </div>
</template>
