<template>
  <div class="acl-tree">
    <Tree :data="treeData" multiple show-checkbox ref="tree"
      @on-select-change="onSelChange" @on-check-change="onSelChange"/>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { aclList } from '@/api/acl'
import { listToTree } from '@/fn/tree'
import { walkTree } from '@/fn/tree'
import jsxReactToVue from '@/util/jsxReactToVue'
import { isEqual, Dictionary, uniq } from 'lodash'
import { toMap } from '@/fn/array'

interface Perm {
  name: string
  code: string
}

interface Value {
  /** 页面列表 */
  pages: number[]
  /** 权限列表 */
  perms: string[]
}

interface ValueMap {
  pageMap: Dictionary<any>,
  permMap: Dictionary<any>,
}

const toTreeData = (nodes: any[], { pageMap, permMap }: ValueMap) => {
  return walkTree(nodes, {
    onEachBefore(node, parentNodes) {
      const page = {
        title: node.name,
        expand: false,
        checked: false,
        extraData: {
          type: 'page',
          key: node.id,
        },
        render: (hh: any, { data }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <span className="in-item">
            <icon type="ios-leaf-outline"/>
            <span>{data.title}</span>
          </span>
          /* tslint:enable */
        },
        children: (node.perms || []).map((it: Perm) => ({
          title: it.name,
          checked: it.code in permMap,
          extraData: {
            type: 'perm',
            key: it.code,
          },
          render: (hh: any, { data }: any) => {
            /* tslint:disable */
            const h = jsxReactToVue(hh)
            return <span className="in-item">
              <icon type="ios-code-working"/>
              <span>{data.title}</span>
            </span>
            /* tslint:enable */
          },
        }))
      }

      return page
    },

    onEachAfter(page, parentNodes) {
      const pageOn = page.extraData.key in pageMap
      const isLeaf = page.children.length == 0
      const childrenChecked = page.children.some((t: any) => t.checked)

      page.checked = isLeaf ? pageOn : false
      page.expand = childrenChecked
    }
  })
}

const isSameList = (list1: string[] | number[] | null, list2: string[] | number[] | null) => {
  if (list1 == null || list2 == null) {
    return list1 == list2
  }

  const sorted1 = [ ...list1 ].sort()
  const sorted2 = [ ...list2 ].sort()
  return isEqual(sorted1, sorted2)
}

const isSameValue = (val1: Value, val2: Value) => {
  return isSameList(val1.pages, val2.pages) &&
    isSameList(val1.perms, val2.perms)
}

@Component
export default class AclTree extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {}, required: true }) value!: Value

  /** appId */
  @Prop({ type: Number, required: true }) appId!: number

  inValue: Value = {} as Value

  list: any[] = []

  get treeData() {
    const nodes = listToTree(this.list)
    const map = {
      pageMap: toMap(this.inValue.pages),
      permMap: toMap(this.inValue.perms),
    }
    const tree = toTreeData(nodes, map)
    return tree
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: Value) {
    this.inValue = {
      // 有的情况下，pages 是 string[]，这里进行转换，使组件更健壮一些
      pages: (value.pages as any[] || []).map(it => parseInt(it, 10)),
      perms: [ ...(value.perms || []) ],
    }
  }

  @Watch('inValue', { deep: true })
  watchInValue(value: Value) {
    if (!isSameValue(value, this.value)) {
      this.$emit('input', value)
    }
  }

  async created() {
    try {
      const { data: { items = [] } } = await aclList(this.appId)
      this.list = items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  onSelChange() {
    const tree = this.$refs.tree as any
    const nodes = tree.getCheckedAndIndeterminateNodes() as any[]
    const { pages, perms } = nodes.reduce((result, { extraData: data } = {}) => {
      data.type == 'page'
        ? result.pages.push(parseInt(data.key, 10))
        : result.perms.push(String(data.key))
      return result
    }, {
      pages: [],
      perms: [],
    })

    // 虑重
    const uniqValue = {
      pages: uniq(pages) as number[],
      perms: uniq(perms) as string[],
    }
    this.inValue = uniqValue
  }
}
</script>

<style lang="less" scoped>
.acl-tree {
  /deep/ .in-item {
    display: inline-block;
    font-size: 14px;
    line-height: 1.2;
    user-select: none;
    & > .ivu-icon-ios-leaf-outline {
      position: relative;
      top: -1px;
    }
    & > span {
      margin-left: 2px;
    }
  }
}
</style>
