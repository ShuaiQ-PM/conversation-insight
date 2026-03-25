"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InsertType = "metric" | "member";

type MetricItem = {
  id: string;
  name: string;
  desc: string;
  category: string;
  tags: string[];
};

type MemberItem = {
  id: string;
  name: string;
  dept: string;
  avatar: string;
};

type MentionOption = {
  type: InsertType;
  label: string;
  icon: string;
};

const leftNavItems = [
  "首页",
  "获客",
  "触达",
  "用户",
  "小店",
  "营销",
  "AI",
  "内容",
  "回公域",
  "视频号",
  "数据",
  "管理",
];

const historyList = [
  "群主分组活跃数据汇总",
  "新增企微客户数量查询",
  "加粉后成交数据查询",
  "2月私域运营数据统计",
  "营销数据查询咨询",
  "客户咨询",
  "上月积分消耗分析",
  "积分消耗数查询",
  "直播预告数据查询",
  "订单转换满赠活动创建",
  "积分翻倍活动创建",
];

const metricCategories = ["全部", "企微客户资产", "客户经营分析", "转化与交易数据", "小店经营分析", "营销触达分析"];

const metricData: MetricItem[] = [
  {
    id: "m1",
    name: "企微客户总数",
    desc: "截止查询时刻，所有加了企微好友且未解除好友关系的客户总量。",
    category: "企微客户资产",
    tags: ["客户资产与留存成长"],
  },
  {
    id: "m2",
    name: "企业新增企微客户数",
    desc: "企业维度：当天有客户添加，且该客户在当天之前没有添加过企业员工。",
    category: "企微客户资产",
    tags: ["获客数据"],
  },
  {
    id: "m3",
    name: "企业流失企微客户数",
    desc: "企业维度：当天客户删除，且该客户在当天之前添加过员工。",
    category: "客户经营分析",
    tags: ["获客数据", "流失预警与风控"],
  },
  {
    id: "m4",
    name: "新增好友关系数",
    desc: "员工维度：当天只要有客户添加员工，就计为 1。",
    category: "客户经营分析",
    tags: ["获客数据"],
  },
  {
    id: "m5",
    name: "解除好友关系数",
    desc: "员工维度：当天只要有客户删除员工，就计为 1。",
    category: "客户经营分析",
    tags: ["获客数据", "流失预警与风控"],
  },
  {
    id: "m6",
    name: "企微社群总人数",
    desc: "截止查询时刻，企业员工为群主的所有客户群群人数。",
    category: "转化与交易数据",
    tags: ["客户资产与留存成长", "社群基础数据"],
  },
  {
    id: "m7",
    name: "群新增企微客户数",
    desc: "统计区间内，来源于社群渠道并完成添加企微员工的客户数量。",
    category: "转化与交易数据",
    tags: ["获客数据"],
  },
  {
    id: "m8",
    name: "营销触达转化率",
    desc: "触达后完成关键行为的客户占比，用于衡量活动质量。",
    category: "营销触达分析",
    tags: ["营销洞察"],
  },
];

const memberData: MemberItem[] = [
  { id: "u1", name: "王佳裕", dept: "星云咨询管理", avatar: "王" },
  { id: "u2", name: "郝佳杰", dept: "星云咨询管理", avatar: "郝" },
  { id: "u3", name: "陈天阳", dept: "星云咨询管理", avatar: "陈" },
  { id: "u4", name: "裕建", dept: "星云咨询管理", avatar: "裕" },
  { id: "u5", name: "赵文路", dept: "星云咨询管理", avatar: "赵" },
  { id: "u6", name: "周宽", dept: "星云咨询管理", avatar: "周" },
  { id: "u7", name: "柯尊尧", dept: "星云咨询管理", avatar: "柯" },
  { id: "u8", name: "柯梦玲", dept: "星云咨询管理", avatar: "柯" },
  { id: "u9", name: "帅庆", dept: "星云咨询管理", avatar: "帅" },
  { id: "u10", name: "潘丽霞", dept: "星云咨询管理", avatar: "潘" },
  { id: "u11", name: "余园园", dept: "星云咨询管理", avatar: "余" },
];

