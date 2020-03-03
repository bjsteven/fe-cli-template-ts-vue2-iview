<template>
   <Modal
    v-model='showDlg'
    :transfer='false'
    :width='420'
    :title="!!type?'添加应用':'编辑应用'"
    @on-cancel="cancel('dataForm')"
    >
    <Form ref="dataForm" :rules="ruleValidate" :model="dataForm" label-position="left" :label-width="80">
        <FormItem label="Appld" prop="appId">
          <Input v-model="dataForm.appId" :disabled="!type" placeholder="请输入"/>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="dataForm.name" placeholder="请输入"/>
        </FormItem>
        <FormItem label="控制状态">
          <RadioGroup v-model="dataForm.controlStatus">
            <Radio v-for="index in incontrolStatusList" :label="index.key" :key="index.key">{{index.text}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="url" prop="url">
          <Input v-model="dataForm.url" placeholder="url表达式，/auth/apps:GET"/>
        </FormItem>
        <!-- <FormItem label="是否登录" prop="login">
          <Checkbox v-model="dataForm.login">是否需要登录</Checkbox>
        </FormItem> -->
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { addApp, setApp, userdetail } from '@/api/appList'
import { toast } from '@/ui/modal'

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Array }) incontrolStatusList: any
  showDlg = false
  type: number = 1
  dataForm = {
    appId: '',
    name: '',
    controlStatus: 1,
    url: ''
  }
  ruleValidate = {
    appId: [
        { required: true, message: '请输入Appld', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    url: [
        { required: true, message: '请输入utl表达式', trigger: 'blur' }
    ],
    login: [
        { required: true, type: 'boolean', message: '请选择登录状态', trigger: 'blur' }
    ]
  }

  async init(id: any, name: string, status: any) {
    this.showDlg = true
    if (id == 0) {
      this.type = 1
    } else {
      const { data: {
        item
      }} = await userdetail(id)
      this.type = 0
      this.dataForm.appId = id + ''
      this.dataForm.name = item.name
      this.dataForm.controlStatus = item.controlStatus
      this.dataForm.url = item.url || ''
    }
  }

  cancel(dataForms: string) {
    (this.$refs[dataForms] as any).resetFields()
    this.showDlg = false
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
    (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
        try {
          let title = ''
          !!this.type ? title = '新建' : title = '编辑'
          !!this.type ? await addApp(this.dataForm) : await setApp(this.dataForm.appId, {
            name: this.dataForm.name,
            url: this.dataForm.url,
            controlStatus: this.dataForm.controlStatus
          })
          this.$emit('refreshDataList')
          this.showDlg = false
          ; (this.$refs[dataForms] as any).resetFields()
          toast(`${title}应用成功`)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>
