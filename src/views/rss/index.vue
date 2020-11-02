<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ title }}</div>
    <dev><p v-html="html">html</p></dev>
    <dev><p v-html="html2">html2</p></dev>
    <dev>你好</dev>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetail } from '@/api/rss'

export default {
  name: 'RSS',
  data() {
    return {
      list: null,
      listLoading: true,
      title: '',
      html: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.html2 = '你好'
      this.listLoading = true
      getDetail().then(response => {
        this.html = response.data.desc
        this.title = response.data.title
        this.listLoading = false
      })
      console.log('你好, 这里是我的打印内容:' + this.title)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
