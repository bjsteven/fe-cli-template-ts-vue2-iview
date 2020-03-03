<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建用户' : '编辑用户'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem v-if='!id' label="账号" prop="loginName">
        <Input v-model="dataForm.loginName" @on-blur='changeloginname'></Input>
      </FormItem>
      <FormItem v-if='id' label="账号" prop="loginName">
        <Input disabled v-model="dataForm.loginName"></Input>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Select style="width:240px" v-model="dataForm.status">
          <Option v-for="it in list" :key="it.key" :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <FormItem label="姓名" prop="userName">
        <Input v-model="dataForm.userName"></Input>
      </FormItem>
      <FormItem label="手机号" prop="mobile">
        <Input v-model="dataForm.mobile"></Input>
      </FormItem>
      <FormItem label="公司邮箱" prop="email">
        <!-- <Input v-model="dataForm.email"><span slot="append">@aiads.com</span></Input> -->
        <Input v-model="dataForm.email" @on-blur='changeemail'></Input>
      </FormItem>
      <FormItem label="超级管理员">
        <Checkbox v-model="dataForm.admin"></Checkbox>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import {queryList , dataFrom , addList , setList , loginNameexist , emailexist } from '@/api/user'
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
  email: '',
  status: null,
  admin: false,
  mobile: null
}

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Object }) userOnes: any

  loading = false
  showDlg = false
  id = 0

  query = { ...defQuery }
  oldQuery: any = {}
  list = []


  ruleValidate = {
    loginName: [
      { required: true, message: '请输入账号名称', trigger: 'blur' }
    ],
    userName: [
      { required: true, message: '请输入姓名' }
    ],
    status: [
      { required: true, message: '请选择状态' }
    ],
    email: [
      { required: true, message: '请输入邮箱账号', trigger: 'blur' },
      // {
      //   pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
      //   message: '请输入正确的邮箱格式',
      //   trigger: 'blur'
      // }
    ],
    mobile: [
      {
        pattern: /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|7[0-9])[0-9]{8}$/,
        message: '手机号格式不正确',
        trigger: 'change'
      }
    ]
  }

  dataForm: any = { ...dataForm }
  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
      this.dataForm.mobile = this.userOnes.mobile
      this.dataForm.loginName = this.userOnes.loginName
      this.dataForm.status = this.userOnes.status
      this.dataForm.userName = this.userOnes.userName
      this.dataForm.email = this.userOnes.email
      this.dataForm.admin = this.userOnes.admin
    }
  }

  cancel() {
    // this.dataForm.beginDate
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 验证登录名称
  async changeloginname() {
    try {
      const { } = await loginNameexist(this.dataForm.loginName)
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }
  // 验证登录邮箱
  async changeemail() {
    try {
      const { } = await emailexist(this.dataForm.email)
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = !this.id ? {
      ...this.dataForm,
    } : {
      id: this.id,
      ...this.dataForm,
    }
    const title = !this.id ? '添加' : '编辑'
    try {
      const res = !this.id ? await addList (query) : await setList (query)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done')
      this.dataForm.admin = false
      this.cancel()
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
    this.doSearch()
  }

  async doSearch() {
    this.oldQuery = { ...this.query }
    const query = clean({ ...this.query })
    try {
      const { data: {
        statusList: list,
      } } = await queryList(query)
      this.list = list

      // const {  } = await loginNameexist(this.dataForm.loginName)

      // const {  } = await emailexist(this.dataForm.email)
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
