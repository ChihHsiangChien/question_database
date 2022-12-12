//document.body.my_form.innerHTML = "";
function randomSort(a, b) {
  return Math.random() - 0.5;
}



// 定義一個函數來處理題目資料
function handleResponse(response) {
  var data = xhr.responseText;
  var lines = data.split('\n'); // 按行分割

  // 將每一行資料轉換為題目物件
  var questions = lines.map(function(line) {
    var data = line.split(',');
    var chapter    = data[1];
    var section    = data[2];
    var concept    = data[3];
    var subconcept = data[4];
    var height   = data[10];
    var question = data[11];
    var image1 = data[12];
    var image2 = data[13];
    var optionA = data[14];
    var optionB = data[15];      
    var optionC = data[16];            
    var optionD = data[17];
    var imageA = data[18];      
    var imageB = data[19];
    var imageC = data[20];      
    var imageD = data[21];          
    var source = data[22];
    var answer = data[23];
    var discriminant = data[25];
    var correctRate = data[26];

    return {
      chapter   : chapter,
      section   : section,
      concept   : concept,
      subconcept: subconcept,
      height  : height,
      question: question,
      image1: image1,
      image2: image2,
      options: [
        { optionText: optionA, image: imageA },
        { optionText: optionB, image: imageB },
        { optionText: optionC, image: imageC },
        { optionText: optionD, image: imageD }
      ],
      answer: answer,
      source: source,
      discriminant: discriminant,
      correctRate: correctRate
    } 
  })
  //題目物件轉換結束

  return questions;
}

//創建一個包含章、節、概念的 chapters 物件
function createChapter(questions) {
  // 章物件
  var chapters = {};

  // 從題目數據中遍歷所有題目
  questions.forEach(function(question) {
    // 取出該題目的章、節、概念信息
    var chapter  = question.chapter;
    var section  = question.section;
    var concept  = question.concept;
    var question = question.question;

    // 如果章物件不存在，則創建一個新的章物件
    if (!chapters[chapter]) {
      chapters[chapter] = {};
    }

    // 在節物件裡增加一個叫做「節」的物件
    if (!chapters[chapter]["節"]) {
      chapters[chapter]["節"] = {};
    }

    // 如果節物件不存在，則創建一個新的節物件
    if (!chapters[chapter][section]) {
      chapters[chapter][section] = {};
    }

    // 在概念物件裡增加一個叫做「概念」的物件
    if (!chapters[chapter][section]["概念"]) {
      chapters[chapter][section]["概念"] = {};
    }

    // 如果概念物件不存在，則創建一個新的概念物件
    if (!chapters[chapter][section][concept]) {
      chapters[chapter][section][concept] = {};
    }

    // 向概念物件中添加一個包含題目信息的數組
    // if (!chapters[chapter][section][concept].questions) {
    //  chapters[chapter][section][concept].questions = [];
    // }

    // 將題目添加到題目信息數組中
    //chapters[chapter][section][concept].questions.push(question);
  });
  return chapters;  
}

// 建立一個出處的物件
function createSource(questions) {
  // 出處物件
  var sources = {};

  // 從題目數據中遍歷所有題目
  questions.forEach(function(question) {
    // 取出該題目的章、節、概念信息
    var source   = question.source;

    // 如果出處物件不存在，則建立一個出處物件
    if (!sources[source]) {
      sources[source] = {};
    }
  });

  // 將 sources 物件轉換為一個陣列
  var sources = Object.keys(sources).map(function(key) {

    return key;
  });

  // 將 sources 陣列按照年份進行排序
  sources.sort(function(a, b) {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
  });

  return sources;  

}


