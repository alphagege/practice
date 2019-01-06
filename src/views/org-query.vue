<template>
<div>
  <Headline title="机构查询" subtitle="根据一些常用条件综合查询机构数据列表." />
  <Card class="cardSty">
    <div style="margin-bottom: 20px;">
      <Form ref="formInline" :label-width="100" inline>
        <FormItem label="机构名称:" prop="code">
          <Input type="text" placeholder="机构名称" v-model="searchConName" />
        </FormItem>
        <FormItem label="机构代码:" prop="name">
          <Input type="text" placeholder="机构代码" v-model="searchConCode" />
        </FormItem>
        <FormItem label="机构类型:">
          <Select v-model="searchType" class="inputSty" style="width:200px">
              <Option v-for="(item,key) in orgTypeSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="机构等级:">
          <Select v-model="searchLevel" class="inputSty" style="width:200px">
              <Option v-for="(item,key) in orgLevelSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="上级机构:">
          <Input type="text" placeholder="上级机构" v-model="searchParentOrg" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="primary" style="margin-left: 50px" @click="reset">重置</Button>

        </FormItem>
      </Form>
      <hr style="border: .5px solid #e9eaec; margin:10px 0 30px;" />
      <Table :columns="columnList" :data="orgList.content" border></Table>
      <Row type="flex" justify="end" style="margin-top: 20px;">
        <Col>
        <Page show-sizer show-elevator show-total :page-size="this.size" :total='orgList.totalElements' @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
        </Col>
      </Row>
    </div>
  </Card>
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
  name: "org-query",
  data() {
    return {
      model1: '',
      page: 0,
      size: 10,
      columnList: [{
          title: '机构名称',
          key: 'name',
        },
        {
          title: '机构代码',
          key: 'code',
        },
        {
          title: '上级机构代码',
          key: 'parentCode',
        },
        {
          title: '机构等级',
          key: 'grade',
        },
        {
          title: '机构类型',
          key: 'type',
        },
        {
          title: '机构状态',
          key: 'status',
        },
        {
          title: '创建时间',
          key: 'createTime',
        }
      ],
      orgTypeSelect: [],
      modelOrgType: '',
      orgLevelSelect: [],
      modelOrgLevel: '',
      orgStatusSelect: [],
      modelOrgStatus: '',
      searchConName: '',
      searchConCode: '',
      searchType: '',
      searchLevel: '',
      searchParentOrg: ''


    }
  },
  methods: {
    ...mapActions([
      'getOrgListQuery', //获取组织机构员工树

    ]),
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
    },
    pageSizeChange(value) {
      this.pageSize = value;
      this.getOrgListQuery({
        name: this.searchConName,
        code: this.searchConCode,
        type: this.searchType,
        grade: this.searchLevel,
        parentId: this.searchParentOrg,
        page: this.page,
        size: this.size,
        sort: this.searchConName
      })
    },
    //改变页码
    pageChange(value) {
      this.getOrgListQuery({
        name: this.searchConName,
        code: this.searchConCode,
        type: this.searchType,
        grade: this.searchLevel,
        parentId: this.searchParentOrg,
        page: this.page,
        size: this.size,
        sort: this.searchConName
      })
    },
    search() {
      this.getOrgListQuery({
        name: this.searchConName,
        code: this.searchConCode,
        type: this.searchType,
        grade: this.searchLevel,
        parentId: this.searchParentOrg,
        page: this.page,
        size: this.size,
        sort: this.searchConName
        // sort:''
      })
    },
    reset() {
      this.searchConName = '';
      this.searchConCode = '';
      this.searchType = '';
      this.searchLevel = '';
      this.searchParentOrg = '';
      this.getOrgListQuery({

        page: this.page,
        size: this.size,

      })
    },


  },
  components: {
    Headline,

  },
  computed: {
    ...mapGetters([
      'orgList'
    ])
  },
  created() {
    this.getOrgListQuery({

      page: this.page,
      size: this.size,


    })
    this.fetchSelectOptions('COF_ORGTYPE', this.orgTypeSelect);
    this.fetchSelectOptions('COF_ORGDEGREE', this.orgLevelSelect);
    this.fetchSelectOptions('COF_ORGSTATUS', this.orgStatusSelect)
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
