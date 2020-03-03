

import { get , post , put } from '@/fn/ajax'

// 列表页
export async function queryList(query: any) {
  const data = await get('/auth/users', query)
  return data
}

//  重置密码
export async function changeList(query: any) {
  const res = await put(`/auth/users/${query}/reset-pwd`)
  return res
}
// 根据id获取详情
export async function queryItem(query: any) {
  const data = await get(`/auth/users/${query}`)
  return data
}

// 新建用户
export async function addList(query: any) {
  const res = await post('/auth/users', query)
  return res
}

export async function dataFrom(query: any) {
  const res = await get('/auth/users', query)
  return res
}

// 编辑用户
export async function setList(query: any) {
  const res = await put(`/auth/users/${query.id}`, query)
  return res
}


// 获取当前登录用户信息用户
export async function authinfos(query: any) {
  const data = await get('/auth/infos', query)
  return data
}

// 修改密码
export async function changepwd(query: any) {
  const res = await put(`/auth/user/change-pwd`, query)
  return res
}

// 验证登录账号
export async function loginNameexist(loginName: any) {
  const res = await get(`/auth/users/${loginName}/loginname-exist`)
  return res
}

// 验证邮箱账号
export async function emailexist(email: any) {
  const res = await get(`/auth/users/${email}/email-exist`)
  return res
}


