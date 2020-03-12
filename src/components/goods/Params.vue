<template>
  <div class="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedParamsKeys"
            :options="paramsList"
            :props="paramsProps"
            @change="parentParamsChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab区域 -->
      <el-tabs v-model="activeName" @tab-click="handleParamsClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="{row}">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="{row}">
                <!-- 修改按钮 -->
                <el-button
                  @click="showEditParamsDialog(row.attr_id)"
                  size="small"
                  plain
                  icon="el-icon-edit"
                  type="primary"
                >编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                  @click="delParamsUser(row.attr_id)"
                  size="small"
                  plain
                  icon="el-icon-delete"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="{row}">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="{row}">
                <!-- 修改按钮 -->
                <el-button
                  @click="showEditParamsDialog(row.attr_id)"
                  size="small"
                  plain
                  icon="el-icon-edit"
                  type="primary"
                >编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                  @click="delParamsUser(row.attr_id)"
                  size="small"
                  plain
                  icon="el-icon-delete"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      paramsList: [],
      // 指定级联选择器的配置对象
      paramsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedParamsKeys: [],
      // 默认选中的tab
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      addDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入正确的参数',
            trigger: ['blur', 'change']
          }
        ]
      },
      editDialogVisible: false,
      editParamsForm: {
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入正确的参数',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedParamsKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedParamsKeys.length === 3) {
        return this.selectedParamsKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status === 200) {
        this.paramsList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 选择项发生变化触发这个函数
    parentParamsChange() {
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleParamsClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedParamsKeys.length !== 3) {
        this.selectedParamsKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类的id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的默认显示与影藏
        item.inputVisible = false
        // 控制文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 展示修改的对话框
    async showEditParamsDialog(id) {
      // 查询当前参数的信息
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status === 200) {
        this.editParamsForm = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
      this.editDialogVisible = true
    },
    // 删除按钮
    async delParamsUser(id) {
      try {
        await this.$confirm('你确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { data: res } = await this.$axios.delete(
          `categories/${this.cateId}/attributes/${id}`
        )
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.getParamsData()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击按钮添加参数
    async addParamsUser() {
      try {
        await this.$refs.addParamsFormRef.validate()
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          // this.total++
          // this.queryInfo.pagenum = Math.ceil(
          //   this.total / this.queryInfo.pagesize
          // )
          this.getParamsData()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 点击按钮修改参数
    async editParamsUser() {
      try {
        await this.$refs.editParamsFormRef.validate()
        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
          // this.total++
          // this.queryInfo.pagenum = Math.ceil(
          //   this.total / this.queryInfo.pagesize
          // )
          this.getParamsData()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 文本库失去焦点的时候触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return就发送请求
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存数据
      this.saveAttrVals(row)
    },
    // 点击按钮，展示文本框输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    // 将对attr_vals的操作保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
