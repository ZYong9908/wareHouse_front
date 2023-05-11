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
          <el-button size="small" style="margin-right: 10px" type="warning" @click="openOperateDialog(scope.row,scope.$index,0)">出库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :modal="false" :title="operateType===0?'出库':'入库'"
               :visible.sync="operateDialogVisible" width="30%">
      <el-form ref="formoperate" :model="operateDialogData" :rules="rules">
        <el-form-item label="id">
          <el-input v-model="operateDialogData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="operateDialogData.name" disabled></el-input>
        </el-form-item>
        <el-form-item :label="(operateType===0?'出库':'入库')+'数量'" prop="count">
          <el-input v-model="operateDialogData.count" type="number"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="operateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="operateCount()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAllSupplier, getCategoryList, getProductList, operateProduct} from '@/api/product'
import checkPermission from '@/utils/permission'

export default {
  name: 'chuku',
  data() {
    return {
      tableData: [],
      name: '',
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        count: [{validator: /^[0-9]+$/, message: '数量必须是正整数', required: true}],
      },
      operateType: 0,
      operateDialogVisible: false,
      operateDialogData: {},
      categoryList: [],
      categorySelect: '',
      supplierList: [],
      supplierSelect: '',
    }
  },
  mounted() {
    this.getCategoryList()
    this.getProductList()
    this.getAllSupplier()
  },
  methods: {
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
              if (checkPermission(['admin'])) {
                if (data.id === this.tableData[this.operateDialogData.index].id) {
                  let count = Number(this.tableData[this.operateDialogData.index].count)
                  if (this.operateType === 0) {
                    this.tableData[this.operateDialogData.index].count = count - Number(this.operateDialogData.count)
                  } else {
                    this.tableData[this.operateDialogData.index].count = count + Number(this.operateDialogData.count)
                  }
                  this.tableData = [...this.tableData]
                } else this.getProductList()
              }
              this.operateDialogVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    getProductList() {
      let params = this.name ? {name: this.name} : {}
      params = (this.categorySelect || this.categorySelect === 0) ? {...params, category: this.categorySelect} : params
      params = (this.supplierSelect || this.supplierSelect === 0) ? {...params, supplier: this.supplierSelect} : params
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
