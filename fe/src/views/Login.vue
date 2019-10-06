<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="$router.push('register')"
                      icon
                      large
                      target="_blank"
                      v-on="on"
                    >
                    <v-icon>autorenew</v-icon>
                    </v-btn>
                  </template>
                  <span>회원가입으로 전환</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                  v-model="id"
                  :counter="10"
                  :rules="idRules"
                    label="ID"
                    name="id"
                    prepend-icon="person"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :counter="12"
                    :rules="pwRules"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn @click="login()" color="primary">로그인</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="alertWindow" max-width="290">
        <v-card>
          <v-card-text><span class="my-4 subtitle-1 black--text">{{alertMsg}}</span></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="alertWindow = false">확인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
/*
변수설명
  id : 입력된 ID,
  password : 입력된 비밀번호,
  alertWindow : 경고창 여부
  alertMsg : 경고창의 메시지
  idRules : 아이디 작성 규칙
  pwRules : 비밀번호 작성 규칙

메서드 설명
  loginCheck : 현재 로그인이 되어 있는지 체크. 로그인이 되어있다면 다른 페이지로 이동.
  login : 입력한 정보의 비교 및 로그인시 세션에 아이디를 저장.
*/
import axios from 'axios'
  export default {
    props: {
      source: String,
    },
    data() {
      return{
        id: '',
        password: '',
        alertWindow: false,
        alertMsg: '',
        idRules: [
          v => !!v || 'ID를 입력해주세요.',
          v => (v && v.length <= 10) || '10자 이내로 입력해주세요.',
          //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
        ],
        pwRules: [
          v => !!v || '비밀번호를 입력해주세요.',
          v => (v && v.length <= 12) || '12자 이내로 입력해주세요.'
        ],
        drawer: null,
      }
    },
    mounted() {
      this.loginCheck();
    }
    ,

    methods:{
      login()
      {
        axios.post(`http://localhost:3000/login`, {id:this.id, password:this.password})
          .then((r)=>{
            console.log(r.data);
            if(r.data.login){
              alert("로그인 완료");
              sessionStorage.setItem("User", this.id);
              location.href="/";
            }else {
              alert("아이디와 비밀번호를 다시 확인하세요.");
            }
          }).catch((e) => {
            this.check = false;
            console.error(e.message)
          })
      },
      loginCheck()
      {
        if(sessionStorage.getItem("User") != null){
          location.href="/mypage"
        }
      }
    }
  }
</script>
