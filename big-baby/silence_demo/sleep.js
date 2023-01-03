function sleep(time) {
  let now = Date.now();
  while (true) {
    if (Date.now() - now >= time) {
      return;
    }
  }
}

sleep(3 * 1000);
