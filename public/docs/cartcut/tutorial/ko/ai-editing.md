# AI로 편집하기

CartCut은 AI 어시스턴트가 편집할 수 있습니다. [Claude Code](https://claude.com/claude-code)를 연결하고 프로젝트를 열어 둔 채 "무음 구간 잘라 줘", "자막 넣어 줘", "앞 30초 잘라 줘"처럼 말로 요청하면, 보는 앞에서 타임라인이 바뀝니다. 모든 변경은 <kbd>⌘</kbd> <kbd>Z</kbd>로 되돌릴 수 있습니다.

이 기능은 AI 도구가 다른 앱을 사용할 수 있게 해 주는 표준 방식인 MCP를 통해 동작합니다. CartCut은 실행되는 동안 Mac 안에서 작은 MCP 서버를 열어 두며, 프로젝트 내용은 내가 연결한 AI 어시스턴트 외에는 어디로도 보내지 않습니다.

## Connect AI 패널

CartCut 창 오른쪽 아래의 **⚡** 아이콘을 누릅니다.

![Connect AI 패널](img/connect-ai.webp "Claude Code, Codex 연결 명령과 OpenAI 키.")

패널에는 탭이 세 개 있습니다.

- **Claude Code**: Claude Code를 연결하는 명령어
- **Codex**: OpenAI Codex를 연결하는 명령어
- **OpenAI API**: Mac에서 받아쓰기를 할 수 없을 때 쓰는 **OpenAI Key** 입력란

패널에 *The editor bridge is not running*이라고 나오면 **Start bridge**를 누르세요. 보통 CartCut이 이미 하나 더 실행되어 있을 때 나타납니다.

## Claude Code 연결하기

다음 두 방법 중 **하나만** 사용하세요. 둘 다 사용하면 연결이 두 개 생깁니다.

### 방법 A: 플러그인 (추천)

Claude Code에서 다음을 실행합니다.

```bash
/plugin marketplace add cartesiancs/cartcut
/plugin install cartcut-editing@cartcut
```

Claude Code가 CartCut 토큰을 한 번 묻습니다. 토큰은 ⚡ 패널에 있는 **Connect the bridge** 명령어에서 `Bearer ` 뒤의 긴 코드입니다.

### 방법 B: 패널의 명령어 사용

1. ⚡ 패널의 **Connect the bridge** 옆 **Copy**를 누르고 터미널에서 실행합니다. 다음과 같은 모양입니다.

```bash
claude mcp add --transport http cartcut http://127.0.0.1:9826/mcp --header "Authorization: Bearer <your-token>"
```

2. **Install the editing skill** 옆 **Copy**를 누르고 이것도 실행합니다.

```bash
npx skills add cartesiancs/cartcut --skill cartcut-editing -a claude-code -g
```

어느 폴더에서든 한 번만 실행하면 됩니다. 확인하려면 `claude mcp list`를 실행하세요. `cartcut`(방법 A라면 `plugin:cartcut-editing:cartcut`)이 보이면 연결된 것입니다.

## 다른 AI 앱

Claude Desktop, Cursor, Codex 등 다른 MCP 클라이언트는 토큰을 스스로 찾아 주는 작은 도우미 프로그램으로 연결할 수 있습니다. Node.js 18 이상이 필요합니다.

Claude Desktop이나 Cursor에서는 앱의 MCP 설정에 다음을 추가합니다.

```json
{
  "mcpServers": {
    "cartcut": {
      "command": "npx",
      "args": ["-y", "@cartesiancs/cartcut-mcp"]
    }
  }
}
```

Codex에서는 다음을 실행합니다.

```bash
codex mcp add cartcut -- npx -y @cartesiancs/cartcut-mcp
```

## 이렇게 요청해 보세요

CartCut에서 프로젝트를 연 상태로, 평소 말하듯 요청하면 됩니다.

- "이 인터뷰에서 말 없는 구간을 잘라 줘."
- "영상 전체에 자막을 넣어 줘."
- "앞부분 30초를 잘라 줘."
- "첫 클립 위에 '여름 여행'이라는 제목을 넣고 서서히 사라지게 해 줘."
- "모든 클립 사이에 크로스 디졸브를 넣어 줘."
- "목소리가 커지는 순간에 화면을 확대해 줘."

요청 하나하나가 실행 취소 기록에 일반 편집으로 남습니다. 결과가 마음에 들지 않으면 <kbd>⌘</kbd> <kbd>Z</kbd>를 누르세요.

> [!TIP]
> 무음 제거나 자막처럼 말 내용을 알아야 하는 편집에는 받아쓰기가 필요합니다. macOS 26 이상이면 Mac 안에서, 그렇지 않으면 ⚡ 패널에 OpenAI 키를 넣어 사용할 수 있습니다.

## 문제 해결

| 메시지 | 해결 방법 |
| --- | --- |
| Connection refused 또는 *CartCut is not running* | CartCut을 실행하세요. 이미 실행 중이라면 ⚡ 패널에 *Start bridge*가 있는지 확인하세요 |
| 401 또는 *CartCut refused the token* | 토큰이 바뀌었거나 잘못 복사되었습니다. ⚡ 패널에서 명령어를 다시 복사하세요 |
| `claude mcp list`에 `cartcut`이 두 개 | 두 방법을 모두 사용했습니다. `claude mcp remove cartcut`으로 하나를 지우세요 |
