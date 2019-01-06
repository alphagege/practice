<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <ShrinkableMenu :shrink="shrink" :open-names="openedSubmenuArr" :menu-list="menuList">
        <div slot="top" class="logo-con">
          <div v-show="!shrink" key="max-logo">应用基础框架</div>
          <div v-show="shrink" key="min-logo">Co</div>
        </div>
      </ShrinkableMenu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                  @click="toggleClick"> 
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <!-- 面包屑组件 -->
            <BreadcrumbNav :currentPath="breadcrumbs"></BreadcrumbNav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ me.name }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace" @on-click="getPerson">个人中心</DropdownItem>
                  <DropdownItem name="editPsd" @on-click="modifyPsd">修改密码</DropdownItem>
                  <DropdownItem name="logout" divided @on-click="logout">退出登录</DropdownItem>
                </DropdownMenu>
                <iframe class="hiddenIframe"
                        sandbox="allow-top-navigation allow-scripts allow-forms"
                        ref="hfrm"></iframe>
              </Dropdown>
              <Avatar icon="person" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <transition name="slide-left">
          <!-- 路由切换站位 -->
          <router-view class="child-view"></router-view>
        </transition>
      </div>
    </div>
    <!-- 个人中心 -->
    <Modal :mask-closable="false" v-model="personCenter" title="个人中心" width="800">
      <div style="padding:10px 20px;">
        <Form :label-width="110" inline :rules="ruleValidate" ref="personInfo" :model="personInfo">

          <Row>
            <Col span="12">
              <FormItem label="用户名:" label-position="left" :label-width="100" prop="name">
                <Input class="inputSty" placeholder="用户名" v-model="personInfo.name"> </Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户账号:" label-position="left" :label-width="100" prop="username">
                <Input class="inputSty" placeholder="用户账号" readonly v-model="personInfo.username"> </Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="手机号码:" label-position="left" :label-width="100" prop="mobileNo">
                <Input class="inputSty" placeholder="手机号码" v-model="personInfo.mobileNo"> </Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邮箱:" label-position="left" :label-width="100" prop="pEmail">
                <Input class="inputSty" placeholder="邮箱" v-model="personInfo.pEmail"> </Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="性别:" label-position="left" :label-width="100">
                <Select v-model="personInfo.gender" class="inputSty" style="width: 160px">
                  <Option v-for="(item,key) in genderSelect" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="出生日期:" label-position="left" :label-width="100">

                <DatePicker type="date" placeholder="出生日期" style="width: 160px"
                            v-model="personInfo.birthDate"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="证件类型:" label-position="left" :label-width="100">
                <Select v-model="personInfo.idCardType" class="inputSty" style="width: 160px">
                  <Option v-for="(item,key) in IDtypeSelect" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="证件号码:" label-position="left" :label-width="100" prop="idCardNo">
                <Input class="inputSty" placeholder="证件号码" v-model="personInfo.idCardNo"> </Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="personCenter=false">取消</Button>
        <Button type="primary" @click="savePersonInfo('personInfo')">保存</Button>
      </div>
    </Modal>

    <!-- 修改密码 -->
    <Modal :mask-closable="false" v-model="psdmodify" title="修改密码">
      <div style="padding:10px 20px;">
        <Form :label-width="110" inline :rules="ruleValidate" ref="psdForm" :model="psdForm">


          <FormItem label="当前密码:" label-position="left" :label-width="100" prop="oldPassword">
            <Input class="inputSty" placeholder="当前密码" v-model="psdForm.oldPassword" type="password"
                   style="width:250px"> </Input>
          </FormItem>


          <FormItem label="新密码:" label-position="left" :label-width="100" prop="password">
            <Input class="inputSty" placeholder="新密码" v-model="psdForm.password" type="password"
                   style="width:250px"> </Input>
          </FormItem>

          <FormItem label="确认密码:" label-position="left" :label-width="100" prop="confirmPassword">
            <Input class="inputSty" placeholder="确认密码" v-model="psdForm.confirmPassword" type="password"
                   style="width:250px"> </Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancleUpdatePsd">取消</Button>
        <Button type="primary" @click="updatePsdOk('psdForm')">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ShrinkableMenu from "@/components/shrinkable-menu";
  import BreadcrumbNav from '@/components/breadcrumb-nav';
  import http from '@/utils/http'
  import util from '@/utils/util'
  import api from '@/api/index'

  import {
    mapActions,
    mapGetters
  } from 'vuex';

  export default {
    name: "Main",
    components: {
      ShrinkableMenu,
      BreadcrumbNav
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.psdForm.confirmPassword !== '') {
            // 对第二个密码框单独验证
            this.$refs.psdForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.psdForm.password) {
          callback(new Error('两次密码输入不一致!'));
        } else {
          callback();
        }
      };
      return {
        sso: config.sso,//在index.html配置的是否单点登录
        interval: 0,//定时器
        shrink: false,//菜单伸缩和扩张切换状态
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr,//store就没有这个字段啊
        personCenter: false,//个人中心弹窗状态
        psdmodify: false,//修改密码的弹窗状态
        genderSelect: [],//个人中心，性别选择选项  [{"value":"m","label":"男"},{"value":"f","label":"女"},{"value":"n","label":"未知"}]
        modelGender: '', //没找到
        IDtypeSelect: [],//个人中心，证件类型选项  [{"value":"id","label":"身份证"},{"value":"junguan","label":"军官证"},{"value":"passport","label":"护照"},{"value":"student","label":"学生证"},{"value":"zhanzhu","label":"暂住证"}]
        modelIDtype: '', //没找到
        psdForm: { //密码model
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        //个人中心表单验证规则
        ruleValidate: {
          name: [{
            required: true,
            message: '用户名称不能为空',
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '用户账号不能为空',
            trigger: 'blur'
          }],
          mobileNo: [{
            required: false,
            trigger: 'blur'
          }, {
            type: 'string',
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
            // transform: value => +value
          }],
          pEmail: [{
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }],
          idCardNo: [{
            required: false,
            trigger: 'blur'
          }, {
            type: 'string',
            pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/,
            message: '请输入正确的身份证号码',
            trigger: 'blur',
            // transform: value => +value
          }],
          oldPassword: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }, {
            validator: validatePass,
            trigger: 'blur'
          }],
          confirmPassword: [{
            required: true,
            message: '验证密码不能为空',
            trigger: 'blur'
          }, {
            validator: validatePassCheck,
            trigger: 'blur'
          }],
        },
      }
    },
    computed: {
      ...mapGetters(['menuList', 'me', 'breadcrumbs', 'personInfo']),
    },
    methods: {
      ...mapActions(['fetchMe', 'fetchPersonInfo']),
      init() {
        this.$store.dispatch('initBreadcrumbs', this.$route.name);
        this.fetchMe();
      },
      // 点击切换按钮调用这个方法
      toggleClick() {
        this.shrink = !this.shrink;
      },
      handleClickUserDropdown(name) {
        console.log(name)
        if (name == 'logout') {
          this.logout();
        } else if (name == 'ownSpace') {
          this.getPerson()
        } else if (name == 'editPsd') {
          this.modifyPsd()
        }
      },
      logout() {
        let _this = this;
        if (this.sso) {
          // 单点登录退出
          let hfrm = _this.$refs.hfrm;
          _this.$refs.hfrm.src = "/coframe/logout?display=iframe";
        } else {
          // 本地登录退出
          api.login.createLogout({
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          }).then(res => {
            console.log(res)
            this.$router.push({
              name: 'login'
            });
          })
        }
      },
      messageHandler(data) {
        if (this.sso) {
          if (data['iam_logout'] || data['iam_needLogin']) {
            this.$router.push({
              name: 'login'
            });
          }
          if (data['iam_logined']) {
            this.$router.push({
              name: 'home_index'
            });
          }
        }
      },
      getPerson() {
        this.fetchPersonInfo();
        this.personCenter = true
      },
      modifyPsd() {
        this.psdmodify = true
      },
      cancleUpdatePsd() {
        this.psdmodify = false
      },
      savePersonInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.personInfo)
            this.personInfo.birthDate = util.getTimeString(this.personInfo.birthDate, 'YYYY-MM-DD HH:mm:ss')
            api.user.updatePersonInfo({
              data: this.personInfo
            }).then(res => {

              if (res.status === 200) {
                this.$Message.success('更新成功!');
                this.personCenter = false;
              } else {
                this.$Message.error('更新失败!');
              }
            })
          } else {
            this.$Message.error('更新失败!');
          }
        })
      },
      updatePsdOk(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            api.user.updatePersonPsd({
              data: {
                newPassword: this.psdForm.password,
                oldPassword: this.psdForm.oldPassword
              }
            }).then(res => {
              if (res.status === 200) {
                this.$Message.success('更新成功!');
                this.psdmodify = false;
              } else {
                this.$Message.error('更新失败!');
              }
            })
          } else {
            this.$Message.error('更新失败!');
          }
        })
      },
      fetchSelectOptions(typeCode, options) {
        api.dictType.getUnderDictByCode({
          pathParams: {
            dictTypeCode: typeCode,
          }
        }).then(res => {
          res.data.content.map(item => {
            let obj = {};
            obj.value = item.dictCode;
            obj.label = item.dictName;
            options.push(obj);
          })
        })
      }
    },
    watch: {
      '$route'(to) {
        this.$store.dispatch('initBreadcrumbs', this.$route.name);
      }
    },
    mounted() {
      this.init();
      this.fetchSelectOptions('COF_GENDER', this.genderSelect); //获取性别数据的方法
      this.fetchSelectOptions('COF_CARDTYPE', this.IDtypeSelect);

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

      if (this.sso) {
        this.interval = setInterval(() => {
          try {
            http.get("/iam/inspector?display=none")
              .then((data) => {
                console.log(data)
              });
          } catch (e) {
          }
        }, 60 * 1000);
      }
    },
    destroyed() {
      clearInterval(this.interval);
    }
  }
