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

## How to Run & Display Results

**1. Set up the Data**
The `train/` and `test/` data directories are excluded from this repository via `.gitignore` due to file size limits. 
- Download the competition dataset from Kaggle.
- Extract the `train` and `test` folders directly into the root directory of this project.

**2. Run the Predictive Model**
- Open `rogii-wellbore-geology-prediction (2).ipynb` in Jupyter Notebook, JupyterLab, or your preferred IDE.
- Ensure you have the required Python packages installed (e.g., `pandas`, `lightgbm`).
- Run all cells in the notebook. This will process the data, train the model, and generate your predictions.

**3. Visualize the Results**
You can visually evaluate the predicted TVT drift profiles using the included custom dashboard. No local web server is required!
- Navigate to the `dashboard/` folder.
- Double-click on `index.html` to open it in your default web browser.
- The dashboard will automatically read the data from `dashboard/data.js` and plot the results for each well.

### Updating Dashboard Data

If you generate new predictions in the notebook and want the dashboard to automatically update, append the following code snippet to the very end of your notebook. This will overwrite the dashboard's javascript data file and gracefully bypass browser local-file CORS restrictions:

```python
# Assuming your final output is saved to 'submission.csv'
with open('submission.csv', 'r') as f:
    csv_content = f.read()

# Overwrite the dashboard's javascript data file
with open('dashboard/data.js', 'w') as f:
    f.write(f'const windowCsvData = `{csv_content}`;')
```

## Tech Stack
- **Data Science:** Python, pandas, LightGBM, Linear Trees.
- **Frontend Dashboard:** HTML5, CSS3, JavaScript (Chart.js).
