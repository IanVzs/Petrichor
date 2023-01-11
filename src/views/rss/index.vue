<template>
  <div>
    <h1> {{ title }} </h1>
    <p v-html="html">.</p>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { getDetail } from '@/api/rss'
import { marked } from 'marked'
import 'highlight.js/styles/github.css'
// or const { marked } = require('marked');
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
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code, lang) {
        const hljs = require('highlight.js')
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
      langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false
    })
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    fetchData() {
      this.html2 = '你好'
      this.listLoading = true
      getDetail().then(response => {
        console.log(marked.parse(response.data.desc))
        this.html = marked.parse(response.data.desc)
        this.title = response.data.title
        this.listLoading = false
      })
      console.log('你好, 这里是我的打印内容:' + this.title)
    }
  }
}
</script>
