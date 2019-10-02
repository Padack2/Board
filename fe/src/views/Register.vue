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
                <v-toolbar-title>Register form</v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="$router.push('login')"
                      icon
                      large
                      target="_blank"
                      v-on="on"
                    >
                    <v-icon>autorenew</v-icon>
                    </v-btn>
                  </template>
                  <span>로그인으로 전환</span>
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
                    :counter="10"
                    :rules="pwRules"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="name"
                    id="Name"
                    label="Name"
                    name="Nickname"
                    prepend-icon="face"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click ="register()">가입</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-dialog v-model="alertWindow" max-width="290">
      <v-card>
        <v-card-text><span class="my-4 subtitle-1 black--text">{{alertMsg}}</span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="alertWindow = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
  export default {
    props: {
      source: String,
    },
    data() {
      return{
        id: '',
        name: '',
        password: '',
        check: false,
        alertWindow: false,
        alertMsg: '',
        idRules: [
          v => !!v || 'ID를 입력해주세요.',
          v => (v && v.length <= 10) || '10자 이내로 입력해주세요.',
          //v=> 데이터베이스에 있는 경우에. '이미 있는 아이디입니다.'
        ],
        password: '',
        pwRules: [
          v => !!v || '비밀번호를 입력해주세요.',
          v => (v && v.length <= 12) || '12자 이내로 입력해주세요.'
        ],
        drawer: null,
      }
    },

    methods: {
      register() {
        axios.get(`http://localhost:3000/users/${this.id}`)
          .then((r) => {
            this.check = r.data.msg? true: false;
            if(!r.data.msg && this.id != '')
            {
              this.alert("아이디가 중복되었습니다. 다른 아이디를 입력해주세요.");
            }else if(this.id == '' || this.password == '' || this.name ==''){
              this.alert("모든 칸을 채워주세요.");
            }else if(this.id.length > 10 || this.password.length > 12){
              this.alert("글자 수를 확인해주세요.");
            }
            else{
              this.postUser();
            }
            console.log(r.data.msg);
          })
          .catch((e) => {
            this.check = false;
            console.error(e.message)
          })

        //console.log(this.check)

      },

      postUser() {
        axios.post('http://localhost:3000/users', {id: this.id, name: this.name, password: this.password})
          .then((r) => {
            this.alert("회원가입되었습니다.")
            this.name = ''
            this.id = ''
            this.password = ''
          })
          .catch((e) => {
            console.error(e.message)
            this.alert(e.message)
          })
      },

      alert(msg) {
        this.alertWindow = true;
        this.alertMsg = msg;
      }
    }
  }

</script>
