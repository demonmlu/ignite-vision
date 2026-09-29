# Home 页面设计验证

入口：`home.html`，可直接在浏览器打开；样式与交互分别在 `home.css`、`home.js`，全部视觉素材在 `assets/`。

设计基准：2026-09-29 用户提供的 Figma 节点 [229:3410](https://www.figma.com/design/3LxHVg4zYQBwWUUjWg1lbN/Ignite-Vision-Site?node-id=229-3410)。实现该节点整页，保留已确认的深色粒子首屏动效。

桌面遵循设计稿区块顺序、配色、文案与素材；手机适配使用单列卡片、两列首屏数字、品牌墙纵向排列和折叠菜单。支持系统减少动态效果设置，首屏离开视口时暂停动画。

已检查 1920、1440、1024、768、390、320px 宽度：无横向溢出、图片加载失败或 JavaScript 错误。已验证手机菜单、Escape 关闭、独立粒子运动与减少动态效果。

Book a Demo / Request a Demo 暂时定位到联系区块；Contact Us 的正式网址或电邮待提供，当前为展示按钮。其他尚无目标页面的导航项为静态文字。此版本是设计验证页面，未接入表单或后端，未发布。

原 `requirement/01-home.html`、独立背景 Demo 及 Figma 文件未修改。

## Dark / Light 版本

- **首页 Dark ver**：`home.html`，保留已确认的 Dark＋呼吸节奏＋横贯星河。
- **首页 Light**：`home-light.html`，依据 Figma `316:4939`；Hero 使用 Light＋呼吸节奏＋横贯星河。
- Light 复用 `home.css` / `home.js`，主题样式在 `home-light.css`，卡片交互在 `home-light.js`。
- Challenge 卡片默认照片状态，悬停状态依据 `325:5480`。照片淡出、解决方案淡入并上移 5px，时长 180ms，无高度跳动。键盘聚焦可查看、Escape 收起；触屏点击卡片切换。
- Light 已检查 320、390、768、1024、1440、1920px，无横向溢出、素材加载失败或脚本错误；悬停、退出、键盘及触屏展开通过检查。

## 单一评审入口

打开 `index.html` 可选择 Light / Dark；两张缩略图来自实际首页。两个版本右下角提供评审切换导航，切换时恢复当前区块及其相对阅读位置，支持手机。评审导航独立保存在 `review-nav.css` / `review-nav.js`，正式上线时可移除对应引用。

当前仍是本地预览，尚未部署；远程分享需将整个 project 目录发布到静态托管地址。

Dark 已采用 Light 的照片 Challenge 卡片及数字滚动。两版交互现统一由 `home-interactions.css` / `home-interactions.js` 提供；`home-light.js` 为旧文件，不再被页面引用。
