<template>
  <v-container class="d-flex justify-start">
    <v-card width="450" color="blue" dark>
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
        :items="users"
        :search="search"
        light
      >
      <!-- 用户名 -->
        <template v-slot:item.user_name="{ item }">
           <font
              v-for="(char, index) in item.user_name"
              :key="index + 'only'"
              class="name_font"
              v-bind:color="nameColor(item)[index]"
           >
              {{ char === ' ' ? '&nbsp;' : char }}
           </font>
        </template>
      <!-- 消息 -->
        <template v-slot:item.message="{ item }">
          <v-badge
            v-if=1
            color="pink"
            dot
            overlap
          >
            <v-icon
              class="mr-2"
              color="blue"
              @click="openSession(item)"
            >
              mdi-message-outline
            </v-icon>
          </v-badge>
          <v-icon
              v-else
              class="mr-2"
              color="blue"
              @click="openSession(item)"
            >
              mdi-message-outline
          </v-icon>
        </template>
      <!-- 删除 -->
        <template v-slot:item.remove="{ item }">
            <v-btn
              icon
              @click.stop="dialog = true"
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
          v-model="dialog"
          persistent
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to remove this user
              <br>
              from your friend list?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                Yes
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                No
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import global from '@/global'

export default {
  data () {
    return {
      dialog: false,
      search: '',
      headers: [
        {
          text: 'User Name',
          align: 'start',
          sortable: false,
          value: 'user_name',
          width: '80%'
        },
        {
          text: 'Message',
          align: 'center',
          sortable: false,
          value: 'message',
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
      users: [
        {
          user_name: 'Shane',
          rating: 3000
        },
        {
          user_name: 'Travis Howard',
          rating: 2400
        },
        {
          user_name: 'Travis Howard',
          rating: 2100
        },
        {
          user_name: 'Travis Howard',
          rating: 1900
        },
        {
          user_name: 'Travis Howard',
          rating: 1600
        },
        {
          user_name: 'Travis Howard',
          rating: 1400
        },
        {
          user_name: 'Travis Howard',
          rating: 1200
        }
      ]
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    nameColor (item) {
      return global.nameColor(item.user_name, item.rating)
    }
  },
  computed: {
  },
  async mounted () {
  }
  // watch: {
  //   email (value) {
  //     console.log('email has changed', value)
  //   }
  // }
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
