"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experiences", label: "Experiences" },
];

// ── 트러블슈팅 타입 ──
type TroubleItem = {
  title: string;
  situation: string[];
  cause: string[];
  solution: string[];
  learned: string[];
};

// ── 스택 이유 타입 ──
type StackReason = {
  name: string;
  reason: string;
};

// ── 트러블슈팅 데이터 ──
const TROUBLES: Record<string, TroubleItem[]> = {
  CLUSTAR: [
    {
      title: "메모는 저장됐는데, 임베딩은 왜 안 생길까",
      situation: [
        "메모 저장 후 vector_store에 임베딩 데이터가 생성되지 않는 현상 발생",
        "로그 확인 결과 Extract 단계(문서 1개 추출)는 정상이지만 Transform 단계에서 문서가 0개로 처리됨",
      ],
      cause: [
        "MemoTextTransformer의 TokenTextSplitter minChunkChars가 200자로 설정되어 있어, 200자 미만 메모는 청크가 생성되지 않고 빈 리스트 반환",
        "@Async로 비동기 처리되는 구조라 에러가 조용히 묻혀 어느 단계에서 실패했는지 파악이 어려웠음",
      ],
      solution: [
        "이벤트 수신·문서 추출·Transform·Vector Store 저장 단계별 디버깅 로그 추가로 실패 지점 추적",
        "Spring AI 소스코드를 직접 확인해 TokenTextSplitter가 minChunkChars 미달 시 청크를 drop하는 동작을 특정",
        "minChunkChars, minChunkLengthToEmbed를 1로 변경해 모든 메모가 임베딩되도록 수정",
      ],
      learned: [
        "@Async 환경에서는 파이프라인 어느 단계가 실패해도 에러가 전파되지 않아, 저장은 성공했지만 RAG 검색에는 누락될 수 있다는 구조적 위험을 인식",
        "라이브러리 설정값 하나가 파이프라인 전체 동작을 좌우할 수 있어, 동작 확인 시 내부 구현까지 직접 검증해야 함을 배움",
      ],
    },
    {
      title: "검색은 되는데 결과 품질이 이상했던 이유",
      situation: [
        "텍스트 메모 검색은 정상이지만, PDF 포함 메모는 관련 없는 청크가 상위에 오고 이미지 포함 메모는 LLM이 컨텍스트를 혼동하는 응답을 생성",
        "API 에러 없이 벡터 검색도 정상 응답을 반환해, 시스템은 동작하지만 검색 품질만 나쁜 상태였음",
      ],
      cause: [
        "PDF 추출 텍스트에 'Page 1', 'PAGE 2' 같은 페이지 번호와 불규칙 공백이 그대로 청킹되어, 노이즈 섞인 청크가 실제 내용 청크보다 높은 유사도로 매칭되는 역전 현상 발생",
        "이미지 OCR 결과가 메모 본문과 동일한 형식으로 임베딩되어, LLM이 본문과 이미지 추출 텍스트를 구분하지 못함",
      ],
      solution: [
        "FileTextCleanupTransformer를 추가해 PDF 텍스트의 페이지 번호·불규칙 공백을 정규식으로 전처리",
        "MemoImageOcrNormalizeTransformer로 이미지 OCR 결과에 [IMAGE OCR CONTENT] 출처 태그를 부착해 본문과 구분",
        "텍스트·이미지·파일별 전처리 요구사항이 달라 @Qualifier 기반으로 타입별 변환 파이프라인을 독립적으로 분리",
      ],
      learned: [
        "벡터 검색 품질은 모델이나 topK보다 임베딩에 무엇을 넣느냐가 더 크게 좌우한다는 것을 체감",
        "전처리를 독립 컴포넌트로 분리한 것은 단순 리팩토링이 아니라 검색 품질을 측정·개선 가능한 변수로 만들기 위한 설계 결정이었음",
        "색인 대상 문서의 품질이 retrieval 정확도를 결정한다는 IR의 기본 원칙을 직접 경험",
      ],
    },
    {
      title: "에러는 없는데 검색 결과가 항상 빈 배열이었던 이유",
      situation: [
        "특정 조건에서 메모 검색 결과가 항상 빈 배열로 반환 — API 에러 없음, similaritySearch()도 Document 10개를 정상 반환",
        "로그상으로는 전 과정이 정상이라 원인 파악이 쉽지 않았음",
      ],
      cause: [
        "trace 로그 확인 결과, Long으로 저장한 memoId가 pgvector의 JSONB metadata 역직렬화 과정에서 Integer로 반환됨",
        "instanceof Long이 Integer에 대해 false를 반환해 모든 document에서 memoId 수집이 실패, seenMemoIds가 빈 채로 종료되어 최종 결과가 빈 배열로 이어짐",
        "더 큰 구조적 문제 인식: RAG 파이프라인은 에러 없이 끝나도(retrieve 성공) 빈 컨텍스트로 LLM이 hallucination 응답을 만들어 API는 200 OK를 반환하지만 응답 품질이 망가질 수 있음",
      ],
      solution: [
        "즉시 수정: Long/Integer/String 타입에 무관하게 memoId를 추출하는 방어 코드 추가",
        "근본 해결: RAGAS 표준 지표를 참고해 Relevance·Groundedness·Faithfulness·Task Alignment 4개 지표로 RAG 응답 품질을 자동 평가하는 모듈 설계",
        "컨텍스트 부족으로 fallback 응답이 나온 경우는 평가 자체를 건너뛰고 고정값을 반환해 의미 없는 점수 산출 방지",
      ],
      learned: [
        "RAG 시스템에서 '동작한다'와 '잘 동작한다'는 완전히 다른 문제이며, 에러 모니터링만으로는 품질 저하를 감지할 수 없음",
        "JSONB 기반 저장소(pgvector 등) 사용 시 타입 역직렬화 동작을 반드시 직접 검증해야 함을 배움",
        "품질을 수치로 측정·추적해야 개선 방향을 잡을 수 있다는 인식으로 평가 모듈 도입까지 이어짐",
      ],
    },
    {
      title: "괜찮아 보였던 로그아웃 로직, 다시 보니 보안 구멍",
      situation: [
        "구글 소셜 로그인 구현 중 액세스 토큰과 리프레시 토큰을 모두 Redis 블랙리스트로 검증하도록 구현",
        "로그아웃 로직을 반복해서 구현하다 보니 어딘가 어색하다는 느낌이 들어 다시 점검",
      ],
      cause: [
        "블랙리스트는 '차단 목록에 없으면 허용'하는 방식이라 모르는 토큰도 기본적으로 허용되는 구조 — 토큰 검증처럼 중요한 검증에는 보안 설계 관점상 적합하지 않음",
        "리프레시 토큰은 수명과 사용 주기가 길어, 블랙리스트로 관리하면 '모르는 토큰에 대한 검증' 책임이 비즈니스 로직에 흩어지는 위험한 설계가 됨",
      ],
      solution: [
        "액세스 토큰은 블랙리스트로 유지하되 수명을 짧게 줘서 보안 보완 — 매 요청마다 화이트리스트를 조회하면 Redis 부하가 커지기 때문에 트레이드오프로 선택",
        "리프레시 토큰은 화이트리스트 방식으로 전환해, 허용된 토큰만 통과시키는 구조로 리팩토링",
      ],
      learned: [
        "토큰의 수명과 트래픽 특성에 따라 블랙리스트/화이트리스트를 다르게 적용해야 한다는 것을 학습",
        "'모르는 토큰을 어떻게 취급할지'에 대한 책임을 비즈니스 로직에 흩어두지 않고 설계 단계에서 명확히 결정하는 게 보안상 더 안전하다는 것을 배움",
      ],
    },
    {
      title: "S3는 지워졌는데 DB는 그대로 남아있던 이유",
      situation: [
        "메모 삭제 시 S3 파일을 먼저 삭제한 뒤 DB를 삭제하는 구조라, DB 삭제 중 에러가 나서 트랜잭션이 롤백되면 S3 파일은 사라졌는데 DB 데이터는 남는 불일치 발생",
      ],
      cause: [
        "S3 삭제와 DB 삭제가 같은 트랜잭션 흐름에서 순차 처리되어, 한쪽만 성공하는 상황을 막을 방법이 없었음",
      ],
      solution: [
        "@TransactionalEventListener(phase = AFTER_COMMIT)로 DB 트랜잭션이 확실히 커밋된 후에만 S3 삭제가 실행되도록 분리 — TransactionSynchronizationManager 콜백 방식도 검토했지만 재사용성·테스트 용이성 면에서 이벤트 기반을 선택",
        "S3 삭제 자체가 실패할 가능성도 있어, S3DeletionFailure 엔티티로 실패를 기록해 추후 재처리할 수 있게 함",
        "실패 기록 로직을 같은 클래스에 두었을 때 Self-Invocation으로 @Transactional(REQUIRES_NEW)가 무시되는 AOP 프록시 문제를 발견해, 별도 클래스(S3DeletionHandler)로 분리해 해결",
      ],
      learned: [
        "DB와 외부 스토리지(S3)처럼 트랜잭션 경계가 다른 리소스 간 일관성은 하나의 트랜잭션으로 보장할 수 없어, 커밋 이후에 처리하고 실패하면 따로 기록해 나중에 다시 처리하는 방식이 필요함을 배움",
        "Spring의 @Transactional은 AOP 프록시 기반으로 동작해 같은 클래스 내부 호출(self-invocation)에는 적용되지 않는다는 것을 직접 겪고 이해함",
      ],
    },
  ],
  NUNCHI: [
    {
      title: "담지 않은 메뉴가 장바구니에 들어있던 이유",
      situation: [
        "build_prefetch_graph()가 백그라운드에서 order_agent를 포함한 전체 그래프를 실행해, 사용자가 주문하지 않은 메뉴가 실제 세션 cart에 자동으로 담김",
        "실제 세션 27에서 콜라 1개만 수동으로 추가했는데, cart에는 데리야끼치킨솥밥·공기밥까지 함께 담겨있는 걸 확인했음",
        "명시적 에러 없이 조용히 cart가 오염되는 silent bug라 로그로만 확인 가능",
      ],
      cause: [
        "build_prefetch_graph()는 응답을 미리 캐싱하려는 읽기 전용 목적이었지만, 내부에 cart 쓰기 권한이 있는 order_agent가 포함되어 있었음",
        "suggestions에 담긴 '메뉴 더 추가할게' 같은 텍스트가 prefetch되며 intent_classifier → order → tool_add_cart_item 경로가 실제 세션에서 실행됨",
        "핵심 원인: 쓰기 권한이 있는 에이전트를 읽기 전용 목적의 prefetch에 포함시킨 설계 결함",
      ],
      solution: [
        "build_prefetch_graph()를 recommend_agent만 실행하는 단순 그래프로 교체(order_agent, payment_agent 등 cart를 변경하는 에이전트 제외)",
        "get_recommend_tools()로 recommend_agent가 조회 전용 tool만 쓰도록 제한 — 전체 20개 tool 중 조회 전용 6개만 바인딩",
      ],
      learned: [
        "백그라운드 실행 경로에도 최소 권한 원칙(Principle of Least Privilege)을 반드시 적용해야 함",
        "'읽기 전용 목적'이라는 설계 의도만으로는 부족, 쓰기 가능한 에이전트가 섞이면 언제든 사이드 이펙트가 발생할 수 있음",
      ],
    },
    {
      title: "메뉴를 두 개 담아달랬는데 하나만 담기고 멈췄던 이유",
      situation: [
        "'숯불삼겹솥밥이랑 콜라 담아줘' 요청 시 콜라(옵션 없음)는 담기지 않고 솥밥 옵션 선택만 요청",
        "옵션 선택 완료 후에도 콜라가 cart에 없는 채로 넘어가, 복수 메뉴 요청 시 일부 메뉴가 반복적으로 누락",
      ],
      cause: [
        "복수 메뉴 처리 순서(실행 계획)를 LLM에게 그대로 위임한 설계 문제",
        "LLM은 순차 처리 성향이 있어 옵션이 필요한 첫 메뉴에서 멈추고 나머지(옵션 없는 메뉴)는 처리하지 않음",
        "오케스트레이션 레이어가 실행 순서를 통제하지 않고 실행 계획 전체를 LLM에 맡긴 게 근본 원인",
      ],
      solution: [
        "임시 해결: 프롬프트에 2단계 처리 순서 명시 — 1) 모든 메뉴에 대해 search → detail 먼저 완료, 2) 옵션 없는 메뉴를 전부 먼저 장바구니에 담고 옵션 있는 메뉴만 그다음 옵션 선택 UI 표시",
        "프롬프트 패치는 메뉴 조합이 복잡해질수록(3개·4개·여러 옵션 단계) 한계가 있어 단기 해결책으로 인식",
        "장기 방향: 발화에서 메뉴 목록을 추출한 뒤 처리 순서를 코드 레벨 파이프라인으로 강제",
      ],
      learned: [
        "LLM에게 실행 계획을 맡기지 말고 오케스트레이션 레이어에서 처리 순서를 코드로 강제해야 함",
        "역할 분리가 핵심: 자연어 이해는 LLM, 실행 순서·흐름 제어·tool 호출 타이밍·예외 처리는 코드가 담당",
        "이렇게 역할을 나눠야 LLM hallucination의 영향을 최소화할 수 있음",
      ],
    },
    {
      title: "스트리밍을 켰는데 토큰 없이 done만 오던 이유",
      situation: [
        "/ai/order/chat/stream SSE 엔드포인트 호출 시 token 이벤트 없이 done 한 줄만 수신됨 — 추천·잡담 등 어떤 발화에서도 동일하게 발생",
        "TTFB와 전체 응답 수신 시간이 약 780ms로 거의 동일해, 스트리밍이 아니라 응답을 전부 생성한 뒤 한 번에 전송하는 것처럼 동작",
      ],
      cause: [
        "ChatOpenAI 객체에 streaming=True가 설정되지 않아 on_chat_model_stream 이벤트 자체가 발생하지 않음",
        "_STREAMING_NODES 필터가 'recommend_agent', 'order_agent', 'payment_agent'를 찾고 있었지만, create_react_agent로 만든 에이전트의 실제 내부 LLM 노드명은 'agent'로 등록되어 모든 토큰 이벤트가 필터에 걸러짐",
      ],
      solution: [
        "recommend/order/payment 노드 3곳의 ChatOpenAI 생성자에 streaming=True 추가",
        "_STREAMING_NODES를 실제 이벤트 메타데이터와 일치하도록 {'agent'}로 수정",
      ],
      learned: [
        "astream_events()는 ChatOpenAI(streaming=True) 없이는 토큰 이벤트를 발생시키지 않음",
        "create_react_agent로 만든 노드의 내부 LLM은 외부에서 부여한 그래프 노드 이름이 아니라 내부적으로 'agent'라는 고정 이름으로 등록됨",
        "디버깅 시 langgraph_node 값을 로그로 찍어보는 것이 가장 빠른 확인 방법이라는 것을 배움",
      ],
    },
  ],
};

