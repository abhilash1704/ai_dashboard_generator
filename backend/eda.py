import pandas as pd
import numpy as np

def perform_eda(df):
    """
    Performs Exploratory Data Analysis on a pandas DataFrame.
    Returns the results in a dictionary format.
    """
    
    eda_results = {}
    
    # 1. Dataset Overview
    total_rows = len(df)
    total_columns = len(df.columns)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    date_cols = df.select_dtypes(include=['datetime', 'datetimetz']).columns.tolist()
    # Consider remaining object/category as categorical
    categorical_cols = [col for col in df.columns if col not in numeric_cols and col not in date_cols]
    
    total_missing = int(df.isna().sum().sum())
    
    eda_results['overview'] = {
        'total_rows': total_rows,
        'total_columns': total_columns,
        'number_of_numeric_columns': len(numeric_cols),
        'number_of_categorical_columns': len(categorical_cols),
        'number_of_date_columns': len(date_cols),
        'total_missing_values': total_missing
    }
    
    # 2. Column Data Types
    eda_results['column_types'] = {col: str(dtype) for col, dtype in df.dtypes.items()}
    
    # 3. Missing Value Analysis
    missing_analysis = {}
    missing_pct_analysis = {}
    
    for col in df.columns:
        missing_count = int(df[col].isna().sum())
        missing_pct = round((missing_count / total_rows * 100), 2) if total_rows > 0 else 0.0
        missing_analysis[col] = missing_count
        missing_pct_analysis[col] = missing_pct
        
    eda_results['missing_values'] = missing_analysis
    eda_results['missing_values_percentage'] = missing_pct_analysis
    
    # 4. Numerical Statistics
    numerical_stats = {}
    if numeric_cols:
        desc = df[numeric_cols].describe().T
        for col in numeric_cols:
            numerical_stats[col] = {
                'mean': float(desc.loc[col, 'mean']) if not pd.isna(desc.loc[col, 'mean']) else None,
                'median': float(df[col].median()) if not pd.isna(df[col].median()) else None,
                'min': float(desc.loc[col, 'min']) if not pd.isna(desc.loc[col, 'min']) else None,
                'max': float(desc.loc[col, 'max']) if not pd.isna(desc.loc[col, 'max']) else None,
                'std': float(desc.loc[col, 'std']) if not pd.isna(desc.loc[col, 'std']) else None
            }
    eda_results['numerical_statistics'] = numerical_stats
    
    # 5. Unique Values
    unique_values = {}
    for col in df.columns:
        unique_values[col] = int(df[col].nunique(dropna=True))
    eda_results['unique_values'] = unique_values
    
    # 6. Top Categories
    top_categories = {}
    for col in categorical_cols:
        counts = df[col].value_counts(dropna=True).head(5)
        top_categories[col] = counts.to_dict()
    eda_results['top_categories'] = top_categories
    
    # 7. Correlation Analysis
    correlation_matrix = {}
    if len(numeric_cols) > 1:
        corr = df[numeric_cols].corr()
        for idx in corr.index:
            correlation_matrix[idx] = {col: float(corr.loc[idx, col]) if not pd.isna(corr.loc[idx, col]) else None for col in corr.columns}
    eda_results['correlation_analysis'] = correlation_matrix
    
    return eda_results
