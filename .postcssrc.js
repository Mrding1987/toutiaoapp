module.exports = {
    plugins: {

        // VUE CLI工具已经内置了autoprefixer插件，所以此处可以将以下代码注释掉，防止冲突
        /*  'autoprefixer': {
             browsers: ['Android >= 4.0', 'iOS >= 7']
         }, */
        'postcss-pxtorem': {
            //配置根节点元素的大小，lib-flexible的思路是设置为设备尺寸大小的十分之一
            //这个值可以是一个数字，也可以是一个函数。为了解决vant样式和自己所写样式之间的平衡，一般都会改为函数，不保留原始的数字 
            //原始的代码为：rootValue: 37.5
            //更改后的代码如下：
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },


            //配置需要转换的CSS属性，*表示所有
            propList: ['*'],
            exclude: 'github-markdown'
        }
    }
}