// ── 스택 이유 데이터 ──
const STACK_REASONS: Record<string, StackReason[]> = {
  CLUSTAR: [
    {
      name: "Spring Boot",
      reason:
        "빠른 서버 구성과 풍부한 생태계(JPA, Security, Validation 등)가 검증된 프레임워크입니다. AI 기능 연동 시 Spring AI 모듈을 그대로 활용할 수 있어 선택했습니다.",
    },
    {
      name: "Spring AI",
      reason:
        "LangChain4j 등의 대안도 검토했지만, Spring 진영 공식 AI 통합 라이브러리로 Spring Boot와 AutoConfiguration이 자연스럽게 맞물리고, 추후 유지보수 시 Spring 개발자라면 누구나 익숙하게 접근할 수 있어 선택했습니다.",
    },
    {
      name: "QueryDSL",
      reason:
        "메모 검색 조건이 태그·날짜·키워드 등 다양한 필터의 조합으로 구성되어 JPQL 문자열로 동적 쿼리를 작성하면 타입 안전성이 없고 유지보수가 어렵습니다. QueryDSL은 자바 코드로 타입 세이프하게 동적 쿼리를 작성할 수 있어 복잡한 필터 조합을 안전하게 처리하기 위해 선택했습니다.",
    },
    {
      name: "PostgreSQL (pgvector)",
      reason:
        "RAG 파이프라인에서 임베딩 벡터를 저장하고 유사도 검색을 수행해야 했습니다. 별도의 전용 벡터 DB(Pinecone, Weaviate 등)를 추가하면 인프라 복잡도가 높아지는 반면, pgvector는 기존 RDBMS인 PostgreSQL에 확장으로 추가되어 단일 DB로 관계형 데이터와 벡터 데이터를 함께 관리할 수 있어 선택했습니다.",
    },
    {
      name: "Redis",
      reason:
        "RefreshToken 저장과 캐싱 목적으로 도입했습니다. Redis는 인메모리 DB라 조회 속도가 빠르고, TTL 설정으로 RefreshToken 만료를 자동으로 처리할 수 있습니다. RDB에 토큰을 저장하면 인증 요청마다 디스크 I/O가 발생하는 반면, Redis는 이를 메모리에서 즉시 처리할 수 있어 선택했습니다.",
    },
    {
      name: "AWS S3",
      reason:
        "메모에 첨부되는 이미지와 파일을 서버 로컬에 저장하면 EC2 재배포 시 파일이 사라지는 문제가 있습니다. S3는 내구성 99.999999999%의 객체 스토리지로, 서버와 독립적으로 파일을 영구 보관할 수 있어 선택했습니다.",
    },
    {
      name: "GitHub Actions",
      reason:
        "별도의 CI/CD 서버(Jenkins 등) 없이 GitHub 저장소와 통합하여 PR 머지 시 자동으로 빌드·테스트·배포까지 이어지는 파이프라인을 구성할 수 있어 선택했습니다. Jib으로 Docker 데몬 없이 Java 이미지를 직접 ECR에 푸시하고, EC2에 SSH 접속해 컨테이너를 교체하는 무중단 배포 흐름을 구성했습니다.",
    },
    {
      name: "GCP",
      reason:
        "모니터링 서버를 애플리케이션이 돌아가는 EC2와 같은 인스턴스에 두면, EC2 자체에 장애가 생겼을 때 모니터링 시스템도 함께 죽어버려 정작 장애 상황을 확인할 수 없게 됩니다. 그래서 Prometheus + Grafana 모니터링 서버를 GCP에 별도로 분리 구성해, EC2 장애와 무관하게 항상 서버 상태를 관측할 수 있도록 했습니다.",
    },
  ],
  NUNCHI: [
    {
      name: "FastAPI",
      reason:
        "LangGraph 에이전트가 비동기(async/await) 기반으로 동작하기 때문에, 동일하게 asyncio 기반의 비동기 프레임워크가 필요했습니다. Django는 동기 중심이라 부적합하고, FastAPI는 asyncio 네이티브 지원과 Pydantic 기반 자동 스키마 검증·문서화까지 제공하여 선택했습니다.",
    },
    {
      name: "LangGraph",
      reason:
        "주문 흐름이 메뉴탐색 → 옵션선택 → 장바구니 → 결제처럼 상태를 가지는 다단계 워크플로우였습니다. 단순 LangChain 체인으로는 분기 처리와 상태 유지가 어렵고, LangGraph는 상태 기반 그래프 구조로 각 단계를 노드로 정의하고 조건 분기를 명시적으로 표현할 수 있어 선택했습니다.",
    },
    {
      name: "FastMCP",
      reason:
        "키오스크 도메인 전용 Tool(메뉴 조회, 장바구니 추가 등)을 LLM에게 제공해야 했습니다. FastMCP는 Python 함수에 데코레이터만 붙이면 MCP 서버로 노출되어, 별도 스키마 정의 없이 LangGraph 에이전트가 바로 인식할 수 있어 선택했습니다.",
    },
    {
      name: "Spring Boot",
      reason:
        "메뉴·주문·결제 등 키오스크의 비즈니스 로직은 트랜잭션 처리와 관계형 데이터 관리가 중요합니다. Spring Boot + JPA 조합이 이 요구사항에 가장 적합하고, AI 서버(Python/FastAPI)와 역할을 명확히 분리하여 각 서버가 자신의 책임에만 집중하도록 설계했습니다.",
    },
    {
      name: "PostgreSQL",
      reason:
        "메뉴·옵션 데이터가 계층 구조(카테고리 → 메뉴 → 옵션 그룹 → 옵션)를 가지므로 관계형 DB가 적합했습니다. MySQL 대신 PostgreSQL을 선택한 이유는, 계층형 관계 데이터(카테고리 → 메뉴 → 옵션)에 강한 표준 SQL·제약조건 지원과, 추후 영양정보·통계성 데이터 확장 시 윈도우 함수·CTE 등 PostgreSQL의 풍부한 쿼리 기능을 활용할 수 있다는 점이었습니다.",
    },
    {
      name: "Redis",
      reason:
        "AI 서버와 Spring 서버 간 공유 세션 상태(장바구니 lock 등)를 저장하기 위해 사용했습니다. 두 서버가 분리된 프로세스로 동작하므로 인메모리 공유 저장소가 필요했고, Redis의 원자적 연산(SETNX)으로 장바구니 동시 접근 충돌을 방지했습니다.",
    },
    {
      name: "Docker",
      reason:
        "AI 서버(Python)와 백엔드 서버(Java)가 언어·런타임이 달라 로컬 환경에 따라 실행 환경이 달라질 수 있습니다. Docker 컨테이너화로 \"내 로컬에서는 됐는데 서버에선 안 된다\"는 문제를 원천 차단하고, docker-compose로 두 서버를 동시에 관리할 수 있어 선택했습니다.",
    },
    {
      name: "Nginx",
      reason:
        "AI 서버(8000포트)와 Spring 서버(8080포트)를 단일 도메인으로 서빙하기 위한 리버스 프록시로 사용했습니다. 경로 기반 라우팅(/ai → FastAPI, /api → Spring)으로 클라이언트가 서버 분리 구조를 인식할 필요 없이 단일 엔드포인트로 접근할 수 있도록 하고, SSL 종단 처리도 Nginx에서 일괄 담당합니다.",
    },
    {
      name: "AWS EC2",
      reason:
        "AI 서버와 백엔드 서버를 단일 인스턴스에서 docker-compose로 함께 운영하여 서버 간 통신 지연을 최소화했습니다. 캡스톤 프로젝트 특성상 비용 효율이 중요했고, EC2 단일 인스턴스가 가장 합리적인 선택이었습니다.",
    },
  ],
};

