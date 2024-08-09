# Task Log Notifier

Task Log Notifier는 Azure DevOps 파이프라인에서 작업의 로그를 지정된 API 또는 Webhook으로 전송하는 확장입니다. 이 확장은 작업 실패 시 또는 사용자 지정 조건에 따라 로그를 전송할 수 있도록 도와줍니다.

## 기능

- 파이프라인 작업의 로그를 API 또는 Webhook으로 전송
- 조건부 실행을 통해 특정 상황에서만 로그 전송
- 간편한 커스텀 헤더 설정을 통한 유연한 API 요청 구성

## 사용 방법

### 1. 조건 설정

Task Log Notifier는 사용자가 설정한 조건에 따라 동작합니다. 일반적으로 파이프라인의 이전 작업이 실패했을 때 로그를 전송하도록 설정할 수 있습니다. 조건 설정에는 YAML 파이프라인에서 설정하는 방법과 Azure DevOps UI에서 설정하는 방법이 있습니다.

#### YAML 파이프라인에서 조건 설정

YAML 파이프라인에서 조건을 설정하는 방법은 다음과 같습니다.

```yaml
steps:
- task: TaskLogNotifier@1
  condition: eq(variables['Agent.JobStatus'], 'Failed')
  inputs:
    apiUrl: 'https://your-api-url.com'
    personalAccessToken: 'your-pat'
    customHeaders: 'Content-Type:application/json, Authorization:Bearer token'
```

- **조건 설명**:
  - `eq(variables['Agent.JobStatus'], 'Failed')`: 이전 작업 중 하나라도 실패했을 때 이 작업을 실행합니다.
  - `always()`: 파이프라인의 성공 여부와 관계없이 항상 작업을 실행합니다.
  - `succeeded()`: 이전 작업이 모두 성공했을 때만 작업을 실행합니다.
  - `canceled()`: 작업이 취소된 경우에만 작업을 실행합니다.

#### Azure DevOps UI (Basic 상태)에서 조건 설정

Azure DevOps UI에서 조건을 설정하는 방법은 다음과 같습니다.

1. **파이프라인 편집기 열기**:
   - Azure DevOps 포털에서 파이프라인을 선택한 후, 편집을 시작합니다.

2. **작업 선택**:
   - Task Log Notifier 작업을 추가하고, 설정 아이콘을 클릭하여 작업 세부 설정 화면을 엽니다.

3. **조건 설정**:
   - "Control Options" 섹션을 확장합니다.
   - "Run this task" 항목에서 "Custom conditions"을 선택합니다.
   - 조건식 입력란에 원하는 조건을 입력합니다.
     - 예: `eq(variables['Agent.JobStatus'], 'Failed')`

4. **예시 조건**:
   - **전체 작업 중 실패 발생 시 실행**: `eq(variables['Agent.JobStatus'], 'Failed')`
   - **직전 작업 실패 발생 시 실행**: `failed()`
   - **성공 시 실행**: `succeeded()`
   - **취소 시 실행**: `canceled()`
   - **항상 실행**: `always()`

### 2. 입력 필드 설정

Task Log Notifier 확장에는 다음과 같은 입력 필드가 있습니다.

- **API URL (`apiUrl`)**: 로그를 전송할 API 또는 Webhook의 URL을 입력합니다.
- **Personal Access Token (`personalAccessToken`)**: Azure DevOps REST API에 접근하기 위한 Personal Access Token(PAT)을 입력합니다. 이 값은 UI에서 마스킹 처리됩니다.
- **Custom Headers (`customHeaders`)**: API 요청 시 사용할 커스텀 헤더를 `key:value` 형식으로 입력합니다. 여러 헤더를 사용할 경우 쉼표로 구분합니다.

### 3. 로그 전송 방식

Task Log Notifier는 수집된 로그를 API로 전송하며, 전송 형식은 다음과 같습니다.

- **HTTP Method**: POST
- **Request Body**:
    ```json
    {
      "log": "로그내용"
    }
    ```
  로그 내용은 "log" 필드에 포함되어 전송됩니다.

## 설치 및 설정

1. [Azure DevOps 마켓플레이스](https://marketplace.visualstudio.com/)에서 Task Log Notifier 확장을 설치합니다.
2. 파이프라인에서 Task Log Notifier를 추가하고, 필요한 설정을 입력합니다.
3. 조건 설정을 통해 원하는 상황에서 로그가 전송되도록 구성합니다.

## 예시

다음은 Task Log Notifier를 파이프라인에서 사용하는 예시입니다.

```yaml
steps:
- task: TaskLogNotifier@1
  condition: always()
  inputs:
    apiUrl: 'https://example.com/webhook'
    personalAccessToken: $(PAT)
    customHeaders: 'Authorization:Bearer $(AuthToken)'
```

위 예시에서는 파이프라인이 완료될 때마다 항상 로그가 전송되도록 설정되었습니다.

## 지원 및 피드백

이 확장에 대한 피드백이나 지원이 필요하시면 [지원 페이지](https://github.com/NerdyNot/TaskLogNotifier/issues)를 방문해 주세요.