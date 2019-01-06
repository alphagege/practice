<template>
<div>
  <Headline title="业务字典" subtitle="字典指业务化的枚举类型数据项列表。如：男、女；年、月、日等，多用于页面端下拉选择数据显示或结果页的数据显示。" />
  <Card class="cardSty">
    <Row :gutter="16">
      <Col span="12">
      <Card class="childCard">
        <p slot="title">字典类型</p>
        <Form ref="formInline" :label-width="70" inline>
          <FormItem label="类型名称:" style="margin-bottom: 10px;">
            <Input type="text" placeholder="类型名称" v-model="typeName" />
          </FormItem>
          <FormItem label="类型代码:" style="margin-bottom: 10px;">
            <Input type="text" placeholder="类型代码" v-model="typeCode" />
          </FormItem>
          <FormItem style="margin-bottom: 10px; display: inline-block;">
            <Button type="primary" @click="search" style="margin-right: 10px;">搜索</Button>
            <Button type="primary" style="margin-left: 0" @click="reset">重置</Button>
          </FormItem>
        </Form>
        <hr style="border: .5px solid #e9eaec; margin:10px 0 10px;" />
        <div style="display: flex; height: 37px; margin-bottom: 5px;">
          <Button type="primary" style="margin:0 0 5px 10px" @click="createNewType">新增</Button>
          <Button type="primary" style="margin:0 0 5px 10px" @click="createNewTypeChlid">新增子类型</Button>
          <Button type="primary" style="margin:0 0 5px 10px" @click="deleteDictTypes">批量删除</Button>
          <a class="exportBtn" href='/ordermgr/dicts/export' style="margin:0 0 5px 10px">导出</a>
          <Button type="primary" style="margin:0px 0px 5px 10px; display: inline-block;" icon="ios-cloud-upload-outline" @click="importModal=true">导入</Button>
          <!-- </Upload> -->
        </div>
        <!-- <Table highlight-row border ref="selection" :columns="column1List" :data="dictTypeList" @on-select="selectOption"></Table> -->
        <tree-grid :items='dictTypeList.content' :columns='column1List' @on-row-click='rowClick' @on-selection-change='selectionClick' @on-tr-click="trClick" :load-data="loadData"></tree-grid>

        <Row type="flex" justify="end" style="margin-top: 20px;">
          <Col>
          <Page :total="dictTypeList.totalElements" :page-size="this.pageSize" @on-page-size-change="pageSizeChange" @on-change="pageChange" show-sizer show-elevator show-total></Page>
          </Col>
        </Row>
      </Card>
      </Col>
      <Col span="12">
      <Card class="childCard">
        <p slot="title">字典数据项</p>

        <Button type="primary" style="margin:0 0 5px 10px" @click="createNewDict">新增</Button>
        <Button type="primary" style="margin:0 0 5px 10px" @click="createNewChlid">新增子项</Button>
        <Button type="primary" style="margin:0 0 5px 10px" @click="deleteDictTypes1">批量删除</Button>
        <!-- <Table border ref="selection" :columns="column2List"></Table> -->
        <tree-grid :items='dictUnderTypeList.content' :columns='column2List' @on-row-click='rowClick1' @on-selection-change='selectionClick1' :load-data="loadDictData"></tree-grid>
        <Row type="flex" justify="end" style="margin-top: 20px;">
          <Col>
          <Page :total="dictUnderTypeList.totalElements" :page-size="this.pageSize1" @on-page-size-change="pageSizeChange1" @on-change="pageChange1" show-sizer show-elevator show-total></Page>
          </Col>
        </Row>
      </Card>
      </Col>
    </Row>
  </Card>
  <!-- 导入 -->
  <Modal :mask-closable="false" v-model="importModal" title="导入" footer-hide>
    <div style="padding:10px 20px;">
       <!-- <Upload action="/coframe/dicts/import" style="margin:0px 0px 5px 10px; display: inline-block;" :format="['xls']" accept="application/vnd.ms-excel" :on-error="uploadError" :on-format-error="handleFormatError" :on-success="uploadSuccess"> -->
            <!-- <Button type="primary" icon="ios-cloud-upload-outline">导入</Button>
           </Upload> -->
           <Upload
            multiple
            type="drag"
            :format="['xls']"
            accept="application/vnd.ms-excel"
            :on-error="uploadError"
            :on-format-error="handleFormatError"
            :on-success="uploadSuccess"
            action='/ordermgr/dicts/import'>
            <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或者拖拽上传</p>
        </div>

    </Upload>
    </div>

  </Modal>
  <!-- 新增字典类型 -->
  <Modal :mask-closable="false" v-model="newDictType" title="新增字典类型">
    <div style="padding:10px 20px;">
      <Form :label-width="110" inline :rules="ruleValidate" ref="createDictTypeFormValidate" :model="createDictTypeFormValidate">
        <FormItem label="类型代码:" prop="dictTypeCode">
          <Input type="text" style="width:300px" placeholder="类型代码" v-model="createDictTypeFormValidate.dictTypeCode" />
        </FormItem>
        <FormItem label="类型名称:" prop="dictTypeName">
          <Input type="text" placeholder="类型名称" :rows="4" style="width: 300px;" v-model="createDictTypeFormValidate.dictTypeName" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreateType">取消</Button>
      <Button type="primary" @click="newDictTypeOk('createDictTypeFormValidate')">保存</Button>
    </div>
  </Modal>

  <!-- 编辑字典类型 -->
  <Modal :mask-closable="false" v-model="updateDictType" title="编辑字典类型">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="dictTypeById" :model="dictTypeById" >
        <FormItem label="类型代码:" prop="dictTypeCode">
          <Input type="text" style="width:300px" placeholder="类型代码" v-model="dictTypeById.dictTypeCode" disabled/>
        </FormItem>
        <FormItem label="类型名称:" prop="dictTypeName">
          <Input type="text" placeholder="类型名称" :rows="4" style="width: 300px;" v-model="dictTypeById.dictTypeName" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="updateDictType=false">取消</Button>
      <Button type="primary" @click="updateDictTypeOk('dictTypeById')">保存</Button>
    </div>
  </Modal>
  <!-- 新增子类型 -->
  <Modal :mask-closable="false" v-model="newDictTypeChild" title="新增子类型">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="createTypeChildValidate" :model="createTypeChildValidate">
        <FormItem label="上级类型代码:">
          <Input type="text" style="width:300px" readonly placeholder="上级类型代码" v-model="createTypeChildValidate.parentCode"  disabled />
        </FormItem>
        <FormItem label="类型代码:" prop="dictTypeCode">
          <Input type="text" style="width:300px" placeholder="类型代码" v-model="createTypeChildValidate.dictTypeCode" />
        </FormItem>
        <FormItem label="类型名称:" prop="dictTypeName">
          <Input type="text" placeholder="类型名称" :rows="4" style="width: 300px;" v-model="createTypeChildValidate.dictTypeName" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="canclecreatTypeChild">取消</Button>
      <Button type="primary" @click="creatTypeChildOk('createTypeChildValidate')">保存</Button>
    </div>
  </Modal>

  <!-- 新增字典数据-->
  <Modal :mask-closable="false" v-model="newDict" title="新增字典项">
    <div style="padding:10px 20px;">
      <Form :label-width="110" inline :rules="ruleValidate" ref="createDictFormValidate" :model="createDictFormValidate">

        <FormItem label="类型代码:">
          <Input type="text" style="width:300px" placeholder="类型代码" readonly v-model="dictUnderTypeList.dictTypeCode" />
        </FormItem>
        <FormItem label="字典项代码:" prop="dictCode">
          <Input type="text" placeholder="字典项代码" :rows="4" style="width: 300px;" v-model="createDictFormValidate.dictCode" />
        </FormItem>
        <FormItem label="字典项名称:" prop="dictName">
          <Input type="text" placeholder="字典项名称" :rows="4" style="width: 300px;" v-model="createDictFormValidate.dictName" />
        </FormItem>
        <FormItem label="排序:" prop="sortNo">
          <Input type="text" placeholder="排序" :rows="4" style="width: 300px;" v-model="createDictFormValidate.sortNo" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreateDict">取消</Button>
      <Button type="primary" @click="newDictOk('createDictFormValidate')">保存</Button>
    </div>
  </Modal>

  <!-- 编辑字典数据-->
  <Modal :mask-closable="false" v-model="updateDict" title="编辑字典项">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="dictInfoById" :model="dictInfoById">

        <FormItem label="类型代码:">
          <Input type="text" style="width:300px" placeholder="类型代码" v-model="dictInfoById.dictTypeCode" disabled/>
        </FormItem>
        <FormItem label="字典项代码:" prop="dictCode">
          <Input type="text" placeholder="字典项代码" :rows="4" style="width: 300px;" v-model="dictInfoById.dictCode" disabled/>
        </FormItem>
        <FormItem label="字典项名称:" prop="dictName">
          <Input type="text" placeholder="字典项名称" :rows="4" style="width: 300px;" v-model="dictInfoById.dictName" />
        </FormItem>
        <FormItem label="排序:" prop="sortNo">
          <Input type="text" placeholder="排序" :rows="4" style="width: 300px;" v-model="dictInfoById.sortNo" />
        </FormItem>

      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleUpdateDict">取消</Button>
      <Button type="primary" @click="updateDictOk('dictInfoById')">保存</Button>
    </div>
  </Modal>

  <!-- 新增字典子项 -->
  <Modal :mask-closable="false" v-model="newDictChild" title="新增字典子项">
    <div style="padding:10px 20px;">
      <Form :label-width="110" inline :rules="ruleValidate" ref="createDictChildFormValidate" :model="createDictChildFormValidate">

        <FormItem label="类型代码:">
          <Input type="text" style="width:300px" placeholder="类型代码" readonly v-model="dictUnderTypeList.dictTypeCode" />
        </FormItem>
        <FormItem label="上级字典项代码:">
          <Input type="text" style="width:300px" placeholder="上级字典项代码" readonly v-model="createDictChildFormValidate.parentCode" />
        </FormItem>
        <FormItem label="字典项代码:" prop="dictCode">
          <Input type="text" placeholder="字典项代码" :rows="4" style="width: 300px;" v-model="createDictChildFormValidate.dictCode" />
        </FormItem>
        <FormItem label="字典项名称:" prop="dictName">
          <Input type="text" placeholder="字典项名称" :rows="4" style="width: 300px;" v-model="createDictChildFormValidate.dictName" />
        </FormItem>
        <FormItem label="排序:" prop="sortNo">
          <Input type="text" placeholder="排序" :rows="4" style="width: 300px;" v-model="createDictChildFormValidate.sortNo" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreateDictChlid">取消</Button>
      <Button type="primary" @click="newDictChildOk('createDictChildFormValidate')">保存</Button>
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
import treeGrid from '@/components/treegrid'
import api from '@/api';
import util from '@/utils/util'

