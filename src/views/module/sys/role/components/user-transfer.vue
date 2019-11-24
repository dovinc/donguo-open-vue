<template>
  <el-dialog title="分配用户" :visible.sync="dialogFormVisible">
    <el-transfer
      v-model="checkedUserIds"
      :props="props"
      :data="userList"
      :titles="['未分配用户', '已分配用户']"
      :button-texts="['分配', '取消']"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="submit()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getListAll } from '@/api/sys/user'
import { getRoleUserIds, modifyRoleUsers } from '@/api/sys/role'
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      roleId: 0,
      userList: [],
      dialogFormVisible: false,
      checkedUserIds: [],

      props: {
        key: 'userId',
        label: 'username'
      }
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
  },
  methods: {
    init(data) {
      if (data && data.roleId) {
        this.roleId = data.roleId
        getListAll().then((response) => {
          const { resultObj, code, msg } = response
          if (code === 200) {
            this.userList = resultObj
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        getRoleUserIds(data.roleId).then((response) => {
          const { resultObj, code, msg } = response
          if (code === 200) {
            const { userIds } = resultObj
            this.checkedUserIds = userIds
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      }
      this.dialogFormVisible = true
    },
    // 表单提交
    submit() {
      // 获取选中和半选的menu
      const params = { roleId: this.roleId, userIds: this.checkedUserIds }
      modifyRoleUsers(params).then(response => {
        const { code, msg } = response
        if (code === 200) {
          this.dialogFormVisible = false
          this.$emit('refreshTable')
          this.$message({
            message: msg,
            type: 'success',
            onClose: () => {

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
  }
}
</script>
