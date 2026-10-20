const COMMANDS = [
  { cmd: "git status", desc: "看当前有哪些改动、在哪个分支", group: "基础" },
  { cmd: "git add .", desc: "把当前目录所有改动加入暂存区", group: "基础" },
  { cmd: 'git add <文件>', desc: "只暂存指定的文件，适合拆分提交", group: "基础" },
  { cmd: 'git commit -m "说明"', desc: "把暂存区的内容记成一次快照", group: "基础" },
  { cmd: "git log --oneline --graph", desc: "用单行加图形的方式看提交历史", group: "基础" },
  { cmd: "git diff", desc: "看还没暂存的改动具体是什么", group: "基础" },
  { cmd: "git diff --staged", desc: "看已经暂存、即将被提交的改动", group: "基础" },
  { cmd: "git restore <文件>", desc: "丢弃未暂存的修改，回到上次提交的状态", group: "基础" },
  { cmd: "git restore --staged <文件>", desc: "把文件移出暂存区，改动本身保留", group: "基础" },
  { cmd: "git commit --amend", desc: "修改上一次提交的信息或内容", group: "基础" },

  { cmd: "git switch -c feature/login", desc: "新建分支并立刻切过去", group: "分支" },
  { cmd: "git switch main", desc: "切回 main 分支", group: "分支" },
  { cmd: "git branch", desc: "列出本地分支，带星号的是当前分支", group: "分支" },
  { cmd: "git merge feature/login", desc: "把指定分支合并进当前分支", group: "分支" },
  { cmd: "git branch -d feature/login", desc: "删除已经合并过的分支", group: "分支" },
  { cmd: "git stash / git stash pop", desc: "临时收起改动去处理别的事，之后再拿回来", group: "分支" },

  { cmd: "git remote add origin git@github.com:用户名/仓库名.git", desc: "把远端仓库地址命名为 origin", group: "远程" },
  { cmd: "git remote -v", desc: "检查当前配置了哪些远端地址", group: "远程" },
  { cmd: "git push -u origin main", desc: "首次推送，并绑定本地 main 与远端 main", group: "远程" },
  { cmd: "git push", desc: "绑定之后，日常推送只要这一条", group: "远程" },
  { cmd: "git pull --rebase", desc: "拉取远端更新并把自己的提交接在后面", group: "远程" },
  { cmd: "git clone <仓库地址>", desc: "把别人的整个仓库连同历史下载下来", group: "远程" },
  { cmd: "ssh -T git@github.com", desc: "验证 SSH 免密登录是否配好", group: "远程" },

  { cmd: "git pull --rebase && git push", desc: "push 被拒绝（rejected）时的标准解法", group: "排错" },
  { cmd: 'git config --global user.name "名字"', desc: "报 Author identity unknown 时先配身份", group: "排错" },
  { cmd: "ssh-keygen -t ed25519 -C \"邮箱\"", desc: "Permission denied (publickey) 时重新生成密钥", group: "排错" },
  { cmd: "git rm --cached .env", desc: "文件已提交但要停止追踪（记得先加 .gitignore）", group: "排错" },
  { cmd: "git log -p <文件>", desc: "看某个文件每一次的完整改动", group: "排错" },
  { cmd: "git pull --rebase --allow-unrelated-histories origin main", desc: "合并两个没有共同历史的仓库时使用", group: "排错" },
];

const listEl = document.querySelector("#cmd-list");
const searchEl = document.querySelector("#search");
const tabsEl = document.querySelector(".tabs");
const emptyEl = document.querySelector("#empty");
const toastEl = document.querySelector("#toast");

let activeGroup = "全部";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render() {
  const keyword = searchEl.value.trim().toLowerCase();
  const items = COMMANDS.filter((item) => {
    const matchGroup = activeGroup === "全部" || item.group === activeGroup;
    const matchKeyword =
      !keyword ||
      item.cmd.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword) ||
      item.group.includes(keyword);
    return matchGroup && matchKeyword;
  });

  listEl.innerHTML = items
    .map(
      (item) => `
      <li class="cmd" tabindex="0" role="button" data-cmd="${escapeHtml(item.cmd)}" aria-label="复制：${escapeHtml(item.cmd)}">
        <code>${escapeHtml(item.cmd)}</code>
        <span>
          <span class="cmd-desc">${escapeHtml(item.desc)}</span>
          <span class="cmd-hint">点击复制</span>
        </span>
      </li>`
    )
    .join("");

  emptyEl.hidden = items.length > 0;
}

let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 1600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

listEl.addEventListener("click", async (event) => {
  const row = event.target.closest(".cmd");
  if (!row) return;
  const ok = await copyText(row.dataset.cmd);
  toast(ok ? "已复制到剪贴板" : "复制失败，请手动选中");
});

listEl.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const row = event.target.closest(".cmd");
  if (!row) return;
  event.preventDefault();
  row.click();
});

tabsEl.addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");
  if (!tab) return;
  activeGroup = tab.dataset.group;
  tabsEl.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("is-active", el === tab);
  });
  render();
});

searchEl.addEventListener("input", render);

render();
