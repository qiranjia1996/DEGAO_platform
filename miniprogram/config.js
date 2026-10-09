// AI 选品顾问配置
//
// 不填 apiKey 时，AI 选品使用本地智能匹配（离线可用，适合演示）。
// 填入 apiKey 后，调用 OpenAI 兼容接口的大模型（默认 DeepSeek，国内可直连）。
// 其他可选：通义千问 https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions（model: qwen-plus）
//
// 注意：
// 1. 密钥写在小程序前端只适合内部测试演示。正式上线必须把大模型调用放到后端（云函数或自建服务器），否则密钥会泄露。
// 2. 开发者工具里需勾选「详情 → 本地设置 → 不校验合法域名」，手机预览时需打开「开发调试」模式。

module.exports = {
  llm: {
    endpoint: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    apiKey: ''
  }
}
