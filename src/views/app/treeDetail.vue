<template>
  <div class="page">
    <div class="act-bar flex-box">
      <div class="acts">
        <form class="form flex-1">
          <Button class="okbth" type="success" icon="md-add-circle" @click="addNewPage('dataForms')">添加</Button>
        </form>
      </div>
    </div>
    <Form :model="dataForms" :label-width="0" :rules="rules" label-position="left"
      class="form page" ref="dataForms">
      <Row :gutter="10">
        <Col span="12">
          <div>ID</div>
          <FormItem label="" >
            <Input v-model="pageId" :readonly="true" placeholder="由系统自动生成"/>
          </FormItem>
        </Col>
        <Col span="12">
          <div>名称</div>
          <FormItem label="" prop="name">
            <Input v-model="dataForms.name" placeholder="请输入名称"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col span="12">
          <div>图标</div>
          <FormItem label="" prop="icon">
            <div @click="iconEvent"><Input v-model="dataForms.icon" :readonly="true" clearable placeholder="请选择Icon" class="input input-id"/></div>
          </FormItem>
          <Card v-show="iconShow" class="icon-card">
            <p slot="title">
              Icon图标
            </p>
            <div class="mod-menu__icon-list">
              <Button
                v-for="(item, index) in iconList"
                :key="index"
                class="icon-button"
                @click="iconActiveHandle(item)"
                :class="{ 'is-active': item === dataForms.icon }">
                <Icon :type="item" />
              </Button>
            </div>
          </Card>
        </Col>
        <Col span="12">
          <div>父节点</div>
          <FormItem label="" prop="pid">
            <div @click="pidEvent"><Input v-model="pidName" :readonly="true" clearable placeholder="名称" class="input input-id"/></div>
          </FormItem>
          <Card v-show="titleShow" class="icon-card">
            <Tree v-if="type == 1" ref="menuListTree" :data="indata" @on-select-change="treeName"></Tree>
            <Tree v-else ref="menuListTree" :data="datas" @on-select-change="treeName"></Tree>
          </Card>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col span="12">
          <div>url</div>
           <FormItem label="" prop="path">
            <Input v-model="dataForms.path" placeholder="请输入url"/>
          </FormItem>
        </Col>
        <Col span="12">
          <div>查询参数</div>
          <FormItem label="" prop="query">
            <Input v-model="dataForms.query" placeholder="请输入查询参数"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col span="12">
          <div>顺序</div>
          <FormItem label="" prop="order">
            <Input v-model="dataForms.order" placeholder="请输入顺序"/>
          </FormItem>
        </Col>
        <Col span="12">
          <div>是否显示</div>
          <FormItem label="" prop="visible">
            <Select v-model="dataForms.visible">
              <Option :value="1">是</Option>
              <Option :value="0">否</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col span="12">
          <div>是否导航</div>
          <FormItem label="" prop="nav">
            <Select v-model="dataForms.nav">
              <Option :value="1">是</Option>
              <Option :value="0">否</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="2"><Button @click="handleAdd" icon="md-add">添加</Button></Col>
      </Row>
      <Row class="lead-header">
        <Col class="lead">权限列表</Col>
      </Row>
      <Row :gutter="10">
        <Col span="10">
          <div>权限编码</div>
        </Col>
        <Col span="10">
          <div>名称</div>
        </Col>
        <Col span="2">
          <div>操作</div>
        </Col>
      </Row>
      <Row class="authcode" :gutter="10" v-if="dataForms.perms.length>=1"  v-for="(item, index) in dataForms.perms" :key="index">
        <Col :span="5">
         <FormItem
            v-if="item.status"
            :label-width='0'
            :key="index"
            :prop="'perms.' + index + '.code'"
            :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <Input type="text" v-model="item.code" placeholder="权限编码"></Input>
         </FormItem>
        </Col>
        <Col :span="5">
          <FormItem
              v-if="item.status"
              :key="index"
              :label-width='0'
              :prop="'perms.' + index + '.name'"
              :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <Input type="text" v-model="item.name" placeholder="权限名称"></Input>
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem
              v-if="item.status"
              :key="index"
              :label-width='0'
              :prop="'perms.' + index + '.urlPattern'"
              :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <Input type="text" v-model="item.urlPattern" placeholder="url表达式，/auth/apps:GET	"></Input>
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem
              v-if="item.status"
              :key="index"
              :label-width='0'
              :prop="'perms.' + index + '.login'"
              :rules="{required: true, message: '请选择登录状态', type: 'boolean', trigger: 'blur'}">
                  <Checkbox v-model="item.login">是否需要登录</Checkbox>
          </FormItem>
        </Col>
        <Col :span="2">
          <Button v-if="item.status" @click="handleRemove(index)">删除</Button>
        </Col>
      </Row>
      <Button class="save" type="info" size="large" @click="edit('dataForms')">保存</Button>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { addAppList, setAppList, findApp } from '@/api/appList.ts'
