<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <!-- <img src="../../assets/img/Alex_Gdd.png" alt /> -->
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <img
          data-v-d16d6306
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
          class="user-avatar"
        />
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧区域 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    logout() {
      this.$confirm('你确认退出本系统吗？', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 点击按钮切换折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    // 238, 238, 238
    height: 60px;
    display: flex;
    padding: 0;
    .logo {
      width: 200px;
      padding: 10px;
      img {
        height: 40px;
        display: block;
        margin: 0 auto;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      h1 {
        color: #fff;
        line-height: 60px;
      }
    }
    .logout {
      width: 200px;
      font-weight: 700;
      text-align: right;
      padding: 10px;
      padding-right: 20px;
      line-height: 40px;

      a {
        color: rgb(64, 158, 255);
      }
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        margin-right: 5px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu{
      border-right:none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 20px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
</style>
