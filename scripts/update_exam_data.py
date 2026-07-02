#!/usr/bin/env parser_env
import os
import re
import sys
import argparse
import shutil
import requests
import pandas as pd
import matplotlib.pyplot as plt

# ----------------- CONFIGURATION & DICTS -----------------
SUBJECTS_MAP = {
    '自然': 'nature',
    '社會': 'society',
    '國文': 'chinese',
    '英語': 'english',
    '數學': 'math',
    '英語聽力': 'listen'
}

SUBJECTS_EN = ['Chinese', 'English', 'Math', 'Society', 'Nature']

# Standard column mapping based on vertical alignment coordinates in stats PDFs
COL_MAPPING = {
    1: '國文',
    2: '英語聽力',
    3: '英語',
    4: '數學',
    5: '社會',
    6: '自然'
}

# Pre-configured download links for years 112-115
DOWNLOAD_LINKS = {
    112: {
        'stats_pass': 'https://cap.rcpet.edu.tw/exam/112/112各科通過率.pdf',
        'stats_dis': 'https://cap.rcpet.edu.tw/exam/112/112各科鑑別度.pdf',
        'Chinese': 'https://cap.rcpet.edu.tw/exam/112/112P_Chinese.pdf',
        'English': 'https://cap.rcpet.edu.tw/exam/112/112P_English.pdf',
        'Math': 'https://cap.rcpet.edu.tw/exam/112/112P_Math.pdf',
        'Society': 'https://cap.rcpet.edu.tw/exam/112/112P_Society.pdf',
        'Nature': 'https://cap.rcpet.edu.tw/exam/112/112P_Nature.pdf',
    },
    113: {
        'stats_pass': 'https://drive.google.com/uc?export=download&id=1NpFiGL8A6KVR-Hyn_M7u1JhvXNOTqPOr',
        'stats_dis': 'https://drive.google.com/uc?export=download&id=1YOdEP_E1_m2AdpsFk5RnPhDndDrGJ--r',
        'Chinese': 'https://drive.google.com/uc?export=download&id=1Xr5AwMNQipYZblCEbZadyBvLVcT_8XSv',
        'English': 'https://drive.google.com/uc?export=download&id=1ZU8SG-4jdV1DGvPzpgzoi_hhRiD4NT3S',
        'Math': 'https://drive.google.com/uc?export=download&id=1MXfrOI_4KyxF6A-2NNd_J_eIuo3Epa46',
        'Society': 'https://drive.google.com/uc?export=download&id=1NJYibw-N2mHZP5lL8-rOhirWv_ZFQNiz',
        'Nature': 'https://drive.google.com/uc?export=download&id=1lO1_3Iq62BmTHR8m29or7I8VtS8qZdDR',
    },
    114: {
        'stats_pass': 'https://drive.google.com/uc?export=download&id=1hwzaBmzmD0sYPw4q1KVCBW6Vq5OviriH',
        'stats_dis': 'https://drive.google.com/uc?export=download&id=1deYp06C-xErJpmPGVHJ6T7hptfEkkJ70',
        'Chinese': 'https://drive.google.com/uc?export=download&id=102j8F3hoCvGgMCVP6x6oHN9cCd0R6_Ii',
        'English': 'https://drive.google.com/uc?export=download&id=1Or0bC16Jn2hA0uAF2zrryHoY46ywIQjK',
        'Math': 'https://drive.google.com/uc?export=download&id=1c2AGC67Bq344EdGSZkO9SZhrY50hHTJx',
        'Society': 'https://drive.google.com/uc?export=download&id=1vFl3qctoBXYcCtWbAqKUqhekIMgV6q-m',
        'Nature': 'https://drive.google.com/uc?export=download&id=18_lHom7zYhyOoMvxHt4hKJS_CynFOoZ1',
    },
    115: {
        'stats_pass': 'https://drive.google.com/uc?export=download&id=18wrAaXAakCwra1WXdS1HPxLDvPBlyp_S',
        'stats_dis': 'https://drive.google.com/uc?export=download&id=1460OoCkq7sKCUc1UqyQY01kJR3agO2eA',
        'Chinese': 'https://drive.google.com/uc?export=download&id=1FQtq4_a4GTsTKURdzPhDkKmONKRXtTJ9',
        'English': 'https://drive.google.com/uc?export=download&id=1pzRZpkZEBg4x7GNTAIrdfGJCxNSKgok-',
        'Math': 'https://drive.google.com/uc?export=download&id=1G-grfVw1NldMD3TRG-7Lco-yOuaoTKoK',
        'Society': 'https://drive.google.com/uc?export=download&id=1ITxBlFhNSIbg1u1C7FrU2ODk951wt-RT',
        'Nature': 'https://drive.google.com/uc?export=download&id=1ZJNPG9Wz3zuI8UkPGUY50URejxxZYmQ8',
    }
}

