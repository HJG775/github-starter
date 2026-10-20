# Git 实操练习册

配套项目：`github-starter/`（一个真实的静态站点，练完就能上线）。
全程在 `github-starter` 目录里执行，**每条命令都敲一遍**，不要只读。

---

## 阶段 0 · 环境自检

```bash
git --version
git config --global user.name
git config --global user.email
```

后两条如果没输出，说明身份还没配。配一次，永久生效：

```bash
git config --global user.name  "你的名字"
git config --global user.email "你的GitHub邮箱"
```

> 名字建议用英文字母或拼音 —— 提交记录里显示的就是它。

---

## 阶段 1 · 第一次提交（理解三个区）

```bash
cd github-starter
git init
git status
```

**对照 `git status` 的中文含义**：
- `Untracked files` = 新文件，Git 还没管它
- `Changes not staged for commit` = 改过的旧文件，还没放进暂存区
- `Changes to be committed` = 已进暂存区，下次 commit 会带上

现在把文件加进去：

```bash
git add .
git status          # 全部变成绿色的 "new file"，说明进了暂存区
git commit -m "初始化站点"
git log --oneline
```

✅ 检查点：`git log` 能看到一条 `初始化站点`。

---

## 阶段 2 · 改一行，看清 diff

打开 `index.html`，把 `<h1>` 里的文案随便改几个字。

```bash
git status          # 变成 modified
git diff            # 看到 + 和 - 的具体行
git add index.html
git diff            # 空了！因为改动已经进暂存区
git diff --staged   # 要看暂存的改动，用这个
git commit -m "调整首页标题"
```

**这套动作（改 → status → diff → add → commit）就是你以后每天要做一百遍的东西。**

---

## 阶段 3 · 分支：在隔离环境里实验

```bash
git switch -c feature/new-style
```

改 `style.css` 里的 `--accent: #12685c;` 换成 `#a8442a`（一个砖红色）。刷新页面看效果。

```bash
git add .
git commit -m "把主色改成砖红"
git switch main        # 切回主干 —— 注意颜色又变回去了
git merge feature/new-style
git log --oneline --graph
```

✅ 检查点：切回 main 时颜色恢复，合并后又变红。这就是分支的意义 —— **改动被隔离，直到你决定合并**。

不满意就撤销这次合并：

```bash
git reset --hard HEAD~1
```

---

## 阶段 4 · 故意制造一次冲突（重要）

冲突不可怕，可怕的是第一次遇到时慌。

```bash
git switch -c feature/conflict-a
# 把 index.html 的 <title> 改成 "A 方案"
git commit -am "A 改标题"

git switch main
# 把 index.html 的 <title> 改成 "B 方案"
git commit -am "B 改标题"

git merge feature/conflict-a
```

会看到 `CONFLICT (content): Merge conflict in index.html`。打开文件，会看到：

```
<<<<<<< HEAD
<title>B 方案</title>
=======
<title>A 方案</title>
>>>>>>> feature/conflict-a
```

手工把这三行改成你要的最终版本（比如 `<title>B 方案</title>`），删掉 `<<<<<<<`、`=======`、`>>>>>>>` 这些标记，然后：

```bash
git add index.html
git commit            # 不用 -m，Git 会给你一个默认的合并提交信息
```

收尾：

```bash
git branch -d feature/conflict-a
git reset --hard HEAD~2   # 想回到干净状态就执行这句
```

---

## 阶段 5 · 三种后悔药

| 场景 | 命令 | 影响范围 |
|---|---|---|
| 改了文件还没 add，想丢弃 | `git restore index.html` | 只丢弃工作区改动，安全 |
| 已 add 还没 commit，想撤回暂存 | `git restore --staged index.html` | 改动还在，只是退出暂存区 |
| 已经 commit 了，想改说明 | `git commit --amend -m "新说明"` | 重写最后一次提交 |
| 已经 commit 了，想整个回退 | `git reset --hard HEAD~1` | ⚠️ 会丢改动，确认后再用 |

> `--hard` 是唯一会真正删除你劳动成果的命令。犹豫的时候先 `git stash`。

---

## 阶段 6 · 推到 GitHub

**先在网页上建空仓库**（不要勾 README），然后：

```bash
git remote add origin git@github.com:你的用户名/仓库名.git
git remote -v
git branch -M main
git push -u origin main
```

如果卡在 `Permission denied (publickey)`，说明 SSH 没配：

```bash
ssh-keygen -t ed25519 -C "你的邮箱"    # 一路回车
cat ~/.ssh/id_ed25519.pub              # 复制整段输出
ssh -T git@github.com                  # 出现 Hi 用户名 就成功
```

把 `id_ed25519.pub` 的内容粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key。

**以后每次改完代码，只记这一句：**
```bash
git add . && git commit -m "改了什么" && git push
```

---

## 阶段 7 · 上线成网址

1. 打开仓库 → `Settings` → 左侧 `Pages`
2. `Source` 选 **GitHub Actions**（不要选 Deploy from a branch）
3. 回到仓库 → `Actions` 标签，能看到 `Deploy to GitHub Pages` 正在跑
4. 绿灯后访问 `https://你的用户名.github.io/仓库名/`

改一行文案 → `git push` → 等 40 秒刷新，线上就变了。这就是完整的 CI/CD。

---

## 阶段 8 · 通关挑战

1. 新建分支 `feature/my-change`，改点东西推上去
2. 网页上会冒出 `Compare & pull request` 按钮，点它
3. 自己给自己写一段描述，然后 `Merge pull request`
4. 回来执行 `git switch main && git pull`，确认本地也拿到了合并结果

做完这一步，你就走完了团队协作的完整闭环 —— 和在公司里提代码没有区别。

---

## 报错急救表

| 报错 | 原因 | 解法 |
|---|---|---|
| `Author identity unknown` | 没配用户名邮箱 | `git config --global user.name/email` |
| `Permission denied (publickey)` | SSH 密钥没配好 | 见阶段 6 的 `ssh-keygen` |
| `failed to push some refs` / `rejected` | 远端有你本地没有的提交 | `git pull --rebase` 然后 `git push` |
| `Support for password authentication was removed` | 用了 HTTPS 还想输密码 | 改用 SSH，或生成 Personal Access Token 当密码 |
| `fatal: not a git repository` | 当前目录不是仓库 | `cd` 进项目，或 `git init` |
| `refusing to merge unrelated histories` | 两个仓库没有共同历史 | `git pull --rebase --allow-unrelated-histories origin main` |
| `Your local changes would be overwritten` | 有未提交改动挡路 | `git stash` → 操作 → `git stash pop` |

---

## 一条心法

**看不懂状态就敲 `git status`。** 它永远会告诉你现在在哪、下一步能做什么。
不确定的操作，先 `git stash` 或先建分支 —— 有退路就不用怕。
