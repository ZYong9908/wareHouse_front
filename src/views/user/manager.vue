<template>
  <div style="padding: 5px">
    <params @search="search" :roles="roles"/>
    <user-list :userList="userList" :roles="roles" @editUser="editUser" @delUser="delUser"/>
    <div style="position: absolute;right: 20px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" background
                     layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
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
      currentPage:1,
      pageSize:10,
      total:0
    }
  },
  mounted() {
    this.getAllUser()
    this.getRoleList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllUser()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getAllUser()
    },
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
      let params={
        ...this.filters,
        page:this.currentPage,
        page_size:this.pageSize
      }
      getAllUser(params).then(res => {
        if (res.status === 1) {
          this.userList = res.users
          this.total = res.total
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
