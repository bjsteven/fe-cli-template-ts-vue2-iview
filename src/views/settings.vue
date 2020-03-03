<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'账户信息'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="账号" prop="loginName">
        <Input disabled v-model="dataForm.loginName"></Input>
      </FormItem>
      <FormItem label="姓名" prop="userName">
        <Input v-model="dataForm.userName"></Input>
      </FormItem>
      <FormItem label="公司邮箱" prop="email">
        <!-- <Input v-model="dataForm.email"><span slot="append">@aiads.com</span></Input> -->
        <Input v-model="dataForm.email"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">更新</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import {queryList , dataFrom , addList , setList , authinfos , queryItem } from '@/api/user'
import { warning , success, toast } from '@/ui/modal'
import { slice, clean } from '@/fn/object'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  loginName: '',
  userName: '',
  status: null,
  admin: null
}

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Object }) userOnes: any

  loading = false
  showDlg = false
  id = 0

  query = { ...defQuery }
  oldQuery: any = {}
  list: any = []
  itemid: any = ''
  data: any = {}

  ruleValidate = {
    // loginName: [
    //   { required: true, message: '请输入账号名称', trigger: 'blur' }
    // ],
    // userName: [
    //   { required: true, message: '请输入姓名' }
    // ],
    // email: [
    //   { required: true, message: '请输入邮箱账号', trigger: 'blur' },
    //   {
    //     pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    //     message: '请输入正确的邮箱格式',
    //     trigger: 'blur'
    //   }
    // ]
  }

  dataForm: any = { ...dataForm }

  async init(id: number) {
    // console.log(id)
    this.showDlg = true
    this.id = id || 0
    this.doSearch()
    // console.log(this.id)
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
    }
  }

  cancel() {
    // this.dataForm.beginDate
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = !this.itemid ? {
      ...this.dataForm,
    } : {
      id: this.itemid,
      ...this.dataForm,
    }
    const title = !this.itemid ? '添加' : '编辑'
    try {
      const res = await setList (query)
      toast('操作成功')
      this.showDlg = false
      // this.$emit('done')
      window.history.go(0)
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return list
  }

  mounted() {
    const { id } = this.$route.params
    this.query.categoryId = this.id
    // this.doSearch()
  }

  async doSearch() {
    this.oldQuery = { ...this.query }
    const query = clean({ ...this.query })
    try {
      const { data } = await authinfos(query)
      this.data = data
      this.itemid = data.userId

      const { data: {
        item: list,
      } } = await queryItem(this.itemid)
      this.list = list
      this.dataForm.loginName = this.list.loginName
      this.dataForm.userName = this.list.userName
      this.dataForm.email = this.list.email
      this.dataForm.status = this.list.status
      this.dataForm.admin = this.list.admin
    } catch (ex) {
      this.handleError(ex)
    } finally {
      // this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
