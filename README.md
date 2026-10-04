# 星霸 Xingba 产品查阅站

浙江星霸工贸有限公司（Zhejiang Xingba Industry & Trade Co., Ltd.）静态官网。内容整理自《GWA Catalog-updated 2024.12.9》图册。

## 打开方式

双击 `index.html`，或启动本地服务：

```bash
cd D:\learning-workbench\xingba-site
python -m http.server 8088
```

浏览器访问 http://127.0.0.1:8088

## 不买域名：放到 GitHub Pages

免费公网地址格式：

`https://你的GitHub用户名.github.io/xingba-site/`

操作步骤：

1. 打开 https://github.com/new 新建公开仓库，名称填 `xingba-site`，不要勾选 “Add a README”
2. 在本文件夹执行：

```bash
cd D:\learning-workbench\xingba-site
git init -b main
git add .
git commit -m "Publish Xingba catalog site"
git remote add origin https://github.com/你的用户名/xingba-site.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**
4. Source 选 **Deploy from a branch**，Branch 选 **main**，文件夹选 **/ (root)**，保存
5. 等 1～2 分钟，打开上面的 `github.io` 地址即可

注意：不买域名时，网址只能是 `用户名.github.io/仓库名`，不能改成 `www.xxx.com`。

## 页面

- Home：公司介绍与产品系列入口
- About us：公司简介与参考客户
- Certificates：FSC / ISO9001 / BSCI（点击放大）
- Products：全系列图册，分类筛选，点击图片放大翻页
- Space：空间灵感
- Responsibility：可持续与质量承诺
- Contacts：地址与询盘表单
