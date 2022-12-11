import csv
import random

# 讀取 CSV 檔案
with open('questions.csv') as csv_file:
    reader = csv.reader(csv_file)
    # 建立一個空的題目列表
    questions = []
    # 從第二行（第一行是標題行）開始讀取題目
    for row in reader[1:]:
        # 建立一個題目字典，將每一列的值存儲到字典中
        question = {
            'title': row[0],
            'option_a': row[1],
            'option_b': row[2],
            'option_c': row[3],
            'option_d': row[4],
            'answer': row[5],
            'title_image': row[6],
            'option_a_image': row[7],
            'option_b_image': row[8],
            'option_c_image': row[9],
            'option_d_image': row[10]
        }
        # 將題目字典添加到題目列表中
        questions.append(question)
        
def generate_html(questions):
    # 將題目列表亂數排序
    random.shuffle(questions)
    # 定義 HTML 文件的模板字符串
    html_template = '
            <!DOCTYPE html>
            <html>
            <head>
                <title>答題程式</title>
                <style>
                    /* 定義答題結果的樣式 */
                    .correct {
                        color: green;
                    }
                    .incorrect {
                        color: red;
                    }
                    /* 定義答錯時題幹的樣式 */
                   .incorrect div {
                        background-color: red;
                    }
                </style>
                
                <script>
                    function random_sort(a, b) {
                        // 生成一個隨機的浮點數
                        var r = Math.random();
                        // 如果隨機數小於 0.5，則返回 -1，使 a 在 b 的前面
                        if (r < 0.5) {
                            return -1;
                        }
                        // 否則返回 1，使 b 在 a 的前面
                        else {
                            return 1;
                        }
                    }
                </script>
                
            </head>
            <body>
                <h1>答題程式</h1>
                <form>
                    {% for question in questions %}
                    
                    <!-- 將題幹的 div 元素的 class 設置為「incorrect」 -->
                    <div class="incorrect">            
                    
                        <!-- 顯示題目的標題和圖片 -->
                        <h2>{{ question.title }}</h2>
                        {% if question.title_image %}
                            <img src="{{ question.title_image }}" alt="{{ question.title }}">
                        {% endif %}
                        <!-- 顯示題目的選項 -->
                        <ul>
                            <li><input type="radio" name="{{ question.id }}" value="A"> {{ question.option_a }}</li>
                            <li><input type="radio" name="{{ question.id }}" value="B"> {{ question.option_b }}</li>
                            <li><input type="radio" name="{{ question.id }}" value="C"> {{ question.option_c }}</li>
                            <li><input type="radio" name="{{ question.id }}" value="D"> {{ question.option_d }}</li>
                        </ul>
                        <!-- 顯示題目的答案 -->
                        <p>正確答案：{{ question.answer }}</p>
                    </div>
                    {% endfor %}
                    <!-- 顯示答題結果 -->
                    <p>您答對了 <span id="correct-count">0</span> 題。</p>
                    <p>您答錯了 <span id="incorrect-count">0</span> 題。</p>
                </form>
                <script>
	        // 定義一個函數來檢查用戶的答案是否正確
	            function check_answers() {
		        // 初始化答對和答錯的題數
		        var correct_count = 0;
		        var incorrect_count = 0;
		        // 遍歷所有的題目
		        for (var i = 0; i < questions.length; i++) {
		            var question = questions[i];
		            // 檢查用戶選擇的答案是否正確
		            var user_answer = document.querySelector('input[name="' + question.id + '"]:checked').value;
		            if (user_answer === question.answer) {
		                // 答對了，將答對的題數加一
		                correct_count += 1;
		            } else {
		                // 答錯了，將答錯的題數加一
		                incorrect_count += 1;
		                // 將答錯的題目的 div 元素的 class 設置為「incorrect」
                                document.querySelector('#' + question.id).classList.add('incorrect');
		            }
		        }
		        // 更新答題結果
		        document.querySelector('#correct-count').innerHTML = correct_count;
		        document.querySelector('#incorrect-count').innerHTML = incorrect_count;
	            }
	            // 當用戶點擊提交按鈕時檢查答案
	            document.querySelector('button').addEventListener('click', check_answers);
	        </script>
            </body>
            </html>
    '    
    # 將模板字符串中的占位符替換成實際數據
    html = html_template.render(questions=questions)    
    return html
# 讀取 CSV 檔案並生成題目列表
questions = read_csv('questions.csv')
# 生成 HTML 文件
html = generate_html(questions)
# 寫入 HTML 文件
with open('questions.html', 'w') as html_file:
    html_file.write(html)
