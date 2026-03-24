"use client";

import { useMemo, useState } from "react";
import {
  AppstoreOutlined,
  FrownOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  SmileOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Flex,
  Input,
  List,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message as antdMessage,
} from "antd";
import type { TableColumnsType, TabsProps } from "antd";

const { Title, Paragraph, Text } = Typography;

type ChatMessage = {
  speaker: "客户" | "客服";
  text: string;
  at: string;
};

type ChatSession = {
  id: string;
  customerName: string;
  customerTag: string;
  region: string;
  messages: ChatMessage[];
};

type Scenario = {
  id: string;
  name: string;
  keywords: string[];
  source: "builtin" | "custom";
};

type Product = {
  id: string;
  name: string;
  keywords: string[];
  category: string;
};

type DrillState = {
  open: boolean;
  title: string;
  description: string;
  sessions: ChatSession[];
};

const chatSessions: ChatSession[] = [
  {
    id: "S-1001",
    customerName: "林女士",
    customerTag: "新客",
    region: "上海",
    messages: [
      { speaker: "客户", text: "你们这款空气炸锅有现货吗？外观挺喜欢的。", at: "10:03" },
      { speaker: "客服", text: "有现货，今天下单可以48小时内发出。", at: "10:04" },
      { speaker: "客户", text: "太好了，价格也挺划算，准备直接拍。", at: "10:05" },
    ],
  },
  {
    id: "S-1002",
    customerName: "赵先生",
    customerTag: "会员",
    region: "杭州",
    messages: [
      { speaker: "客户", text: "耳机昨天收到，音质不错，但右耳偶尔有杂音。", at: "11:12" },
      { speaker: "客服", text: "抱歉给您带来不便，我帮您安排换新。", at: "11:13" },
      { speaker: "客户", text: "好的，希望尽快处理，别再出问题。", at: "11:14" },
    ],
  },
  {
    id: "S-1003",
    customerName: "周女士",
    customerTag: "复购客户",
    region: "北京",
    messages: [
      { speaker: "客户", text: "我想买扫地机器人，家里有宠物，吸毛效果要好。", at: "09:46" },
      { speaker: "客服", text: "推荐X8 Pro，针对宠物毛发有强化滚刷。", at: "09:47" },
      { speaker: "客户", text: "听起来不错，功能很实用。", at: "09:48" },
    ],
  },
  {
    id: "S-1004",
    customerName: "吴先生",
    customerTag: "新客",
    region: "深圳",
    messages: [
      { speaker: "客户", text: "快递一直没更新，我有点着急，体验很差。", at: "14:02" },
      { speaker: "客服", text: "我马上帮您催件，并补发优惠券。", at: "14:03" },
      { speaker: "客户", text: "希望今天能有结果，不然我要退货了。", at: "14:04" },
    ],
  },
  {
    id: "S-1005",
    customerName: "蒋女士",
    customerTag: "会员",
    region: "南京",
    messages: [
      { speaker: "客户", text: "加湿器静音吗？晚上用会不会吵。", at: "16:20" },
      { speaker: "客服", text: "睡眠模式噪音低于32分贝，适合卧室。", at: "16:21" },
      { speaker: "客户", text: "那挺满意的，我再看看滤芯价格。", at: "16:22" },
    ],
  },
  {
    id: "S-1006",
    customerName: "高先生",
    customerTag: "企业客户",
    region: "苏州",
    messages: [
      { speaker: "客户", text: "投影仪亮度达不到宣传，开会时画面发灰，很失望。", at: "13:15" },
      { speaker: "客服", text: "了解，我先帮您远程排查并提供补偿方案。", at: "13:16" },
      { speaker: "客户", text: "请尽快，不然影响我们项目汇报。", at: "13:17" },
    ],
  },
  {
    id: "S-1007",
    customerName: "陈女士",
    customerTag: "复购客户",
    region: "成都",
    messages: [
      { speaker: "客户", text: "这款破壁机之前买过，质量稳定，这次想再买一台送父母。", at: "18:01" },
      { speaker: "客服", text: "感谢信任，今天有套装活动更划算。", at: "18:02" },
      { speaker: "客户", text: "太棒了，那我就下单了。", at: "18:03" },
    ],
  },
  {
    id: "S-1008",
    customerName: "宋先生",
    customerTag: "新客",
    region: "武汉",
    messages: [
      { speaker: "客户", text: "咖啡机和磨豆机一起买有优惠吗？", at: "20:10" },
      { speaker: "客服", text: "组合购立减200，另送清洁套装。", at: "20:11" },
      { speaker: "客户", text: "不错，这个活动挺吸引我。", at: "20:12" },
    ],
  },
];

