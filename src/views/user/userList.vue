<template>
  <div>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="role.name" label="用户角色"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" @click="edit(scope.row,scope.$index)">编辑</el-button>
          <el-popconfirm title="确认删除这个用户吗？" style="margin-left: 5px" @onConfirm="delConfirm(scope.row,scope.$index)">
            <el-button v-slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="编辑用户信息" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option
                v-for="role in roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="create_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <el-input v-model="update_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="password">
          <el-input type="password" v-model="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="repassword" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="validateForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import {updateUser, delUser} from '@/api/user'

export default {
  name: 'userList',
  props: {
    userList: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    create_time() {
      return this.formatTime(this.form.create_time)
    },
    update_time() {
      return this.formatTime(this.form.update_time)
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      password: '',
      repassword: '',
      validatePass2: (rule, value, callback) => {
        if (value !== '' && !/^[a-zA-Z0-9_.]{6,18}$/.test(value)) {
          callback(new Error('密码应为6-18位字母、数字、.、_'))
        } else if (value !== '' && this.password !== this.repassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
        ],
        password: [
          {validator: this.validatePass2, trigger: 'blur'},
        ],
        repassword: [
          {validator: this.validatePass2, trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    delConfirm(row, index) {
      if (row.username === this.$store.getters.name) {
        this.$message.error('不能删除自己')
        return
      }
      delUser({id: row.id}).then(res => {
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.$emit('delUser', row.id, index)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    validateForm() {
      // 处理密码相关的校验规则
      const passwordRules = []
      if (this.password.trim() !== '' || this.repassword.trim() !== '') {
        passwordRules.push({validator: this.validatePass2, trigger: 'blur'})
      }
      this.rules.password = passwordRules
      this.rules.repassword = passwordRules

      // 验证表单数据
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            id: this.form.id,
            username: this.form.username,
            role: this.form.role,
            password: this.password,
            repassword: this.repassword,
          }
          if (!data.password) {
            delete data.password
          }
          if (!data.repassword) {
            delete data.repassword
          }
          updateUser(data).then(res => {
            if (res.status === 1) {
              this.$message.success('修改成功')
              this.$emit('editUser', data, this.form.index)
              this.dialogVisible = false // 关闭对话框
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          // 这里使用 Element UI 的消息通知组件弹出错误提示框
          this.$message.error('请检查表单数据是否正确。')
          return false
        }
      })
    },
    edit(row, index) {
      console.log(index)
      this.form = {...row}
      this.form.role = row.role.id
      this.form.index = index
      this.dialogVisible = true
    },
  },
}
</script>

<style scoped>

</style>
