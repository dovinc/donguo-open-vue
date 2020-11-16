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
        prop="menuId"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <table-tree-column
        prop="name"
        header-align="center"
        tree-key="menuId"
        width="150"
        label="名称"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号"
      />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      />
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleAddOrUpdate(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="addOrUpdate" :dialog-status="dialogStatus" @refreshTable="getList" />
  </div>
</template>

<script>
import { getList, del } from '@/api/sys/menu'
import AddOrUpdate from './components/add-or-update'
import TableTreeColumn from '@/components/table-tree-column'
import { list2Tree } from '@/utils/index'

export default {
  components: {
    AddOrUpdate,
    TableTreeColumn
  },
  data() {
    return {
      // 查询表单
      queryForm: {},
      list: null,
      listLoading: true,
      // 是否显示新增、删除 Form表单
      // addOrUpdateVisible: false,
      dialogStatus: 'insert'
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList().then(response => {
        const { resultObj } = response
        this.list = list2Tree(resultObj.list, 'menuId')
        this.listLoading = false
      })
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
      this.$confirm(`确定对[${row.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.menuId).then((reponse) => {
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
    }
  }
}
</script>
