<template>
  <v-container grid-list-xl>
    <v-layout v-bind="binding">
      <v-flex>
        <v-card dark color="primary">
          <v-card-text>유저정보 : {{user.name}}({{user.id}})</v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card dark color="secondary">
          <v-card-text>올린 글 수 : {{postCount}}개</v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-simple-table fixed-header height="300px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">제목</th>
                <th class="text-center">작성일자</th>
                <th class="text-center">조회수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id" @click="$router.push(`read/${post.id}`)">
                <td>{{ post.title }}</td>
                <td>{{ post.date }}</td>
                <td>{{ post.view }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
    <v-footer
        color="indigo"
        app
      >
      <div class="flex-grow-1"></div>
      <div class="my-2">
        <v-btn depressed large @click="logout()">로그아웃</v-btn>
      </div>
      <div class="my-2" style="margin: 5px">
        <v-btn depressed large
        @click="deleteUser()">회원탈퇴</v-btn>
      </div>
    </v-footer>
  </v-container>
</template>

<script>
/*
변수 설명
  user : 현재 접속되어 있는 유저(자신)의 정보
  postCount : User가 지금까지 쓴 글의 수
  posts : User가 지금까지 쓴 모든 글의 정보

메서드 설명
  logout : 로그아웃
  pageSetting : 필요한 정보를 각 변수에 할당
  loginCheck : 페이지에 접속된 유저가 로그인된 유저가 아니라면 로그인 화면으로 이동.
  deleteUser : 회원탈퇴
*/
import axios from 'axios'
  export default {
    computed: {
      binding () {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

        return binding
      }
    },
    mounted ()
    {
      this.pageSetting();
      this.loginCheck();
    },
    data ()
    {
      return {
        user: [],
        postCount: '',
        posts: [],
      }
    },
    methods:
    {
      logout()
      {
        sessionStorage.removeItem("User");
        alert("로그아웃되었습니다.")
        location.href ="/"
      },
      pageSetting()
      {

        axios.get(`http://localhost:3000/posts/user/${sessionStorage.getItem("User")}`)
          .then((r) => {
            this.posts = r.data.msg;
            console.log(this.posts);
            console.log(this.posts[0]);
          })
          .catch((e) => {
            console.error(e.message)
          });

        axios.get(`http://localhost:3000/users/${sessionStorage.getItem("User")}`)
          .then((r) => {
            this.user = r.data.msg;
          })
          .catch((e) => {
            console.error(e.message)
          });

        axios.get(`http://localhost:3000/posts/count/${sessionStorage.getItem("User")}`)
          .then((r) => {
            this.postCount = r.data.msg.count;
          })
          .catch((e) => {
            console.error(e.message)
          });
      },
      loginCheck()
      {
        if(sessionStorage.getItem("User") == null){
          location.href="/login"
        }
      },
      deleteUser()
      {
        axios.delete(`http://localhost:3000/users/${sessionStorage.getItem("User")}`)
          .then((r) => {
            sessionStorage.removeItem("User");
            alert("탈퇴되었습니다.")
            location.href ="/"
          })
          .catch((e) => {
            this.check = false;
            console.error(e.message)
          })
      }
    }
  }
</script>
