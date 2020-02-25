<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px"><!--style="width: 400px; margin-left:50px;"-->
      <el-form-item label="路由类型" prop="type">
        <el-radio-group v-model="temp.type">
          <el-radio-button v-for="(typeRadio, index) in typeList" :key="index" :label="typeRadio.value">{{ typeRadio.text }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeList[temp.type].text + '名称'" prop="name">
        <el-input v-model="temp.name" :placeholder="typeList[temp.type].text + '名称'" />
      </el-form-item>

      <el-form-item label="父菜单" prop="parentName">
        <tree-select
          :props="props"
          :options="menuList"
          :value="temp.parentId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
          @getNode="getNode($event)"
        />
      </el-form-item>
      <el-form-item v-if="temp.type === 1" label="菜单路由" prop="url">
        <el-input v-model="temp.url" placeholder="菜单路由" />
      </el-form-item>
      <el-form-item v-if="temp.type !== 2" label="Path路径" prop="path">
        <el-input v-model="temp.path" placeholder="Path路径" />
      </el-form-item>
      <el-form-item v-if="temp.type !== 0" label="授权" prop="permissions">
        <el-input v-model="temp.permissions" placeholder="多授权使用逗号分隔, 如: sys:person:get,sys:person:post" />
      </el-form-item>
      <el-form-item v-if="temp.type !== 2" label="排序" prop="orderNum">
        <el-input-number v-model="temp.orderNum" controls-position="right" :min="0" label="排序" />
      </el-form-item>
      <el-form-item v-if="temp.type !== 2" label="图标" prop="icon">
        <el-input v-model="temp.icon" v-popover:iconPopover style="cursor: pointer;" :readonly="true" placeholder="图标" class="icon-input" />
        <el-popover
          ref="iconPopover"
          width="786"
          placement="top"
          trigger="click"
        >
          <div class="icons-container">
            <el-tooltip v-for="item of svgIcons" :key="item" class="icon-item" placement="top" :enterable="false">
              <div slot="content">
                <span>{{ item }}</span>
              </div>
              <el-button
                size="small"
                :class="{ 'is-active': item === temp.icon }"
                @click="iconClick(item)"
              >
                <svg-icon :icon-class="item" class-name="disabled" />
              </el-button>
            </el-tooltip>
          </div>
        </el-popover>
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
import { getTreeWithoutBtn, update, insert } from '@/api/sys/menu'
import TreeSelect from '@/components/TreeSelect'
import svgIcons from '@/icons/svg-icons'
export default {
  components: {
    TreeSelect
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
      typeList: [{
        text: '目录',
        value: 0
      }, {
        text: '菜单',
        value: 1
      },
      {
        text: '按钮',
        value: 2
      }],
      temp: {
        menuId: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        path: '',
        permissions: '',
        orderNum: 0,
        icon: ''
      },
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '菜单URL不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'Path路径不能为空', trigger: 'blur' }
        ],
        parentName: [
          { validator: (rule, value, callback) => {
            if (this.temp.parentId === null || this.temp.parentId === undefined) {
              callback(new Error('父级菜单不能为空，请选择父级菜单！'))
            } else {
              callback()
            }
          }, required: true, trigger: 'blur' }
        ]
      },
      menuList: [],
      // 以下为树型下拉框属性
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 20, // 初始ID（可选）
      props: { // 配置项（必选）
        value: 'menuId',
        label: 'name',
        children: 'menuList'
        // disabled:true
      },
      svgIcons
    }
  },
  computed: {
    type: function() {
      return this.temp.type
    }
  },
  watch: {
    // 通过计算属性computed 与 watch 实现 validate 动态更新
    type: function(val, oldval) {
      if (val !== oldval) {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    }
  },
  created() {
    getTreeWithoutBtn().then(response => {
      const { resultObj } = response
      this.menuList = resultObj.tree
    })
  },
  methods: {
    init(data) {
      if (this.dialogStatus === 'update') {
        // this.temp.id = data.id || 0
        this.temp.menuId = data.menuId
        this.temp.type = data.type
        this.temp.name = data.name
        this.temp.parentId = data.parentId
        this.temp.parentName = data.parentName
        this.temp.url = data.url
        this.temp.path = data.path
        this.temp.permissions = data.permissions
        this.temp.orderNum = data.orderNum
        this.temp.icon = data.icon
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
        menuId: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        path: '',
        permissions: '',
        orderNum: 0,
        icon: ''
      }
    },
    // 取值
    getValue(val) {
      this.temp.parentId = val
    },
    getNode(node) {
      this.temp.parentName = node.name
    },
    // 图标选中
    iconClick(iconName) {
      this.temp.icon = iconName
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

<style lang="scss">
.icon-input {
  > .el-input__inner {
    cursor: pointer;
  }
}

// vue-admin-template 中的样式
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 2px;
    text-align: center;
    float: left;
    color: #24292e;
    cursor: pointer;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
