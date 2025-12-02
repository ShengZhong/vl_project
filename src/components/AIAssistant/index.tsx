/**
 * AI 助手对话组件
 * 功能：右侧浮动的对话框，可收起/展开，支持意图理解和自动操作
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Space, message, Steps, Checkbox } from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import './index.less';

const { TextArea } = Input;
const { Step } = Steps;

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ActionStep {
  id: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  action?: () => Promise<void>;
}

interface AIAssistantProps {
  onExecuteAction?: (actionType: string, params: any) => Promise<void>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onExecuteAction }) => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '您好！我是 VisionLine 智能助手。我可以帮助您：\n\n1. 查询和筛选数据\n2. 批量操作账户\n3. 生成报表\n4. 执行常见任务\n\n请告诉我您需要什么帮助？',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [inputHeight, setInputHeight] = useState(80); // 输入框高度
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, actionSteps, showConfirmation]);

  // 拖拽调整输入框高度
  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle) return;

    let startY = 0;
    let startHeight = 0;

    const handleMouseDown = (e: MouseEvent) => {
      startY = e.clientY;
      startHeight = inputHeight;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startY - e.clientY; // 向上拖动为正
      const newHeight = Math.min(Math.max(startHeight + delta, 80), 400); // 最小80px，最大400px
      setInputHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    resizeHandle.addEventListener('mousedown', handleMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [inputHeight]);

  // 模拟意图理解和操作步骤生成
  const parseUserIntent = async (userInput: string): Promise<ActionStep[]> => {
    // 这里是模拟的意图理解逻辑，实际应该调用后端 AI 服务
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('导出') || lowerInput.includes('export')) {
      return [
        {
          id: 'step-1',
          description: '获取当前筛选条件',
          status: 'pending',
        },
        {
          id: 'step-2',
          description: '查询符合条件的数据',
          status: 'pending',
        },
        {
          id: 'step-3',
          description: '生成 Excel 文件',
          status: 'pending',
        },
        {
          id: 'step-4',
          description: '下载文件到本地',
          status: 'pending',
        },
      ];
    } else if (lowerInput.includes('筛选') || lowerInput.includes('查找') || lowerInput.includes('filter')) {
      return [
        {
          id: 'step-1',
          description: '解析筛选条件',
          status: 'pending',
        },
        {
          id: 'step-2',
          description: '应用筛选条件到表格',
          status: 'pending',
        },
        {
          id: 'step-3',
          description: '刷新数据展示',
          status: 'pending',
        },
      ];
    } else if (lowerInput.includes('删除') || lowerInput.includes('delete')) {
      return [
        {
          id: 'step-1',
          description: '识别目标账户',
          status: 'pending',
        },
        {
          id: 'step-2',
          description: '确认删除权限',
          status: 'pending',
        },
        {
          id: 'step-3',
          description: '执行删除操作',
          status: 'pending',
        },
      ];
    } else {
      return [];
    }
  };

  // 执行操作步骤
  const executeSteps = async () => {
    setLoading(true);
    const updatedSteps = [...actionSteps];

    for (let i = 0; i < updatedSteps.length; i++) {
      updatedSteps[i].status = 'executing';
      setActionSteps([...updatedSteps]);

      // 模拟执行延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updatedSteps[i].status = 'completed';
      setActionSteps([...updatedSteps]);

      // 如果有具体的执行函数，调用它
      if (updatedSteps[i].action && onExecuteAction) {
        try {
          await updatedSteps[i].action!();
        } catch (error) {
          updatedSteps[i].status = 'failed';
          setActionSteps([...updatedSteps]);
          message.error(`步骤 ${i + 1} 执行失败`);
          break;
        }
      }
    }

    setLoading(false);
    setShowConfirmation(false);
    setUserConfirmed(false);

    // 添加完成消息
    const successMsg: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: '✅ 所有操作已成功执行！还有什么我可以帮您的吗？',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, successMsg]);
    setActionSteps([]);
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) {
      return;
    }

    // 添加用户消息
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    // 模拟理解意图
    try {
      const steps = await parseUserIntent(inputValue);

      if (steps.length > 0) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `我理解您想要执行以下操作，请确认是否继续：`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setActionSteps(steps);
        setShowConfirmation(true);
      } else {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '抱歉，我还不太理解您的意图。您可以尝试说：\n\n• "导出当前筛选结果"\n• "查找评分大于80的账户"\n• "删除账户 123456"\n\n或者更具体地描述您的需求。',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (error) {
      message.error('处理请求时出错');
    } finally {
      setLoading(false);
    }
  };

  // 渲染消息
  const renderMessage = (msg: Message) => {
    const isUser = msg.type === 'user';
    return (
      <div key={msg.id} className={`message-item ${isUser ? 'user-message' : 'assistant-message'}`}>
        <div className="message-avatar">
          <Avatar icon={isUser ? <UserOutlined /> : <RobotOutlined />} />
        </div>
        <div className="message-content">
          <div className="message-bubble">{msg.content}</div>
          <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
    );
  };

  // 渲染操作步骤
  const renderActionSteps = () => {
    if (actionSteps.length === 0) return null;

    return (
      <div className="action-steps-container">
        <Steps direction="vertical" size="small" current={actionSteps.findIndex((s) => s.status === 'executing')}>
          {actionSteps.map((step, index) => (
            <Step
              key={step.id}
              title={step.description}
              status={
                step.status === 'completed'
                  ? 'finish'
                  : step.status === 'executing'
                  ? 'process'
                  : step.status === 'failed'
                  ? 'error'
                  : 'wait'
              }
              icon={
                step.status === 'executing' ? (
                  <LoadingOutlined />
                ) : step.status === 'completed' ? (
                  <CheckCircleOutlined />
                ) : undefined
              }
            />
          ))}
        </Steps>

        {showConfirmation && !loading && (
          <div className="confirmation-actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox
                checked={userConfirmed}
                onChange={(e) => setUserConfirmed(e.target.checked)}
              >
                我已确认以上操作步骤
              </Checkbox>
              <Space>
                <Button type="primary" disabled={!userConfirmed} onClick={executeSteps}>
                  确认执行
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    setActionSteps([]);
                    setUserConfirmed(false);
                    const cancelMsg: Message = {
                      id: Date.now().toString(),
                      type: 'assistant',
                      content: '操作已取消。还有什么我可以帮您的吗？',
                      timestamp: Date.now(),
                    };
                    setMessages((prev) => [...prev, cancelMsg]);
                  }}
                >
                  取消
                </Button>
              </Space>
            </Space>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 浮动按钮 */}
      {!visible && (
        <div className="ai-assistant-fab" onClick={() => setVisible(true)}>
          <MessageOutlined style={{ fontSize: 24 }} />
        </div>
      )}

      {/* 对话框 */}
      {visible && (
        <div className="ai-assistant-container">
          <Card
            title={
              <Space>
                <RobotOutlined />
                <span>AI 助手</span>
              </Space>
            }
            extra={
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setVisible(false)}
              />
            }
            className="ai-assistant-card"
          >
            <div className="messages-container">
              {messages.map((msg) => renderMessage(msg))}
              {actionSteps.length > 0 && renderActionSteps()}
              <div ref={messagesEndRef} />
            </div>

            <div 
              className="input-container" 
              ref={inputContainerRef}
              style={{ height: inputHeight }}
            >
              <div className="resize-handle" ref={resizeHandleRef}>
                <div className="resize-handle-bar" />
              </div>
              <div className="input-wrapper">
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="输入您的需求...（Shift+Enter 换行）"
                  disabled={loading || showConfirmation}
                  style={{ height: inputHeight - 48, resize: 'none' }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  loading={loading}
                  disabled={loading || showConfirmation}
                  style={{ flexShrink: 0 }}
                >
                  发送
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

