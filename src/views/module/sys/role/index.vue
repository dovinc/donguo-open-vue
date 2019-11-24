<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddOrUpdate()">
        新增
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="55"
      />
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="用户名"
      />
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="描述"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleAddOrUpdate(row)">修改</el-button>
          <el-button size="mini" type="warning" @click="handleAssignUser(row)">分配用户</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getList" />
    <add-or-update ref="addOrUpdate" :dialog-status="dialogStatus" @refreshTable="getList" />
    <user-transfer ref="userTransfer" @refreshTable="getList" />
  </div>
</template>

<script>
import { getList, del } from '@/api/sys/role'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import AddOrUpdate from './components/add-or-update'
import UserTransfer from './components/user-transfer'

export default {
  components: {
    AddOrUpdate,
    Pagination,
    UserTransfer
  },
  data() {
    return {
      // 查询表单
      queryForm: {

      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      list: null,
      listLoading: true,

      dialogStatus: 'insert'
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const pageObj = {
        page: this.pageIndex,
        limit: this.pageSize
      }
      const param = Object.assign(this.queryForm, pageObj)
      getList(param).then(response => {
        const { code, msg, resultObj } = response
        if (code === 200) {
          this.list = resultObj.list
          this.total = resultObj.totalCount
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
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getList()
    },
    handleAddOrUpdate(row) {
      if (row) {
        this.dialogStatus = 'update'
      } else {
        this.dialogStatus = 'insert'
      }
      const temp = Object.assign({}, row) || null // copy obj

      // this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(temp)
      })
    },
    handleDelete(row) {
      this.$confirm(`确定对[${row.roleName}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.roleId).then((reponse) => {
          const { code, msg } = reponse
          if (reponse && code === 200) {
            this.$message({
              message: msg || '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getList()
              }
            })
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(() => {})
    },
    handleAssignUser(row) {
      const temp = Object.assign({}, row) || null // copy obj
      this.$nextTick(() => {
        this.$refs.userTransfer.init(temp)
      })
    }

  }
}
</script>
