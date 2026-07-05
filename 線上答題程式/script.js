// Premium Javascript Logic for online quiz application

// Global state variables
var allQuestions = [];
var currentQuestions = [];
var chapters = {};
var sources = [];

// Helper to clean fields and strip double quotes
function cleanField(val) {
    if (!val) return '';
    val = val.trim();
    if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
    }
    return val.replace(/""/g, '"');
}

// Parse CSV content correctly
function handleResponse(csvText) {
    var lines = csvText.split('\n');
    var questions = [];
    
    // Skip header row
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;
        
        var data = line.split(',');
        
        // Ensure we have enough columns
        if (data.length < 24) continue;
        
        var chapter    = cleanField(data[1]);
        var section    = cleanField(data[2]);
        var concept    = cleanField(data[3]);
        var subconcept = cleanField(data[4]);
        var height     = cleanField(data[10]);
        var question   = cleanField(data[11]);
        var image1     = cleanField(data[12]);
        var image2     = cleanField(data[13]);
        var optionA    = cleanField(data[14]);
        var optionB    = cleanField(data[15]);      
        var optionC    = cleanField(data[16]);            
        var optionD    = cleanField(data[17]);
        var imageA     = cleanField(data[18]);      
        var imageB     = cleanField(data[19]);
        var imageC     = cleanField(data[20]);      
        var imageD     = cleanField(data[21]);          
        var source     = cleanField(data[22]);
        var answer     = cleanField(data[23]);
        var discriminant = cleanField(data[25]);
        var correctRate  = cleanField(data[26]);

        questions.push({
            chapter: chapter,
            section: section,
            concept: concept,
            subconcept: subconcept,
            height: height,
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
        });
    }
    return questions;
}

// Generate nested chapters, sections, concepts object map
function createChapterMap(questions) {
    var map = {};
    questions.forEach(function(q) {
        var ch = q.chapter;
        var sec = q.section;
        var con = q.concept;
        
        if (!ch) return;
        if (!map[ch]) {
            map[ch] = {};
        }
        if (!sec) return;
        if (!map[ch][sec]) {
            map[ch][sec] = [];
        }
        if (con && map[ch][sec].indexOf(con) === -1) {
            map[ch][sec].push(con);
        }
    });
    return map;
}

// Generate sorted source list
function createSourceList(questions) {
    var list = [];
    questions.forEach(function(q) {
        var src = q.source;
        if (src && list.indexOf(src) === -1) {
            list.push(src);
        }
    });
    
    // Sort in reverse order (e.g. 115 first, down to 090)
    list.sort(function(a, b) {
        return b.localeCompare(a);
    });
    return list;
}

