<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <beautiful-chat
      :participants="participants"
      :title-image-url="titleImageUrl"
      :on-message-was-sent="onMessageWasSent"
      :message-list="messageList"
      :new-messages-count="newMessagesCount"
      :is-open="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :show-emoji="true"
      :show-file="true"
      :show-edition="true"
      :show-deletion="true"
      :show-typing-indicator="showTypingIndicator"
      :show-launcher="true"
      :show-close-button="true"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :disable-user-list-toggle="false"
      :message-styling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />
  </div>
</template>

<script>
// :icons="icons"
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
      timeoutNum: null, // 断开 重连倒计时

      participants: [
        {
          id: 'user1',
          name: 'Tiger',
          imageUrl: 'https://tupian.sioe.cn/b/bing-home-image/pic/small/20140729.jpg'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        { type: 'text', author: `me`, data: { text: `Say yes!` }},
        { type: 'text', author: `user1`, data: { text: `No.` }}
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
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
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text }})
      }
    },
    receiveMessage(message) {
      message.author = 'user1'
      console.log('receiveMessage: ', message)
      this.newMessagesCount = this.newMessagesCount + 1
      this.messageList = [...this.messageList, message]
    },
    onMessageWasSent(message) {
      // called when the user sends a message
      console.log(message)
      this.send_by_ws(JSON.stringify(message))
      this.messageList = [...this.messageList, message]
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    // icons () {
    //   // 不清楚要干什么 TODO
    // },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      console.log('Emit typing event')
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },

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
        const wsuri = 'ws://192.168.10.14:8000/ws'
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
          console.log('ws连接断开')
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
          const msg_data = JSON.parse(resData.content)
          if (msg_data.data) {
            console.log('正式消息, 需要做点儿什么...TODO...')
            _this.receiveMessage(msg_data)
          }
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
