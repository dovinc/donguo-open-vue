# donguo-open-vue

#### 1.技术依赖
> 由于本身非专业前端人员，此项目前端技术完全依赖于vue,element-ui,vue-element-admin 前端项目的部署开发以及各种依赖均可在vue-element-admin文档中中找到

[vue-element-admin 一个非常优秀的前端vue开源项目](https://github.com/PanJiaChen/vue-element-admin/) 

[在线预览: admin/111111](http://47.98.119.177:8010/)  
#### 2.donguo-open-vue 部署
1. 由于donguo-open 部署时已经配置了nginx 前端部署的目标即为将静态文件放入nginx 指定的路径之中即可
2. 打包为静态文件夹dist【打包等与vue-element-admin 完全相同】
```
npm run build:prod 
```
3. 将dist压缩为dist.tar 使用步骤2 中的sftp 上传至服务器
4. 解压至nginx指定目录 
    * 打包语法：tar cvf newFileName.tar fileName || dirName 
    * 解包语法：tar xvf newFileName.tar       fileName（-C dirName）
