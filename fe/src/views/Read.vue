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
        <div class="my-2" style="margin: 5px">
          <v-btn depressed large>댓글달기</v-btn>
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
    this.postID = this.$route.params.id;
    this.getPost();
  },
  data(){
    return{
      postID: '',
      postInfo: [],
      isHidden: true
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
    getPost() {
      axios.get(`http://localhost:3000/posts/${this.postID}`)
        .then((r) => {
          this.postInfo = r.data.msg;
          if(this.postInfo.writerID == sessionStorage.getItem("User")) this.isHidden = false;
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
          this.check = false;
          console.error(e.message)
        })
    }

  }
};
</script>