// Bind dropdowns and set filters
function setupFilterControls() {
    var chaptersSelect = document.getElementById("chaptersSelect");
    var sectionsSelect = document.getElementById("sectionsSelect");
    var conceptsSelect = document.getElementById("conceptsSelect");
    var sourcesSelect = document.getElementById("sourcesSelect");
    
    // Tab switching logic
    var tabChapterBtn = document.getElementById("tabChapterBtn");
    var tabSourceBtn = document.getElementById("tabSourceBtn");
    var chapterFilterGroup = document.getElementById("chapterFilterGroup");
    var sourceFilterGroup = document.getElementById("sourceFilterGroup");
    
    tabChapterBtn.onclick = function() {
        tabChapterBtn.classList.add("active");
        tabSourceBtn.classList.remove("active");
        chapterFilterGroup.classList.remove("hide");
        sourceFilterGroup.classList.add("hide");
        // Trigger render for chapter filter
        conceptsSelect.onchange();
    };
    
    tabSourceBtn.onclick = function() {
        tabSourceBtn.classList.add("active");
        tabChapterBtn.classList.remove("active");
        sourceFilterGroup.classList.remove("hide");
        chapterFilterGroup.classList.add("hide");
        // Trigger render for source filter
        sourcesSelect.onchange();
    };

    // 1. Populate Chapters
    chaptersSelect.innerHTML = "";
    var sortedChs = Object.keys(chapters).sort(function(a, b) {
        return a.localeCompare(b, "zh-Hant");
    });
    sortedChs.forEach(function(ch) {
        chaptersSelect.add(new Option(ch, ch));
    });
    
    // Bind Chapter Change
    chaptersSelect.onchange = function() {
        var selectedCh = this.value;
        var sections = chapters[selectedCh] || {};
        
        sectionsSelect.innerHTML = "";
        var sortedSecs = Object.keys(sections).sort(function(a, b) {
            return a.localeCompare(b, "zh-Hant");
        });
        sortedSecs.forEach(function(sec) {
            sectionsSelect.add(new Option(sec, sec));
        });
        sectionsSelect.onchange();
    };
    
    // Bind Section Change
    sectionsSelect.onchange = function() {
        var selectedCh = chaptersSelect.value;
        var selectedSec = this.value;
        var concepts = (chapters[selectedCh] && chapters[selectedCh][selectedSec]) ? chapters[selectedCh][selectedSec] : [];
        
        conceptsSelect.innerHTML = "";
        concepts.forEach(function(con) {
            conceptsSelect.add(new Option(con, con));
        });
        conceptsSelect.onchange();
    };
    
    // Bind Concept Change (Triggers Filtering & Rendering)
    conceptsSelect.onchange = function() {
        var selectedCh = chaptersSelect.value;
        var selectedSec = sectionsSelect.value;
        var selectedCon = this.value;
        
        currentQuestions = allQuestions.filter(function(q) {
            return q.chapter === selectedCh && q.section === selectedSec && q.concept === selectedCon;
        });
        
        // Sort by source descending
        currentQuestions.sort(function(a, b) {
            return b.source.localeCompare(a.source);
        });
        
        renderHtml(currentQuestions);
    };
    
    // 2. Populate Sources
    sourcesSelect.innerHTML = "";
    sources.forEach(function(src) {
        sourcesSelect.add(new Option(src, src));
    });
    
    // Bind Source Change (Triggers Filtering & Rendering)
    sourcesSelect.onchange = function() {
        var selectedSrc = this.value;
        currentQuestions = allQuestions.filter(function(q) {
            return q.source === selectedSrc;
        });
        
        // Sort by Chapter
        currentQuestions.sort(function(a, b) {
            return a.chapter.localeCompare(b.chapter);
        });
        
        renderHtml(currentQuestions);
    };
    
    // Initialize the first dropdown state
    chaptersSelect.onchange();
}

