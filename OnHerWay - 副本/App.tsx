
import React, { useState } from 'react';
import { ViewMode, PuzzleType, PuzzleData, MyMapSubView } from './types';
import { INITIAL_PUZZLES } from './constants';
import { Sidebar, UserProfileData } from './components/Sidebar';
import { MapCanvas } from './components/MapCanvas';
import { CommunityView } from './components/CommunityView';
import { InsightSummaryView } from './components/InsightSummaryView';
import { TopNav } from './components/TopNav';
import { PuzzleEditorModal } from './components/PuzzleEditorModal';
import { VerticalRightMenu } from './components/VerticalRightMenu';
import { LandingView } from './onHerWay/components/LandingView';
import { Layout as OhwLayout } from './onHerWay/components/Layout';
import { VoiceCallModal } from './onHerWay/components/VoiceCallModal';
import { PersonaModal } from './onHerWay/components/PersonaModal';
import { InsightFlow } from './onHerWay/components/InsightFlow';
import { ChatView as MentorChatView } from './onHerWay/components/ChatView';
import { PlanView as OhwPlanView } from './onHerWay/components/PlanView';
import { ResourceView as OhwResourceView } from './onHerWay/components/ResourceView';
import { CommunityView as OhwCommunityView } from './onHerWay/components/CommunityView';
import { NetworkView as OhwNetworkView } from './onHerWay/components/NetworkView';
import { ProfileView as OhwProfileView } from './onHerWay/components/ProfileView';
import { analyzeConversation, generateAvatar, generateUserProfile, sendMessageToMentor } from './onHerWay/services/geminiService';
import type {
  ActionItem as OhwActionItem,
  AnalysisResult as OhwAnalysisResult,
  ChatMessage as OhwChatMessage,
  Post as OhwPost,
  UserProfile as OhwUserProfile,
  View as OhwView,
} from './onHerWay/types';

// Mock Data for "Their" Map
const MOCK_THEIR_USER: UserProfileData = {
  name: "CC同学",
  avatar: "https://i.pravatar.cc/150?u=cc_creator",
  tagline: "CONTENT CREATOR",
  identity: "MAKER",
  role: "自媒体人",
  location: "上海",
  mood: "在崩溃和自愈中反复横跳",
  goal: "搞钱，去南极看企鹅",
  mission: "做个俗人，贪财好色"
};

