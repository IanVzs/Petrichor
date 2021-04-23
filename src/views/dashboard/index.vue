<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-container style="height: 700px; border: 1px solid #eee">
      <el-aside v-show="show_chat_aside" width="50%" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template #title><i class="el-icon-message">dh</i>导航一</template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template #title>选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template #title><i class="el-icon-menu">dh2</i>导航二</template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template #title>选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template #title><i class="el-icon-setting">dh3</i>导航三</template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template #title>选项4</template>
              <el-menu-item index="3-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px">?</i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="showAside">查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>王小虎</span>
        </el-header>
        <el-main>
          <div class="chat-content">
            <!-- recordContent 聊天记录数组-->
            <div v-for="(itemc,indexc) in messageList" :key="indexc">
              <!-- 对方 -->
              <div v-if="itemc.author != 'me'" class="word">
                <img :src="participants[0].imageUrl">
                <div class="info">
                  <p class="time">{{ itemc.author }}  {{ chatTime(itemc.type) }}</p>
                  <div class="info-content">{{ itemc.data.text }}</div>
                </div>
              </div>
              <!-- 我的 -->
              <div v-else class="word-my">
                <div class="info">
                  <p class="time">{{ itemc.author }}  {{ chatTime(itemc.type) }}</p>
                  <div class="info-content">{{ itemc.data.text }}</div>
                </div>
                <img :src="participants[1].imageUrl">
              </div>
            </div>
          </div>
        </el-main>
        <el-footer height="15%">
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="grid-content bg-purple">
                <el-input v-model="txt_input" type="textarea" autosize placeholder="请输入内容">请输入内容区域</el-input>
              </div>
            </el-col>
            <el-col :span="8"><div class="grid-content bg-purple">
              <el-button-group>
                <el-button type="success" round @click="sendMessage">发送</el-button>
              </el-button-group>
            </div></el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-container>
    <div id="callPage" class="call-page">
      <div class="row">
        <div class="col-md-6 text-right">Local audio: <audio ref="localAudio" controls autoplay>localAu</audio>
        </div>
        <div class="col-md-6 text-left">Remote audio: <audio ref="remoteAudio" controls autoplay>remoteAu</audio>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-12">
          <input id="callToUsernameInput" type="text" placeholder="username to call">
          <el-button-group>
            <el-button type="primary" @click="callAu">Call</el-button>
            <el-button type="primary" @click="hangUpAu">Hang Up</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ???import { removeToken } from '@/utils/auth'
// ???import func from 'vue-editor-bridge'
// :icons="icons"
// import { Tree } from 'element-ui'
import { mapGetters } from 'vuex'

var stream
var yourConn
// var remoteAudio = document.querySelector('remoteAudio')

export default {
  name: 'Dashboard',
  data() {
    return {
      show_chat_aside: true,
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
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true }, // only Au
        function(myStream) {
          stream = myStream
        },
        function(error) {
          switch (error.code || error.name) {
            case 'PERMISSION_DENIED':
            case 'PermissionDeniedError':
              console.log('用户拒绝提供信息.')
              break
            case 'NOT_SUPPORTED_ERROR':
            case 'NotSupportedError':
              console.log('浏览器不支持硬件设备.')
              break
            case 'MANDATORY_UNSATISFIED_ERROR':
            case 'MandatoryUnsatisfiedError':
              console.log('无法发现指定的硬件设备.')
              break
            default:
              console.log('无法打开麦克风.异常信息:' + (error.code || error.name))
              break
          }
        }
      )
    } else {
      console.log('当前浏览器不支持录音功能.')
    }
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
    hangUpAu() {
      console.log('HangUp.....')
    },
    showAside() {
      this.show_chat_aside = !this.show_chat_aside
    },
    chatTime(text) {
      return text
    },
    sendMessage(msg = '') {
      const text = msg || this.txt_input
      this.txt_input = ''
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'me', type: 'text', data: { text }})
      }
    },
    callAu() {
      console.log('Call....')
      try {
        this.$refs.localAudio.src = stream
        console.log('成功refs localAudio.')
      } catch (error) {
        console.log(error)
      }
      const configuration = {
        // stun 服务
        'iceServers': [{ 'url': 'stun:stun2.1.google.com:19302' }]
      }
      yourConn = new RTCPeerConnection(configuration)
      yourConn.addStream(stream)
      // when a remote user adds stream to the peer connection, we display it
      yourConn.onaddstream = function(e) {
        this.$refs.localAudio.src = e.stream
      }
      yourConn.onicecandidate = function(event) {
        if (event.candidate) {
          this.sendMessage({
            type: 'candidate',
            candidate: event.candidate
          })
        }
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
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
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
