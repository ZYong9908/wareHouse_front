<template>
  <div style="padding: 5px">
    <params @search="search" :roles="roles"/>
    <user-list :userList="userList" :roles="roles" @editUser="editUser" @delUser="delUser"/>
  </div>
</template>

<script>
import {getAllUser, getRoleList} from '@/api/user'
import params from '@/views/user/params.vue'
import UserList from '@/views/user/userList.vue'

export default {
  name: 'manager',
  components: {
    UserList,
    params,
  },
  data() {
    return {
      userList: [],
      filters: {},
      roles: [],
    }
  },
  mounted() {
    this.getAllUser()
    this.getRoleList()
  },
  methods: {
    delUser(id, index) {
      this.userList[index].id === id ? this.userList.splice(index, 1) : this.getAllUser()
    },
    editUser(data, index) {
      this.userList[index].username = data.username
      this.userList[index].role = this.roles.find(item => item.id === data.role)
    },
    search(filters) {
      this.filters = filters
      this.getAllUser()
    },
    getRoleList() {
      getRoleList().then(res => {
        if (res.status === 1) {
          this.roles = res.roles
        }
      })
    },
    getAllUser() {
      getAllUser(this.filters).then(res => {
        if (res.status === 1) {
          this.userList = res.users
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
