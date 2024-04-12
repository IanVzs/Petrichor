<template>
  <div class="app-container">
    <el-button type="primary" style="float: right; margin-bottom: 10px;" @click="jump2add">新建</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @row-click="jump2detail"
    >
      <el-table-column align="center" label="ID" width="56">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="球场名" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赞👍" width="110" align="center">
        <template slot-scope="scope">
          <span :style="getAgreeStyles(scope.row.agree)">{{ scope.row.agree }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开放状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="上一次更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/stadium'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        公益球场: 'success',
        对外开放付费: 'danger', // info
        商业球场: 'primary',
        未知: 'warning',
        只对内: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    jump2detail(row) {
      console.log(row.id)
      this.$router.push({ path: '/stadium/index/' + row.id })
      // return
      // this.$router.go(-1)
    },
    jump2add(row) {
      this.$router.push({ path: '/stadium/add/' })
    },
    getAgreeStyles(agree) {
      if (agree > 4000) {
        return { color: 'red' }
      } else if (agree > 2000) {
        return { color: 'green' }
      } else {
        return {}
      }
    }
  }
}
</script>
