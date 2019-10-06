<template>
  <v-container>
    <v-card>
      <v-card-title>{{postInfo.title}}</v-card-title>
    </v-card>
    <v-card
    :height="500">
      <v-card-text>
        <span>{{postInfo.date}} | 작성자 : {{postInfo.writer}}</span><br>
        <span class="text--primary">
          <div v-html="content"></div>
        </span>
      </v-card-text>
    </v-card>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>첨부파일</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn v-for="file in files" @click="fileDownload(file.id, file.name)">{{file.name}}</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card
    :height="userID == com.writerID? 170:120"  v-for="com in comments" :key="com.id">
      <v-card-text>
        <span>{{com.date}}</span><br>
        <span class="text--primary">
          <span>{{com.writer}}님의 댓글</span><br>
          <span>{{com.content}}</span>
        </span>
      </v-card-text>
      <v-card-actions>
       <v-btn text v-if="userID == com.writerID" @click="modifyDialogOn(com.id)">수정</v-btn>
       <v-btn text v-if="userID == com.writerID" @click="deleteComment(com.id)">삭제</v-btn>
      </v-card-actions>
    </v-card>
    <v-row justify="center">
    <v-dialog v-model="modifyForm" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">댓글 수정</v-card-title>
        <v-card-text>
          <v-textarea
          v-model="comment"
          :counter="100"
           label="Comment"
           no-resize
           rows="5"
         ></v-textarea>
       </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="putComment()">수정</v-btn>
          <v-btn color="green darken-1" text @click="modifyForm = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="commentForm" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">댓글 입력</v-card-title>
        <v-card-text>
          <v-textarea
          v-model="comment"
          :counter="100"
           label="Comment"
           no-resize
           rows="5"
         ></v-textarea>
       </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="postComment()">등록</v-btn>
          <v-btn color="green darken-1" text @click="commentForm = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <v-footer
        color="indigo"
        app
      >
        <div class="flex-grow-1"></div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large @click="commentDialogOn()">댓글달기</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          @click="$router.push('/')">목록</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          v-if="!isHidden"
          @click="$router.push(`/update/${postID}`)">수정</v-btn>
        </div>
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large
          v-if="!isHidden"
          @click="deletePost()">삭제</v-btn>
        </div>
    </v-footer>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  mounted() {
    this.userID = sessionStorage.getItem("User");
    this.postID = this.$route.params.id;
    this.getPost();
    this.getFiles();
    this.getComment();
  },
  data(){
    return{
      userID: '',
      commentForm: false,
      modifyForm: false,
      postID: '',
      postInfo: [],
      isHidden: true,
      commentIsHidden: true,
      comment: '',
      comments: [],
      commentInfo: [],
      files: [],
    }
  },
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

      return binding
    },
    content: function() {
      return this.postInfo.content.split('\n').join('<br />');
    }
  },
  methods :
  {
    getFiles() {
      axios.get(`http://localhost:3000/upload/show/${this.postID}`)
        .then((r) => {
          this.files = r.data.msg;
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    getPost() {
      axios.get(`http://localhost:3000/posts/${this.postID}`)
        .then((r) => {
          this.postInfo = r.data.msg;
          if(this.postInfo.writerID == sessionStorage.getItem("User") || sessionStorage.getItem("User") == 'admin') this.isHidden = false;
          console.log(r.data.msg);
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    deletePost()
    {
      axios.delete(`http://localhost:3000/posts/${this.postID}`)
        .then((r) => {
          alert("삭제되었습니다.")
          location.href ="/"
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    getComment()
    {
      axios.get(`http://localhost:3000/comments/${this.postID}`)
        .then((r) => {
          this.comments = r.data.msg;
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    commentDialogOn()
    {
      if(sessionStorage.getItem("User") == null){
        location.href="/login"
      }else {
        this.comment = '';
        this.commentForm = true;
      }
    },
    postComment()
    {
      if(this.comment == '') alert("빈칸을 채워주세요.");
      else if(this.comment.length > 100) alert("글자 수를 확인해주세요.");
      else
      {
        axios.post('http://localhost:3000/comments', {postID: this.postID, content: this.comment, writerID: sessionStorage.getItem("User")})
          .then((r) => {
            alert("글이 등록되었습니다.", r.data.msg);
            location.href=`/read/${this.postID}`;
          })
          .catch((e) => {
            console.error(e.message)
            this.alert(e.message)
          });
      }
    },
    deleteComment(id)
    {
      axios.delete(`http://localhost:3000/comments/${id}`)
        .then((r) => {
          alert("삭제되었습니다.")
          location.href=`/read/${this.postID}`
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    putComment()
    {
      if(this.comment == '') alert("빈칸을 채워주세요.");
      else if(this.comment.length > 100) alert("글자 수를 확인해주세요.");
      else
      {
        axios.put(`http://localhost:3000/comments/${this.commentInfo.id}`, {content: this.comment})
          .then((r) => {
            alert("댓글이 수정되었습니다.")
            location.href=`/read/${this.postID}`
          })
          .catch((e) => {
            console.error(e.message)
            alert(e.message)
          });
      }
    },
    modifyDialogOn(id)
    {
      axios.get(`http://localhost:3000/comments/id/${id}`)
        .then((r) => {
          this.commentInfo = r.data.msg;
          this.comment = this.commentInfo.content;
          this.modifyForm = true;
          //if(this.postInfo.writerID == sessionStorage.getItem("User")) this.isHidden = false;
          console.log(r.data.msg);
        })
        .catch((e) => {
          console.error(e.message)
        })
    },
    fileDownload(id, filename)
    {
      window.open(`http://localhost:3000/upload/download/${id}/${filename}`);
    }
  }
};
</script>