const positiveLexicon = ["喜欢", "太好了", "划算", "不错", "满意", "实用", "稳定", "太棒了", "吸引", "信任"];
const negativeLexicon = ["杂音", "出问题", "没更新", "着急", "体验很差", "退货", "失望", "发灰", "不然", "影响"];

const defaultScenarios: Scenario[] = [
  { id: "scenario-pre", name: "售前问题", keywords: ["有现货", "优惠", "价格", "活动", "买吗", "推荐"], source: "builtin" },
  { id: "scenario-after", name: "售后问题", keywords: ["换新", "退货", "杂音", "失望", "质量", "问题"], source: "builtin" },
  { id: "scenario-delivery", name: "物流履约", keywords: ["快递", "催件", "发出", "没更新"], source: "builtin" },
];

const products: Product[] = [
  { id: "p1", name: "空气炸锅 A7", category: "厨房电器", keywords: ["空气炸锅", "炸锅"] },
  { id: "p2", name: "降噪耳机 Q2", category: "数码配件", keywords: ["耳机", "右耳", "杂音"] },
  { id: "p3", name: "扫地机器人 X8 Pro", category: "清洁电器", keywords: ["扫地机器人", "吸毛", "宠物"] },
  { id: "p4", name: "静音加湿器 H3", category: "生活家电", keywords: ["加湿器", "滤芯", "静音"] },
  { id: "p5", name: "智能投影仪 P6", category: "办公影音", keywords: ["投影仪", "亮度", "画面"] },
  { id: "p6", name: "破壁机 B5", category: "厨房电器", keywords: ["破壁机", "套装"] },
  { id: "p7", name: "咖啡机 C9", category: "厨房电器", keywords: ["咖啡机", "磨豆机"] },
];

function countHits(text: string, keyword: string) {
  return text.includes(keyword) ? 1 : 0;
}

function getCustomerText(session: ChatSession) {
  return session.messages
    .filter((item) => item.speaker === "客户")
    .map((item) => item.text)
    .join(" ");
}

