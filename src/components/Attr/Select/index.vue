<template>
  <div>
    <el-select v-if="!tree" :value="value" :placeholder="placeholder" @input="handleInput">
      <el-option v-for="(item, i) in attrItemList " :key="i" :label="item.title" :value="item.value" />
    </el-select>

    <tree-select
      v-if="tree"
      :props="props"
      :options="attrItemList"
      :value="value"
      :clearable="isClearable"
      :accordion="isAccordion"
      @getValue="handleInput"
    />

  </div>
</template>

<script>
import { getAll } from '@/api/sys/attr/attr-item'
import TreeSelect from '@/components/TreeSelect'
import { list2Tree } from '@/utils/index'

export default {
  name: 'MySelect',
  components: {
    TreeSelect
  },
  props: {
    // 配置项
    value: {
      type: String,
      default: () => {
        return ''
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return ''
      }
    },
    attrTypeCode: {
      type: String,
      default: () => {
        return ''
      }
    },
    multiple: { // 多选
      type: Boolean,
      default: () => {
        return false
      }
    },
    tree: { // 树形
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      attrItemList: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: { // 配置项（必选）
        value: 'code',
        label: 'title',
        children: 'children'
        // disabled:true
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // getAll AttrItem By attrTypeCode
      getAll({ attrTypeCode: this.attrTypeCode }).then(res => {
        const { code, msg, resultObj } = res
        if (code === 200) {
          if (this.tree) {
            this.attrItemList = list2Tree(resultObj, 'attrItemId', 'parentId')
          } else {
            this.attrItemList = resultObj
          }
        } else {
          this.$message({
            message: msg,
            type: 'error'
          })
        }
      })
    },
    handleInput(value) {
      // 触发 v-model
      this.$emit('input', value)
    },
    handleFilter(data) {
      // this.$emit()
    }
  }
}
</script>
