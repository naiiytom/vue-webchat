// eslint-disable-next-line

<template>
  <div :style="{ background: backgroundColor }">
    <beautiful-chat
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :close="closeChat"
      :colors="colors"
      :is-open="isChatOpen"
      :message-list="messageList"
      :message-styling="messageStyling"
      :new-messages-count="newMessagesCount"
      :on-message-was-sent="onMessageWasSent"
      :open="openChat"
      :participants="participants"
      :show-close-button="true"
      :show-launcher="true"
      :show-emoji="false"
      :show-file="false"
      :show-typing-indicator="showTypingIndicator"
      :show-edition="false"
      :show-deletion="false"
      :title-image-url="titleImageUrl"
      :disable-user-list-toggle="true"
      @onType="handleOnType"
      @edit="editMessage"
      @remove="removeMessage"
    >
      <!-- <template v-slot:text-message-toolbox="scopedProps"> -->
      <!-- <button v-if="!scopedProps.me && scopedProps.message.type === 'text'"> -->
      <!-- @click.prevent="like(scopedProps.message.id)"
        > -->
      <!-- 👍 -->
      <!-- </button> -->
      <!-- </template> -->
      <template v-slot:text-message-body="scopedProps">
        <p
          class="sc-message--text-content"
          v-html="scopedProps.messageText"
        ></p>
        <p
          v-if="scopedProps.message.data.meta"
          class="sc-message--meta"
          :style="{ color: scopedProps.messageColors.color }"
        >
          {{ scopedProps.message.data.meta }}
        </p>
        <p
          v-if="scopedProps.message.isEdited || scopedProps.message.liked"
          class="sc-message--edited"
        >
          <template v-if="scopedProps.message.isEdited">✎</template>
          <template v-if="scopedProps.message.liked">👍</template>
        </p>
      </template>
      <template v-slot:system-message-body="{ message }">
        [System]: {{ message.text }}
      </template>
    </beautiful-chat>
    <p class="text-center toggle">
      <a
        v-if="!isChatOpen"
        :style="{ color: linkColor }"
        href="#"
        @click.prevent="openChat()"
        >Open the chat window</a
      >
      <a
        v-else
        :style="{ color: linkColor }"
        href="#"
        @click.prevent="closeChat()"
        >Close the chat window</a
      >
    </p>
    <p class="text-center colors">
      <a
        :style="{ background: availableColors.blue.launcher.bg }"
        href="#"
        @click.prevent="setColor('blue')"
        >Blue</a
      >
      <a
        :style="{ background: availableColors.red.launcher.bg }"
        href="#"
        @click.prevent="setColor('red')"
        >Red</a
      >
      <a
        :style="{ background: availableColors.green.launcher.bg }"
        href="#"
        @click.prevent="setColor('green')"
        >Green</a
      >
      <a
        :style="{ background: availableColors.dark.launcher.bg }"
        href="#"
        @click.prevent="setColor('dark')"
        >Dark</a
      >
    </p>
    <!-- <v-dialog /> -->
    <p class="text-center messageStyling">
      <label
        >Message styling enabled?
        <input checked type="checkbox" @change="messageStylingToggled" />
      </label>
      <a href="#" @click.prevent="showStylingInfo()">info</a>
    </p>
  </div>
</template>

<script>
import welcomeMessage from "./utils/welcomeMessage";
import chatParticipants from "./utils/chatProfiles";
import availableColors from "./utils/colors";
export default {
  name: "app",
  data() {
    return {
      participants: chatParticipants,
      titleImageUrl:
        "https://cdn.discordapp.com/avatars/559426966151757824/c7c54eb85e591ced4c2f0864b7ea4e3e.webp?size=32",
      messageList: welcomeMessage,
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: "",
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: true,
      messageStyling: true,
      userIsTyping: false,
    };
  },
  computed: {
    linkColor() {
      return this.chosenColor === "dark"
        ? this.colors.sentMessage.text
        : this.colors.launcher.bg;
    },
    backgroundColor() {
      return this.chosenColor === "dark" ? this.colors.messageList.bg : "#fff";
    },
  },
  created() {
    this.setColor("red");
  },
  mounted() {
    this.messageList.forEach((x) => (x.liked = false));
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "support",
          type: "text",
          id: Math.random(),
          data: { text },
        });
      }
    },
    handleTyping(text) {
      this.showTypingIndicator =
        text.length > 0
          ? this.participants[this.participants.length - 1].id
          : "";
    },
    onMessageWasSent(message) {
      this.messageList = [
        ...this.messageList,
        Object.assign({}, message, { id: Math.random() }),
      ];
    },
    openChat() {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      this.isChatOpen = false;
    },
    setColor(color) {
      this.colors = this.availableColors[color];
      this.chosenColor = color;
    },
    showStylingInfo() {
      this.$modal.show("dialog", {
        title: "Info",
        text:
          "You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>",
      });
    },
    messageStylingToggled(e) {
      this.messageStyling = e.target.checked;
    },
    handleOnType() {
      this.$root.$emit("onType");
      this.userIsTyping = true;
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    removeMessage(message) {
      if (confirm("Delete?")) {
        const m = this.messageList.find((m) => m.id === message.id);
        m.type = "system";
        m.data.text = "This message has been removed";
      }
    },
    like(id) {
      const m = this.messageList.findIndex((m) => m.id === id);
      const msg = this.messageList[m];
      msg.liked = !msg.liked;
      this.$set(this.messageList, m, msg);
    },
  },
};
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
}
* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}
.text-center {
  text-align: center;
}
.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}
.toggle a {
  text-decoration: none;
}
.messageStyling {
  font-size: small;
}
</style>