const MOCK_THEIR_PUZZLES: PuzzleData[] = [
    // Experience
    {
        id: 'tp1', date: '2023.01.15', title: '第一条爆款', description: '虽然只是吐槽老板，但居然有10w+播放，看来大家都想辞职。',
        type: PuzzleType.EXPERIENCE, shapeVariant: 1, rotation: 10, x: -100, y: -100,
        author: { name: 'CC同学', avatar: '' }
    },
    {
        id: 'tp2', date: '2023.03.20', title: '恰饭啦', description: '收到了第一笔广告费，虽然只有500块，但比工资香多了。',
        type: PuzzleType.EXPERIENCE, shapeVariant: 3, rotation: -5, x: 50, y: -50,
        author: { name: 'CC同学', avatar: '' }
    },
    {
        id: 'tp3', date: '2023.08.10', title: '粉丝面基', description: '发现关注我的人都好可爱，我们都在努力对抗平庸。',
        type: PuzzleType.EXPERIENCE, shapeVariant: 2, rotation: 8, x: 200, y: -120,
        author: { name: 'CC同学', avatar: '' }
    },
    
    // Difficulty
    {
        id: 'tp4', date: '2023.06.20', title: '数据焦虑', description: '一旦流量下滑就怀疑人生，我是不是过气了？是不是江郎才尽了？',
        type: PuzzleType.DIFFICULTY, shapeVariant: 2, rotation: -5, x: 150, y: 50,
        author: { name: 'CC同学', avatar: '' }
    },
    {
        id: 'tp5', date: '2023.09.05', title: '恶评攻击', description: '第一次被骂上热评，在被窝里哭了一晚，第二天把他们都拉黑了。',
        type: PuzzleType.DIFFICULTY, shapeVariant: 4, rotation: 12, x: -150, y: 150,
        author: { name: 'CC同学', avatar: '' }
    },
    {
        id: 'tp6', date: '2024.01.01', title: '灵感枯竭', description: '坐在电脑前发呆了8个小时，一个字也写不出来，想把键盘吃了。',
        type: PuzzleType.DIFFICULTY, shapeVariant: 1, rotation: -8, x: 250, y: 200,
        author: { name: 'CC同学', avatar: '' }
    },

    // Goal
    {
        id: 'tp7', date: '2023.11.11', title: '百万粉丝', description: '虽然现在只有10万，但梦想要有的，万一见鬼了呢？',
        type: PuzzleType.GOAL, shapeVariant: 3, rotation: 5, x: -50, y: 250,
        author: { name: 'CC同学', avatar: '' }
    },
    {
        id: 'tp8', date: '2024.02.01', title: '个人工作室', description: '不想在家办公了，想要一个有一整面落地窗的办公室。',
        type: PuzzleType.GOAL, shapeVariant: 4, rotation: -2, x: 300, y: 0,
        author: { name: 'CC同学', avatar: '' }
    },
     {
        id: 'tp9', date: '2024.05.01', title: '早睡早起', description: '这可能是最难实现的宏伟目标了，熬夜是创作的宿命吗？',
        type: PuzzleType.GOAL, shapeVariant: 1, rotation: 15, x: 100, y: 320,
        author: { name: 'CC同学', avatar: '' }
    },
];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LANDING);
  const [myMapSubView, setMyMapSubView] = useState<MyMapSubView>('map');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callReturnViewMode, setCallReturnViewMode] = useState<ViewMode>(ViewMode.MY_MAP);
  const [visitingUser, setVisitingUser] = useState<UserProfileData | undefined>(undefined);
  // Track the previous view to return to correct screen after visiting a profile
  const [returnViewMode, setReturnViewMode] = useState<ViewMode>(ViewMode.INSIGHT_SUMMARY);
  const [ohwActiveView, setOhwActiveView] = useState<OhwView>('insight');
  const [ohwActions, setOhwActions] = useState<OhwActionItem[]>([]);
  const [ohwTags, setOhwTags] = useState<string[]>([]);
  const [ohwPosts, setOhwPosts] = useState<OhwPost[]>([
    {
      id: 'p1',
      userAvatar: 'https://picsum.photos/100/100?random=1',
      userName: 'Sarah Chen',
      userTitle: '转型 UX 设计中',
      content:
        '之前一直不敢开始做作品集，觉得太难了。AI 建议我只截取3个喜欢的App界面并写一句评价。15分钟就搞定了，瞬间没那么焦虑了！',
      likes: 42,
      comments: 5,
      timeAgo: '2小时前',
      type: 'success',
      category: 'hot',
      actionTaken: {
        id: 'a_mock_1',
        title: '分析3个App界面',
        description: '截图3个你喜欢的界面并写出优缺点。',
        tag: 'Skill',
        estimatedTimeMinutes: 15,
        status: 'completed',
        createdAt: Date.now(),
        isShared: true,
        difficulty: 'Low Friction',
      },
    },
  ]);
  const [myPuzzles, setMyPuzzles] = useState<PuzzleData[]>(INITIAL_PUZZLES);
  const [editingPuzzleDraft, setEditingPuzzleDraft] = useState<{
    initialType: PuzzleType;
    initialTitle: string;
    initialContent: string;
  } | null>(null);

  // On Her Way (OHW) post-call flow state (persona/insight/chat)
  const [isOhwFirstCall, setIsOhwFirstCall] = useState(true);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [pendingPersona, setPendingPersona] = useState<Partial<OhwUserProfile> | null>(null);
  const [persona, setPersona] = useState<Partial<OhwUserProfile> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<OhwAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatTurnCount, setChatTurnCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<OhwChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '嗨，我是 On Her Way。你现在最卡住的一点是什么？',
      timestamp: Date.now(),
    },
  ]);

  const ohwProfile: OhwUserProfile = {
    name: persona?.name || 'Explorer',
    title: persona?.title || '新探索者',
    avatar: persona?.avatar || 'https://picsum.photos/200',
    tags: ohwTags,
    xp: ohwActions.filter((a) => a.status === 'completed').length * 10,
    location: persona?.location,
    currentState: persona?.currentState,
    coreValues: persona?.coreValues,
    role_detail: persona?.role_detail,
    experience: persona?.experience,
    hassle: persona?.hassle,
    goal: persona?.goal,
  };

  const appendTranscriptionToChat = (transcriptionHistory: string[]) => {
    if (transcriptionHistory.length === 0) return;
    const newMessages: OhwChatMessage[] = transcriptionHistory.map((line, i) => {
      const isUser = line.startsWith('User:');
      const text = line.replace(/^(User:|Mentor:)\s*/, '');
      return {
        id: `voice_${Date.now()}_${i}`,
        role: isUser ? 'user' : 'model',
        text,
        timestamp: Date.now(),
      };
    });
    setChatMessages((prev) => [...prev, ...newMessages]);
  };

  const handleVoiceCallEnd = async (result: {
    transcriptionHistory: string[];
    reason: 'declined' | 'ended' | 'error';
  }) => {
    const { transcriptionHistory, reason } = result;
    setIsCallActive(false);

    if (reason !== 'ended') {
      setViewMode(callReturnViewMode);
      return;
    }

    setViewMode(ViewMode.INSIGHT_SUMMARY);
    setOhwActiveView('profile');

    if (transcriptionHistory.length === 0) return;

    appendTranscriptionToChat(transcriptionHistory);

    if (isOhwFirstCall) {
      setIsGeneratingPersona(true);
      try {
        const extractedProfile = await generateUserProfile(transcriptionHistory);
        const avatarUrl = await generateAvatar(extractedProfile);
        setPendingPersona({ ...extractedProfile, avatar: avatarUrl });
      } finally {
        setIsGeneratingPersona(false);
      }
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeConversation(transcriptionHistory);
      setAnalysisResult(result);
      if (result.newTags && result.newTags.length > 0) {
        setOhwTags((prev) => Array.from(new Set([...prev, ...result.newTags])));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddOhwActionToPlan = (action: OhwActionItem) => {
    setOhwActions((prev) => {
      if (prev.some((a) => a.id === action.id)) return prev;
      return [
        {
          ...action,
          status: action.status || 'pending',
          createdAt: action.createdAt || Date.now(),
          isShared: action.isShared || false,
        },
        ...prev,
      ];
    });
    setOhwActiveView('plan');
  };

  const handleCompleteOhwAction = (id: string) => {
    setOhwActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return { ...a, status: 'completed' };
      }),
    );
  };

  const handleShareOhwAction = (action: OhwActionItem) => {
    setOhwActions((prev) => prev.map((a) => (a.id === action.id ? { ...a, isShared: true } : a)));
    const newPost: OhwPost = {
      id: `post_${Date.now()}`,
      userAvatar: ohwProfile.avatar,
      userName: ohwProfile.name,
      userTitle: ohwProfile.title,
      content: `我做到了！打破了拖延，完成了： "${action.title}"。\n\n其实没有想象中那么难。这是我迈向新方向的第一步！`,
      likes: 0,
      comments: 0,
      timeAgo: '刚刚',
      type: 'success',
      category: 'hot',
      actionTaken: { ...action, isShared: true },
    };
    setOhwPosts((prev) => [newPost, ...prev]);
    setOhwActiveView('community');
  };

  const handleAskOhwAction = (action: OhwActionItem) => {
    const newPost: OhwPost = {
      id: `post_q_${Date.now()}`,
      userAvatar: ohwProfile.avatar,
      userName: ohwProfile.name,
      userTitle: ohwProfile.title,
      content: `AI 导师建议我尝试这个第一步： "${action.title}"。\n\n我想问问大家有类似经验吗？这个方向对我来说是一个好的开始吗？`,
      likes: 0,
      comments: 0,
      timeAgo: '刚刚',
      type: 'question',
      category: 'recommend',
      actionTaken: action,
    };
    setOhwPosts((prev) => [newPost, ...prev]);
    setOhwActiveView('community');
  };

  const handleConfirmPersona = () => {
    if (pendingPersona) setPersona(pendingPersona);
    setPendingPersona(null);
    setIsOhwFirstCall(false);
    setOhwActiveView('chat');
  };

  const handleSendMentorMessage = async () => {
    if (!chatInputText.trim()) return;

    const userMsg: OhwChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInputText,
      timestamp: Date.now(),
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInputText('');
    setIsChatTyping(true);

    const nextTurn = chatTurnCount + 1;
    setChatTurnCount(nextTurn);
    const shouldGenerateActions = !isOhwFirstCall && nextTurn >= 3;

    const response = await sendMessageToMentor(userMsg.text, newMessages.map((m) => m.text), shouldGenerateActions);

    const modelMsg: OhwChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.empatheticResponse,
      timestamp: Date.now(),
    };

    if (response.suggestedActions && response.suggestedActions.length > 0) {
      modelMsg.suggestedActions = response.suggestedActions.map((action, index) => ({
        id: `act_${Date.now()}_${index}`,
        status: 'pending',
        createdAt: Date.now(),
        isShared: false,
        title: action.title,
        description: action.description,
        tag: action.tag as any,
        estimatedTimeMinutes: action.estimatedTimeMinutes,
        difficulty: action.difficulty,
      }));
      setChatTurnCount(0);
    }

    setIsChatTyping(false);
    setChatMessages((prev) => [...prev, modelMsg]);
  };

  const handleAddOhwAction = (action: OhwActionItem) => {
    setOhwActions((prev) => {
      if (prev.some((a) => a.id === action.id)) return prev;
      return [
        {
          ...action,
          status: action.status || 'pending',
          createdAt: action.createdAt || Date.now(),
          isShared: action.isShared || false,
        },
        ...prev,
      ];
    });

    const initialType =
      action.sourceInsightType === 'Problem'
        ? PuzzleType.DIFFICULTY
        : action.sourceInsightType === 'Goal'
          ? PuzzleType.GOAL
          : action.sourceInsightType === 'Strength'
            ? PuzzleType.EXPERIENCE
            : PuzzleType.EXPERIENCE;

    setEditingPuzzleDraft({
      initialType,
      initialTitle: action.title || '新拼图',
      initialContent: action.description || '',
    });
  };

  const handlePublishPuzzle = (published: { title: string; description: string; type: PuzzleType }) => {
    const shapeVariant = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
    const rotation = Math.floor(Math.random() * 21) - 10;
    const x = Math.floor(Math.random() * 401) - 200;
    const y = Math.floor(Math.random() * 401) - 200;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

    const newPuzzle: PuzzleData = {
      id: `my_${Date.now()}`,
      date,
      title: published.title,
      description: published.description,
      type: published.type,
      shapeVariant,
      rotation,
      x,
      y,
      author: {
        name: persona?.name || 'Me',
        avatar: persona?.avatar || 'https://picsum.photos/200',
      },
    };

    setMyPuzzles((prev) => [newPuzzle, ...prev]);
    setEditingPuzzleDraft(null);
    setViewMode(ViewMode.INSIGHT_SUMMARY);
  };

  const handleVisitProfile = (author: any) => {
    // Capture the current view mode before switching so we can go back
    setReturnViewMode(viewMode);

    // In a real app, you'd fetch the user's full profile based on ID/Author
    // For now, we update the mock "Their User" with the name/avatar from the clicked puzzle
    const newUser = {
        ...MOCK_THEIR_USER,
        name: author.name || MOCK_THEIR_USER.name,
        avatar: author.avatar || MOCK_THEIR_USER.avatar
    };
    setVisitingUser(newUser);
    setViewMode(ViewMode.THEIR_MAP);
  };

  const handleBackFromProfile = () => {
      // Return to the view we came from (Community or Insight Summary)
      setViewMode(returnViewMode);
      setVisitingUser(undefined);
  };

  if (viewMode === ViewMode.LANDING) {
    return <LandingView onStart={() => setViewMode(ViewMode.MY_MAP)} />;
  }

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* Dynamic Background Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none stars"></div>

      {/* Top Navigation - Always visible */}
      <TopNav
        currentView={viewMode}
        onSwitch={(nextViewMode) => {
          setViewMode(nextViewMode);
          if (nextViewMode === ViewMode.INSIGHT_SUMMARY) setOhwActiveView('insight');
        }}
      />

      {/* Right Side Menu (MY WAY only) */}
      {viewMode === ViewMode.MY_MAP && (
        <VerticalRightMenu
          activeSubView={myMapSubView}
          onSubViewChange={setMyMapSubView}
          pendingActionsCount={ohwActions.filter((a) => a.status === 'pending').length}
          onCallStart={() => {
            setCallReturnViewMode(viewMode);
            setIsCallActive(true);
          }}
        />
      )}

      {/* Content Areas */}
      <div className="relative w-full h-full">
        {/* Layer 1: My Map OR Their Map */}
        <div
           className={`absolute inset-0 transition-all duration-700 ease-in-out ${
             (viewMode === ViewMode.MY_MAP || viewMode === ViewMode.THEIR_MAP)
               ? 'opacity-100 translate-x-0 scale-100'
               : 'opacity-0 -translate-x-[20%] scale-90 pointer-events-none'
           }`}
        >
          {/* Render Sidebar with Visiting User Data if in THEIR_MAP mode, else default (My User) */}
          <Sidebar
            user={viewMode === ViewMode.THEIR_MAP ? visitingUser : undefined}
            onBack={viewMode === ViewMode.THEIR_MAP ? handleBackFromProfile : undefined}
          />

          {/* Conditionally render sub-views in MY_MAP mode */}
          {viewMode === ViewMode.MY_MAP ? (
            <>
              {/* Map Sub-View */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                myMapSubView === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <MapCanvas puzzles={myPuzzles} />
              </div>

              {/* Plan Sub-View */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                myMapSubView === 'plan' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <OhwPlanView
                  actions={ohwActions}
                  onCompleteAction={handleCompleteOhwAction}
                  onShareAction={handleShareOhwAction}
                  onAskAction={handleAskOhwAction}
                  onNavigateToChat={() => setViewMode(ViewMode.INSIGHT_SUMMARY)}
                />
              </div>

              {/* Resources Sub-View */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                myMapSubView === 'resources' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <OhwResourceView
                  profile={ohwProfile}
                  completedActions={ohwActions.filter((a) => a.status === 'completed')}
                />
              </div>

              {/* Network Sub-View */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                myMapSubView === 'network' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <OhwNetworkView userProfile={ohwProfile} />
              </div>
            </>
          ) : (
            /* Render MapCanvas with Visiting Puzzles if in THEIR_MAP mode */
            <MapCanvas puzzles={MOCK_THEIR_PUZZLES} />
          )}
        </div>

        {/* Layer 2: Community View */}
        <div 
           className={`absolute inset-0 transition-all duration-700 ease-in-out ${
             viewMode === ViewMode.COMMUNITY 
               ? 'opacity-100 translate-x-0 scale-100 z-20' 
               : 'opacity-0 translate-x-[20%] scale-90 pointer-events-none z-0'
           }`}
        >
          <CommunityView 
            onBack={() => setViewMode(ViewMode.MY_MAP)} 
            onVisitProfile={handleVisitProfile} 
          />
        </div>

        {/* Layer 3: Insight Summary View */}
        <div 
           className={`absolute inset-0 transition-all duration-700 ease-in-out ${
             viewMode === ViewMode.INSIGHT_SUMMARY
               ? 'opacity-100 translate-x-0 scale-100 z-30' 
               : 'opacity-0 translate-x-[20%] scale-90 pointer-events-none z-0'
           }`}
        >
          {viewMode === ViewMode.INSIGHT_SUMMARY && (
            <OhwLayout
              activeView={ohwActiveView}
              setActiveView={setOhwActiveView}
              pendingActionsCount={ohwActions.filter((a) => a.status === 'pending').length}
            >
              {ohwActiveView === 'insight' ? (
                <InsightSummaryView
                  onBack={() => setViewMode(ViewMode.MY_MAP)}
                  onVisitProfile={handleVisitProfile}
                  chatMessages={chatMessages}
                  onAddAction={handleAddOhwActionToPlan}
                />
              ) : ohwActiveView === 'plan' ? (
                <OhwPlanView
                  actions={ohwActions}
                  onCompleteAction={handleCompleteOhwAction}
                  onShareAction={handleShareOhwAction}
                  onAskAction={handleAskOhwAction}
                  onNavigateToChat={() => setOhwActiveView('chat')}
                />
              ) : ohwActiveView === 'resources' ? (
                <OhwResourceView profile={ohwProfile} completedActions={ohwActions.filter((a) => a.status === 'completed')} />
              ) : ohwActiveView === 'community' ? (
                <OhwCommunityView posts={ohwPosts} />
              ) : ohwActiveView === 'network' ? (
                <OhwNetworkView userProfile={ohwProfile} />
              ) : ohwActiveView === 'profile' ? (
                <OhwProfileView profile={ohwProfile} completedActions={ohwActions.filter((a) => a.status === 'completed')} />
              ) : (
                <MentorChatView
                  messages={chatMessages}
                  inputText={chatInputText}
                  setInputText={setChatInputText}
                  isTyping={isChatTyping}
                  onSendMessage={handleSendMentorMessage}
                  onStartVoice={() => {
                    setCallReturnViewMode(ViewMode.INSIGHT_SUMMARY);
                    setIsCallActive(true);
                  }}
                  onNavigateToInsight={() => setOhwActiveView('insight')}
                />
              )}
            </OhwLayout>
          )}
        </div>

        {/* Layer 4: Phone Call Overlay */}
        {isCallActive && (
          <div className="fixed inset-0 z-[90]">
            <VoiceCallModal onClose={handleVoiceCallEnd} />
          </div>
        )}
      </div>

      {(isAnalyzing || isGeneratingPersona) && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-space-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-white font-serif text-xl font-bold">
              {isGeneratingPersona ? '正在生成专属身份...' : '正在更新成长轨迹...'}
            </h3>
            <p className="text-white/50 text-sm mt-2 font-light">
              {isGeneratingPersona ? '根据通话内容为你创建探索者卡片。' : '正在分析对话模式。'}
            </p>
          </div>
        </div>
      )}

      {pendingPersona && <PersonaModal profile={pendingPersona} onContinue={handleConfirmPersona} />}

      {analysisResult && (
        <InsightFlow analysis={analysisResult} onAddAction={handleAddOhwAction} onClose={() => setAnalysisResult(null)} />
      )}

      {editingPuzzleDraft && (
        <PuzzleEditorModal
          initialType={editingPuzzleDraft.initialType}
          initialTitle={editingPuzzleDraft.initialTitle}
          initialContent={editingPuzzleDraft.initialContent}
          onClose={() => setEditingPuzzleDraft(null)}
          onPublish={handlePublishPuzzle}
        />
      )}
    </div>
  );
};

export default App;
