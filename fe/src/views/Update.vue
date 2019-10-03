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
          <v-btn depressed large @click="putPost()">수정</v-btn>
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
      postID: '',
      postInfo: [],
      titleRules: [
        v => !!v || '제목을 입력해주세요.',
        v => (v && v.length <= 30) || '30자 이내로 입력해주세요.'
        //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
      ],
      contentRules: [
        v => !!v || '내용을 입력해주세요.',
        v => (v && v.length <= 2000) || '2000자 이내로 입력해주세요.'
        //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
      ],
    }
  },
  computed: {
    binding ()
    {
      const binding = {}

      if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

      return binding
    }
  },
  mounted ()
  {
    this.loginCheck();
    this.postID = this.$route.params.id;
    this.getPost();
  },
  methods:
  {
    loginCheck()
    {
      if(sessionStorage.getItem("User") == null)
      {
        location.href="/login"
      }
      if(this.postInfo.writerID != sessionStorage.getItem("User"))
      {
        alert("자기가 쓴 글만 수정할 수 있습니다.");
        location.href="/"
      }
    },
    getPost() {
      axios.get(`http://localhost:3000/posts/${this.postID}`).
        then((r) => {
          this.postInfo = r.data.msg;
          this.title = this.postInfo.title;
          this.content = this.postInfo.content;
          console.log(r.data.msg);
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    putPost()
    {
      if(this.title == ''||this.content == '') alert("빈칸을 채워주세요.");
      else if(this.title.length > 30 || this.content.length > 2000) alert("글자 수를 확인해주세요.");
      else
      {
        axios.put(`http://localhost:3000/posts/${this.postID}`, {title: this.title, content: this.content})
          .then((r) => {
            alert("글이 수정되었습니다.")
            location.href=`/read/${this.postID}`
          })
          .catch((e) => {
            console.error(e.message)
            alert(e.message)
          });
      }
    }
  }
};
</script>
