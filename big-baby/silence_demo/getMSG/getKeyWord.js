function getKeyWord() {
  let word = [
    ...document.querySelectorAll(".index-module__analysis_bar--dW_CT .index-module__text--tdCdo"),
  ].map((e) => e.innerText);

  console.log([word.join(',')]);
}
getKeyWord();
