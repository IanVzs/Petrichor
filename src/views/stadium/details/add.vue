<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="球场名称">
        <el-input v-model="form.title" @blur="handleInputBlur('# ' + $event.target.value)" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" @blur="handleInputBlur('## 地址\n' + $event.target.value)" />
      </el-form-item>
      <el-form-item label="球场性质">
        <el-select v-model="form.selectValue" @change="handleSelectChange">
          <el-option v-for="(item, index) in selectOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.selectValue < 2 && form.selectValue != -1" label="收费标准">
        <el-input v-model="form.charge" @blur="handleInputBlur('- 收费标准: ' + $event.target.value + '\n')" />
      </el-form-item>
      <el-form-item label="详情">
        <mavon-editor v-model="markdown" class="markdown-editor" :subfield="false" />
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
import { submitOne, saveOne } from '@/api/stadium'

export default {
  name: 'MyPage',
  //   components: {
  //     mavonEditor
  //   },
  data() {
    return {
      form: {
        title: '',
        address: '',
        selectValue: '',
        charge: ''
      },
      selectOptions: [
        { label: '公益球场', value: 2 },
        { label: '对外开放付费', value: 1 },
        { label: '商业球场', value: 0 },
        { label: '未知', value: -1 },
        { label: '只对内', value: -2 }
      ],
      markdown: ''
    }
  },
  methods: {
    handleSelectChange() {
      if (this.form.selectValue === '3' || this.form.selectValue === '4') {
        this.$nextTick(() => {
          this.$refs.form.validateField('charge')
        })
      }
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            title: this.form.title,
            address: this.form.address,
            selectValue: this.form.selectValue,
            charge: this.form.charge,
            markdown: this.markdown
          }
          console.log(data)
          // 通过接口提交数据
          submitOne(data).then(response => {
            if (response.data.sucess) {
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleSave() {
      const data = {
        title: this.form.title,
        address: this.form.address,
        selectValue: this.form.selectValue,
        charge: this.form.charge,
        markdown: this.markdown
      }
      console.log(data)
      // 通过接口保存数据
      saveOne(data).then(response => {
        if (response.data.sucess) {
          this.$message({
            message: response.data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          })
        }
      })
    },
    handleInputBlur(value) {
      console.debug(value)
      this.markdown = `${this.markdown}\n${value}`
      console.debug(this.markdown)
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.btn-group {
  margin-top: 20px;
}

.markdown-editor {
  height: 100px;
  width: 97%;
}
</style>
