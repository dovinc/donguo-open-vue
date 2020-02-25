<template>
  <div>
    <el-select :value="value" :placeholder="placeholder" @input="handleInput">
      <el-option v-for="(item, i) in attrItemList " :key="i" :label="item.title" :value="item.value" />
    </el-select>
  </div>
</template>

<script>
import { getAll } from '@/api/sys/attr/attr-item'

export default {
  name: 'MySelect',
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
    }
  },
  data() {
    return {
      attrItemList: []
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
          this.attrItemList = resultObj
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
    }
  }
}
</script>
