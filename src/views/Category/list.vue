<template>
<div style="margin: 5px">
  <el-button v-permission="['admin']" type="primary" @click="addCategoryDialog">添加分类</el-button>
  <el-table :data="categoryList" style="width: 100%">
    <el-table-column prop="id" label="Id" ></el-table-column>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column label="操作">
      <template v-slot="scope">
        <el-popconfirm v-permission="['admin']" title="确认删除这个分类？" @onConfirm="remove(scope.row,scope.$index)">
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="添加分类" :visible.sync="addCategoryVisible" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false"
             width="30%">
    <el-form>
      <el-form-item label="分类名称">
        <el-input v-model="addCategoryName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addCategoryVisible = false">取消</el-button>
      <el-button type="primary" @click="addCategory()">确认</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {addCategory, deleteCategory, getCategoryList} from '@/api/product'
import permission from '@/directive/permission'

export default {
  name: 'list',
  directives: {permission},
  data() {
    return {
      addCategoryVisible: false,
      addCategoryName: '',
      categoryList: [],
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    remove(row, index) {
      deleteCategory({id: row.id}).then(res => {
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.categoryList.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getCategoryList() {
      getCategoryList().then(res => {
        if (res.status === 1) {
          this.categoryList = [...res.category]
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    addCategory() {
      if (this.addCategoryName === '') {
        this.$message.error('请输入名称')
        return
      }
      // 判断是否重复
      if (this.categoryList.find(item => item.name === this.addCategoryName)) {
        this.$message.error('已存在该分类')
        return
      }
      addCategory({name: this.addCategoryName}).then(res => {
        if (res.status === 1) {
          this.$message.success('添加成功')
          this.addCategoryVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    addCategoryDialog() {
      this.addCategoryName = ''
      this.addCategoryVisible = true
    },
  }
}
</script>

<style scoped>

</style>
