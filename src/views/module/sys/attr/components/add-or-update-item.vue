<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px"><!--style="width: 400px; margin-left:50px;"-->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="temp.username" placeholder="用户名，登录账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="temp.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword">
        <el-input v-model="temp.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="temp.mobile" placeholder="手机号" />
      </el-form-item>

      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="temp.roleIds" v-loading="listLoading" style="width:100%" multiple placeholder="请选择角色" @change="handlePreview">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
        <!-- <el-checkbox-group v-model="dataForm.roleList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group> -->
      </el-form-item>
      <el-form-item label="权限预览">
        <!-- <el-header style="text-align: right; font-size: 12px">
          <span> <el-button v-loading="btnLoading" type="success" @click="handlePreview()">预览<i class="el-icon-arrow-right el-icon--right" /></el-button></span>

        </el-header> -->
        <el-container v-loading="btnLoading" style="height: 300px; border: 1px solid #eee">
          <el-main>
            <el-tree
              ref="menuTree"
              :data="menuTree"
              show-checkbox
              default-expand-all
              node-key="menuId"
              :highlight-current="true"
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
import { detailsWithRoleIds, update, insert } from '@/api/sys/user'
import { isEmail, isMobile } from '@/utils/validate'
import { getAllRoles, getLeafMenuIds } from '@/api/sys/role'
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
    var passwordValidator = (rule, value, callback) => {
      if (!this.temp.userId && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var comfirmPasswordValidator = (rule, value, callback) => {
      if (!this.temp.userId && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.temp.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var emailValidator = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var mobileValidator = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      temp: {
        userId: 0,
        username: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        salt: '',
        roleIds: []
      },

      roleList: [],
      dialogFormVisible: false,
      // 授权信息树
      btnLoading: false,
      menuTree: [],
      menuTreeProps: {
        children: 'menuList',
        label: 'name'
        // disabled: (data, node) => {
        //   return true
        // }
      },

      listLoading: false,
      textMap: {
        update: 'Edit',
        insert: 'Create'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: passwordValidator, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: comfirmPasswordValidator, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ]
      }

    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    // 应当在此处获取
    this.getAllRoles()
    this.initMenuTree()
  },
  methods: {
    init(data) {
      this.resetTemp()
      if (this.dialogStatus === 'update') {
        detailsWithRoleIds(data.userId).then((response) => {
          const { code, resultObj } = response
          if (code === 200) {
            this.temp.userId = resultObj.userId
            this.temp.username = resultObj.username
            this.temp.email = resultObj.email
            this.temp.mobile = resultObj.mobile
            this.temp.salt = resultObj.salt
            this.temp.roleIds = resultObj.roleIds
            this.handlePreview()
          }
        })
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
        userId: 0,
        username: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        salt: ''
      }
    },
    getAllRoles() {
      this.listLoading = true
      getAllRoles().then(response => {
        const { code, msg, resultObj } = response
        if (code === 200) {
          this.roleList = resultObj
          this.listLoading = false
        } else {
          this.listLoading = false
          this.$message({
            message: msg,
            type: 'error'
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
    handlePreview() {
      if (!this.temp.roleIds || this.temp.roleIds.length === 0) {
        this.$refs.menuTree.setCheckedKeys([])
      } else {
        this.btnLoading = true
        getLeafMenuIds({ roleIds: this.temp.roleIds }).then(response => {
          const { code, msg, resultObj } = response
          if (code === 200) {
            this.$refs.menuTree.setCheckedKeys([])
            // 添加选中节点且仅选中子节点
            this.$refs.menuTree.setCheckedKeys(resultObj.menuIds)
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.btnLoading = false
        })
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