import ViewBase from '@/util/ViewBase'
import iconList from '@/api/icon'

@Component
export default class TreeDetail extends ViewBase {
  @Prop() data: any

  dataForms: any = {
    name: '',
    perms: [
    ],
    path: '',
    pid: null,
    query: '',
    order: '',
    nav: 1,
    visible: 1,
    icon: '',
  }

  pageId = null
  type = 1
  pidName = ''
  index = 0
  iconList = iconList
  titleShow = false
  iconShow = false
  treeId = null

  get rules() {
    const validatepid = ( rules: any, value: any, callback: any) => {
      if (this.dataForms.pid == 0 || !!this.dataForms.pid) {
        callback()
      } else {
        callback(new Error('请选择父级节点'))
      }
    }
    const rule =  {
      name: [
        { required: true, message: '请输入页面名称', trigger: 'blur'}
      ],
      pid: [
        { validator: validatepid,  message: '请选择父级节点', trigger: 'change'}
      ],
      order: [
        { required: true, message: '请输入排序序号', trigger: 'blur' }
      ],
      nav: [
        { required: true, message: '请选择导航', trigger: 'blur', type: 'number'}
      ],
      path: [
        { required: true, message: '请输入url', trigger: 'blur'}
      ],
      visible: [
        { required: true, message: '请选择是否可见', trigger: 'blur', type: 'number'}
      ]
    }
    return rule
  }

  get datas() {
    const indata = this.data.map((it: any) => {
      return {
        ...it,
        title: it.name,
        selected: it.id == this.treeId ? true : false
      }
    })
    const indatas = this.toTree(indata)
    return indatas
  }

  get indata() {
    const indata = this.data.map((it: any) => {
      return {
        ...it,
        title: it.name,
        selected: it.id == this.treeId ? true : false
      }
    })
    const indatas = this.toTree(indata)
    return indatas
  }