export default {
  name: "dict-manage",
  data() {
    return {
      importModal: false,
      pageSize: 10,
      pageSize1: 10,
      newDictType: false,
      updateDictType: false,
      newDictTypeChild: false,
      updateDict: false,
      newDict: false,
      newDictChild: false,
      loading: true,
      page: 0,
      page1: 0,
      createDictTypeFormValidate: {
        dictTypeCode: '',
        dictTypeName: '',
      },
      createTypeChildValidate: {
        parentCode: '',
        dictTypeCode: '',
        dictTypeName: '',
      },
      createDictFormValidate: {
        dictCode: '',
        dictName: '',
        sortNo: ''
      },
      createDictChildFormValidate: {
        parentCode: '',
        dictCode: '',
        dictName: '',
        sortNo: ''
      },
      ruleValidate: {
        dictTypeCode: [{
            required: true,
            message: '字典类型名称不能为空',
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
        dictTypeName: [{
            required: true,
            message: '字典类型名称不能为空',
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
        dictCode: [{
            required: true,
            message: '字典项代码不能为空',
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
        dictName: [{
            required: true,
            message: '字典项名称不能为空',
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
        sortNo: [{
          type: 'number',
          message: '请填入数字',
          trigger: 'blur',
          transform(value) {
            return Number(value)
          }
        }],


      },

      newDictDataParentCode: '',
      newDictDataCode: '',
      newDictDataCode: '',
      newDictDataName: '',
      newDictDataSort: '',

      typeName: '',
      typeCode: '',
      selectDictTypes: [],
      selectDicts: [],
      selectDicts1: [],

      column1List: [{
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '类型代码',
          key: 'dictTypeCode',
          width: 200,
        },
        {
          title: '类型名称',
          key: 'dictTypeName',

        },
        {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'error',
            text: '删除'
          }],
          width: '60',
          align: 'center'
        }

      ],

      column2List: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '字典项代码',
          key: 'dictCode',
          width: 200,
        },
        {
          title: '字典项名称',
          key: 'dictName',
          width: 150,
        },
        {
          title: '排序',
          key: 'sortNo',
          width: 80,
        },
        {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'error',
            text: '删除'
          }],
          width: 150,
          align: 'center'
        }

      ],
    }
  },
  methods: {
    ...mapActions([
      'getDictTypeList', //渲染字典类型列表
      'createDictTypeList', //创建字典类型
      'getDictTypeInfoById', //根据id获取字典类型
      // 'updateDictTypeById', //update字典类型
      'deleteDictTypeById', //删除
      'searchDictType', //搜索
      'getUnderDictType', //获取code下的字典数据
      'createDictData', //创建字典数据
      'getDictInfoById', //根据id获取字典项
      'updateDictInfoById', //更新字典项数据
      'deleteDictInfoById', //删除字典数据
    ]),
    uploadSuccess (res, file) { //上传成功
       this.$Message.info('上传成功,请点击字典类型查看添加的字典项');
      this.getDictTypeList({
      dictTypeCode: '',
      dictTypeName: '',
      page: '',
      size: this.pageSize,
      sort: ''
    })
    },
    uploadError(error) {
     this.$Message.error('上传失败');
    },

    handleFormatError(file) {
       this.$Message.error("文件格式不正确,请上传后缀为.xls格式文件");
    },
    loadData(params, callback) {
      api.dictType.getDictTypesChildren({
        pathParams: params
      }).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      })
    },
    loadDictData(params, callback) {
      api.dictType.getChildDictData({
        queryParams: params
      }).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      })
    },
    //改变每页显示条数
    pageSizeChange(value) {
      this.pageSize = value;

      this.getDictTypeList({
        dictTypeCode: this.typeCode,
        dictTypeName: this.typeName,
        page: '',
        size: this.pageSize,
        sort: ''
      })
    },
    //改变页码
    pageChange(value) {
      this.page = value - 1;
      this.getDictTypeList({
        dictTypeCode: this.typeCode,
        dictTypeName: this.typeName,
        page: this.page,
        size: this.pageSize,
        sort: ''
      })
    },

    //新增字典类型ok
    createNewType() {
      this.$refs.createDictTypeFormValidate.resetFields()
      this.newDictType = true
    },
    async newDictTypeOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictType.createDictType({
            data: {
              dictTypeCode: this.createDictTypeFormValidate.dictTypeCode,
              dictTypeName: this.createDictTypeFormValidate.dictTypeName
            }
          }).then(res => {
            if (res.status == 200) {
              this.newDictType = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getDictTypeList({
              dictTypeCode: this.typeCode,
              dictTypeName: this.typeName,
              page: this.page,
              size: this.pageSize,
              sort: ''
            })
            this.createDictTypeFormValidate = {
              dictTypeCode: '',
              dictTypeName: '',
            }
          })
        } else {
          this.$Message.warning('创建失败!');
        }
      })
    },

    cancleCreateType() {
      this.newDictType = false;
      this.createDictTypeFormValidate = {
        dictTypeCode: '',
        dictTypeName: '',
      }
    },
    async updateDictTypeOk(name) {

      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictType.updateDictTypeById({
            pathParams: {
              id: this.dictTypeById.id
            },
            data: {
              dictTypeCode: this.dictTypeById.dictTypeCode,
              dictTypeName: this.dictTypeById.dictTypeName,
              parentCode: this.dictTypeById.parentCode
            }
          }).then(res => {
            if (res.status == 200) {
              this.newDictType = false;
              this.$Message.success('更新成功!');
            } else {
              this.$Message.success('更新失败!');
            };
            this.updateDictType=false;
            this.getDictTypeList({
              dictTypeCode: this.typeCode,
              dictTypeName: this.typeName,
              page: this.page,
              size: this.pageSize,
              sort: ''
            });

          })
        } else {
          this.$Message.success('更新失败!');
        }
      })
    },

    createNewTypeChlid() {
      this.$refs.createTypeChildValidate.resetFields();
      if (this.selectDictTypes.length != 1) {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条数据！',
        })
      } else {
        this.newDictTypeChild = true
        this.createTypeChildValidate.parentCode = this.selectDictTypes[0].dictTypeCode
      }

    },
    async creatTypeChildOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictType.createDictType({

            data: {
              parentCode: this.createTypeChildValidate.parentCode,
              dictTypeCode: this.createTypeChildValidate.dictTypeCode,
              dictTypeName: this.createTypeChildValidate.dictTypeName
            }
          }).then(res => {
            if (res.status == 200) {
              this.newDictTypeChild = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getDictTypeList({
              dictTypeCode: this.typeCode,
              dictTypeName: this.typeName,
              page: this.page,
              size: this.pageSize,
              sort: ''
            })
            this.createTypeChildValidate = {
              dictTypeCode: '',
              dictTypeName: '',
            }
          })
        } else {
          this.$Message.warning('创建失败!');
        }
      })
    },

    canclecreatTypeChild() {
      this.newDictTypeChild = false;
      this.createTypeChildValidate = {
        dictTypeCode: '',
        dictTypeName: '',
      }
    },

    async deleteDictTypes() {
      if (this.selectDictTypes.length == 0) {
        this.$Message.warning('请选择需要删除的对象!');
      } else {
        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            var isLegal = false
            var selectIds = []
            this.selectDictTypes.map(item => {
              if (!item.leaf) {
                isLegal = true

              }
              selectIds.push(item.id)

            })
            if (isLegal) {
              this.$Message.warning('删除失败,不能删除包含子类型的字典类型!');
            } else {

              let deleteParams = selectIds.join(',');

              api.dictType.deleteDictTypeByIds({
                pathParams: {
                  ids: deleteParams
                }
              }).then(res => {
                if (res.status == 200) {
                  this.newDictTypeChild = false;
                  this.$Message.success('删除成功!');
                } else {
                  this.$Message.warning('删除失败!');
                }
                this.getDictTypeList({
                  dictTypeCode: '',
                  dictTypeName: '',
                  page: '',
                  size: this.pageSize,
                  sort: ''
                })
              });
            }

          }
        });
      }


    },
    //编辑删除
    rowClick(data, index, event) {
      console.log(index)
      if (index.srcElement.innerText.trim() === "编辑") {
        this.$refs.dictTypeById.resetFields();
        this.updateDictType = true;
        this.getDictTypeInfoById(data.id)
      } else if (index.srcElement.innerText.trim() === "删除") {
        // this.$options.methods.deleteConfirm(data.id)
        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            if (!data.leaf) {
              this.$Message.warning('删除失败,不能删除包含子类型的字典类型!');
            } else {
              api.dictType.deleteDictTypeByIds({
                pathParams: {
                  ids: data.id
                }
              }).then(res => {
                if (res.status == 200) {
                  this.newDictTypeChild = false;
                  this.$Message.success('删除成功!');
                } else {
                  this.$Message.warning('删除失败!');
                }
                this.getDictTypeList({
                  dictTypeCode: '',
                  dictTypeName: '',
                  page: '',
                  size: this.pageSize,
                  sort: ''
                })
              });
            }
          }
        });
      };
    },

    trClick(index, item) {
      // console.log(item)
      this.getUnderDictType({
        dictTypeCode: item.dictTypeCode,
        page: this.page1,
        size: this.pageSize1,
        sort: ''
      })
    },
    selectionClick(arr) {
      console.log(arr)
      this.selectDictTypes = arr;

    },

    search() {
      this.getDictTypeList({
        dictTypeCode: this.typeCode,
        dictTypeName: this.typeName,
        page: '',
        size: this.pageSize,
        sort: ''
      })
    },

    reset() {
      this.getDictTypeList({
        dictTypeCode: '',
        dictTypeName: '',
        page: '',
        size: this.pageSize,
        sort: ''
      })
      this.typeCode = '';
      this.typeName = ''
    },


    //字典数据项
    createNewDict() {
      this.$refs.createDictFormValidate.resetFields();
      this.newDict = true;
      this.createDictFormValidate = {
        dictCode: '',
        dictName: '',
        sortNo: ''
      }
    },
    newDictOk(name) {

      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictCtr.createDict({
            data: {
              dictCode: this.createDictFormValidate.dictCode,
              dictName: this.createDictFormValidate.dictName,
              dictTypeCode: this.dictUnderTypeList.dictTypeCode,
              sortNo: this.createDictFormValidate.sortNo
            }
          }).then(res => {
            if (res.status == 200) {
              this.newDict = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getUnderDictType({
              dictTypeCode: this.dictUnderTypeList.dictTypeCode,
              page: '',
              size: '',
              sort: ''
            })
            this.createTypeChildValidate = {
              parentCode: '',
              dictTypeCode: '',
              dictTypeName: '',
            }
          })
        } else {
          this.$Message.warning('创建失败!');
        }
      })
    },
    cancleCreateDict() {
      this.newDict = false;
      this.createTypeChildValidate = {
        parentCode: '',
        dictTypeCode: '',
        dictTypeName: '',
      }
    },
    pageSizeChange1(value) {
      this.pageSize1 = value;
      this.getUnderDictType({
        dictTypeCode: this.dictUnderTypeList.dictTypeCode,
        page: this.page1,
        size: this.pageSize1,
        sort: ''
      })
    },
    //改变页码
    pageChange1(value) {
      this.page1 = value - 1;

      this.getUnderDictType({
        dictTypeCode: this.dictUnderTypeList.dictTypeCode,
        page: this.page1,
        size: this.pageSize1,
        sort: ''
      })
    },

    rowClick1(data, index, event) {
      if (index.srcElement.innerText.trim() === "编辑") {
        this.$refs.dictInfoById.resetFields();
        this.updateDict = true;
        // console.log(data.id)
        this.getDictInfoById(data.id)
      } else if (index.srcElement.innerText.trim() === "删除") {

        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            if (!data.leaf) {
              this.$Message.warning('删除失败,不能删除包含子类型的字典类型!');
            } else {
              api.dictCtr.deleteDict({
                pathParams: {
                  ids: data.id
                }
              }).then(res => {
                if (res.status == 200) {
                  this.newDictTypeChild = false;
                  this.$Message.success('删除成功!');
                } else {
                  this.$Message.warning('删除失败!');
                }
                this.getUnderDictType({
                  dictTypeCode: this.dictUnderTypeList.dictTypeCode,
                  page: this.page1,
                  size: this.pageSize1,
                  sort: ''
                })
              });
            }
          }
        });
      };
    },
    cancleUpdateDict() {
      this.updateDict = false;
    },
    updateDictOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictCtr.updateDictById({
            pathParams: {
              id: this.dictInfoById.id
            },
            data: {
              dictCode: this.dictInfoById.dictCode,
              dictName: this.dictInfoById.dictName,
              dictTypeCode: this.dictInfoById.dictTypeCode,
              parentCode: this.dictInfoById.parentCode,
              sortNo: this.dictInfoById.sortNo
            }
          }).then(res => {
            if (res.status == 200) {
              this.updateDict = false;
              this.$Message.success('更新成功!');
            } else {
              this.$Message.success('更新失败!');
            }
            this.getUnderDictType({
              dictTypeCode: this.dictUnderTypeList.dictTypeCode,
              page: this.page1,
              size: this.pageSize1,
              sort: ''
            })

          })
        } else {
          this.$Message.success('更新失败!');
        }
      })
    },
    createNewChlid() {
      if (this.selectDicts1.length != 1) {
        this.$Modal.warning({
          title: '警告',
          content: '请选择一条数据！',
        })
      } else {
        this.$refs.createDictChildFormValidate.resetFields();
        this.newDictChild = true
        this.createDictChildFormValidate.parentCode = this.selectDicts1[0].dictCode
      }

    },
    async newDictChildOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.dictCtr.createDict({

            data: {
              dictCode: this.createDictChildFormValidate.dictCode,
              dictName: this.createDictChildFormValidate.dictName,
              dictTypeCode: this.dictUnderTypeList.dictTypeCode,
              sortNo: this.createDictChildFormValidate.sortNo,
              parentCode: this.createDictChildFormValidate.parentCode,

            }
          }).then(res => {
            if (res.status == 200) {
              this.newDictChild = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getUnderDictType({
              dictTypeCode: this.dictUnderTypeList.dictTypeCode,
              page: this.page1,
              size: this.pageSize1,
              sort: ''
            })
            this.createTypeChildValidate = {
              dictTypeCode: '',
              dictTypeName: '',
            }
          })
        } else {
          this.$Message.warning('创建失败!');
        }
      })
    },
    cancleCreateDictChlid() {
      this.newDictChild = false
      this.createDictChildFormValidate = {
        parentCode: '',
        dictCode: '',
        dictName: '',
        sortNo: ''
      }
    },
    deleteDictTypes1() {
      if (this.selectDicts1.length == 0) {
        this.$Message.warning('请选择需要删除的对象!');

      } else {
        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            var isLegal = false
            var selectIds = []
            this.selectDicts1.map(item => {
              if (!item.leaf) {
                isLegal = true

              }
              selectIds.push(item.id)

            })
            if (isLegal) {
              this.$Message.warning('删除失败,不能删除包含子类型的字典类型!');
            } else {

              let deleteParams = selectIds.join(',');

              api.dictCtr.deleteDict({
                pathParams: {
                  ids: deleteParams
                }
              }).then(res => {
                if (res.status == 200) {
                  this.newDictTypeChild = false;
                  this.$Message.success('删除成功!');
                } else {
                  this.$Message.warning('删除失败!');
                }
                this.getUnderDictType({
                  dictTypeCode: this.dictUnderTypeList.dictTypeCode,
                  page: this.page1,
                  size: this.pageSize1,
                  sort: ''
                })
              });
            }

          }
        });
      }

    },
    // trClick1(index, item) {
    //   this.getUnderDictType({
    //     dictTypeCode: item.code,
    //     page: this.page1,
    //     size: this.pageSize1,
    //     sort: ''
    //   })
    // },
    selectionClick1(arr) {
      console.log(arr)
      this.selectDicts1 = arr;

    },
  },
  components: {
    Headline,
    treeGrid
  },
  computed: {
    ...mapGetters([
      'dictTypeList',
      'dictTypeById',
      'dictUnderTypeList',
      'dictInfoById',
      'dictTypeDeleteCb'
    ])
  },
  created() {
    this.getDictTypeList({
      dictTypeCode: '',
      dictTypeName: '',
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

.menuTree {
  font-size: 15px
}

.exportBtn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 6px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-transition: color .2s linear, background-color .2s linear, border .2s linear, -webkit-box-shadow .2s linear;
  transition: color .2s linear, background-color .2s linear, border .2s linear, -webkit-box-shadow .2s linear;
  transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
  transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear, -webkit-box-shadow .2s linear;
  color: #495060; // background-color: #f7f7f7;
  border-color: #dddee1;
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
}

.exportBtn:hover {
  background-color: #57a3f3;
  border-color: #57a3f3;
}
</style>
