<template>
<div>
  <Headline title="菜单管理" subtitle="菜单指业务系统中供用户使用的页面菜单。" />
  <Card class="cardSty">
    <Row :gutter="16">
      <Col span="5">
      <Card class="childCard">
        <p slot="title">菜单树</p>
        <Tree :data="menuTree" :render="renderContent" multiple></Tree>
      </Card>
      </Col>
      <Col span="19">
      <Card class="childCard" v-if="currentMenu">
        <p slot="title">菜单信息</p>
        <Button type="primary" class="saveBtn" @click.native="updateMenu">保存</Button>
        <Form ref="formInline" :model="currentMenu" :rules="menuRules">
          <Row>
            <Col span="12">
            <FormItem label="菜单名称:" prop="menuName" label-position="left" :label-width="100">
              <Input class="inputSty" v-model="currentMenu.menuName"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="菜单代码:" prop="menuId" label-position="left" :label-width="100">
              <Input class="inputSty" v-model="currentMenu.menuId" disabled></Input>
            </FormItem>
            </Col>
          </Row>
          <Row v-if="currentMenu.leaf">
            <Col span="12">
            <FormItem label="菜单打开方式:" prop="openMode" label-position="left" :label-width="100">
              <Select v-model="currentMenu.openMode" class="inputSty">
                  <Option v-for="(item,key) in menuOpenWay" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="菜单路径:" prop="menuPath" label-position="left" :label-width="100">
              <Input class="inputSty" v-model="currentMenu.menuPath"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="显示顺序:" prop="menuOrder" label-position="left" :label-width="100">
              <Input class="inputSty" v-model="currentMenu.menuOrder"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="相对路径:" prop="relativePath" label-position="left" :label-width="100">
              <i-switch v-model="currentMenu.relativePath"></i-switch>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="是否启用:" prop="enable" label-position="left" :label-width="100">
              <i-switch v-model="currentMenu.enable"></i-switch>
            </FormItem>
            </Col>
            <Col span="12" v-if="currentMenu.leaf">
            <FormItem label="上级菜单:" label-position="left" :label-width="100">
              <Select v-model="currentMenu.parentId" class="inputSty">
                    <Option v-for="(item,key) in parentList" :value="item.menuId" :key="item.id">{{ item.menuName }}
                    </Option>
                  </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      </Col>
      </Col>
    </Row>
  </Card>
  <Modal v-model="addMenuModal" title="添加菜单" width="740" @on-cancel="handleCancel">
    <Form :model="menuForm" ref="menuForm" :rules="menuRules">
      <Row>
        <Col span="12">
        <FormItem label="菜单名称:" prop="menuName" label-position="left" :label-width="100">
          <Input v-model="menuForm.menuName" placeholder="请输入菜单名称"> </Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="菜单代码:" prop="menuId" label-position="left" :label-width="100">
          <Input v-model="menuForm.menuId" placeholder="请输入菜单代码"> </Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="菜单显示顺序:" label-position="left" :label-width="100" prop="menuOrder">
          <Input v-model="menuForm.menuOrder" placeholder="请输入显示顺序"> </Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="是否启用:" prop="enable" label-position="left" :label-width="100">
          <i-switch v-model="menuForm.enable"></i-switch>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem label="是否叶子节点:" prop="leaf" label-position="left" :label-width="100">
          <i-switch v-model="menuForm.leaf"></i-switch>
        </FormItem>
        </Col>
      </Row>
      <Row v-if="menuForm.leaf">
        <Col span="12">
        <FormItem label="菜单打开方式:" prop="openMode" label-position="left" :label-width="100">
          <Select v-model="menuForm.openMode">
              <Option v-for="(item,key) in menuOpenWay" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="菜单路径:" prop="menuPath" label-position="left" :label-width="100">
          <Input v-model="menuForm.menuPath" placeholder="请输入菜单路径"> </Input>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <span></span>
      <Button type="text" @click="handleCancel">取消</Button>
      <Button type="primary" @click="addMenu">确定</Button>
    </div>
  </Modal>
  <!-- <Modal v-model="removeMenuModal" title="删除菜单">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除菜单</span>
      </p>
      <div style="text-align:center">
        <p>该菜单下所有子菜单都会被删除.</p>
        <p>确定吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="removeMenu">删除</Button>
      </div>
    </Modal> -->
