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

        <template v-slot:item.message="{ item }">
          <v-icon
            class="mr-2"
            color="blue"
            @click="openSession(item)"
          >
            mdi-message-badge-outline
          </v-icon>
        </template>
        <template v-slot:item.remove="{ item }">
          <v-icon
            class="mr-2"
            color="grey"
            @click="deleteFriend(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- <v-card
      width="400"
    >
      <v-toolbar
        color="blue"
        dark
      >
        <v-toolbar-title>Friends</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <template
          v-for="(item, index) in users"
          class="d-flex"
        >
          <v-list-item
            :key="index"
          >
            <v-title v-html="item.title" class="mr-auto"></v-title>
            <v-btn
                icon
                color="grey"
              >
                <v-icon>mdi-message-outline</v-icon>
            </v-btn>
            <v-btn
                icon
                color="blue"
              >
                <v-icon>mdi-message-badge-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              color="orange darken-2"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list>
    </v-card> -->
  </v-container>
</template>

<script>
import global from '@/global'

export default {
  data () {
    return {
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
      return global.nameColor(item.user_name, item.rating, [{}])
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