export default function Home() {
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioKeywords, setScenarioKeywords] = useState("");
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenarios[0].id);
  const [drill, setDrill] = useState<DrillState>({ open: false, title: "", description: "", sessions: [] });

  const allScenarios = useMemo(() => [...defaultScenarios, ...customScenarios], [customScenarios]);

  const emotionResult = useMemo(() => {
    const bySession = chatSessions.map((session) => {
      const customerText = getCustomerText(session);
      const positiveHits = positiveLexicon.reduce((total, keyword) => total + countHits(customerText, keyword), 0);
      const negativeHits = negativeLexicon.reduce((total, keyword) => total + countHits(customerText, keyword), 0);

      return {
        key: session.id,
        session,
        positiveHits,
        negativeHits,
        polarity:
          positiveHits === negativeHits ? "中性" : positiveHits > negativeHits ? "正向" : "负向",
      };
    });

    const positiveCount = bySession.filter((item) => item.polarity === "正向").length;
    const negativeCount = bySession.filter((item) => item.polarity === "负向").length;

    const topWords = (lexicon: string[]) =>
      lexicon
        .map((word) => {
          const relatedSessions = chatSessions.filter((session) => getCustomerText(session).includes(word));
          return { word, count: relatedSessions.length, relatedSessions };
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    return {
      bySession,
      positiveCount,
      negativeCount,
      positiveSummary: `共识别 ${positiveCount} 个正向会话，主要集中在价格吸引力、产品体验和复购意愿。`,
      negativeSummary: `共识别 ${negativeCount} 个负向会话，主要集中在物流延迟、质量波动和交付时效风险。`,
      positiveHotWords: topWords(positiveLexicon),
      negativeHotWords: topWords(negativeLexicon),
    };
  }, []);

  const scenarioResult = useMemo(() => {
    const assignments = chatSessions.map((session) => {
      const text = getCustomerText(session);
      let bestScenario: Scenario | null = null;
      let bestScore = 0;

      for (const scenario of allScenarios) {
        const score = scenario.keywords.reduce((sum, keyword) => sum + countHits(text, keyword), 0);
        if (score > bestScore) {
          bestScore = score;
          bestScenario = scenario;
        }
      }

      return {
        key: session.id,
        session,
        scenarioId: bestScenario?.id ?? "unclassified",
        scenarioName: bestScenario?.name ?? "未归类",
      };
    });

    const stats = allScenarios.map((scenario) => {
      const related = assignments.filter((item) => item.scenarioId === scenario.id).map((item) => item.session);
      return {
        ...scenario,
        key: scenario.id,
        count: related.length,
        sessions: related,
      };
    });

    return { assignments, stats };
  }, [allScenarios]);

  const productInsight = useMemo(() => {
    const rows = products
      .map((product) => {
        const relatedSessions = chatSessions.filter((session) => {
          const text = getCustomerText(session);
          return product.keywords.some((keyword) => text.includes(keyword));
        });

        return {
          ...product,
          key: product.id,
          heat: relatedSessions.length,
          sessions: relatedSessions,
        };
      })
      .filter((item) => item.heat > 0)
      .sort((a, b) => b.heat - a.heat);

    const maxHeat = rows[0]?.heat ?? 1;

    return {
      rows,
      maxHeat,
      summary: `共识别 ${rows.length} 类高意向产品，需求最高集中在厨房电器与清洁电器。`,
    };
  }, []);

  const activeScenario = scenarioResult.stats.find((item) => item.id === activeScenarioId);

  const openDrill = (title: string, description: string, sessions: ChatSession[]) => {
    setDrill({ open: true, title, description, sessions });
  };

  const addScenario = () => {
    const name = scenarioName.trim();
    const keywords = scenarioKeywords
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!name || keywords.length === 0) {
      antdMessage.warning("请输入场景名称，并至少填写一个关键词");
      return;
    }

    const next: Scenario = {
      id: `custom-${Date.now()}`,
      name,
      keywords,
      source: "custom",
    };

    setCustomScenarios((prev) => [...prev, next]);
    setScenarioName("");
    setScenarioKeywords("");
    setActiveScenarioId(next.id);
    antdMessage.success("已新增自定义场景");
  };

  const emotionColumns: TableColumnsType<(typeof emotionResult.bySession)[number]> = [
    {
      title: "会话",
      key: "session",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.session.customerName}</Text>
          <Text type="secondary">{record.session.id}</Text>
        </Space>
      ),
    },
    {
      title: "地区",
      dataIndex: ["session", "region"],
    },
    {
      title: "正向命中",
      dataIndex: "positiveHits",
      align: "center",
    },
    {
      title: "负向命中",
      dataIndex: "negativeHits",
      align: "center",
    },
    {
      title: "情绪极性",
      dataIndex: "polarity",
      render: (value: string) =>
        value === "正向" ? <Tag color="success">{value}</Tag> : value === "负向" ? <Tag color="error">{value}</Tag> : <Tag>{value}</Tag>,
    },
  ];

  const scenarioColumns: TableColumnsType<(typeof scenarioResult.stats)[number]> = [
    {
      title: "场景",
      key: "name",
      render: (_, record) => (
        <Space>
          <Text strong>{record.name}</Text>
          <Tag color={record.source === "builtin" ? "blue" : "purple"}>{record.source === "builtin" ? "系统" : "自定义"}</Tag>
        </Space>
      ),
    },
    {
      title: "命中会话",
      dataIndex: "count",
      align: "center",
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setActiveScenarioId(record.id)}>
            查看详情
          </Button>
          <Button
            type="link"
            icon={<SearchOutlined />}
            onClick={() => openDrill(record.name, `命中关键词：${record.keywords.join(" / ")}`, record.sessions)}
          >
            查看会话
          </Button>
        </Space>
      ),
    },
  ];

  const productColumns: TableColumnsType<(typeof productInsight.rows)[number]> = [
    {
      title: "产品",
      key: "name",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Tag>{record.category}</Tag>
        </Space>
      ),
    },
    {
      title: "热度",
      key: "heat",
      render: (_, record) => (
        <Progress
          percent={Math.round((record.heat / productInsight.maxHeat) * 100)}
          size="small"
          format={() => `${record.heat}`}
        />
      ),
    },
    {
      title: "关联会话",
      key: "sessions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<SearchOutlined />}
          onClick={() => openDrill(record.name, `关联关键词：${record.keywords.join(" / ")}`, record.sessions)}
        >
          查看 {record.sessions.length} 条
        </Button>
      ),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "emotion",
      label: "情绪趋势分析",
      children: (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Space>
                    <SmileOutlined style={{ color: "#16a34a" }} />
                    <Text strong>正向情绪</Text>
                  </Space>
                  <Paragraph style={{ margin: 0 }}>{emotionResult.positiveSummary}</Paragraph>
                  <Space size={[8, 8]} wrap>
                    {emotionResult.positiveHotWords.map((item) => (
                      <Tag key={item.word} color="success">
                        {item.word} · {item.count}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Space>
                    <FrownOutlined style={{ color: "#dc2626" }} />
                    <Text strong>负向情绪</Text>
                  </Space>
                  <Paragraph style={{ margin: 0 }}>{emotionResult.negativeSummary}</Paragraph>
                  <Space size={[8, 8]} wrap>
                    {emotionResult.negativeHotWords.map((item) => (
                      <Tag key={item.word} color="error">
                        {item.word} · {item.count}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>

          <Card title="会话情绪明细">
            <Table columns={emotionColumns} dataSource={emotionResult.bySession} pagination={false} size="middle" />
          </Card>
        </Space>
      ),
    },
    {
      key: "scenario",
      label: "场景分析",
      children: (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Card title="新增自定义场景">
            <Row gutter={[12, 12]}>
              <Col xs={24} md={8}>
                <Input value={scenarioName} placeholder="例如：活动咨询" onChange={(e) => setScenarioName(e.target.value)} />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  value={scenarioKeywords}
                  placeholder="关键词，使用逗号分隔。例如：优惠券,满减,活动价"
                  onChange={(e) => setScenarioKeywords(e.target.value)}
                />
              </Col>
              <Col xs={24} md={4}>
                <Button type="primary" block icon={<PlusOutlined />} onClick={addScenario}>
                  添加场景
                </Button>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={15}>
              <Card title="场景命中统计">
                <Table columns={scenarioColumns} dataSource={scenarioResult.stats} pagination={false} size="middle" />
              </Card>
            </Col>
            <Col xs={24} lg={9}>
              <Card title={activeScenario ? `场景详情：${activeScenario.name}` : "场景详情"}>
                {activeScenario ? (
                  <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    <Text type="secondary">该场景命中 {activeScenario.count} 条会话。</Text>
                    <Space size={[8, 8]} wrap>
                      {activeScenario.keywords.map((keyword) => (
                        <Tag key={keyword} color="processing">
                          {keyword}
                        </Tag>
                      ))}
                    </Space>
                    <Button
                      icon={<SearchOutlined />}
                      onClick={() =>
                        openDrill(
                          activeScenario.name,
                          `命中关键词：${activeScenario.keywords.join(" / ")}`,
                          activeScenario.sessions,
                        )
                      }
                    >
                      查看匹配会话
                    </Button>
                  </Space>
                ) : (
                  <Text type="secondary">暂无场景数据</Text>
                )}
              </Card>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: "product",
      label: "产品需求洞察",
      children: (
        <Card title="高意向产品热度">
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Paragraph style={{ margin: 0 }}>{productInsight.summary}</Paragraph>
            <Table columns={productColumns} dataSource={productInsight.rows} pagination={false} size="middle" />
          </Space>
        </Card>
      ),
    },
    {
      key: "sessions",
      label: "会话明细",
      children: (
        <Card title="全部会话">
          <List
            dataSource={chatSessions}
            renderItem={(session) => (
              <List.Item key={session.id}>
                <Card style={{ width: "100%" }}>
                  <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <Space wrap>
                      <Text strong>{session.customerName}</Text>
                      <Tag>{session.customerTag}</Tag>
                      <Tag color="geekblue">{session.region}</Tag>
                      <Text type="secondary">{session.id}</Text>
                    </Space>
                    <Divider style={{ margin: "4px 0" }} />
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                      {session.messages.map((line, idx) => (
                        <Flex key={`${session.id}-${idx}`} justify="space-between" align="center" style={{ gap: 8 }}>
                          <Text>
                            <Text strong>{line.speaker}：</Text>
                            {line.text}
                          </Text>
                          <Text type="secondary">{line.at}</Text>
                        </Flex>
                      ))}
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          colorInfo: "#2563eb",
          borderRadius: 10,
        },
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 40px" }}>
        <Card
          style={{
            marginBottom: 16,
            border: "1px solid #dbeafe",
            background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 60%, #ffffff 100%)",
          }}
        >
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Text style={{ color: "#2563eb", fontWeight: 600, letterSpacing: 0.5 }}>Conversation Insight Studio</Text>
            <Title level={2} style={{ margin: 0 }}>
              客服对话洞察看板
            </Title>
            <Paragraph style={{ margin: 0 }}>
              基于客服聊天记录，快速识别情绪趋势、场景分布与产品需求热点，帮助团队更快定位问题与机会。
            </Paragraph>
          </Space>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="正向会话" value={emotionResult.positiveCount} prefix={<SmileOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="负向会话" value={emotionResult.negativeCount} prefix={<FrownOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic title="高意向产品" value={productInsight.rows.length} prefix={<ThunderboltOutlined />} />
            </Card>
          </Col>
        </Row>

        <Card>
          <Tabs
            defaultActiveKey="emotion"
            items={tabItems}
            tabBarExtraContent={
              <Space>
                <Tag icon={<AppstoreOutlined />} color="blue">
                  场景引擎
                </Tag>
                <Tag icon={<MessageOutlined />} color="cyan">
                  会话样本 {chatSessions.length}
                </Tag>
              </Space>
            }
          />
        </Card>

        <Modal
          open={drill.open}
          title={drill.title}
          width={860}
          onCancel={() => setDrill((prev) => ({ ...prev, open: false }))}
          footer={null}
        >
          <Paragraph type="secondary">{drill.description}</Paragraph>
          <Divider />
          {drill.sessions.length === 0 ? (
            <Empty description="暂无匹配会话" />
          ) : (
            <List
              dataSource={drill.sessions}
              renderItem={(session) => (
                <List.Item key={session.id}>
                  <Card size="small" style={{ width: "100%" }}>
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                      <Space>
                        <Text strong>{session.customerName}</Text>
                        <Tag>{session.customerTag}</Tag>
                        <Text type="secondary">{session.id}</Text>
                      </Space>
                      {session.messages.map((line, index) => (
                        <Flex key={`${session.id}-drill-${index}`} justify="space-between" style={{ gap: 8 }}>
                          <Text>
                            <Text strong>{line.speaker}：</Text>
                            {line.text}
                          </Text>
                          <Text type="secondary">{line.at}</Text>
                        </Flex>
                      ))}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}
