<template>
  <div class="px-8 py-6 bg-primary text-white">
    <h3 class="text-base font-bold inline-block">Webscreen Chatbot</h3>
    <x-icon
      class="block sm:hidden cursor-pointer hover:text-black-600 float-right"
      size="20"
      stroke-width="1"
      @click="$emit('close')"
    />
  </div>
</template>

<script lang="ts">
import Volume2Icon from 'vue-feather-icons/icons/Volume2Icon';
import VolumeIcon from 'vue-feather-icons/icons/VolumeIcon';
import XIcon from 'vue-feather-icons/icons/XIcon';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'chat-widget-window-header',
  components: {
    VolumeIcon,
    Volume2Icon,
    XIcon,
  },
})
export default class ChatWidgetWindowHeader extends Vue {}
</script>
