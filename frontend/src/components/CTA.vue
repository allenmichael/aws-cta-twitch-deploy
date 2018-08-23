<template>
  <div>
    <h2>Important messages:</h2>
    <p>{{ msg }}</p>
    <a
      :href="'https://google.com/?userId=' + userId"
      target="_blank">Click me</a>
    <div v-if="isBroadcaster">
      <p>Add a new Call to Action link</p>
      <input
        type="text"
        v-model="ctaText" >
      <br >
      <br >
      <input
        type="button"
        @click="sendCTA"
        value="Yes, add call to action" >
      <input
        type="button"
        @click="clearCTA"
        value="Remove all call to actions" >
    </div>
    <div id="list">
      <ul>
        <li
          v-for="message in messages"
          :key="message">
          <a
            href="https://google.com"
            @click.prevent="clickedCTA">{{ message }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CTA',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      userId: '',
      messages: [],
      token: '',
      tuid: '',
      isBroadcaster: false,
    };
  },
  async mounted() {
    console.log('mounted');
    this.isBroadcaster = true;
    const resp = await axios.get('https://api.github.com/users/octocat');
    console.log(resp);
    window.Twitch.ext.listen('broadcast', (target, contentType, message) => {
      console.log(target);
      console.log(contentType);
      console.log(message);
      if (message === 'rm') {
        this.messages = [];
      } else {
        this.messages.push(message);
      }
    });
    window.Twitch.ext.onAuthorized(async (auth) => {
      // save our credentials
      this.token = auth.token;
      this.tuid = auth.userId;
      const whoamiResp = await axios({
        url: `${process.env.ROOT_API}/whoami`,
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log(whoamiResp);
      console.log(whoamiResp.data);
      this.isBroadcaster = whoamiResp.data.you === 'broadcaster';
    });
  },
  methods: {
    async clearCTA() {
      try {
        const response = await axios({
          method: 'DELETE',
          url: `${process.env.ROOT_API}/cta`,
          headers: { Authorization: `Bearer ${this.token}` },
        });
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },
    sendCTA() {
      console.log(this.ctaText);
      if (!this.ctaText) {
        return;
      }
      axios({
        method: 'POST',
        url: `${process.env.ROOT_API}/cta`,
        headers: { Authorization: `Bearer ${this.token}` },
        data: { message: this.ctaText },
      })
        .then((response) => {
          console.log(response);
          console.log(response.data.you);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickedCTA(evt) {
      console.log(evt);
      console.log(evt.target.href);
      window.open(`${evt.target.href}/?userId=${this.tuid}`, '_blank');
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