# Import pdfplumber inside functions to allow late imports
def get_pdfplumber():
    try:
        import pdfplumber
        return pdfplumber
    except ImportError:
        print("Error: 'pdfplumber' library is required to parse PDFs. Install it via: pip install pdfplumber")
        sys.exit(1)


# ----------------- 1. DOWNLOAD PHASE -----------------
def download_file(url, dest):
    print(f"  Downloading {url} -> {dest}...")
    try:
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            with open(dest, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"  Done. Size: {os.path.getsize(dest)} bytes")
            return True
        else:
            print(f"  Failed status code: {r.status_code}")
            return False
    except Exception as e:
        print(f"  Error downloading: {e}")
        return False

def handle_downloads(years):
    os.makedirs('會考題目', exist_ok=True)
    for year in years:
        print(f"\n[Download Phase] Checking files for year {year}...")
        if year not in DOWNLOAD_LINKS:
            print(f"  Warning: Year {year} is not pre-configured for automatic download.")
            print(f"  Please place question PDFs ('會考題目/{year}P_<Subject>.pdf') and stats PDFs manually.")
            continue
        
        links = DOWNLOAD_LINKS[year]
        
        # Stats Pass
        pass_dest = f"會考題目/{year}各科通過率.pdf"
        if not os.path.exists(pass_dest):
            download_file(links['stats_pass'], pass_dest)
        else:
            print(f"  {pass_dest} already exists, skipping download.")
            
        # Stats Dis
        dis_dest = f"會考題目/{year}各科鑑別度.pdf"
        if not os.path.exists(dis_dest):
            download_file(links['stats_dis'], dis_dest)
        else:
            print(f"  {dis_dest} already exists, skipping download.")
            
        # Subject PDFs
        for sub_en in SUBJECTS_EN:
            sub_dest = f"會考題目/{year}P_{sub_en}.pdf"
            if not os.path.exists(sub_dest):
                download_file(links[sub_en], sub_dest)
            else:
                print(f"  {sub_dest} already exists, skipping download.")


# ----------------- 2. PARSE STATS PHASE -----------------
def parse_pdf_stats(filename, year, statistical_type):
    pdfplumber = get_pdfplumber()
    records = []
    
    with pdfplumber.open(filename) as pdf:
        for page in pdf.pages:
            words = page.extract_words()
            rows = {}
            for w in words:
                matched_top = None
                for r_top in rows:
                    if abs(r_top - w['top']) <= 2:
                        matched_top = r_top
                        break
                if matched_top is None:
                    rows[w['top']] = [w]
                else:
                    rows[matched_top].append(w)
            
            for r_top, row_words in rows.items():
                row_words.sort(key=lambda x: x['x0'])
                if not row_words:
                    continue
                first_text = row_words[0]['text'].strip()
                if not first_text.isdigit():
                    continue
                
                q_num = int(first_text)
                if not (1 <= q_num <= 70):
                    continue
                
                for w in row_words[1:]:
                    text = w['text'].strip()
                    x_mid = (w['x0'] + w['x1']) / 2.0
                    
                    col_idx = None
                    if 90 <= x_mid < 147.5:
                        col_idx = 1
                    elif 147.5 <= x_mid < 228.5:
                        col_idx = 2
                    elif 228.5 <= x_mid < 311:
                        col_idx = 3
                    elif 311 <= x_mid < 366:
                        col_idx = 4
                    elif 366 <= x_mid < 408.5:
                        col_idx = 5
                    elif 408.5 <= x_mid:
                        col_idx = 6
                        
                    if col_idx is not None:
                        try:
                            val = float(text)
                            records.append({
                                '年度': year,
                                '類別': statistical_type,
                                '科目': COL_MAPPING[col_idx],
                                '題號': q_num,
                                '數值': val
                            })
                        except ValueError:
                            pass
                            
    return pd.DataFrame(records)


