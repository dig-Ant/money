function getcomment() {
  let commentList = [
    ...document.querySelectorAll(".comment-mainContent .a9uirtCT"),
  ]
    .map((e) =>
      e.innerText
        .replace(/\n/g, "")
        .replace("置顶", "")
        .replace("作者回复过", "")
        .replace("作者赞过")
    )
    .filter((e) => e.length > 0);

  console.log(commentList);
}
getcomment();