### How to Start

1. notion 에서 credentials 를 2개 (환경별로) 다운받아 json_credentials/ 에 위치시킨다.
2. .env.sample 을 복사해 .env 파일을 만들고 1번에서 만든 경로들을 지정해준다.
3. yarn install
4. 개발환경의 경우 yarn start:dev 혹은 yarn watch:dev
5. 운영환경의 경우 yarn start:prod 혹은 yarn watch:prod

### 주요 파일

firebase 세팅
- 앱 초기, firebase (root instance) 를 환경에 맞게 설정하는 부분 [app.service.ts](src/app.service.ts)
- firebase messaging 설정 부분 [fcm.service.ts](src/fcm/fcm.service.ts)

세팅 후 메시징 관리
- 3가지 메시지 유형 관리용 클래스 [fcm.dto.ts](src/fcm.dto.ts)
- 메시지를 만드는 builder 클래스 [message.builder.ts](src/fcm/message.builder.ts)