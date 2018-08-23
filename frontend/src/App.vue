<template>
  <div id="app">
    <CTA/>
  </div>
</template>

<script>
import CTA from './components/CTA';

export default {
  name: 'App',
  components: {
    CTA,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
