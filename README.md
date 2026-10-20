# github-starter

一个零依赖的静态站点，同时也是 Git / GitHub Pages 的练手项目。
页面本身就是一份 Git 命令速查表（带搜索、分类、点击复制）。

## 目录结构

```
.
├── index.html                      # 页面
├── style.css                       # 样式
├── script.js                       # 速查表的数据与交互
├── GIT-PRACTICE.md                 # 八阶段实操练习册（从这里开始）
├── .gitignore
└── .github/workflows/deploy.yml    # 推送到 main 自动部署到 Pages
```

## 本地预览

直接双击 `index.html` 即可；或者起一个本地服务（可选）：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 推送到 GitHub

```bash
git init
git add .
git commit -m "初始化站点"
git branch -M main
git remote add origin git@github.com:你的用户名/仓库名.git
git push -u origin main
```

## 开启线上访问

仓库 `Settings → Pages → Source` 选择 **GitHub Actions**。
之后每次 `git push` 到 `main`，都会自动重新部署，几十秒后线上更新。

地址形如：`https://你的用户名.github.io/仓库名/`

## 练习顺序

打开 `GIT-PRACTICE.md`，从阶段 0 开始逐条执行。不要只读，每一步都要敲。
