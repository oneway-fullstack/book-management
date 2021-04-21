<template>
  <v-app>
    <v-main class="ch-bg">
      <v-container class="fill-height ch-mask" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar
                class="d-flex justify-center"
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Book Management Test Project</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form class="pa-4">
                  <v-text-field
                    v-model="userName"
                    label="Username"
                    name="login"
                    prepend-icon="mdi-email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    v-model="userPass"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    autocomplete="on"
                    type="password"
                  ></v-text-field>
                </v-form>
                <v-alert v-if="loginFail" type="error" dismissible>
                  Invalid Login Info. Please try again.
                </v-alert>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  width="100px"
                  rounded
                  class="p-x-6"
                  :loading="loadingState"
                  :disabled="!userName || !userPass"
                  @click.native.prevent="onUserLogin"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-alert
              v-if="errcode"
              type="error"
              class="mt-3"
              dismissible
            >
              {{ errcode }}             
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "login",
  data: () => {
    return {
      errcode: '',
      loginFail: false,
      loadingState: false,
      userName: '',
      userPass: '',
    }
  },
  mounted() {
    this.errcode = localStorage.getItem('login_err')    
    localStorage.removeItem('login_err')
    // clear login state    
    localStorage.setItem('token', '')
  },
  methods: {
    async onUserLogin() {
      this.loadingState = true
      await this.$store.dispatch('login', {username: this.userName, password:this.userPass})
      console.log(localStorage.getItem('login_err'))
      this.errcode = localStorage.getItem('login_err')
      this.loadingState = false
    },
  }
}
</script>
