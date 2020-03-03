/***
 * 权限相关的接口
 */

import { get, post, put } from '@/fn/ajax'

export async function aclList(appId: number) {
  const res = await get(`/auth/apps/${appId}/pages`, { pageSize: 88888 })
  return res
}
