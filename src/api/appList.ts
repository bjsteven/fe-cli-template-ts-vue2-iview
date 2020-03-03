import { get , post , put , del } from '@/fn/ajax'

// 应用列表 查询分页
export async function queryList(query: any) {
  const res = await get('/auth/apps', query)
  return res
}

// 添加应用
export async function addApp(query: any) {
  const res = await post('/auth/apps', query)
  return res
}

// 编辑应用
export async function setApp(appid: any, query: any) {
  const res = await put(`/auth/apps/${appid}`, query)
  return res
}

// 获取用户列表
export async function userdetail(id: any) {
  const res = await get(`/auth/apps/${id}`)
  return res
}


// 获取用户列表
export async function getuserlist(id: any, query: any) {
  const res = await get(`/auth/apps/${id}/users`, query)
  return res
}

// 获取用户列表
export async function dataFrom(query: any) {
  const res = await get(`/auth/apps/${query}/users`, query)
  return res
}

// 删除应用用户信息
export async function dels(appId: any , userId: any) {
  const res = await del(`/auth/apps/${appId}/users/${userId}`)
  return res
}

//  获取角色列表
export async function getrols(query: any) {
  const res = await get(`/auth/apps/${query}/roles`)
  return res
}

// 新建用户列表
export async function addList(query: any) {
  const res = await post(`/auth/apps/users/save`, query)
  return res
}

// 编辑用户列表
export async function setList(query: any) {
  const res = await post(`/auth/apps/users/save`, query)
  return res
}

// 获取应用用户列表详情
export async function getappuserlist(appId: any, userId: any) {
  const res = await get(`/auth/apps/${appId}/users/${userId}`)
  return res
}

// 用户管理应用列表页展示
export async function userqueryList(query: any) {
  const data = await get('/auth/users', query)
  return data
}

// 根据ID获取页面详情
export async function pagesId(query: any) {
  const res = await get(`/auth/apps/${query.id}/pages`, {pageSize: 1000})
  return res
}

// 添加应用
export async function addAppList(appId: any, query: any) {
  const res = await post(`/auth/apps/${appId}/pages`, query)
  return res
}

// 查询应用
export async function findApp(query: any) {
  const res = await get(`/auth/pages/${query.id}`)
  return res
}

// 修改应用
export async function setAppList(appId: any, pageId: any, query: any) {
  const res = await put(`/auth/apps/${appId}/pages/${pageId}`, query)
  return res
}

// 查询应用列表
export async function roleList(appId: any, query: any) {
  const res = await get(`/auth/apps/${appId}/roles`, query)
  return res
}

// 添加角色
export async function addRules(appId: any, query: any) {
  const res = await post(`/auth/apps/${appId}/roles`, query)
  return res
}

// 编辑角色
export async function setRules(appId: any, pageId: any, query: any) {
  const res = await put(`/auth/apps/${appId}/roles/${pageId}`, query)
  return res
}

// 编辑角色
export async function portal() {
  const res = await get(`/authentication/portal/apps`)
  return res
}

