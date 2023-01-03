function getTitle() {
    let title = [
      ...document.querySelectorAll(".swoZuiEM"),
    ].map((e) => e.innerText);
  
    console.log([title]);
  }
  getTitle();
  