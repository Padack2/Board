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
      <v-file-input show-size counter chips multiple label="파일첨부(파일은 수정할 수 없습니다. 신중하게 올려주세요.)" ref="myfile" v-model="files"></v-file-input>
   </v-flex>
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
/*
변수설명
  files : 입력돈 파일들
  title : 입력된 제목
  content : 입력된 내용
  titleRules : 제목 작성 규칙
  contentRules : 내용 작성 규칙

메서드 설명
  loginCheck : 로그인되지 않은 사용자라면 다른 화면으로 이동
  writePost : (새) 게시굴 등록
  submitFiles : 입력된 파일 서버로 전송
*/
import axios from 'axios'
export default {
  data () {
    return{
      files: [],
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
            this.submitFiles();
            alert("글이 등록되었습니다.")
            location.href="/"
          })
          .catch((e) => {
            console.error(e.message)
            this.alert(e.message)
          });
      }
    },
    submitFiles() {
    if (this.files) {
        let formData = new FormData();

        // files
        for (let file of this.files) {
            formData.append("files", file, file.name);
        }

        // additional data
        formData.append("test", "foo bar");

        axios.post(`http://localhost:3000/upload/create/${sessionStorage.getItem("User")}`, formData)
            .then(response => {
                console.log("Success!");
                console.log({ response });
            })
            .catch(error => {
                console.log({ error });
            });
    } else {
        console.log("there are no files.");
    }
}
  }
};
</script>
