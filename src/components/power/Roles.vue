<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="{row}">
            <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRolesById(row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="delRolesById(row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="delRolesById(row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
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
              @click="showRolesDialog(row)"
              size="small"
              plain
              icon="el-icon-setting"
              type="success"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配用户角色的对话框 -->
    <el-dialog title="分配权限" :visible.sync="rolesDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="defaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rolesDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status === 200) {
        this.rolesList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    async delRolesById(row, id) {
      try {
        await this.$confirm('你确认要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { data: res } = await this.$axios.delete(`roles/${row.id}/rights/${id}`)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          row.children = res.data
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 展示分配权限的对话框
    async showRolesDialog(row) {
      this.roleId = row.id
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status === 200) {
        this.rightsList = res.data
        // 设置选中
        // 应该设置三级，如果真的所有的三级都被选中了，对应的二级和一级会自动选中
        // this.$refs.tree.setCheckedKeys([])
        // 需求：获取所有的三级权限的id，用于设置
        const ids = []
        row.children.forEach(l1 => {
          // 拿到所有的一级
          l1.children.forEach(l2 => {
            // 拿到所有的二级
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.defKeys = ids
      } else {
        this.$message.error(res.meta.msg)
      }
      this.rolesDialogVisible = true
    },
    // 点击为角色分配权限
    async rolesInfo() {
      // 点击分配权限按钮时，先获取到所有选中的权限，后发送ajax进行分配请求
      // 所有的选中的包含的全选 和 半选的，这两个id都是要的
      const ids = this.$refs.treeRef.getCheckedKeys()
      const halfs = this.$refs.treeRef.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (res.meta.status === 200) {
        this.rolesDialogVisible = false
        this.$message.success(res.meta.msg)
        this.getRolesList()
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
