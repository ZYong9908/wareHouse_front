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
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="showDetail(scope.row.id)">库存详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;right: 20px">
      <el-pagination :current-page="listCurrentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" background
                     layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog :closable="true" :close-on-click-modal="true" :visible.sync="detailDialogVisible" title="库存详情" width="45%">
      <el-table :data="detailData" border height="500px" stripe>
        <el-table-column label="变动数量" prop="count"></el-table-column>
        <el-table-column :formatter="formatOperate" label="操作类型" prop="operate"></el-table-column>
        <el-table-column label="操作时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="user"></el-table-column>
        <el-table-column label="审核状态" prop="audit"></el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: center;">
        <el-pagination :current-page.sync="currentPage" :pager-count="5" :total="detailDataTotal" background layout="prev, pager, next"
                       page-size.sync="10" @current-change="currentChange">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAllSupplier, getCategoryList, getProductList, getProductRecords} from '@/api/product'

export default {
  name: 'list',
  data() {
    return {
      tableData: [],
      name: '',
      detailDialogIndex: 0,
      detailDialogVisible: false,
      detailData: [],
      currentPage: 1,
      detailDataTotal: 0,
      categoryList: [],
      categorySelect: '',
      supplierList: [],
      supplierSelect: '',
      listCurrentPage: 1,
      pageSize: 10,
      total: 0,
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
      this.listCurrentPage = val
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
    getProductList() {
      let params = this.name ? {name: this.name} : {}
      params = (this.categorySelect || this.categorySelect === 0) ? {...params, category: this.categorySelect} : params
      params = (this.supplierSelect || this.supplierSelect === 0) ? {...params, supplier: this.supplierSelect} : params
      params = {...params, page: this.listCurrentPage, page_size: this.pageSize}
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