const mentionOptions: MentionOption[] = [
  { type: "metric", label: "数据指标", icon: "📊" },
  { type: "member", label: "企业成员", icon: "👥" },
];

function getColorByText(text: string) {
  const colors = ["#9cc0ff", "#ffc89c", "#9de6cb", "#d5b2ff", "#ffc1d8", "#87d7f7"];
  let total = 0;
  for (const ch of text) {
    total += ch.charCodeAt(0);
  }
  return colors[total % colors.length];
}

export default function Home() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const mentionMenuRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionPos, setMentionPos] = useState({ x: 16, y: 86 });
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);

  const [metricOpen, setMetricOpen] = useState(false);
  const [metricSearch, setMetricSearch] = useState("");
  const [metricCategory, setMetricCategory] = useState("全部");
  const [selectedMetricId, setSelectedMetricId] = useState<string>("");

  const [memberOpen, setMemberOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const filteredMetrics = useMemo(() => {
    return metricData.filter((item) => {
      const categoryOk = metricCategory === "全部" || item.category === metricCategory;
      const keyword = metricSearch.trim();
      const searchOk =
        !keyword ||
        item.name.includes(keyword) ||
        item.desc.includes(keyword) ||
        item.tags.some((tag) => tag.includes(keyword));

      return categoryOk && searchOk;
    });
  }, [metricCategory, metricSearch]);

  const filteredMembers = useMemo(() => {
    const keyword = memberSearch.trim();
    if (!keyword) {
      return memberData;
    }

    return memberData.filter((item) => item.name.includes(keyword) || item.dept.includes(keyword));
  }, [memberSearch]);

  const selectedMembers = useMemo(() => {
    return memberData.filter((item) => selectedMemberIds.includes(item.id));
  }, [selectedMemberIds]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!mentionOpen) {
        return;
      }

      if (mentionMenuRef.current?.contains(target) || editorShellRef.current?.contains(target)) {
        return;
      }

      setMentionOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [mentionOpen]);

  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const placeMentionMenu = () => {
    const shell = editorShellRef.current;
    const selection = window.getSelection();

    if (!shell || !selection || selection.rangeCount === 0) {
      setMentionPos({ x: 16, y: 86 });
      return;
    }

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);

    const rect = range.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();

    const x = Math.max(16, rect.left - shellRect.left - 10);
    const y = Math.max(52, rect.bottom - shellRect.top + 12);

    setMentionPos({ x, y });
  };

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (mentionOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveMentionIndex((prev) => (prev + 1) % mentionOptions.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveMentionIndex((prev) => (prev - 1 + mentionOptions.length) % mentionOptions.length);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openInsertModal(mentionOptions[activeMentionIndex].type);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setMentionOpen(false);
        return;
      }
    }

    if (event.key !== "@") {
      return;
    }

    event.preventDefault();
    saveCurrentSelection();
    placeMentionMenu();
    setActiveMentionIndex(0);
    setMentionOpen(true);
  };

  const restoreEditorSelection = () => {
    const editor = editorRef.current;
    if (!editor) {
      return null;
    }

    editor.focus();

    const selection = window.getSelection();
    if (!selection) {
      return null;
    }

    selection.removeAllRanges();

    if (savedRangeRef.current) {
      const range = savedRangeRef.current.cloneRange();
      selection.addRange(range);
      return range;
    }

    const fallbackRange = document.createRange();
    fallbackRange.selectNodeContents(editor);
    fallbackRange.collapse(false);
    selection.addRange(fallbackRange);

    return fallbackRange;
  };

  const insertToken = (label: string, type: InsertType) => {
    const range = restoreEditorSelection();
    if (!range) {
      return;
    }

    const token = document.createElement("span");
    token.className = "var-tag";
    token.contentEditable = "false";

    const typeSpan = document.createElement("span");
    typeSpan.className = "var-type";
    typeSpan.textContent = type === "metric" ? "指标" : "成员";

    const labelSpan = document.createElement("span");
    labelSpan.className = "var-label";
    labelSpan.textContent = label;

    token.appendChild(typeSpan);
    token.appendChild(labelSpan);

    range.insertNode(token);

    const space = document.createTextNode(" ");
    range.setStartAfter(token);
    range.collapse(true);
    range.insertNode(space);
    range.setStartAfter(space);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    savedRangeRef.current = range.cloneRange();
  };

  const openInsertModal = (type: InsertType) => {
    setMentionOpen(false);
    setActiveMentionIndex(0);

    if (type === "metric") {
      setMetricOpen(true);
      return;
    }

    setMemberOpen(true);
  };

  const confirmMetricInsert = () => {
    const metric = metricData.find((item) => item.id === selectedMetricId);
    if (!metric) {
      return;
    }

    setMetricOpen(false);
    insertToken(metric.name, "metric");
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const confirmMemberInsert = () => {
    if (selectedMembers.length === 0) {
      return;
    }

    setMemberOpen(false);
    for (const member of selectedMembers) {
      insertToken(member.name, "member");
    }
  };

  return (
    <div className="luna-page">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <div className="brand-text">星云有客</div>
          <div className="grid-dot" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="top-search">智能搜索</div>

        <div className="user-wrap">
          <div className="notify">⌂</div>
          <div className="avatar">帅</div>
          <div className="user-info">
            <strong>帅庆</strong>
            <span>星云咨询管理</span>
          </div>
        </div>
      </header>

      <div className="content-wrap">
        <aside className="icon-rail">
          {leftNavItems.map((item) => (
            <button key={item} type="button" className={item === "AI" ? "rail-item active" : "rail-item"}>
              <span className="rail-dot" />
              <span>{item}</span>
            </button>
          ))}
        </aside>

        <aside className="history-panel">
          <div className="left-top-actions">
            <button type="button" className="new-chat-btn">
              <span>⊕</span>
              发起新会话
            </button>
            <button type="button" className="explore-btn">
              探索更多应用
            </button>
          </div>

          <div className="history-title">历史对话</div>

          <div className="history-list">
            {historyList.map((item) => (
              <button type="button" key={item} className="history-item">
                {item}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-panel">
          <section className="hero">
            <div className="pro-chip">👑 Pro版 ⚡ 11090 查看订阅</div>

            <div className="orb" aria-hidden>
              <div className="orb-eye" />
              <div className="orb-eye" />
            </div>

            <h1>我是Luna, 你的私域营销伙伴</h1>

            <div className="editor-shell" ref={editorShellRef}>
              <div
                ref={editorRef}
                className="editor"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="试试问我问题，输入 / 唤起快捷指令，或选择下方专家模式获取专业帮助"
                onKeyDown={handleEditorKeyDown}
                onClick={saveCurrentSelection}
                onKeyUp={saveCurrentSelection}
              />

              {mentionOpen && (
                <div className="mention-menu" ref={mentionMenuRef} style={{ left: mentionPos.x, top: mentionPos.y }}>
                  <div className="mention-menu-title">插入对象</div>
                  {mentionOptions.map((option, index) => (
                    <button
                      key={option.type}
                      type="button"
                      className={activeMentionIndex === index ? "active" : ""}
                      onMouseEnter={() => setActiveMentionIndex(index)}
                      onClick={() => openInsertModal(option.type)}
                    >
                      <span>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="editor-toolbar">
                <button type="button" className="tool-btn">
                  ⊕
                </button>
                <button type="button" className="tool-btn">
                  ≈
                </button>
                <div className="toolbar-right">
                  <button type="button" className="speed-btn">
                    快速 ▾
                  </button>
                  <button type="button" className="send-btn">
                    ↑
                  </button>
                </div>
              </div>
            </div>

            <div className="ability-row">
              {[
                "智能问答",
                "智能问数",
                "文案创作",
                "图片生成",
                "方案生成",
                "深入研究",
              ].map((name) => (
                <button key={name} type="button" className="ability-btn">
                  {name}
                </button>
              ))}
            </div>
          </section>

          <section className="apps-section">
            <div className="apps-head">
              <h2>探索更多应用</h2>
              <button type="button">查看全部&gt;</button>
            </div>

            <div className="apps-grid">
              <div className="app-card app-card-a" />
              <div className="app-card app-card-b" />
              <div className="app-card app-card-c" />
              <div className="app-card app-card-d" />
            </div>
          </section>
        </main>
      </div>

      {metricOpen && (
        <div className="modal-mask">
          <div className="modal metric-modal">
            <div className="modal-head">
              <h3>指标集市</h3>
              <button type="button" onClick={() => setMetricOpen(false)}>
                ×
              </button>
            </div>

            <div className="metric-layout">
              <div className="metric-left">
                <label className="search-box">
                  <span>🔍</span>
                  <input
                    value={metricSearch}
                    onChange={(event) => setMetricSearch(event.target.value)}
                    placeholder="请输入指标名称"
                  />
                </label>

                <div className="category-title">分类名称</div>
                <div className="category-list">
                  {metricCategories.map((name) => (
                    <button
                      type="button"
                      key={name}
                      className={metricCategory === name ? "category-item active" : "category-item"}
                      onClick={() => setMetricCategory(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="metric-right">
                <div className="metric-total">全部 ({filteredMetrics.length})</div>
                <div className="metric-grid">
                  {filteredMetrics.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={selectedMetricId === item.id ? "metric-card active" : "metric-card"}
                      onClick={() => setSelectedMetricId(item.id)}
                    >
                      <div className="metric-card-head">
                        <strong>{item.name}</strong>
                        <span className="radio-dot" />
                      </div>
                      <p>{item.desc}</p>
                      <div className="metric-tags">
                        {item.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="ghost-btn" onClick={() => setMetricOpen(false)}>
                取消
              </button>
              <button type="button" className="primary-btn" onClick={confirmMetricInsert}>
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {memberOpen && (
        <div className="modal-mask">
          <div className="modal member-modal">
            <div className="modal-head">
              <h3>选择成员</h3>
              <button type="button" onClick={() => setMemberOpen(false)}>
                ×
              </button>
            </div>

            <div className="member-layout">
              <div className="member-left">
                <label className="search-box">
                  <span>🔍</span>
                  <input
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder="请输入成员"
                  />
                </label>

                <div className="dept-row">
                  <span>▾</span>
                  <input type="checkbox" checked={selectedMembers.length === memberData.length} readOnly />
                  <strong>星云咨询管理</strong>
                </div>

                <div className="member-list">
                  {filteredMembers.map((member) => {
                    const checked = selectedMemberIds.includes(member.id);
                    return (
                      <label key={member.id} className="member-row">
                        <input type="checkbox" checked={checked} onChange={() => toggleMember(member.id)} />
                        <span className="member-avatar" style={{ backgroundColor: getColorByText(member.name) }}>
                          {member.avatar}
                        </span>
                        <span>{member.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="member-right">
                <div className="selected-head">
                  <span>已选：</span>
                  <button type="button" onClick={() => setSelectedMemberIds([])}>
                    清空
                  </button>
                </div>

                <div className="selected-list">
                  {selectedMembers.map((member) => (
                    <span key={member.id} className="selected-chip">
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="ghost-btn" onClick={() => setMemberOpen(false)}>
                取消
              </button>
              <button type="button" className="primary-btn" onClick={confirmMemberInsert}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
