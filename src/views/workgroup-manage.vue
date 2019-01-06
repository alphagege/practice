<template>
<div>
  <Headline title="工作组管理" subtitle="工作组是企业动态创建的组织机构分组，工作组下可以有子工作组、员工信息。" />
  <Card class="cardSty">
    <Row :gutter="16">
      <Col span="6">
      <Card class="childCard">
        <p slot="title">工作组树</p>

        <Tree :data="treeData" :load-data="loadData" :render="renderContent"></Tree>
      </Card>
      </Col>
      <Col span="18">
      <Tabs type="card" v-model="tabStatus" v-show="AssIconShow">
        <TabPane label="当前工作组" name="localGroup">
          <Card class="childCard">
            <p slot="title">工作组信息</p>
            <Button type="primary" class="saveBtn" @click="saveGroupInfo('groupInfoById')">保存</Button>
            <!-- <Button type="primary" class="resetBtn">重置</Button> -->
            <Form :rules="ruleValidate" ref="groupInfoById" :model="groupInfoById">
              <Row>
                <Col span="12">
                <FormItem label="工作组名称:" label-position="left" :label-width="100" prop="name">
                  <Input class="inputSty" v-model="groupInfoById.name"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="工作组代码:" label-position="left" :label-width="100" prop="code">
                  <Input class="inputSty" disabled v-model="groupInfoById.code"> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>

                <Col span="12">
                <FormItem label="上级工作组:" label-position="left" :label-width="100">
                  <Input v-model="groupInfoById.parentName" class="inputSty" icon="ios-search" @on-click="selectParent" readonly> </Input>

                  <!-- <Input class="inputSty" v-model="groupInfoById.parentName"> </Input> -->
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="工作组类型:" label-position="left" :label-width="100">
                  <Select v-model="groupInfoById.type" class="inputSty">
                      <Option v-for="(item,index) in orgType" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="统计排序顺序:" label-position="left" :label-width="100" prop="sortNo">
                  <Input class="inputSty" v-model="groupInfoById.sortNo"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="状态:" label-position="left" :label-width="100">
                  <Select v-model="groupInfoById.status" class="inputSty">
                      <Option v-for="(item,index) in orgStatus" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                <FormItem label="描述:" label-position="left" :label-width="100" prop="remark">
                  <Input type="textarea" class="inputSty" style="width:92%" v-model="groupInfoById.remark"> 10 </Input>
                </FormItem>

                </Col>
              </Row>
            </Form>
          </Card>

        </TabPane>
        <TabPane label="员工列表" name="employeesList">

          <Card class="childCard">
            <p slot="title">当前工作组：{{workGroupName}}</p>
            <Form ref="formInline" :label-width="100" inline>
              <FormItem label="员工名称:">
                <Input type="text" placeholder="员工名称" v-model="employeeConName" />
              </FormItem>
              <FormItem label="员工代码:">
                <Input type="text" placeholder="员工代码" v-model="employeeConCode" />
              </FormItem>
              <FormItem>
                <Button type="primary" @click="search()">搜索</Button>
                <Button type="primary" style="margin-left: 50px" v-show="AssIconShow" @click="assEmployee">关联员工</Button>
              </FormItem>
            </Form>

            <Table border :columns="employeesColumn" :data="employeeListById"></Table>
            <Row type="flex" justify="end" style="margin-top: 20px;">
              <Col>
              <Page transfer show-sizer show-elevator show-total :total='employeeListById.totalElements' :page-size="this.pageSize" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
              </Col>
            </Row>
          </Card>

        </TabPane>

      </Tabs>
      <Card class="childCard" v-show="!AssIconShow">
        <p>
          请点击菜单树选择工作组
        </p>

      </Card>
      </Col>
      </Col>
    </Row>
  </Card>
  <!-- 新建工作组 -->
  <Modal :mask-closable="false" v-model="newWorkGroup" title="新增工作组" width="800">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="createWorkGroupValidate" :model="createWorkGroupValidate">
        <Row>
          <Col span="12">

          <FormItem label="工作组名称:" label-position="left" :label-width="100" prop="name">
            <Input placeholder="工作组名称" v-model="createWorkGroupValidate.name" style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="工作组代码:" label-position="left" :label-width="100" prop="code">
            <Input placeholder="工作组代码" v-model="createWorkGroupValidate.code" style="width:200px"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="上级工作组:" label-position="left" :label-width="100">
            <Input placeholder="上级工作组" disabled v-model="groupInfoById.name" readonly style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="工作组类型:" label-position="left" :label-width="100">
            <Select v-model="createWorkGroupValidate.type" class="inputSty" style="width:200px">
              <Option v-for="(item,index) in orgType" :value="item.value" :key="index">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="统计排序顺序:" label-position="left" :label-width="100" prop="sortNo">
            <Input placeholder="统计排序顺序" type="text" v-model="createWorkGroupValidate.sortNo" style="width:200px" number> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="状态:" label-position="left" :label-width="100">
            <Select v-model="createWorkGroupValidate.status" class="inputSty" style="width:200px">
              <Option v-for="(item,index) in orgStatus" :value="item.value" :key="index">{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="24">
          <FormItem label="描述:" label-position="left" :label-width="100" prop="remark">
            <Input type="textarea" style="width:550px" v-model="createWorkGroupValidate.remark"> 10 </Input>
          </FormItem>
          </Col>

        </Row>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreatGroup">取消</Button>
      <Button type="primary" @click="createGroupOk('createWorkGroupValidate')">保存</Button>
    </div>
  </Modal>


  <!-- 关联员工 -->
  <Modal :mask-closable="false" v-model="newEmployee" title="关联员工" width="800">
    <div style="padding:10px 20px;">
      <Card>

        <Form ref="formInline" :label-width="100" inline>
          <FormItem label="员工姓名:">
            <Input type="text" placeholder="员工名称" v-model="employeeName" style="width:120px" />
          </FormItem>
          <FormItem label="员工代码:">
            <Input type="text" placeholder="员工代码" v-model="employeeCode" style="width:120px" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search1()">搜索</Button>
          </FormItem>
        </Form>

        <Table highlight-row ref="AssEmployeesColumn" border :columns="AssEmployeesColumn" :data="employeeInfoList.content" @on-selection-change="selectEmployee"></Table>
        <Row type="flex" justify="end" style="margin-top: 20px;">
          <Col>
          <Page show-sizer show-elevator show-total :total='employeeInfoList.totalElements' :page-size="this.pageSize1" @on-page-size-change="pageSizeChange1" @on-change="pageChange1"></Page>
          </Col>
        </Row>
      </Card>
    </div>
    <div slot="footer">
      <Button type="text" @click="newEmployee=false">取消</Button>
      <Button type="primary" @click="submit()">提交</Button>

    </div>
  </Modal>

  <!-- 关联上级工作组 -->
  <Modal :mask-closable="false" v-model="parentGroup" title="请点击选择工作组" @on-cancle="selectGroupCancle">
    <div style="padding:10px 20px;">
      <h4>您已选择工作组 ：{{selectGroup}}</h4>
      <Tree :data="treeData1" :load-data="loadData" @on-select-change="treeSelectGroup"></Tree>
    </div>
    <div slot="footer">
      <Button type="text" @click="selectGroupCancle">取消</Button>
      <Button type="primary" @click="selectGroupOk">保存</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import Headline from '@/components/Headline';
import {
  mapActions,
  mapGetters
} from 'vuex';
import api from '@/api';
import util from '@/utils/util'


export default {
  name: "workgroup-manage",
  components: {
    Headline
  },
  data() {
    return {
      selectGroup: '',
      selectGroupItem: {},
      parentGroup: false,
      employeeConName: '',
      employeeConCode: '',
      buttonProps: {
        type: 'ghost',
        size: 'small',
      },
      createWorkGroupValidate: {
        name: '',
        code: '',
        parentId: this.nodeId,

        remark: '',
        sortNo: '',
        status: '',
        type: ''
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
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: '只允许输入大小写字母、数字、下划线、中文',
            trigger: 'blur'
          }
        ],
        code: [{
            required: true,
            message: '代码不能为空',
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
        sortNo: [{
            type: 'number',
            message: '请输入数字',
            required: false,
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          },
          {
            type: 'number',
            max: 99999,
            min: 0,
            message: '请输入0~99999之间的数字',
            trigger: 'blur'
          }
        ],
        remark: [{
          type: 'string',
          max: 200,
          message: '最大不能超过200字符',
          trigger: 'blur'
        }]
      },
      tabStatus: 'localGroup',
      workgroupType: '',
      newWorkGroup: false,
      loading: false,
      collapseParam: '1',

      nodeId: '',
      workGroupName: '',
      appendNode: {},
      assSelect: '',
      nodeClass: '',
      newEmployee: false,
      psdInvalidTime: new Date(),
      psdValidTime: new Date(),
      psdDeadLine: new Date(),
      submitIds: [],
      page: 0,
      pageSize: 10,
      pageSize1: 10,
      employeeName: '',
      employeeCode: '',
      vertical: 'exist',
      employeesColumn: [{
          title: '员工姓名',
          key: 'name',
        },
        {
          title: '员工代码',
          key: 'code',

        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let _this = this;
            let texts = '';
            this.employeeStatus.map(item => {
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
          title: '公司邮箱',
          key: 'email',

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
      // selection:[],
      AssEmployeesColumn: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '员工姓名',
          key: 'name',
        },
        {
          title: '员工代码',
          key: 'code',
        }
      ],
      AssIconShow: false,
      AssEmployeesData: [],
      orgStatus: [],
      orgType: [],
      employeeType: [],
      employeeStatus: [],
      loading1: false,
      options1: [],
      asyncItem: {},
    };
  },
  methods: {
    ...mapActions([
      'getWorkGroupTree', //渲染字典类型列表
      'getWorkGroupInfo', //获取节点信息
      'updateGroupInfo', //保存节点信息
      'createNewWorkGroup', //创建工作组
      'getEmployeesListById',
      'getAssEmployeeAccount',
      'getEmployeeListQuery',
      'getUnAssEmployeeList'
    ]),

    loadData(item, callback) {
      setTimeout(() => {
        var childNode = []
        api.org.getChildWorkGroupById({
          pathParams: {
            id: item.id
          }
        }).then(res => {

          res.data.map(item => {
            let obj = {};
            obj.title = item.name;
            if (!item.leaf) obj.loading = false;
            obj.id = item.id;
            obj.children = [];
            childNode.push(obj);
          })
          callback(childNode)
        })
      }, 500)
    },
    selectParent() {
      this.parentGroup = true;
      this.selectOrg = this.groupInfoById.parentName
    },
    selectGroupCancle() {
      this.selectGroupItem = {};
      this.parentGroup = false
    },
    treeSelectGroup(data) {
      this.selectGroupItem = Object.assign({}, data[0]);
      console.log(this.selectGroupItem)
      this.selectGroup = this.selectGroupItem.title
    },
    selectGroupOk() {

      if (JSON.stringify(this.selectGroupItem) == "{}") {
        this.$Message.error('请选择节点！')
      } else if (this.groupInfoById.id == this.selectGroupItem.parentId) {
        this.$Message.error('不能移动至自己的子节点下，请重新选择！')
      } else {
        if (this.groupInfoById.id == this.selectGroupItem.id) {
          this.$Message.error('不能将机构移动到自身节点下')
          return
        } else {
          this.groupInfoById.parentName = this.selectGroupItem.title
          this.groupInfoById.parentId = this.selectGroupItem.id
          this.parentGroup = false
        }
      }
    },
    treeSelect(data) {
      this.AssIconShow = true
      this.nodeId = data.id

      this.$refs.groupInfoById.resetFields();
      this.getWorkGroupInfo(data)

      this.workGroupName = data.title
      this.getEmployeesListById({
        id: data.id,
        employeeName: '',
        employeeCode: '',
        page: '',
        pageSize: this.pageSize,
        sort: ''
      })

    },
    saveGroupInfo(name) {

      this.$refs[name].validate((valid) => {
        if (valid) {
          this.groupInfoById.sortNo = parseInt(this.groupInfoById.sortNo)
          api.org.updateWorkGroupById({
            pathParams: {
              id: this.groupInfoById.id
            },
            data: {
              code: this.groupInfoById.code,
              name: this.groupInfoById.name,
              parentId: this.groupInfoById.parentId,
              remark: this.groupInfoById.remark,
              sortNo: this.groupInfoById.sortNo,
              status: this.groupInfoById.status,
              type: this.groupInfoById.type
            }
          }).then(res => {
            if (res.status == 200) {
              this.newWorkGroup = false;
              this.$Message.success('更新成功!');
            } else {
              this.$Message.warning('更新失败!');
            }
            this.getWorkGroupTree()
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        } else {
          this.$Message.warning('更新失败!');
        }
      })
    },

    renderContent(h, {
      root,
      node,
      data
    }) {
      return h('span', {
        attrs: {
          class: 'moveon'
        },
        style: {
          display: 'inline-block',
          width: '100%',
          cursor: 'pointer',

        },
        on: {
          click: () => {
            this.treeSelect(data)
          }
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px',

            }
          }),
          h('span', {
            style: {
              display: 'inline-block',
              borderRadius: '2px'
            },

            class: ['mouse'],
            on: {
              click: (event) => {

                let otherNode = document.querySelectorAll('.mouse');
                for (var i = 0; i < otherNode.length; i++) {
                  otherNode[i].className = "mouse"
                }
                event.target.className += ' mouseClick'

              },
            }
          }, data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px',

          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-plus-empty',
              size: "small"
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => {
                this.append(data)
                this.asyncItem = data
              }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-minus-empty',
              size: "small"
            }),

            on: {
              click: () => {
                this.remove(root, node, data)
              }
            }
          })
        ])
      ]);
    },

    append(node) {
      this.$refs.createWorkGroupValidate.resetFields();

      this.createWorkGroupValidate.status = this.orgStatus[0].value
      this.newWorkGroup = true;
      this.createWorkGroupValidate.parentId = this.nodeId = node.id;
      Object.assign(this.appendNode, node)
    },
    createGroupOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.org.createWorkGroupList({
            data: this.createWorkGroupValidate
          }).then(res => {
            if (res.status == 200) {
              // console.log(this.treeData)
              this.newWorkGroup = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            // console.log(this.createWorkGroupValidate)
            //  this.$options.methods.loadData(this.appendNode,callback)
            this.getWorkGroupTree()

            this.createWorkGroupValidate = {
              name: '',
              code: '',
              parentId: this.nodeId,
              remark: '',
              sortNo: '',
              status: '',
              type: ''
            }
          })
        } else {
          this.$Message.warning('创建失败!');
        }
      })
    },
    cancleCreatGroup() {
      this.newWorkGroup = false;
      this.createWorkGroupValidate = {
        name: '',
        code: '',
        parentId: this.nodeId,
        remark: '',
        sortNo: '',
        status: '',
        type: ''
      }
    },
    remove(root, node, data) {
      // console.log(node.node.id)
      if(node.node.loading==false){
        this.$Message.warning('不能删除含有子节点的节点!');
        return false
      }
      this.$Modal.confirm({
        title: '警告',
        content: '确认要删除吗',
        // loading: true,
        onOk: () => {
          api.org.deleteWorkGroupById({
            pathParams: {
              id: node.node.id
            }
          }).then(res => {
            if (res.status == 200) {
              this.newWorkGroup = false;
              this.$Message.success('删除成功!');
            } else {
              this.$Message.warning('删除失败!');
            };
            this.getWorkGroupTree();
            this.AssIconShow = false
          })
        }
      });

    },
    search() {
      this.getEmployeesListById({
        id: this.nodeId,
        employeeName: this.employeeConName,
        employeeCode: this.employeeConCode,
        page: '',
        pageSize: this.pageSize,
        sort: ''
      })
    },
    //改变每页显示条数
    pageSizeChange(value) {
      this.pageSize = value;

      this.getEmployeesListById({
        employeeName: this.employeeConName,
        employeeCode: this.employeeConCode,
        id: this.nodeId,
        page: '',
        pageSize: this.pageSize,
        sort: ''
      })
    },
    //改变页码
    pageChange(value) {
      this.getEmployeesListById({
        employeeName: this.employeeConName,
        employeeCode: this.employeeConCode,
        id: this.nodeId,
        page: value - 1,
        pageSize: this.pageSize,
        sort: ''
      })
    },

    //关联员工
    assEmployee() {
      this.newEmployee = true;
      this.getUnAssEmployeeList({
        id: this.nodeId,
        employeeName: '',
        employeeCode: '',
        page: '',
        size: this.pageSize,
        sort: ''
      })

    },
    pageSizeChange1(value) {
      this.pageSize = value;
      this.getUnAssEmployeeList({
        id: this.nodeId,
        employeeName: '',
        employeeCode: '',
        page: '',
        size: this.pageSize,
        sort: ''
      })

    },
    //改变页码
    pageChange1(value) {

      this.getUnAssEmployeeList({
        id: this.nodeId,
        employeeName: '',
        employeeCode: '',
        page: value - 1,
        size: this.pageSize,
        sort: ''
      })
    },

    search1() {
      this.getUnAssEmployeeList({
        id: this.nodeId,
        employeeName: this.employeeName,
        employeeCode: this.employeeCode,
        page: '',
        size: this.pageSize,
        sort: ''
      })
    },
    selectEmployee(selection) {
      this.submitIds = []
      selection.map(item => {
        this.submitIds.push(item.id)
      })
    },
    submit() {
      console.log(this.submitIds)
      api.org.createEmployeesInWorkGroup({

        pathParams: {
          id: this.nodeId
        },
        data: this.submitIds
      }).then(res => {
        if (res.status == 200) {
          this.newEmployee = false;
          this.$Message.success('关联成功!');
        } else {
          this.$Message.warning('关联失败!');
        }
        this.getEmployeesListById({
          id: this.nodeId,
          employeeName: '',
          employeeCode: '',
          page: '',
          pageSize: this.pageSize,
          sort: ''
        })
      })
    },
    deleteConfirm(params) {

      this.$Modal.confirm({
        title: '警告',
        content: '确认要删除吗',

        onOk: () => {
          api.org.deleteAssociatedEmployee({
            pathParams: {
              id: this.nodeId
            },
            queryParams: {
              employeeIds: params.row.id
            }
          }).then(res => {
            this.getEmployeesListById({
              id: this.nodeId,
              employeeName: this.employeeConName,
              employeeCode: this.employeeConCode,
              page: '',
              pageSize: this.pageSize,
              sort: ''
            })
            if (res.status == 200) {
              this.newWorkGroup = false;
              this.$Message.success('删除成功!');
            } else {
              this.$Message.warning('删除失败!');
            }
          })
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
      })
    }
  },
  computed: {
    ...mapGetters([
      'groupListTree',
      'groupInfoById',
      'employeeListById',
      'assAccountList',
      'employeeInfoList',

    ]),
    treeData() {
      return [{
        title: '工作组树',
        expand: true,
        render: (h, {
          root,
          node,
          data
        }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%',

            }
          }, [
            h('span', [
              h('Icon', {
                props: {
                  type: 'ios-folder-outline'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.title)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-plus-empty',
                  type: 'primary'
                }),
                style: {
                  width: '52px'
                },
                on: {
                  click: () => {
                    this.append(data)

                    this.groupInfoById.name = ''
                  }
                }
              })
            ])
          ]);
        },
        children: this.groupListTree || []
      }]
    },
    treeData1() {
      return [{
        title: '工作组树',
        expand: true,
        render: (h, {
          root,
          node,
          data
        }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', [
              h('Icon', {

                style: {
                  marginRight: '8px'

                }
              }),
              h('span', data.title)
            ])
          ]);
        },
        children: this.groupListTree || []
      }]
    }
  },
  mounted() {
    this.getWorkGroupTree()

    this.fetchSelectOptions('COF_ORGTYPE', this.orgType);
    this.fetchSelectOptions('COF_ORGSTATUS', this.orgStatus);
    this.fetchSelectOptions('COF_USERSTATUS', this.employeeType)
    this.fetchSelectOptions('COF_EMPSTATUS', this.employeeStatus)
  }
};
</script>
<style lang="scss">
.saveBtn {
  position: absolute;
  right: 20%;
  top: 10px
}

.resetBtn {
  position: absolute;
  right: 10%;
  top: 10px
}

.inputSty {
  width: 80%
}

.cardSty {
  margin-top: 30px;
  min-height: calc(100% - 102px)
}

.childCard {
  min-height: 500px
}

.mouse:hover {
  background: #EAF4FE
}

.mouseClick {
  background: #D5E8FC
}
</style>
