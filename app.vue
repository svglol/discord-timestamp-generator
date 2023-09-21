<template>
  <UContainer class="md:max-w-3xl py-5 gap-2 flex flex-col">
    <h1
      class="text-2xl font-bold py-2 text-center text-green-500 dark:text-green-400">
      Discord Timestamp Generator
    </h1>
    <UFormGroup label="Date Time" name="datetime">
      <UInput v-model="dateTime" type="datetime-local" />
    </UFormGroup>
    <UFormGroup label="Timezone" name="timezone">
      <USelectMenu v-model="timezone" :options="timezones" />
    </UFormGroup>
    <UFormGroup label="Format" name="format">
      <USelect v-model="format" :options="formats" option-attribute="name" />
    </UFormGroup>
    <UFormGroup label="Preview" name="preview">
      <UAlert :title="preview" />
    </UFormGroup>
    <UFormGroup label="Discord Timestamp" name="discord">
      <div class="flex flex-row w-full">
        <UInput
          v-model="output"
          class="w-full"
          input-class="rounded-r-none"
          :ui="{
            icon: { trailing: { pointer: '' } },
          }"
          disabled></UInput>
        <UButton
          color="green"
          variant="solid"
          class="rounded-l-none"
          :icon="
            copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'
          "
          :disabled="copied"
          @click="toast.add({ title: 'Copied to clipboard!' }), copy(output)" />
      </div>
    </UFormGroup>
    <UNotifications />
  </UContainer>
</template>

<script setup lang="ts">
import moment from 'moment-timezone'
const toast = useToast()
useHead({
  title: 'Discord Timestamp Generator',
})
const dateTime = ref('')
const timezone = ref('')
const timezones = ref([''])
const format = ref('')
const formats = ref([
  { name: 'Default', value: '' },
  { name: 'Short Time', value: ':t' },
  { name: 'Long Time', value: ':T' },
  { name: 'Short Date', value: ':d' },
  { name: 'Long Date', value: ':D' },
  { name: 'Short Date/Time', value: ':f' },
  { name: 'Long Date/Time', value: ':F' },
  { name: 'Relative Time', value: ':R' },
])
const output = ref('')
const preview = ref('')
const { copy, copied } = useClipboard({ source: output })

watchEffect(() => {
  if (dateTime.value !== '') {
    const date = moment.tz(dateTime.value, timezone.value)
    output.value = `<t:${date.unix()}${format.value}>`
    const local = date
      .clone()
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    switch (format.value) {
      case '':
        preview.value = local.format('MMMM D, YYYY h:mm a')
        break
      case ':t':
        preview.value = local.format('h:mm a')
        break
      case ':T':
        preview.value = local.format('h:mm:ss a')
        break
      case ':d':
        preview.value = local.format('M/D/YYYY')
        break
      case ':D':
        preview.value = local.format('MMMM D, YYYY')
        break
      case ':f':
        preview.value = local.format('MMMM D, YYYY h:mm a')
        break
      case ':F':
        preview.value = local.format('dddd, MMMM D, YYYY h:mm a')
        break
      case ':R':
        preview.value = local.fromNow()
        break
    }
  }
})

onMounted(() => {
  timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  dateTime.value = convertTimetoLocal(new Date())
  timezones.value = Intl.supportedValuesOf('timeZone')
})

function convertTimetoLocal(value: Date | null) {
  if (value === null) return ''
  const off = value.getTimezoneOffset() * -1
  const del = value.getMilliseconds() ? 'Z' : '.' // have milliseconds ?
  value = new Date(value.getTime() + off * 60000) // add or subtract time zone
  return (
    value.toISOString().split(del)[0] +
    (off < 0 ? '-' : '+') +
    ('0' + Math.abs(Math.floor(off / 60))).substr(-2) +
    ':' +
    ('0' + Math.abs(off % 60)).substr(-2)
  ).slice(0, 16)
}
</script>
