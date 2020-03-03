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
    <editUser  ref="addOrUpdate" :userOnes="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" @done="dlgeditdone"/>
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
import { queryList , getuserlist , dels } from '@/api/appList'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import editUser from './editUser.vue'
import { confirm } from '@/ui/modal'
import { hasLogin } from '@/store'

const makeMap = (list: any[]) => toMap(list , 'id', 'name')
const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    editUser
  }
})
// export default class Main extends View {
export default class Users extends Mixins(ViewBase, UrlManager) {
  @Prop() appId: any

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
  userRoleMap = []
  total = 0


  columns = [
    { title: 'Id', key: 'id', align: 'center' },
    {
      title: '账号',
      key: 'loginName',
      align: 'center',
    },
    { title: '姓名', key: 'userName', align: 'center' },
    { title: '公司邮箱', key: 'email', align: 'center' },
    { title: '角色', key: 'userRoleMap', align: 'center',
      render: (hh: any, { row: { userRoleMap, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const user = userRoleMap[id]
        return <span>{user}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a on-click={this.delete.bind(this, row.id)}>删除</a>
        </div>
        /* tslint:enable */
      }
    }
  ]


  get cachedMap() {
    return {
      // userRoleMap: this.userRoleMap
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        userRoleMap: this.userRoleMap
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
        userRoleMap: userRoleMap
      } } = await getuserlist(this.appId, query)
      this.list = list
      this.total = total
      this.userRoleMap = userRoleMap
      // this.userRoleMap = userRoleMap.map((item: any) => {
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
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
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
