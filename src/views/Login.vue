<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" v-if="!sso">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem style="margin-bottom: 0px;">
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <a v-else class="ivu-btn ivu-btn-primary ivu-btn-long" href="/ordermgr/sso-login">IAM登录</a>
          <iframe v-if="sso" src="/ordermgr/iam/inspector?display=iframe"
                  sandbox="allow-top-navigation allow-scripts allow-forms"
                  frameborder="0"></iframe>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import api from '@/api';
  import qs from 'qs';

  export default {
    data() {
      return {
        sso: config.sso,
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      handleSubmit: function () {
        let _this = this;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            api.login.createLogin({
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: qs.stringify({
                'username': _this.form.username,
                'password': _this.form.password
              })
            }).then((res) => {
              this.$store.dispatch('initMenus', this);
              this.$router.push({name: 'home_index'});
            }).catch((err) => {
              if (err.response.status === 401) {
                this.$Message.error('账户密码错误，请重新输入');
              }
            })
          }
        });
      },
      messageHandler(data) {
        if (this.sso) {
          if (data['iam_logined']) {
            this.$router.push({
              name: 'home_index'
            });
          }
        }
      }
    },
    mounted() {
      let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      let eventer = window[eventMethod];
      let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
      let self = this;
      eventer(messageEvent, function (e) {
        let callback = self.messageHandler || function () {};
        if (callback != null) {
          let key = e.message ? "message" : "data";
          let data = e[key];
          callback(data);
        }
      }, false);
    }
  };
</script>

<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    background-size: cover;
    background: url('../assets/login_bg.jpg') center;
    position: relative;

    &-con {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;

      &-header {
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }

      .form-con {
        padding: 10px 0 0;
      }

      .login-tip {
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }

    }
    iframe {
      border: 0;
      width: 0;
      height: 0;
    }
  }
</style>
