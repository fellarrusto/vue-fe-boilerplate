<script setup>
/**
 * Dialog create/edit di riferimento.
 * Riceve l'elemento via prop, non tocca i service: emette `save` e basta.
 */
import { ref, watch } from 'vue'
import { ITEM_CATEGORIES, ITEM_STATUSES } from '@/services/mock/itemsMock'

const props = defineProps({
  visible: { type: Boolean, default: false },
  item: { type: Object, default: null },
})

const emit = defineEmits(['update:visible', 'save'])

const emptyForm = () => ({ name: '', category: null, price: 0, status: 'draft' })

const form = ref(emptyForm())
const submitted = ref(false)

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      form.value = props.item ? { ...props.item } : emptyForm()
      submitted.value = false
    }
  }
)

function close() {
  emit('update:visible', false)
}

function submit() {
  submitted.value = true
  if (!form.value.name?.trim() || !form.value.category) return
  emit('save', { ...form.value })
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="form.id ? 'Modifica elemento' : 'Nuovo elemento'"
    modal
    :style="{ width: '32rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="name">Nome</label>
        <InputText id="name" v-model.trim="form.name" :invalid="submitted && !form.name" autofocus />
        <small v-if="submitted && !form.name" class="text-red-500">Il nome e' obbligatorio.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="category">Categoria</label>
        <Select
          id="category"
          v-model="form.category"
          :options="ITEM_CATEGORIES"
          placeholder="Seleziona"
          :invalid="submitted && !form.category"
        />
        <small v-if="submitted && !form.category" class="text-red-500">La categoria e' obbligatoria.</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="price">Prezzo</label>
        <InputNumber id="price" v-model="form.price" mode="currency" currency="EUR" locale="it-IT" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="status">Stato</label>
        <Select id="status" v-model="form.status" :options="ITEM_STATUSES" />
      </div>
    </div>

    <template #footer>
      <Button label="Annulla" text @click="close" />
      <Button label="Salva" icon="pi pi-check" @click="submit" />
    </template>
  </Dialog>
</template>
