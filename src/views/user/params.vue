<template>
  <div class="filter-container">
    <el-form :inline="true" size="small">
      <el-form-item label="用户名">
        <el-input v-model.trim="filters.username" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model.trim="filters.role" placeholder="请选择" clearable>
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" title="添加用户" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option
                v-for="option in roles"
                :key="option.id"
                :label="option.name"
                :value="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="form.repassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {userRegister} from '@/api/user'

export default {
  name: 'params',
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入密码'))
      }
      if (!/^[a-zA-Z0-9_.]{6,18}$/.test(value)) {
        callback(new Error('密码应为6-18位字母、数字、.、_'))
      } else if (value !== this.form.repassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        username: '',
        role: '',
        password: '',
        repassword: '',
      },
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
        ],
        role: [
          {required: true, message: '用户角色不能为空', trigger: 'change'},
        ],
        password: [
          {validator: validatePass, trigger: 'blur'},
        ],
        repassword: [
          {validator: validatePass, trigger: 'blur'},
        ],
      },
      filters: {
        username: '',
        role: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          userRegister(this.form).then(res => {
            this.$message.success('添加成功')
            this.$emit('search', this.filters)  // 将filterData数据传递给父组件进行处理
            this.dialogVisible = false
          }).catch(err => {
            this.$message.error(err)
          })
        } else {
          // 这里使用 Element UI 的消息通知组件弹出错误提示框
          this.$message.error('请检查表单数据是否正确。')
          return false
        }
      })
    },

    addUser() {
      this.dialogVisible = true
    },
    submit() {
      this.$emit('search', this.filters)  // 将filterData数据传递给父组件进行处理
    },
  },
}
</script>

<style scoped>

</style>
