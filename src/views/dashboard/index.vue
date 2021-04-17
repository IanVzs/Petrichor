<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
// import { Tree } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      ws: null,
      isDestroyed: false, // 页面是否销毁
      lockReconnect: false, // 是否真正建立连接
      timeout: 3000, // 3秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      deadTimeoutObj: null, // 心跳倒计时(死亡倒计时)
      timeoutNum: null // 断开 重连倒计时
    }
  },
  mounted() {
    // 初始化ws
    this.initWebSocket()
  },
  // 离开路由之后断开websocket连接
  beforeDestroy() {
    this.isDestroyed = true
    this.timeoutNum && clearTimeout(this.timeoutNum)
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.deadTimeoutObj && clearTimeout(this.deadTimeoutObj)
    this.ws.close()
    console.log('处理完毕, 即将销毁页面...')
    window.removeEventListener('beforeunload', e => this.closeWS(e))
  },
  destroyed() {
    this.ws.close()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // 数据发送
    send_by_ws(Data) {
      this.ws.send(Data)
    },
    // 关闭
    closeWS(e) {
      this.ws.close()
    },
    created() {
      this.initWebSocket()
      window.addEventListener('beforeunload', e => this.closeWS(e))
    },
    // 开始心跳
    start() {
      const _this = this
      _this.timeoutObj && clearTimeout(_this.timeoutObj)
      _this.deadTimeoutObj && clearTimeout(_this.deadTimeoutObj)
      _this.timeoutObj = setTimeout(function() {
        // 心跳
        if (_this.ws.readyState === 1) {
          const heartP = {
            isHeartbeat: true,
            userWsId: 'TODO',
            contentText: 'peng..peng..'
          }
          _this.ws.send(JSON.stringify(heartP))
        } else {
          _this.reconnect()
        }
        _this.deadTimeoutObj = setTimeout(function() {
          // 死亡通知
          _this.ws.close()
        }, _this.timeout)
      }, _this.timeout)
    },
    reset() {
      const _this = this
      _this.timeoutObj && clearTimeout(_this.timeoutObj)
      _this.deadTimeoutObj && clearTimeout(_this.deadTimeoutObj)
      // 跳
      _this.start()
    },
    initWebSocket() {
      // 是否存在WebSocket连接
      const _this = this
      if (window.WebSocket) {
        // 初始化weosocket
        const wsuri = 'ws://127.0.0.1:8000/ws'
        _this.ws = new WebSocket(wsuri)
        // 连接建立之后执行send方法发送数据
        _this.ws.onopen = function(e) {
          console.log('ws连接成功')
          _this.start()
          const actions = { 'test': '12345' }
          // let actions = { 'test': '12345' }
          _this.ws.send(JSON.stringify(actions))
        }
        _this.ws.onclose = function(e) {
          console.log('ws连接出错')
          _this.reconnect()
        }
        _this.ws.onerror = function(e) {
          console.log('ws连接出错')
          _this.reconnect()
        }
        _this.ws.onmessage = function(e) {
          // 心跳重置
          _this.reset()
          const resData = JSON.parse(e.data)
          console.log(`接收到回声: ${resData.sender}---${resData.content}`)
          if (resData.isHeartbeat) {
            console.log(new Date().format('HH:mm:ss') + '：' + resData.message)
            return
          }
          // TODO
          console.log('正式消息, 需要做点儿什么...TODO...')
        }
      }
    },
    reconnect() {
      const _this = this
      if (_this.lockReconnect || _this.isDestroyed) {
        return
      }
      console.log('重新连接ing...')
      _this.lockReconnect = true
      _this.timeoutNum && clearTimeout(self.timeoutNum)
      _this.timeoutNum = setTimeout(function() {
        // 新连接
        _this.initWebSocket()
        _this.lockReconnect = false
      }, 4000)
      // TODO : https://blog.csdn.net/xqhys/article/details/114453801
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
