import request from '@/utils/request'

export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data,
  })
}

export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params: params,
  })
}

export function updateProduct(data) {
  return request({
    url: '/product',
    method: 'put',
    data,
  })
}

export function deleteProduct(data) {
  return request({
    url: '/product',
    method: 'delete',
    data,
  })
}

///product/operate
export function operateProduct(data) {
  return request({
    url: '/product/operate',
    method: 'post',
    data,
  })
}

// /product/records
export function getProductRecords(params) {
  return request({
    url: '/product/records',
    method: 'get',
    params,
  })
}

export function getCategoryList(params) {
  return request({
    url: '/product/category',
    method: 'get',
    params,
  })
}

export function addCategory(data) {
  return request({
    url: '/product/category',
    method: 'post',
    data,
  })
}

export function getAllSupplier() {
  return request({
    url: '/product/supplier',
    method: 'get',
  })
}
export function deleteCategory(data) {
  return request({
    url: '/product/category',
    method: 'delete',
    data,
  })
}
// addSupplier
export function addSupplier(data) {
  return request({
    url: '/product/supplier',
    method: 'post',
    data,
  })
}
// deleteSupplier
export function deleteSupplier(data) {
  return request({
    url: '/product/supplier',
    method: 'delete',
    data,
  })
}
///product/audit
export function auditRecord(data) {
  return request({
    url: '/product/audit',
    method: 'post',
    data,
  })
}
