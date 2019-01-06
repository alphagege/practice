<template>
<div>
    <Headline title="应用管理" subtitle="应用功能维护了应用功能等新增、修改、删除等操作。这些操作涉及到应用、功能组、功能等几个对象。" />
    <Card class="cardSty">
        <div style="margin-bottom: 20px;">
            <Form ref="formInline" :label-width="100" inline>
                <FormItem label="应用名称:" prop="name">
                    <Input type="text" placeholder="应用名称" v-model="appName" />
                </FormItem>
                <FormItem label="应用代码:" prop="code">
                    <Input type="text" placeholder="应用代码" v-model="appCode" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                    <!-- <Button type="primary" style="margin-left: 50px" @click="reset()">重置</Button> -->
                    <Button type="primary" style="margin-left: 50px" @click="createNewApp">新增</Button>
                </FormItem>
            </Form>
            <hr style="border: .5px solid #e9eaec; margin:10px 0 30px;" />
            <Table border :columns="roleColumns" :data="appList.content"></Table>
            <Row type="flex" justify="end" style="margin-top: 20px;">
                <Col>
                <Page show-sizer show-elevator show-total :page-size="this.pageSize" :total='appList.totalElements' @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
                </Col>
            </Row>
        </div>
    </Card>
    <!-- 新增app -->
    <Modal :mask-closable="false" v-model="newApp" title="新增应用">
        <div style="padding:10px 20px;">
            <Form :label-width="100" inline :rules="ruleValidate" ref="createFormValidate" :model="createFormValidate">
                <FormItem label="应用名称:" prop="appName">
                    <Input type="text" style="width:300px" placeholder="应用名称" v-model="createFormValidate.appName" />
                </FormItem>
                <FormItem label="应用代码:" prop="appId">
                    <Input type="text" style="width:300px" placeholder="应用代码" v-model="createFormValidate.appId" @on-change="codeChange" />
                </FormItem>
                <FormItem label="应用入口:" prop="serviceUrl">
                    <Poptip trigger="hover" content="连接注册中心时，填写应用代码即可。如：app1;不连注册中心时，直接填写实际入口地址。如：192.2.2.2:8080" placement="bottom">

                        <Input type="text" v-model="createFormValidate.serviceUrl" placeholder="应用入口" style="width:300px">
                        <span slot="prepend">http://</span>
                        </Input>
                    </Poptip>

                </FormItem>
                <FormItem label="应用上下文:" prop="contextPath">
                    <Input type="text" v-model="createFormValidate.contextPath" placeholder="应用上下文请以''/'开头" style="width:300px" />
                </FormItem>
                <FormItem label="应用描述:" prop="desc">
                    <Input type="textarea" style="width:300px" placeholder="应用描述" v-model="createFormValidate.desc" />
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="text" @click="cancleCreate">取消</Button>
            <Button type="primary" @click="newAppOk('createFormValidate')">保存</Button>
        </div>

    </Modal>
    <!-- 编辑app -->
    <Modal :mask-closable="false" v-model="edit" title="编辑应用">
        <div style="padding:10px 20px;">
            <Form :label-width="100" inline :rules="ruleValidate" ref="appInfoById" :model="appInfoById">
                <FormItem label="应用名称:" prop="appName">
                    <Input type="text" style="width:300px" placeholder="应用名称" v-model="appInfoById.appName" />
                </FormItem>
                <FormItem label="应用代码:" prop="appId">
                    <Input type="text" style="width:300px" readonly placeholder="应用代码" v-model="appInfoById.appId" />
                </FormItem>
                <FormItem label="应用入口:" prop="serviceUrl">
                    <Poptip trigger="hover" content="连接注册中心时，填写应用代码即可。如：app1；不连注册中心时，直接填写实际入口地址。如：192.2.2.2:8080" placement="bottom">

                        <Input type="text" v-model="appInfoById.serviceUrl" placeholder="应用入口" style="width:300px">
                        <span slot="prepend">http://</span>
                        </Input>
                    </Poptip>

                </FormItem>
                <FormItem label="应用上下文:" prop="contextPath">
                    <Input type="text" v-model="appInfoById.contextPath" placeholder="应用上下文请以''/'开头" style="width:300px" />
                </FormItem>
                <FormItem label="应用描述:" prop="desc">
                    <Input type="textarea" style="width:300px" placeholder="应用描述" v-model="appInfoById.desc" />
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="text" @click="cancleEdit">取消</Button>
            <Button type="primary" @click="editOk('appInfoById')">保存</Button>
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
    name: "app-manage",
    data() {
        return {
            edit: false,
            newApp: false,
            appName: '',
            appCode: '',
            pageSize: 10,
            page: 0,
            roleColumns: [{
                    title: '应用名称',
                    key: 'appName',
                    editable: true
                },
                {
                    title: '应用代码',
                    key: 'appId',
                    editable: true
                },
                {
                    title: '创建时间',
                    key: 'createdDate'
                },
                {
                    title: '应用描述',
                    key: 'desc',
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
                                        this.getInfo(params)
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
            createFormValidate: {
                appName: '',
                appId: '',
                serviceUrl: '',
                desc: '',
                contextPath: ''
            },
            ruleValidate: {
                appName: [{
                        required: true,
                        message: '应用名称不能为空',
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
                appId: [{
                        required: true,
                        message: '应用代码不能为空',
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
                serviceUrl: [{
                    required: true,
                    message: '应用入口不能为空',
                    trigger: 'blur'
                }],
                contextPath: [
                      {
                        type: 'string',
                        max: 60,
                        message: '最大不能超过60字符',
                        trigger: 'blur'
                    },
                    {
                    pattern: /^\//,
                    message: '请以“/”开头',
                    trigger: 'blur'
                }],
                desc: [{
                    required: false,
                    message: 'URL不能为空',
                    trigger: 'blur'
                }, {
                    type: 'string',
                    max: 200,
                    message: '最大不能超过200字符',
                    trigger: 'blur'
                }]

            },
        }
    },
    methods: {
        ...mapActions([
            'fetchAppList',
            'getAppInfo'
        ]),
        createNewApp() {
            this.$refs.createFormValidate.resetFields();
            this.newApp = true
        },
        codeChange() {
            this.createFormValidate.serviceUrl = this.createFormValidate.appId
        },
        newAppOk(name) {

            this.$refs[name].validate((valid) => {
                var createParams = {};
                createParams = Object.assign({}, this.createFormValidate);
                console.log(createParams)
                // createParams.serviceUrl = 'http://' + createParams.serviceUrl + '/tarest/services/function-mappings'
                if (valid) {
                    api.app.createApp({
                        data: createParams
                    }).then(res => {
                        if (res.status == 200) {
                            this.newApp = false;
                            this.$Message.success('创建成功!');
                        } else {
                            this.$Message.warning('创建失败!');
                        }

                    }).then(() => {
                        this.fetchAppList({
                            appCode: this.appCode,
                            appName: this.appName,
                            page: '',
                            size: this.pageSize,
                            sort: ''
                        });
                        this.createFormValidate = {
                            appName: '',
                            appId: '',
                            serviceUrl: '',
                            desc: ''
                        }
                    })

                } else {
                    this.$Message.error('创建失败!');
                }
            })
        },
        cancleCreate() {
            this.newApp = false;
            this.createFormValidate = {
                appName: '',
                appId: '',
                serviceUrl: '',
                desc: ''
            }
        },
        deleteConfirm(params) {

            this.$Modal.confirm({
                title: '警告',
                content: '确认要删除吗',
                // loading: true,
                onOk: () => {
                    console.log(params.row.appId)
                    api.app.deleteAppById({
                        pathParams: {
                            appId: params.row.appId
                        }
                    }).then(res => {
                        if (res.status == 200) {

                            this.$Message.success('删除成功!');
                        } else {
                            this.$Message.warning('删除失败!');
                        };
                        this.fetchAppList({
                        appCode: this.appCode,
                        appName: this.appName,
                        page: '',
                        size: this.pageSize,
                        sort: ''
                    })
                    })
                }
            });
        },
        pageChange(value) {

            this.fetchAppList({
                appCode: this.appCode,
                appName: this.appName,
                page: value - 1,
                size: this.pageSize,
                sort: ''
            })
        },
        pageSizeChange(value) {
            this.pageSize = value;

            this.fetchAppList({
                appCode: this.appCode,
                appName: this.appName,
                page: '',
                size: this.pageSize,
                sort: ''
            })
        },
        search() {
            this.fetchAppList({
                appCode: this.appCode,
                appName: this.appName,
                page: '',
                size: this.pageSize,
                sort: ''
            })
        },
        getInfo(params) {
            this.$refs.appInfoById.resetFields();
            this.edit = true
            this.getAppInfo(params.row.appId)
        },
        editOk(name) {
            this.$refs[name].validate((valid) => {
                var updateParams = this.appInfoById;

                // updateParams.serviceUrl = 'http://' + updateParams.serviceUrl + '/tarest/services/function-mappings'
                console.log(updateParams)
                if (valid) {
                    api.app.updateAppById({
                        pathParams: {
                            appId:updateParams.appId
                        },
                        data:  updateParams
                        
                    }).then(res => {
                        if (res.status == 200) {
                            this.edit = false;
                            this.$Message.success('更新成功!');
                        } else {
                            this.$Message.warning('更新失败!');
                        }

                    }).then(() => {
                        this.fetchAppList({
                            appCode: this.appCode,
                            appName: this.appName,
                            page: '',
                            size: this.pageSize,
                            sort: ''
                        });
                    })

                } else {
                    this.$Message.error('更新失败!');
                }
            })
        },
        cancleEdit() {
            this.edit = false
        }
    },
    created() {
        this.fetchAppList({
            appCode: '',
            appName: '',
            page: '',
            size: this.pageSize,
            sort: ''
        })
    },
    components: {
        Headline
    },
    computed: {
        ...mapGetters([
            'appList',
            'appInfoById'
        ])
    },

}
</script>

<style scoped>

</style>
