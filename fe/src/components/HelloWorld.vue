<template>
  <v-container>
    <v-flex>
      <v-simple-table fixed-header height="300px">
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
            <tr v-for="post in posts" :key="post.id">
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
    }
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      axios.get('http://localhost:3000/posts').
        then((r) => {
          this.posts = r.data.msg
          console.log(r)
        })
        .catch((e) => {
          console.error(e.message)
        })
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
