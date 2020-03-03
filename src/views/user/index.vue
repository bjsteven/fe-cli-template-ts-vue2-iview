<template>
  <div class="page">
    <div>
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.userName" placeholder="姓名" class="input"/>
          <LazyInput v-model="query.loginName" placeholder="账号" class="input"/>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <div class="acts">
          <Button type="success" icon="md-add-circle" @click="edit(0)">新建用户</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <!-- <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
    <dlgVerify  ref="addOrUpdate" :userOnes="editOne" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { get } from '@/fn/ajax'
import { queryList , changeList } from '@/api/user'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
// import { numberify, numberKeys } from '@/fn/typeCast'
// import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
// import DlgEdit from './dlgEdit.vue'
import dlgVerify from './dlgVerify.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component({
  components: {
    // DlgEdit,
    dlgVerify
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    // id: '',
    userName: '',
    loginName: '',
    // status: null,
    pageIndex: 1,
    pageSize: 20,
    // beginCreateTime: 0,
    // endCreateTime: 0
  }
  query: any = {}
  oldQuery: any = {}
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false
  // query = { ...defQuery }

  loading = false
  list = []
  total = 0
  typeList = []
  editOne: any = null


  statusList = []


  company2 = []

    // <router-link to={{ name: 'user-list-detail', params: { id } }}>{userName}</router-link>

  columns = [
    {
      title: 'ID',// tslint:disable-line
      key: 'id',
      width: 70,
      align: 'center'
    },
    {
      title: '姓名',// tslint:disable-line
      key: 'userName',
      align: 'center',
      render: (hh: any, { row: { userName, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'user-list-detail', params: { id } }}>{userName}</router-link>
        </div>
        /* tslint:enable */
      }
    },
    { title: '账号',// tslint:disable-line
      key: 'loginName',
      align: 'center'
    },
    { title: '用户手机号',// tslint:disable-line
      key: 'mobile',
      align: 'center'
    },
    {
      title: '超级管理员',// tslint:disable-line
      key: 'admin',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { admin } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const adm = admin == true ? '是' : '否'
        return <span class='datetime' v-html={adm}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',// tslint:disable-line
      key: 'statusText',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1){
          return <span class={`status-1`}>正常</span>
        } else if (status == 2){
          return <span class={`status-2`}>锁定</span>
        } else if (status == 3){
          return <span class={`status-3`}>禁用</span>
        }

        /* tslint:enable */
      }
    },
    { title: '公司邮箱',// tslint:disable-line
      key: 'email',
      align: 'center'
    },
    { title: '创建人',// tslint:disable-line
      key: 'createUserName',
      align: 'center'
    },
    {
      title: '创建时间',// tslint:disable-line
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '最后修改人',// tslint:disable-line
      key: 'modifyUserName',
      align: 'center'
    },
    {
      title: '最后修改时间',// tslint:disable-line
      key: 'modifyTime',
      align: 'center',
      render: (hh: any, { row: { modifyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(modifyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',// tslint:disable-line
      key: 'action',
      width: 120,
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a on-click={this.change.bind(this, row.id, row)}>重置密码</a>
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      status: this.statusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        // statusText: it.status == 1 ? '正常' : '停用',
        statusText: it.status,
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    this.resetQuery()
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    // const query: any = {}
    try {
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 新增 / 修改
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  // 重置密码
  async change(id: number, row: any) {
    try {
      await confirm('您确定重置密码吗？')
      await changeList (id)
      this.$Message.success({
        content: `更改成功`,
      })
      this.reloadSearch()
    } catch (ex) {
    }
  }

  dlgEditDone() {
    this.doSearch()
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-corp-id {
    width: 80px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Add-Inp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}
.Add-Inp span {
  display: inline-block;
  width: 7%;
  text-align: right;
  margin-right: 4%;
}
.Add-Inp input {
  display: inline-block;
}
.button2 {
  width: 6%;
  height: 40px;
  margin-left: 5%;
}
.page-f {
  margin-top: 10px;
  font-size: 15px;
}
.bge {
  background: #fff;
  padding: 5px;
}
.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
  </style>
