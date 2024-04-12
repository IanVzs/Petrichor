<template>
  <div class="text">
    <h1> {{ title }} </h1>
    <p v-html="html">.</p>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { getDetail } from '@/api/stadium'
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
    console.log('detail id: ', this.$route.params.pathMatch)
  },
  methods: {
    fetchData() {
      this.html2 = '你好'
      this.listLoading = true
      getDetail(this.$route.params.pathMatch).then(response => {
        // console.log(marked.parse(response.data.desc))
        this.html = marked.parse(response.data.desc)
        this.title = response.data.title
        this.listLoading = false
        console.log('你好, 这里是我的打印内容:' + response.data.title)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  // display: inline-block;
  width: 90%;
  // height: 90%;
  min-width:400px;
  // max-width:1000px;
  padding:40px;
  // overflow:auto;
  margin:auto;
  // position:absolute;
  // top:0; left:0; bottom:0; right:0;

  // .no-redirect {
  //   color: #97a8be;
  //   cursor: text;
  // }
}
</style>