# ----------------- 3. PARSE QUESTIONS PHASE -----------------
def parse_pdf_questions(filename, year, subject_en):
    pdfplumber = get_pdfplumber()
    subject_mapping = {
        'Chinese': '國文',
        'English': '英語',
        'Math': '數學',
        'Society': '社會',
        'Nature': '自然'
    }
    
    with pdfplumber.open(filename) as pdf:
        text = ""
        # Skip cover page
        for page in pdf.pages[1:]:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
    # Prepend \n to match Q1 if it starts at the beginning
    text = "\n" + text
    matches = re.findall(r'(?=\n(\d{1,2}\.\s+.*?\(D\).*?\n))', text, re.DOTALL)
    
    records = []
    expected_q_num = 1
    for match in matches:
        q_num_match = re.match(r'^(\d{1,2})', match, re.DOTALL)
        if not q_num_match:
            continue
        q_num = int(q_num_match.group(1))
        
        if q_num == expected_q_num:
            if subject_en == 'English':
                cleaned_text = match.replace('\n', '').replace('\r', '').replace('　', '')
            else:
                cleaned_text = match.replace('\n', '').replace('\r', '').replace(' ', '').replace('　', '')
                
            records.append({
                '年度': year,
                '科目': subject_mapping[subject_en],
                '題號': q_num,
                '題目': cleaned_text
            })
            expected_q_num += 1
        
    return pd.DataFrame(records)


# ----------------- 4. MERGE & SPLIT DATA -----------------
def merge_and_save_data(years):
    print("\n[Parsing Phase] Processing downloaded PDFs...")
    
    # 4.1 Parse Stats
    stats_dfs = []
    for year in years:
        for t in ['通過率', '鑑別度']:
            fn = f"會考題目/{year}各科{t}.pdf"
            if not os.path.exists(fn):
                print(f"  Error: {fn} not found. Skipping statistics parsing for {year} {t}.")
                continue
            df = parse_pdf_stats(fn, year, t)
            stats_dfs.append(df)
            
    if not stats_dfs:
        print("  No statistics parsed. Skipping merge step.")
        return
        
    new_stats_df = pd.concat(stats_dfs, ignore_index=True)
    
    # Pivot Stats
    df_dis = new_stats_df[new_stats_df['類別'] == '鑑別度'].rename(columns={'數值': '鑑別度'})[['年度', '科目', '題號', '鑑別度']]
    df_pass = new_stats_df[new_stats_df['類別'] == '通過率'].rename(columns={'數值': '通過率'})[['年度', '科目', '題號', '通過率']]
    new_passing_df = pd.merge(df_pass, df_dis, on=['年度', '科目', '題號'])
    
    # 4.2 Parse Questions
    question_dfs = []
    for year in years:
        for sub_en in SUBJECTS_EN:
            fn = f"會考題目/{year}P_{sub_en}.pdf"
            if not os.path.exists(fn):
                print(f"  Error: {fn} not found. Skipping questions parsing for {year} {sub_en}.")
                continue
            df = parse_pdf_questions(fn, year, sub_en)
            question_dfs.append(df)
            
    if not question_dfs:
        print("  No questions parsed. Skipping merge step.")
        return
        
    new_question_df = pd.concat(question_dfs, ignore_index=True)
    
    # Merge Stats and Questions
    new_merged_df = pd.merge(new_question_df, new_passing_df, on=['年度', '科目', '題號'])
    
    # 4.3 Merge into master CSVs
    print("\n[Merge Phase] Merging new data into main repository CSV files...")
    os.makedirs('data', exist_ok=True)
    
    merge_configs = [
        # Master Stats
        {
            'old': 'data/整理後的通過率與鑑別度.csv',
            'new_df': new_stats_df,
            'sort_by': ['年度', '科目', '類別', '題號']
        },
        # Master Pivoted Stats
        {
            'old': 'data/合併後的通過率與鑑別度.csv',
            'new_df': new_passing_df,
            'sort_by': ['年度', '科目', '題號']
        },
        # Master Questions
        {
            'old': 'data/從pdf直存df.csv',
            'new_df': new_question_df,
            'sort_by': ['年度', '科目', '題號']
        }
    ]
    
    for item in merge_configs:
        old_path = item['old']
        df_new = item['new_df']
        sort_by = item['sort_by']
        
        if os.path.exists(old_path):
            df_old = pd.read_csv(old_path)
            df_comb = pd.concat([df_old, df_new], ignore_index=True)
        else:
            df_comb = df_new
            
        df_comb.drop_duplicates(subset=sort_by, keep='last', inplace=True)
        df_comb.sort_values(by=sort_by, inplace=True)
        df_comb.to_csv(old_path, index=False, encoding='utf-8-sig')
        print(f"  Merged {old_path} (Total rows: {len(df_comb)})")
        
    # Subject Specific CSVs
    for key, value in SUBJECTS_MAP.items():
        sub_path = f"data/{value}.csv"
        
        # Filter from new merged data
        sub_new_df = new_merged_df[new_merged_df['科目'] == key]
        sub_new_df = sub_new_df.rename(columns={
            '年度': 'year',
            '科目': 'subject',
            '題號': 'number',
            '題目': 'question',
            '鑑別度': 'dis',
            '通過率': 'pass'
        })
        
        if os.path.exists(sub_path):
            df_old = pd.read_csv(sub_path)
            df_comb = pd.concat([df_old, sub_new_df], ignore_index=True)
        else:
            df_comb = sub_new_df
            
        if df_comb.empty:
            df_comb = pd.DataFrame(columns=['year', 'subject', 'number', 'question', 'dis', 'pass'])
            
        df_comb.drop_duplicates(subset=['year', 'number'], keep='last', inplace=True)
        df_comb.sort_values(by=['year', 'number'], inplace=True)
        df_comb.to_csv(sub_path, index=False, encoding='utf-8')
        print(f"  Merged {sub_path} (Total rows: {len(df_comb)})")


