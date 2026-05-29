# Agents

## 语言与沟通

- 始终使用中文思考、记录和回复。
- 说明工作时，把事实、推测和待确认事项分开。
- 遇到不确定事项时，先查证本仓库文档和代码；仍不确定再向用户提问。

## 提交信息规范

Codex 在本仓库创建提交时，需要在 commit footer 中加入 agent 元信息：

```text
Agent: Codex
Model: GPT-5.5 medium
```

提交标题尽量使用简洁的 conventional-style subject，例如：

```text
chore: update font loading strategy

Agent: Codex
Model: GPT-5.5 medium
```

footer 保持事实性和稳定性，方便后续从历史记录中区分人工提交和 agent 辅助提交。
