<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="!id ? '新建角色' : '编辑角色'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForms" :rules="ruleValidate" label-position="left">
      <FormItem label="角色名称" prop="name">
        <Input v-model="dataForms.name" placeholder="请输入角色名称"/>
      </FormItem>
      <FormItem label="角色编码" prop="code">
        <Input v-model="dataForms.code" placeholder="请输入角色编码"/>
      </FormItem>
      <FormItem label="" prop="admin">
        <Checkbox v-model="dataForms.admin">超级管理员</Checkbox>
      </FormItem>
      <FormItem label="控制状态" prop="controlStatus">
        <RadioGroup v-model="dataForms.controlStatus">
          <Radio v-for="index in controlStatusList" :label="index.key" :key="index.key">{{index.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <div>角色树</div>
      <AclTree v-model="aclData" :appId="appId"/>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit()">确定</Button>
    </div>
  </Modal>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop , Watch , Mixins} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import { addRules, setRules } from '@/api/appList'
import { warning , success, toast } from '@/ui/modal'
import UrlManager from '@/util/UrlManager'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import AclTree from '@/components/AclTree.vue'

@Component({
  components: {
    AclTree
  }
})
export default class RoleDlg extends Mixins(ViewBase, UrlManager) {
  @Prop() userOnes: any
  @Prop() controlStatusList: any

  /** appId */
  @Prop({ type: Number, required: true }) appId!: number

  dataForms = {
    name: '',
    code: '',
    admin: false,
    controlStatus: 1
  }

  aclData = {
    pages: [],
    perms: []
  }

  id = 0
  loading = false
  showDlg = false

  ruleValidate = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入角色编码', trigger: 'blur' }
    ]
  }

  async init(id: number) {
    this.id = id
    this.showDlg = true
    if (this.id) {
      this.dataForms.name = this.userOnes.name
      this.dataForms.code = this.userOnes.code
      this.aclData.pages = this.userOnes.pages
      this.aclData.perms = this.userOnes.perms
    }
  }

  cancel() {
    this.showDlg = false
    this.aclData.pages = []
    this.aclData.perms = []
    this.dataForms.name = ''
    this.dataForms.code = ''
    ; (this.$refs.dataForm as any).resetFields()
  }
  // 表单提交
  async dataFormSubmit() {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = !this.id ? {
      ...this.dataForms,
      pages: this.aclData.pages,
      perms: this.aclData.perms
    } : {
      ...this.dataForms,
      pages: this.aclData.pages,
      perms: this.aclData.perms
    }
    const title = !this.id ? '添加' : '编辑'
    try {
      const res = !this.id ? await addRules (this.$route.params.appId, query) :
      await setRules (this.$route.params.appId, this.id, query)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  reset() {
    this.resetQuery()
  }

  search() {
    this.query.pageIndex = 1
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-corp-id {
    width: 80px;
  }
}
/deep/ .ivu-form-item {
  margin-bottom: 12px;
}
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  display: none;
}
</style>
