<template>
  <v-main>
    <Header></Header>
    <router-view />
  </v-main>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>
