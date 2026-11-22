import type english from './contact.en';
const contact: typeof english = {
  title: '联系 Aster',
  visualAlt: '从轨道望向地球云层与弧形地平线的淡蓝色画面。',
  visualTitle: '模块化设计，\n在太空与你相伴。',
  generalHint: '请告诉我们，你希望交流什么内容。',
  modulesHint: '你希望 Cora 在什么环境中完成什么任务？',
  backAbout: '返回关于我们', backModules: '返回模块化设计',
  name: '姓名', email: '邮箱', organization: '机构或团队',
  type: '咨询类型', message: '需求或合作说明', optional: '选填',
  types: { general: '一般咨询', modules: '自定义模块或任务需求', research: '科研或测试合作', education: '教育或展示交流', other: '其他' },
  required: '请填写此项。', invalidEmail: '请输入有效的邮箱地址。',
  send: '发送信息', sending: '正在发送…',
  success: '信息已提交，感谢你联系 Aster。',
  failed: '信息未能发出，填写内容已保留，请重试。',
  activation: '联系表单正在等待邮箱验证。填写内容已保留，请在验证完成后重试。',
};
export default contact;
