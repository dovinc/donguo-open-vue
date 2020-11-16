<template>
  <div style="width:100%;">
    <div class="filter-container">

      <el-form ref="dataForm" :inline="true" label-position="right" size="mini" label-width="80px">
        <el-form-item>
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddOrUpdate()" />
            <el-button type="primary" size="mini" @click="handlePreview()">{{ previewButtonText }}</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item v-if="isPreview" :label="name" prop="code">
          <my-select v-model="inputValue" :tree="attrType.multistage == 1" :placeholder="placeholder" :attr-type-code="attrTypeCode" />
        </el-form-item>
      </el-form>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      size="mini"
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
        prop="code"
        header-align="center"
        align="center"
        label="编码"
      />
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="字典名"
      />

      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
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
    <el-pagination
      v-show="total>0"
      :small="true"
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="pageIndex"
      :page-size.sync="pageSize"
      @current-change="getList"
    />

    <add-or-update ref="addOrUpdate" :dialog-status="dialogStatus" @refreshTable="getList" />

  </div>
</template>

<script>
import { getList, del } from '@/api/sys/attr/attr-item'
import AddOrUpdate from './add-or-update-item'
import MySelect from '@/components/Attr/Select'

export default {
  components: {
    AddOrUpdate,
    MySelect
  },
  props: {
    // 数据字典类型id
    attrType: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // 查询表单
      queryForm: {
        attrTypeId: this.attrType.attrTypeId,
        attrTypeCode: this.attrType.code
      },
      pageIndex: 1,
      pageSize: 5,
      total: 0,
      list: null,
      listLoading: true,
      dialogStatus: 'insert',
      // 以下为单选框所需属性
      name: this.attrType.title,
      placeholder: '请选择' + this.attrType.title,
      inputValue: null,
      attrTypeId: this.attrType.attrTypeId,
      attrTypeCode: this.attrType.code,
      isPreview: false,
      previewButtonTexts: ['预览', '关闭']
    }
  },
  computed: {
    previewButtonText: function() {
      if (this.isPreview) {
        return '返回'
      } else {
        return '预览'
      }
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
      const temp = Object.assign({}, row) || null // copy obj
      if (row) {
        this.dialogStatus = 'update'
      } else {
        this.dialogStatus = 'insert'
        temp.attrTypeCode = this.attrType.code
      }

      // this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(temp)
      })
    },
    handleDelete(row) {
      this.$confirm(`确定对[${row.title}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.attrItemId).then((reponse) => {
          const { code, msg } = reponse
          if (reponse && code === 200) {
            this.getList()
            this.$message({
              message: msg || '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
              }
            })
          } else {
            this.$message.error(msg)
          }
        })
      }).catch(() => {})
    },
    handlePreview() {
      this.isPreview = !this.isPreview
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item.el-form-item--mini{
  margin-bottom: 0px; // fix the form margin-bottom of Element UI
}
</style>
