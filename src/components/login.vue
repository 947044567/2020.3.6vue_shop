<template>
  <div class="login">
    <el-form ref="ruleForm" :model="form" :rules="rules" class="login-form">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid icon-style"></i>
        </span>
        <el-input ref="username" v-model="form.username" placeholder="Username" autocomplete="on" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont icon-suo icon-style"></i>
        </span>
        <el-input
          ref="password"
          v-model="form.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          autocomplete="on"
          @keyup.enter.native="submitForm('ruleForm')"
        />
        <span class="show-pwd" @click="showpwd">
          <i
            :class="passwordType === 'password' ? 'iconfont icon-yanjing' : 'iconfont icon-biyan'"
          />
        </span>
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="loading"
          class="loginBtn"
          type="primary"
          @click="submitForm('ruleForm')"
        >登入</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['change', 'blur']
          }
        ]
      },
      passwordType: 'password',
      loading: false
    }
  },
  mounted() {
    if (this.form.username === '') {
      this.$refs.username.focus() // 自动获取焦点
    } else if (this.form.password === '') {
      this.$refs.password.focus() // 自动获取焦点
    }
  },
  methods: {
    showpwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async submitForm(ruleForm) {
      try {
        await this.$refs[ruleForm].validate()
        const { data: res } = await this.$axios.post('login', this.form)
        if (res.meta.status === 200) {
          window.sessionStorage.setItem('token', res.data.token)
          this.$message.success(res.meta.msg)
          this.$router.push('/index')
          // this.$router.push({ name: 'index' })
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields()
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 4px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item:last-child {
    margin-left: 115px;
    margin-top: 40px;
    border: none;
    background: none;
  }
  .el-button--primary {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
  }
  .el-button:last-child {
    margin-left: 80px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 450px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    .icon-style {
      font-size: 20px;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
