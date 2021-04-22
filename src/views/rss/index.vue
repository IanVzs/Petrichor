<template>
  <div>
    <h1> {{ title }} </h1>
    <p v-text="html2">.</p>
    <p v-html="html">.</p>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { getDetail } from '@/api/rss'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      title: '',
      html: ''
    }
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
