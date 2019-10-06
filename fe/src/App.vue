<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <a href="/" style="text-decoration:none"><span>게시판</span></a>
        <span class="font-weight-light"></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="loginCheck()"
        target="_blank"
      >
        <span class="mr-2">
          <i class="material-icons">
account_circle
</i></span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    HelloWorld,

  },
};
</script>
