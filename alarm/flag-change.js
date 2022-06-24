// 제출 버튼
const submitBtn = document.getElementById("submit_button");

// 제출 버튼 클릭 체크
submitBtn.addEventListener("click", () => {
  chrome.storage.sync.set({ isSubmitted: true });
});
