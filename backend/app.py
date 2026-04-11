from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Backend is running 🚀"})

import re
from eda import perform_eda

def clean_dataset(df):
    report = []
    
    # 1. Drop completely empty rows/cols
    initial_rows = len(df)
    df.dropna(how='all', inplace=True)
    df.dropna(axis=1, how='all', inplace=True)
    if initial_rows - len(df) > 0:
        report.append(f"Removed {initial_rows - len(df)} empty rows.")
        
    # 2. Remove duplicates
    initial_rows = len(df)
    df.drop_duplicates(inplace=True)
    if initial_rows - len(df) > 0:
        report.append(f"Removed {initial_rows - len(df)} duplicates.")

    # 3. Clean column names
    df.columns = [str(c).strip().replace(' ', '_').upper() for c in df.columns]

    # Calculate initial missing stats
    missing_columns = {}
    total_nulls = 0
    for col in df.columns:
        col_nulls = int(df[col].isna().sum() + (df[col].astype(str).str.lower() == 'nan').sum())
        if col_nulls > 0:
            missing_columns[col] = col_nulls
            total_nulls += col_nulls

    stats = {
        "total_nulls": total_nulls,
        "missing_columns": missing_columns
    }

    # Helper for textual numbers
    word_to_num = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50
    }

    def robust_numeric(val):
        if pd.isna(val): return val
        v = str(val).lower().strip()
        if v in word_to_num: return word_to_num[v]
        cleaned = re.sub(r'[^\d.-]', '', v)
        if not cleaned or cleaned == '.' or cleaned == '-': return val
        try:
            return float(cleaned) if '.' in cleaned else int(cleaned)
        except ValueError:
            return val

    # 4. Process each column based on probable type
    for col in df.columns:
        sample = df[col].dropna().astype(str)
        if sample.empty: continue
        
        # Numeric columns
        if any(kw in col.lower() for kw in ['age', 'price', 'quantity', 'amount', 'total', 'id', 'kids', 'adults']):
            df[col] = df[col].apply(robust_numeric)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
            if not col.lower() in ['id']:
                # Abs negative values
                neg_count = (df[col] < 0).sum()
                if neg_count > 0:
                    df[col] = df[col].abs()
                    report.append(f"Fixed {neg_count} negative '{col}'.")
            
            # Fill missing with median
            missing = df[col].isna().sum()
            if missing > 0:
                median_val = df[col].median()
                if pd.isna(median_val): median_val = 0
                df[col] = df[col].fillna(median_val)
                report.append(f"Filled {missing} '{col}' (median {median_val}).")

        # Date columns
        elif 'date' in col.lower() or 'time' in col.lower() or 'day' in col.lower():
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.strftime('%Y-%m-%d')
            missing = df[col].isna().sum()
            if missing > 0:
                df[col] = df[col].fillna('Unknown Date')
                report.append(f"Fixed {missing} '{col}' dates.")
                
        # Email columns
        elif 'email' in col.lower():
            def clean_email(em):
                if pd.isna(em): return em
                em = str(em).strip().lower()
                if em.endswith('@'): em += 'gmail.com'
                if not re.match(r"[^@]+@[^@]+\.[^@]+", em): return None
                return em
            invalid_before = df[col].isna().sum()
            df[col] = df[col].apply(clean_email)
            new_invalid = df[col].isna().sum() - invalid_before
            if new_invalid > 0:
                df[col] = df[col].fillna('invalid@example.com')
                report.append(f"Fixed {new_invalid} '{col}' emails.")

        # Categorical/Text Columns
        else:
            def clean_text(text):
                if pd.isna(text) or str(text).lower() == 'nan': return 'Unknown'
                return str(text).strip().title()
            
            missing = df[col].isna().sum() + (df[col].astype(str).str.lower() == 'nan').sum()
            df[col] = df[col].apply(clean_text)
            if missing > 0:
                report.append(f"Filled {missing} missing '{col}'.")

    if not report:
        report.append("Data clean. No fixes required.")

    return df, report, stats

@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        df = pd.read_csv(file)
        
        # Perform Data Cleaning
        df, report, stats = clean_dataset(df)

        # Replace NaN with None so it becomes valid JSON null
        df = df.replace({np.nan: None})
        
        # Perform EDA after cleaning and converting NaNs
        eda_results = perform_eda(df)

        return jsonify({
            "columns": list(df.columns),
            "rows": df.to_dict(orient="records"),
            "total": len(df),
            "report": report,
            "stats": stats,
            "eda": eda_results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)