# ----------------- 5. REGENERATE HTML REPORTS -----------------
def generate_html_reports():
    print("\n[HTML Generation Phase] Regenerating statistics report pages inside '統計/'...")
    os.makedirs('統計', exist_ok=True)
    
    # Load merged master databases
    questions_df = pd.read_csv('data/從pdf直存df.csv')
    passing_df = pd.read_csv('data/合併後的通過率與鑑別度.csv')
    
    new_df = pd.merge(questions_df, passing_df, on=['年度', '科目', '題號'])
    
    subjects = ['國文', '英語聽力', '數學', '英語', '社會', '自然']
    kinds = ['通過率', '鑑別度']
    
    for subject in subjects:
        for kind in kinds:
            htmlFileName = f'統計/統計_{subject}_{kind}.html'
            
            # Filter and sort
            html_df = new_df[new_df['科目'] == subject]
            html_df = html_df.sort_values(by=[kind], ascending=False)
            
            # Convert to HTML table
            html_table = html_df.to_html(index=False)
            
            with open(htmlFileName, 'w', encoding='utf-8') as myFile:
                myFile.write('<html>\n')
                myFile.write('<head>\n')
                myFile.write('  <meta charset="utf-8">\n')
                myFile.write(f'  <title>{subject}{kind}</title>\n')
                myFile.write('</head>\n')
                myFile.write('<body>\n')
                myFile.write(f'  <h2>{subject} - {kind} 統計排行</h2>\n')
                myFile.write(html_table)
                myFile.write('\n  <hr>\n')
                myFile.write('  <p style="page-break-after:always"></p>\n')
                myFile.write('</body>\n')
                myFile.write('</html>')
            print(f"  Updated {htmlFileName}")