// 建立下拉式選單
function createdfilteredQuestions(questions, chapters, sources) {

  // 建立章、節、概念的下拉式選單
  var chaptersSelect = document.createElement("select");
  var sectionsSelect = document.createElement("select");
  var conceptsSelect = document.createElement("select");


  // 將章的值新增到選單中
  for (var chapter in chapters) {
    chaptersSelect.add(new Option(chapter));
  }

  // 為章的下拉式選單添加 onchange 事件
  chaptersSelect.onchange = function() {
    // 取得使用者選擇的章
    var selectedChapter = this.value;

    // 從章物件中取出該章的節物件
    var sections = chapters[selectedChapter];

    // 先將節選單清空
    sectionsSelect.innerHTML = "";

    // 將節的值新增到節選單中
    for (var section in sections) {
      sectionsSelect.add(new Option(section));
    }
  };


  // 為節的下拉式選單添加 onchange 事件
  sectionsSelect.onchange = function() {
    // 取得使用者選擇的章、節
    var selectedChapter = chaptersSelect.value;
    var selectedSection = this.value;

    
    // 從章物件中取出該章的節物件，並從節物件中取出該節的概念值陣列
    var sections = chapters[selectedChapter];
    var concepts = sections[selectedSection];
    // 先將概念選單清空
    conceptsSelect.innerHTML = "";

    // 將概念的值新增到概念選單中
    for (var concept in concepts) {
      conceptsSelect.add(new Option(concept));
    }

  };
  
  // 為概念的下拉式選單添加 onchange 事件
  conceptsSelect.onchange = function() {
    // 取得使用者選擇的章、節、概念
    var selectedChapter = chaptersSelect.value;
    var selectedSection = sectionsSelect.value;
    var selectedConcept = this.value;

    // 根據使用者的選擇篩選題目
    var filteredQuestions = questions.filter(function(question) {
      return question.chapter == selectedChapter &&
             question.section == selectedSection &&
             question.concept == selectedConcept;
    });
  
    // 按照出處排序    
    filteredQuestions.sort(function(a, b) {
      if (a.source < b.source) {
        return 1;
      } else if (a.source > b.source) {
        return -1;
      } else {
        return 0;
      }
    });


    //將篩選出的題目 filteredQuestions 渲染html
    renderHtml(filteredQuestions);

  };

  // 建立出處的下拉式選單
  var sourcesSelect = document.createElement("select");
  

  for (var i = 0; i < sources.length; i++) {
    sourcesSelect.add(new Option(sources[i]));
  }

  /*
  // 將出處的值新增到選單中
  for (var source in sources) {
  
    sourcesSelect.add(new Option(source));
  }
  */

  // 為出處的下拉式選單添加 onchange 事件
  sourcesSelect.onchange = function() {
    // 取得使用者選擇的出處
    var selectedSource = this.value;

    // 根據使用者的選擇篩選題目
    var filteredQuestions = questions.filter(function(question) {
      return question.source == selectedSource ;
    });

    // 按照章節排序    
    filteredQuestions.sort(function(a, b) {
      if (a.chapter < b.chapter) {
        return -1;
      } else if (a.chapter > b.chapter) {
        return 1;
      } else {
        return 0;
      }
    });

    
    //將篩選出的題目 filteredQuestions 渲染html
    renderHtml(filteredQuestions);


  }



  // 建立一個div，放chapterSelect
  var chapterSelectDiv = document.createElement("div");
  chapterSelectDiv.appendChild(chaptersSelect);
  chapterSelectDiv.appendChild(sectionsSelect);
  chapterSelectDiv.appendChild(conceptsSelect);

  // 建立一個div，放sourceSelect
  var sourceSelectDiv = document.createElement("div");
  sourceSelectDiv.appendChild(sourcesSelect);
  

  document.body.appendChild(chapterSelectDiv);
  document.body.appendChild(sourceSelectDiv);

}


