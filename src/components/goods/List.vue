<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @keyup.enter.native="searchUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="125px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template v-slot:default="{row}">
            {{ row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot:default="{row}">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(row.goods_id)"
              size="small"
              plain
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="delGoodsList(row.goods_id)"
              size="small"
              plain
              icon="el-icon-delete"
              type="danger"
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      addDialogVisible: false,
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    searchUser() {
      this.getGoodsList()
    },
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.goodsList = res.data.goods
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    showEditDialog(id) {},
    async delGoodsList(id) {
      try {
        await this.$confirm('你确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { data: res } = await this.$axios.delete(`goods/${id}`)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          // 如果当前页只有一条了，删除后，当前页--
          if (this.goodsList.length === 1 && this.queryInfo.pagenum > 1) {
            this.queryInfo.pagenum--
          }
          this.getGoodsList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
