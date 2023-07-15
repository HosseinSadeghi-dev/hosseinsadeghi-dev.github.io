window.onload = function () {
    let intro = document.getElementById("intro");
    let intro2 = document.getElementById("intro2");
    let blockContainer = document.getElementById("blockContainer");
    var block = document.getElementsByClassName("block");
    let ready = document.getElementById("ready");
    let done = document.getElementById("done");
    let realTest = document.getElementById("realTestBegin");
    let user = document.getElementById("user");
    let userName = document.getElementById("userName");
    let nameOk = document.getElementById("nameOk");
    let deleteDiv = document.getElementById("deleteDiv");
    let endTest = document.getElementById("endTest");

    let sequence = [];
    let answerSeq = [];

    let index = 0;
    let twoRound = 0;

    let correctTrials = 0;
    let startTime;
    let endTime;
    let time = [];

    let twoFalse = 0;
    let start = false;
    let end = false;

    nameOk.addEventListener("click", function () {
        let input = userName.value;
        console.log(input);
    });

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function init() {
        deleteDiv.classList.add("show");
        user.classList.add("show");
        nameOk.onclick = () => {
            if (!userName.value.trim()) {
                alert("لطفا اول نام خود را وارد کنید");
            } else {
                deleteDiv.classList.remove("show");
                user.classList.remove("show");
                intro.classList.add("show");
                intro.onclick = () => {
                    intro.classList.remove("show");
                    intro2.classList.add("show");
                };
                intro2.onclick = async () => {
                    intro2.classList.remove("show");
                    ready.classList.add("show");
                    await delay(2000);
                    ready.classList.remove("show");
                    generateSequence(3);
                };
            }
        };
        handleClickBlocks();
    }

    function generateSequence(x) {
        for (let i = 0; i < x; i++) {
            var randomIndex = Math.floor(Math.random() * 9) + 1;
            let repetetive = false;
            for (let j = 0; j < sequence.length; j++) {
                if (randomIndex == sequence[j]) {
                    repetetive = true;
                }
            }
            if (repetetive) {
                i--;
                continue;
            } else {
                sequence.push(randomIndex);
            }
        }

        showSequence();
    }

    async function showSequence() {
        blockContainer.classList.add("show");

        document.body.style.cursor = "none";
        let cursor = document.querySelectorAll(".block");
        cursor.forEach((element) => {
            element.classList.remove("cursor");
        });
        done.classList.remove("cursor");

        await delay(500);
        for (let i = 0; i < sequence.length; i++) {
            let blockShow = document.getElementById("block" + sequence[i]);
            blockShow.classList.add("light");
            await delay(1000);
            blockShow.classList.remove("light");
        }

        enableSelection();
    }

    async function enableSelection() {
        await delay(300);

        document.body.style.cursor = "auto";
        let cursor = document.querySelectorAll(".block");
        cursor.forEach((element) => {
            element.classList.add("cursor");
        });
        done.classList.add("cursor");
        done.classList.add("show");

        startTime = Date.now();
    }

    function handleClickBlocks() {
        const blocks = document.querySelectorAll(".block");
        blocks.forEach((block) => {
            block.addEventListener("click", async (event) => {
                block.classList.add("light");
                await delay(200);
                block.classList.remove("light");
                let temp = event.target.id;
                answerSeq.push(temp[5]);
            });
        });
    }

    async function checkAnswer() {
        let flag = true;
        for (let i = 0; i < sequence.length; i++) {
            if (sequence.length != answerSeq.length) {
                flag = false;
                break;
            } else if (sequence[i] != answerSeq[i]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            let correct = document.getElementById("correct");
            correct.classList.add("show");
            if (start) {
                correctTrials++;
            }
        } else {
            let incorrect = document.getElementById("incorrect");
            incorrect.classList.add("show");
            if (start) {
                twoFalse++;
                if (twoFalse == 2) {
                    console.log("end test");
                    endGame();
                }
            }
        }
        await delay(500);
        correct.classList.remove("show");
        incorrect.classList.remove("show");
        for (let i = 0; i < sequence.length; i++) {
            sequence.pop();
        }
        for (let i = 0; i < answerSeq.length; i++) {
            answerSeq.pop();
        }
        sequence.length = 0;
        answerSeq.length = 0;

        if (!end) {
            if (start) {
                if (index < 10) {
                    if (twoRound < 2) {
                        generateSequence(index);
                        if (index == 9) {
                            twoFalse = 0;
                            index++;
                        }
                        twoRound++;
                    } else {
                        twoRound = 1;
                        twoFalse = 0;
                        index++;
                        generateSequence(index);
                    }
                } else {
                    console.log("end test");
                    endGame();
                }
            } else {
                if (index < 2) {
                    index++;
                    generateSequence(3);
                } else {
                    start = true;
                    realTest.classList.add("show");
                    realTest.onclick = () => {
                        realTest.classList.remove("show");
                        begin();
                    };
                }
            }
        }
    }

    function begin() {
        index = 2;
        twoRound = 1;
        generateSequence(index);
    }

    async function endGame() {
        await delay(500);
        incorrect.classList.remove("show");

        end = true;
        let blockSpan = index - 1;
        let score = correctTrials * blockSpan;
        let totalTime = 0;

        for (let i = 0; i < time.length; i++) {
            totalTime += time[i];
        }

        let avgTime = totalTime / time.length;
        totalTime /= 1000;
        avgTime /= 1000;
        totalTime = totalTime.toFixed(2);
        avgTime = avgTime.toFixed(2);

        console.log(
            "user : " +
            userName.value +
            "\n" +
            "total time : " +
            totalTime +
            " seconds" +
            "\n" +
            "average time : " +
            avgTime +
            " seconds" +
            "\n" +
            "block span : " +
            blockSpan +
            "\n" +
            "total score : " +
            score +
            "\n" +
            "total correct trials : " +
            correctTrials +
            "\n" +
            "memory span : "
        );
        sendData(userName.value, totalTime, score);
        // saveDataToFile(totalTime, avgTime, blockSpan, score);

        endTest.classList.add("show");
        endTest.onclick = () => {
            endTest.classList.remove("show");
            window.location.reload();
        };
    }

    function saveDataToFile(totalTime, avgTime, blockSpan, score) {
        let data =
            "user : " +
            userName.value +
            "\n" +
            "total time : " +
            totalTime +
            " seconds" +
            "\n" +
            "average time : " +
            avgTime +
            " seconds" +
            "\n" +
            "block span : " +
            blockSpan +
            "\n" +
            "total score : " +
            score +
            "\n" +
            "total correct trials : " +
            correctTrials +
            "\n" +
            "memory span : ";
        var blob = new Blob([data], {type: "text/plain"});

        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = userName.value + ".txt";

        // Append anchor to body
        document.body.appendChild(a);

        // Trigger click event on the anchor
        a.click();

        // Remove anchor from body
        document.body.removeChild(a);
    }

    done.onclick = () => {
        endTime = Date.now();
        const elapsedTime = endTime - startTime;
        if (start) {
            time.push(elapsedTime);
        }

        blockContainer.classList.remove("show");
        done.classList.remove("show");
        checkAnswer();
    };

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

        fetch("https://azure-bat-hem.cyclic.app/corsi", requestOptions)
            .then(result => console.log(result))
            .catch(error => console.error('error', error));
    }

    // Start the game
    init();
};
