<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px"><!--style="width: 400px; margin-left:50px;"-->
      <el-form-item label="角色" prop="roleName">
        <el-input v-model="temp.roleName" placeholder="角色名" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="temp.description" placeholder="描述" />
      </el-form-item>
      <el-form-item label="授权" prop="menuList">
        <el-container style="height: 300px; border: 1px solid #eee">
          <!-- <el-header style="text-align: right; font-size: 12px">
            <span>请选择授权</span>
          </el-header> -->

          <el-main>
            <el-tree
              ref="menuTree"
              :data="menuTree"
              show-checkbox
              default-expand-all
              node-key="menuId"
              highlight-current
              :props="menuTreeProps"
            />
          </el-main>
        </el-container>
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
import { getDetails, update, insert } from '@/api/sys/role'
import { getMenuTree } from '@/api/sys/menu'
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
      temp: {
        roleId: 0,
        roleName: '',
        description: ''
      },
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        insert: 'Create'
      },
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空！', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空！', trigger: 'blur' }
        ]
      },

      menuTree: [],
      menuTreeProps: {
        children: 'menuList',
        label: 'name'
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    this.initMenuTree()
  },
  methods: {
    init(data) {
      this.resetTemp()
      if (this.dialogStatus === 'update') {
        if (data && data.roleId) {
          getDetails(data.roleId).then((response) => {
            const { resultObj, code, msg } = response
            if (code === 200) {
              const { role } = resultObj
              this.temp.roleId = role.roleId
              this.temp.roleName = role.roleName
              this.temp.description = role.description
              this.$nextTick(() => {
                this.$refs.menuTree.setCheckedKeys([])
                // 添加选中节点且仅选中子节点
                this.$refs.menuTree.setCheckedKeys(role.menuIds)
              })
            } else {
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
        }
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        roleId: 0,
        roleName: '',
        description: ''
      }
    },
    // 表单提交
    insertData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 获取选中和半选的menu
          const menuIds = [...this.$refs.menuTree.getCheckedKeys(), ...this.$refs.menuTree.getHalfCheckedKeys()]
          const params = Object.assign({ menuIds: menuIds }, this.temp) || null // copy obj
          insert(params).then(response => {
            const { code, msg } = response
            if (code === 200) {
              this.$message({
                message: msg,
                type: 'success',
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
          // 获取选中和半选的menu
          const menuIds = [...this.$refs.menuTree.getCheckedKeys(), ...this.$refs.menuTree.getHalfCheckedKeys()]
          const params = Object.assign({ menuIds: menuIds }, this.temp) || null // copy obj
          update(params).then(response => {
            const { code, msg } = response
            if (code === 200) {
              this.$message({
                message: msg,
                type: 'success',
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

    initMenuTree() {
      getMenuTree().then(response => {
        const { resultObj } = response
        this.menuTree = resultObj.tree
      })
    },

    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
