<template>
  <v-container class="d-flex justify-space-around" fluid>
    <v-card width="470" color="blue" dark class="align-self-start">
      <v-card-title>
        My Friends
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="friends"
        :search="search"
        light
      >
      <!-- 用户名 -->
        <template v-slot:item.User.user_name="{ item }">
           <font
              v-for="(char, index) in item.User.user_name"
              :key="index + 'only'"
              class="name_font"
              v-bind:color="nameColor(item.User)[index]"
           >
              {{ char === ' ' ? '&nbsp;' : char }}
           </font>
        </template>
      <!-- 消息 -->
        <template v-slot:item.hasUnviewed="{ item }">
          <v-badge
            color="pink"
            dot
            overlap
            :value="item.hasUnviewed===true"
          >
            <v-icon
              class="mr-2"
              color="blue"
              @click="openSession(item)"
            >
              mdi-message-outline
            </v-icon>
          </v-badge>
        </template>
      <!-- 删除 -->
        <template v-slot:item.remove="{ item }">
            <v-btn
              icon
              @click.stop="removeItem=item; deldialog=true"
            >
              <v-icon
                color="grey"
              >
                mdi-delete
              </v-icon>
            </v-btn>
        </template>
      </v-data-table>
    <!-- 确认删除对话框 -->
      <v-dialog
          v-model="deldialog"
          persistent
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h5">
            </v-card-title>
            <v-card-text class="text-h5">
              Are you sure?
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                color="blue darken-1"
                text
                @click="deldialog=false;removeFriend()"
              >
                Yes
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="removeItem=null;deldialog=false"
              >
                No
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-card>
    <chat-room :session="chatItem" @close="closeSession"></chat-room>
  </v-container>
</template>

<script>
import global from '@/global'
import FriendServices from '@/services/FriendServices'
import MessageServices from '@/services/MessageServices'
const ChatRoom = () => import('@/components/friend/ChatRoom')

export default {
  components: {
    ChatRoom
  },
  data () {
    return {
      removeItem: null,
      chatItem: null,
      deldialog: false,
      search: '',
      headers: [
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'User.user_name',
          width: '70%'
        },
        {
          text: 'Chat',
          align: 'center',
          sortable: false,
          value: 'hasUnviewed',
          filterable: false
        },
        {
          text: 'Remove',
          align: 'center',
          sortable: false,
          value: 'remove',
          filterable: false
        }
      ],
      friends: []
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    nameColor (item) {
      return global.nameColor(item.user_name, item.rating)
    },
    async removeFriend () {
      try {
        this.friends = this.friends.filter(item => {
          return item.User.user_name !== this.removeItem.User.user_name
        })
        await FriendServices.remove({
          id1: this.removeItem.id1,
          id2: this.removeItem.id2
        })
      } catch (error) {
        console.log(error)
      }
      if (this.removeItem === this.chatItem) this.chatItem = null
      this.removeItem = null
    },
    openSession (item) {
      this.chatItem = item
    },
    closeSession () {
      this.chatItem = null
    },
    // 定时事件
    createIntervals () {
      let _this = this
      _this.IntervalTime = new Array(this.friends.length)
      // 为每个好友添加新消息监控
      _this.friends.forEach(async (element, index) => {
        // console.log(JSON.stringify(element))
        _this.IntervalTime[index] = setInterval(() => {
          setTimeout(async function () {
            const promises = _this.friends.map(_this.checkUnviewed)
            await Promise.all(promises)
          }, Math.floor(Math.random() * 1000))
        }, 5000)
      })
    },
    async checkUnviewed (element, index) {
      const ret = await MessageServices.checkNew(
        element.id1 === this.$store.state.user.id
          ? {sender_id: element.id2, receiver_id: element.id1}
          : {sender_id: element.id1, receiver_id: element.id2}
      )
      let tmp = element
      if (tmp === this.chatItem) {
        if (this.chatItem.hasUnviewed !== undefined && this.chatItem.hasUnviewed !== ret.data.hasUnviewed) {
          let pre = this.chatItem
          pre.hasUnviewed = ret.data.hasUnviewed
          this.chatItem.hasUnviewed = ret.data.hasUnviewed
          console.log(this.chatItem)
        }
      }
      tmp['hasUnviewed'] = ret.data.hasUnviewed
      this.$set(this.friends, index, tmp)
    }
  },
  computed: {
  },
  async mounted () {
    await global.checkLogin()
    try {
      let res = await FriendServices.index()
      this.friends = res.data

      const promises = this.friends.map(this.checkUnviewed)
      await Promise.all(promises)

      // 按字典序排列
      this.friends.sort((a, b) => a.User.user_name.localeCompare(b.User.user_name))
      this.createIntervals()
    } catch (error) {
      console.log(error)
    }
  },
  async destroyed () {
    this.IntervalTime.forEach(async (element, index) => {
      clearInterval(this.IntervalTime[index])
    })
  },
  watch: {
    // friends (value) {
    //   this.friends = value
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name_font {
  font-weight: 600
}

.title_font {
  font-weight: 600
}

.v-data-table {
  border-radius: 0
}
</style>