# ----------------- 6. REGENERATE SCATTER PLOT & UPDATE README -----------------
def update_scatter_plot_and_readme():
    print("\n[Chart Generation Phase] Re-drawing scatter plot image...")
    
    passing_df = pd.read_csv('data/合併後的通過率與鑑別度.csv')
    subjects = ['國文', '英語', '數學', '社會', '自然', '英語聽力']
    
    # Detect latest year
    latest_year = int(passing_df['年度'].max())
    print(f"  Latest year detected: {latest_year}")
    
    # Set plotting font properties
    plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei', 'DFKai-SB', 'SimHei', 'Arial']
    plt.rcParams['axes.unicode_minus'] = False
    
    fig, ax = plt.subplots(2, 3, sharex=False, sharey=False)
    fig.set_figheight(8)
    fig.set_figwidth(10)
    
    title = f'103年至{latest_year}年會考各科通過率與鑑別度'
    
    for idx, sub in enumerate(subjects):
        i = idx // 3
        j = idx % 3
        
        ax[i, j].text(0.22, 0.74, sub, fontsize=18, ha='left')
        
        sub_df = passing_df[passing_df['科目'] == sub]
        x = sub_df['通過率']
        y = sub_df['鑑別度']
        
        ax[i, j].plot(x, y, marker='o', linestyle='', ms=3)
        ax[i, j].grid(True)
        ax[i, j].set_xlim([0.2, 1.0])
        ax[i, j].set_ylim([0.0, 0.8])
        
    fig.text(0.5, 0.07, '通過率', fontsize=18, ha='center', va='center')
    fig.text(0.07, 0.5, '鑑別度', fontsize=18, ha='center', va='center', rotation='vertical')
    fig.suptitle(title, fontsize=18, ha='center', va='center')
    
    # Clean up old chart images in root directory to avoid duplicates
    old_images = [f for f in os.listdir('.') if f.startswith('103年至') and f.endswith('年會考各科通過率與鑑別度.jpg')]
    for old_img in old_images:
        print(f"  Removing old chart file: {old_img}")
        try:
            os.remove(old_img)
        except Exception as e:
            print(f"  Failed to delete {old_img}: {e}")
            
    new_image_name = f'103年至{latest_year}年會考各科通過率與鑑別度.jpg'
    plt.savefig(new_image_name, dpi=150)
    print(f"  Saved new chart: {new_image_name}")
    
    # Update README.md reference
    if os.path.exists('README.md'):
        print("\n[README Phase] Updating scatter plot reference in README.md...")
        with open('README.md', 'r', encoding='utf-8') as f:
            readme_text = f.read()
            
        # Match pattern like: ![103年至XXX年會考各科通過率與鑑別度](./103年至XXX年會考各科通過率與鑑別度.jpg)
        pattern = r'\!\[103年至\d+年會考各科通過率與鑑別度\]\(\.\/103年至\d+年會考各科通過率與鑑別度\.jpg\)'
        replacement = f'![103年至{latest_year}年會考各科通過率與鑑別度](./{new_image_name})'
        
        if re.search(pattern, readme_text):
            updated_text = re.sub(pattern, replacement, readme_text)
            with open('README.md', 'w', encoding='utf-8') as f:
                f.write(updated_text)
            print(f"  Successfully updated README.md image link to {new_image_name}")
        else:
            print("  Warning: Could not find matching chart image link pattern in README.md to replace.")


# ----------------- MAIN PIPELINE -----------------
def main():
    parser = argparse.ArgumentParser(
        description="自動化更新國中會考題目與統計數據管線 (Auto-update CAP Exam Data Pipeline)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
範例使用 (Examples):
  # 處理並更新 112 至 115 年數據 (自動下載 + 解析 + 合併 + 產表)
  python scripts/update_exam_data.py --years 112 113 114 115

  # 如果 PDF 檔案已經手動下載，跳過下載步驟直接處理
  python scripts/update_exam_data.py --years 112 113 114 115 --skip-download
"""
    )
    
    parser.add_argument(
        '--years', 
        nargs='+', 
        type=int, 
        required=True, 
        help="要處理的會考年度列表 (如: 112 113 114 115)"
    )
    parser.add_argument(
        '--skip-download', 
        action='store_true', 
        help="跳過自動下載步驟，直接使用本地「會考題目/」下的 PDF 檔案"
    )
    
    args = parser.parse_args()
    
    # Step 1: Download
    if not args.skip_download:
        handle_downloads(args.years)
        
    # Step 2: Parse and Merge
    merge_and_save_data(args.years)
    
    # Step 3: Regenerate HTML reports
    generate_html_reports()
    
    # Step 4: Regenerate Chart & Update README
    update_scatter_plot_and_readme()
    
    print("\nPipeline completed successfully!")
    print("溫馨提醒：如果是新增 115 年以後的年度，請記得手動更新 d3/index.html 的年度下拉清單，並在 d3/js/main.js 中為新年度分配代表顏色。")

if __name__ == '__main__':
    main()
