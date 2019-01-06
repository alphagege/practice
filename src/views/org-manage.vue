<template>
<div>
  <Headline title="机构管理" subtitle="机构指企业的组织机构，一般包含机构、岗位、员工等信息。" />
  <Card class="cardSty">
    <Row :gutter="16">
      <Col span="6">
      <Card class="childCard">
        <p slot="title">组织机构员工树</p>
        <Tree :data="treeData" :render="renderContent" :load-data="loadData"></Tree>
      </Card>
      </Col>
      <Col span="17">
      <Tabs type="card" v-model="tabStatus" v-show="AssIconShow">
        <TabPane label="当前机构" name="local">
          <Card class="childCard" v-show="orgTab">
            <p slot="title">机构信息</p>
            <Button type="primary" class="saveBtn" @click="updateOrgInfo('orgInfoById')">保存</Button>
            <!-- <Button type="primary" class="resetBtn">重置</Button> -->
            <Form :rules="ruleValidate" ref="orgInfoById" :model="orgInfoById">
              <Row>
                <Col span="12">
                <FormItem label="机构名称:" label-position="left" :label-width="100" prop="name">
                  <Input class="inputSty" v-model="orgInfoById.name"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="机构代码:" label-position="left" :label-width="100" prop="code">
                  <Input class="inputSty" v-model="orgInfoById.code" disabled> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>

                <Col span="12">
                <!-- <Tooltip  content="请点击图标选择上级机构"> -->
                <FormItem label="上级机构:" label-position="left" :label-width="100">
                  <Input v-model="orgInfoById.parentName" class="inputSty" icon="ios-search" @on-click="selectParent" readonly> </Input>
                </FormItem>
                <!-- </Tooltip> -->
                </Col>
                <Col span="12">
                <FormItem label="机构类型:" label-position="left" :label-width="100">
                  <Select v-model="orgInfoById.type" class="inputSty">
                      <Option v-for="(item,key) in orgTypeSelect" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="机构等级:" label-position="left" :label-width="100">
                  <Select v-model="orgInfoById.grade" class="inputSty">
                      <Option v-for="(item,key) in orgLevelSelect" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="机构状态:" label-position="left" :label-width="100">
                  <Select v-model="orgInfoById.status" class="inputSty">
                      <Option v-for="(item,key) in orgStatusSelect" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="排序顺序:" label-position="left" :label-width="100" prop="sortNo">
                  <Input class="inputSty" v-model="orgInfoById.sortNo"> 10 </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="所属地域:" label-position="left" :label-width="100">
                  <Input class="inputSty" v-model="orgInfoById.region"> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="机构地址:" label-position="left" :label-width="100">
                  <Input class="inputSty" v-model="orgInfoById.address"> 10 </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="邮编:" label-position="left" :label-width="100" prop="postCode">
                  <Input class="inputSty" v-model="orgInfoById.postCode"> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="联系人:" label-position="left" :label-width="100">
                  <Input class="inputSty" v-model="orgInfoById.contact"> 10 </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="联系电话:" label-position="left" :label-width="100" prop="contactNumber">
                  <Input class="inputSty" v-model="orgInfoById.contactNumber"> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                <FormItem label="描述:" label-position="left" :label-width="100" prop="description">
                  <Input type="textarea" class="inputSty" style="width:92%" v-model="orgInfoById.description"> 10 </Input>
                </FormItem>

                </Col>
              </Row>
            </Form>
          </Card>
          <Card class="childCard" v-show="!orgTab">
            <p slot="title">岗位信息</p>
            <Button type="primary" class="saveBtn" @click="updatePositionInfo('positionInfoById')">保存</Button>
            <!-- <Button type="primary" class="resetBtn">重置</Button> -->
            <Form :rules="ruleValidate" ref="positionInfoById" :model="positionInfoById">
              <Row>
                <Col span="12">
                <FormItem label="岗位名称:" label-position="left" :label-width="100" prop="name">
                  <Input class="inputSty" v-model="positionInfoById.name"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="岗位代码:" label-position="left" :label-width="100" prop="code">
                  <Input class="inputSty" v-model="positionInfoById.code" disabled> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="岗位状态:" label-position="left" :label-width="100">
                  <Select v-model="positionInfoById.status" class="inputSty">
                      <Option v-for="(item,key) in orgStatusSelect" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="同级排序顺序:" label-position="left" :label-width="100" prop="sortNo">
                  <Input class="inputSty" v-model="positionInfoById.sortNo"> </Input>
                </FormItem>
                </Col>
              </Row>

            </Form>
          </Card>
        </TabPane>

        <TabPane label="员工列表" name="employeesList">
          <Card class="childCard" v-show="isOrgPanel">
            <span slot="title"><strong>机构信息：</strong>{{orgInfoById.name}}</span>
            <!-- <span slot="title" style="margin-left:20px"><strong>当前岗位：</strong>岗位1</span> -->
            <Form ref="formInline" :label-width="100" inline>
              <FormItem label="员工名称:" prop="code">
                <Input type="text" placeholder="员工名称" v-model="searchConName" />
              </FormItem>
              <FormItem label="员工代码:" prop="name">
                <Input type="text" placeholder="员工代码" v-model="searchConCode" />
              </FormItem>

              <FormItem>
                <Button type="primary" @click="search()">搜索</Button>
                <Button type="primary" @click="createNewEmployee">新增</Button>
              </FormItem>
            </Form>

            <Table border :columns="employeesColumn" :data="employeeListUnderOrg.content"></Table>
            <Row type="flex" justify="end" style="margin-top: 20px;">
              <Col>
              <Page transfer show-sizer show-elevator show-total :total='employeeListUnderOrg.totalElements' :page-size="this.pageSize" @on-page-size-change="pageSizeChange" @on-change="pageChange"></Page>
              </Col>
            </Row>
          </Card>
          <Card class="childCard" v-show="!isOrgPanel">

            <span slot="title" style="margin-left:20px"><strong>当前岗位：</strong>{{positionInfoById.name}}</span>
            <Form ref="formInline" :label-width="100" inline>
              <FormItem label="员工名称:" prop="code">
                <Input type="text" placeholder="员工名称" v-model="searchConName1" />
              </FormItem>
              <FormItem label="员工代码:" prop="name">
                <Input type="text" placeholder="员工代码" v-model="searchConCode1" />
              </FormItem>

              <FormItem>
                <Button type="primary" @click="search1">搜索</Button>
                <!-- <Button type="primary" style="margin-left: 50px">重置</Button> -->
                <Button type="primary" @click="createNewEmployeeAss">关联</Button>
              </FormItem>
            </Form>

            <Table border :columns="employeesColumn" :data="employeeListUnderPosition.content"></Table>
            <Row type="flex" justify="end" style="margin-top: 20px;">
              <Col>
              <Page show-sizer transfer show-elevator show-total :total='employeeListUnderPosition.totalElements' :page-size="this.pageSize" @on-page-size-change="pageSizeChange3" @on-change="pageChange3"></Page>
              </Col>
            </Row>
          </Card>
        </TabPane>


      </Tabs>
      <Card class="childCard" v-show="!AssIconShow">
        <p>
          请点击菜单树选择机构或岗位
        </p>

      </Card>
      </Col>
      </Col>
    </Row>
  </Card>
  <!-- 关联上级机构 -->
  <Modal :mask-closable="false" v-model="parentOrg" title="请点击选择组织机构" @on-cancle="selectOrgCancle">
    <div style="padding:10px 20px;">
      <h4>您已选择机构 ：{{selectOrg}}</h4>
      <Tree :data="treeData1" :load-data="loadData" :render="renderContent1" @on-select-change="treeSelectOrg"></Tree>
    </div>
    <div slot="footer">
      <Button type="text" @click="selectOrgCancle">取消</Button>
      <Button type="primary" @click="selectOrgOk">保存</Button>
    </div>
  </Modal>
  <Modal :mask-closable="false" v-model="modal1" title="创建机构\岗位" @on-ok="chooseOk">
    <RadioGroup v-model="chooseNew">
      <Radio label="organization" select>
        <Icon type="network"></Icon>
        <span>组织机构</span>
      </Radio>
      <Radio label="position" v-show="!isRootNode">
        <Icon type="android-person"></Icon>
        <span>岗位</span>
      </Radio>
    </RadioGroup>
  </Modal>
  <!-- 新增组织机构 -->
  <Modal :mask-closable="false" v-model="newOrg" title="组织机构信息" width="800">
    <div style="padding:10px 20px;">
      <Form :rules="ruleValidate" ref="newOrgInfo" :model="newOrgInfo">
        <Row>
          <Col span="12">
          <FormItem label="机构名称:" label-position="left" :label-width="100" prop="name">
            <Input class="inputSty" v-model="newOrgInfo.name"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="机构代码:" label-position="left" :label-width="100" prop="code">
            <Input class="inputSty" v-model="newOrgInfo.code"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>

          <Col span="12">
          <FormItem label="上级机构:" label-position="left" :label-width="100">
            <Input class="inputSty" v-model="orgInfoById.name" disabled> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="机构类型:" label-position="left" :label-width="100">
            <Select v-model="newOrgInfo.type" class="inputSty">
            <Option v-for="(item,key) in orgTypeSelect" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="机构等级:" label-position="left" :label-width="100">
            <Select v-model="newOrgInfo.grade" class="inputSty">
            <Option v-for="(item,key) in orgLevelSelect" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="机构状态:" label-position="left" :label-width="100">
            <Select v-model="newOrgInfo.status" class="inputSty">
            <Option v-for="(item,key) in orgStatusSelect" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="排序顺序:" label-position="left" :label-width="100" prop="sortNo">
            <Input class="inputSty" v-model="newOrgInfo.sortNo"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="所属地域:" label-position="left" :label-width="100">
            <Input class="inputSty" v-model="newOrgInfo.region"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="机构地址:" label-position="left" :label-width="100">
            <Input class="inputSty" v-model="newOrgInfo.address"> 10 </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="邮编:" label-position="left" :label-width="100" prop="postCode">
            <Input class="inputSty" v-model="newOrgInfo.postCode"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="联系人:" label-position="left" :label-width="100">
            <Input class="inputSty" v-model="newOrgInfo.contact"> 10 </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="联系电话:" label-position="left" :label-width="100" prop="contactNumber">
            <Input class="inputSty" v-model="newOrgInfo.contactNumber"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="描述:" label-position="left" :label-width="100" prop="description">
            <Input type="textarea" class="inputSty" style="width:92%" v-model="newOrgInfo.description"> 10 </Input>
          </FormItem>

          </Col>
        </Row>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreateOrg">取消</Button>
      <Button type="primary" @click="createOrgOk('newOrgInfo')">保存</Button>
    </div>
  </Modal>
  <!-- 新增岗位 -->
  <Modal :mask-closable="false" v-model="newPosition" title="岗位信息" width="800" :loading="loading" @on-ok="createPositionOk">
    <div style="padding:10px 20px;">
      <Form :rules="ruleValidate" ref="newPositionInfo" :model="newPositionInfo">
        <Row>
          <Col span="12">
          <FormItem label="岗位名称:" label-position="left" :label-width="100" prop="name">
            <Input class="inputSty" v-model="newPositionInfo.name"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="岗位代码:" label-position="left" :label-width="100" prop="code">
            <Input class="inputSty" v-model="newPositionInfo.code"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="岗位状态:" label-position="left" :label-width="100">
            <Select v-model="newPositionInfo.status" class="inputSty">
            <Option v-for="(item,key) in orgStatusSelect" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="同级排序顺序:" label-position="left" :label-width="100" prop="sortNo">
            <Input class="inputSty" v-model="newPositionInfo.sortNo"> </Input>
          </FormItem>
          </Col>
        </Row>

      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cancleCreatePosition">取消</Button>
      <Button type="primary" @click="createPositionOk('newPositionInfo')">保存</Button>
    </div>
  </Modal>

  <!-- 新增员工 -->
  <Modal :mask-closable="false" v-model="newEmployee" title="员工信息" width="800">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="newEmployeeInfo" :model="newEmployeeInfo">
        <Row>
          <Col span="12">
          <FormItem label="员工姓名:" label-position="left" :label-width="100" prop="name">
            <Input placeholder="员工姓名" v-model="newEmployeeInfo.name" style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="员工代码:" label-position="left" :label-width="100" prop="code">
            <Input placeholder="员工代码" v-model="newEmployeeInfo.code" style="width:200px"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="公司邮箱:" label-position="left" :label-width="100" prop="oEmail">
            <Input placeholder="公司邮箱" v-model="newEmployeeInfo.oEmail" style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="入职日期:" label-position="left" :label-width="100">
            <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="newEmployeeInfo.inDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="状态:" label-position="left" :label-width="100">
            <!-- <Input placeholder="状态" v-model="newEmployeeInfo.status" style="width:200px"> </Input> -->
            <Select v-model="newEmployeeInfo.status" class="inputSty" style="width:200px">
            <Option v-for="(item,key) in employeeStatus" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="离职日期:" label-position="left" :label-width="100">
            <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="newEmployeeInfo.outDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          是否关联用户账号：
          <RadioGroup v-model="assAccount" @on-change="isAssAccount">
            <Radio label="assYes">
              <span> 是</span>
            </Radio>
            <Radio label="assNo">

              <span>否</span>
            </Radio>

          </RadioGroup>
        </Row>

        <Collapse v-model="collapseParam" style="margin-top:10px" v-show="assAccount == 'assYes'">
          <Panel name="1">
            <p slot="content">
              <RadioGroup v-model="vertical" vertical>
                <Radio label="exist">
                  <span>关联已有账号    
                   <Poptip trigger="hover" content="输入关键字搜索">
                      <Select
                        v-model="assSelect"
                        filterable
                        remote
                        :remote-method="remoteMethod"
                        :loading="loading1">
                        <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
                      </Select>
                  </Poptip>
                  
                </span>
                </Radio>
                <Radio label="create">

                  <span>创建新账号</span>
                </Radio>

              </RadioGroup>
              <Row>
                <Col span="12">
                <FormItem label="用户账号:" label-position="left" :label-width="100" v-if="(vertical == 'create')&&(assAccount == 'assYes')" prop="userAccount.username" :rules="[{
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
                    }]">
                  <Input placeholder="用户账号" v-model="newEmployeeInfo.userAccount.username" style="width:200px"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="用户名称:" label-position="left" :label-width="100"   v-if="(vertical == 'create')&&(assAccount == 'assYes')" prop="userAccount.name" :rules="[{
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
                    }]">
                  <Input placeholder="用户名称" v-model="newEmployeeInfo.userAccount.name" style="width:200px" > </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Poptip trigger="hover" content="密码默认为000000">
                  <FormItem label="登录密码:" label-position="left" :label-width="100"  v-if="(vertical == 'create')&&(assAccount == 'assYes')"  prop="userAccount.password" :rules="[
                    {
                      type: 'string',
                      max: 30,
                      message: '最大不能超过30字符',
                      trigger: 'blur'
                    }]">
                    <Input type="password" value="000000" class="inputSty" style="width:200px" v-if="(vertical == 'create')&&(assAccount == 'assYes')" placeholder="登录密码,密码默认为000000" v-model="newEmployeeInfo.userAccount.password"> </Input>
                  </FormItem>
                </Poptip>
                </Col>
                <Col span="12">
                <FormItem label="密码失效时间:" label-position="left" :label-width="100" v-if="(vertical == 'create')&&(assAccount == 'assYes')" >
                  <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="newEmployeeInfo.userAccount.passwordExpiredDate"></DatePicker>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="有效开始时间:" label-position="left" :label-width="100" v-if="(vertical == 'create')&&(assAccount == 'assYes')">
                  <DatePicker type="date" placeholder="Select time" style="width: 200px"  v-model="newEmployeeInfo.userAccount.startValidDate"></DatePicker>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="有效截止时间:" label-position="left" :label-width="100"  v-if="(vertical == 'create')&&(assAccount == 'assYes')">
                  <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="newEmployeeInfo.userAccount.accountExpiredDate"></DatePicker>
                </FormItem>
                </Col>
              </Row>
            </p>
          </Panel>

        </Collapse>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="newEmployee=false">取消</Button>
      <Button type="primary" @click="createEmployeeOk('newEmployeeInfo')">保存</Button>
    </div>
  </Modal>


  <!-- 编辑员工 -->
  <Modal :mask-closable="false" v-model="updateEmployee" title="员工信息" width="800">
    <div style="padding:10px 20px;">
      <Form :label-width="100" inline :rules="ruleValidate" ref="updateEmployeeInfo" :model="updateEmployeeInfo">
        <Row>
          <Col span="12">
          <FormItem label="员工姓名:" label-position="left" :label-width="100" prop="name">
            <Input placeholder="员工姓名" v-model="updateEmployeeInfo.name" style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="员工代码:" label-position="left" :label-width="100" prop="code">
            <Input placeholder="员工代码" disabled v-model="updateEmployeeInfo.code" style="width:200px"> </Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="公司邮箱:" label-position="left" :label-width="100" prop="oEmail">
            <Input placeholder="公司邮箱" v-model="updateEmployeeInfo.oEmail" style="width:200px"> </Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="入职日期:" label-position="left" :label-width="100">
            <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="updateEmployeeInfo.inDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="状态:" label-position="left" :label-width="100">
            <!-- <Input placeholder="状态" v-model="newEmployeeInfo.status" style="width:200px"> </Input> -->
            <Select v-model="updateEmployeeInfo.status" class="inputSty" style="width:200px">
            <Option v-for="(item,key) in employeeStatus" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="离职日期:" label-position="left" :label-width="100">
            <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="updateEmployeeInfo.outDate"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          是否关联用户账号：
          <RadioGroup v-model="assAccount1" @on-change="isAssAccount1">
            <Radio label="assYes">
              <span> 是</span>
            </Radio>
            <Radio label="assNo">

              <span>否</span>
            </Radio>

          </RadioGroup>
        </Row>

        <Collapse v-model="collapseParam" style="margin-top:10px" v-show="assAccount1 == 'assYes'">
          
          <Panel name="1">
           <span> 已关联账号为：{{labelDefault}} </span>
            <p slot="content">
             
              <RadioGroup v-model="vertical" vertical>
                <Radio label="exist">
                  <span>关联已有账号    
                   <Poptip trigger="hover" content="输入关键字搜索">
                      <Select
                        v-model="assSelect"
                        filterable
                        remote
                        :remote-method="remoteMethod"
                        :loading="loading1">
                        <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
                      </Select>
                  </Poptip>
                  
                </span>
                </Radio>
                <Radio label="create">

                  <span>创建新账号</span>
                </Radio>

              </RadioGroup>
              <Row>
                <Col span="12">
                <FormItem label="用户账号:" label-position="left" :label-width="100" v-if="(vertical == 'create')&&(assAccount1 == 'assYes')" prop="userAccount.username" :rules="[{
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
                    }]">
                  <Input placeholder="用户账号" v-model="updateEmployeeInfo.userAccount.username" style="width:200px"> </Input>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="用户名称:" label-position="left" :label-width="100" v-if="(vertical == 'create')&&(assAccount1 == 'assYes')" prop="userAccount.name" :rules="[{
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
                    }]">
                  <Input placeholder="用户名称" v-model="updateEmployeeInfo.userAccount.name" style="width:200px"> </Input>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Poptip trigger="hover" content="密码默认为000000">
                  <FormItem label="登录密码:" label-position="left" :label-width="100"  v-if="(vertical == 'create')&&(assAccount1 == 'assYes')"  prop="userAccount.password" :rules="[
                    {
                      type: 'string',
                      max: 30,
                      message: '最大不能超过30字符',
                      trigger: 'blur'
                    }]">
                    <Input type="password" value="000000" class="inputSty" style="width:200px" placeholder="登录密码,密码默认为000000" v-model="updateEmployeeInfo.userAccount.password"> </Input>
                  </FormItem>
                </Poptip>
                </Col>
                <Col span="12">
                <FormItem label="密码失效时间:" label-position="left" v-if="(vertical == 'create')&&(assAccount1 == 'assYes')" :label-width="100">
                  <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="updateEmployeeInfo.userAccount.passwordExpiredDate"></DatePicker>
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <FormItem label="有效开始时间:" label-position="left" v-if="(vertical == 'create')&&(assAccount1 == 'assYes')" :label-width="100">
                  <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="updateEmployeeInfo.userAccount.startValidDate"></DatePicker>
                </FormItem>
                </Col>
                <Col span="12">
                <FormItem label="有效截止时间:" label-position="left" v-if="(vertical == 'create')&&(assAccount1 == 'assYes')" :label-width="100">
                  <DatePicker type="date" placeholder="Select time" style="width: 200px" v-model="updateEmployeeInfo.userAccount.accountExpiredDate"></DatePicker>
                </FormItem>
                </Col>
              </Row>
            </p>
          </Panel>

        </Collapse>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="updateEmployee=false">取消</Button>
      <Button type="primary" @click="updateEmployeeOk('updateEmployeeInfo')">保存</Button>
    </div>
  </Modal>
  <!-- 关联员工 -->
  <Modal :mask-closable="false" v-model="newEmployeeAss" title="关联员工" width="800">
    <div style="padding:10px 20px;">
      <Card>
        <Table highlight-row ref="AssEmployeesColumn" border :columns="AssEmployeesColumn" :data="employeeAssList.content" @on-selection-change="selectEmployee"></Table>
        <Row type="flex" justify="end" style="margin-top: 20px;">
          <Col>
          <Page show-sizer transfer show-elevator show-total :total='employeeAssList.totalElements' :page-size="this.pageSize2" @on-page-size-change="pageSizeChange1" @on-change="pageChange1"></Page>
          </Col>
        </Row>
      </Card>
    </div>
    <div slot="footer">


      <Button type="text" @click="newEmployeeAss=false">取消</Button>
      <Button type="primary" @click="submit()">提交</Button>
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
  name: "org-manage",
  data() {
    return {
      AssIconShow: false,
      selectOrg: '',
      employeeId: 0,
      orgTab: true,
      newOrg: false,
      loading: false,
      modal1: false,
      newPosition: false,
      chooseNew: 'organization',
      pageSize: 10,
      page1: 0,
      page: 0,
      pageSize1: 10,
      pageSize2: 10,
      newEmployeeAss: false,
      expandId: 0,
      newOrgInfo: {
        name: '',
        code: '',
        // parentName: '',
        parentId: '',
        type: '',
        grade: '',
        status: '',
        sortNo: '',
        region: '',
        address: '',
        postCode: '',
        contact: '',
        contactNumber: '',
        description: ''
      },

      newEmployeeInfo: {
        "associateAccountId": '',
        "code": "",
        "inDate": "",
        "name": "",
        "oEmail": "",
        "outDate": "",
        "realName": "",
        "status": "",
        "userAccount": {
          "accountExpiredDate": "",
          "email": "",
          "name": "",
          "password": "000000",
          "passwordExpiredDate": "",
          "startValidDate": "",
          "status": "",
          "username": ""
        }

      },
      updateEmployeeInfo: {
        "associateAccountId": '',
        "code": "",
        "inDate": "",
        "name": "",
        "oEmail": "",
        "outDate": "",
        "realName": "",
        "status": "",
        "userAccount": {
          "accountExpiredDate": "",
          "email": "",
          "name": "",
          "password": "000000",
          "passwordExpiredDate": "",
          "startValidDate": "",
          "status": "",
          "username": ""
        }

      },
      newPositionInfo: {
        name: '',
        code: '',
        status: '',
        sortNo: '',
        organizationId: '',
      },
      updateEmployee: false,
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
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '只允许输入大小写字母、数字、下划线',
            trigger: 'blur'
          }
        ],
        contactNumber: [{
          required: false,
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
          message: '请输入正确的联系方式',
          trigger: 'blur',
          // transform: value => +value
        }],
        postCode: [{
          required: false,
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[1-9][0-9]{5}$/,
          message: '请输入正确的邮编',
          trigger: 'blur',
          // transform: value => +value
        }],
        sortNo: [{
          type: 'number',
          message: '请输入数字',
          required: false,
          trigger: 'blur',
          transform(value) {
            return Number(value)
          }
        }, {
          type: 'number',
          max: 99999,
          min: 0,
          message: '请输入0~99999之间的数字',
          trigger: 'blur'
        }],
        oEmail: [{
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
        description: [{
          type: 'string',
          max: 200,
          message: '最大不能超过200字符',
          trigger: 'blur'
        }]
      },

      isRootNode: false,
      newEmployee: false,
      assSelect: '',
      labelDefault: '',
      submitIds: [],
      parentOrg: false,
      selectOrgItem: {},
      vertical: 'exist',
      assAccount: 'assNo',
      assAccount1: 'assNo',
      loading1: false,
      options1: [],
      collapseParam: '',
      searchConName: '',
      searchConCode: '',
      searchConName1: '',
      searchConCode1: '',

      orgTypeSelect: [],
      modelOrgType: '',
      orgLevelSelect: [],
      modelOrgLevel: '',
      orgStatusSelect: [],
      modelOrgStatus: '',
      employeeStatus: [],
      employeeListUnderOrg: [],
      model1: '',
      nodeId: '',
      isOrgPanel: true,
      tabStatus: 'local',

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
          key: 'oEmail',
          editable: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            let editVisible = 'inline';
            if (!this.isOrgPanel) {
              editVisible = 'none'
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: editVisible
                },
                on: {
                  click: () => {
                    this.getEmployeeInfo(params);
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
    };
  },
  methods: {
    ...mapActions([
      'getOrgTree', //获取组织机构员工树
      'getOrgInfoById',
      'getPositionInfoById',
      'getEmployeeUnderOrgList',
      'getAssEmployeeAccount',
      'getEmployeeUnderPostionList',
      'getEmployeeAssList'
    ]),
    renderContent(h, {
      root,
      node,
      data
    }) {
      var iconType = '';
      var addIcon = {};
      if (data.orgtype == 'organization') {
        iconType = 'network';
        addIcon = h('Button', {
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
              this.isRootNode = false
            }
          }
        })
      } else {
        iconType = 'android-person';
        addIcon = []
      }

      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          cursor: 'pointer'

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
              type: iconType
            },
            style: {
              marginRight: '8px'
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
            marginRight: '32px'
          }
        }, [
          addIcon,
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
    renderContent1(h, {
      root,
      node,
      data
    }) {
      var iconType = '';
      var addIcon = {};
      if (data.orgtype == 'organization') {
        iconType = 'network';
        addIcon = h('Button', {
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
              this.isRootNode = false
            }
          }
        })
      } else {
        iconType = 'android-person';
        addIcon = []
      }

      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          cursor: 'pointer'

        },
        on: {
          click: () => {
            this.treeSelectOrg(data)
          }
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
        ])
      ]);
    },
    selectParent() {
      this.selectOrg = this.orgInfoById.parentName
      this.parentOrg = true
    },
    treeSelectOrg(data) {
      console.log(data)
      this.selectOrgItem = Object.assign({}, data)
      this.selectOrg = this.selectOrgItem.title
      //  this.orgInfoById.parentId = item[0].id
    },
    selectOrgCancle() {
      this.selectOrgItem = {}
      this.parentOrg = false
      // this.parentOrg =   this.orgInfoById.parentName
    },
    selectOrgOk() {
      console.log(this.selectOrgItem)
      if (JSON.stringify(this.selectOrgItem) == "{}") {
        this.$Message.error('请选择节点！')
      } else if (this.selectOrgItem.orgtype === "position") {
        this.$Message.error('不能移动至岗位下，请重新选择！')
      } else if (this.orgInfoById.id == this.selectOrgItem.parentId) {
        this.$Message.error('不能移动至自己的子节点下，请重新选择！')
      } else {
        if (this.orgInfoById.id == this.selectOrgItem.id) {
          this.$Message.error('不能将机构移动到自身节点下')
          return
        } else {
          this.orgInfoById.parentName = this.selectOrgItem.title
          this.orgInfoById.parentId = this.selectOrgItem.id
          this.parentOrg = false
        }
      }



    },
    loadData(item, callback) {
      this.expandId = item.id
      setTimeout(() => {
        var childNode = []
        api.orgManager.getOrgListTree({
          queryParams: {
            parentId: item.id
          }
        }).then(res => {
          console.log(res.data)
          res.data.map(item => {
            let obj = {};
            obj.title = item.name;
            if (!item.leaf && item.ogType == "organization") {
              obj.loading = false;
            }
            obj.parentId = item.parentId;
            obj.id = item.id;
            obj.children = [];
            obj.orgtype = item.ogType;
            childNode.push(obj);
          })
          callback(childNode)
        })
      }, 200);
    },

    async treeSelect(data) {
      // console.log(data.title)
      // this.newOrgInfo.parentName = data.title;
      // console.log(data.id)
      this.AssIconShow = true;
      this.newOrgInfo.parentId = data.id;
      this.newPositionInfo.organizationId = data.id;
      this.nodeId = data.id;

      if (data.orgtype == "organization") {
        this.$refs.orgInfoById.resetFields();
        this.isOrgPanel = true;
        this.orgTab = true;
        this.getOrgInfoById(data.id)

        api.orgManager.getOrgUnderEmployeeById({
          pathParams: {
            id: this.nodeId
          },
        }).then(res => {
          console.log(res.data)
          this.employeeListUnderOrg = res.data
        })
        //   console.log(data)


      } else {
        this.$refs.positionInfoById.resetFields();
        this.isOrgPanel = false
        this.orgTab = false;
        this.getPositionInfoById(data.id)
        this.getEmployeeUnderPostionList({
          id: data.id,
          employeeName: '',
          employeeCode: '',
          page: '',
          pageSize: this.pageSize,
          sort: ''
        })
      }
    },
    remoteMethod(query) {
      this.getAssEmployeeAccount().then(() => {
        if (query !== '') {
          this.loading1 = true;
          setTimeout(() => {
            this.loading1 = false;
            this.options1 = this.assAccountList.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
          }, 200);
        } else {
          this.options1 = [];
        }
      })

    },
    append(node) {
      this.newOrgInfo.status = this.orgStatusSelect[0].value
      this.newPositionInfo.status = this.orgStatusSelect[0].value
      this.modal1 = true;
      this.orgInfoById.name = ''
    },
    chooseOk() {
      if (this.chooseNew == 'organization') {
        this.$refs.newOrgInfo.resetFields();
        this.newOrg = true
      } else {
        this.$refs.newPositionInfo.resetFields();
        this.newPosition = true
      }
    },
    createOrgOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.orgManager.createNewOrg({

            data: this.newOrgInfo
          }).then(res => {
            if (res.status == 200) {
              this.newOrg = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getOrgTree('');

            this.newOrgInfo = {
              name: '',
              code: '',
              // parentName: '',
              parentId: '',
              type: '',
              grade: '',
              status: '',
              sortNo: 0,
              region: '',
              address: '',
              postCode: '',
              contact: '',
              contactNumber: '',
              description: ''
            }
          })
        } else {
          this.$Message.warning('创建失败!');

        }
      })

    },
    cancleCreateOrg() {
      this.newOrg = false;
      this.newOrgInfo = {
        name: '',
        code: '',
        // parentName: '',
        parentId: '',
        type: '',
        grade: '',
        status: '',
        sortNo: 0,
        region: '',
        address: '',
        postCode: '',
        contact: '',
        contactNumber: '',
        description: ''
      }
    },
    createPositionOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.positionManager.createNewPosition({

            data: this.newPositionInfo
          }).then(res => {
            if (res.status == 200) {
              this.newPosition = false;
              this.$Message.success('创建成功!');
            } else {
              this.$Message.warning('创建失败!');
            }
            this.getOrgTree('');

            this.newPositionInfo = {
              name: '',
              code: '',
              status: '',
              sortNo: '',
              organizationId: '',
            }
          })
        } else {
          this.$Message.warning('创建失败!');

        }
      })
    },
    cancleCreatePosition() {
      this.newPosition = false;
      this.newPositionInfo = {
        name: '',
        code: '',
        status: '',
        sortNo: '',
        organizationId: '',
      }

    },
    updateOrgInfo(name) {
      console.log(this.orgInfoById)
      this.$refs[name].validate((valid) => {
        if (valid) {
          api.orgManager.updateOrgById({

            pathParams: {
              id: this.nodeId,
            },
            data: this.orgInfoById
          }).then(res => {
            if (res.status == 200) {
              this.$Message.success('更新成功!');
            } else {
              this.$Message.warning('更新失败!');
            }
            this.getOrgTree('');
          })
        } else {
          this.$Message.warning('更新失败!');

        }
      })
    },
    //更新岗位信息
    updatePositionInfo(name) {

      this.$refs[name].validate((valid) => {
        if (valid) {
          api.positionManager.updatePositionById({

            pathParams: {
              id: this.nodeId,
            },
            data: this.positionInfoById
          }).then(res => {
            if (res.status == 200) {
              this.$Message.success('更新成功!');
            } else {
              this.$Message.warning('更新失败!');
            }
            this.getOrgTree('');
          })
        } else {
          this.$Message.warning('更新失败!');

        }
      })
    },

    remove(data, node) {
      if(node.node.loading==false){
        this.$Message.warning('不能删除含有子节点的节点!');
        return false
      }
      if (node.node.orgtype == 'organization') {
        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            api.orgManager.deleteOrgById({
              pathParams: {
                id: node.node.id,
              }
            }).then(res => {
              if (res.status == 204) {
                this.$Message.success('删除成功!');
              } else {
                this.$Message.warning('删除失败!');
              }
              this.getOrgTree('');
              this.AssIconShow = false
            })
          }
        });

      } else {
        this.$Modal.confirm({
          title: '警告',
          content: '确认要删除吗',
          // loading: true,
          onOk: () => {
            api.positionManager.deletePositionById({
              pathParams: {
                id: node.node.id,
              }
            }).then(res => {
              if (res.status == 204) {
                this.$Message.success('删除成功!');
              } else {
                this.$Message.warning('删除失败!');
              }
              this.getOrgTree('');
              this.AssIconShow = false
            })
          }
        });
      }
    },
    createNewEmployee() {
      if (!this.nodeId) {
        this.$Modal.warning({
          title: '警告',
          content: '请选择机构或者岗位！'
        });
        return
      };
      this.$refs.newEmployeeInfo.resetFields();
      this.newEmployee = true
    },
    createNewEmployeeAss() {
      if (!this.nodeId) {
        this.$Modal.warning({
          title: '警告',
          content: '请选择机构或者岗位！'
        });
        return
      }
      this.newEmployeeAss = true;
      this.getEmployeeAssList({
        id: this.nodeId,
        page: 0,
        size: this.pageSize2,
        sort: ''
      })
    },
    isAssAccount(value) {
      console.log(value)
      if (value == "assYes") {

        this.collapseParam = '1'
      } else {

        this.collapseParam = ''
      }
    },
    createEmployeeOk(name) {

      this.newEmployeeInfo.associateAccountId = this.assSelect
      var newParams = {}
      if (this.collapseParam == '') {
        newParams = {
          // "associateAccountId": '',
          "code": this.newEmployeeInfo.code,
          "inDate": util.getTimeString(this.newEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
          "name": this.newEmployeeInfo.name,
          "oEmail": this.newEmployeeInfo.oEmail,
          "outDate": util.getTimeString(this.newEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
          "status": this.newEmployeeInfo.status,
        }
      } else {
        if (this.vertical == 'exist') {
          if (!this.newEmployeeInfo.associateAccountId) {

            this.$Message.error('请关联已有账号！不关联账号请在“是否关联用户账号”项选择“否”！');
            return false
          }
          newParams = {
            "associateAccountId": this.newEmployeeInfo.associateAccountId,
            "code": this.newEmployeeInfo.code,
            "inDate": util.getTimeString(this.newEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
            "name": this.newEmployeeInfo.name,
            "oEmail": this.newEmployeeInfo.oEmail,
            "outDate": util.getTimeString(this.newEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
            "status": this.newEmployeeInfo.status,
          }
        } else {
          if (!(this.newEmployeeInfo.code || this.newEmployeeInfo.name)) {

            this.$Message.error('请输入用户账号和用户名称！');
            return false
          }
          newParams = {

            "code": this.newEmployeeInfo.code,
            "inDate": util.getTimeString(this.newEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
            "name": this.newEmployeeInfo.name,
            "oEmail": this.newEmployeeInfo.oEmail,
            "outDate": util.getTimeString(this.newEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
            "status": this.newEmployeeInfo.status,
            "userAccount": {
              "accountExpiredDate": util.getTimeString(this.newEmployeeInfo.userAccount.accountExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
              "email": "",
              "name": this.newEmployeeInfo.userAccount.name,
              "password": this.newEmployeeInfo.userAccount.password,
              "passwordExpiredDate": util.getTimeString(this.newEmployeeInfo.userAccount.passwordExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
              "startValidDate": util.getTimeString(this.newEmployeeInfo.userAccount.startValidDate, 'YYYY-MM-DD HH:mm:ss'),
              "status": 1,
              "username": this.newEmployeeInfo.userAccount.username
            }
          }
        }
      }

      if (this.isOrgPanel) {

        this.$refs[name].validate((valid) => {
          if (valid) {
            api.orgManager.createNewEmployee({

              pathParams: {
                id: this.nodeId
              },
              data: newParams
            }).then(res => {
              if (res.status == 200) {
                this.newEmployee = false
                this.$Message.success('创建成功!');
              } else {
                this.$Message.warning('创建失败!');
              }


              this.newEmployeeInfo = {
                "associateAccountId": '',
                "code": "",
                "inDate": "",
                "name": "",
                "oEmail": "",
                "outDate": "",
                "realName": "",
                "status": "",
                "userAccount": {
                  "accountExpiredDate": "",
                  "email": "",
                  "name": "",
                  "password": "000000",
                  "passwordExpiredDate": "",
                  "startValidDate": "",
                  "status": "",
                  "username": ""
                }

              }
            }).then(() => {
              api.orgManager.getOrgUnderEmployeeById({
                pathParams: {
                  id: this.nodeId
                },
                queryParams: {
                  employeeName: this.searchConName,
                  employeeCode: this.searchConCode,
                  page: '',
                  size: this.pageSize,
                  sort: ''
                }
              }).then(res => {
                this.employeeListUnderOrg = res.data
              })
            })

          } else {
            this.$Message.warning('创建失败!');

          }
        })

      }
    },
    //更新组织机构信息
    cancleCreateEmployee(name) {
      this.newEmployeeInfo = {
        "associateAccountId": '',
        "code": "",
        "inDate": "",
        "name": "",
        "oEmail": "",
        "outDate": "",
        "realName": "",
        "status": "",
        "userAccount": {
          "accountExpiredDate": "",
          "email": "",
          "name": "",
          "password": "000000",
          "passwordExpiredDate": "",
          "startValidDate": "",
          "status": "",
          "username": ""
        }

      }
    },
    search() {
      // this.getEmployeeUnderOrgList({
      //   id: this.nodeId,
      //   employeeName: this.searchConName,
      //   employeeCode: this.searchConCode,
      //   page: '',
      //   pageSize: this.pageSize,
      //   sort: ''
      // })
      api.orgManager.getOrgUnderEmployeeById({
        pathParams: {
          id: this.nodeId
        },
        queryParams: {
          employeeName: this.searchConName,
          employeeCode: this.searchConCode,
          page: '',
          size: this.pageSize,
          sort: ''
        }
      }).then(res => {
        this.employeeListUnderOrg = res.data
      })
    },
    //改变每页显示条数
    pageSizeChange(value) {

      this.pageSize = value;
      // this.getEmployeeUnderOrgList({
      //   id: this.nodeId,
      //   employeeName: this.searchConName,
      //   employeeCode: this.searchConCode,
      //   page: '',
      //   pageSize: this.pageSize,
      //   sort: ''
      // })
      if (this.isOrgPanel) {
        // alert(1)
        api.orgManager.getOrgUnderEmployeeById({
          pathParams: {
            id: this.nodeId
          },
          queryParams: {
            employeeName: this.searchConName,
            employeeCode: this.searchConCode,
            page: '',
            size: this.pageSize,
            sort: ''
          }
        }).then(res => {
          this.employeeListUnderOrg = res.data
        })
      }

    },
    //改变页码
    pageChange(value) {
      console.log(value)
      api.orgManager.getOrgUnderEmployeeById({
        pathParams: {
          id: this.nodeId
        },
        queryParams: {
          employeeName: this.searchConName,
          employeeCode: this.searchConCode,
          page: value - 1,
          pageSize: this.pageSize,
          sort: ''
        }
      }).then(res => {
        this.employeeListUnderOrg = res.data
      })
    },

    getEmployeeInfo(params) {
       this.labelDefault = '';
      this.$refs.updateEmployeeInfo.resetFields();
      this.updateEmployee = true;
      this.employeeId = params.row.id;
      api.employeeManager.getEmployeeInfo({
        pathParams: {
          id: params.row.id
        }
      }).then(res => {
        console.log(res)
        if (!res.data.userProfile) {
          this.assAccount1 = 'assNo'
           this.labelDefault = ""
        } else {
          this.assAccount1 = 'assYes';
            this.collapseParam = '1';
            this.labelDefault = res.data.userProfile.userAccount.name
        }
        this.updateEmployeeInfo.code = res.data.code;
        this.updateEmployeeInfo.inDate = res.data.inDate;
        this.updateEmployeeInfo.oEmail = res.data.oEmail;
        this.updateEmployeeInfo.outDate = res.data.outDate;
        this.updateEmployeeInfo.name = res.data.name;
        this.updateEmployeeInfo.status = res.data.status;
      })
    },
    isAssAccount1(value) {


      if (value == "assYes") {

        this.collapseParam = '1'
      } else {

        this.collapseParam = ''
      }
    },
    updateEmployeeOk(name) {
      console.log(this.updateEmployeeInfo)
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.updateEmployeeInfo.associateAccountId = this.assSelect
          var newParams = {}
          if (this.collapseParam == '') {
            newParams = {
              // "associateAccountId": '',
              "code": this.updateEmployeeInfo.code,
              "inDate": this.updateEmployeeInfo.inDate && util.getTimeString(this.updateEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
              "name": this.updateEmployeeInfo.name,
              "oEmail": this.updateEmployeeInfo.oEmail,
              "outDate": this.updateEmployeeInfo.outDate && util.getTimeString(this.updateEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
              "status": this.updateEmployeeInfo.status,
            }
          } else {
            if (this.vertical == 'exist') {
              newParams = {
                "associateAccountId": this.updateEmployeeInfo.associateAccountId,
                "code": this.updateEmployeeInfo.code,
                "inDate": this.updateEmployeeInfo.inDate && util.getTimeString(this.updateEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
                "name": this.updateEmployeeInfo.name,
                "oEmail": this.updateEmployeeInfo.oEmail,
                "outDate": this.updateEmployeeInfo.outDate && util.getTimeString(this.updateEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
                "status": this.updateEmployeeInfo.status,
              }
            } else {
              newParams = {
                "code": this.updateEmployeeInfo.code,
                "inDate": this.updateEmployeeInfo.inDate && util.getTimeString(this.updateEmployeeInfo.inDate, 'YYYY-MM-DD HH:mm:ss'),
                "name": this.updateEmployeeInfo.name,
                "oEmail": this.updateEmployeeInfo.oEmail,
                "outDate": this.updateEmployeeInfo.outDate && util.getTimeString(this.updateEmployeeInfo.outDate, 'YYYY-MM-DD HH:mm:ss'),
                "status": this.updateEmployeeInfo.status,
                "userAccount": {
                  "accountExpiredDate": this.updateEmployeeInfo.userAccount.accountExpiredDate && util.getTimeString(this.updateEmployeeInfo.userAccount.accountExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
                  "email": "",
                  "name": this.updateEmployeeInfo.userAccount.name,
                  "password": this.updateEmployeeInfo.userAccount.password,
                  "passwordExpiredDate": this.updateEmployeeInfo.userAccount.passwordExpiredDate && util.getTimeString(this.updateEmployeeInfo.userAccount.passwordExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
                  "startValidDate": this.updateEmployeeInfo.userAccount.startValidDate && util.getTimeString(this.updateEmployeeInfo.userAccount.startValidDate, 'YYYY-MM-DD HH:mm:ss'),
                  "status": 1,
                  "username": this.updateEmployeeInfo.userAccount.username
                }
              }
            }
          }
          api.employeeManager.updateEmployeeInfo({
            pathParams: {
              id: this.employeeId
            },
            data: newParams
          }).then(res => {
            this.updateEmployee = false;
            if (res.status == 200) {
              this.newEmployee = false
              this.$Message.success('更新成功!');
            } else {
              this.$Message.warning('更新失败!');
            }
          }).then(() => {
            api.orgManager.getOrgUnderEmployeeById({
              pathParams: {
                id: this.nodeId
              },
            }).then(res => {

              this.employeeListUnderOrg = res.data
            })
          })
        } else {
          this.$Message.warning('更新失败!');
        }
      })
    },
    search1() {
      this.getEmployeeUnderPostionList({
        id: this.nodeId,
        employeeName: this.searchConName1,
        employeeCode: this.searchConCode1,
        page: '',
        pageSize: this.pageSize,
        sort: ''
      })
    },
    pageSizeChange3(value) {

      this.pageSize = value;
      if (!this.isOrgPanel) {
        this.getEmployeeUnderPostionList({

          id: this.nodeId,
          employeeName: this.searchConName1,
          employeeCode: this.searchConCode1,
          page: '',
          pageSize: this.pageSize,
          sort: ''
        })
      }

    },
    pageChange3(value) {
      console.log(value)
      this.getEmployeeUnderPostionList({
        id: this.nodeId,
        employeeName: this.searchConName1,
        employeeCode: this.searchConCode1,
        page: value - 1,
        pageSize: this.pageSize,
        sort: ''
      })
    },
    deleteConfirm(params) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认要删除吗',

        onOk: () => {
          if (this.isOrgPanel) {
            api.employeeManager.deleteEmployeeInfo({
              pathParams: {
                id: params.row.id
              }
            }).then(res => {
              if (res.status == 204) {

                this.$Message.success('删除成功!');
              } else {
                this.$Message.warning('删除失败!');
              }
            }).then(() => {
                if (this.isOrgPanel) {
                  api.orgManager.getOrgUnderEmployeeById({
                    pathParams: {
                      id: this.nodeId
                    },
                    queryParams: {
                      employeeName: this.searchConName,
                      employeeCode: this.searchConCode,
                      page: '',
                      size: this.pageSize,
                      sort: ''
                    }
                  }).then(res => {
                    this.employeeListUnderOrg = res.data
                  })
                }
              }

            )
          } else {
            api.positionManager.deleteAssEmployees({
              pathParams: {
                id: this.nodeId
              },
              queryParams: {
                employeeIds: params.row.id
              }
            }).then(res => {
              if (res.status == 200) {

                this.$Message.success('删除成功!');
              } else {
                this.$Message.warning('删除失败!');
              };
              this.getEmployeeUnderPostionList({
                id: this.nodeId,
                employeeName: '',
                employeeCode: '',
                page: '',
                pageSize: this.pageSize,
                sort: ''
              })
            })
          }

        }
      });
    },

    pageSizeChange1(value) {
      this.pageSize2 = value;
      this.getEmployeeAssList({
        id: this.nodeId,
        page: 0,
        size: this.pageSize2,
        sort: ''
      })
    },
    pageChange1(value) {
      this.getEmployeeAssList({
        id: this.nodeId,
        page: value - 1,
        size: this.pageSize2,
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
      api.positionManager.createAssEmployees({
        pathParams: {
          id: this.nodeId
        },
        data: this.submitIds
      }).then(res => {
        if (res.status == 200) {
          this.newEmployeeAss = false;
          this.$Message.success('关联成功!');
        } else {
          this.$Message.warning('关联失败!');
        };
        this.getEmployeeUnderPostionList({
          id: this.nodeId,
          employeeName: '',
          employeeCode: '',
          page: '',
          pageSize: this.pageSize,
          sort: ''
        })
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

  computed: {
    ...mapGetters([
      'orgListTree',
      'orgInfoById',
      'positionInfoById',
      'assAccountList',
      // 'employeeListUnderOrg',
      'employeeListUnderPosition',
      'employeeAssList'
    ]),
    treeData() {
      return [{
        title: '组织机构树',
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
                props: {
                  type: 'ios-folder-outline',

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
                  type: 'primary',
                  size: 'small'
                }),
                style: {
                  width: '52px'
                },
                on: {
                  click: () => {
                    this.newOrgInfo.parentId = ''
                    this.isRootNode = true
                    this.append(data)

                  }
                }
              })
            ])
          ]);
        },
        children: this.orgListTree || []
      }]
    },
    treeData1() {
      return [{
        title: '组织机构树',
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
        children: this.orgListTree || []
      }]
    }
  },
  components: {
    Headline,

  },
  created() {
    this.nodeId = '';
    this.orgInfoById.name = '';
    // this.employeeListUnderOrg = [];
    this.getOrgTree('');
    this.fetchSelectOptions('COF_ORGTYPE', this.orgTypeSelect);
    this.fetchSelectOptions('COF_ORGDEGREE', this.orgLevelSelect);
    this.fetchSelectOptions('COF_ORGSTATUS', this.orgStatusSelect);
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

.ivu-modal .ivu-select-dropdown {
  position: fixed!important;
}
</style>
