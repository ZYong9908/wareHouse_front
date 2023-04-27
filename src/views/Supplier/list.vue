<template>
  <div style="margin: 5px">
    <el-button v-permission="['admin']" type="primary" @click="addSupplierDialog">添加供应商</el-button>
    <el-table :data="supplierList" style="width: 100%">
      <el-table-column prop="id" label="Id"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-popconfirm v-permission="['admin']" title="确认删除这个供应商？" @onConfirm="remove(scope.row,scope.$index)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加供应商" :visible.sync="addSupplierVisible" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false"
               width="30%">
      <el-form>
        <el-form-item label="供应商名称">
          <el-input v-model="addSupplierName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSupplierVisible = false">取消</el-button>
        <el-button type="primary" @click="addSupplier()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addSupplier, deleteSupplier, getAllSupplier} from '@/api/product'
import permission from '@/directive/permission'

export default {
  name: 'list',
  directives: {permission},
  data() {
    return {
      addSupplierVisible: false,
      addSupplierName: '',
      supplierList: [],
    }
  },
  mounted() {
    this.getAllSupplier()
  },
  methods: {
    remove(row, index) {
      deleteSupplier({id: row.id}).then(res => {
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.supplierList.splice(index, 1)
        } else {
          this.$message.error(res.message)
        }
      })
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
    addSupplier() {
      if (this.addSupplierName === '') {
        this.$message.error('请输入名称')
        return
      }
      // 判断是否重复
      if (this.supplierList.find(item => item.name === this.addSupplierName)) {
        this.$message.error('已存在该供应商')
        return
      }
      addSupplier({name: this.addSupplierName}).then(res => {
        if (res.status === 1) {
          this.$message.success('添加成功')
          this.addSupplierVisible = false
          this.getAllSupplier()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    addSupplierDialog() {
      this.addSupplierName = ''
      this.addSupplierVisible = true
    },
  }
}
</script>

<style scoped>

</style>
