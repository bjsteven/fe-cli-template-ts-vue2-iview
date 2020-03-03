<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button class="bth" icon="md-return-left" @click="goback">返回列表</Button>
      <div class="n-main">查看账号详情</div>
      <div class="Inps-res">
        <div class="res-num">
          <p>账号:&nbsp;&nbsp;&nbsp;</p>
          <span>{{list.loginName}}</span>
        </div>
        <div class="res-num">
          <p>姓名:&nbsp;&nbsp;&nbsp;</p>
          <span>{{list.userName}}</span>
        </div>
        <div class="res-num">
          <p>公司邮箱:&nbsp;&nbsp;&nbsp;</p>
          <span>{{list.email}}</span>
        </div>
        <div class="res-num">
          <p>状态:&nbsp;&nbsp;&nbsp;</p>
          <span v-if='list.status==1'>正常</span>
          <span v-if='list.status==2'>锁定</span>
          <span v-if='list.status==3'>禁用</span>
        </div>
        <div class="res-num">
          <p>创建人:&nbsp;&nbsp;&nbsp;</p>
          <span>{{list.createUserName}}</span>
        </div>
        <div class="res-num">
          <p>最后修改人:&nbsp;&nbsp;&nbsp;</p>
          <span>{{modifyUserName}}</span>
        </div>
        <div class="res-num">
          <p>创建时间:&nbsp;&nbsp;&nbsp;</p>
          <span>{{createTime}}</span>
        </div>
        <div class="res-num">
          <p>最后修改时间:&nbsp;&nbsp;&nbsp;</p>
          <span>{{modifyTime}}</span>
        </div>
        <div class="res-num">
          <p>已授权应用:&nbsp;&nbsp;&nbsp;</p>
          <p v-for='it in apps'>{{it}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import { queryItem } from '@/api/user'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const defQuery = {
  id: '',
  companytId: '',
  phoneNmber: null,
  type: null,
  status: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component
export default class Main extends ViewBase {
  // change = false
  changeVisible = false

  query = { ...defQuery }
  oldQuery: any = {}

  createTime = ''
  modifyTime = ''
  modifyUserName = ''
  apps = {}
  list: any = []
  prelist: any = []
  total = 0
  ids = ''

  mounted() {
    const { id } = this.$route.params
    this.ids = id
    this.doSearch()
    this.createTime = moment(this.list.createTime).format(timeFormat)
    this.modifyTime = moment(this.list.modifyTime).format(timeFormat)
    this.modifyUserName = this.list.modifyUserName == null ? '暂无' : this.list.modifyUserName
    this.apps = this.list.apps == null ? '暂无' : this.list.apps
  }


  goback() {
    this.$router.go(-1)
  }

  async doSearch() {

    this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    try {
      const { data: {
        item: list,
      } } = await queryItem(this.$route.params.id)
      this.list = list
    } catch (ex) {
    } finally {
    }
  }
}
</script>

<style lang="less" scoped>
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 15px;
  margin: -10px -10px 0 -10px;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  font-size: 13px;
  background: #fff;
}
.res-num {
  display: flex;
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.res-num p {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: block;
  max-height: 60px;
  text-align: left;
  margin-left: 0.5%;
  font-weight: bold;
}
.res-num span {
  display: inline-block;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.n-main {
  display: inline-block;
  margin: 0 0 5px 5px;
  line-height: 35px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
