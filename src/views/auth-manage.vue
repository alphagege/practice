<template>
<div>
  <Headline title="授权管理" subtitle="当前系统的用户角色，可以为角色分配权限。" />
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
          <Button type="primary" @click="searchRole()">搜索</Button>
        </FormItem>
      </Form>
      <hr style="border: .5px solid #e9eaec; margin:10px 0 30px;" />
      <Table border :columns="roleColumns" :data="roles.content"></Table>
      <Row type="flex" justify="end" style="margin-top: 20px;">
        <Col>
        <Page show-sizer show-elevator show-total :total='roles.totalElements' @on-change="selectPage"></Page>
        </Col>
      </Row>
    </div>
  </Card>
  <!-- 菜单授权 -->
  <Modal :mask-closable="false" v-model="setRoleAuthModal" title="菜单授权">
    <Tree :data="menuTree" :render="renderContent" show-checkbox multiple @on-check-change="handleChecked" disableCheckbox></Tree>
    <div slot="footer">
      <Button type="text" @click="setRoleAuthModal = false">取消</Button>
      <Button type="primary" @click="setRoleAuth">保存</Button>
    </div>
  </Modal>
  <!-- 服务授权 -->
   <Modal :mask-closable="false" v-model="serviceAuthModal" title="服务授权">
    <Tree :data="serviceTree" show-checkbox multiple :render="renderContentService" @on-check-change="handleCheckedService"></Tree>
    <div slot="footer">
      <Button type="text" @click="closeServiceAuth">取消</Button>
      <Button type="primary" @click="serviceAuthOk">保存</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import api from '@/api';
