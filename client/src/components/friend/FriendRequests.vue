<template>
    <v-card width="470">
      <v-toolbar flat dense class="blue" dark>
        <v-toolbar-title>Friend Requests</v-toolbar-title>
        <slot name="action" />

        <v-spacer></v-spacer>

        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        loader-height="0"
        :search="search"
      >
        <template v-slot:item.User.user_name="{ item }">
          <div
            @click="navigateTo({
              name: 'profile',
              params: {
                username: item.User.user_name
              }
            })"
            class="mydiv"
          >
            <font
              v-for="(char, index) in item.User.user_name"
              :key="index + 'only'"
              v-bind:color="nameColor(item.User)[index]"
            >
              {{char}}
            </font>
          </div>
        </template>

        <template v-slot:item.accept="{ item }">
          <v-btn
            icon
            @click.stop="accept(item)"
          >
            <v-icon
              color="green"
            >
              mdi-check
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.refuse="{ item }">
          <v-btn
            icon
            @click.stop="refuse(item)"
          >
            <v-icon
              color="red"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
</template>

<script>
import FriendServices from '@/services/FriendServices'
import global from '@/global'

export default {
  data () {
    return {
      users: [],
      search: ''
    }
  },
  computed: {
    headers () {
      return [
        {
          text: 'User',
          align: 'start',
          value: 'User.user_name'
        },
        { text: 'Country', sortable: false, value: 'User.country' },
        { text: 'Accept', sortable: false, value: 'accept' },
        { text: 'Refuse', sortable: false, value: 'refuse' }
      ]
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    nameColor (User) {
      return global.nameColor(User.user_name, User.rating ? User.rating : -1)
    },
    async accept (item) {
      try {
        const response = await FriendServices.accept(item.User.id)
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: response.data.msg,
          redirectName: null
        })
        this.users.splice(this.users.indexOf(item), 1)
      } catch (error) {
        console.log(error)
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: error,
          redirectName: null
        })
      }
    },
    async refuse (item) {
      try {
        const response = await FriendServices.refuse(item.User.id)
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: response.data.msg,
          redirectName: null
        })
        this.users.splice(this.users.indexOf(item), 1)
      } catch (error) {
        console.log(error)
        this.$store.dispatch('setDialog', {
          dialog: true,
          error: error,
          redirectName: null
        })
      }
    }
  },
  async mounted () {
    try {
      const response = await FriendServices.getRequests()
      this.users = response.data
      // console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mydiv :hover{
  cursor: pointer
}
</style>
