<template>
  <div class="page">
     <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.name" placeholder="名称" class="input input-id"/>
        <!-- <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button> -->
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" @click="edit(0)">创建</Button>
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
    <appList ref="appList" :incontrolStatusList="controlStatusList" @refreshDataList="reloadSearch" v-if="addshow"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { queryList } from '@/api/appList'
import { confirm } from '@/ui/modal'
import appList from './dlgVerify.vue'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY/MM/DD HH:mm:ss'



@Component({
  components: {
    appList
  }
})
export default class Roles extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    name: '',
    pageIndex: 1,
    pageSize: 20,
  }
  query: any = {}

  oldQuery: any = {}
  defaulitState: any = null
  loading = false
  list = []
  total = 0
  controlStatusList = []
  addshow = false
  columns = [
    { title: 'AppId', key: 'appId', width: 120 , align: 'center' },
    { title: '名称', key: 'name', width: 120 , align: 'center' },
    { title: '控制状态',
      key: 'controlStatusText',
      width: 120 ,
      align: 'center',
      render: (hh: any, { row: { controlStatus, controlStatusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span  class={`aptitude-status-${controlStatus}`}>{controlStatusText}</span>
        /* tslint:enable */
      }
    },
    { title: '创建人', key: 'createUserName', width: 120 , align: 'center' },
    { title: '创建时间', key: 'createTime', width: 160 , align: 'center' },
    { title: '修改人', key: 'modifyUserName', width: 120 , align: 'center' },
    { title: '修改时间', key: 'modifyTime', width: 160 , align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { appId, name, controlStatus } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a class="operation" on-click={this.edit.bind(this, appId, name, controlStatus)}>编辑</a>
          <router-link class="operation" to={{ name: 'app-list-edit', params: { appId: appId, type:'pages' } }}>页面</router-link>
          <router-link class="operation" to={{ name: 'app-list-edit', params: { appId: appId, type:'roles' } }}>角色</router-link>
          <router-link class="operation" to={{ name: 'app-list-edit', params: { appId: appId, type:'users' } }}>用户</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]


  mounted() {
    this.updateQueryByParam()
  }

  reloadSearch() {
    this.doSearch()
  }

  reset() {
    this.resetQuery()
  }

  get cachedMap() {
    return {
      controlStatusList: makeMap(this.controlStatusList)
    }
  }

  get tableData() {
    const cache = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        controlStatusText: cache.controlStatusList[it.controlStatus],
        modifyTime: moment(it.modifyTime).format(timeFormat),
        createTime: moment(it.createTime).format(timeFormat)
      }
    })
    return list
  }
  // 新增 / 修改
  edit(appId: any, name: any, status: any ) {
    this.addshow = true
    this.$nextTick(() => {
      (this.$refs.appList as any).init(appId, name, status)
    })
  }
  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
        totalCount: total,
        controlStatusList
      } } = await queryList(query)
      this.list = list
      this.controlStatusList = controlStatusList
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
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
  .input {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-id {
    width: 160px;
  }
  .type-select {
    display: inline-block;
    width: 100%;
    margin-left: 8px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .row-acts {
    .operation {
      margin-right: 6px;
    }
  }
  /deep/ .deprecated {
    color: #ed4014;
  }
  /deep/ span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