// Render Questions to DOM
function renderHtml(questions) {
    var countEl = document.getElementById("questionsCount");
    var container = document.getElementById("questionsContainer");
    
    // Reset Scoreboard values on render
    resetScoreboard();
    
    if (questions.length === 0) {
        countEl.innerHTML = "無符合條件的題目";
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-circle-info"></i>
                <p>在此分類下找不到任何試題</p>
            </div>`;
        return;
    }
    
    countEl.innerHTML = `本單元共 ${questions.length} 題`;
    container.innerHTML = "";
    
    var form = document.createElement("form");
    form.id = "quizForm";
    
    questions.forEach(function(q, i) {
        var qCard = document.createElement("div");
        qCard.className = "question";
        qCard.id = "q_card_" + i;
        
        // Badge metadata header
        var headerHtml = `<h2>${i + 1}</h2>`;
        headerHtml += `<div class="question-meta">`;
        headerHtml += `<span class="meta-badge"><i class="fa-solid fa-tag"></i> ${q.source}</span>`;
        if (q.correctRate) {
            headerHtml += `<span class="meta-badge"><i class="fa-solid fa-percent"></i> 通過率: ${q.correctRate}</span>`;
        }
        if (q.discriminant) {
            headerHtml += `<span class="meta-badge"><i class="fa-solid fa-chart-simple"></i> 鑑別度: ${q.discriminant}</span>`;
        }
        headerHtml += `</div>`;
        
        qCard.innerHTML = headerHtml;
        
        // Question Stem text
        var stemEl = document.createElement("div");
        stemEl.className = "question-text";
        stemEl.innerText = q.question;
        qCard.appendChild(stemEl);
        
        // Question stem images
        if (q.image1 || q.image2) {
            var imgBlock = document.createElement("div");
            imgBlock.className = "question-images";
            if (q.image1) {
                var img = document.createElement("img");
                img.src = "../image/" + q.image1 + ".jpg";
                imgBlock.appendChild(img);
            }
            if (q.image2) {
                var img = document.createElement("img");
                img.src = "../image/" + q.image2 + ".jpg";
                imgBlock.appendChild(img);
            }
            qCard.appendChild(imgBlock);
        }
        
        // Options List Block
        var optList = document.createElement("div");
        optList.className = "options-list";
        
        var mappingTable = ["A", "B", "C", "D"];
        q.options.forEach(function(opt, j) {
            var item = document.createElement("div");
            item.className = "option-item";
            item.id = "opt_item_" + i + "_" + j;
            
            // Radio input
            var radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "q_" + i;
            radio.value = j;
            radio.id = "radio_" + i + "_" + j;
            item.appendChild(radio);
            
            // Label contents
            var label = document.createElement("label");
            label.className = "option-label";
            label.htmlFor = "radio_" + i + "_" + j;
            
            var textSpan = document.createElement("span");
            textSpan.innerHTML = `(${mappingTable[j]}) ${opt.optionText}`;
            label.appendChild(textSpan);
            
            if (opt.image) {
                var oImg = document.createElement("img");
                oImg.className = "option-img";
                oImg.src = "../image/" + opt.image + ".jpg";
                label.appendChild(oImg);
            }
            
            item.appendChild(label);
            
            // Allow clicking item container to check radio
            item.onclick = function(e) {
                if (e.target !== radio) {
                    radio.click();
                }
            };
            
            optList.appendChild(item);
        });
        qCard.appendChild(optList);
        
        // Single Check button at card bottom
        var btnRow = document.createElement("div");
        btnRow.style.display = "flex";
        btnRow.style.justifyContent = "space-between";
        btnRow.style.alignItems = "center";
        
        var checkBtn = document.createElement("button");
        checkBtn.type = "button";
        checkBtn.className = "btn btn-check";
        checkBtn.innerHTML = `<i class="fa-solid fa-circle-question"></i> 單題檢查`;
        checkBtn.onclick = function() {
            checkSingleQuestion(i, q.answer);
        };
        btnRow.appendChild(checkBtn);
        
        var spanStatus = document.createElement("span");
        spanStatus.id = "q_status_" + i;
        spanStatus.style.fontSize = "0.9rem";
        spanStatus.style.fontWeight = "bold";
        btnRow.appendChild(spanStatus);
        
        qCard.appendChild(btnRow);
        form.appendChild(qCard);
    });
    
    // Large Global Submit Button
    var submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-submit";
    submitBtn.innerHTML = `<i class="fa-solid fa-file-signature"></i> 提交整份考卷`;
    form.appendChild(submitBtn);
    
    form.onsubmit = function(event) {
        event.preventDefault();
        checkAllQuestions();
    };
    
    container.appendChild(form);
}

// Check single question instantly
function checkSingleQuestion(index, correctAnswer) {
    var mappingTable = ["A", "B", "C", "D"];
    var radioGroup = document.getElementsByName("q_" + index);
    var statusSpan = document.getElementById("q_status_" + index);
    var qCard = document.getElementById("q_card_" + index);
    
    var checkedIndex = -1;
    for (var j = 0; j < radioGroup.length; j++) {
        if (radioGroup[j].checked) {
            checkedIndex = j;
            break;
        }
    }
    
    if (checkedIndex === -1) {
        statusSpan.style.color = "#fbbf24";
        statusSpan.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> 請先選擇一個選項`;
        return;
    }
    
    // Reset previous styles
    qCard.classList.remove("correct", "incorrect");
    for (var j = 0; j < 4; j++) {
        var optItem = document.getElementById("opt_item_" + index + "_" + j);
        optItem.classList.remove("correct-answer", "incorrect-choice");
        // Remove old symbols
        var oldIcon = optItem.querySelector(".status-icon");
        if (oldIcon) oldIcon.remove();
    }
    
    var chosenAnswer = mappingTable[checkedIndex];
    if (chosenAnswer === correctAnswer) {
        qCard.classList.add("correct");
        statusSpan.style.color = "#10b981";
        statusSpan.innerHTML = `<i class="fa-solid fa-circle-check"></i> 答對了！`;
        
        // Add checkmark next to chosen option
        var chosenItem = document.getElementById("opt_item_" + index + "_" + checkedIndex);
        chosenItem.classList.add("correct-answer");
        var icon = document.createElement("span");
        icon.className = "status-icon correct";
        icon.innerHTML = `<i class="fa-solid fa-check"></i>`;
        chosenItem.appendChild(icon);
    } else {
        qCard.classList.add("incorrect");
        statusSpan.style.color = "#ef4444";
        statusSpan.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> 答錯了！正確答案是 (${correctAnswer})`;
        
        // Highlight incorrect choice
        var chosenItem = document.getElementById("opt_item_" + index + "_" + checkedIndex);
        chosenItem.classList.add("incorrect-choice");
        var badIcon = document.createElement("span");
        badIcon.className = "status-icon incorrect";
        badIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        chosenItem.appendChild(badIcon);
        
        // Highlight correct answer in green outline
        var correctItemIndex = mappingTable.indexOf(correctAnswer);
        if (correctItemIndex !== -1) {
            var correctItem = document.getElementById("opt_item_" + index + "_" + correctItemIndex);
            correctItem.classList.add("correct-answer");
            var goodIcon = document.createElement("span");
            goodIcon.className = "status-icon correct";
            goodIcon.innerHTML = `<i class="fa-solid fa-check"></i>`;
            correctItem.appendChild(goodIcon);
        }
    }
    
    updateLiveScoreboard();
}

// Check all questions on submit
function checkAllQuestions() {
    currentQuestions.forEach(function(q, i) {
        checkSingleQuestion(i, q.answer);
    });
}

// Reset stats display
function resetScoreboard() {
    document.getElementById("correct-count").innerText = "0";
    document.getElementById("incorrect-count").innerText = "0";
    document.getElementById("unAnswered-count").innerText = currentQuestions.length;
    
    var circle = document.getElementById("scoreCircle");
    var percentText = document.getElementById("scorePercent");
    
    percentText.innerText = "0%";
    circle.style.background = `radial-gradient(closest-side, #ffffff 79%, transparent 80% 100%),
                                conic-gradient(#4f46e5 0%, rgba(0,0,0,0.05) 0)`;
}

// Calculate scoreboard stats in real-time
function updateLiveScoreboard() {
    var mappingTable = ["A", "B", "C", "D"];
    var correctCount = 0;
    var incorrectCount = 0;
    var unansweredCount = 0;
    
    currentQuestions.forEach(function(q, i) {
        var radioGroup = document.getElementsByName("q_" + i);
        var checkedIndex = -1;
        for (var j = 0; j < radioGroup.length; j++) {
            if (radioGroup[j].checked) {
                checkedIndex = j;
                break;
            }
        }
        
        if (checkedIndex === -1) {
            unansweredCount++;
        } else {
            var chosenAnswer = mappingTable[checkedIndex];
            if (chosenAnswer === q.answer) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        }
    });
    
    document.getElementById("correct-count").innerText = correctCount;
    document.getElementById("incorrect-count").innerText = incorrectCount;
    document.getElementById("unAnswered-count").innerText = unansweredCount;
    
    // Update conic progress circle
    var total = currentQuestions.length;
    var pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
    var circle = document.getElementById("scoreCircle");
    var percentText = document.getElementById("scorePercent");
    
    percentText.innerText = pct + "%";
    
    // Conic gradient mapping
    circle.style.background = `radial-gradient(closest-side, #ffffff 79%, transparent 80% 100%),
                                conic-gradient(#10b981 ${pct}%, rgba(0,0,0,0.05) ${pct}% 100%)`;
}

// Initialize AJAX loading of database.csv
var xhr = new XMLHttpRequest();
xhr.open('GET', '../data/database.csv', true);
xhr.onload = function() {
    if (xhr.status == 200) {
        allQuestions = handleResponse(xhr.responseText);
        chapters     = createChapterMap(allQuestions);
        sources      = createSourceList(allQuestions);
        
        setupFilterControls();
    } else {
        console.error("Failed to load question database.");
    }
};
xhr.send();
