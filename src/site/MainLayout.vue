<template>
  <div class="site-layout">
    <header class="site-header flex-box">
      <h1 class="logo">
        <router-link to="/" class="logo-link">Aiads Admin Portal</router-link>
      </h1>
      <div class="flex-1 flex-box">
        <a class="sider-toggle" @click="toggleSider" style="display:none">
          <Icon type="md-menu" size="24" class="menu-icon"
            :class="isOff && 'rotate-icon'"></Icon>
        </a>

        <div class="flex-1"></div>

        <Menu mode="horizontal" class="user-menu flex-box"
          @on-select='onMenuSelect'>
          <Submenu name="user">
            <template slot="title">
              <Icon type="md-person"></Icon>用户
            </template>
            <MenuItem name="settings">账户信息</MenuItem>
            <MenuItem name="change">修改密码</MenuItem>
            <MenuItem name="logout">退出登录</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </header>
    <Layout class="site-center">
      <Sider collapsible hide-trigger v-model="isOff" class="site-sider" ref="sider">
        <Menu width="auto" class="sider-menu" :class="isOff && 'sider-menu-off'"
          :active-name="siderActiveName" :open-names="siderOpenNames">
          <Submenu v-for="menu in siderMenuList" :key="menu.name" :name="menu.name">
            <template slot="title">
              <Icon :type="menu.icon"/>{{menu.label}}
            </template>
            <MenuItem v-for="sub in menu.subList" :key="sub.name" :name="sub.name">
              <router-link :to="{name: sub.name}">{{sub.label}}</router-link>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>

      <Content class="site-content">
        <router-view></router-view>
      </Content>
    </Layout>
    <settings  ref="addOrUpdate"   v-if="addOrUpdateVisible"/>
    <changepwd  ref="addOrUpdate"   v-if="changeVisible"/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { logout } from '@/store'
import settings from '@/views/settings.vue'
import changepwd from '@/views/changepwd.vue'


@Component({
  components: {
    // DlgEdit,
    settings,
    changepwd
  }
})
export default class App extends ViewBase {
  isOff = false
  addOrUpdateVisible = false
  changeVisible = false

  siderMenuList = [
    {
      name: 'client',
      icon: 'md-person',
      label: '用户管理',
      subList: [
        {
          name: 'user-list',
          label: '用户列表',
        }
      ]
    },
    {
      name: 'data',
      icon: 'md-cloud',
      label: '应用管理',
      subList: [
        {
          name: 'app-list',
          label: '应用列表',
        }
      ]
    },
  ]

  get siderOpenNames() {
    return this.siderMenuList.map(it => it.name)
  }

  // 获取导航中全部可点击的页面 name
  get siderMenuNameMap() {
    const result = this.siderMenuList.reduce((map: any, it) => {
      const names = it.subList != null
        ? it.subList.map(t => t.name)
        : [ it.name ]
      names.forEach(name => map[name] = 1)
      return map
    }, {})
    return result
  }

  // 映射某些页面到 sider 菜单
  siderActiveMap: any = {
    // 'from-page-name': 'nav-name',
  }

  get siderActiveName() {
    const { name } = this.$route

    if (name == null) {
      return
    }

    // 若 name 在导航中，直接返回
    if (name in this.siderMenuNameMap) {
      return name
    }

    // 否则去掉最后的 -tail，再次判断
    const remain = name.replace(/-\w+$/, '')
    if (remain in this.siderMenuNameMap) {
      return remain
    }

    // 最后的手段：硬编码映射关系
    return this.siderActiveMap[name]
  }

  toggleSider() {
    (this.$refs.sider as any).toggleCollapse()
  }

  onMenuSelect(name: string) {
    if (name == 'settings') {
      // alert('暂未实现')
      // this.$router.push({ name: 'settings' })
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        const myThis: any = this
        myThis.$refs.addOrUpdate.init(0)
      })
    } else if (name == 'change') {
      // alert('暂未实现')
      // this.$router.push({ name: 'change' })
      this.changeVisible = true
      this.$nextTick(() => {
        const myThis: any = this
        myThis.$refs.addOrUpdate.init(0)
      })
    } else if (name == 'logout') {
      // TODO: do logout
      logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less" scoped>
@import './lib.less';

.site-layout {
  position: relative;
}
.site-header {
  position: relative;
  height: 50px;
  line-height: 50px;
  background-color: lighten(@c-base, 8%);
}
.logo {
  width: 200px;
  font-weight: 400;
  font-size: 18px;
}
.logo-link {
  display: block;
  text-align: center;
  color: #fff;
}

// TODO: 右侧菜单收缩功能稍微开发完成
.menu-icon {
  transition: all .3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}

.user-menu {
  height: 50px;
  line-height: 50px;
  background-color: transparent;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    border-bottom: 0 !important;
  }
  /deep/ .ivu-menu-submenu-title {
    color: #fff;
  }
}

.site-center {
  position: relative;
  background-color: transparent;
}
.site-sider {
  position: relative;
  background-color: #fff;
  border-right: 1px solid #eee;
}
.site-content {
  position: relative;
  padding: 10px;
  overflow-x: auto !important;
}

.sider-menu {
  margin-bottom: 188px;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    .ivu-menu-item {
      padding: 0 !important;
      & > a {
        display: block;
        padding: 14px 24px 14px 42px;
        color: @c-text;
      }
    }
    .ivu-menu-item-selected {
      & > a {
        color: @c-base;
      }
    }
  }
  // a {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  // }
  // span {
  //   display: inline-block;
  //   width: 69px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  //   vertical-align: bottom;
  //   transition: width .2s ease .2s;
  // }
  // i {
  //   transform: translateX(0);
  //   transition: font-size .2s ease, transform .2s ease;
  //   vertical-align: middle;
  //   font-size: 16px;
  // }
}

// .sider-menu-off {
//   span {
//     width: 0;
//     transition: width .2s ease;
//   }
//   i {
//     transform: translateX(5px);
//     transition: font-size .2s ease .2s, transform .2s ease .2s;
//     vertical-align: middle;
//     font-size: 22px;
//   }
// }
</style>
