import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(Vuetify);

const vuetify = new Vuetify({  
  theme: { dark: true }
});

Vue.use(VuetifyConfirm, {
  vuetify
});
export default new Vuetify({
});
