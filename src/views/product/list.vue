<template>
  <div style="margin: 5px">
    <el-form :inline="true" size="small">
      <el-form-item label="名称">
        <el-input v-model.trim="name" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="categorySelect" placeholder="请选择" clearable>
          <el-option v-for="role in categoryList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProductList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['admin']" type="primary" @click="addDialog">添加产品</el-button>
        <el-button v-permission="['admin']" type="primary" @click="addCategoryDialog">添加分类</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="Id" width="200"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="category" label="分类">
        <template v-slot="scope">
          {{ findCategory(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="库存数量" width="200"></el-table-column>
      <el-table-column prop="update_time" label="最后操作时间" width="200"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button v-permission="['admin']" type="primary" size="small" @click="showDetail(scope.row.id)">库存详情</el-button>
          <el-button v-permission="['admin']" type="primary" size="small" @click="edit(scope.row,scope.$index)">编辑</el-button>
          <el-button type="success" size="small" @click="openOperateDialog(scope.row,scope.$index,1)">入库</el-button>
          <el-button type="danger" size="small" @click="openOperateDialog(scope.row,scope.$index,0)" style="margin-right: 10px">出库</el-button>
          <el-popconfirm v-permission="['admin']" title="确认删除这个产品？" @onConfirm="remove(scope.row,scope.$index)">
            <template #reference>
              <el-button type="warning" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="(addDialogType?'编辑':'添加')+'产品'" :visible.sync="addDialogVisible" :modal="false" :close-on-click-modal="false"
               :close-on-press-escape="false" width="30%">
      <el-form :model="form" :rules="rules" ref="formadd">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input type="number" v-model="form.count"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="count">
          <el-select v-model="form.category" placeholder="请选择" clearable>
            <el-option v-for="role in categoryList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addProduct()">确认</el-button>
      </div>
    </el-dialog>
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
    <el-dialog :title="operateType===0?'出库':'入库'" :visible.sync="operateDialogVisible" :modal="false" :close-on-click-modal="false"
               :close-on-press-escape="false" width="30%">
      <el-form :model="operateDialogData" :rules="rules" ref="formoperate">
        <el-form-item label="id">
          <el-input v-model="operateDialogData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="operateDialogData.name" disabled></el-input>
        </el-form-item>
        <el-form-item :label="(operateType===0?'出库':'入库')+'数量'" prop="count">
          <el-input type="number" v-model="operateDialogData.count"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="operateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="operateCount()">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="库存详情" width="40%" :visible.sync="detailDialogVisible" :closable="true" :close-on-click-modal="true">
      <el-table :data="detailData" border stripe height="500px">
        <el-table-column prop="count" label="变动数量"></el-table-column>
        <el-table-column prop="operate" label="操作类型" :formatter="formatOperate"></el-table-column>
        <el-table-column prop="create_time" label="操作时间"></el-table-column>
        <el-table-column prop="user" label="操作人"></el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: center;">
        <el-pagination :current-page.sync="currentPage" page-size.sync="10" :total="detailDataTotal" layout="prev, pager, next" :pager-count="5"
                       @current-change="currentChange" background>
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import {
  addProduct,
  getProductList,
  updateProduct,
  deleteProduct,
  operateProduct,
  getProductRecords,
  addCategory,
  getCategoryList,
} from '@/api/product'

export default {
  name: 'list',
  directives: {permission},
  data() {
    return {
      addCategoryVisible: false,
      addCategoryName: '',
      tableData: [],
      name: '',
      form: {
        name: '',
        count: '0',
        category: 0,
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        count: [{validator: /^[0-9]+$/, message: '数量必须是正整数', required: true}],
      },
      addDialogVisible: false,
      addDialogType: 0,
      operateType: 0,
      operateDialogVisible: false,
      operateDialogData: {},
      detailDialogVisable: false,
      detailDialogIndex: 0,
      detailDialogVisible: false,
      detailData: [],
      currentPage: 1,
      detailDataTotal: 0,
      categoryList: [],
      categorySelect: '',
    }
  },
  mounted() {
    this.getCategoryList()
    this.getProductList()
  },
  methods: {
    findCategory(id) {
      let category = this.categoryList.find(item => item.id === id)
      return category ? category.name : ''
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
    formatOperate(row) {
      return row.operate === 0 ? '出库' : '入库'
    },
    currentChange(page) {
      this.currentPage = page
      this.getProductRecords()
    },
    showDetail(id) {
      this.detailDialogIndex = id
      this.currentPage = 1
      this.getProductRecords()
    },
    getProductRecords() {
      let params = {
        id: this.detailDialogIndex,
        page: this.currentPage,
        page_size: 10,
      }
      getProductRecords(params).then(res => {
        if (res.status === 1) {
          this.detailData = [...res.records]
          this.detailDialogVisible = true
          this.detailDataTotal = res.total
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    edit(row, index) {
      this.addDialogType = 1
      this.form.count = row.count.toString()
      this.form.name = row.name
      this.form.id = row.id
      this.form.index = index
      this.form.category = row.category
      this.addDialogVisible = true
    },
    openOperateDialog(row, index, type) {
      this.operateType = type
      this.operateDialogVisible = true
      this.operateDialogData = {
        name: row.name,
        count: 0,
        id: row.id,
        index: index,
      }
    },
    operateCount() {
      this.$refs.formoperate.validate((valid) => {
        if (valid) {
          if (this.operateDialogData.count <= 0) {
            this.$message.error('数量必须大于0')
            return
          }
          let data = {
            id: this.operateDialogData.id,
            count: this.operateDialogData.count,
            type: this.operateType,
          }
          operateProduct(data).then(res => {
            if (res.status === 1) {
              this.$message.success((this.operateType === 0 ? '出库' : '入库') + '成功')
              if (data.id === this.tableData[this.operateDialogData.index].id) {
                let count = Number(this.tableData[this.operateDialogData.index].count)
                if (this.operateType === 0) {
                  this.tableData[this.operateDialogData.index].count = count - Number(this.operateDialogData.count)
                } else {
                  this.tableData[this.operateDialogData.index].count = count + Number(this.operateDialogData.count)
                }
                this.operateDialogVisible = false
                this.tableData = [...this.tableData]
              } else this.getProductList()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    remove(row, index) {
      deleteProduct({id: row.id}).then(res => {
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    addCategoryDialog() {
      this.addCategoryName = ''
      this.addCategoryVisible = true
    },
    addDialog() {
      this.addDialogType = 0
      this.form = {
        name: '',
        count: '0',
        category: 0,
      }
      this.addDialogVisible = true
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
    addProduct() {
      this.$refs.formadd.validate((valid) => {
        if (valid) {
          if (this.operateDialogData.count < 0) {
            this.$message.error('数量不能小于0')
            return
          }
          if (!this.form.category && this.form.category !== 0) {
            this.$message.error('请选择分类')
            return
          }
          if (this.addDialogType === 0) {

            addProduct(this.form).then(res => {
              if (res.status === 1) {
                this.$message.success('添加成功')
                this.getProductList()
                this.addDialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            updateProduct(this.form).then(res => {
              if (res.status === 1) {
                this.$message.success('修改成功')
                if (this.tableData[this.form.index].id === this.form.id) {
                  this.tableData[this.form.index] = res.product
                  this.tableData = [...this.tableData]
                } else this.getProductList()
                this.addDialogVisible = false
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    getProductList() {
      let params = this.name ? {name: this.name} : {}
      params = (this.categorySelect || this.categorySelect === 0) ? {...params, category: this.categorySelect} : params
      getProductList(params).then(res => {
        if (res.status === 1) {
          this.tableData = res.product
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
