function getInfo(num) {
  let hrefList = [...document.querySelectorAll(".Eie04v01 a")]
    .map((e) => e.href)
    .slice(0, num);
  let zanList = [
    ...document.querySelectorAll(
      ".Eie04v01 a .jjKJTf4P.author-card-user-video-like"
    ),
  ]
    .map((e) => e.innerText)
    .map((e) => e.includes('万')?e.slice(0,-1)*10000:e)
    .slice(0, num);
  let res = [];
  for (let i = 0; i < num; i++) {
    res.push({
      href: hrefList[i],
      zan: zanList[i],
    });
  }
  console.log(res.sort((a,b)=>b.zan-a.zan));
}
getInfo(23);