# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd
import numpy as np
from random import sample


# %%
data = pd.read_csv("data\Data4Pakistan-AllData.csv")


# %%
# Create a copy of dataset:
dataManip = data


# %%
to_drop = ['Number of poor (1,000s)', 'Diarrhea incidence (% of children under 5)',
           'Diarrhea treatment- ORS (% of children under 5 who had diarrhea during a 30-day recall period)',
           'Pregnant women receiving antenatal care (% of women  aged 15-49 who gave birth in last 3 years)',
           'Assisted birth at healthcare facility (% of women aged 15-49 who gave birth in last 3 years)',
           'Immunization, fully immunized (% children 12-24 months)',
           'Immunization, polio three doses (% children 12-24 months)',
           'Immunization, DPT three doses (% children 12-24 months)', 'Access to improved drinking water (% of population).1',
           'Access to piped water (% of population).1',
           'Access to motorized pump (% of population)',
           'Access to hand pump (% of population)',
           'Access to improved drinking water, excl. piped water (% of population).1',
           'Access to improved toilet facilities (% of population).1',
           'Access to flush toilet connected to sewer (% of population).1',
           'Access to flush toilet connected to septic tank (% of population).1',
           'Open defecation (% of population).1',
           "Women's marriage before age 15 (% of women aged 20-24)",
           "Women's marriage before age 18 (% of women aged 20-24)",
           'Average age at first marriage of women (married woman aged 15 to 49)',
           'Child registration (% of children aged under 5)',
           'Prevalence of stunting, height for age (% of children under 5)',
           'Prevalence of wasting, weight for height (% of children under 5)',
           'Prevalence of underweight, weight for age (% of children under 5)',
           'Diarrhea incidence (% of children under 5 who had diarrhea during a 2-week recall period)',
           'Early initiation of breastfeeding (% of recent mothers)',
           'Exclusive breastfeeding (% of children under 6 months)',
           'Children given plain water (% of children under 6 months)',
           'Children given milk (% of children under 6 months)',
           'Children given baby formula (% of children under 6 months)',
           'Children left unattended (% of children under 5)',
           'Toilet use by children (% of children 12-35 months old)',
           'Diarrhea treatment- less than regular liquid (% of children under 5 who had diarrhea episode in the two weeks prior to the survey)',
           'Diarrhea treatment- less than regular food (% of children under 5 who had a diarrhea episode in the two weeks prior to the survey)',
           'Diarrhea treatment- ORS (% of children under 5 who had a diarrhea episode in the two weeks prior to the survey)',
           'Pregnant women receiving prenatal care (% of ever-married women aged 15-49 with a live birth in the 2 years before the survey)',
           'Assisted birth (% of ever-married women aged 15-49 with a live birth in the 2 years before the survey)',
           'Average age at first birth of women',
           'Vitamin A supplementation coverage rate (% of children ages 6-59 months)',
           'Using soap for handwashing (% of population)',
           'Using adequately iodized salt (% of population)',
           'Treating water before drinking (% of population)', 'Immunization, BCG (% of children under 3)', 'Immunization, Polio at birth (% of children under 3)', 'Immunization, Polio-1 (% of children under 3)', 'Immunization, Polio-3 (% of children under 3)', 'Immunization, Penta-1 (% of children under 3)', 'Immunization, Penta-2 (% of children under 3)', 'Immunization, measles (% of children under 3)', 'Immunization, Polio-2 (% of children under 3)', 'Population [Population Census 2017 – Provisional Results]',
           'National poverty rank (N)', 'Provincial poverty rank (N)', 'Access to improved drinking water, excl. piped water (% of population)',
           'Access to improved water within 30 minutes round trip', 'Access to flush toilet connected to sewer (% of population)',
           'Access to flush toilet connected to septic tank (% of population)',
           'Reliance on clean fuels for cooking (% of population)', 'Household child dependency ratio', 'Household senior dependency ratio',
           'Labor force participation rate, male (% of male working age population, 15-64 years old)', 'Employment in agriculture, male (% of male employment)',
           'Employment in industry, male (% of male employment)', 'Employment services, male (% of male employment)',
           'Wage and salaried employment, male (% of male employment)',
           'Self-employment, non-agriculture, male (% of male employment)',
           'Self-employment, agriculture, male (% of male employment)',
           'Unpaid employment, male (% of male employment)',
           'Labor force participation rate, female (% of female working age population, 15-64 years old)',
           'Employment in agriculture, female (% of female employment)',
           'Employment in industry, female (% of female employment)',
           'Employment services, female (% of female employment)',
           'Wage and salaried employment, female (% of female employment)',
           'Self-employment, non-agriculture, female (% of female employment)',
           'Self-employment, agriculture, female (% of female employment)',
           'Unpaid employment, female (% of female employment)',
           'Gross school enrollment, primary school, 6-10 years old (% gross)',
           'Gross school enrollment, middle school, 11-13 years old (% gross)',
           'Gross school enrollment, primary school, 6-10 years old, male (% gross male)',
           'Gross school enrollment, middle school, 11-13 years old, male (% gross male)',
           'Net school enrollment, primary school, 6-10 years old, male (% net male)',
           'Net school enrollment, middle school, 11-13 years old, male (% net male)',
           'Gross school enrollment, primary school, 6-10 years old, female (% gross female)',
           'Gross school enrollment, middle school, 11-13 years old, female (% gross female)',
           'Net school enrollment, primary school, 6-10 years old, female (% net female)',
           'Net school enrollment, middle school, 11-13 years old, female (% net female)',
           'Youth literacy, 15-24 years old, female (% of women aged 15-24)',
           'Youth literacy, 15-24 years old male (% of men aged 15-24)',
           'Adult literacy, 25 or more years old, female (% of women aged 25 or more)',
           'Adult literacy, 25 or more years old, male (% of men aged 25 or more)',
           'Primary completion rate, 14-17 years old, girls (% of girls aged 14-17)',
           'Primary completion rate, 14-17 years old, boys (% of boys aged 14-17)',
           'Gross enrolment rate in primary gender parity index, 6-10 years old',
           'Gross enrolment rate in middle school gender parity index, 11-13 years old'
           ]


# %%
dataManip.drop(to_drop, inplace=True, axis=1)


# %%
dataManip.head()


# %%
#dataManip['Poverty Rate (%)'].replace('', np.nan, inplace=True)


# %%
dataManip1 = dataManip.dropna()


# %%
dataManip1.head(20)


# %%
dataManip1.to_csv(r'data\updatedData.csv', index=False, header=True)


# %%
# Next file: EDA - Data4Pakistan dataset-part 2.ipynb
