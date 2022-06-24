chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isSubmitted: false });
});

// 채점 결과
const scoringResults = [
  "기다리는 중",
  "재채점을 기다리는 중",
  "채점 준비 중",
  "채점 중",
  "맞았습니다!!",
  "출력 형식이 잘못되었습니다",
  "틀렸습니다",
  "시간 초과",
  "메모리 초과",
  "출력 초과",
  "런타임 에러",
  "컴파일 에러",
  "채점 불가",
  "삭제된 제출",
  "잠시후 채점 시작",
  "맞았습니다!!",
  "런타임 에러 이유를 찾는 중",
];

// 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "alarm") {
    const requestBody = [];

    const encodedKey = encodeURIComponent("solution_id");
    const encodedValue = encodeURIComponent(request.payload.solutionId);
    requestBody.push(encodedKey + "=" + encodedValue);

    const requestIntervalNotification = setInterval(() => {
      fetch("https://www.acmicpc.net/status/ajax", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
        body: requestBody,
      }).then((response) => {
        response.json().then((score) => {
          if (score.result > 3) {
            clearInterval(requestIntervalNotification);
            sendNotification(
              request.payload.solutionId,
              scoringResults[score.result],
              request.payload.problemId + "번",
            );
          }
        });
      });
    }, 2000);
  }
});

// 알림을 띄워주는 함수
function sendNotification(notificationId, scoringResult, problemId) {
  chrome.notifications.create(notificationId, {
    type: "basic",
    title: scoringResult,
    iconUrl: "icon.png",
    message: problemId,
    priority: 2, // -2 to 2 (highest)

    eventTime: Date.now(),
  });
}