// ── 기타 프로젝트 타입 ──
type OtherProject = {
  name: string;
  emoji: string;
  period: string;
  description: string;
  stack: string;
  links: { label: string; href: string }[];
};

// ── 기타 프로젝트 데이터 ──
const OTHER_PROJECTS: OtherProject[] = [
  {
    name: "BeBee",
    emoji: "🐝",
    period: "2025.03 ~ 2025.05",
    description: "데스크탑 전용 To-Do 웹 서비스",
    stack: "Python · Django · SQLite3",
    links: [{ label: "GitHub", href: "https://github.com/hyodongg/2025-simba-6-BeBee" }],
  },
  {
    name: "OneQ",
    emoji: "🖨",
    period: "2025.08",
    description: "AI 자연어 기반 인쇄 견적 챗봇 서비스",
    stack: "Python · Django · DRF · OpenAI API · JWT · SQLite3",
    links: [{ label: "GitHub", href: "https://github.com/hyodongg/2025-hackaton-1-OneQ-backend" }],
  },
  {
    name: "Order-Free",
    emoji: "🍽",
    period: "2025.04 ~ 2025.10",
    description: "QR 기반 식당 테이블 오더 서비스",
    stack: "Java · Spring Boot · JPA · MySQL (AWS RDS) · Flyway · SSE · AWS EC2 · GitHub Actions",
    links: [{ label: "GitHub", href: "https://github.com/hyodongg/Order-Free-Backend" }],
  },
  {
    name: "Altong",
    emoji: "💪",
    period: "2025.10 ~ 2025.11",
    description: "AI 기반 알바 통합 플랫폼",
    stack: "Java · Spring Boot · JPA · PostgreSQL (AWS RDS) · AWS EC2 · GitHub Actions",
    links: [
      { label: "Backend GitHub", href: "https://github.com/Line4thon-Altong/Altong-BE" },
      { label: "AI Server GitHub", href: "https://github.com/Line4thon-Altong/Altong-AI" },
    ],
  },
];

