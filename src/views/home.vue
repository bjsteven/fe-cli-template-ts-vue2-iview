<template>
  <div class="page">
    <h1>Aiads 后台权限管理系统</h1>
    <div class="box">
      <Tag 
        size="large" 
        @click.native="herf(item.url)"
        v-for="(item, index) in items"
        :key="index" 
        :color="color[index%4]">
        {{item.name}}
      </Tag>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { portal } from '@/api/appList'

@Component
export default class Main extends ViewBase {
  items: any = []
  color: any = ['primary', 'success', 'error', 'warning']
  created() {
    this.init()
  }

  async init() {
    try {
      const { data } = await portal()
      this.items = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

  herf(val: any) {
    const http = location.protocol
    window.open(`${http}//` + val, '_blank')
  }
}
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 60px;
  align-content: center;
}
/deep/ .ivu-tag {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding: 0 16px;
  margin-right: 30px;
}
</style>
