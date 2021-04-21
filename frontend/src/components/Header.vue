<template>
  <v-app-bar>
    <v-toolbar-title>Book Management Test Project </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="!loggedIn" :to="{ name: 'login' }">Login</v-btn>
    <span v-else><v-btn @click="logout">Logout</v-btn></span>
  </v-app-bar>
</template>
<script>
export default {
  name: "Header",
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
    logout: function () {
      this.$store.dispatch("logout");
    },
  },
};
</script>
