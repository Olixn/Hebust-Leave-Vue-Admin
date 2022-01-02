<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span @click="backWelcome">后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <!-- 菜单区 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
          background-color="#333743"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
        >
          <!-- 二级菜单 -->
          <el-menu-item
            :index="item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 图标 -->
            <i :class="iconsObj[item.id]"></i>
            <!-- 二级菜单模板区 -->
            <template slot="title">
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      menuList: [],
      iconsObj: {
        0: "el-icon-user-solid",
        1: "el-icon-s-tools",
      },
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    getMenuList() {
      this.$axios
        .get("admin/menus")
        .then(({ data }) => {
          if (data.status !== 200) return this.$message.error(data.meta.msg);
          this.menuList = data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 折叠导航
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 返回Welcome
    backWelcome() {
      this.$router.push("/welcome");
    },
  },
  created() {
    this.getMenuList();
  },
};
</script>

<style>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #333743;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #e9eef3;
  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.el-header div img {
  height: 50px;
  border-radius: 25px;
}

.el-aside {
  background-color: #333743;
}

.el-aside .el-menu {
  border-right: none;
}

.el-main {
  background-color: #e9eef3;
}

.toggle-button {
  background-color: #333743;
  line-height: 24px;
  color: #e9eef3;
  text-align: center;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: rgb(41, 44, 54);
}
</style>
