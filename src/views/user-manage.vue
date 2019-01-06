<template>
<div>
  <Headline title="用户管理" subtitle="当前系统的可访问和操作用户账号，数据来源于统一认证系统，由统一认证系统负责维护。" />
  <Card class="cardSty">
    <div style="margin-bottom: 20px;">
      <Form ref="formInline" :label-width="100" inline>
        <FormItem label="用户账号:">
          <Input type="text" placeholder="用户账号" v-model="userAccount" @on-enter="search" />
        </FormItem>
        <FormItem label="用户名称:">
          <Input type="text" placeholder="用户名称" v-model="userName" @on-enter="search" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="primary" style="margin-left: 50px" @click="reset">重置</Button>
        </FormItem>
      </Form>
      <hr style="border: .5px solid #e9eaec; margin:10px 0 30px;" />
      <Button type="primary" @click="appendNewUser">新增</Button>
      <Button type="primary" style="margin-left: 50px" @click="syncData">同步用户数据</Button>

      <Table border style="margin-top: 15px" :columns="userColumns" :data="userTable.content"></Table>
      <Row type="flex" justify="end" style="margin-top: 20px;">
        <Col>
        <Page show-sizer show-elevator show-total :page-size="this.pageSize" :total='userTable.totalElements' @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        </Col>
      </Row>
    </div>
  </Card>
  <Modal v-model="roleAssign" title="用户分配角色" width="550" @on-ok="roleAssignOk" :mask-closable="false">
    <Row style="margin-bottom:10px">

      <span style="margin-right:10px">  <strong>用户名称：</strong> {{roleAssignName}}</span>
      <span>  <strong>用户账户：</strong>   {{roleAssignAccount}}</span>


    </Row>
    <Transfer ref="transferii" :leftCheckedKeys='[]' :operations="['取消授权','授权']" :titles="['未分配角色','已分配角色']" :list-style="listStyle" :selected-keys="[301]" @on-change="handleChange" :data="roleAuthData.TransferData" :target-keys="roleAuthData.targetKeys"></Transfer>
  </Modal>
  <!-- 新增用户model ----------------------------------------- -->
  <Modal :mask-closable="false" v-model="newUser" title="新增用户" width="800">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="createFormValidate" :model="createFormValidate">
        <Row>
          <Col span="12">
          <FormItem label="用户账号:" label-position="left" :label-width="100" prop="username">
            <Input class="inputSty" placeholder="用户账号" v-model="createFormValidate.username"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="用户名称:" label-position="left" :label-width="100" prop="name">
            <Input class="inputSty" placeholder="用户名称" v-model="createFormValidate.name"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <Poptip trigger="hover" content="密码默认为000000">
            <FormItem label="登录密码:" label-position="left" :label-width="100" prop="password">
              <Input type="password" class="inputSty" placeholder="登录密码,密码默认为000000" value="000000" v-model="createFormValidate.password"> </Input>
            </FormItem>
          </Poptip>
          </Col>
          <Col span="12">
          <Poptip trigger="hover" content="密码默认为000000">
            <FormItem label="登录密码确认:" label-position="left" :label-width="100" prop="confirmPassword">
              <Input type="password" class="inputSty" placeholder="登录密码确认,密码默认为000000" value="000000" v-model="createFormValidate.confirmPassword"> </Input>
            </FormItem>
          </Poptip>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="密码失效时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="createFormValidate.passwordExpiredDate"></DatePicker>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="有效开始时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="createFormValidate.startValidDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="有效截止时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="createFormValidate.accountExpiredDate"></DatePicker>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="账号状态:" label-position="left" :label-width="100">
            <i-select v-model="createFormValidate.status" style="width: 200px">
              <Option v-for="(item,key) in accountStatus" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </i-select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="邮箱地址:" label-position="left" :label-width="100" prop="email">
            <Input type="email" class="inputSty" placeholder="邮箱地址" v-model="createFormValidate.email"> </Input>
          </FormItem>
          </Col>

        </Row>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreate">取消</Button>
      <Button type="primary" @click="newUserOk('createFormValidate')">保存</Button>
    </div>
  </Modal>
  <!-- 编辑用户model ----------------------------------------- -->
  <Modal :mask-closable="false" v-model="editUser" title="编辑用户" width="800">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="userInfo" :model="userInfo">
        <Row>

          <Col span="12">
          <FormItem label="用户名称:" label-position="left" :label-width="100" prop="name">
            <Input class="inputSty" placeholder="用户名称" v-model="userInfo.name"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="邮箱地址:" label-position="left" :label-width="100" prop="email">
            <Input type="text" class="inputSty" placeholder="邮箱地址" v-model="userInfo.email"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="密码失效时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="userInfo.passwordExpiredDate"></DatePicker>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="有效开始时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="userInfo.startValidDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="有效截止时间:" label-position="left" :label-width="100">
            <DatePicker type="datetime" placeholder="Select time" style="width: 200px" v-model="userInfo.accountExpiredDate"></DatePicker>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="账号状态:" label-position="left" :label-width="100">
            <i-select v-model="userInfo.status" style="width: 200px">
              <Option v-for="(item,key) in accountStatus" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </i-select>
          </FormItem>
          </Col>
        </Row>

      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleUpdate">取消</Button>
      <Button type="primary" @click="updateUserOk('userInfo')">保存</Button>
    </div>
  </Modal>



  <Modal :mask-closable="false" v-model="syncDataModal" width="360">
    <p slot="header" style="color:#57A3F3;text-align:center">
      <Icon type="ios-help-outline"></Icon>
      <span>确认要同步数据吗</span>
    </p>
    <div style="text-align:center">
      <p>After this task is deleted, the downstream 10 tasks will not be implemented.</p>
      <p>Will you delete it?</p>
    </div>
    <div slot="footer">
      <Button type="primary" size="large" long>确认</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import _ from 'lodash'
