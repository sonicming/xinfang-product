<template>
  <div class="la-panel" :class="{'la-panel--full':full}">
    <div class="la-panel__header">
      <span>
        <i :class="icon"></i> {{title}}
      </span>
      <div class="la-panel__buttons">
        <slot name="buttons" />
      </div>
      <div style="clear:both"></div>
    </div>

    <div class="la-panel__body">
      <slot />
    </div>

    <div style="clear:both"></div>
  </div>

</template>

<script>
export default {
  name:'panel',
  props:{
    icon: { type: String },
      full: { type: Boolean, default: false },
      title: { type: String, required: true }
  }
}
</script>
