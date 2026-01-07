<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { setAttr } from '@directus/visual-editing'
    
const directus = useDirectus();

const props = defineProps<{
    id: string;
    headline?: string;
    tagline?: string;
    form: FormElement;
}>()

const directusToNuxtUI = (field: FormField) => {
    switch (field.type) {
        case 'text':
            return "input";
    }
}

const state = reactive({
  items: props.form.fields,
})

const formValues = reactive<{ [key: string]: any }>({})

const onSubmit = async(event: Event) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    // Build values array for Directus
    const values = props.form.fields.map(field => ({
        field: field.id, // Directus field UUID
        value: formValues[field.name] ?? ''
        // Add file handling if needed
    })) as FormFieldValue[]

    await directus.request(createItem('form_submissions', {
        form: props.form.id,
        values
    }))

    onSuccess()
}

const successMessage = ref('');

const onSuccess = () => {
    // Reset form values
    for (const key in formValues) {
        formValues[key] = ''
    }

    if(props.form.on_success === "message") {
        successMessage.value = props.form.success_message || 'Form submitted successfully!'
    } else if(props.form.on_success === "redirect" && props.form.success_redirect_url) {
        window.location.href =  props.form.success_redirect_url
    }
}

</script>
<template>
    <BlocksRichText
        :data-directus="setAttr({collection: 'block_form', item: id, fields: 'tagline, headline', mode: 'popover' })"
        :id="id"
        :tagline="tagline"
        :headline="headline"
        :content="''"
        alignment="center"
        class="form-header"
    />
    <form
        :data-directus="setAttr({collection: 'forms', item: form.id, fields: 'fields', mode: 'drawer' })"
        :id="id"
        :form="form"
        :fields="form.fields"
        :submitLabel="form.submit_label"
        :successMessage="form.success_message"
        :state="state"
        @submit="onSubmit"
        v-if="!successMessage"
    >
        <fieldset v-for="field in form.fields" :key="field.id" :label="field.label" :name="field.name">
            <component :is="directusToNuxtUI(field)" v-bind="field" v-model="formValues[field.name]"></component>
        </fieldset>

        <button class="submit" type="submit">
        {{ form.submit_label }}
        </button>
    </form>
    <div v-else class="success-message">
      {{ successMessage }}
    </div>
</template>

<style lang="scss" scoped>
.form-header {
  pointer-events: none;
}

form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

fieldset {
  margin-bottom: 1rem;
  border: none;
  padding: 0;
}

.submit {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  width: 100%;
}

.success-message {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
}
</style>
