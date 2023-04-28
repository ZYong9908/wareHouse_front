import checkPermission from '@/utils/permission';

export default {
  methods: {
    checkPermission(roles) {
      // 调用 checkPermission 函数的具体实现
      return checkPermission(roles);
    }
  }
}
