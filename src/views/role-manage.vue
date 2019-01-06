<template>
<div>
  <Headline title="角色管理" subtitle="当前系统的用户角色，可以为用户分配相应的角色并进行权限控制。" />
  <Card class="cardSty">
    <div style="margin-bottom: 20px;">
      <Form ref="formInline" :label-width="100" inline>
        <FormItem label="角色名称:" prop="code">
          <Input type="text" placeholder="角色名称" v-model="roleName" />
        </FormItem>
        <FormItem label="角色代码:" prop="name">
          <Input type="text" placeholder="角色代码" v-model="roleCode" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search()">搜索</Button>
          <Button type="primary" style="margin-left: 50px" @click="reset()">重置</Button>
          <Button type="primary" style="margin-left: 50px" @click="createNewRole">新增</Button>
        </FormItem>
      </Form>
      <hr style="border: .5px solid #e9eaec; margin:10px 0 30px;" />
      <Table border :columns="roleColumns" :data="roleTableInfo.content"></Table>
      <Row type="flex" justify="end" style="margin-top: 20px;">
        <Col>
        <Page show-sizer show-elevator show-total :page-size="this.pageSize" :total='roleTableInfo.totalElements' @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        </Col>
      </Row>
    </div>
  </Card>

  <!-- 新增角色Modal -->
  <Modal :mask-closable="false" v-model="newRole" title="新增角色">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="createFormValidate" :model="createFormValidate">
        <FormItem label="角色名称:" prop="roleName">
          <Input type="text" style="width:300px" placeholder="角色名称" v-model="createFormValidate.roleName" />
        </FormItem>
        <FormItem label="角色代码:" prop="roleCode">
          <Input type="text" style="width:300px" placeholder="角色代码" v-model="createFormValidate.roleCode" />
        </FormItem>
        <FormItem label="角色描述:" prop="description">
          <Input type="textarea" placeholder="角色描述" :rows="4" style="width: 300px;" v-model="createFormValidate.description" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreate">取消</Button>
      <Button type="primary" @click="newRoleOk('createFormValidate')">保存</Button>
    </div>

  </Modal>

  <!-- 编辑角色Modal -->
  <Modal :mask-closable="false" v-model="updateRole" title="编辑角色">
    <div style="padding:10px 20px;">
      <Form ref="roleInfoById" :rules="ruleValidate" :model="roleInfoById" :label-width="100" inline>
        <FormItem label="角色名称:" prop="roleName">
          <Input type="text" style="width:300px" placeholder="角色名称" v-model="roleInfoById.roleName" />
        </FormItem>
        <FormItem label="角色代码:" prop="roleCode">
          <Input type="text" style="width:300px" readonly placeholder="角色代码" v-model="roleInfoById.roleCode" />
        </FormItem>
        <FormItem label="角色描述:" prop="description">
          <Input type="textarea" placeholder="角色描述" :rows="4" style="width: 300px;" v-model="roleInfoById.description" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleUpdate('roleInfoById')">取消</Button>
      <Button type="primary" @click="updateOk('roleInfoById')">保存</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import Headline from '@/components/Headline';
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: "role-manage",
  data() {
    return {
      roleName: '',
      roleCode: '',
      createFormValidate: {
        roleName: '',
        roleCode: '',
        description: ''
      },
      ruleValidate: {
        roleName: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          },
          
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '只允许输入大小写字母、数字、下划线、中文',
            trigger: 'blur'
          }
        ],
        roleCode: [{
            required: true,
            message: '角色代码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 30,
            message: '最大不能超过30字符',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '只允许输入大小写字母、数字、下划线',
            trigger: 'blur'
          }
        ],
        description: [{
          type: 'string',
          max: 200,
          message: '最大不能超过200字符',
          trigger: 'blur'
        }]
      },

      newRoleDes: '',
      loading: true,

      pageSize: 10,
      page: 0,

      newRole: false,
      updateRole: false,

      roleColumns: [{
          title: '角色名称',
          key: 'roleName',
          editable: true
        },
        {
          title: '角色代码',
          key: 'roleCode',
          editable: true
        },
        {
          title: '创建时间',
          key: 'createdDate'
        },
        {
          title: '角色描述',
          key: 'description',
          editable: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
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
                    this.getRoleByid(params);
                    // this.show(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteConfirm(params);
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
    }
  },
  methods: {
    ...mapActions([
      'getRoleTable', //渲染角色Table
      'createRole', //创建角色
      'getRoleById',
      'updateRoleById', //更新角色信息
      'deleteRoleByid' //删除
    ]),
    //改变每页显示条数
    pageSizeChange(value) {
      this.pageSize = value;
      this.getRoleTable({
        roleCode: this.roleCode,
        roleName: this.roleName,
        page: '',
        size: this.pageSize,
        // sort:''
      })
    },
    //改变页码
    pageChange(value) {
      this.getRoleTable({
        roleCode: this.roleCode,
        roleName: this.roleName,
        page: value - 1,
        size: this.pageSize,
        // sort:''
      })
    },
    //搜索
    search() {
      this.getRoleTable({
        roleCode: this.roleCode,
        roleName: this.roleName,
        page: '',
        size: this.pageSize,
        // sort:''
      })
    },
    //重置搜索条件
    reset() {
      this.roleCode = '';
      this.roleName = '';
      this.getRoleTable({
        roleCode: '',
        roleName: '',
        page: '',
        size: this.pageSize,
        sort: ''
      })
    },
    createNewRole() {
      this.newRole = true;
      this.$refs['createFormValidate'].resetFields()
    },
    newRoleOk(name) {
     
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.createRole({
            roleName: this.createFormValidate.roleName,
            roleCode: this.createFormValidate.roleCode,
            description: this.createFormValidate.description
          }).then(() => {
            this.getRoleTable({
              roleCode: '',
              roleName: '',
              page: 0,
              size: this.pageSize,
              sort: ''
            })
            this.newRole = false;
            if (this.createCb) {
              this.$Message.success('创建成功!');
            } else {
              this.$Message.error('创建失败!');
            }
            this.createFormValidate = {
              roleName: '',
              roleCode: '',
              description: ''
            }
          })

        } else {
          this.$Message.error('创建失败!');
        }
      })
    },

    cancleCreate() {
      this.newRole = false
      this.createFormValidate = {
        roleName: '',
        roleCode: '',
        description: ''
      }
    },
    //编辑获取role信息
    getRoleByid(params) {
      this.$refs['roleInfoById'].resetFields()
      this.updateRole = true;
      this.getRoleById(params.row.id);
    },

    //编辑完成提交
    updateOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.updateRoleById(this.roleInfoById).then(() => {
            this.updateRole = false;
            this.getRoleTable({
              roleCode: this.roleCode,
              roleName: this.roleName,
              page: '',
              size: this.pageSize,
              sort: ''
            })
            if (this.updateCb) {
              this.$Message.success('编辑成功!');
            } else {
              this.$Message.error('编辑失败!');
            }
            this.updateRole = false;
          })


        } else {
          this.$Message.error('编辑失败!');
        }
      })
    },
    cancleUpdate(name) {
       
      this.updateRole = false
    },
    deleteConfirm(params) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认要删除吗',
        // loading: true,
        onOk: () => {
          // this.updateRole = false;
          this.deleteRoleByid(params.row.id).then(() => {
            this.getRoleTable({
              roleCode: this.roleCode,
              roleName: this.roleName,
              page: '',
              size: this.pageSize,
              sort: ''
            })
          });
        }
      });
    }
  },



  components: {
    Headline
  },
  computed: {
    ...mapGetters([
      'roleTableInfo',
      'createCb',
      'roleInfoById',
      'updateCb'
    ])
  },
  created() {
    this.getRoleTable({
      roleCode: '',
      roleName: '',
      page: '',
      size: this.pageSize,
      sort: ''
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
</style>
