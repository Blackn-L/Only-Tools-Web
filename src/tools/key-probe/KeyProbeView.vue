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
