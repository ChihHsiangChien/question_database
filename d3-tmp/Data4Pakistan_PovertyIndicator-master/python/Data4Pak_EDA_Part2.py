# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
from IPython import get_ipython

# %%
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
# get_ipython().run_line_magic('matplotlib', 'inline')
# pd.set_option('display.max_columns', 500)


# %%
df = pd.read_csv("data/updatedData.csv")


# %%
# df.info()


# %%
# df.head()


# %%
# set categorical data
df['Province'] = df['Province'].astype(str).str.strip().astype('category')
df['District'] = df['District'].astype(str).str.strip().astype('category')


# set datetime data
df['Year'] = pd.to_datetime(df['Year'], format='%Y')


# %%
 df.head()


# %%
# Get all unique values in Province:
uniqueProvNames = df['Province'].unique()

# Get all unique values in Year:
uniqueYears = df['Year'].unique()


# %%
# uniqueYears


# %%
# Creating seperate province-level datasets for 2014:
dfBaloch = df[(df['Province'] == 'Balochistan') & (
    df['Year'] == "2014-01-01T00:00:00.000000000")]
dfFedCapital = df[(df['Province'] == 'Federal Capital Territory') & (
    df['Year'] == "2014-01-01T00:00:00.000000000")]
dfKPK = df[(df['Province'] == 'Khyber Pakhtunkhwa') & (
    df['Year'] == "2014-01-01T00:00:00.000000000")]
dfPunjab = df[(df['Province'] == 'Punjab') & (
    df['Year'] == "2014-01-01T00:00:00.000000000")]
dfSindh = df[(df['Province'] == 'Sindh') & (
    df['Year'] == "2014-01-01T00:00:00.000000000")]


# %%
dfSindh.describe()


# %%
# Detect outliers:
#sns.boxplot(x=dfSindh['Poverty Rate (%)'])


# %%
#sns.boxplot(x=dfFedCapital['Poverty Rate (%)'])
#sns.boxplot(x=dfKPK['Poverty Rate (%)'])
#sns.boxplot(x=dfPunjab['Poverty Rate (%)'])
#sns.boxplot(x=dfSindh['Poverty Rate (%)'])
#Q1_Baloch = dfBaloch.quantile(.25)
#Q3_Baloch = dfBaloch.quantile(.75)
#IQR_Baloch = Q3_Baloch-Q1_Baloch
# print(IQR_Baloch)


# %%
# Finding the relations between the variables.
# plt.figure(figsize=(40,20))
#c= dfKPK.corr()
#heatmapProvince = sns.heatmap(c,cmap= 'coolwarm',linewidths=.5, linecolor='black',annot = True, fmt='.1g')


# %%
# Save correlation heatmap:
#figure = heatmapProvince.get_figure()
#figure.savefig('svm_conf.png', dpi=400)


# %%
# Correlations with poverty:

# Baloch:
# strong negative with Adult Literacy; -0.8
# No strong positive correlations

# KPK:
# strong negative correlation with Youth literacy; -0.9
# strong positive correlation with HH Dependency Ratio, over-crowding; 0.8

# Punjab:
# Strong negative correlation with Net School Enrollment - Middle School, Youth Literacy,
# Adult Literacy, Primary Completion Rate; -0.9
# Strong positive correlation with Overcrowding, Child Labor; 0.9.

# Sindh:
# Strong negative correlation with Employment in Svc, Youth Literacy, Primary Completion Rate,
# Adult Literacy Gender Parity; -0.9
# Stronger negative correlation with Adult Literacy; -1
# Strong postive correlation with Employment in Ag; 0.9


# %%
# START HERE:
# Build viz based on Adult Literacy (switch out with other Indicators with decreasing levels of correlation) across Provinces, Years.
# Similar to Gap Minder?
# x-axis = Literacy, y-axis = poverty, circle = District grouped/colored by Province and size represents what?


# %%
# Create a subset of the df with only 4 cols: Province, District, Year, Adult Literacy, POverty
dfPovertyAdultLit = df.loc[:, ['Province', 'District', 'Year',
                               'Poverty Rate (%)', 'Adult literacy, 25 or more years old (% of population aged 25 or more)']]


# %%
# dfPovertyAdultLit - save to Dropbox:
dfPovertyAdultLit.to_csv(
    r'data\dfPovertyAdultLit.csv', index=False, header=True)


# %%
# Create a subset of the df with only 4 cols: Province, District, Year, Mobile Phone Ownership, POverty
dfPovertyMobileOwn = df.loc[:, ['Province', 'District', 'Year',
                                'Poverty Rate (%)', 'Households\' mobile phone ownership (% of population)']]


# %%
# dfPovertyAdultLit - save to Dropbox:
dfPovertyMobileOwn.to_csv(
    r'data\dfPovertyMobileOwn.csv', index=False, header=True)


# %%
