import type { PortfolioData } from "./types";

export const DEFAULT_DATA: PortfolioData = {
  profile: {
    name: "조효동",
    title: "Backend Developer",
    footerYear: "2026",
    githubUrl: "https://github.com/hyodongg",
    blogUrl: "https://velog.io/@hyodongg/posts",
    notionUrl: "https://app.notion.com/p/Who-is-26a0011f8b8a804eaa02d3df1d2fd2a1",
    notionLabel: "Who is 조효동?",
    email: "whgyehdjhd@naver.com",
  },
  hero: {
    roleTitle: "백엔드 개발자",
    description: "**끊임없이** 배우고 성장하는 것을 즐깁니다.\n오늘도 더 나은 백엔드 개발자가 되기 위해 배움을 이어가고 있습니다.",
  },
  about: {
    blocks: [
      {
        heading: "자신에 몰입하고, 배움을 공유하며, 함께 성장하는 것을 좋아합니다.",
        body: "개인 블로그를 운영하며 컴퓨터과학 기초 지식을 스스로 정리하고 공유하고 있습니다.\n프로젝트 진행 시에는 노션을 통해 새로 알게 된 기술들을 팀원과 공유하고, 트러블슈팅 과정을 함께 기록하며 서로의 생각을 나누는 것을 즐깁니다.\n현재까지 **노션에 30+개의 문서**로 개발 지식과 트러블슈팅을 작성해두었으며, 이를 블로그로 옮기는 과정 중에 있습니다.",
      },
      {
        heading: "이유있는 개발을 지향합니다.",
        body: "기술을 선택할 때 항상 **“왜 이 기술인가”**를 먼저 고민합니다.\n단순히 데이터베이스 하나를 선택할 때에도 RDBMS와 NoSQL의 차이는 무엇인지, 각각의 장단점은 무엇인지, 현재 서비스에 어떤 선택이 적합한지를 따져보고 결정합니다.\n동작하는 코드보다 **설명할 수 있는 코드**를 지향합니다.",
      },
    ],
  },
  projects: {
    CLUSTAR: {
      name: "CLUSTAR",
      badgeLabel: "SOPT",
      badgeColor: "#d97706",
      badgeBg: "#fef3c7",
      period: "2026.01 ~ 진행중",
      tagline: "흩어진 메모를 빛나는 결과물로.\nAI가 메모를 구조화, 요약해주고, 검색과 유사 메모 추천까지 도와주는 Spring AI + RAG 기반 메모 정리 서비스입니다.",
      links: [
        { label: "GitHub", href: "https://github.com/TEAM-CLUSTAR/CLUSTAR-SERVER" },
        { label: "서비스 바로가기", href: "https://www.clustar.cloud/landing" },
      ],
      roleSummary: "Spring AI를 활용해 RAG 검색 파이프라인을 설계하고, 배포·장애 대응·성능 테스트까지 서버 전반을 담당했습니다.",
      roleHighlights: [
        { title: "RAG 검색 파이프라인 직접 구축", desc: "문서 청킹 → 임베딩 → 벡터 검색으로 이어지는 ETL을 설계하고, 청킹 전략을 비교해 문서마다 다르게 적용함으로써 효율적인 임베딩이 이뤄지도록 했습니다. RAG 평가 지표를 통해 응답이 검색 문맥과 얼마나 맞물리는지 검증했습니다." },
        { title: "AI 호출 장애 대응 체계 구축", desc: "AI 채팅 호출 실패 시 재시도 로직을 구현하고, 실패 시 그 이력을 남겨 추후 추적 및 재처리가 가능하게 만들었습니다." },
        { title: "무중단 배포 파이프라인 구성", desc: "GitHub Actions로 PR merge → Jib 이미지 빌드 → ECR 푸시 → EC2 Blue-Green 컨테이너 교체 → 헬스체크 통과 시 트래픽 전환 흐름을 구성했고, 헬스체크 실패 시 자동 롤백되도록 했습니다." },
      ],
      contribGroups: [
        { category: "테스트 & 안정성", items: ["Repository · Service · Controller 계층별 단위 테스트 작성", "nGrinder 전용 프로파일로 부하 테스트 환경을 구성하고, Prometheus로 p95 응답시간·에러율 측정 및 향상", "메모 삭제 시 DB-S3 데이터 불일치를 이벤트 기반 처리로 해결"] },
        { category: "파일 · 이미지 처리", items: ["스토리지 비용을 고려해 파일·이미지 용량 및 개수 제한 로직 구현", "임베딩 실패 시 해당 파일만 건너뛰도록 처리해 임베딩 파이프라인 중단 방지 및 안정성 향상", "File · Image · Text Document 간 메타데이터 및 구조 통일"] },
        { category: "API", items: ["메모 CRUD / AI 메모 생성·조회 RESTful API 구현", "마크다운 문법 제거 등 메모 가공 유틸 개발", "시스템 프롬프트 반복 고도화로 생성 품질 개선"] },
      ],
    },
    NUNCHI: {
      name: "NUNCHI",
      badgeLabel: "캡스톤디자인",
      badgeColor: "#7c3aed",
      badgeBg: "#ede9fe",
      period: "2026.03 ~ 2026.06",
      tagline: "말 한마디로 주문 완료.\nMCP 기반 LLM Agentic AI가 음성 대화만으로 메뉴 선택부터 결제까지 처리하는 배리어프리 자율주문 키오스크 서비스입니다.",
      links: [
        { label: "AI Server GitHub", href: "https://github.com/CapstoneDgu/NUNCHI-AI" },
        { label: "Backend GitHub", href: "https://github.com/CapstoneDgu/NUNCHI" },
      ],
      roleSummary: "LLM이 음성 대화만으로 주문과 결제를 수행하는 AI 에이전트 서버를 설계했습니다. Spring Boot로 키오스크 백엔드를 구축하고, FastAPI 기반 AI 서버에 FastMCP로 키오스크 전용 MCP 서버를 붙여 연결했으며, LangGraph로 대화 맥락을 유지하는 agentic AI 흐름을 설계했습니다.",
      roleHighlights: [
        { title: "LangGraph 기반 주문 에이전트 아키텍처 설계", desc: "FastAPI AI 서버 전체를 설계하고, 대화 맥락을 유지하는 상태 전이 구조로 주문 플로우를 구현했습니다." },
        { title: "LLM 환각 위험 최소화 및 응답 속도 개선", desc: "환각이 생길 수 있는 지점을 코드 레벨에서 차단했습니다. SSE 스트리밍을 도입해 첫 응답 체감 지연이 3.1초였던 것을 0.7초(TTFB 690ms)로 78% 단축했고, 직전 발화 컨텍스트를 주입해 짧은 응답('네/응/아니요')의 의도 오분류율을 65%에서 0%로 개선했습니다." },
        { title: "MCP로 AI가 키오스크를 직접 조작하는 구조 구현", desc: "FastMCP로 키오스크 도메인 전용 MCP 서버를 만들고 LangChain MCP 어댑터로 에이전트에 바인딩해, AI가 메뉴 조회부터 장바구니 조작·주문 확정·결제까지 직접 수행하도록 했습니다." },
      ],
      contribGroups: [
        { category: "응답 품질 & 안정성", items: ["장바구니 락 충돌 시 짧은 대기 후 자동 재시도로 동시 요청 안정성 확보", "의도 분류기에 직전 AI 발화 컨텍스트를 주입해 짧은 응답('네/응/아니요') 의도 오분류 감소", "각 노드에 노드별 권한을 부여해 불필요한 Tool 호출 위험 감소", "SSE 스트리밍 도입으로 AI 첫 응답 체감 속도 개선"] },
        { category: "AI 아키텍처 · 인프라", items: ["일반 모드/아바타 모드 행동 지침 블록을 분리해 하나의 에이전트가 두 UX를 모두 처리하도록 프롬프트 구조 리팩토링", "FastAPI AI 서버 · MCP 서버 · Spring 서버를 별도 컨테이너로 분리"] },
        { category: "백엔드 (Spring Boot)", items: ["키오스크 주문, 결제 등 핵심 기능 API 전반 구현", "Redis 분산락을 도입하여 장바구니 동시성 제어", "JPA Specification 기반 동적 필터링 구현"] },
      ],
    },
  },
  skills: {
    intro: "동국대학교 멋쟁이사자처럼을 시작으로 **Python, Django**를 활용해 개발에 처음 입문했습니다.\n이후 Spring 프레임워크에 관심이 생겨 **Java와 Spring Boot**를 온라인 강의로 독학했고, SOPT 연합동아리를 통해 실전 경험을 쌓으며 이해를 높였습니다.\n현재는 AI의 발전에 따라 **Spring 기반 백엔드 서버에 AI 서비스를 결합한 개발**을 해오고 있으며, RAG, LangGraph, MCP 등 AI 기술을 백엔드와 연계하는 방법에 관심이 많습니다.",
    groups: [
      { category: "Language", skills: [
        { name: "Python", comment: "개발 입문 언어. FastAPI, Django 및 AI 라이브러리 활용", bullets: ["Django·FastAPI의 동기/비동기 처리 차이를 이해하고, LangChain 등 AI 라이브러리를 연동한 서버를 구축한 경험이 있습니다."] },
        { name: "Java", comment: "Spring Boot 기반 서버 개발 주력 언어 / 객체지향 설계 및 이해", bullets: ["예외 처리, JVM 메모리/GC 구조, 객체지향 4대 원칙과 SOLID를 이해하고 제네릭·스트림·람다 등 문법을 활용해 설계합니다."] },
      ]},
      { category: "Framework", skills: [
        { name: "Spring Boot", comment: "JPA, DI 등 Spring 프레임워크에 대한 이해 및 경험", bullets: ["DI 기반 레이어드 아키텍처 설계부터 JPA 성능 최적화(N+1, QueryDSL), 인증/인가, 예외 처리, 테스트까지 실무 전반을 경험했습니다."] },
        { name: "FastAPI", comment: "Python 생태계(LangChain, RAG 등)와 연동한 AI 백엔드 서버 구축 경험", bullets: ["asyncio 기반 비동기 이벤트 루프를 이해하고, LangGraph 연동 AI 추론 서버와 Pydantic 기반 스키마 설계 경험이 있습니다."] },
      ]},
      { category: "Database", skills: [
        { name: "MySQL", comment: "스키마 설계 / 인덱스 최적화 및 쿼리 튜닝 경험", bullets: ["트랜잭션 격리 수준과 락 전략을 이해하고, 정규화·인덱스 설계 및 EXPLAIN 기반 쿼리 튜닝 경험이 있습니다."] },
        { name: "PostgreSQL", comment: "AI 프로젝트에서 주로 활용 / 벡터 DB 활용", bullets: ["JSONB 기반 반정형 데이터 저장과 pgvector를 활용한 벡터 검색으로 RAG 임베딩 저장소를 구축한 경험이 있습니다."] },
      ]},
      { category: "Infra / DevOps", skills: [
        { name: "AWS", comment: "EC2, RDS, S3 등 활용한 전반적인 서비스 배포 경험", bullets: ["VPC 네트워크 구성부터 ECR·S3·ALB를 활용한 서비스 배포까지 AWS 인프라 전반을 다룬 경험이 있습니다."] },
        { name: "Docker", comment: "컨테이너화를 통한 환경 일관성 확보 및 서비스 배포 자동화 경험", bullets: ["멀티 스테이지 빌드로 이미지를 경량화하고, Docker Compose로 멀티 컨테이너 환경을 구성한 경험이 있습니다."] },
        { name: "GitHub Actions", comment: "CI/CD 파이프라인 구성 / PR 자동 빌드 및 배포 경험", bullets: ["Docker 빌드·배포 자동화와 Blue-Green 무중단 배포·롤백, 배포 알림까지 CI/CD 파이프라인을 구축한 경험이 있습니다."] },
      ]},
      { category: "Collaboration", skills: [
        { name: "Git", comment: "코드리뷰 기반 협업 및 전반적인 Git Flow 이해", bullets: ["다양한 머지 전략을 이해하고, 코드 리뷰와 팀 컨벤션 기반의 협업 경험이 있습니다."] },
      ]},
      { category: "AI", skills: [
        { name: "RAG", comment: "문서 기반 검색 증강 생성 파이프라인 구축 경험", bullets: ["문서 청킹부터 임베딩, 벡터 검색까지 RAG 파이프라인을 직접 구축하고 검색 품질을 개선한 경험이 있습니다."] },
        { name: "LangGraph", comment: "상태 기반 AI 워크플로우 설계 및 구현", bullets: ["상태 기반 워크플로우(State Graph)와 조건 분기 노드를 활용해 AI 에이전트 흐름을 설계한 경험이 있습니다."] },
        { name: "MCP", comment: "백엔드 서버와 AI 모델 간 컨텍스트 프로토콜 연동 및 Smithery AI 배포 경험", bullets: ["Tool 스키마를 설계해 백엔드와 AI 모델 간 MCP 연동을 구현하고 Smithery로 배포한 경험이 있습니다."] },
      ]},
    ],
  },
  troubles: {
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
      {
        title: "메모 조회 응답속도를 개선해보자",
        situation: [
          "메모 목록 조회 API(GET /api/v1/memo)를 대상으로 부하테스트 진행",
          "동시 요청이 늘수록 응답속도가 계속 나빠졌고, 20명 기준 p95 54ms, DB CPU 사용률이 순간 300%대까지 올라감",
          "톰캣 스레드풀은 최대 21/200개만 사용해 여유로웠고, 병목은 DB 쪽으로 예상",
        ],
        cause: [
          "pg_stat_activity로 실행 중인 쿼리를 직접 확인해보니, 메모 목록 조회 시 이미지/파일 조회 쿼리(findByMemoIdIn)가 같이 나가고 있었음",
          "코드를 보니 이 쿼리가 이미지/파일의 전체 컬럼(image_bytes, image_name 등)을 페이지 내 모든 메모에 대해 가져오고 있었는데, 실제 응답엔 대표 이미지 1개의 s3Key와 개수만 쓰이고 있었음",
          "흔히 말하는 N+1 문제인 쿼리 개수가 아니라 쿼리 한 번에 딸려오는 데이터량(불필요한 컬럼/행)이 진짜 원인",
        ],
        solution: [
          "QueryDSL로 필요한 데이터만 가져오도록 쿼리 재작성",
          "이미지·파일 전체 엔티티를 가져오던 findByMemoIdIn 호출을 제거하고 위 동적쿼리로 대체",
          "개선 결과 — 20명 동시 요청 기준: 응답속도(p95) 54ms → 26ms(약 52% 개선), 처리량 528건/초 → 997건/초(약 89% 개선)",
          "개선 결과 — 50명 동시 요청 기준: 응답속도(p95) 103ms → 71ms(약 31% 개선), 처리량 682건/초 → 1032건/초(약 51% 개선)",
        ],
        learned: [
          "N+1처럼 쿼리 개수만으로 병목을 판단하면 안 되는 케이스가 있음.",
          "이번 문제는 쿼리 개수는 문제 없고, 쿼리당 불필요한 컬럼과 행이 문제였음",
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
  },
  stackReasons: {
    CLUSTAR: [
      { name: "Spring Boot", reason: "빠른 서버 구성과 풍부한 생태계(JPA, Security, Validation 등)가 검증된 프레임워크입니다. AI 기능 연동 시 Spring AI 모듈을 그대로 활용할 수 있어 선택했습니다." },
      { name: "Spring AI", reason: "LangChain4j 등의 대안도 검토했지만, Spring 진영 공식 AI 통합 라이브러리로 Spring Boot와 AutoConfiguration이 자연스럽게 맞물리고, 추후 유지보수 시 Spring 개발자라면 누구나 익숙하게 접근할 수 있어 선택했습니다." },
      { name: "QueryDSL", reason: "메모 검색 조건이 태그·날짜·키워드 등 다양한 필터의 조합으로 구성되어 JPQL 문자열로 동적 쿼리를 작성하면 타입 안전성이 없고 유지보수가 어렵습니다. QueryDSL은 자바 코드로 타입 세이프하게 동적 쿼리를 작성할 수 있어 복잡한 필터 조합을 안전하게 처리하기 위해 선택했습니다." },
      { name: "PostgreSQL (pgvector)", reason: "RAG 파이프라인에서 임베딩 벡터를 저장하고 유사도 검색을 수행해야 했습니다. 별도의 전용 벡터 DB(Pinecone, Weaviate 등)를 추가하면 인프라 복잡도가 높아지는 반면, pgvector는 기존 RDBMS인 PostgreSQL에 확장으로 추가되어 단일 DB로 관계형 데이터와 벡터 데이터를 함께 관리할 수 있어 선택했습니다." },
      { name: "Redis", reason: "RefreshToken 저장과 캐싱 목적으로 도입했습니다. Redis는 인메모리 DB라 조회 속도가 빠르고, TTL 설정으로 RefreshToken 만료를 자동으로 처리할 수 있습니다. RDB에 토큰을 저장하면 인증 요청마다 디스크 I/O가 발생하는 반면, Redis는 이를 메모리에서 즉시 처리할 수 있어 선택했습니다." },
      { name: "AWS S3", reason: "메모에 첨부되는 이미지와 파일을 서버 로컬에 저장하면 EC2 재배포 시 파일이 사라지는 문제가 있습니다. S3는 내구성 99.999999999%의 객체 스토리지로, 서버와 독립적으로 파일을 영구 보관할 수 있어 선택했습니다." },
      { name: "GitHub Actions", reason: "별도의 CI/CD 서버(Jenkins 등) 없이 GitHub 저장소와 통합하여 PR 머지 시 자동으로 빌드·테스트·배포까지 이어지는 파이프라인을 구성할 수 있어 선택했습니다. Jib으로 Docker 데몬 없이 Java 이미지를 직접 ECR에 푸시하고, EC2에 SSH 접속해 컨테이너를 교체하는 무중단 배포 흐름을 구성했습니다." },
      { name: "GCP", reason: "모니터링 서버를 애플리케이션이 돌아가는 EC2와 같은 인스턴스에 두면, EC2 자체에 장애가 생겼을 때 모니터링 시스템도 함께 죽어버려 정작 장애 상황을 확인할 수 없게 됩니다. 그래서 Prometheus + Grafana 모니터링 서버를 GCP에 별도로 분리 구성해, EC2 장애와 무관하게 항상 서버 상태를 관측할 수 있도록 했습니다." },
    ],
    NUNCHI: [
      { name: "FastAPI", reason: "LangGraph 에이전트가 비동기(async/await) 기반으로 동작하기 때문에, 동일하게 asyncio 기반의 비동기 프레임워크가 필요했습니다. Django는 동기 중심이라 부적합하고, FastAPI는 asyncio 네이티브 지원과 Pydantic 기반 자동 스키마 검증·문서화까지 제공하여 선택했습니다." },
      { name: "LangGraph", reason: "주문 흐름이 메뉴탐색 → 옵션선택 → 장바구니 → 결제처럼 상태를 가지는 다단계 워크플로우였습니다. 단순 LangChain 체인으로는 분기 처리와 상태 유지가 어렵고, LangGraph는 상태 기반 그래프 구조로 각 단계를 노드로 정의하고 조건 분기를 명시적으로 표현할 수 있어 선택했습니다." },
      { name: "FastMCP", reason: "키오스크 도메인 전용 Tool(메뉴 조회, 장바구니 추가 등)을 LLM에게 제공해야 했습니다. FastMCP는 Python 함수에 데코레이터만 붙이면 MCP 서버로 노출되어, 별도 스키마 정의 없이 LangGraph 에이전트가 바로 인식할 수 있어 선택했습니다." },
      { name: "Spring Boot", reason: "메뉴·주문·결제 등 키오스크의 비즈니스 로직은 트랜잭션 처리와 관계형 데이터 관리가 중요합니다. Spring Boot + JPA 조합이 이 요구사항에 가장 적합하고, AI 서버(Python/FastAPI)와 역할을 명확히 분리하여 각 서버가 자신의 책임에만 집중하도록 설계했습니다." },
      { name: "PostgreSQL", reason: "메뉴·옵션 데이터가 계층 구조(카테고리 → 메뉴 → 옵션 그룹 → 옵션)를 가지므로 관계형 DB가 적합했습니다. MySQL 대신 PostgreSQL을 선택한 이유는, 계층형 관계 데이터(카테고리 → 메뉴 → 옵션)에 강한 표준 SQL·제약조건 지원과, 추후 영양정보·통계성 데이터 확장 시 윈도우 함수·CTE 등 PostgreSQL의 풍부한 쿼리 기능을 활용할 수 있다는 점이었습니다." },
      { name: "Redis", reason: "AI 서버와 Spring 서버 간 공유 세션 상태(장바구니 lock 등)를 저장하기 위해 사용했습니다. 두 서버가 분리된 프로세스로 동작하므로 인메모리 공유 저장소가 필요했고, Redis의 원자적 연산(SETNX)으로 장바구니 동시 접근 충돌을 방지했습니다." },
      { name: "Docker", reason: "AI 서버(Python)와 백엔드 서버(Java)가 언어·런타임이 달라 로컬 환경에 따라 실행 환경이 달라질 수 있습니다. Docker 컨테이너화로 \"내 로컬에서는 됐는데 서버에선 안 된다\"는 문제를 원천 차단하고, docker-compose로 두 서버를 동시에 관리할 수 있어 선택했습니다." },
      { name: "Nginx", reason: "AI 서버(8000포트)와 Spring 서버(8080포트)를 단일 도메인으로 서빙하기 위한 리버스 프록시로 사용했습니다. 경로 기반 라우팅(/ai → FastAPI, /api → Spring)으로 클라이언트가 서버 분리 구조를 인식할 필요 없이 단일 엔드포인트로 접근할 수 있도록 하고, SSL 종단 처리도 Nginx에서 일괄 담당합니다." },
      { name: "AWS EC2", reason: "AI 서버와 백엔드 서버를 단일 인스턴스에서 docker-compose로 함께 운영하여 서버 간 통신 지연을 최소화했습니다. 캡스톤 프로젝트 특성상 비용 효율이 중요했고, EC2 단일 인스턴스가 가장 합리적인 선택이었습니다." },
    ],
  },
  otherProjects: [
    { name: "BeBee", emoji: "🐝", period: "2025.03 ~ 2025.05", description: "데스크탑 전용 To-Do 웹 서비스", stack: "Python · Django · SQLite3", links: [{ label: "GitHub", href: "https://github.com/hyodongg/2025-simba-6-BeBee" }] },
    { name: "OneQ", emoji: "🖨", period: "2025.08", description: "AI 자연어 기반 인쇄 견적 챗봇 서비스", stack: "Python · Django · DRF · OpenAI API · JWT · SQLite3", links: [{ label: "GitHub", href: "https://github.com/hyodongg/2025-hackaton-1-OneQ-backend" }] },
    { name: "Order-Free", emoji: "🍽", period: "2025.04 ~ 2025.10", description: "QR 기반 식당 테이블 오더 서비스", stack: "Java · Spring Boot · JPA · MySQL (AWS RDS) · Flyway · SSE · AWS EC2 · GitHub Actions", links: [{ label: "GitHub", href: "https://github.com/hyodongg/Order-Free-Backend" }] },
    { name: "Altong", emoji: "💪", period: "2025.10 ~ 2025.11", description: "AI 기반 알바 통합 플랫폼", stack: "Java · Spring Boot · JPA · PostgreSQL (AWS RDS) · AWS EC2 · GitHub Actions", links: [{ label: "Backend GitHub", href: "https://github.com/Line4thon-Altong/Altong-BE" }, { label: "AI Server GitHub", href: "https://github.com/Line4thon-Altong/Altong-AI" }] },
  ],
  experiences: [
    {
      category: "학력",
      color: "#ec4899",
      items: [
        { title: "동국대학교 컴퓨터정보통신공학부 정보통신공학과", period: "2021.03 - 2027.02 (졸업예정)", desc: "전체 학점 4.18/4.5, 전공 학점 4.23/4.5" },
      ],
    },
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
    {
      category: "어학",
      color: "#4d7c0f",
      items: [
        { title: "토익스피킹 IH (150)", period: "", desc: "" },
      ],
    },
  ],
  projectImages: {},
};