</div>
</template>
<script>
import api from "@/api";
import { Icon, Button } from "iview";
import { mapActions, mapGetters } from "vuex";
import Headline from "@/components/Headline";

export default {
  name: "menu-manage",
  components: {
    Headline
  },
  data() {
    const validateMenuPath = (rule, value, callback) => {
      let openMode =
        this.mode === "add"
          ? this.menuForm.openMode
          : this.currentMenu.openMode;
      if (value === "") {
        return callback(new Error("不能为空"));
      } else if (openMode === "") {
        return callback(new Error("请先选择打开方式"));
      } else if (
        openMode.startsWith("out_") &&
        !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
          value
        )
      ) {
        return callback(new Error("请输入正确的地址"));
      } else if (
        openMode.startsWith("in_") &&
        !/^\/(([A-z0-9\-]+\/)*[A-z0-9\-]+$)?/.test(value)
      ) {
        return callback(new Error("请输入正确的路径"));
      } else {
        callback();
      }
    };
    return {
      addMenuModal: false,
      removeMenuModal: false,
      modal_loading: false,
      currentMenu: "",
      clickMenuId: "",
      mode: "edit",
      parentList: [],
      menuForm: {
        menuName: "",
        menuId: "",
        openMode: "",
        menuPath: "",
        menuOrder: 0,
        menuLevel: 1,
        leaf: false,
        enable: true,
        rootId: "",
        parentId: "",
        children: []
      },
      menuRules: {
        menuName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 30,
            message: "最大不能超过30字符",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            message: "只允许输入大小写字母、数字、下划线、中文",
            trigger: "blur"
          }
        ],
        menuId: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 30,
            message: "最大不能超过30字符",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "只允许输入大小写字母、数字、下划线",
            trigger: "blur"
          }
        ],
        openMode: [
          {
            required: true,
            message: "不能为空",
            trigger: "change"
          }
        ],
        menuPath: [
          {
            validator: validateMenuPath,
            trigger: "blur"
          }
        ],
        menuOrder: [
          {
            type: "number",
            message: "请输入数字",
            required: false,
            trigger: "blur",
            transform(value) {
              return Number(value);
            }
          },
          {
            type: "number",
            max: 99999,
            min: 0,
            message: "请输入0~99999之间的数字",
            trigger: "blur"
          }
        ]
      },
      menuOpenWay: [
        {
          value: "in_self",
          label: "内部链接(当前页)"
        },
        {
          value: "in_blank",
          label: "内部链接(新增tab页)"
        },
        {
          value: "out_self",
          label: "外部链接(当前页)"
        },
        {
          value: "out_blank",
          label: "外部链接(新增tab页)"
        }
      ],
      model1: ""
    };
  },
  methods: {
    ...mapActions(["fetchAllMenus"]),
    async updateMenu() {
      this.$refs.formInline.validate(async valid => {
        if (valid) {
          let flag = false;
          if (this.currentMenu.parentId == "appRoot") {
            flag = true;
            this.currentMenu.parentId = "";
          }
          let res = await api.menu.updateMenu({
            pathParams: {
              menuId: this.currentMenu.menuId
            },
            data: this.currentMenu
          });
          if (res.status === 200) {
            this.$Message.success("保存成功");
            if (flag) this.currentMenu.parentId = "appRoot";
            this.fetchAllMenus();
            this.$store.dispatch("initMenus", this);
          }
        }
      });
    },
    showAddMenu(data) {
      this.$refs["menuForm"].resetFields();
      this.addMenuModal = true;
      this.mode = "add";
      this.clickMenuId = data.menuId || "";
    },
    showRemoveMenu(data) {
      this.removeMenuModal = true;
      this.$Modal.confirm({
        title: "警告",
        content: "该菜单下所有子菜单都会被删除,确定吗？",
        // loading: true,
        onOk: () => {
          this.removeMenu();
        }
      });
      this.clickMenuId = data.menuId || "";
    },
    renderParent(h, { root, node, data }) {
      return (
        <span
          style={{
            display: "inline-block",
            width: "100%"
          }}
        >
          <span>
            <Icon
              type="ios-folder-outline"
              style={{
                marginRight: "8px"
              }}
            />{" "}
            <span> {data.menuName} </span>{" "}
          </span>{" "}
          <span
            style={{
              display: "inline-block",
              float: "right",
              marginRight: "40px"
            }}
          >
            <Button
              icon="ios-plus-empty"
              size="small"
              type="primary"
              style={{
                width: "52px"
              }}
              onClick={this.showAddMenu.bind(this, data)}
            />{" "}
          </span>{" "}
        </span>
      );
    },
    renderContent(h, { root, node, data }) {
      data.selected = false;
      let btns = (
        <span
          style={{
            display: "inline-block",
            float: "right",
            marginRight: "32px"
          }}
        >
          {!data.leaf && (
            <Button
              icon="ios-plus-empty"
              size="small"
              style={{
                marginRight: "8px"
              }}
              onClick={this.showAddMenu.bind(this, data)}
            />
          )}{" "}
          {data.childrenCount === 0 && (
            <Button
              icon="ios-minus-empty"
              size="small"
              style={{
                marginRight: "8px"
              }}
              onClick={this.showRemoveMenu.bind(this, data)}
            />
          )}
        </span>
      );
      return (
        <span
          style={{
            display: "inline-block",
            width: "100%"
          }}
        >
          <span>
            <Icon
              type="ios-paper-outline"
              style={{
                marginRight: "8px"
              }}
            />{" "}
            <span
              class="tree-title mouse"
              style=" display: 'inline-block';borderRadius: '2px';cursor:pointer"
              onClick={this.handleClickNode.bind(this, data, node)}
            >
              {" "}
              {data.menuName}{" "}
            </span>{" "}
            {btns}{" "}
          </span>{" "}
        </span>
      );
    },
    async addMenu(data) {
      if (this.clickMenuId) this.menuForm.parentId = this.clickMenuId;
      try {
        this.$refs.menuForm.validate(async valid => {
          if (valid) {
            let res = await api.menu.createMenu({
              data: this.menuForm
            });
            if (res.status === 200) {
              this.addMenuModal = false;
              this.$Message.success("创建成功");
              this.clearForm();
              this.fetchAllMenus();
              this.$store.dispatch("initMenus", this);
            }
          }
        });
      } catch (error) {}
    },
    async removeMenu() {
      let res = await api.menu.deleteMenu({
        pathParams: {
          menuId: this.clickMenuId
        }
      });
      if (res.status === 200) {
        this.$Message.success("删除成功");
        this.removeMenuModal = false;
        this.fetchAllMenus();
        this.$store.dispatch("initMenus", this);
      }
    },
    handleCancel() {
      this.mode = "edit";
      this.addMenuModal = false;
    },
    clearForm() {
      this.menuForm = {
        menuName: "",
        menuId: "",
        openMode: "",
        menuPath: "",
        menuOrder: 0,
        menuLevel: 1,
        leaf: false,
        enable: true,
        rootId: "",
        parentId: "",
        children: []
      };
    },
    async handleClickNode(data, node, event) {
      if (this.$refs.formInline) {
        this.$refs.formInline.resetFields();
      }
      let otherNode = document.querySelectorAll(".mouse");
      for (var i = 0; i < otherNode.length; i++) {
        otherNode[i].className = "mouse";
      }
      event.target.className += " mouseClick";
      data.selected = true;
      this.currentMenu = Object.assign({}, data);
      let res = await api.menu.getMenus({
        queryParams: {
          containLeaf: false
        }
      });
      if (res.status === 200) {
        this.parentList = [
          {
            menuId: "appRoot",
            menuName: "应用菜单",
            id: 9999
          },
          ...res.data
        ];
        if (!this.currentMenu.parentId) {
          this.currentMenu.parentId = "appRoot";
        }
      }
    }
  },
  computed: {
    ...mapGetters(["allMenus"]),
    menuTree() {
      let tree = [
        {
          menuName: "应用菜单",
          expand: true,
          root: true,
          render: this.renderParent,
          children: this.allMenus
        }
      ];
      return tree;
    }
  },
  created() {
    this.fetchAllMenus();
  }
};
</script>
<style lang="scss" scoped>
.saveBtn {
  position: absolute;
  right: 10%;
  top: 10px;
}

.inputSty {
  width: 80%;
}

.cardSty {
  margin-top: 30px;
  min-height: calc(100% - 102px);
}

.childCard {
  min-height: 500px;
}

.mouse:hover {
  background: #eaf4fe;
}

.mouseClick {
  background: #d5e8fc;
}
</style>
