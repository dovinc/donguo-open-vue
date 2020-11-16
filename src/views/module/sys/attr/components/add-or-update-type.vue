<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
      <el-form-item label="多级" prop="multistage">
        <el-radio-group v-model="temp.multistage" size="small">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型名称" prop="title">
        <el-input v-model="temp.title" placeholder="请输入字典类型名称" />
      </el-form-item>
      <el-form-item label="类型编码" prop="code">
        <el-input v-model="temp.code" placeholder="请输入字典类型编码" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="temp.description" placeholder="请输入字典描述" />
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
import { update, insert } from '@/api/sys/attr/attr-type'
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
        attrTypeId: 0,
        title: '',
        code: '',
        description: '',
        multistage: 0
      },
      rules: {
        title: [
          { required: true, message: '字典类型名不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典类型编码不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '字典类型描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    init(data) {
      if (this.dialogStatus === 'update') {
        this.temp.attrTypeId = data.attrTypeId
        this.temp.title = data.title
        this.temp.code = data.code
        this.temp.description = data.description
        this.temp.multistage = data.multistage
      } else if (this.dialogStatus === 'insert') {
        this.resetTemp()
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        attrTypeId: 0,
        title: '',
        code: '',
        description: '',
        multistage: 0
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
