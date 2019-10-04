<template>
  <v-container>
    <v-row>
      <v-text-field
          v-model="title"
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
     ></v-textarea>
    </v-row>
    <v-footer
        color="indigo"
        app
      >
        <div class="flex-grow-1"></div>
        <div class="my-2">
          <v-btn depressed large @click="writePost()">글 등록</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          @click="$router.push('/')">취소</v-btn>
        </div>
    </v-footer>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return{
      title: '',
      content: '',
      titleRules: [
        v => !!v || '제목을 입력해주세요.',
        v => (v && v.length <= 30) || '30자 이내로 입력해주세요.'
      ],
      contentRules: [
        v => !!v || '내용을 입력해주세요.',
        v => (v && v.length <= 2000) || '2000자 이내로 입력해주세요.'
      ],
    }
  },
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
  methods:
  {
    loginCheck()
    {
      if(sessionStorage.getItem("User") == null){
        location.href="/login"
      }
    },
    writePost()
    {
      if(this.title == ''||this.content == '') alert("빈칸을 채워주세요.");
      else if(this.title.length > 30 || this.content.length > 2000) alert("글자 수를 확인해주세요.");
      else
      {
        axios.post('http://localhost:3000/posts', {title: this.title, content: this.content, writerID: sessionStorage.getItem("User")})
          .then((r) => {
            alert("글이 등록되었습니다.")
            location.href="/"
          })
          .catch((e) => {
            console.error(e.message)
            this.alert(e.message)
          });
      }
    }
  }
};
</script>
