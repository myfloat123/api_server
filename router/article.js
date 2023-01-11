// 文章的路由模块
const express = require('express')
const router = express.Router()

// 导入解析formdata格式数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建multer的实例对象，通过dest属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema, delete_article_schema, get_articleById_schema, edit_article_schema } = require('../schema/article')

// 导入需要的处理函数模块
const article_handler = require('../router_handler/article')

// 发布文章的路由
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

// 获取文章的列表数据的路由
router.get('/list', article_handler.getArticle)

// 根据id删除文章的路由
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArticleById)

// 根据id查询文章的路由
router.get('/:id', expressJoi(get_articleById_schema), article_handler.getArticleById)

// 根据id更新文章的路由
router.post('/edit', upload.single('cover_img'), expressJoi(edit_article_schema), article_handler.editArticleById)

module.exports = router