import Headline from '@/components/Headline';
import {Button, Icon} from 'iview';
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: "auth-manage",
  data() {
    return {
      roleName: '',
      roleCode: '',
      roles: {},
      nodeId: 0,
      setRoleAuthModal: false,
      serviceAuthModal: false,
      selectedMenus: [],
      selectedService: [],
      currentRole: {},
      initializeNodes: [],
      menuTree: [],
      serviceTree: [],
      loading: true,
      isChosed: false,
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
          width: 220,
          align: 'center',
          render: (h, params) => {
            return (
              [<Button type="primary" onClick={this.showAuthRoleModal.bind(this, params.row)} style="margin-right:10px">菜单授权</Button>,
                 <Button type="primary" onClick={this.showServiceAuthModal.bind(this, params.row)}>服务授权</Button>]
              
            )
          }
        }
      ],
    }
  },
  methods: {
    //改变页码
    selectPage(pageIndex) {
      this.searchRole(pageIndex - 1);
    },
    //搜索
    async searchRole(page = 0, size = 10, roleCode = this.roleCode, roleName = this.roleName) {
      let res = await api.roles.getRoles({
        queryParams: {
          roleCode,
          roleName,
          page,
          size
        }
      });
      if (res.status === 200) {
        this.roles = res.data;
      }
    },
    transformTreeData(nodes) {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.transformTreeData(node.children);
        }
        if (node.granted && node.leaf) {
          node.checked = true;
        }
      })
      
    },
    async showAuthRoleModal(data) { 
      this.setRoleAuthModal = true;
      let res = await api.menu.getAvailableMenusByRoleId({
        pathParams: {
          roleId: data.id
        }
      });
      this.transformTreeData(res.data);
      res.data.map(item=>{
       this.selectedMenus= this.selectedMenus.concat(item.children)
      })
      if (res.status === 200) {
        this.menuTree = [
          {
            menuName: "应用菜单",
            expand: true,
            root: true,
            nodeKey: 0,
            checked: false,
            children: res.data
          }
        ];  
      }
      
      this.currentRole = data;
    },
    async showServiceAuthModal(data) {
        this.nodeId = data.id;
      
      this.serviceAuthModal =true;
       let res = await api.menu.getService({queryParams:{roleId:this.nodeId}});
     
       this.serviceTree = [];
       console.log(res.data)
       if(res.data&&res.data.length>0){
         res.data.map(item=>{
          let obj = {};
          obj.name = item.appName;
          obj.code = item.appId;
          obj.expand = true;
          obj.children = [];
          obj.nodeType = 'app'
          if(obj.granted) {
            obj.checked = true
          }else(
              obj.checked = false
          )
          if(item.groups&&item.groups.length>0) {
            item.groups.map(item=>{
              let obj1 = {};
              obj1.expand = true;
              obj1.name = item.name;
              obj1.code = item.code;
              obj1.children = [];
              obj1.nodeType = 'group';
               if(obj1.granted) {
                   obj1.checked = true
                 }else(
                     obj.checked = false
                 )
              if(item.functions&&item.functions.length>0) {
                item.functions.map(item=>{
                   let obj2= {};
                 obj2.name = item.name;
                 obj2.code = item.code;
                 obj2.granted = item.granted;
                 obj2.nodeType = 'function';
                 obj2.appId = obj.code;
                 if(obj2.granted) {
                   obj2.checked = true
                 }else(
                     obj.checked = false
                 )
                 obj1.children.push(obj2)
                })
                
              }
              obj.children.push(obj1);
            })
          }
           this.serviceTree.push(obj);
       })
       }

       
       console.log( JSON.stringify(this.serviceTree))
    },
    handleChecked(nodes) {
      this.selectedMenus = nodes.filter(node => {
        return !node.root && node.leaf
      });
    },
    handleCheckedService(nodes) {
      this.isChosed = true;
      this.selectedService = nodes
      console.log(nodes)
      // console.log(this.selectedService)
    },
    closeServiceAuth() {
       this.serviceAuthModal =false;
         this.selectedService = [];
       this.isChosed = false;
    }, 
    async serviceAuthOk(){
      // if (this.selectedService.length == 0) {
      //   this.$Message.error('请选择授权服务');
      //   return;
      // }
      let dataParams = {
        "functionInfo": [],
        "roleId": this.nodeId
      }
      if(this.isChosed){
         this.selectedService = this.selectedService.filter(function(item){
          return item.nodeType == "function"; 
        })
       this.selectedService.map(item=>{
        dataParams.functionInfo.push({
           "appFunction": [
              {
                "code": item.code,
                "granted": true
              }
            ],
            "appId": item.appId
        })
      });
      }else{
        this.$Message.error('请选择授权服务,如不授权请点击取消');
        return;
      }
  
      
     
      let res = await api.menu.setServiceAuths({data:dataParams}).then(res=>{
        
        if (res.status == 200) {
          this.serviceAuthModal = false;
          this.$Message.success('授权成功!');
        } else {
          this.$Message.warning('授权失败!');
        }
      }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
      this.selectedService = [];
       this.isChosed = false;
    },
    async setRoleAuth() {
      // if (this.selectedMenus.length == 0) {
      //   this.$Message.error('请选择授权菜单');
      //   return;
      // }
      console.log(this.selectedMenus.map(menu => menu.menuId))
      let data = {
        menuIds: this.selectedMenus.map(menu => menu.menuId),
        roleId: this.currentRole.id
      }
      let res = await api.menu.setMenuAuths({data});
      if (res.status === 200) {
        this.$Message.success('授权成功');
        this.setRoleAuthModal = false;
        this.$store.dispatch('initMenus', this);
      }
      this.selectedMenus = []
    },
    renderContent(h, {root, node, data}) {
      return (
        <span style={{display: "inline-block", width: "100%"}}>
          <span class="tree-title">{data.menuName}</span>
        </span>
      );
    },
    renderContentService (h, { root, node, data }) {
        var iconType = '';
        if(data.nodeType =='app'){
          iconType = "android-apps"
        }else if(data.nodeType =='group'){
          iconType = "person-stalker"
        }else if(data.nodeType =='function'){
          iconType = "calculator"
        }
        return h('span', {
            style: {
                display: 'inline-block',
                width: '100%'
            }
        }, [
            h('span', [
                h('Icon', {
                    props: {
                        type: iconType
                    },
                    style: {
                        marginRight: '8px'
                    }
                }),
                h('strong', {
                      style: {
                        fontSize: '13px',
                        marginRight: '5px'
                    }
                },data.name),
                 h('span', {
                      style: {
                        fontSize: '12px'
                    }
                },'('+data.code+')'),
            ])
        ]);
    },
    resetCheckedStatus(menus) {
      menus.forEach(menu => {
        if (menu.children.length > 0) {
          this.resetCheckedStatus(menu.children);
        }
        menu.checked = false;
      })
      return menus;
    },
    getMenuTree() {
      let tree = [
        {
          menuName: "应用菜单",
          expand: true,
          root: true,
          nodeKey: 0,
          checked: false,
          children: this.resetCheckedStatus(this.menuList)
        }
      ];
      return tree;
    }
  },
  components: {
    Headline
  },
  computed: {
    ...mapGetters(['menuList']),
    // menuTree() {
        
    //   }
  },
  created() {
    this.searchRole();
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
