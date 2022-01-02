<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>申请审核</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <div style="margin-top: 15px">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入审核编号"
              v-model="queryInfo.taskid"
              clearable
              @clear="getTasksList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getTasksList"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表区 -->
      <el-table :data="taskList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="stuName"></el-table-column>
        <el-table-column label="类型" width="60px">
          <template v-slot="scope">
            {{ type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column
          label="原因"
          prop="reason"
          width="100px"
        ></el-table-column>
        <el-table-column label="去往地">
          <template v-slot="scope">
            {{ scope.row.regionText + scope.row.regionDetail }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
        <el-table-column label="提交时间" prop="create_time"></el-table-column>
        <el-table-column label="审核状态" width="92px">
          <template v-slot="scope">
            <el-tag type="warning" v-if="scope.row.status == 0"
              >等待审核</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status == 1"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
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

    <!-- 模态框 - 修改 -->
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormClosed"
    >
      <el-form label-width="70px">
        <el-form-item label="审核编号">
          <el-input v-model="editForm.taskid" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.stuName" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话1">
          <el-input v-model="editForm.phoneOne"></el-input>
        </el-form-item>
        <el-form-item label="电话2">
          <el-input v-model="editForm.phoneTwo"></el-input>
        </el-form-item>
        <el-form-item label="健康状况">
          <el-input v-model="editForm.healthy" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Admin">
          <el-input v-model="editForm.admin"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTaskInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Tasks",
  data() {
    return {
      queryInfo: {
        taskid: "",
        currentPage: 1,
        pageSize: 10,
      },
      taskList: [],
      total: 0,
      type: ["事假", "病假", "实习", "其他"],
      editDialogVisible: false,
      editForm: {},
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
          label: "已完成",
        },
      ],
    };
  },
  created() {
    this.getTasksList();
  },
  methods: {
    getTasksList() {
      this.$axios
        .get("admin/tasks", { params: this.queryInfo })
        .then(({ data }) => {
          if (data.status != 200) {
            return this.$message.error("申请列表获取失败");
          }
          this.taskList = data.data;
          this.total = data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showEditDialog(id) {
      this.$axios
        .get("admin/taskInfo", { params: { id } })
        .then(({ data }) => {
          if (data.status != 200) {
            return this.$message.error("申请信息获取失败");
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
    editTaskInfo() {
      this.$axios
        .put("admin/taskInfo", this.editForm)
        .then(({ data }) => {
          if (data.status != 201) {
            return this.$message.error("申请信息更新失败");
          }
          this.editForm = {};
          this.editDialogVisible = false;
          this.getTasksList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    removeUserById(id) {
      this.$confirm("此操作将永久删除该申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`admin/tasks/${id}`)
            .then(({ data }) => {
              if (data.status !== 200)
                return this.$message.error("删除申请失败");
              this.$message.success("删除申请成功");
              this.getTasksList();
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
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getTasksList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage;
      this.getTasksList();
    },
  },
};
</script>

<style></style>
