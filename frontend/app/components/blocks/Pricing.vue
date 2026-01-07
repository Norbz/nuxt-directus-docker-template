<script lang="ts" setup>
import { setAttr } from '@directus/visual-editing'

const props = defineProps<{
    id: string
    tagline: string
    headline: string
    pricing_cards: PricingCard[]
}>()
</script>

<template>
  <div class="pricing-block">
    <BlocksRichText
      :data-directus="setAttr({collection: 'block_pricing', item: id, fields: 'tagline, headline', mode: 'drawer' })"
      :id="id"
      :tagline="tagline"
      :headline="headline"
      :content="''"
      alignment="center"
    />
    <ul class="pricing-cards" :data-directus="setAttr({collection: 'block_pricing', item: id, fields: 'pricing_cards', mode: 'drawer' })">
      <li
        v-for="(plan, index) in pricing_cards"
        :key="index"
        class="pricing-card"
        :class="{ highlighted: plan.is_highlighted }"
      >
        <h3>{{ plan.title }}</h3>
        <p>{{ plan.description }}</p>
        <div class="price">{{ plan.price }}</div>
        <ul class="features">
          <li v-for="(feature, i) in plan.features" :key="i">{{ feature }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.pricing-block {
  padding: 2rem;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.pricing-card {
  border: 1px solid;
  padding: 2rem;
  
  &.highlighted {
    border-width: 2px;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 2rem;
    margin: 1rem 0;
  }
  
  .features {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.5rem 0;
    }
  }
}
</style>
