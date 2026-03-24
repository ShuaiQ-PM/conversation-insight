"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CirclePlus,
  HeartHandshake,
  MessageSquareText,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  speaker: "客户" | "客服";
  text: string;
  at: string;
};

type ChatSession = {
  id: string;
  customerName: string;
  customerTag: string;
  region: string;
  messages: Message[];
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

const positiveLexicon = [
  "喜欢",
  "太好了",
  "划算",
  "不错",
  "满意",
  "实用",
  "稳定",
  "太棒了",
  "吸引",
  "信任",
];

const negativeLexicon = [
  "杂音",
  "出问题",
  "没更新",
  "着急",
  "体验很差",
  "退货",
  "失望",
  "发灰",
  "不然",
  "影响",
];

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

type DrillState = {
  open: boolean;
  title: string;
  description: string;
  sessions: ChatSession[];
};

function countHits(text: string, keyword: string) {
  return text.includes(keyword) ? 1 : 0;
}

function getCustomerText(session: ChatSession) {
  return session.messages
    .filter((message) => message.speaker === "客户")
    .map((message) => message.text)
    .join(" ");
}

export default function Home() {
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioKeywords, setScenarioKeywords] = useState("");
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenarios[0].id);
  const [drill, setDrill] = useState<DrillState>({
    open: false,
    title: "",
    description: "",
    sessions: [],
  });

  const allScenarios = useMemo(() => [...defaultScenarios, ...customScenarios], [customScenarios]);

  const emotionResult = useMemo(() => {
    const bySession = chatSessions.map((session) => {
      const customerText = getCustomerText(session);
      const positiveHits = positiveLexicon.reduce(
        (total, keyword) => total + countHits(customerText, keyword),
        0,
      );
      const negativeHits = negativeLexicon.reduce(
        (total, keyword) => total + countHits(customerText, keyword),
        0,
      );

      return {
        session,
        positiveHits,
        negativeHits,
        polarity:
          positiveHits === negativeHits
            ? "中性"
            : positiveHits > negativeHits
              ? "正向"
              : "负向",
      };
    });

    const positiveCount = bySession.filter((item) => item.polarity === "正向").length;
    const negativeCount = bySession.filter((item) => item.polarity === "负向").length;

    const topWords = (lexicon: string[]) => {
      return lexicon
        .map((word) => {
          const relatedSessions = chatSessions.filter((session) =>
            getCustomerText(session).includes(word),
          );
          return { word, count: relatedSessions.length, relatedSessions };
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    };

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

      allScenarios.forEach((scenario) => {
        const score = scenario.keywords.reduce((sum, keyword) => sum + countHits(text, keyword), 0);
        if (score > bestScore) {
          bestScore = score;
          bestScenario = scenario;
        }
      });

      return {
        session,
        scenarioId: bestScenario?.id ?? "unclassified",
        scenarioName: bestScenario?.name ?? "未归类",
      };
    });

    const stats = allScenarios.map((scenario) => {
      const related = assignments.filter((item) => item.scenarioId === scenario.id).map((item) => item.session);
      return {
        ...scenario,
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

  const addCustomScenario = () => {
    const trimmedName = scenarioName.trim();
    const parsedKeywords = scenarioKeywords
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (!trimmedName || parsedKeywords.length === 0) {
      return;
    }

    const scenario: Scenario = {
      id: `scenario-custom-${Date.now()}`,
      name: trimmedName,
      keywords: parsedKeywords,
      source: "custom",
    };

    setCustomScenarios((prev) => [scenario, ...prev]);
    setActiveScenarioId(scenario.id);
    setScenarioName("");
    setScenarioKeywords("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(49,111,255,0.18),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(26,188,156,0.16),transparent_34%)] px-4 py-8 md:px-10 md:py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur">
          <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
            Customer Conversation Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
            基于客户聊天记录的会话洞察
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            聚合客户对话，完成情绪识别、场景归因与产品需求挖掘，并支持热词与产品点击下钻查看客户明细、聊天原文。
          </p>
        </header>

        <Tabs defaultValue="emotion" className="gap-4">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto p-0">
            <TabsTrigger value="emotion" className="gap-2">
              <HeartHandshake className="size-4" />
              情绪分析
            </TabsTrigger>
            <TabsTrigger value="scenario" className="gap-2">
              <Sparkles className="size-4" />
              自定义洞察场景
            </TabsTrigger>
            <TabsTrigger value="product" className="gap-2">
              <TrendingUp className="size-4" />
              产品需求洞察
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emotion" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-emerald-500/30 bg-card/85">
                <CardHeader>
                  <CardTitle className="text-emerald-300">正向情绪总结</CardTitle>
                  <CardDescription>{emotionResult.positiveSummary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-semibold">{emotionResult.positiveCount} 条</div>
                  <div className="flex flex-wrap gap-2">
                    {emotionResult.positiveHotWords.map((item) => (
                      <Button
                        key={item.word}
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          openDrill(
                            `正向热词：${item.word}`,
                            `命中 ${item.count} 位客户，点击可查看客户详情与原始聊天记录。`,
                            item.relatedSessions,
                          )
                        }
                      >
                        {item.word} · {item.count}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-500/30 bg-card/85">
                <CardHeader>
                  <CardTitle className="text-rose-300">负向情绪总结</CardTitle>
                  <CardDescription>{emotionResult.negativeSummary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-semibold">{emotionResult.negativeCount} 条</div>
                  <div className="flex flex-wrap gap-2">
                    {emotionResult.negativeHotWords.map((item) => (
                      <Button
                        key={item.word}
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          openDrill(
                            `负向热词：${item.word}`,
                            `命中 ${item.count} 位客户，建议优先排查对应服务链路。`,
                            item.relatedSessions,
                          )
                        }
                      >
                        {item.word} · {item.count}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/85">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  会话级情绪明细
                </CardTitle>
                <CardDescription>按会话展示情绪方向，便于客服主管快速定位重点客户。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {emotionResult.bySession.map((item) => (
                    <div key={item.session.id} className="rounded-lg border border-border/70 bg-background/50 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div className="font-medium">
                          {item.session.customerName} · {item.session.customerTag} · {item.session.region}
                        </div>
                        <div
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            item.polarity === "正向"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : item.polarity === "负向"
                                ? "bg-rose-500/15 text-rose-300"
                                : "bg-slate-500/15 text-slate-300"
                          }`}
                        >
                          {item.polarity}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        正向词 {item.positiveHits} / 负向词 {item.negativeHits}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenario" className="space-y-4">
            <Card className="bg-card/85">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CirclePlus className="size-4" />
                  新建自定义洞察场景
                </CardTitle>
                <CardDescription>
                  例如创建“售前问题”“售后问题”之外的专属场景，通过关键词将客户会话自动归类。
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
                <Input
                  value={scenarioName}
                  onChange={(event) => setScenarioName(event.target.value)}
                  placeholder="场景名称，例如：活动咨询"
                />
                <Textarea
                  value={scenarioKeywords}
                  onChange={(event) => setScenarioKeywords(event.target.value)}
                  placeholder="关键词，使用逗号分隔，例如：满减,券,赠品"
                  className="min-h-9 resize-none"
                />
                <Button onClick={addCustomScenario} className="md:self-start">
                  创建场景
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <Card className="bg-card/85">
                <CardHeader>
                  <CardTitle>场景分布</CardTitle>
                  <CardDescription>点击任一场景即可下钻查看客户明细和聊天记录。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scenarioResult.stats.map((scenario) => {
                    const ratio = Math.round((scenario.count / chatSessions.length) * 100);
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          activeScenarioId === scenario.id
                            ? "border-primary/60 bg-primary/10"
                            : "border-border/70 bg-background/50 hover:border-primary/40"
                        }`}
                        onClick={() => setActiveScenarioId(scenario.id)}
                      >
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <div className="font-medium">{scenario.name}</div>
                          <div className="text-muted-foreground">{scenario.count} 条</div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${ratio}%` }} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{scenario.source === "custom" ? "自定义" : "内置"}</span>
                          <span>{ratio}%</span>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-card/85">
                <CardHeader>
                  <CardTitle>{activeScenario?.name ?? "未选择场景"}</CardTitle>
                  <CardDescription>
                    关键词：{activeScenario?.keywords.join("、") ?? "-"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    命中会话 {activeScenario?.count ?? 0} 条。
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      openDrill(
                        `${activeScenario?.name ?? "场景"} - 客户下钻`,
                        "按会话展示客户详情和原始聊天记录。",
                        activeScenario?.sessions ?? [],
                      )
                    }
                  >
                    查看客户明细
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="product" className="space-y-4">
            <Card className="bg-card/85">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="size-4" />
                  产品需求热度排行
                </CardTitle>
                <CardDescription>{productInsight.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {productInsight.rows.map((item) => {
                  const width = Math.max(
                    12,
                    Math.round((item.heat / productInsight.maxHeat) * 100),
                  );
                  return (
                    <div key={item.id} className="rounded-lg border border-border/70 bg-background/50 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            openDrill(
                              `产品需求下钻：${item.name}`,
                              `热度 ${item.heat}，关联客户会话 ${item.sessions.length} 条。`,
                              item.sessions,
                            )
                          }
                        >
                          查看关联会话
                        </Button>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#2dd4bf,#60a5fa)]"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">需求热度：{item.heat}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={drill.open} onOpenChange={(open) => setDrill((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareText className="size-4" />
              {drill.title}
            </DialogTitle>
            <DialogDescription>{drill.description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[420px] rounded-md border border-border/70 bg-background/40 p-4">
            <div className="space-y-4">
              {drill.sessions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                  当前条件下暂无命中会话。
                </div>
              ) : (
                drill.sessions.map((session) => (
                  <div key={session.id} className="rounded-lg border border-border/70 bg-card/60 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <p className="font-medium">
                        {session.customerName} · {session.customerTag} · {session.region}
                      </p>
                      <p className="text-xs text-muted-foreground">会话ID：{session.id}</p>
                    </div>
                    <div className="space-y-2">
                      {session.messages.map((message, index) => (
                        <div key={`${session.id}-${index}`} className="rounded-md bg-background/70 p-2 text-sm">
                          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{message.speaker}</span>
                            <span>{message.at}</span>
                          </div>
                          <p>{message.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </main>
  );
}
