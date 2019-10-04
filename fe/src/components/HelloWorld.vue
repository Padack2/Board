<template>
  <v-container>
    <v-flex>
      <v-row
      justify="end"
      >
      <v-col cols="2">
        <v-select v-model="align" :items="alignItem" @change="getPosts()" label="정렬"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select v-model="kind" :items="kinds" label="검색옵션" @change="getPosts()"></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field
            v-model="search"
            label="Search"
            name="search"
            @keyup.enter.exact="getPosts()"
          ></v-text-field>
      </v-col>
    </v-row>
      <v-simple-table fixed-header height="500px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">제목</th>
              <th class="text-center">작성자</th>
              <th class="text-center">작성일자</th>
              <th class="text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id" @click="$router.push(`read/${post.id}`)">
              <td>{{ post.title }}</td>
              <td>{{ post.writer }}</td>
              <td>{{ post.date }}</td>
              <td>{{ post.view }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
    <v-footer
        color="indigo"
        app
      >
        <div class="flex-grow-1"></div>
        <div class="my-2">
          <v-btn depressed large
          @click = "loginCheck()">글 작성</v-btn>
        </div>
    </v-footer>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      posts: [],
      kind: '제목',
      kinds: [
        '작성자',
        '제목'
      ],
      align: '최신순',
      alignItem: [
        '최신순',
        '제목순',
        '조회수순'
      ],
      search: ''
    }
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      var alignment ='';
      switch(this.align)
      {
        case '최신순': alignment = 'date';break;
        case '제목순': alignment = 'title';break;
        case '조회수순': alignment = 'view';break;
      }
      if(this.search == ''){
        axios.get(`http://localhost:3000/posts/align/${alignment}`).
          then((r) => {
            this.posts = r.data.msg
          })
          .catch((e) => {
            console.error(e.message)
          })
      }else if(this.kind == '제목')
      {
        axios.get(`http://localhost:3000/posts/search/title/${this.search}/${alignment}`).
          then((r) => {
            this.posts = r.data.msg
          })
          .catch((e) => {
            console.error(e.message)
          })
      }else if(this.kind == '작성자')
      {
        axios.get(`http://localhost:3000/posts/search/user/${this.search}/${alignment}`).
          then((r) => {
            this.posts = r.data.msg
          })
          .catch((e) => {
            console.error(e.message)
          })
      }

    },
    loginCheck()
    {
      if(sessionStorage.getItem("User") != null){
        location.href="/write"
      }else location.href="/login"
    }
  },
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

      return binding
    }
  }
};
</script>
