// 文章的处理函数模块

// 导入处理路径的path核心模块
const path = require('path')
// 导入数据库操作模块
const db = require('../db/index')

// 发布文章的路由处理函数
exports.addArticle = (req, res) => {
  console.log(req.file)
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必须参数！')

  // TODO: 表单数据合法，继续后面的处理流程...
  const articleInfo = {
    // 标题、内容、状态、所属的分类id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的id
    author_id: req.user.id
  }

  // 定义发布文章的SQL语句
  const sql = 'insert into ev_articles set ?'

  // 执行SQL语句
  db.query(sql, articleInfo, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err)

    // 执行SQL语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')

    // 发布文章成功！
    res.cc('发布文章成功！', 0)
  })
}

// 获取文章的列表数据的处理函数
exports.getArticle = (req, res) => {
  const sql = 'select * from ev_articles where is_delete=0 order by id asc'

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    // if (results.length !== 1) return res.cc('获取文章列表数据失败！')
    res.send({
      status: 0,
      message: '获取文章列表数据成功！',
      data: results
    })
  })
}

// 根据id删除文章的路由处理函数
exports.deleteArticleById = (req, res) => {
  const sql = 'update ev_articles set is_delete=1 where id=?'

  db.query(sql, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // SQL 语句执行成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('删除文章失败！')
    // 删除文章分类成功
    res.cc('删除文章成功！', 0)
  })
}

// 根据id查询文章的路由处理函数
exports.getArticleById = (req, res) => {
  const sql = 'select * from ev_articles where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章数据失败！')
    res.send({
      status: 0,
      message: '获取文章数据成功！',
      data: results[0]
    })
  })
}

// 根据id更新文章的路由处理函数
exports.editArticleById = (req, res) => {
  // 先查询有没有这个文章有没有名称撞车
  const sql = 'select * from ev_articles where id=? and title=?'
  // 执行查重操作
  db.query(sql, [req.body.id, req.body.title], (err, results) => {
    if (err) return res.cc(err)
    if (results[0]) return res.cc('文章标题不能重复')
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必须参数')
    // 证明数据都是合法的，可以进行后续业务逻辑的处理
    // 处理文章的信息对象
    const articleInfo = {
      // 标题、内容、发布状态、所属分类id
      ...req.body,
      // 文章封面的存放路径
      cover_img: path.join('/uploads', req.file.filename),
      // 文章发布的时间
      pub_date: new Date(),
      // 文章作者的id
      author_id: req.user.id
    }

    const sql = 'update ev_articles set ? where id=?'
    db.query(sql, [articleInfo, req.body.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('编辑文章失败！')
      res.cc('编辑文章成功！', 0)
    })
  })
}