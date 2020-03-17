<template>
  <div class="order">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
            @keyup.enter.native="searchUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="140px"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="120px">
          <template v-slot:default="{row}">
            <el-tag v-if="row.order_pay==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="sucess">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="120px"></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template v-slot:default="{row}">{{ row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot:default="{row}">
            <!-- 修改地址 -->
            <el-button
              @click="showEditDialog(row.goods_id)"
              size="small"
              plain
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <!-- 物流进度 -->
            <el-button
              @click="showProgressBox(row.goods_id)"
              size="small"
              plain
              icon="el-icon-location"
              type="success"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addOrderDialogVisible"
        width="50%"
        @close="orderDialogClosed"
      >
        <!-- 修改地址的表单 -->
        <el-form
          :model="addOrderForm"
          :rules="addOrderFormRules"
          ref="addOrderFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县：" prop="address1">
            <el-cascader :options="cityData" v-model="addOrderForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address2">
            <el-input v-model="addOrderForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addOrderDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrderInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流进度对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
      >
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderlist: [],
      total: 0,
      // 展示修改地址的对话框
      addOrderDialogVisible: false,
      addOrderForm: {
        address1: [],
        address2: ''
      },
      addOrderFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: ['blur', 'change']
          }
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  computed: {},
  methods: {
    async getOrderList() {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.orderlist = res.data.goods
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    searchUser() {},
    showEditDialog(id) {
      this.addOrderDialogVisible = true
    },
    async showProgressBox(id) {
      const { data: res } = await this.$axios.get(`/kuaidi/${1106975712662}`)
      console.log(res)
      if (res.meta.status === 200) {
        this.progressInfo = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
      this.progressVisible = true
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    orderDialogClosed() {
      this.$refs.addOrderFormRef.resetFields()
    },
    addOrderInfo() {}
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