// ── 섹션 정의 ──
const SECTIONS = [
  { key: "situation", label: "🔴 문제 상황", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  { key: "cause",     label: "🟡 원인 분석", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  { key: "solution",  label: "🟢 해결 방법", color: "#059669", bg: "#f0fdf4", border: "#a7f3d0" },
  { key: "learned",   label: "🔵 배운 점",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
] as const;

// ── 트러블슈팅 상세 모달 ──
function TroubleModal({
  projectName,
  item,
  onClose,
}: {
  projectName: string;
  item: TroubleItem;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px",
          width: "100%", maxWidth: "720px",
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "6px" }}>
              {projectName} · Trouble Shooting
            </p>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6", border: "none", borderRadius: "8px",
              width: "32px", height: "32px", fontSize: "16px", cursor: "pointer",
              color: "#6b7280", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {SECTIONS.map((sec) => (
            <div
              key={sec.key}
              style={{
                background: sec.bg,
                border: `1px solid ${sec.border}`,
                borderRadius: "12px",
                padding: "20px 24px",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 700, color: sec.color, marginBottom: "10px" }}>
                {sec.label}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {item[sec.key].map((line, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, display: "flex", gap: "8px" }}>
                    <span style={{ color: sec.color, flexShrink: 0 }}>·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 스택 이유 모달 ──
function StackReasonModal({
  projectName,
  stacks,
  onClose,
}: {
  projectName: string;
  stacks: StackReason[];
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px",
          width: "100%", maxWidth: "680px",
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* 헤더 */}
        <div style={{
          padding: "28px 32px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px",
        }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "6px" }}>
              {projectName} · Tech Stack
            </p>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>
              사용 스택과 선택 이유
            </h2>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
              단순히 익숙해서가 아닌, 이유 있는 기술 선택을 지향합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6", border: "none", borderRadius: "8px",
              width: "32px", height: "32px", fontSize: "16px", cursor: "pointer",
              color: "#6b7280", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* 스택 목록 */}
        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {stacks.map((stack, i) => (
            <div
              key={stack.name}
              style={{
                display: "flex", gap: "16px", alignItems: "flex-start",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px 20px",
              }}
            >
              {/* 번호 */}
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: "#3b82f6", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "1px",
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
                  {stack.name}
                </p>
                <p style={{ fontSize: "13px", color: "#4b5563", lineHeight: 1.8 }}>
                  {stack.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 트러블슈팅 행 (클릭 가능) ──
function TroubleRow({
  item,
  projectName,
}: {
  item: TroubleItem;
  projectName: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          background: hovered ? "#e5e7eb" : "transparent",
          transition: "background 0.15s",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>📄</span>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{item.title}</p>
        </div>
        <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0 }}>클릭해서 보기 →</span>
      </div>

      {open && (
        <TroubleModal
          projectName={projectName}
          item={item}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── 스택 이유 버튼 ──
function StackReasonButton({ projectKey, projectName }: { projectKey: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const stacks = STACK_REASONS[projectKey] ?? [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          fontSize: "11px", fontWeight: 600,
          color: hovered ? "#fff" : "#3b82f6",
          background: hovered ? "#3b82f6" : "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "6px",
          padding: "4px 10px",
          cursor: "pointer",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        💡 사용 스택 & 이유
      </button>

      {open && (
        <StackReasonModal
          projectName={projectName}
          stacks={stacks}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── 사이드바 ── */}
      <aside style={{
        width: "220px", minHeight: "100vh", background: "#111827", color: "#fff",
        position: "fixed", top: 0, left: 0, bottom: 0,
        padding: "40px 28px", display: "flex", flexDirection: "column", zIndex: 100,
      }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "20px", fontWeight: 700 }}>조효동</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Backend Developer</p>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} style={{ color: "#d1d5db", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#d1d5db")}>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: "auto", fontSize: "11px", color: "#6b7280" }}>© 2026 조효동</div>
      </aside>

      {/* ── 모바일 헤더 ── */}
      <div style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, background: "#111827", color: "#fff", padding: "16px 20px", zIndex: 200, justifyContent: "space-between", alignItems: "center" }} className="mobile-header">
        <span style={{ fontWeight: 700 }}>조효동</span>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>☰</button>
      </div>

      {/* ── 메인 ── */}
      <main style={{ marginLeft: "220px", flex: 1 }} className="main-content">

        {/* ────── HERO ────── */}
        <section id="home" style={{ minHeight: "100vh", background: "#111827", color: "#fff", display: "flex", alignItems: "center", padding: "60px 60px" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1.4, marginBottom: "24px" }}>
              안녕하세요,<br />
              저는 <span style={{ color: "#60a5fa" }}>백엔드 개발자</span>를<br />
              꿈꾸고 있는 <span style={{ color: "#fff" }}>조효동</span>입니다.
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 2 }}>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>끊임없이</span> 배우고 성장하는 것을 즐깁니다.<br />
              오늘도 더 나은 백엔드 개발자가 되기 위해 배움을 이어가고 있습니다.
            </p>
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <a href="#projects" style={{ background: "#3b82f6", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
                Projects →
              </a>
              <a href="https://github.com/hyodongg" target="_blank" style={{ border: "1px solid #374151", color: "#d1d5db", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* ────── ABOUT ────── */}
        <section id="about" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>About Me</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />

          <div style={{ display: "flex", gap: "48px", marginBottom: "40px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>GitHub</p>
              <a href="https://github.com/hyodongg" target="_blank" style={{ color: "#3b82f6", fontSize: "14px" }}>github.com/hyodongg</a>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Email</p>
              <a href="mailto:whgyehdjhd@naver.com" style={{ color: "#3b82f6", fontSize: "14px" }}>whgyehdjhd@naver.com</a>
            </div>
          </div>

          <p style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "32px" }}>
            안녕하세요, 백엔드 개발자 조효동입니다.
          </p>

          <div style={{ marginBottom: "28px" }}>
            <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
              자신에 몰입하고, 배움을 공유하며, 함께 성장하는 것을 좋아합니다.
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.9 }}>
              개인 블로그를 운영하며 컴퓨터과학 기초 지식을 스스로 정리하고 공유하고 있습니다.
              프로젝트 진행 시에는 노션을 통해 새로 알게 된 기술들을 팀원과 공유하고,
              트러블슈팅 과정을 함께 기록하며 서로의 생각을 나누는 것을 즐깁니다.
              <br />
              현재까지 <strong>노션에 30+개의 문서</strong>로 개발 지식과 트러블슈팅을 작성해두었으며,
              이를 블로그로 옮기는 과정 중에 있습니다.
            </p>
          </div>

          <div>
            <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
              이유있는 개발을 지향합니다.
            </p>
            <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.9 }}>
              기술을 선택할 때 항상 <strong>"왜 이 기술인가"</strong>를 먼저 고민합니다.
              단순히 데이터베이스 하나를 선택할 때에도 RDBMS와 NoSQL의 차이는 무엇인지,
              각각의 장단점은 무엇인지, 현재 서비스에 어떤 선택이 적합한지를 따져보고 결정합니다.
              <br />
              동작하는 코드보다 <strong>설명할 수 있는 코드</strong>를 지향합니다.
            </p>
          </div>
        </section>

        {/* ────── SKILLS ────── */}
        <section id="skills" style={{ padding: "80px 60px", background: "#f9fafb" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Skills</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />

          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: 1.9, marginBottom: "48px" }}>
            동국대학교 멋쟁이사자처럼을 시작으로 <strong>Python, Django</strong>를 활용해 개발에 처음 입문했습니다.<br />
            이후 Spring 프레임워크에 관심이 생겨 <strong>Java와 Spring Boot</strong>를 온라인 강의로 독학했고,
            SOPT 연합동아리를 통해 실전 경험을 쌓으며 이해를 높였습니다.<br />
            현재는 AI의 발전에 따라 <strong>Spring 기반 백엔드 서버에 AI 서비스를 결합한 개발</strong>을 해오고 있으며,
            RAG, LangGraph, MCP 등 AI 기술을 백엔드와 연계하는 방법에 관심이 많습니다.
          </p>

          {[
            {
              category: "Language",
              skills: [
                {
                  name: "Python",
                  comment: "개발 입문 언어. FastAPI, Django 및 AI 라이브러리 활용",
                  bullets: [
                    "Django ORM과 FastAPI의 비동기 처리 방식 차이를 이해하고 활용합니다.",
                    "AI 라이브러리(LangChain, OpenAI SDK 등)와 연동한 서버 구축 경험이 있습니다.",
                  ],
                },
                {
                  name: "Java",
                  comment: "Spring Boot 기반 서버 개발 주력 언어 / 객체지향 설계 및 이해",
                  bullets: [
                    "Checked/Unchecked Exception 차이를 이해하고 꼼꼼한 예외 처리를 고민하고 설계할 수 있습니다.",
                    "JVM 메모리 구조를 이해하며 JVM만의 차이를 압니다.",
                    "GC 동작 방식을 이해하고 있습니다.",
                    "인터페이스와 추상클래스의 차이를 이해하고 적절히 활용합니다.",
                    "객체지향 4대 원칙과 SOLID 원칙을 이해하고 코드 설계에 적용합니다.",
                    "제네릭, 스트림, 람다 등 Java 문법을 활용한 개발 경험이 있습니다.",
                  ],
                },
              ],
            },
            {
              category: "Framework",
              skills: [
                {
                  name: "Spring Boot",
                  comment: "JPA, DI 등 Spring 프레임워크에 대한 이해 및 경험",
                  bullets: [
                    "POJO 기반 설계와 스프링 컨테이너 동작 원리, Bean 등록 방식과 DI를 이해하고 활용합니다.",
                    "DTO/VO/Entity를 구분하여 레이어드 아키텍처 기반 설계 경험이 있습니다.",
                    "SOLID 원칙을 적용한 객체지향적 코드 설계를 지향합니다.",
                    "Spring Security + JWT 기반 인증/인가 및 OAuth2.0 소셜 로그인 연동 경험이 있습니다.",
                    "JPA 엔티티 설계, 연관관계 매핑, N+1 해결(fetch join / batch size) 경험이 있습니다.",
                    "QueryDSL을 활용한 동적 쿼리 작성 경험이 있습니다.",
                    "@ControllerAdvice를 활용한 글로벌 예외 처리 설계 경험이 있습니다.",
                    "JUnit5, Mockito를 활용한 단위 테스트 및 통합 테스트 작성 경험이 있습니다.",
                  ],
                },
                {
                  name: "FastAPI",
                  comment: "Python 생태계(LangChain, RAG 등)와 연동한 AI 백엔드 서버 구축 경험",
                  bullets: [
                    "asyncio 기반 이벤트 루프 동작 방식을 이해합니다.",
                    "LangChain / LangGraph와 연동한 AI 추론 엔드포인트 설계 경험이 있습니다.",
                    "Pydantic을 활용한 요청/응답 스키마 정의 및 자동 문서화 경험이 있습니다.",
                    "비동기(async/await) 기반 AI 추론 서버 구축 경험이 있습니다.",
                  ],
                },
              ],
            },
            {
              category: "Database",
              skills: [
                {
                  name: "MySQL",
                  comment: "스키마 설계 / 인덱스 최적화 및 쿼리 튜닝 경험",
                  bullets: [
                    "트랜잭션 격리 수준의 차이를 이해하고 있습니다.",
                    "낙관적 락 / 비관적 락 차이를 이해하고 동시성 제어에 적용합니다.",
                    "정규화 기반의 스키마 설계 경험이 있습니다.",
                    "인덱스 설계를 통한 쿼리 성능 최적화 경험이 있습니다.",
                    "실행 계획(EXPLAIN)을 활용한 쿼리 튜닝 경험이 있습니다.",
                  ],
                },
                {
                  name: "PostgreSQL",
                  comment: "AI 프로젝트에서 주로 활용 / 벡터 DB 활용",
                  bullets: [
                    "JSONB 타입을 활용한 반정형 데이터 저장 경험이 있습니다.",
                    "pgvector를 활용한 벡터 유사도 검색 구현 경험이 있습니다.",
                    "RAG 파이프라인에서 임베딩 저장소로 활용한 경험이 있습니다.",
                  ],
                },
              ],
            },
            {
              category: "Infra / DevOps",
              skills: [
                {
                  name: "AWS",
                  comment: "EC2, RDS, S3 등 활용한 전반적인 서비스 배포 경험",
                  bullets: [
                    "VPC, 서브넷, 라우팅 테이블을 설정한 네트워크 구성을 할 수 있습니다.",
                    "ECR을 활용한 Docker 이미지 관리 및 배포 경험이 있습니다.",
                    "S3를 활용한 정적 파일 저장 및 관리가 가능합니다.",
                    "ACM & ALB를 이용한 트래픽 분산 및 HTTPS 설정 경험이 있습니다.",
                  ],
                },
                {
                  name: "Docker",
                  comment: "컨테이너화를 통한 환경 일관성 확보 및 서비스 배포 자동화 경험",
                  bullets: [
                    "멀티 스테이지 빌드를 활용한 이미지 경량화 경험이 있습니다.",
                    "Docker Compose를 활용한 멀티 컨테이너 환경 구성 경험이 있습니다.",
                  ],
                },
                {
                  name: "GitHub Actions",
                  comment: "CI/CD 파이프라인 구성 / PR 자동 빌드 및 배포 경험",
                  bullets: [
                    "Docker 이미지 빌드 및 ECR 푸시 자동화 경험이 있습니다.",
                    "단일 EC2 환경에서 컨테이너 교체 기반 Blue-Green 무중단 배포 및 헬스체크 실패 시 자동 롤백 구조를 구현한 경험이 있습니다.",
                    "무중단 배포 방식의 차이와 장단점에 대해 이해하고 있습니다.",
                    "배포 결과 자동 알림(Discord)로 팀과 공유합니다.",
                  ],
                },
              ],
            },
            {
              category: "Collaboration",
              skills: [
                {
                  name: "Git",
                  comment: "코드리뷰 기반 협업 및 전반적인 Git Flow 이해",
                  bullets: [
                    "Squash merge, Rebase 등 다양한 머지 전략의 차이를 인지하고 있습니다.",
                    "코드 리뷰 기반 협업 경험이 있습니다.",
                    "프로젝트 시작 전, 그라운드 룰 세팅을 통해 팀 내 컨벤션을 지킵니다.",
                  ],
                },
              ],
            },
            {
              category: "AI",
              skills: [
                {
                  name: "RAG",
                  comment: "문서 기반 검색 증강 생성 파이프라인 구축 경험",
                  bullets: [
                    "문서 청킹, 임베딩, 벡터 검색 파이프라인을 직접 구축한 경험이 있습니다.",
                    "청킹 전략(고정 크기, 문장 단위, 재귀적 분할)을 비교하고 적용한 경험이 있습니다.",
                    "특히 ETL 파이프라인에서 유사도 검색을 최적화하기 위해 노력했습니다.",
                    "검색 품질 향상을 위한 프롬프트 엔지니어링 경험이 있습니다.",
                  ],
                },
                {
                  name: "LangGraph",
                  comment: "상태 기반 AI 워크플로우 설계 및 구현",
                  bullets: [
                    "상태 기반 워크플로우(State Graph)를 설계하고 구현한 경험이 있습니다.",
                    "조건 분기 노드를 활용한 AI 에이전트 흐름 제어 경험이 있습니다.",
                  ],
                },
                {
                  name: "MCP",
                  comment: "백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 및 Smithery AI 배포 경험",
                  bullets: [
                    "백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 경험이 있습니다.",
                    "Tool 정의 및 스키마 설계를 통한 AI 모델과의 인터페이스 구현 경험이 있습니다.",
                    "Smithery AI를 통한 MCP 서버 배포 경험이 있습니다.",
                  ],
                },
              ],
            },
          ].map((group) => (
            <div key={group.category} style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "14px" }}>
                {group.category}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "12px" }}>
                {group.skills.map((skill) => (
                  <div key={skill.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 20px" }}>
                    <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{skill.name}</p>
                    <p style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "10px", lineHeight: 1.5 }}>{skill.comment}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                      {skill.bullets.map((b, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.7, display: "flex", gap: "6px" }}>
                          <span style={{ color: "#3b82f6", flexShrink: 0, marginTop: "1px" }}>·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ────── PROJECTS ────── */}
        <section id="projects" style={{ padding: "80px 60px", background: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Projects</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* ── CLUSTAR ── */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>CLUSTAR</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: "20px" }}>SOPT</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.01 ~ 진행중</span>
              </div>

              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>
                흩어진 메모를 빛나는 결과물로 — Spring AI + RAG 기반 AI 메모 정리 및 구조화 서비스
              </p>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/TEAM-CLUSTAR/CLUSTAR-SERVER" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>GitHub →</a>
              </div>

              <p style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6", marginBottom: "10px" }}>내가 기여한 일</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  {
                    category: "AI 핵심 기능 (RAG)",
                    items: [
                      "Spring AI + RAG 기반 AI 메모 생성 시스템 설계 및 구현",
                      "검색 품질 향상을 위한, 문서 청킹 · 임베딩 · 벡터 검색으로 이어지는 ETL 파이프라인 설계 및 최적화",
                      "AI 채팅 호출 실패 시 최대 3회 자동 재시도, 모두 실패하면 실패 기록을 남겨 장애 대응 체계 구축",
                      "Resilience4j와 직접 구현 방식의 장단점을 비교 분석 후 retry 방식으로 결정",
                      "시스템 프롬프트 반복 고도화로 생성 품질 개선",
                    ],
                  },
                  {
                    category: "테스트 & 안정성",
                    items: [
                      "Repository · Service · Controller 계층별 단위 테스트 작성",
                      "nGrinder 성능 테스트를 위한 전용 프로파일 구성 — 로깅 등 운영 오버헤드를 줄이고 Prometheus로 응답시간·에러율 측정",
                      "메모 삭제 시 DB-S3 간 데이터 불일치 문제를 이벤트 기반 처리로 해결",
                    ],
                  },
                  {
                    category: "CI/CD",
                    items: [
                      "GitHub Actions 기반 CI/CD 파이프라인 구축",
                      "PR merge → Jib기반 이미지 빌드 & ECR 푸시 → EC2 SSH 접속 → Blue-Green 컨테이너 교체 → 헬스체크 통과 시 트래픽 전환 / 실패 시 자동 롤백",
                    ],
                  },
                  {
                    category: "파일 · 이미지 처리",
                    items: [
                      "첨부가 무제한이면 스토리지 비용을 예측하기 어려워질 수 있다는 생각에 파일·이미지 용량 및 개수 제한 로직 구현",
                      "Apache Tika 파싱 실패(손상·암호화 파일 등) 시 해당 파일만 건너뛰도록 예외처리해 임베딩 파이프라인 안정성 확보",
                      "File · Image · Text Document 간 메타데이터 키 구조 통일로 RAG 파이프라인 일관성 확보",
                    ],
                  },
                  {
                    category: "메모 관련 API",
                    items: [
                      "RESTful한 메모 CRUD API 구현",
                      "RESTful한 AI 메모 생성, 조회 API 구현",
                      "메모 가공용 유틸(마크다운 문법 제거 등) 개발로 정리된 메모의 가독성과 일관성 개선",
                    ],
                  },
                ].map((group) => (
                  <div key={group.category}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{group.category}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#4b5563", fontSize: "13px", lineHeight: 1.9 }}>
                      {group.items.map((item) => (
                        <li key={item} style={{ paddingLeft: "12px" }}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* ── 트러블슈팅 (클릭형) ── */}
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#f60101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Trouble Shooting
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {TROUBLES.CLUSTAR.map((t) => (
                    <TroubleRow key={t.title} item={t} projectName="CLUSTAR" />
                  ))}
                </div>
              </div>

              {/* ── 스택 + 이유 버튼 ── */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  Spring Boot · Spring AI · QueryDSL · PostgreSQL (pgvector) · Redis · AWS S3 · GitHub Actions · GCP
                </p>
                <StackReasonButton projectKey="CLUSTAR" projectName="CLUSTAR" />
              </div>
            </div>

            {/* ── NUNCHI ── */}
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "32px", background: "#fafafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>NUNCHI</h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: "20px" }}>캡스톤디자인</span>
                </div>
                <span style={{ fontSize: "12px", color: "#9ca3af", flexShrink: 0, marginLeft: "16px", paddingTop: "3px" }}>2026.03 ~ 2026.06</span>
              </div>

              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px", marginTop: "6px" }}>
                말 한마디로 주문 완료 — MCP 기반 LLM Agentic AI 음성 배리어프리 자율주문 키오스크
              </p>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <a href="https://github.com/CapstoneDgu/NUNCHI-AI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>AI Server GitHub →</a>
                <a href="https://github.com/CapstoneDgu/NUNCHI" target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>Backend GitHub →</a>
              </div>

              <p style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6", marginBottom: "10px" }}>내가 기여한 일</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  {
                    category: "인프라",
                    items: [
                      "Docker - FastAPI AI 서버 · MCP 서버 · Spring 서버를 별도 컨테이너로 분리해 멀티 서비스 구성",
                    ],
                  },
                  {
                    category: "AI 응답 품질 & 안정성",
                    items: [
                      "장바구니 담기 락 충돌 발생 시 짧은 대기 후 자동 재시도 로직 구현으로 동시 요청 안정성 확보",
                      "LLM이 실제로 담기지 않은 메뉴를 담았다고 보고하는 환각을 코드 레벨에서 검증·교정하는 가드 구현 — Tool 호출 결과와 최종 응답을 대조해 불일치 시 정정",
                      "의도 분류기 개선 — 직전 AI 메시지 맥락을 분류 입력에 함께 전달해 \"네\", \"응\" 같은 짧은 응답의 오분류율 감소",
                      "메뉴·가격 환각 방지 — LLM 응답을 Spring API 조회 결과로만 생성하도록 프롬프트·Tool 흐름 강제",
                      "응답 latency 3초 이내 목표로 불필요한 Tool 호출 제거 및 처리 단계별 타이밍 로깅 추가",
                    ],
                  },
                  {
                    category: "AI 에이전트 아키텍처 설계 (Python · FastAPI)",
                    items: [
                      "FastAPI 기반 AI 서버 전체 설계 및 구현",
                      "LangGraph 상태 기반 주문 에이전트 설계 — 대화 맥락을 유지하는 상태 전이 구조",
                      "LLM 팩토리 설계로 OpenAI/Gemini 멀티 LLM 공급자 전환 지원",
                      "일반 모드/아바타 모드별 행동 지침 블록을 분리해 동일 에이전트가 두 가지 UX(터치 보조 / 음성 대화 주도)를 모두 처리하도록 프롬프트 구조 리팩토링",
                    ],
                  },
                  {
                    category: "MCP 기반 시스템 제어",
                    items: [
                      "FastMCP로 키오스크 도메인 전용 MCP 서버 구현",
                      "LangChain MCP 어댑터로 LangGraph 에이전트에 바인딩",
                      "AI가 메뉴 조회, 장바구니 조작, 주문 확정, 결제처리까지 직접 수행하는 구조 설계",
                    ],
                  },
                  {
                    category: "백엔드 서버 (Java · Spring Boot)",
                    items: [
                      "키오스크 기능에 필요한 API 개발",
                      "JPA Specification을 이용한 동적 필터링 구현 — QueryDSL 의존성 추가 없이 다중 선택 조건을 조합 처리",
                    ],
                  },
                ].map((group) => (
                  <div key={group.category}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{group.category}</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#4b5563", fontSize: "13px", lineHeight: 1.9 }}>
                      {group.items.map((item) => (
                        <li key={item} style={{ paddingLeft: "12px" }}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* ── 트러블슈팅 (클릭형) ── */}
              <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", marginTop: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#f60101", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Trouble Shooting
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {TROUBLES.NUNCHI.map((t) => (
                    <TroubleRow key={t.title} item={t} projectName="NUNCHI" />
                  ))}
                </div>
              </div>

              {/* ── 스택 + 이유 버튼 ── */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  FastAPI · LangGraph · FastMCP · Spring Boot · PostgreSQL · Redis · Docker · Nginx · AWS EC2
                </p>
                <StackReasonButton projectKey="NUNCHI" projectName="NUNCHI" />
              </div>
            </div>

          </div>

          {/* ────── 기타 프로젝트 ────── */}
          <div style={{ marginTop: "48px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "16px" }}>
              Other Projects
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              {OTHER_PROJECTS.map((p) => (
                <div key={p.name} style={{ display: "flex", flexDirection: "column", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 22px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>{p.emoji} {p.name}</h4>
                    <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, paddingTop: "2px" }}>{p.period}</span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.6, margin: "8px 0 10px" }}>{p.description}</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0 12px", lineHeight: 1.6 }}>{p.stack}</p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>
                        {l.label} →
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────── EXPERIENCES ────── */}
        <section id="experiences" style={{ padding: "80px 60px", background: "#f9fafb" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Experiences</h2>
          <div style={{ width: "40px", height: "3px", background: "#3b82f6", marginBottom: "32px" }} />

          {[
            {
              category: "동아리",
              color: "#3b82f6",
              items: [
                { title: "멋쟁이사자처럼 at 동국대학교 13기 백엔드 파트원", period: "2025.03 - 2025.12", desc: "개발을 처음 입문하여 Django 프레임워크 기반 웹 개발을 학습했습니다." },
                { title: "SOPT 37기 서버 파트원", period: "2025.09 - 2026.02", desc: "Spring Boot 기반 서버 개발 및 타 직군과의 합숙을 통한 협업 경험을 했습니다." },
              ],
            },
            {
              category: "봉사활동",
              color: "#06b6d4",
              items: [
                { title: "라오스 해외 봉사활동", period: "2024.12.20 - 2025.02.09", desc: "라오스 현지에서 13박 14일 간 아동 교육 및 시설 지원 봉사활동을 진행했습니다." },
              ],
            },
            {
              category: "학생회",
              color: "#8b5cf6",
              items: [
                { title: "정보통신공학과 학생회 활동", period: "2021.03 - 2025.12", desc: "학과 행사 기획 및 운영에 참여하며 학생 대표로서 소통과 협력 경험을 쌓았습니다." },
                { title: "정보통신공학과 학생회장", period: "2025.01 - 2025.12", desc: "정보통신공학과 학생회를 총괄하며 대내외 행사 기획 및 학과 운영을 주도했습니다." },
              ],
            },
            {
              category: "스터디",
              color: "#10b981",
              items: [
                { title: "멋쟁이사자처럼 13기 Spring Boot 스터디장", period: "", desc: "온라인 강의를 선정하고 내용을 공유하며 팀원들의 Spring Boot 학습을 이끌었습니다." },
                { title: "SOPT 도커 스터디", period: "", desc: "Docker 개념부터 실습까지 스터디에 참여하며 컨테이너 기반 개발 환경을 학습했습니다." },
              ],
            },
            {
              category: "수상",
              color: "#f59e0b",
              items: [
                { title: "정보통신공학과 아이디어 경진대회 장려상", period: "2024.12.26", desc: "아이디어 기획부터 발표까지 전 과정에 참여하여 장려상을 수상했습니다." },
                { title: "멋쟁이사자처럼 13기 심바톤 우수상", period: "2025.06.25", desc: "단기 해커톤에서 백엔드 개발을 담당하여 우수상을 수상했습니다." },
                { title: "SOPT AppJam 대상", period: "2026.01.24", desc: "SOPT 해커톤에서 서버 개발을 담당하여 전체 대상을 수상했습니다." },
              ],
            },
            {
              category: "자격증",
              color: "#ef4444",
              items: [
                { title: "Microsoft Certified: Azure Fundamentals", period: "2024.09.11", desc: "" },
                { title: "SQLD", period: "2024.09.20", desc: "" },
                { title: "리눅스마스터 2급", period: "2024.10.04", desc: "" },
                { title: "AWS Certified Cloud Practitioner", period: "2025.11.06", desc: "" },
                { title: "정보처리기사", period: "2026.06.12", desc: "" },
              ],
            },
          ].map((group) => (
            <div key={group.category} style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: group.color, textTransform: "uppercase", marginBottom: "12px" }}>
                {group.category}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {group.items.map((item) => (
                  <div key={item.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <h3 style={{ fontWeight: 600, fontSize: "14px", color: "#111827", margin: 0, lineHeight: 1.5, flex: 1 }}>
                        {item.title}
                      </h3>
                      {item.period && (
                        <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "1px" }}>
                          {item.period}
                        </span>
                      )}
                    </div>
                    {item.desc && (
                      <p style={{ color: "#9ca3af", fontSize: "11px", lineHeight: 1.7, marginTop: "6px", marginBottom: 0 }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

      </main>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        p, h1, h2, h3, ul { margin: 0; padding: 0; }
        @media (max-width: 768px) {
          aside { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 56px; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          h1 { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}