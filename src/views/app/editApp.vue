<template>
  <div>
    <Breadcrumb separator="›">
      <BreadcrumbItem :to="{name: 'app-list'}">应用列表</BreadcrumbItem>
      <BreadcrumbItem>{{label}}</BreadcrumbItem>
    </Breadcrumb>

    <Tabs type="card" :value="currentName" @on-click="handover">
      <TabPane :label="labelMap.pages" name="pages"><Pages :appId="appId"/></TabPane>
      <TabPane :label="labelMap.roles" name="roles"><Roles :appId="appId"/></TabPane>
      <TabPane :label="labelMap.users" name="users"><Users :appId="appId"/></TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Pages from './pages.vue'
import Users from './users.vue'
import Roles from './roles.vue'

@Component({
  components: {
    Pages,
    Users,
    Roles
  }
})
export default class EditApp extends ViewBase {
  labelMap: any = {
    pages: '页面列表',
    roles: '角色列表',
    users: '用户列表',
  }

  get currentName() {
    return this.$route.params.type
  }

  get appId() {
    const id = this.$route.params.appId
    return parseInt(id, 10)
  }

  get label() {
    const type = this.$route.params.type
    return this.labelMap[type]
  }

  handover(name: string) {
    this.$router.push({
      name: 'app-list-edit',
      params: {
        appId: String(this.appId),
        type: name
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>
