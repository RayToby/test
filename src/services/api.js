///remind-admin
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

//新增loginOut
export async function fakeAccountLogin(params) {
  return request('/restful/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function loginOut(params) {
  return request('/restful/user/logout', {
    method: 'POST',
    body: params,
  });
}

export async function addUser(params) {
  return request('/restful/user/sayhi', {
    method: 'POST',
    body: params,
  });
}

export async function queryUser(params) {
  return request('/restful/user/query',{
    method: 'POST',
    body: params,
  });
}

export async function removeUser(params) {
  return request('/restful/user/remove', {
    method: 'POST',
    body: {
      method: 'POST',
      ...params,
    },
  });
}

export async function editUser(params) {
  return request('/restful/user/modify', {
    method: 'POST',
    body: {
      method: 'POST',
      ...params,
    },
  });
}

export async function editUserState(params) {
  return request('/restful/user/prohibit', {
    method: 'POST',
    body: params,
  });
}

export async function resetPwd(params) {
  return request('/restful/user/OriginalPwd', {
    method: 'POST',
    body: params,
  });
}
//角色
export async function roleList(params) {
  return request('/restful/role/roleQuery', {
    method: 'POST',
    body: params,
  });
}

export async function queryRole(params) {
  return request('/restful/role/allRole', {
    method: 'POST',
    body: params,
  });
}

export async function addRole(params) {
  return request('/restful/role/roleSayhi', {
    method: 'POST',
    body: params,
  });
}

export async function editRole(params) {
  return request('/restful/role/roleModify', {
    method: 'POST',
    body: params,
  });
}

export async function roleRemove(params) {
  return request('/restful/role/roleRemove', {
    method: 'POST',
    body: params,
  });
}

export async function editRoleState(params) {
  return request('/restful/role/prohibit', {
    method: 'POST',
    body: params,
  });
}

export async function findPermission(params) {
  return request('/restful/role/findPermission', {
    method: 'POST',
    body: params,
  });
}

export async function getAllPermission(params) {
  return request('/restful/permission/permissionQuery', {
    method: 'POST',
    body: params,
  });
}

export async function revisePwd(params) {
  return request('/restful/user/revisePwd', {
    method: 'POST',
    body: params,
  });
}
//卡片
export async function queryCard(params) {
  return request('/restful/tab/findByAll', {
    method: 'POST',
    body: params,
  });
}

export async function changeCard(params) {
  return request('/restful/tab/reviseType', {
    method: 'POST',
    body: params,
  });
}

export async function queryWeather(params) {
  return request('/restful/Weather/query', {
    method: 'POST',
    body: params,
  });
}

export async function uploadWeather(params) {
  return request('/restful/Weather/WeatherUpload', {
    method: 'POST',
    body: params,
  });
}
//节日节气
export async function queryFestival(params) {
  return request('/restful/festival/query', {
    method: 'POST',
    body: params,
  })
}
export async function festivalUpload(params) {
  return request('/restful/festival/festivalUpload', {
    method: 'POST',
    body: params,
  })
}

//反馈管理
export async function queryFeedbackList(params) {
  return request('/restful/feedback/queryFeedback', {
    method: 'POST',
    body: params,
  });
}

//广告管理
export async function queryAdList(params) {
  return request('/restful/advert/findByAdvert', {
    method: 'POST',
    body: params,
  });
}

export async function addAdvert(params) {
  return request('/restful/advert/advertAdd', {
    method: 'POST',
    body: params,
  });
}

export async function modifyState(params) {
  return request('/restful/advert/modifyState', {
    method: 'POST',
    body: params,
  });
}

export async function removeAdvert(params) {
  return request('/restful/advert/removeAdvert', {
    method: 'POST',
    body: params,
  });
}

export async function modifyAdvert(params) {
  return request('/restful/advert/modifyAdvert', {
    method: 'POST',
    body: params,
  });
}

//用户管理
export async function queryUserList(params) {
  return request('/restful/customer/customerQuery', {
    method: 'POST',
    body: params,
  });
}

export async function editCustomerState(params) {
  return request('/restful/customer/customerProhibit', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCuster(params) {
  return request('/restful/customer/customerRemove', {
    method: 'POST',
    body: params,
  });
}
//验证码
export async function sendCheckcode(params) {
  return request('/restful/customer/sendCheckcode', {
    method: 'POST',
    body: params,
  });
}
//绑定手机
export async function bindMobile(params) {
  return request('/restful/customer/customerBindMobile', {
    method: 'POST',
    body: params,
  });
}

export async function unBindMobile(params) {
  return request('/restful/customer/customerUnbindMobile', {
    method: 'POST',
    body: params,
  });
}

export async function unBindByWeiXin(params) {
  return request('/restful/customer/customerUnbindByWeiXin', {
    method: 'POST',
    body: params,
  });
}

//头条查询
export async function queryHeadLine(params) {
  return request('/restful/headline/findByAll', {
    method: 'POST',
    body: params,
  });
}

export async function headlinePush(params) {
  return request('/restful/headline/headlineAdd', {
    method: 'POST',
    body: params,
  });
}

export async function revokePush(params) {
  return request('/restful/headline/pushOperation', {
    method: 'POST',
    body: params,
  });
}

export async function queryPushing(params) {
  return request('/restful/headline/findByAllPushing', {
    method: 'POST',
    body: params,
  });
}

export async function queryPushed(params) {
  return request('/restful/headline/findByAllPush', {
    method: 'POST',
    body: params,
  });
}

//短链接查询
export async function queryShortUrl(params) {
  return request('/restful/shortUrl/queryShortUrl', {
    method: 'POST',
    body: params,
  });
}

export async function deleteShortUrl(params) {
  return request('/restful/shortUrl/deleteShortUrl', {
    method: 'POST',
    body: params,
  });
}
//查询所有分组
export async function queryGroup(params) {
  return request('/restful/shortUrlGroup/queryGroup', {
    method: 'POST',
    body: params,
  });
}

export async function addShortUrl(params) {
  return request('/shortUrl/addShortUrl', {
    method: 'POST',
    body: params,
  });
}

export async function updateShortUrl(params) {
  return request('/restful/shortUrl/updateShortUrl', {
    method: 'POST',
    body: params,
  });
}
//短地址分组
export async function queryShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/queryShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function addShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/addShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function deleteShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/deleteShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

export async function updateShortUrlGroup(params) {
  return request('/restful/shortUrlGroup/updateShortUrlGroup', {
    method: 'POST',
    body: params,
  });
}

//事件管理
export async function getEventList(params) {
  return request('/restful/event/listInfo', {
    method: 'POST',
    body: params,
  })
}

export async function getEventStatus(params) {
  return request('/restful/notice/findAllByEventIdAndStatus', {
    method: 'POST',
    body: params,
  })
}

//菜单
export async function getMenu(params) {
  return request('/restful/menu/menuQuery', {
    method: 'POST',
    body: params, 
  })
}














