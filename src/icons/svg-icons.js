// （创建了）一个包含了 ./svg 文件夹（不包含子目录[第二个参数false 控制]）下面的、所有文件名以 `.svg` 结尾的、能被 require 请求到的文件的上下文。
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  return i.match(re)[1]
})
// get All svgIcons 获取系统中的所有svgIcons 图标
export default svgIcons
