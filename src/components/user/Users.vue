<template>
  <div class="user">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserList"
            @keyup.enter.native="searchUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="{row}">
            <el-switch
              @change="changeState(row.id,row.mg_state)"
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template v-slot:default="{row}">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(row.id)"
              size="small"
              plain
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="delUser(row.id)"
              size="small"
              plain
              icon="el-icon-delete"
              type="danger"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-button
              @click="showRoleDialog(row)"
              size="small"
              plain
              icon="el-icon-setting"
              type="success"
            >分配角色</el-button>
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="roleDialogClosed">
      <div>
        <p class="mgBottom">当前的用户：{{userInfo.username}}</p>
        <p class="mgBottom">当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesInfo">确 定</el-button>
      </span>
    </el-dialog>
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
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制对话的显示与隐藏
      addDialogVisible: false,
      // 修改对话的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      editForm: {},
      // 添加用户的表单验证
      editFormRules: {
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      roleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色数据的列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.userlist = res.data.users
        this.total = res.data.total
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async changeState(id, flag) {
      const { data: res } = await this.$axios.put(`users/${id}/state/${flag}`)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status === 200) {
        this.editForm = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
      this.editDialogVisible = true
    },
    async delUser(id) {
      try {
        await this.$confirm('你确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { data: res } = await this.$axios.delete(`users/${id}`)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          // 如果当前页只有一条了，删除后，当前页--
          if (this.userlist.length === 1 && this.queryInfo.pagenum > 1) {
            this.queryInfo.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    searchUser() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    async showRoleDialog(row) {
      this.userInfo = row
      const { data: res } = await this.$axios.get('roles')
      console.log(res)
      if (res.meta.status === 200) {
        this.rolesList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
      this.roleDialogVisible = true
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    async addUser() {
      try {
        await this.$refs.addFormRef.validate()
        const { data: res } = await this.$axios.post('users', this.addForm)
        console.log(res)
        if (res.meta.status === 201) {
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.total++
          this.queryInfo.pagenum = Math.ceil(
            this.total / this.queryInfo.pagesize
          )
          this.getUserList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 修改用户,并提交
    async editUserInfo() {
      try {
        await this.$refs.editFormRef.validate()
        const { data: res } = await this.$axios.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 点击按钮分配角色
    async rolesInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$axios.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.roleDialogVisible = false
        this.getUserList()
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    roleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.mgBottom{
  margin-bottom: 16px;
}
</style>