</script>

<style lang="scss" scoped>
  .lock-screen-back {
    border-radius: 50%;
    z-index: -1;
    box-shadow: 0 0 0 0 #667aa6 inset;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 3s;
  }

  .main {
    position: absolute;
    width: 100%;
    height: 100%;
    .sidebar-menu-con {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 21;
      transition: width .3s;
    }
    &-header-con {
      box-sizing: border-box;
      position: fixed;
      display: block;
      padding-left: 200px;
      width: 100%;
      height: 60px;
      z-index: 20;
      box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
      transition: padding .3s;
    }
    &-breadcrumb {
      padding: 8px 15px 0;
    }
    &-header {
      height: 60px;
      background: #fff;
      box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
      position: relative;
      z-index: 11;
      .navicon-con {
        margin: 6px;
        display: inline-block;
        button,
        button:focus {
          box-shadow: none;
        }
      }
      .header-middle-con {
        position: absolute;
        left: 60px;
        top: 0;
        right: 340px;
        bottom: 0;
        padding: 10px;
        overflow: hidden;
      }
      .header-avator-con {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 300px;
        .user-dropdown {
          &-menu-con {
            position: absolute;
            right: 0;
            top: 0;
            width: 190px;
            height: 100%;
            .main-user-name {
              display: inline-block;
              width: 120px;
              word-break: keep-all;
              white-space: nowrap;
              vertical-align: middle;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: right;
            }
          }
          &-innercon {
            height: 100%;
            padding-right: 14px;
          }
        }
      }
    }
    .single-page-con {
      position: absolute;
      top: 60px;
      right: 0;
      bottom: 0;
      overflow: auto;
      background-color: #F0F0F0;
      z-index: 1;
      transition: left .3s;
      .single-page {
        height: 100%;
      }
    }
  }

  .logo-con {
    padding: 8px;
    text-align: center;
    color: #fff;
    font-size: 1.6em;
    div {
      height: 44px;
      line-height: 44px;
      width: auto;
    }
  }

  .hiddenIframe {
    width: 0;
    height: 0;
    border: none;
  }
</style>
