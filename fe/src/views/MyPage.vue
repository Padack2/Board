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
              <tr v-for="item in desserts" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
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
        <v-btn depressed large>로그아웃</v-btn>
      </div>
      <div class="my-2" style="margin: 5px">
        <v-btn depressed large
        @click="$router.push('/')">회원탈퇴</v-btn>
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
    }
  }
</script>
