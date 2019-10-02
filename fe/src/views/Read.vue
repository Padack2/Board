<template>
  <v-container>
    <v-card>
      <v-card-title>테스트 제목</v-card-title>
    </v-card>
    <v-card
    :height="500">
      <v-card-text>
        <span>December 15th | 작성자 : 호박고구마</span><br>
        <span class="text--primary">
          <span>Whitehaven Beach</span><br>
          <span>Whitsunday Island, Whitsunday Islands</span>
        </span>
      </v-card-text>
    </v-card>
    <v-card
    :height="100">
      <v-card-text>
        <span>December 15th</span><br>
        <span class="text--primary">
          <span>000님의 댓글</span><br>
          <span>Whitsunday Island, Whitsunday Islands</span>
        </span>
      </v-card-text>
    </v-card>
    <v-footer
        color="indigo"
        app
      >
        <div class="flex-grow-1"></div>
        <div class="my-2">
          <v-btn depressed large>댓글달기</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          @click="$router.push('/')">목록</v-btn>
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
};
</script>