//渲染html
function renderHtml(questions){
  //篩選題目

  // 在篩選後的題目陣列上呼叫 sort() 方法，並傳入這個排序函數，來實現隨機排序
  // questions.sort(function(a, b) {
  //   return Math.random() - 0.5;});

  // 從篩選後的題目陣列中挑選出前五題，並將它們存放在 firstFiveQuestions
  // questions = filteredQuestions.slice(0, 5);


  //將之前的題目div刪除
  var questionsDiv = document.getElementById("questionsDiv");
  if (questionsDiv) {
    questionsDiv.parentNode.removeChild(questionsDiv);
  }

  //將之前的檢查答案div刪除
  var responseDiv = document.getElementById("responseDiv");
  if (responseDiv) {
    responseDiv.parentNode.removeChild(responseDiv);
  }

  var questionsDiv = document.createElement("div");
  questionsDiv.id = "questionsDiv";

  var my_form = document.createElement("form");
  
  var p = document.createElement("p");
  p.innerHTML = "共有 " + questions.length + "題"
  questionsDiv.appendChild(p);


  // 定義標準答案answers 物件
  var answers = {};

  
  // 顯示題目
  for (var i = 0; i < questions.length; i++) {
    var question = questions[i].question;
    var image1   = questions[i].image1;
    var image2   = questions[i].image2;    
    var options  = questions[i].options;
    var answer   = questions[i].answer;
    var source   = questions[i].source;
    var discriminant = questions[i].discriminant;;
    var correctRate  = questions[i].correctRate;;


    // 將標準答案添加到 answers 物件中
    answers[i] = answer;

    //建立div放題目
    var questionDiv = document.createElement("div");
    questionDiv.id = "question" + i;
    // 將 "question" 類別加入 div 元素中
    questionDiv.classList.add("question");
  

    // 建立一個新的 h2 標籤
    var h2 = document.createElement("h2");

    // 設定 h2 標籤的文字內容
    h2.innerText = i + 1;
    questionDiv.appendChild(h2);

    // 放入題幹
    questionDiv.innerHTML += question ;

    //放入出處
    questionDiv.innerHTML += '<br>【' + source;

    // 檢查是否有通過率和鑑別度的資料，如果有就放進去
    if(correctRate != "" && discriminant != ""){
      //放入通過率
      questionDiv.innerHTML += ', 通過率:' + correctRate ;
      //放入鑑別度
      questionDiv.innerHTML += ', 鑑別度:' + discriminant + '】<br>';
    } else{
      questionDiv.innerHTML += '】<br>';
    }

    
    //如果有題幹圖片image1，則放入
    if (image1 != "") {
      var imgPath = "../image/" + image1 +".jpeg";

      var img = document.createElement("img");
      img.src = imgPath;
      img.width = 300; // 設置圖像寬度為 300 像素
      questionDiv.appendChild(img);
      questionDiv.innerHTML += '<br>';
    }

    //如果有題幹圖片image2，則放入
    if (image2 != "") {
      var imgPath = "../image/" + image2 +".jpeg";

      var img = document.createElement("img");
      img.src = imgPath;
      img.width = 300; // 設置圖像寬度為 300 像素
      questionDiv.appendChild(img);
      questionDiv.innerHTML += '<br>';
    }


    //放入選項
    for (var j = 0; j < options.length; j++) {
      var optionText  = options[j].optionText; //取得選項文字
      var optionImage = options[j].image;      //取得選項圖片


      //  創建選項radio
      var my_radio   = document.createElement("INPUT");
      my_radio.type  = 'radio';
      my_radio.name  = i;  //question
      my_radio.value = j;
      my_radio.id    = i + '_' + j;
      questionDiv.appendChild(my_radio);   
      // 創建選項文字
      var label = document.createElement('label');
      label.textContent = optionText;
      label.htmlFor = i + '_' + j;

      // 將"label" 類別加入 label 元素中
      label.classList.add("label");
      questionDiv.appendChild(label); 

      

      // 創建選項圖片
      if (optionImage) {
        var imgPath = "../image/" + optionImage +".jpeg";
        var img = document.createElement("img");
        img.id = i + '_' + j;
        img.src = imgPath;        
        img.width = 200; // 設置圖像寬度為 300 像素
        // 為圖片元素添加點擊事件
        img.addEventListener("click", function() {
          // 取得選項按鈕的名稱
          var imgId = this.id;
          // 根據選項按鈕的名稱來找到對應的按鈕元素
          var radioInput = document.querySelector("input[id='" + imgId + "']");
          // 觸發按鈕元素的 click 事件
          radioInput.click();

        });
        // });

        // 設置圖像的 alt 屬性，以便當用戶點擊圖像時，選項按鈕也會被觸發
        img.alt = my_radio.id;

        // 將圖像附加到選項按鈕之後
        questionDiv.appendChild(img);


      }

      // 在這個選項的末尾添加換行
      var br = document.createElement('br');

      //questionDiv.appendChild(label);
      questionDiv.appendChild(br);

    }
    var br = document.createElement('br');    

    // 每題下方增加檢查的按鈕。目前按鈕的事件其實只做了檢查是否有沒作答的
    // 因為同時執行了checkAnswer那個函數
    var myButton = document.createElement("button");
    myButton.id = i;
    myButton.value = answer; // 把答案藏在button的value裡
    myButton.innerHTML = "Check";
    myButton.onclick = function() {
      answer = this.value;
      var ifAnswered = false;  //是否未作答
      
      // 找到這題所有選項
      var radioInputs = document.querySelectorAll("input[type='radio'][id^= '" + this.id +"_']");      
      radioInputs.forEach(function(radioInput) {        
        if (radioInput.checked) {
          ifAnswered = true;
        } 
      });
      
      var spans = document.querySelectorAll("span[id='"+ this.id + "']");      
      if(!ifAnswered){
        spans.forEach(function(span) {
          span.innerHTML = "  未作答";
        });
      } else {
        spans.forEach(function(span) {
          span.innerHTML = "";
        });
      }      
        
      //console.log(this.id);
    }
    

    questionDiv.appendChild(br);    
    questionDiv.appendChild(myButton);
    var span = document.createElement("span");
    span.id = i;
    questionDiv.appendChild(span);


    // 在這題的末尾添加空白行
    var br = document.createElement('br');
    questionDiv.appendChild(br);

    my_form.appendChild(questionDiv);            
  }
  
  // 創建一個按鈕
  var button = document.createElement("button");

  // 設定按鈕的 type 屬性為 submit
  button.type = "submit";

  // 設定按鈕的文字內容為提交的ASCII
  button.innerText = "\u63d0\u4ea4";

  // 設定表單的 onsubmit 事件，以在提交時調用 checkAnswer 函式
  my_form.onsubmit = function() {
    checkAnswer(event, answers);
  };  
  
  // 將按鈕加入表單中
  my_form.appendChild(button);

  //把題目放進 questionsDiv
  questionsDiv.appendChild(my_form);
  document.body.appendChild(questionsDiv);

  //加入答對題數統計
  var p = document.createElement("p");
  p.innerHTML = "你答對：";

  // 產生一個 span 元素
  var span = document.createElement("span");

  // 設置 span 元素的 id 屬性為 "correct-count"
  span.id = "correct-count";

  // 把 span 元素添加到p中
  p.appendChild(span);
  p.innerHTML += "題"

  //把答題結果都放進 responseDiv
  var responseDiv = document.createElement("div");

  // 將 "response" 類別加入 div 元素中
  responseDiv.id = "responseDiv";
  responseDiv.classList.add("response");
  

  responseDiv.appendChild(p);

  //加入答錯題數統計
  var p = document.createElement("p");
  p.innerHTML = "你答錯：";

  // 產生一個 span 元素
  var span = document.createElement("span");

  // 設置 span 元素的 id 屬性為 "incorrect-count"
  span.id = "incorrect-count";

  // 把 span 元素添加到p中
  p.appendChild(span);
  p.innerHTML += "題"

  responseDiv.appendChild(p);
 
  //加入未答題數統計
  var p = document.createElement("p");
  p.innerHTML = "未答題數：";

  // 產生一個 span 元素
  var span = document.createElement("span");

  // 設置 span 元素的 id 屬性為 "unAnswered-count"
  span.id = "unAnswered-count";

  // 把 span 元素添加到p中
  p.appendChild(span);
  p.innerHTML += "題"

  responseDiv.appendChild(p);

  document.body.appendChild(responseDiv);
  

}


