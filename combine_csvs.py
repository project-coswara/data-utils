import os
import json
import pandas as pd
from pdb import set_trace as bp

data_path = '../Coswara-Data'
dest_path = 'Combined.csv'
folders = os.listdir(data_path)
df = pd.DataFrame()
for x in folders:
    if not os.path.isdir(os.path.join(data_path,x)):
        continue
    if x=='.git':
        continue
    data = pd.read_csv(os.path.join(data_path,x,x+'.csv'))
    print("Shape : ",data.shape)
    cols = data.columns
    if 'date' in cols:
        data.drop(['date'],axis=1,inplace=True)
    if 'dT' in cols:
        data.drop(['dT'],axis=1,inplace=True)
    if 'fV' in cols:
        data.drop(['fV'],axis=1,inplace=True)
    if 'iF' in cols:
        data.drop(['iF'],axis=1,inplace=True)
    # data_to_append = [data]
    df = df.append(data,ignore_index=True)
df.to_csv(dest_path,index=False)
