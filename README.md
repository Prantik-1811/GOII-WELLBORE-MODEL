# ROGII Wellbore Geology Prediction

This repository contains our solution and final iteration for the **Rogii Wellbore Geology Prediction** competition. 

## Project Overview

Our methodology shifts the predictive target from **absolute True Vertical Thickness (TVT)** to **TVT Drift**, centered on the last known data point prior to the evaluation gap.

The primary predictive signal is derived from the relative change in distance between the wellbore trajectory (Z) and various geological formation surfaces (such as ANCC, BUDA, etc.). By incorporating a **Momentum feature** (pre-gap slope) and utilizing **Linear Trees within a LightGBM framework**, we achieved a robust model that strongly respects the physical constraints and realities of horizontal drilling.

## Repository Structure

- `rogii-wellbore-geology-prediction (2).ipynb`: The core Jupyter Notebook containing the data processing, feature engineering, and LightGBM model implementation.
- `dashboard/`: A clean, vanilla HTML/JS web dashboard designed to visualize the TVT Drift predictions per wellbore. 
- `AI_wellbore_geology_prediction_task_en.pptx`: The presentation file explaining the methodology and results in detail.
- `sample_submission.csv`: A sample format of the prediction output.

> **Note:** The `train/` and `test/` data directories are excluded via `.gitignore` due to file size limits. Please download them from the competition page and place them in the root directory to run the notebook.

## Dashboard Visualization

To visualize the results without needing a local web server:
1. Open the `dashboard` folder.
2. Double-click on `index.html` to open it in your default web browser.
3. The dashboard will automatically read from `dashboard/data.js` to plot the TVT drift profile for each well ID.

### Updating Dashboard Data

If you run the Jupyter Notebook to generate new predictions and want the dashboard to automatically update, append the following code snippet to the very end of the notebook:

```python
# Assuming your final output is saved to 'submission.csv'
with open('submission.csv', 'r') as f:
    csv_content = f.read()

# Overwrite the dashboard's javascript data file to bypass browser local-file CORS
with open('dashboard/data.js', 'w') as f:
    f.write(f'const windowCsvData = `{csv_content}`;')
```

## Tech Stack
- **Data Science:** Python, pandas, LightGBM, Linear Trees.
- **Frontend Dashboard:** HTML5, CSS3, JavaScript (Chart.js).
