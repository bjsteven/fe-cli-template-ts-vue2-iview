<template>
  <div class="page">
    <Row type="flex">
      <Col span="8">
        <Tree class="tree-box" :data="data"></Tree>
      </Col>
      <Col span="1">
        <Divider type="vertical" class="divider"/>
      </Col>
      <Col span="12">
        <TreeDetail ref="appList" @treeadd="pageadd"
          @treeInit="pageInit" :data="indata"/>
      </Col>
    </Row>
  </div>
</template>

<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { pagesId } from '@/api/appList'
import jsxReactToVue from '@/util/jsxReactToVue'
import TreeDetail from './treeDetail.vue'

@Component({
  components: {
    TreeDetail
  }
})
export default class Pages extends ViewBase {
  @Prop() appId: any

  data: any = []
  item: any = []
  treeItem: any = []
  indata: any = []

  created() {
    this.pageInit()
  }

  async pageInit() {
    (this.$Spin as any).show()
    try {
      const { data: {
        items
      } } = await pagesId({ id: this.appId })
      this.item = items.map((it: any) => {
        return {
          ...it,
          title: it.name,
          expand: true,
          set: false,
          render: (hh: any, { root, node, data }: any) => {
            /* tslint:disable */
            const h = jsxReactToVue(hh)
            return <span class= {`in-item ${data.set ? 'in-item-on' : ''}`} >
              <div class="treeLine"></div>
              <icon type= {data.icon} size = '20' > </icon>
              <span on-click= {this.edit.bind(this, data)} > {data.title} </span>
            </span>
            /* tslint:enable */
          }
        }
      })
      this.treeItem = items
      this.data = this.toTree(this.item)
      items.unshift({
        id: 0,
        name: 'Root'
      })
      this.indata = items
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 500)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
  }

  edit(data: any) {
    this.pageadd()
    data.set = true
    this.$nextTick(() => {
      (this.$refs.appList as any).init(data, this.treeItem)
    })
  }

  pageadd() {
    this.item.forEach((it: any) => {
      it.set = false
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
}
</script>

<style lang="less" scoped>
.tree-box {
  margin-left: 20px;
}
/deep/ .in-item {
  display: inline-block;
  line-height: 30px;
  span {
    cursor: pointer;
  }
}

/deep/ .in-item-on {
  background: #fdd;
}

/deep/ .tree-title {
  display: inline-block;
  padding-right: 5px;
}

.divider {
  height: 100%;
}
</style>