  // 树选中初始化
  async init(row: any, treeData: any) {
    this.titleShow = false
    this.iconShow = false
    try {
      const { data: {
        item
      } } = await findApp({id: row.id})
      const indata = treeData.map((it: any) => {
        if ( it.id == item.pid ) {
          this.pidName = it.name
          return {
            ...it,
            title: it.name,
            selected: true
          }
        } else {
          return {
            ...it,
            expand: true,
            title: it.name,
          }
        }
      })
      this.type = 2
      this.pageId = item.id
      this.treeId = item.pid
      this.dataForms.order = item.order + ''
      this.dataForms.pid = item.pid
      this.dataForms.icon = item.icon
      this.dataForms.name = item.name
      this.dataForms.path = item.path
      this.dataForms.query = item.query
      this.dataForms.nav = item.nav ? 1 : 0
      this.dataForms.visible = item.visible ? 1 : 0
      if ( item.pid == 0) {
        this.pidName = 'Root'
      }
      item.perms ? this.dataForms.perms = item.perms.map((it: any, index: any) => {
        return {
          code: it.code,
          index: index + 1,
          status: 1,
          name: it.name,
          urlPattern: it.urlPattern,
          login: it.login
        }
      }) : this.dataForms.perms = []
      this.index = this.dataForms.perms + 1
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 恢复表单添加
  handleRemove(index: number) {
    this.dataForms.perms[index].status = 0
  }

  iconEvent() {
    this.iconShow = !this.iconShow
  }

  pidEvent() {
    this.titleShow = !this.titleShow
  }

  // 图标选中
  iconActiveHandle(iconName: string) {
    this.dataForms.icon = iconName
    this.iconShow = false
  }

  // 表格里的树数据回填
  treeName(row: any) {
    if (row.length > 0) {
      this.pidName = row[0].title
      this.dataForms.pid = row[0].id
      this.titleShow = false
      this.treeId = row[0].id
    } else {
      this.pidName = ''
      this.dataForms.pid = null
    }
  }

  handleAdd() {
    this.index++
    this.dataForms.perms.push({
      code: '',
      login: false,
      urlPattern: '',
      index: this.index,
      status: 1,
      name: ''
    })
  }

  toTree(data: any) {
    data.forEach((item: any) => {
        delete item.children
    })
    const map: any = {}
    data.forEach((item: any) => {
        map[item.id] = item
    })
    const val: any = []
    data.forEach((item: any) => {
        const parent = map[item.pid]
        if (parent) {
            (parent.children || ( parent.children = [] )).push(item)
        } else {
          val.push(item)
        }
    })
    return val
  }

  // 表单提交
  edit(dataForms: any) {
    (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
       const perms: any = []
        this.dataForms.perms.length > 0 ? this.dataForms.perms.forEach((item: any) => {
          if (item.status == 1) {
            perms.push({
              code : item.code,
              name : item.name,
              urlPattern: item.urlPattern,
              login: item.login
            })
          }
        }) : []
        const query = {
          ...this.dataForms,
          nav: !!this.dataForms.nav,
          visible: !!this.dataForms.visible,
          perms
        }
        try {
          this.type == 1 ? await addAppList(this.$route.params.appId, query)
          : await setAppList(this.$route.params.appId, this.pageId, query)
          this.$emit('treeInit')
          this.addNewPage('dataForms')
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  addNewPage(dataForms: any) {
    (this.$refs[dataForms] as any).resetFields()
    this.pidName = ''
    this.pageId = null
    this.type = 1
    this.dataForms.perms = []
    this.titleShow = false
    this.iconShow = false
    this.treeId = null
    this.$emit('treeadd')
  }

  @Watch('pidName')
  WatchpidName(val: any) {
    if (!val) {
      this.treeId = null
      this.dataForms.pid = null
    }
  }
}
</script>

<style lang="less" scoped>
.acts {
  width: 100%;
}
.okbth {
  margin-top: 8px;
  float: right;
}
.ivu-col-span-12 {
  div {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: bold;
  }
}
.ivu-row {
  margin-bottom: 8px;
}
.lead-header {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  .lead {
    font-size: 20px;
    color: #999;
    font-style: italic;
  }
}
.icon-button {
  font-size: 18px;
  margin-left: 10px;
  margin-bottom: 10px;
}

/deep/ .ivu-card-body {
  min-width: 276px;
  max-height: 200px;
  overflow-y: auto;
}
.authcode {
  margin-bottom: 0;
}
.icon-card {
  position: absolute;
  background: #fff;
  z-index: 999;
}

.is-active {
  color: #15a193;
  background: #ccc;
  border-color: #15a193;
}

.save {
  margin-top: 20px;
}

.ivu-col-span-12 /deep/ .ivu-form-item-error-tip {
  padding-top: 0;
  font-weight: normal;
}

.new-page {
  position: absolute;
  top: -54px;
  left: 0;
}
</style>
