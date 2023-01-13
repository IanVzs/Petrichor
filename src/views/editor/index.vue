<template>
  <div class="app-container">
    <div id="main">
      <mavon-editor v-model="value" @save="savetext" />
    </div>
  </div>
</template>

<script>
import { getDraft } from '@/api/editor'
import { saveData } from '@/api/editor'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      value: '123',
      editorData: {
        data: ''
      }
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDraft().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    savetext() {
      console.log(this.value)
      this.editorData.data = this.value
      saveData(this.editorData).then(response => {
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
    }
  }
}
</script>
