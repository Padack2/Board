<template>
  <v-container>
    <v-row>
      <v-text-field
          v-model="label"
          :counter="30"
          :rules="titleRules"
          label="Title"
          name="title"
        ></v-text-field>
    </v-row>
    <v-row>
      <v-textarea
      v-model="content"
      :counter="2000"
      :rules="contentRules"
       label="Content"
       no-resize
       rows="20"
       :value="value"
     ></v-textarea>
    </v-row>
    <v-footer
        color="indigo"
        app
      >
        <div class="flex-grow-1"></div>
        <div class="my-2">
          <v-btn depressed large>글 등록</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          @click="$router.push('/')">취소</v-btn>
        </div>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  data: () => ({

  }),
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

      return binding
    }
  },
  mounted ()
  {
    this.loginCheck();
  },
  data: () => ({
    titleRules: [
      v => !!v || '제목을 입력해주세요.',
      v => (v && v.length <= 10) || '30자 이내로 입력해주세요.'
      //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
    ],
    contentRules: [
      v => !!v || '내용을 입력해주세요.',
      v => (v && v.length <= 10) || '2000자 이내로 입력해주세요.'
      //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
    ],
  }),

  methods:
  {
    loginCheck()
    {
      if(sessionStorage.getItem("User") == null){
        location.href="/login"
      }
    }
  }
};
</script>
