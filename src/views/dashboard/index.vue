<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="chat-content">
      <!-- recordContent 聊天记录数组-->
      <div v-for="(itemc,indexc) in messageList" :key="indexc">
        <!-- 对方 -->
        <div v-if="itemc.author != 'me'" class="word">
          <img :src="participants[0].imageUrl">
          <div class="info">
            <p class="time">{{ itemc.author }}  {{ chatTime(itemc.type) }}</p>
            <div class="info-content">{{ itemc.data.text+itemc.data.emoji }}</div>
          </div>
        </div>
        <!-- 我的 -->
        <div v-else class="word-my">
          <div class="info">
            <p class="time">{{ itemc.author }}  {{ chatTime(itemc.type) }}</p>
            <div class="info-content">{{ itemc.data.text+itemc.data.emoji }}</div>
          </div>
          <img :src="participants[1].imageUrl">
        </div>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
        <div class="grid-content bg-purple">
          <el-input v-model="txt_input" type="textarea" autosize placeholder="请输入内容">请输入内容区域</el-input>
        </div>
      </el-col>
      <el-col-sub :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
        <div class="grid-content bg-purple-light">
          <el-button type="success" round @click="sendMessage">发送</el-button>
        </div>
      </el-col-sub>
    </el-row>
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
      txt_input: '',
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
    chatTime(text) {
      return text
    },
    sendMessage() {
      const text = this.txt_input
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
        const wsuri = 'ws://192.168.0.175:8000/ws'
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
.el-col {
  width: 90%;
  border-radius: 4px;
}
.el-col-sub {
  width: 10%;
  border-radius: 4px;
}
.chat-content{
  width: 100%;
  padding: 20px;
  .word{
     display: flex;
     margin-bottom: 20px;
     img{
       width: 40px;
       height: 40px;
       border-radius: 50%;
     }
     .info{
       margin-left: 10px;
       .time{
         font-size: 12px;
         color: rgba(51,51,51,0.8);
         margin: 0;
         height: 20px;
         line-height: 20px;
         margin-top: -5px;
       }
       .info-content{
          padding: 10px;
          font-size: 14px;
          background: #fff;
          position: relative;
          margin-top: 8px;
        }
        //小三角形
        .info-content::before{
            position: absolute;
            left: -8px;
            top: 8px;
            content: '';
            border-right: 10px solid #FFF;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }
     }
  }
.word-my{
    display: flex;
    justify-content:flex-end;
    margin-bottom: 20px;
    img{
       width: 40px;
       height: 40px;
       border-radius: 50%;
     }
     .info{
       width: 90%;
       margin-left: 10px;
       text-align: right;
       .time{
         font-size: 12px;
         color: rgba(51,51,51,0.8);
         margin: 0;
         height: 20px;
         line-height: 20px;
         margin-top: -5px;
         margin-right: 10px;
       }
       .info-content{
          max-width: 70%;
          padding: 10px;
          font-size: 14px;
          float: right;
          margin-right: 10px;
          position: relative;
          margin-top: 8px;
          background: #A3C3F6;
          text-align: left;
        }
        //小三角形
        .info-content::after{
            position: absolute;
            right: -8px;
            top: 8px;
            content: '';
            border-left: 10px solid #A3C3F6;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }
     }
  }
}
</style>
