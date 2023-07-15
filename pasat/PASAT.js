window.onload = function () {
  let intro = document.getElementById("intro");
  let intro2 = document.getElementById("intro2");
  let intro3 = document.getElementById("intro3");
  let final = document.getElementById("final");
  let ok = document.getElementById("ok");
  let game = document.getElementById("game");
  let currentNum = document.getElementById("currentNum");
  let score = document.getElementById("score");
  let user = document.getElementById("user");
  let userName = document.getElementById("userName");
  let nameOk = document.getElementById("nameOk");

  let lastNum = 0;
  let currNum = 0;
  let answer = 0;
  let countCorrect = 0;
  let userAnswer;
  let counter = 0;
  let gameCounter = 0;

  let saveCountCorrect = [];
  let saveTime = [];

  nameOk.addEventListener("click", function () {
    let input = userName.value;
    console.log(input);
  });

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function init() {
    user.classList.add("show");
    nameOk.onclick = () => {
      if (!userName.value.trim()) {
        alert("لطفا اول نام خود را وارد کنید");
      } else {
        user.classList.remove("show");
        intro.classList.add("show");
        ok.classList.add("show");
        handleClickNum();
        ok.onclick = async () => {
          intro.classList.remove("show");
          intro2.classList.remove("show");
          intro3.classList.remove("show");
          final.classList.remove("show");
          ok.classList.remove("show");
          if (gameCounter == 0) {
            game.classList.add("show");
            await delay(1000);
            begin(10, 5000);
          } else if (gameCounter == 1 || gameCounter == 2) {
            game.classList.add("show");
            begin(20, 3000);
          } else {
            window.location.reload();
          }
        };
      }
    };
  }

  async function begin(round, ms) {
    const startTime = Date.now();
    lastNum = 0;
    currNum = 0;
    answer = 0;
    countCorrect = 0;
    for (counter = 0; counter < round; counter++) {
      score.innerHTML = "تعداد صحیح: " + countCorrect + "/" + counter;
      var randomIndex = Math.floor(Math.random() * 20) + 1;
      if (lastNum + randomIndex > 20) {
        counter--;
        continue;
      } else if (lastNum == 0 && randomIndex == 20) {
        counter--;
        continue;
      } else {
        showCurrentNum(randomIndex);
        await delay(ms);
      }
    }
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    saveCountCorrect.push(countCorrect);
    saveTime.push(elapsedTime);

    gameCounter++;
    if (gameCounter == 1) {
      game.classList.remove("show");
      intro2.classList.add("show");
      ok.classList.add("show");
    } else if (gameCounter == 2) {
      game.classList.remove("show");
      intro3.classList.add("show");
      ok.classList.add("show");
    } else {
      game.classList.remove("show");
      final.classList.add("show");
      ok.classList.add("show");
      // saveDataToFile(saveCountCorrect, saveTime, userName.value);
      sendData(userName.value,saveTime,saveCountCorrect)
    }
  }

  function showCurrentNum(randomIndex) {
    currNum = randomIndex;
    currentNum.innerHTML = currNum;
    answer = lastNum + currNum;
    lastNum = currNum;
  }

  function checkAnswer() {
    if (answer == userAnswer) {
      currentNum.innerHTML = "صحیح";
      countCorrect++;
    } else {
      currentNum.innerHTML = "غلط";
    }
    score.innerHTML = "تعداد صحیح: " + countCorrect + "/" + (counter + 1);
  }

  function handleClickNum() {
    const numbers = document.querySelectorAll(".number");
    numbers.forEach((number) => {
      number.addEventListener("click", (event) => {
        let temp = event.target.id;
        temp = temp.replace(/\D/g, "");
        userAnswer = parseInt(temp);
        checkAnswer();
      });
    });
  }

  function saveDataToFile(correctX, timeX, filename) {
    let data =
      "User : " +
      filename +
      "\n" +
      "Correct answers counted in Round 1 : " +
      correctX[0] +
      "     time estimated : " +
      timeX[0] / 1000 +
      " seconds" +
      "\n" +
      "Correct answers counted in Round 2 : " +
      correctX[1] +
      "     time estimated : " +
      timeX[1] / 1000 +
      " seconds" +
      "\n" +
      "Correct answers counted in Round 3 : " +
      correctX[2] +
      "     time estimated : " +
      timeX[2] / 1000 +
      " seconds";
    var blob = new Blob([data], { type: "text/plain" });

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename + ".txt";

    // Append anchor to body
    document.body.appendChild(a);

    // Trigger click event on the anchor
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  function sendData(name, time, score) {

    // var db = new JsonDB(new Config("myDataBase", true, false, '/'));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
      name: name,
      time: time,
      score: score
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data
    };

    fetch("https://azure-bat-hem.cyclic.app/pasat", requestOptions)
        .then(result => console.log(result))
        .catch(error => console.error('error', error));
  }

  init();
};
