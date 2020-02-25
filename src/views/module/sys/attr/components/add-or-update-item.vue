<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="temp.title" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="temp.code" placeholder="请输入字典编码" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="temp.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input-number v-model="temp.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="排序号" prop="value">
        <el-input-number v-model="temp.orderNum" placeholder="请输入排序号" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="dialogStatus==='insert'?insertData():updateData()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { update, insert } from '@/api/sys/attr/attr-item'
export default {
  components: {
  },
  props: {
    dialogStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        insert: 'Create'
      },
      temp: {
        attrItemId: 0,
        attrTypeCode: '',
        title: '',
        code: '',
        remark: '',
        orderNum: '',
        value: 0
      },
      rules: {
        title: [
          { required: true, message: '字典名不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    init(data) {
      if (this.dialogStatus === 'update') {
        this.temp.attrItemId = data.attrItemId
        this.temp.attrTypeCode = data.attrTypeCode
        this.temp.title = data.title
        this.temp.code = data.code
        this.temp.remark = data.remark
        this.temp.value = data.value
        this.temp.orderNum = data.orderNum
      } else if (this.dialogStatus === 'insert') {
        this.resetTemp()
        this.temp.attrTypeCode = data.attrTypeCode
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        attrItemId: 0,
        attrTypeCode: '',
        title: '',
        code: '',
        remark: '',
        orderNum: '',
        value: 0
      }
    },
    // 表单提交
    insertData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insert(this.temp).then(response => {
            const { code, msg } = response
            if (code === 200) {
              this.$message({
                message: msg,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogFormVisible = false
                  this.$emit('refreshTable')
                }
              })
            } else {
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.temp).then(response => {
            const { code, msg } = response
            if (code === 200) {
              this.$message({
                message: msg,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogFormVisible = false
                  this.$emit('refreshTable')
                }
              })
            } else {
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>
