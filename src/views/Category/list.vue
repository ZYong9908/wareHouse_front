<template>
  <div style="margin: 5px">
    <el-button v-permission="['admin']" type="primary" @click="addCategoryDialog">添加分类</el-button>
    <el-table :data="categoryList" style="width: 100%">
      <el-table-column label="Id" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column v-if="checkPermission(['admin'])" label="操作">
        <template v-slot="scope">
          <el-popconfirm title="确认删除这个分类？" @onConfirm="remove(scope.row,scope.$index)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;right: 20px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" background
                     layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :modal="false" :visible.sync="addCategoryVisible" title="添加分类"
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
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
      getCategoryList({page: this.currentPage, page_size: this.pageSize}).then(res => {
        if (res.status === 1) {
          this.categoryList = [...res.category]
          this.total = res.total
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
  },
}
</script>

<style scoped>

</style>
