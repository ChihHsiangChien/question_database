var xhr = new XMLHttpRequest();
xhr.open('GET', '../data/database.csv', true);
xhr.send();

xhr.onload = function() {
  function checkAnswer(event) {
    // 取消 form 提交事件的預設行為
    event.preventDefault();
  
    // 定義一個對應表，用來存儲 radio 選項的值和標準答案的映射關係
    var mappingTable = {
      0: "A",
      1: "B",
      2: "C",
      3: "D"
    };
    
    // 創建一個陣列，用來存儲所有題目的用戶答案
    var userAnswers = [];
    var score = 0;
    var correct_count = 0;
    var incorrect_count = 0;
    // 遍歷所有題目，獲取每一個選擇題選中的選項
    var radioInputs = document.querySelectorAll("input[type='radio']");    
      radioInputs.forEach(function(radioInput) {
        if (radioInput.checked) {
          // 將每一個題目的用戶答案轉換成ABCD添加到 userAnswers 陣列中
          var userAnswer = mappingTable[radioInput.value];
          userAnswers.push(userAnswer);
  
  
          // 檢查每一個題目的答案是否正確
          if (answers[radioInput.name] === userAnswer) {
            // 答案正確
            score += 1;
            correct_count += 1;
  
            // 取得該題目的 label 元素
            var label = document.querySelector("label[for='" + radioInput.id + "']");
            label.classList.add("correct");
  
          } else {
            // 答案錯誤
            incorrect_count += 1;
            // 遍歷當前選擇題的所有選項
            //var labels = document.querySelectorAll("label[for^='radio" + radioInput.name + "']");
              var labels = document.querySelectorAll("label[for^='" + radioInput.id + "']");
              labels.forEach(function(label) {
                // 移除原本的顏色
                label.classList.remove("incorrect");
              });
      
              // 添加新的顏色
              //var label = document.querySelector("label[for='radio_" + radioInput.name + "_" + radioInput.value + "']");
              var label = document.querySelector("label[for='" + radioInput.id + "']");
  
              label.classList.add("incorrect");
          }
        }
  
    });
    document.querySelector('#correct-count').innerHTML = correct_count;
    document.querySelector('#incorrect-count').innerHTML = incorrect_count;
  
    //alert("score:" + score  );
  
    
  }




  if (xhr.status == 200) {
    var data = xhr.responseText;
    var lines = data.split('\n'); // 按行分割

    //歷遍每個題目
    //for (var i = 0; i < lines.length; i++) {
    //  var items = lines[i].split(','); // 按逗號分割

    // 將每一行資料轉換為題目物件
    var questions = lines.map(function(line) {
      var data = line.split(',');
      var question = data[11];
      var image1 = data[12];
      var optionA = data[14];
      var optionB = data[15];      
      var optionC = data[16];            
      var optionD = data[17];
      var imageA = data[18];      
      var imageB = data[19];
      var imageC = data[20];      
      var imageD = data[21];      
      var answer = data[23];
      var origin = data[22];
      
      return {
        question: question,
        image1: image1,
        options: [
          { optionText: optionA, image: imageA },
          { optionText: optionB, image: imageB },
          { optionText: optionC, image: imageC },
          { optionText: optionD, image: imageD }
        ],
        answer: answer,
        origin: origin
      }
    })
    //題目物件轉換結束
    var totalQuestions = questions.length - 1; // 總題數
    var correctAnswers = 0; // 答對題數
    

    var my_form = document.createElement("FORM");
    my_form.name = "myForm";

    // 創建一個按鈕
    var button = document.createElement("button");

    // 設定按鈕的 type 屬性為 submit
    button.type = "submit";

    // 設定按鈕的文字內容
    button.innerText = "\u63d0\u4ea4";

    // 設定表單的 onsubmit 事件，以在提交時調用 checkAnswer 函式
    my_form.onsubmit = function() {
      checkAnswer(event);
    };

    // 定義標準答案answers 物件
    var answers = {};


    // my_form.method = 'POST';
    // my_form.action = 'http://www.another_page.com/index.htm';

    // 顯示題目，從i = 1開始，因第一列是標題
    //for (var i = 1; i < questions.length; i++) {
    for (var i = 200; i < 203; i++) {
      var question = questions[i].question;
      var image1   = questions[i].image1;
      var options  = questions[i].options;
      var answer   = questions[i].answer;
      var origin   = questions[i].origin;

      // 將標準答案添加到 answers 物件中
      answers[i] = answer;

      //放入題幹文字
      var questionDiv = document.createElement("DIV");

      // 建立一個新的 h2 標籤
      var h2 = document.createElement("h2");

      // 設定 h2 標籤的文字內容
      h2.innerText = i;
      questionDiv.appendChild(h2);

      questionDiv.innerHTML += question ;

      //放入出處
      questionDiv.innerHTML += '(' + origin + ')<br>';

      //如果有題幹圖片，則放入
      if (image1 != ""){
        var imgPath = "../image/" + image1 +".jpeg"
        questionDiv.innerHTML += '<img src ="' + imgPath +'">';
      }
      // document.body.appendChild(questionDiv);
      my_form.appendChild(questionDiv);

      //放入選項
      for (var j = 0; j < options.length; j++) {
        var optionText = options[j].optionText; //取得選項文字
        
        // 創建選項文字
        var label = document.createElement('label');
        label.textContent = optionText;
        label.htmlFor = 'radio_' + i + '_' + j;

        //創建radio
        var my_radio = document.createElement("INPUT");
        my_radio.type = 'radio';
        my_radio.name = i;  //question
        my_radio.value = j;
        my_radio.id = 'radio_' + i + '_' + j;

        my_form.appendChild(my_radio);        
        my_form.appendChild(label);


        // 在這個選項的末尾添加換行
        var br = document.createElement('br');
        my_form.appendChild(br);

      }

      // 在這題的末尾添加空白行
      var br = document.createElement('br');
      my_form.appendChild(br);            
    }
    // 將按鈕加入表單中
    my_form.appendChild(button);
    document.body.appendChild(my_form);
    console.log(answers);
    

    //加入答對題數統計
    var p = document.createElement("p");
    p.innerHTML = "你答對:";

    // 產生一個 span 元素
    var span = document.createElement("span");

    // 設置 span 元素的 id 屬性為 "correct-count"
    span.id = "correct-count";

    // 把 span 元素添加到p中
    p.appendChild(span);
    p.innerHTML += "題"
    document.body.appendChild(p);

    //加入答錯題數統計
    var p = document.createElement("p");
    p.innerHTML = "你答錯:";

    // 產生一個 span 元素
    var span = document.createElement("span");

    // 設置 span 元素的 id 屬性為 "incorrect-count"
    span.id = "incorrect-count";

    // 把 span 元素添加到p中
    p.appendChild(span);
    p.innerHTML += "題"
    document.body.appendChild(p);    

    



  } else {
    // 請求失敗
  }
};

