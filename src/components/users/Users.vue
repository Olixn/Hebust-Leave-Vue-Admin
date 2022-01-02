<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区 -->
      <div style="margin-top: 15px">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入姓名"
              v-model="queryInfo.stuName"
              clearable
              @clear="getUsersList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUsersList"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="stuName"></el-table-column>
        <el-table-column label="学院" prop="stuUni"></el-table-column>
        <el-table-column label="专业" prop="stuPro"></el-table-column>
        <el-table-column label="班级" prop="stuClass"></el-table-column>
        <el-table-column label="注册时间" prop="create_time"></el-table-column>
        <el-table-column label="状态" prop="isOk" width="100px">
          <template v-slot="scope">
            <el-tag type="warning" v-if="scope.row.isOk == 0">等待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.isOk == 1"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else>拒绝审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template v-slot="scope">
            <!-- 照片按钮 -->
            <el-tooltip content="查看照片" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-picture-outline"
                size="mini"
                @click="showPicDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip content="调整状态" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showStatusDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currentPage"
        :page-sizes="[10, 15, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 模态框 - 图片 -->
    <el-dialog
      title="查看图片"
      :visible.sync="picDialogVisible"
      width="30%"
      @close="picDialogClosed"
    >
      <div class="pic">
        <p style="font-size: 18px">{{ picStuName }}</p>
        <el-image :src="picDialogUrl"></el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="picDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 模态框 - 修改 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormClosed"
    >
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.stuName" disabled></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="editForm.stuUni"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="editForm.stuPro"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="editForm.stuClass"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 模态框 - 状态 -->
    <el-dialog
      title="修改状态"
      :visible.sync="statusDialogVisible"
      width="30%"
      @close="statusDialogClosed"
    >
      <el-form label-width="70px">
        <el-form-item label="审核状态">
          <el-select v-model="opValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      queryInfo: {
        stuName: "",
        currentPage: 1,
        pageSize: 10,
      },
      userList: [],
      total: 0,
      picDialogVisible: false,
      picDialogUrl: "",
      picStuName: "",
      editDialogVisible: false,
      editForm: {},
      statusDialogVisible: false,
      options: [
        {
          value: 0,
          label: "等待审核",
        },
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 2,
          label: "拒绝审核",
        },
      ],
      opValue: "",
      opID: "",
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    getUsersList() {
      this.$axios
        .get("admin/users", { params: this.queryInfo })
        .then(({ data }) => {
          if (data.status != 200) {
            return this.$message.error("用户列表获取失败");
          }
          this.userList = data.data;
          this.total = data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showPicDialog(rowdata) {
      this.picDialogUrl = this.$axios.defaults.baseURL + rowdata.picUrl;
      this.picStuName = rowdata.stuName;
      this.picDialogVisible = true;
    },
    picDialogClosed() {
      this.picDialogUrl = "";
      this.picStuName = "";
    },
    showEditDialog(id) {
      this.$axios
        .get("admin/userInfo", { params: { id } })
        .then(({ data }) => {
          if (data.status != 200) {
            return this.$message.error("用户信息获取失败");
          }
          this.editForm = data.data;
          this.editDialogVisible = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    editFormClosed() {
      this.editForm = {};
    },
    editUserInfo() {
      this.$axios
        .put("admin/userInfo", this.editForm)
        .then(({ data }) => {
          if (data.status != 201) {
            return this.$message.error("用户信息更新失败");
          }
          this.editForm = {};
          this.editDialogVisible = false;
          this.getUsersList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    removeUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`admin/users/${id}`)
            .then(({ data }) => {
              if (data.status !== 200)
                return this.$message.error("删除用户失败");
              this.$message.success("删除用户成功");
              this.getUsersList();
            })
            .catch((err) => {
              console.error(err);
              return this.$message.error("服务器出错");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showStatusDialog(rowdata) {
      this.opID = rowdata.id;
      this.opValue = rowdata.isOk;
      this.statusDialogVisible = true;
    },
    editStatus() {
      this.$axios
        .put("admin/userStatus/" + this.opID, { isOk: this.opValue })
        .then(({ data }) => {
          if (data.status !== 200)
            return this.$message.error("修改用户状态失败");
          this.$message.success("修改用户状态成功");
          this.statusDialogVisible = false;
          this.getUsersList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    statusDialogClosed() {
      this.opID = "";
      this.opValue = "";
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUsersList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage;
      this.getUsersList();
    },
  },
};
</script>

<style>
.el-image {
  height: 400px;
}
.pic {
  text-align: center;
}
</style>
