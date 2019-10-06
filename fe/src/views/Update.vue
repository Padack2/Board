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
/*
변수설명
  title : 입력된 제목
  content : 입력된 내용
  postID : 현재 수정하고 있는 게시글의 ID
  postInfo : 현재 수정하고 있는 게시글의 정보
  titleRules : 제목 작성 규칙
  contentRules : 내용 작성 규칙

메서드 설명
  loginCheck : 현재 접근한 사용자의 id가 게시글을 작성한 자와 똑같거나 관리자인지 확인.
  getPost : 원래 게시글의 내용을 미리 입력해놓기 위해 해당 게시글의 정보를 가져옴.
  putPost : 수정된 내용을 저장
*/
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
        console.log(this.postInfo.writerID);
        if(sessionStorage.getItem("User") != 'admin')
        {
          alert("자기가 쓴 글만 수정할 수 있습니다.");
          location.href="/"
        }
      }
    },
    getPost() {
      axios.get(`http://localhost:3000/posts/${this.postID}`).
        then((r) => {
          this.postInfo = r.data.msg;
          this.title = this.postInfo.title;
          this.content = this.postInfo.content;

          this.loginCheck();
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
