<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'账户信息'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="旧密码" prop="oldPwd">
        <Input v-model="dataForm.oldPwd" type='password'></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPwd">
        <Input v-model="dataForm.newPwd" type='password'></Input>
      </FormItem>
      <FormItem label="重复密码" prop="newPwd2">
        <!-- <Input v-model="dataForm.email"><span slot="append">@aiads.com</span></Input> -->
        <Input v-model="dataForm.newPwd2" type='password'></Input>
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
import {queryList , dataFrom , addList , setList , authinfos , queryItem , changepwd } from '@/api/user'
import { warning , success, toast } from '@/ui/modal'
import { slice, clean } from '@/fn/object'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  oldPwd: '',
  newPwd: '',
  newPwd2: '',
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

  get ruleValidate() {
    const password = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请重新输入密码'))
      } else {
        if (this.dataForm.newPwd2 !== this.dataForm.newPwd) {
           callback(new Error('密码不匹配，请重新输入'))
        }
        callback()
      }
    }
    const rules = {
      oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
      ],
      newPwd2: [
          { required: true, message: '请重新输入密码', trigger: 'blur' },
          { validator: password }
      ],
    }
    return rules
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
      const res = await changepwd (query)
      toast('操作成功')
      this.showDlg = false
      // this.$emit('done')
      window.history.go(0)
      this.$router.push({ name: 'login' })
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
    // this.oldQuery = { ...this.query }
    // const query = clean({ ...this.query })
    // try {
    //   const { data } = await authinfos(query)
    //   this.data = data
    //   this.itemid = data.userId

    //   const { data: {
    //     item: list,
    //   } } = await queryItem(this.itemid)
    //   this.list = list
    // } catch (ex) {
    //   this.handleError(ex)
    // } finally {
    //   // this.loading = false
    // }
  }
}
</script>

<style lang="less" scoped>
</style>
