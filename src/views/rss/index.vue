<template>
  <div>
    <h1> {{title}} </h1>
    <p v-text="html2"></p>
    <p v-html="html"></p>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
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
      this.title = 'ZotFile + Sci-Hub，巧妙玩转PDF下载！'
      this.html = '<p>ZotFile作为Zotero最重要的插件之一，在<a href="https://mp.weixin.qq.com/s/n-pr7QoyDdYGfWcrXT78Fw">附件重命名</a>、<a href="https://mp.weixin.qq.com/s/0heWcOlwgrF6GHmPTc-poA">文献同步</a>、<a href="https://mp.weixin.qq.com/s/uHOY2a_EZqJAQOrB2v9rFQ">平板设置</a>等方面都发挥着重要作用。</p> <h3 id="attach-new-file功能">Attach New File功能</h3> <p>可是，很多用户忽略了它的一个小功能，也就是下图所示的<code class="language-plaintext highlighter-rouge">Attach New File</code>路径设置。</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006170242.png" alt="新文件监控目录设置" /></p> <p>该路径用于监控指定路径内所产生的新文件（一般为PDF）。</p> <p>一旦指定路径内产生了新文件，我们则可以将该文件作为某个文献条目的附件。</p> <p>下面来看看该怎么用。</p> <p><strong>推荐将该路径设置为电脑的下载目录</strong>，如上图所示。</p> <p>这是因为默认情况下，电脑浏览器（比如Safari）的下载路径为系统的Download文件夹。</p> <p>设置完毕后，假如我们从网页下载了某篇文献的PDF到下载目录。</p> <p>接着，在Zotero中选中一篇没有PDF附件的文献条目，然后右键选择<code class="language-plaintext highlighter-rouge">Attach New File</code>。</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006171342.png" alt="Attach New File" /></p> <p>提示是否将该PDF设置为附件，点击OK。</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006171426.png" alt="点击OK" /></p> <p>便可以将该PDF设置为这篇文献的附件。</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006171723.png" alt="完成PDF附件的绑定" /></p> <p>那么，<code class="language-plaintext highlighter-rouge">Attach New File</code>功能究竟什么情况下能用到呢？</p> <p>当你使用Zotero Connector从浏览器抓取文献时，很顺利地抓取到了题录，却因为各种原因无法抓取附件，比如<strong>网络的问题、翻译器的问题、或者数据库权限的问题</strong>。</p> <p>那么此时不妨先把题录抓取到Zotero中，然后再想办法手动下载该文献的PDF，比如在SciHub中下载。</p> <p>成功下载PDF至电脑的下载目录后，再利用<code class="language-plaintext highlighter-rouge">Attach New File</code>功能将该PDF绑定至相应文献。</p> <h3 id="zotfile--sci-hub搜索引擎">ZotFile + Sci-Hub搜索引擎</h3> <p><strong>还有一种搭配Zotero搜索引擎的玩法</strong>，这里也介绍给大家。</p> <p>很多时候，如果我们选择从Google Scholar或者Web of Science抓取文献，一些文献是无法抓取到PDF的（毕竟不是在期刊页面直接抓取）。</p> <p>那么，和前面一样，我们先把题录抓取至Zotero。</p> <p>选中想要绑定附件的某篇文献，观察其有没有DOI，如果没有可以通过<a href="https://mp.weixin.qq.com/s/ddJ_liehAU0fJ7M8B-Hrzg">zotero-shortdoi</a>插件更新。</p> <p>接着，点击搜索引擎列表内的Sci-Hub DOI。</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006173413.png" alt="搜索引擎【Sci-Hub DOI】" /></p> <p>即可自动跳转到Sci-Hub上该文献的PDF链接。（前提Sci-Hub上有资源）</p> <p><img src="https://figurebed-iseex.oss-cn-hangzhou.aliyuncs.com/img/20201006173546.png" alt="跳转至Sci-Hub下载文献" /></p> <p>得益于Sci-Hub的强大，通常都能找到PDF。</p> <p>接着，在上述Sci-Hub页面下载PDF至电脑的Download文件夹，再使用<code class="language-plaintext highlighter-rouge">Attach New File</code>绑定至文献条目，完美！</p> <p>所以，到此可以看到，将Zotero的一些小功能结合起来，会有意想不到的效果。</p> <h3 id="sci-hub搜索引擎源码分享">Sci-Hub搜索引擎源码分享</h3> <p>这里我把Sci-Hub搜索引擎的源码分享给大家。👇</p> <p><strong>下载方式：</strong><code class="language-plaintext highlighter-rouge">青柠学术</code>公众号后台回复<code class="language-plaintext highlighter-rouge">SciHub引擎</code>。</p>'
      this.html2 = '你好'
      console.log('你好, 这里是我的打印内容:' + this.title)
    }
  }
}
</script>
