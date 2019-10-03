<template>
  <v-container grid-list-xl>
    <v-layout v-bind="binding">
      <v-flex>
        <v-card dark color="primary">
          <v-card-text>유저정보 : 홍길동(abcd1234)</v-card-text>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card dark color="secondary">
          <v-card-text>올린 글 수 : 55개, 올린 댓글 수 : 10개</v-card-text>
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
      this.loginCheck();
    },
    methods:
    {
      logout()
      {
        sessionStorage.removeItem("User");
        alert("로그아웃되었습니다.")
        location.href ="/"
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
