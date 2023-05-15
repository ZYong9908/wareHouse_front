<template>
  <div style="margin: 5px">
    <el-form :inline="true" size="small">
      <el-form-item label="名称">
        <el-input v-model.trim="name" clearable placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="categorySelect" clearable placeholder="请选择">
          <el-option v-for="role in categoryList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商">
        <el-select v-model="supplierSelect" clearable placeholder="请选择">
          <el-option v-for="role in supplierList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProductList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['admin']" type="primary" @click="addDialog">添加产品</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="Id" prop="id" width="200"></el-table-column>
      <el-table-column label="产品名称" prop="name"></el-table-column>
      <el-table-column label="分类" prop="category" width="200">
        <template v-slot="scope">
          {{ findCategory(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="supplier" width="200">
        <template v-slot="scope">
          {{ findSupplier(scope.row.supplier) }}
        </template>
      </el-table-column>
      <el-table-column label="库存数量" prop="count" width="200"></el-table-column>
      <el-table-column label="最后操作时间" prop="update_time" width="200"></el-table-column>
      <el-table-column v-if="checkPermission(['admin'])" label="操作">
        <template v-slot="scope">
          <el-button v-permission="['admin']" size="small" style="margin-right: 10px" type="primary" @click="edit(scope.row,scope.$index)">编辑</el-button>
          <el-popconfirm title="确认删除这个产品？" @onConfirm="remove(scope.row,scope.$index)">
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
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :modal="false" :title="(addDialogType?'编辑':'添加')+'产品'"
               :visible.sync="addDialogVisible" width="30%">
      <el-form ref="formadd" :model="form" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" clearable placeholder="请选择">
            <el-option v-for="role in categoryList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="form.supplier" clearable placeholder="请选择">
            <el-option v-for="role in supplierList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addProduct()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import {addProduct, deleteProduct, getAllSupplier, getCategoryList, getProductList, updateProduct} from '@/api/product'

export default {
  name: 'list',
  directives: {permission},
  data() {
    return {
      tableData: [],
      name: '',
      form: {
        name: '',
        count: '0',
        category: 1,
        supplier: 1,
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        count: [{validator: /^[0-9]+$/, message: '数量必须是正整数', required: true}],
      },
      addDialogVisible: false,
      addDialogType: 0,
      categoryList: [],
      categorySelect: '',
      supplierList: [],
      supplierSelect: '',
      currentPage:1,
      pageSize:10,
      total:0
    }
  },
  mounted() {
    this.getCategoryList()
    this.getAllSupplier()
    this.getProductList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getProductList()
    },
    getAllSupplier() {
      getAllSupplier().then(res => {
        if (res.status === 1) {
          this.supplierList = [...res.supplier]
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    findCategory(id) {
      let category = this.categoryList.find(item => item.id === id)
      return category ? category.name : ''
    },
    findSupplier(id) {
      let supplier = this.supplierList.find(item => item.id === id)
      return supplier ? supplier.name : ''
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
    edit(row, index) {
      this.addDialogType = 1
      this.form.count = row.count.toString()
      this.form.name = row.name
      this.form.id = row.id
      this.form.index = index
      this.form.category = row.category
      this.form.supplier = row.supplier
      this.addDialogVisible = true
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
    addDialog() {
      this.addDialogType = 0
      this.form = {
        name: '',
        count: '0',
        category: 1,
        supplier: 1,
      }
      this.addDialogVisible = true
    },
    addProduct() {
      this.$refs.formadd.validate((valid) => {
        if (valid) {
          if (this.form.count < 0) {
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
      params = (this.supplierSelect || this.supplierSelect === 0) ? {...params, supplier: this.supplierSelect} : params
      params = {...params, page: this.currentPage, page_size: this.pageSize}
      getProductList(params).then(res => {
        if (res.status === 1) {
          this.tableData = res.product
          this.total = res.total
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