//檢查答案
function checkAnswer(event, answers) {
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
          // label.classList.add("correct");
          var questionDiv = label.parentNode;
          questionDiv.classList.remove("incorrect");
          questionDiv.classList.add("correct");

          // 在radio之前加上打勾符號，如果要在之後就用"afterend"
          // 如果之前有，就先把之前的勾勾刪掉
          var checkmark = radioInput.previousSibling;
          if (checkmark && checkmark.nodeType === Node.TEXT_NODE && checkmark.textContent === "✔") {
            radioInput.previousSibling.remove();
          }          
          if (checkmark && checkmark.nodeType === Node.TEXT_NODE && checkmark.textContent === "❌") {
            radioInput.previousSibling.remove();
          }                    
          radioInput.insertAdjacentText("beforebegin", "✔");


        } else {
          // 答案錯誤
          incorrect_count += 1;

          // 在radio之前加上打叉符號，如果要在之後就用"afterend"

          var checkmark = radioInput.previousSibling;
          if (checkmark && checkmark.nodeType === Node.TEXT_NODE && checkmark.textContent === "✔") {
            radioInput.previousSibling.remove();
          }          
          if (checkmark && checkmark.nodeType === Node.TEXT_NODE && checkmark.textContent === "❌") {
            radioInput.previousSibling.remove();
          }                    

          radioInput.insertAdjacentText("beforebegin", "❌");


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
          // label.classname = "incorrect";


          // 取得該選項的父元素，也就是 questionDiv
          var questionDiv = label.parentNode;
          // questionDiv.className = "incorrect";
          questionDiv.classList.remove("correct");
          questionDiv.classList.add("incorrect");

        }
      }

  });
  unAnswered_count = Object.keys(answers).length - correct_count -incorrect_count;
  document.querySelector('#unAnswered-count').innerHTML = unAnswered_count;
  document.querySelector('#correct-count').innerHTML = correct_count;
  document.querySelector('#incorrect-count').innerHTML = incorrect_count;

  //alert("score:" + score  );

  
}




var xhr = new XMLHttpRequest();
xhr.open('GET', '../data/database.csv', true);
xhr.onload = function() {
  if (xhr.status == 200) {
    // 讀取csv內容
    questions = handleResponse(xhr.responseText);
    
    // 創建一個包含章、節、概念和次概念的 chapters 物件
    chapters  = createChapter(questions);

    // 建立一個出處物件
    sources   = createSource(questions);

    // 建立下拉式選單，並篩選出題目
    createdfilteredQuestions(questions, chapters, sources);

  } else {
    // 請求失敗
  }
};
xhr.send();