import Headline from '@/components/Headline'
import {
  mapActions,
  mapGetters
} from 'vuex'
import util from '@/utils/util'
import api from '@/api';

export default {
  name: "user-manage",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.createFormValidate.confirmPassword !== '') {
          // 对第二个密码框单独验证
          this.$refs.createFormValidate.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.createFormValidate.password) {
        callback(new Error('两次密码输入不一致!'));
      } else {
        callback();
      }
    };

    return {
      selectedKeys: [],
      syncDataStatus: '',
      userAccount: '',
      userName: '',
      roleAssignAccount: '',
      roleAssignName: '',
      roleAssignId: '',
      syncDataModal: false,
      createFormValidate: {
        username: '',
        name: '',
        password: '000000',
        confirmPassword: '000000',
        passwordExpiredDate: '',
        startValidDate: '',
        accountExpiredDate: '',
        status: '',
        email: ''
      },
      ruleValidate: {
        name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/,
            message: '只允许输入大小写字母、数字、下划线、中文',
            trigger: 'blur'
          }
        ],
        username: [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '只允许输入大小写字母、数字、下划线',
            trigger: 'blur'
          }
        ],
        password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }, {
            validator: validatePass,
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          }
        ],
        confirmPassword: [{
            required: true,
            message: '验证密码不能为空',
            trigger: 'blur'
          }, {
            validator: validatePassCheck,
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          }
        ],
        email: [{
            required: false,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
      },

      page: 0,
      loading: true,
      newUser: false,
      editUser: false,
      roleAssign: false,
      pageSize: 10,


      listStyle: {
        height: '400px',
        width: '200px'
      },

      userColumns: [{
          title: '用户账号',
          key: 'username',
          editable: true
        },
        {
          title: '用户名称',
          key: 'name',
          editable: true
        },
        {
          title: '用户状态',
          key: 'status',
          render: (h, params) => {
            let _this = this;
            let texts = '';
            this.accountStatus.map(item => {
              if (item.value == params.row.status) {
                texts = item.label
              }
            })
            return h('div', {
              props: {},
            }, texts)
          }
        },
        {
          title: '邮箱地址',
          key: 'email',
        },
        {
          title: '创建时间',
          key: 'createdDate',
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.getUserByUserName(params);
                    // this.show(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.deleteConfirm(params);
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.resetPsd(params);
                  }
                }
              }, '密码重置'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.roleAssignByName(params)
                  }
                }
              }, '分配角色')
            ]);
          }
        }
      ],

      accountStatus: [],
    }
  },
  methods: {
    ...mapActions([
      'getUserTable', //渲染表格
      'createNewUser', //创建用户
      'getUserInfoByUsername', //获取用户信息
      'updateUserById', //更新用户信息
      'deleteUserById', //删除用户
      'resetPsdById', //密码重置
      'getRoleAuthsByName', //获取用户角色信息
      'assignRoleAuths' //给用户分配角色
    ]),
    //改变每页显示条数
    pageSizeChange(value) {
      console.log(this.userTable)
      this.pageSize = value;
      this.getUserTable({
        name: this.userName,
        username: this.userAccount,
        page: '',
        size: this.pageSize,
        // sort:''
      })
    },
    //改变页码
    pageChange(value) {
      this.page = value - 1;
      this.getUserTable({
        name: this.userName,
        username: this.userAccount,
        page: this.page,
        size: this.pageSize,
        // sort:''
      })
    },
    // 搜索
    search() {
      this.getUserTable({
        name: this.userName,
        username: this.userAccount,
        page: '',
        size: this.pageSize,
        // sort:''
      })
    },
    //重置搜索条件
    reset() {
      this.userAccount = '';
      this.userName = '';
      this.getUserTable({
        name: '',
        username: '',
        page: '',
        size: this.pageSize,
        sort: '',
      })
    },
    appendNewUser() {
      this.$refs['createFormValidate'].resetFields()
      this.newUser = true,
        this.createFormValidate.status = this.accountStatus[1].value
    },
    //新建user
    newUserOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.createNewUser({
            username: this.createFormValidate.username,
            name: this.createFormValidate.name,
            password: this.createFormValidate.password,
            confirmPassword: this.createFormValidate.confirmPassword,
            passwordExpiredDate: util.getTimeString(this.createFormValidate.passwordExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
            startValidDate: util.getTimeString(this.createFormValidate.startValidDate, 'YYYY-MM-DD HH:mm:ss'),
            accountExpiredDate: util.getTimeString(this.createFormValidate.accountExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
            status: this.createFormValidate.status,
            email: this.createFormValidate.email
          }).then(() => {
            this.getUserTable({
              name: '',
              username: '',
              page: '',
              size: this.pageSize,
              sort: '',
            })
            this.newUser = false;
            if (this.createUserCb) {
              this.$Message.success('创建成功!');
            } else {
              this.$Message.error('创建失败!');
            }
            this.createFormValidate = {
              username: '',
              name: '',
              password: '000000',
              confirmPassword: '000000',
              passwordExpiredDate: '',
              startValidDate: '',
              accountExpiredDate: '',
              status: '',
              email: ''
            }
          });

        } else {
          this.$Message.error('创建失败!');
        }
      })
    },
    cancleCreate() {
      this.newUser = false;
      this.createFormValidate = {
        username: '',
        name: '',
        password: '000000',
        confirmPassword: '000000',
        passwordExpiredDate: '',
        startValidDate: '',
        accountExpiredDate: '',
        status: '',
        email: ''
      }
    },
    //编辑user
    getUserByUserName(params) {
      // console.log(params.row.account)
      this.$refs['userInfo'].resetFields()
      this.getUserInfoByUsername(params.row.id)
      this.editUser = true
    },
    updateUserOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.updateUserById(this.userInfo).then(() => {
            this.editUser = false;
            if (this.updateUserCb) {
              this.$Message.success('更新成功!');
            } else {
              this.$Message.error('更新失败!');
            }
            this.getUserTable({
              name: '',
              username: this.userAccount,
              page: this.page,
              size: this.pageSize,
              // sort:''
            })
          });
        } else {
          this.$Message.error('更新失败!');
        }
      })
    },
    cancleUpdate() {
      this.editUser = false;
    },
    //删除user
    deleteConfirm(params) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认要删除吗',
        // loading: true,
        onOk: () => {
          this.deleteUserById(params.row.id).then(() => {
            this.getUserTable({
              name: '',
              username: this.userAccount,
              page: this.page,
              size: this.pageSize,
              // sort:''
            })
          })
        }
      });
    },
    //密码重置
    resetPsd(params) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认要重置密码吗',
        // loading: true,
        onOk: () => {
          this.resetPsdById(params.row.id)
        }
      });
    },
    //角色分配
    roleAssignByName(params) {
      this.$refs.transferii.leftCheckedKeys = this.$refs.transferii.rightCheckedKeys = []
      this.roleAssign = true;
      this.roleAssignAccount = params.row.username;
      this.roleAssignName = params.row.name;
      this.roleAssignId = params.row.id;
      this.getRoleAuthsByName(params.row.id)
    },

    //穿梭框
    handleChange(newTargetKeys, direction, moveKeys, sourceSelectedKeys) {
      this.roleAuthData.targetKeys = newTargetKeys;
      console.log(sourceSelectedKeys)
    },
    roleAssignOk() {
      var paramsAuth = [];
      paramsAuth.push(this.roleAuthData.targetKeys, this.roleAssignId)
      // console.log(paramsAuth)
      this.assignRoleAuths(paramsAuth)
    },
    syncData() {
      api.user.getSyncdataLatest().then(res => {

        this.syncDataStatus = res.data.status
      })
      console.log(this.syncDataStatus)
      this.$Modal.confirm({
        title: '用户数据同步',
        content: '确认要同步数据吗',
        // loading: true,
        onOk: () => {
          if (this.syncDataStatus == 'starting') {
            this.$Message.warning('上一次的数据正在同步');
          } else {
            api.user.createSyncdata()
            this.$Message.success('开始同步数据')
          }
        }
      });

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
        console.log(options)
      })
    }
  },
  computed: {
    ...mapGetters([
      'userTable',
      'userInfo',
      'roleAuthData',
      'createUserCb',
      'updateUserCb'
    ])
  },
  components: {
    Headline
  },
  created() {
    this.fetchSelectOptions('COF_USERSTATUS', this.accountStatus);
    this.getUserTable({
      name: '',
      username: '',
      page: '',
      size: this.pageSize,
      sort: '',
    })

  }
}
</script>
<style lang="scss" scoped>
.cardSty {
  margin-top: 30px;
  min-height: calc(100% - 102px)
}

.childCard {
  min-height: 500px
}

.inputSty {
  width: 200px;
}
</style>
