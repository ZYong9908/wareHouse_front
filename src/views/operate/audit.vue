<template>
  <div style="margin: 5px">
    <el-form :inline="true" size="small">
      <el-form-item label="审核状态">
        <el-select v-model="auditTypeSelect" clearable placeholder="请选择">
          <el-option v-for="role in auditTypeList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAuditList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="auditList" style="width: 100%">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="产品名称" prop="product"></el-table-column>
      <el-table-column label="数量" prop="count"></el-table-column>
      <el-table-column :formatter="formatOperate" label="操作类型" prop="operate"></el-table-column>
      <el-table-column label="用户" prop="user"></el-table-column>
      <el-table-column label="创建时间" prop="create_time">
        <template v-slot="scope">
          {{ scope.row.create_time | formatTime }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="audit"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button :disabled="scope.row.audit === '通过'" size="mini" type="primary" @click="auditRecord(scope.row,1)">通过</el-button>
          <el-button :disabled="scope.row.audit === '不通过'" size="mini" type="danger" @click="auditRecord(scope.row,2)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;right: 20px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" background
                     layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {auditRecord, getProductRecords} from '@/api/product'

export default {
  name: 'audit',
  data() {
    return {
      auditTypeSelect: 0,
      auditTypeList: [
        {id: 0, name: '待审核'},
        {id: 1, name: '通过'},
        {id: 2, name: '不通过'},
      ],
      auditList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  mounted() {
    this.getAuditList()
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
    auditRecord(row, audit) {
      let data = {
        id: row.id,
        audit: audit,
      }
      auditRecord(data).then(res => {
        if (res.status === 1) {
          this.$message.success('审核成功')
          if (audit === 1) {
            row.audit = '通过'
          } else {
            row.audit = '不通过'
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    formatOperate(row) {
      return row.operate === 0 ? '出库' : '入库'
    },
    getAuditList() {
      getProductRecords({audit: this.auditTypeSelect, page: this.currentPage, limit: this.pageSize}).then(res => {
        if (res.status === 1) {
          this.auditList = [...res.records]
          this.total = res.total
        } else {
          this.$message.error('获取失败')
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
