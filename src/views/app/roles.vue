<template>
  <div class="page">
    <div class="act-bar flex-box">
      <div class="acts">
        <form class="form flex-1" @submit.prevent="search">
          <Button class="okbth" type="success" icon="md-add-circle" @click="edit(0)">添加</Button>
        </form>
      </div>
    </div>

    <Table ref="selection" :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <rolesDlg :appId="appId" ref="addOrUpdate" :userOnes="editOne"
      :controlStatusList='controlStatusList' @refreshDataList="reloadSearch"
      @done="dlgeditdone" v-if="addOrUpdateVisible"/>
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { roleList , getuserlist , dels } from '@/api/appList'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import rolesDlg from './rolesDleg.vue'
import { confirm } from '@/ui/modal'
import { hasLogin } from '@/store'

const makeMap = (list: any[]) => toMap(list , 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:ss-mm'

@Component({
  components: {
    rolesDlg
  }
})
export default class Roles extends Mixins(ViewBase, UrlManager) {
  /** appId */
  @Prop({ type: Number, required: true }) appId!: number

  defQuery = {
    id: null,
    name: '',
    pageIndex: 1,
    pageSize: 20,
    years: ''
  }

  query: any = {}

  oldQuery: any = {}

  showDlg = false

  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list = []
  controlStatusList = []
  total = 0


  columns = [
    { title: 'Id', key: 'id', align: 'center' },
    { title: '角色名称', key: 'name', align: 'center' },
    { title: '修改人', key: 'modifyUserName', align: 'center' },
    { title: '修改时间', key: 'modifyTime', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        /* tslint:enable */
      }
    }
  ]


  get cachedMap() {
    return {
      // controlStatusList: this.controlStatusList
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        modifyTime: it.modifyTime ? moment(it.modifyTime).format(timeFormat) : ''
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
        controlStatusList: controlStatusList
      } } = await roleList(this.appId, query)
      this.list = list
      this.total = total
      this.controlStatusList = controlStatusList
      // this.controlStatusList = controlStatusList.map((item: any) => {
      //   return {
      //     ...item,
      //     // rols: item
      //   }
      // })
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 新增 / 修改
  edit(id: number, row: any) {
    // console.log(this.$refs.selection.$el)
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id)
    })
  }

  dlgeditdone() {
    this.doSearch()
  }

  async delete(id: any) {
    try {
      await confirm('您确定删除当前用户信息吗？')
      await dels(this.$route.params.appId, id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.reloadSearch()
    } catch (ex) {
      this.handleError(ex)
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
.input {
  width: 100px;
  margin-right: 8px;
  margin-top: 7px;
}
.btns {
  width: 80px;
  margin-right: 5px;
  margin-top: 7px;
}
.acts {
  width: 100%;
}
.okbth {
  margin-top: 8px;
  float: right;
}
// .btn-reset {
//   margin-left: 7px;
// }

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
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
.data-inp {
  display: inline-block;
}
  </style>
